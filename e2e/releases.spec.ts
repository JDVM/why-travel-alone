import { test, expect } from './support/test';
import { createUser, logIn } from './support/stack';

// A browser that still has the previous release open asks for page chunks the
// server no longer has. The app reloads once to pick up the new release
// instead of showing the error screen.
test('a page whose chunk is gone after a release reloads and opens', async ({ page }) => {
    const user = await createUser();
    await logIn(page, user);

    let removed = false;
    await page.route(/\/assets\/Invitations-[^/]*\.js$/, (route) => {
        if (!removed) {
            removed = true;
            return route.fulfill({ status: 404, body: 'Not found' });
        }
        return route.continue();
    });

    const reloaded = page.waitForEvent('load');
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Invitations' }).click();
    await reloaded;
    await expect(page.getByRole('heading', { name: 'Invitations', level: 1 })).toBeVisible();
    await expect(page.getByText('Something went wrong')).toHaveCount(0);
    expect(removed).toBe(true);
});
