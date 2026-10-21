import { test, expect } from './support/test';
import { createUser, logIn, logOut, mailTo, linkIn, uniqueEmail, PASSWORD } from './support/stack';

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
        await expect(page.locator('.header__account')).toHaveText('Ana Lima');
        await expect(page.locator('.verify-banner')).toContainText(email);

        await page.goto(linkIn(await mailTo(email, /confirm your email/i)));
        await expect(page.getByText(/your email address is confirmed/i)).toBeVisible();
        // The one-time token doesn't stay in the address bar.
        await expect(page).toHaveURL(/\/verify-email$/);
        await expect(page.locator('.verify-banner')).toHaveCount(0);
    });

    test('pages need a login, and a session survives a reload', async ({ page }) => {
        await page.goto('/Travelers');
        await expect(page).toHaveURL(/\/login$/);
        await expect(page.getByRole('link', { name: 'Invitations' })).toHaveCount(0);

        const user = await createUser({ firstName: 'Reload' });
        await page.getByLabel('Email').fill(user.email);
        await page.getByLabel('Password').fill('not-the-password');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page.locator('.auth__error')).toHaveText(/invalid email or password/i);

        await logIn(page, user);
        await expect(page.locator('.header__account')).toHaveText(user.name);
        await page.reload();
        await expect(page.locator('.header__account')).toHaveText(user.name);

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
