import { test as base, expect } from '@playwright/test';

// The browser's console must stay free of errors: a Content-Security-Policy
// violation, a crashed component or a failed request all fail the test.
// Expected API refusals (a wrong password, a 403 for an unverified account…)
// log "Failed to load resource" errors, and some pages log the request error
// itself, so those status codes are allowed.
const EXPECTED = /status (of|code) (400|401|403|404|409|429)/;

export const test = base.extend<{ consoleErrors: string[] }>({
    consoleErrors: [
        async ({ page }, use) => {
            const errors: string[] = [];
            page.on('console', (message) => {
                if (message.type() === 'error' && !EXPECTED.test(message.text())) {
                    errors.push(message.text());
                }
            });
            page.on('pageerror', (error) => errors.push(error.message));
            await use(errors);
            expect(errors, 'unexpected errors in the browser console').toEqual([]);
        },
        { auto: true },
    ],
});

export { expect };
