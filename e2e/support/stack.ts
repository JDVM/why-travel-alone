import { APIRequestContext, expect, Locator, Page, request as playwrightRequest } from '@playwright/test';
import { randomUUID } from 'crypto';

// Helpers that talk to the running stack directly: the API (to set up users
// quickly) and Mailpit (to read the emails the API sends).

export const API_URL = process.env.E2E_API_URL || 'http://localhost:8080';
export const MAILPIT_URL = process.env.E2E_MAILPIT_URL || 'http://localhost:8025';
export const PASSWORD = 'e2e-password-123';

export interface TestUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    name: string;
    accountId: number;
    travelerId: number;
}

let counter = 0;

// A unique client address per user. The e2e stack runs the API with
// TRUST_PROXY=1, so each test user counts against the rate limits as its own
// client, as real users behind a load balancer do.
function clientAddress(): string {
    counter += 1;
    return `10.${Math.floor(Math.random() * 250)}.${Math.floor(counter / 250)}.${counter % 250}`;
}

export const APP_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

// Requests that change something must come from the web app's origin (the
// API's CSRF check), and this client keeps the session cookie signup sets.
async function api(): Promise<APIRequestContext> {
    return playwrightRequest.newContext({ baseURL: API_URL, extraHTTPHeaders: { Origin: APP_URL } });
}

export function uniqueEmail(prefix = 'e2e'): string {
    return `${prefix}-${randomUUID()}@example.com`;
}

// The newest email to `to` whose subject matches, waiting for it to arrive.
export async function mailTo(to: string, subject: RegExp, { after = 0 } = {}): Promise<{ text: string; subject: string }> {
    const context = await api();
    try {
        for (let attempt = 0; attempt < 50; attempt += 1) {
            const search = await context.get(`${MAILPIT_URL}/api/v1/search`, { params: { query: `to:"${to}"` } });
            const { messages } = await search.json();
            const match = messages
                .filter((m: { Subject: string; Created: string }) => subject.test(m.Subject) && Date.parse(m.Created) > after)
                .sort((a: { Created: string }, b: { Created: string }) => Date.parse(b.Created) - Date.parse(a.Created))[0];
            if (match) {
                const message = await (await context.get(`${MAILPIT_URL}/api/v1/message/${match.ID}`)).json();
                return { text: message.Text, subject: message.Subject };
            }
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
    } finally {
        await context.dispose();
    }
    throw new Error(`No email to ${to} matching ${subject}`);
}

// The app link (with its token) in an email, made relative to the app.
export function linkIn(mail: { text: string }): string {
    const url = mail.text.match(/https?:\/\/\S+?\?token=[\w-]+/);
    if (!url) {
        throw new Error(`No link in email: ${mail.text}`);
    }
    const parsed = new URL(url[0]);
    return parsed.pathname + parsed.search;
}

// Signs a user up through the API, and by default confirms their email by
// following the link Mailpit received.
export async function createUser({
    verified = true,
    firstName = 'Test',
    lastName = `User${Math.floor(Math.random() * 1e6)}`,
} = {}): Promise<TestUser> {
    const email = uniqueEmail();
    const context = await api();
    try {
        const response = await context.post('/auth/register', {
            headers: { 'X-Forwarded-For': clientAddress() },
            data: { email, password: PASSWORD, first_name: firstName, last_name: lastName, accept_terms: true },
        });
        expect(response.status(), await response.text()).toBe(201);
        const { account } = await response.json();
        if (verified) {
            const token = new URL(`http://x${linkIn(await mailTo(email, /confirm your email/i))}`).searchParams.get('token');
            const verify = await context.post('/auth/verify-email', { data: { token } });
            expect(verify.status()).toBe(200);
        }
        return {
            email,
            password: PASSWORD,
            firstName,
            lastName,
            name: `${firstName} ${lastName}`,
            accountId: account.id,
            travelerId: account.traveler.user_id,
        };
    } finally {
        await context.dispose();
    }
}

export async function logIn(page: Page, user: { email: string; password: string }) {
    await page.goto('/login');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForURL('**/Trips');
}

// The app sends the logout request without waiting for it, so wait for the
// API's answer too: until then the session still works on the server.
export async function logOut(page: Page) {
    const loggedOut = page.waitForResponse((response) => response.url().endsWith('/auth/logout'));
    await page.getByRole('button', { name: 'Account' }).click();
    await page.getByRole('menuitem', { name: 'Log Out' }).click();
    await page.waitForURL('**/login');
    await loggedOut;
}

// The signed-in account's name in the header.
export function accountName(page: Page): Locator {
    return page.getByTestId('account-name');
}

// The reminder to confirm your email address.
export function verifyBanner(page: Page): Locator {
    return page.getByRole('status').filter({ hasText: /confirm your email address/i });
}

// A card in one of the app's card lists (trips, travelers, invitations).
export function card(page: Page, text: string): Locator {
    return page.getByRole('listitem').filter({ hasText: text });
}

// Picks an option from an autocomplete (e.g. Destination): types the search
// and clicks the first match, returning its text.
export async function pickFrom(page: Page, label: string, search: string): Promise<string> {
    await page.getByRole('combobox', { name: label }).fill(search);
    const option = page.getByRole('listbox').getByRole('option').first();
    const text = (await option.textContent()) as string;
    await option.click();
    return text;
}

// Creates a trip through the UI and returns its id.
export async function createTrip(page: Page, name: string, { kidFriendly = false, destination = 'a' } = {}): Promise<string> {
    await page.goto('/new');
    await page.getByRole('textbox', { name: 'Trip Name' }).fill(name);
    await page.getByLabel('Trip Length').fill('5');
    await pickFrom(page, 'Destination', destination);
    if (kidFriendly) {
        await page.getByLabel('Kid Friendly Trip').check();
    }
    await page.getByRole('button', { name: 'Create Trip' }).click();
    await page.waitForURL('**/Trips');
    await card(page, name).getByRole('link').click();
    await page.waitForURL(/\/Trips\/\d+$/);
    return page.url().split('/').pop() as string;
}
