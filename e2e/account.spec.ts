import { readFile } from 'fs/promises';
import { test, expect } from './support/test';
import { createUser, logIn, mailTo, linkIn, pickFrom } from './support/stack';

test('special considerations are saved only with consent, which clearing withdraws', async ({ page }) => {
    const user = await createUser();
    await logIn(page, user);
    await page.getByRole('link', { name: 'Profile' }).click();

    const field = page.getByRole('textbox', { name: 'Special considerations' });
    const consent = page.getByRole('checkbox', { name: /i agree to why travel alone storing/i });
    await field.fill('Hearing impairment');
    await page.getByRole('button', { name: 'Save profile' }).click();
    await expect(page.getByText('Profile saved.')).toHaveCount(0);

    await consent.check();
    await page.getByRole('button', { name: 'Save profile' }).click();
    await expect(page.getByText('Profile saved.')).toBeVisible();
    await page.reload();
    await expect(consent).toBeChecked();

    await field.fill('');
    await page.getByRole('button', { name: 'Save profile' }).click();
    await expect(page.getByText('Profile saved.')).toBeVisible();
    await page.reload();
    await expect(consent).not.toBeChecked();
});

test('a user picks preferred destinations, which show on their traveler profile', async ({ page }) => {
    const user = await createUser();
    await logIn(page, user);
    await page.getByRole('link', { name: 'Profile' }).click();

    const chosen: string[] = [];
    for (const search of ['a', 'e']) {
        chosen.push(await pickFrom(page, 'Preferred destinations', search));
    }
    await page.getByRole('button', { name: 'Save profile' }).click();
    await expect(page.getByText('Profile saved.')).toBeVisible();

    await page.goto(`/Travelers/${user.travelerId}`);
    for (const place of chosen) {
        await expect(page.getByText(place, { exact: true })).toBeVisible();
    }
});

test('a user downloads their data, then deletes their account', async ({ page }) => {
    const user = await createUser({ firstName: 'Leaving' });
    await logIn(page, user);
    await page.getByRole('link', { name: 'Profile' }).click();

    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('button', { name: 'Download my data' }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^why-travel-alone-data-\d{4}-\d{2}-\d{2}\.json$/);
    const data = JSON.parse(await readFile((await download.path()) as string, 'utf8'));
    expect(data.account.email).toBe(user.email);
    expect(data.profile.first_name).toBe('Leaving');
    expect(data.account).not.toHaveProperty('password_hash');

    await page.getByRole('button', { name: 'Delete my account' }).click();
    await page.getByLabel(/enter your password/i).fill('not-the-password');
    await page.getByRole('button', { name: 'Delete my account permanently' }).click();
    await expect(page.getByText('Incorrect password')).toBeVisible();

    await page.getByLabel(/enter your password/i).fill(user.password);
    await page.getByRole('button', { name: 'Delete my account permanently' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByText(/your account and its data have been deleted/i)).toBeVisible();

    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page.getByRole('alert')).toHaveText(/invalid email or password/i);
});

test('a forgotten password is reset by email, signing out other sessions', async ({ page, browser }) => {
    const user = await createUser();

    // Signed in elsewhere, e.g. on another device.
    const otherDevice = await browser.newPage();
    await logIn(otherDevice, user);

    await page.goto('/login');
    await page.getByRole('link', { name: 'Forgot your password?' }).click();
    // The login page has an Email field too: wait for the reset page first.
    await expect(page.getByRole('heading', { name: 'Reset your password' })).toBeVisible();
    await page.getByLabel('Email').fill(user.email);
    await page.getByRole('button', { name: 'Send reset link' }).click();
    await expect(page.getByText(/if an account uses/i)).toBeVisible();

    const link = linkIn(await mailTo(user.email, /reset your password/i));
    await page.goto(link);
    await page.getByLabel('New password', { exact: true }).fill('a-brand-new-password');
    await page.getByLabel('Confirm new password').fill('a-brand-new-password');
    await page.getByRole('button', { name: 'Change password' }).click();
    await expect(page.getByText(/your password has been changed/i)).toBeVisible();
    await mailTo(user.email, /password was changed/i);

    // The other device is signed out on its next request.
    await otherDevice.goto('/Trips');
    await expect(otherDevice).toHaveURL(/\/login$/);
    await otherDevice.close();

    await logIn(page, { email: user.email, password: 'a-brand-new-password' });

    // The emailed link works only once.
    await page.goto(link);
    await page.getByLabel('New password', { exact: true }).fill('a-third-password');
    await page.getByLabel('Confirm new password').fill('a-third-password');
    await page.getByRole('button', { name: 'Change password' }).click();
    await expect(page.getByText(/invalid or has expired/i)).toBeVisible();
});
