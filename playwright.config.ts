import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    use: {
        baseURL: 'http://localhost:3000', // Adjust if your dev server runs elsewhere
        headless: true,
    },
});