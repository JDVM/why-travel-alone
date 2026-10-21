import { defineConfig, devices } from '@playwright/test';

// End-to-end tests: a real browser against the whole stack (this app, the API,
// MySQL and Mailpit for emails). Start the stack from the API repository:
//
//   cd ../why-travel-alone-api
//   APP_SECRET=$(openssl rand -hex 32) TRUST_PROXY=1 docker compose --profile web up -d --build
//
// then run `npm run e2e` here. CI does the same on every pull request.
export default defineConfig({
    testDir: './e2e',
    // The tests share one database and one API, so run them one at a time.
    workers: 1,
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: 0,
    timeout: 60_000,
    expect: { timeout: 10_000 },
    reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
    use: {
        baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        // A browser installed some other way (CI runs `npx playwright install`).
        launchOptions: { executablePath: process.env.E2E_CHROMIUM_PATH || undefined },
    },
    projects: [
        { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
        // A phone-sized run of the tests tagged @mobile.
        { name: 'phone', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
    ],
});
