
import { test, expect } from '@playwright/test';

test('homepage should show company name', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Employees of Bini corporation/i)).toBeVisible();
});