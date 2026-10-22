import { Locator, Page } from '@playwright/test';
import { test, expect } from './support/test';
import { card, createUser, createTrip, logIn, logOut, TestUser, verifyBanner } from './support/stack';

// A person on the trip page's Travelers or Invitations list.
function onTrip(page: Page, section: 'Travelers' | 'Invitations', name: string): Locator {
    return page.getByRole('region', { name: section }).getByRole('listitem').filter({ hasText: name });
}

async function invite(page: Page, tripId: string, guest: TestUser) {
    await page.goto(`/Travelers/${guest.travelerId}`);
    // selectOption waits for the trip to appear in the list.
    await page.getByLabel('Invite to one of your trips').selectOption(tripId);
    await page.getByRole('button', { name: 'Send invite' }).click();
}

test('an owner invites a traveler, who accepts, sees the member view, and leaves', async ({ page }) => {
    const owner = await createUser({ firstName: 'Olive' });
    const guest = await createUser({ firstName: 'Gus' });

    await logIn(page, owner);
    const tripName = `Shared ${Date.now()}`;
    const tripId = await createTrip(page, tripName);

    await invite(page, tripId, guest);
    await expect(page.getByRole('alert')).toHaveText(/invitation sent/i);
    await page.getByRole('button', { name: 'Send invite' }).click();
    await expect(page.getByRole('alert')).toHaveText(/already been invited/i);

    await page.goto(`/Trips/${tripId}`);
    await expect(onTrip(page, 'Invitations', guest.name)).toContainText('Waiting for a reply');
    await logOut(page);

    // The guest can't see the trip until they accept.
    await logIn(page, guest);
    await expect(card(page, tripName)).toHaveCount(0);
    await page.getByRole('link', { name: 'Invitations' }).click();
    const invitation = card(page, tripName);
    await expect(invitation).toContainText(`Invited by ${owner.name}`);
    await invitation.getByRole('button', { name: 'Accept' }).click();
    await expect(page).toHaveURL(new RegExp(`/Trips/${tripId}$`));

    // Members can view and leave, but not edit or remove anyone, and they
    // don't see the owner's private details.
    await expect(page.getByRole('button', { name: 'Leave trip' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Edit' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Remove' })).toHaveCount(0);
    const ownerCard = onTrip(page, 'Travelers', owner.name);
    const ownCard = onTrip(page, 'Travelers', guest.name);
    await expect(ownerCard.getByText('Kids')).toHaveCount(0);
    await expect(ownCard.getByText('Kids')).toHaveCount(1);

    await page.getByRole('link', { name: 'Trips' }).click();
    await expect(card(page, tripName).getByText("You're a traveler")).toBeVisible();

    await card(page, tripName).getByRole('link').click();
    await page.getByRole('button', { name: 'Leave trip' }).click();
    await expect(page).toHaveURL(/\/Trips$/);
    await expect(card(page, tripName)).toHaveCount(0);
    await logOut(page);

    // Leaving counts as declining.
    await logIn(page, owner);
    await page.goto(`/Trips/${tripId}`);
    await expect(onTrip(page, 'Invitations', guest.name)).toContainText('Declined');
    await expect(onTrip(page, 'Travelers', guest.name)).toHaveCount(0);
});

test('an owner sees members\' private details, cancels invitations and removes travelers', async ({ page }) => {
    const owner = await createUser();
    const member = await createUser({ firstName: 'Mem' });
    const pending = await createUser({ firstName: 'Pen' });

    await logIn(page, owner);
    const tripName = `Managed ${Date.now()}`;
    const tripId = await createTrip(page, tripName);
    await invite(page, tripId, member);
    await invite(page, tripId, pending);
    await logOut(page);

    await logIn(page, member);
    await page.getByRole('link', { name: 'Invitations' }).click();
    await card(page, tripName).getByRole('button', { name: 'Accept' }).click();
    await expect(page).toHaveURL(new RegExp(`/Trips/${tripId}$`));
    await logOut(page);

    await logIn(page, owner);
    await page.goto(`/Trips/${tripId}`);
    const memberCard = onTrip(page, 'Travelers', member.name);
    await expect(memberCard.getByText('Kids')).toHaveCount(1);

    const pendingInvite = onTrip(page, 'Invitations', pending.name);
    await pendingInvite.getByRole('button', { name: 'Cancel' }).click();
    await expect(pendingInvite).toHaveCount(0);

    await memberCard.getByRole('button', { name: 'Remove' }).click();
    await expect(memberCard).toHaveCount(0);
    await expect(page).toHaveURL(new RegExp(`/Trips/${tripId}$`));
});

test('inviting and accepting need a confirmed email address', async ({ page }) => {
    const unconfirmed = await createUser({ verified: false });
    const other = await createUser();

    await logIn(page, unconfirmed);
    await expect(verifyBanner(page)).toBeVisible();
    const tripId = await createTrip(page, `Unconfirmed ${Date.now()}`);
    await invite(page, tripId, other);
    await expect(page.getByRole('alert')).toHaveText(/confirm your email address first/i);
});

test("the directory hides strangers' private details", async ({ page }) => {
    const viewer = await createUser({ firstName: 'Viewer' });
    const stranger = await createUser({ firstName: 'Stranger' });

    await logIn(page, viewer);
    await page.getByRole('link', { name: 'Travelers' }).click();
    const strangerCard = card(page, stranger.name);
    const ownCard = card(page, viewer.name);
    await expect(strangerCard).toBeVisible();
    await expect(strangerCard.getByText('Special Considerations')).toHaveCount(0);
    await expect(ownCard.getByText('Special Considerations')).toHaveCount(1);
});
