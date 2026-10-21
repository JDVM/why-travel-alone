import { test, expect } from './support/test';
import { createUser, createTrip, logIn } from './support/stack';

test('an owner creates, edits and deletes a trip', async ({ page }) => {
    const owner = await createUser({ firstName: 'Owner' });
    await logIn(page, owner);
    await expect(page.locator('.trips__empty')).toBeVisible();

    const name = `Trip ${Date.now()}`;
    const tripId = await createTrip(page, name, { kidFriendly: true });
    const destination = await page.locator('.trip-details__text').nth(2).textContent();

    // The owner is the trip's first traveler, without a Remove button.
    await expect(page.locator('.small-traveler-card__container')).toHaveCount(1);
    await expect(page.locator('.small-traveler-card__container')).toContainText(owner.name);
    await expect(page.locator('.small-traveler-card__button')).toHaveCount(0);

    // The edit form starts from the trip's current values.
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByLabel('Trip Name')).toHaveValue(name);
    await expect(page.getByLabel('Kid Friendly Trip')).toBeChecked();
    await expect(page.locator('#destination-select option:checked')).toHaveText(destination as string);
    await page.getByLabel('Trip Length').fill('9');
    await page.getByRole('button', { name: 'Update Trip' }).click();
    await expect(page).toHaveURL(/\/Trips$/);

    await page.goto(`/Trips/${tripId}`);
    await expect(page.getByText('9 days')).toBeVisible();

    await page.goto(`/Trips/${tripId}/edit`);
    await expect(page.getByLabel('Trip Name')).toHaveValue(name);
    await page.getByRole('button', { name: 'Delete Trip' }).click();
    await expect(page).toHaveURL(/\/Trips$/);
    await expect(page.locator('.trips__empty')).toBeVisible();
});

test("another account can't open someone else's trip", async ({ page }) => {
    const owner = await createUser();
    await logIn(page, owner);
    const tripId = await createTrip(page, `Private ${Date.now()}`);
    await page.getByRole('button', { name: 'Log Out' }).click();

    const stranger = await createUser();
    await logIn(page, stranger);
    await page.goto(`/Trips/${tripId}`);
    await expect(page.getByText(/not found/i)).toBeVisible();
    await expect(page.locator('.small-traveler-card__container')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Edit' })).toHaveCount(0);
});
