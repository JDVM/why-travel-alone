import AxeBuilder from '@axe-core/playwright';
import { Page } from '@playwright/test';
import { test, expect } from './support/test';
import { createTrip, createUser, logIn, TestUser } from './support/stack';

// Automated accessibility checks (axe) against WCAG 2.1 A and AA on every
// page. They catch problems like low colour contrast, missing labels and
// broken ARIA; a person still has to check keyboard use and screen-reader
// flow by hand.
const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

async function expectAccessible(page: Page, name: string) {
    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    const problems = results.violations.map(
        (violation) =>
            `${violation.id} (${violation.impact}): ${violation.help}\n` +
            violation.nodes.map((node) => `    ${node.target.join(' ')}: ${node.failureSummary}`).join('\n')
    );
    expect(problems, `Accessibility problems on ${name}`).toEqual([]);
}

test.describe('accessibility @mobile', () => {
    test('pages for signed-out visitors', async ({ page }) => {
        for (const [path, heading] of [
            ['/', 'Find your people. Plan the trip together.'],
            ['/login', 'Log In'],
            ['/register', 'Create Account'],
            ['/forgot-password', 'Reset your password'],
            ['/privacy', 'Privacy Policy'],
            ['/terms', 'Terms of Service'],
        ]) {
            await page.goto(path);
            await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();
            await expectAccessible(page, path);
        }
    });

    test('pages for signed-in travelers', async ({ page }) => {
        const owner = await createUser({ firstName: 'Ada' });
        const guest: TestUser = await createUser({ firstName: 'Bea' });
        await logIn(page, owner);
        const tripId = await createTrip(page, `Accessible ${Date.now()}`, { kidFriendly: true });

        const pages: [string, string][] = [
            ['/Trips', 'Your trips'],
            [`/Trips/${tripId}`, 'Trip Details'],
            [`/Trips/${tripId}/edit`, 'Edit Trip Details'],
            ['/new', 'Add Trip Details'],
            ['/Travelers', 'Travelers'],
            [`/Travelers/${guest.travelerId}`, 'Traveler Profile'],
            ['/invitations', 'Invitations'],
            ['/profile', 'Your traveler profile'],
        ];
        for (const [path, heading] of pages) {
            await page.goto(path);
            await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();
            // Let the page's data load before checking it.
            await page.waitForLoadState('networkidle');
            await expectAccessible(page, path);
        }
    });
});
