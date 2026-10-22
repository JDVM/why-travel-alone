import { test, expect } from './support/test';
import { createUser, createTrip, logIn, logOut } from './support/stack';

const NO_TRIPS = /you don't have any trips yet/i;

test('an owner creates, edits and deletes a trip', async ({ page }) => {
    const owner = await createUser({ firstName: 'Owner' });
    await logIn(page, owner);
    await expect(page.getByText(NO_TRIPS)).toBeVisible();

    const name = `Trip ${Date.now()}`;
    const tripId = await createTrip(page, name, { kidFriendly: true });
    const destination = (await page.getByRole('group', { name: 'Destination' }).getByRole('paragraph').textContent()) as string;

    // The owner is the trip's first traveler, without a Remove button.
    const travelers = page.getByRole('region', { name: 'Travelers' }).getByRole('listitem');
    await expect(travelers).toHaveCount(1);
    await expect(travelers).toContainText(owner.name);
    await expect(page.getByRole('button', { name: 'Remove' })).toHaveCount(0);

    // The edit form starts from the trip's current values.
    await page.getByRole('link', { name: 'Edit' }).click();
    await expect(page.getByRole('heading', { name: 'Edit Trip Details', level: 1 })).toBeVisible();
    // The text box: the details page also has a "Trip Name" group.
    const tripName = page.getByRole('textbox', { name: 'Trip Name' });
    await expect(tripName).toHaveValue(name);
    await expect(page.getByLabel('Kid Friendly Trip')).toBeChecked();
    await expect(page.getByRole('combobox', { name: 'Destination' })).toHaveValue(destination);
    await page.getByLabel('Trip Length').fill('9');
    await page.getByRole('button', { name: 'Update Trip' }).click();
    await expect(page).toHaveURL(/\/Trips$/);

    await page.goto(`/Trips/${tripId}`);
    await expect(page.getByText('9 days')).toBeVisible();

    await page.goto(`/Trips/${tripId}/edit`);
    await expect(tripName).toHaveValue(name);
    await page.getByRole('button', { name: 'Delete Trip' }).click();
    await expect(page).toHaveURL(/\/Trips$/);
    await expect(page.getByText(NO_TRIPS)).toBeVisible();
});

test("another account can't open someone else's trip", async ({ page }) => {
    const owner = await createUser();
    await logIn(page, owner);
    const tripId = await createTrip(page, `Private ${Date.now()}`);
    await logOut(page);

    const stranger = await createUser();
    await logIn(page, stranger);
    await page.goto(`/Trips/${tripId}`);
    await expect(page.getByText(/not found/i)).toBeVisible();
    await expect(page.getByRole('region', { name: 'Travelers' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Edit' })).toHaveCount(0);
});
