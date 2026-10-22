import { request } from '@playwright/test';
import { test, expect } from './support/test';
import { API_URL, accountName, createUser, logIn, logOut, mailTo, linkIn, uniqueEmail, verifyBanner, PASSWORD } from './support/stack';

test.describe('signing up and logging in', () => {
    test('a visitor signs up, accepts the terms, and confirms their email @mobile', async ({ page }) => {
        const email = uniqueEmail('signup');
        await page.goto('/register');
        await page.getByLabel('First name').fill('Ana');
        await page.getByLabel('Last name').fill('Lima');
        await page.getByLabel('Email').fill(email);
        await page.getByLabel('Password').fill(PASSWORD);

        // The terms must be accepted.
        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page).toHaveURL(/\/register$/);
        await page.getByRole('checkbox', { name: /i agree to the terms/i }).check();
        await page.getByRole('button', { name: 'Register' }).click();

        // New users land on their profile, reminded to confirm their email.
        await expect(page).toHaveURL(/\/profile$/);
        await expect(accountName(page)).toHaveText('Ana Lima');
        await expect(verifyBanner(page)).toContainText(email);

        await page.goto(linkIn(await mailTo(email, /confirm your email/i)));
        await expect(page.getByText(/your email address is confirmed/i)).toBeVisible();
        // The one-time token doesn't stay in the address bar.
        await expect(page).toHaveURL(/\/verify-email$/);
        await expect(verifyBanner(page)).toHaveCount(0);
    });

    test('pages need a login, and a session survives a reload', async ({ page }) => {
        await page.goto('/Travelers');
        await expect(page).toHaveURL(/\/login$/);
        await expect(page.getByRole('link', { name: 'Invitations' })).toHaveCount(0);

        const user = await createUser({ firstName: 'Reload' });
        await page.getByLabel('Email').fill(user.email);
        await page.getByLabel('Password').fill('not-the-password');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page.getByRole('alert')).toHaveText(/invalid email or password/i);

        await logIn(page, user);
        await expect(accountName(page)).toHaveText(user.name);
        await page.reload();
        await expect(accountName(page)).toHaveText(user.name);

        await logOut(page);
        await page.goto('/Trips');
        await expect(page).toHaveURL(/\/login$/);
    });

    test('the legal pages are public and linked from every page @mobile', async ({ page }) => {
        await page.goto('/login');
        await page.getByRole('navigation', { name: 'Legal' }).getByRole('link', { name: 'Privacy Policy' }).click();
        await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();
        await page.getByRole('navigation', { name: 'Legal' }).getByRole('link', { name: 'Terms of Service' }).click();
        await expect(page.getByRole('heading', { name: 'Terms of Service', level: 1 })).toBeVisible();

        // Nothing overflows sideways on a phone.
        const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        expect(overflows).toBe(false);
    });
});

test.describe('sessions', () => {
    test('a login is an httpOnly cookie that scripts on the page cannot read', async ({ page, context }) => {
        const user = await createUser();
        await logIn(page, user);

        expect(await page.evaluate(() => ({ ...localStorage }))).toEqual({});
        expect(await page.evaluate(() => document.cookie)).not.toContain('wta_session');
        const session = (await context.cookies(API_URL)).find((cookie) => cookie.name === 'wta_session');
        expect(session).toMatchObject({ httpOnly: true, secure: true, sameSite: 'Lax' });

        // Logging out ends the session on the server, not just in this browser.
        await logOut(page);
        const replay = await request.newContext({ baseURL: API_URL });
        const me = await replay.get('/auth/me', { headers: { Cookie: `wta_session=${session!.value}` } });
        expect(me.status()).toBe(401);
        await replay.dispose();
    });

    test('a user signs out their other devices from the profile page', async ({ page, browser }) => {
        const user = await createUser();
        const phone = await browser.newPage();
        await logIn(phone, user);
        await logIn(page, user);

        await page.getByRole('link', { name: 'Profile' }).click();
        // This browser, the "phone", and the signup createUser did through the API.
        const devices = page.getByRole('region', { name: 'Signed-in devices' }).getByRole('listitem');
        await expect(devices).toHaveCount(3);
        await expect(devices.filter({ hasText: '(this device)' })).toHaveCount(1);
        await page.getByRole('button', { name: 'Sign out other devices' }).click();
        await expect(page.getByText('Signed out 2 other devices.')).toBeVisible();
        await expect(devices).toHaveCount(1);

        await phone.goto('/Trips');
        await expect(phone).toHaveURL(/\/login$/);
        await phone.close();

        // This device is still signed in.
        await page.reload();
        await expect(accountName(page)).toHaveText(user.name);
    });
});

test('on a phone, the signed-in links are in a menu that closes after navigating @mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Phones only');
    const user = await createUser();
    await logIn(page, user);

    const menu = page.getByRole('button', { name: 'Menu' });
    const trips = page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Trips' });
    await expect(trips).toBeHidden();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');

    await menu.click();
    await expect(page.getByRole('button', { name: 'Close' })).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/\/profile$/);
    await expect(trips).toBeHidden();

    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflows).toBe(false);
});
