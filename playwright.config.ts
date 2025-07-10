import { defineConfig, devices } from '@playwright/test';
const _apiLocalhost = 'http://localhost:8080'
const _webLocalhost = 'http://localhost:3000'
const date = new Date().toLocaleString('en-AU', { hour12: false })

export default defineConfig({
    testDir: './tests',
    timeout: 30 * 1000,
    expect: { timeout: 20 * 1000 },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,

    workers: process.env.CI ? 2 : undefined,
    reporter: [
        ['list'],
        [
            'monocart-reporter',
            {
                name: `QE Regress Test Report for ${date}`,
                outputFile: 'test-results/report.html',
                reportDir: 'test-results',
            },
        ],
    ],
    projects: [
        {
            name: 'api',
            testDir: './tests/api', // Adjust the path to your API tests
            use: {
                baseURL: _apiLocalhost, // Adjust if your API server runs elsewhere
            }
        },
        {
            name: 'web',
            testDir: './tests/ui', // Adjust the path to your UI tests  
            use: {

                baseURL: _webLocalhost, // Adjust if your web server runs elsewhere
                ...devices['Desktop Chrome'],
            }
        },
    ],

    webServer: {
        command: 'npm run start:all',
        url: _webLocalhost,
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000, // Increased timeout for the web server to start
    },
    // globalSetup: require.resolve('./tests/global-setup'),
    // globalTeardown: require.resolve('./tests/global-teardown'),
    use: {
        trace: 'on-first-retry', // Enable tracing for debugging
        video: 'retain-on-failure', // Record video only on failure
        screenshot: 'only-on-failure', // Take screenshots only on failure
        // Add any other global settings you need
        locale: 'en-US', // Set the locale for tests
        timezoneId: 'Australia/Sydney', // Set the timezone for tests
        // storageState: 'tests/storageState.json', // Use a storage state file for authentication
    },

});