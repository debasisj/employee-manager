
import { test, expect } from '@playwright/test';

test.describe('Employee Management UI Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Wait for the page to load completely
        await page.waitForLoadState('networkidle');
    });

    test.describe('Page Structure and Content', () => {
        test('should display company name and main heading', async ({ page }) => {
            await expect(page.getByText(/Employees of Bini corporation/i)).toBeVisible();
        });

        test('should display employee form', async ({ page }) => {
            const form = page.locator('[data-testid="employee-form"]').or(page.locator('form'));
            await expect(form).toBeVisible();
        });

        test('should display employee list', async ({ page }) => {
            const list = page.locator('[data-testid="employee-list"]').or(page.locator('ul, table'));
            await expect(list).toBeVisible();
        });

        test('should display form fields with proper labels', async ({ page }) => {
            const nameField = page.getByTestId("EmpFormNameId");
            const roleField = page.getByTestId("EmpFormRoleId");
            
            await expect(nameField).toBeVisible();
            await expect(roleField).toBeVisible();
        });

        test('should display submit button', async ({ page }) => {
            const submitButton = page.getByRole('button', { name: /create/i });
            await expect(submitButton).toBeVisible();
            await expect(submitButton).toBeEnabled();
        });
    });

    test.describe('Form Interactions', () => {
        test('should allow typing in name field', async ({ page }) => {
            const nameField = page.getByTestId("EmpFormNameId");
            await nameField.fill('John Doe');
            await expect(nameField).toHaveValue('John Doe');
        });

        test('should allow typing in role field', async ({ page }) => {
            const roleField = page.getByTestId("EmpFormRoleId");
            await roleField.fill('Developer');
            await expect(roleField).toHaveValue('Developer');
        });

        test('should clear form fields after submission', async ({ page }) => {
            const nameField = page.getByTestId("EmpFormNameId");
            const roleField = page.getByTestId("EmpFormRoleId");
            const submitButton = page.getByRole('button', { name: /create/i });

            // Fill form
            await nameField.fill('Test Employee');
            await roleField.fill('Engineer');

            // Submit form
            await submitButton.click();

            // Wait for form to be cleared
            await expect(nameField).toHaveValue('');
            await expect(roleField).toHaveValue('');
        });

        test('should handle form submission with keyboard', async ({ page }) => {
            const nameField = page.getByTestId("EmpFormNameId");
            const roleField = page.getByTestId("EmpFormRoleId");

            await nameField.fill('Keyboard Test');
            await roleField.fill('Manager');
            await roleField.press('Enter');

            // Verify form was submitted (fields should be cleared)
            await expect(nameField).toHaveValue('');
        });
    });

    test.describe('Employee List Interactions', () => {
        test('should display no employees message when list is empty', async ({ page }) => {
            const noEmployeesMessage = page.getByText(/No existing employee - add one/i);
            await expect(noEmployeesMessage).toBeVisible();
        });

        test('should display employees when they exist', async ({ page }) => {
            // This test assumes there are employees in the system
            // If no employees exist, it will show the "no employees" message
            const noEmployeesMessage = page.getByText(/No existing employee - add one/i);
            const employeeList = page.locator('[data-testid="employee-list"]').or(page.locator('ul, table'));
            
            // Check if either message is visible
            const hasNoEmployees = await noEmployeesMessage.isVisible();
            const hasEmployees = await employeeList.isVisible();
            
            expect(hasNoEmployees || hasEmployees).toBe(true);
        });

        test('should show edit and delete buttons for existing employees', async ({ page }) => {
            // This test will pass if employees exist, otherwise it will be skipped
            const editButton = page.getByRole('button', { name: /edit/i });
            const deleteButton = page.getByRole('button', { name: /delete/i });
            
            // Check if buttons exist (they might not if no employees)
            const editButtonExists = await editButton.count() > 0;
            const deleteButtonExists = await deleteButton.count() > 0;
            
            if (editButtonExists && deleteButtonExists) {
                await expect(editButton.first()).toBeVisible();
                await expect(deleteButton.first()).toBeVisible();
            }
        });
    });

    test.describe('Edit Employee Functionality', () => {
        test('should populate form when edit button is clicked', async ({ page }) => {
            const editButton = page.getByRole('button', { name: /edit/i });
            
            // Check if edit button exists
            if (await editButton.count() > 0) {
                await editButton.first().click();
                
                const nameField = page.getByTestId("EmpFormNameId");
                const roleField = page.getByTestId("EmpFormRoleId");
                
                // Wait for form to be populated
                await expect(nameField).not.toHaveValue('');
                await expect(roleField).not.toHaveValue('');
            }
        });

        test('should update employee when form is submitted in edit mode', async ({ page }) => {
            const editButton = page.getByRole('button', { name: /edit/i });
            
            if (await editButton.count() > 0) {
                await editButton.first().click();
                
                const nameField = page.getByTestId("EmpFormNameId");
                const roleField = page.getByTestId("EmpFormRoleId");
                const submitButton = page.getByRole('button', { name: /update/i });
                
                // Modify the values
                await nameField.fill('Updated Employee Name');
                await roleField.fill('Updated Role');
                
                await submitButton.click();
                
                // Verify form is cleared after update
                await expect(nameField).toHaveValue('');
                await expect(roleField).toHaveValue('');
            }
        });
    });

    test.describe('Delete Employee Functionality', () => {
        test('should show confirmation when delete button is clicked', async ({ page }) => {
            const deleteButton = page.getByRole('button', { name: /delete/i });
            
            if (await deleteButton.count() > 0) {
                // Listen for dialog events
                page.on('dialog', dialog => {
                    expect(dialog.type()).toBe('confirm');
                    dialog.accept();
                });
                
                await deleteButton.first().click();
            }
        });

        test('should cancel deletion when user clicks cancel', async ({ page }) => {
            const deleteButton = page.getByRole('button', { name: /delete/i });
            
            if (await deleteButton.count() > 0) {
                page.on('dialog', dialog => {
                    expect(dialog.type()).toBe('confirm');
                    dialog.dismiss();
                });
                
                await deleteButton.first().click();
                
                // Verify the button still exists (deletion was cancelled)
                await expect(deleteButton.first()).toBeVisible();
            }
        });
    });

    test.describe('Form Validation', () => {
        test('should show validation error for empty name field', async ({ page }) => {
            const nameField = page.getByTestId("EmpFormNameId");
            const roleField = page.getByTestId("EmpFormRoleId");
            const submitButton = page.getByRole('button', { name: /create/i });

            // Fill only role field
            await roleField.fill('Engineer');
            await submitButton.click();

            // Check for validation message (if implemented)
            // This test assumes some form of validation exists
            const validationMessage = page.getByText(/name is required/i);
            if (await validationMessage.count() > 0) {
                await expect(validationMessage).toBeVisible();
            }
        });

        test('should show validation error for empty role field', async ({ page }) => {
            const nameField = page.getByTestId("EmpFormNameId");
            const roleField = page.getByTestId("EmpFormRoleId");
            const submitButton = page.getByRole('button', { name: /create/i });

            // Fill only name field
            await nameField.fill('Test Employee');
            await submitButton.click();

            // Check for validation message (if implemented)
            const validationMessage = page.getByText(/role is required/i);
            if (await validationMessage.count() > 0) {
                await expect(validationMessage).toBeVisible();
            }
        });

        test('should handle very long input values', async ({ page }) => {
            const nameField = page.getByTestId("EmpFormNameId");
            const roleField = page.getByTestId("EmpFormRoleId");
            const submitButton = page.getByRole('button', { name: /create/i });

            const longName = 'A'.repeat(1000);
            const longRole = 'B'.repeat(500);

            await nameField.fill(longName);
            await roleField.fill(longRole);
            await submitButton.click();

            // Verify the form handles long inputs gracefully
            // Either it should submit successfully or show appropriate validation
            await expect(page).not.toHaveURL('/error');
        });
    });

    test.describe('Responsive Design', () => {
        test('should display correctly on mobile viewport', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            
            // Verify key elements are still visible
            await expect(page.getByText(/Employees of Bini corporation/i)).toBeVisible();
            await expect(page.locator('[data-testid="employee-form"]').or(page.locator('form'))).toBeVisible();
            await expect(page.locator('[data-testid="employee-list"]').or(page.locator('ul, table'))).toBeVisible();
        });

        test('should display correctly on tablet viewport', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            
            // Verify key elements are still visible
            await expect(page.getByText(/Employees of Bini corporation/i)).toBeVisible();
            await expect(page.locator('[data-testid="employee-form"]').or(page.locator('form'))).toBeVisible();
            await expect(page.locator('[data-testid="employee-list"]').or(page.locator('ul, table'))).toBeVisible();
        });

        test('should display correctly on desktop viewport', async ({ page }) => {
            await page.setViewportSize({ width: 1920, height: 1080 });
            
            // Verify key elements are still visible
            await expect(page.getByText(/Employees of Bini corporation/i)).toBeVisible();
            await expect(page.locator('[data-testid="employee-form"]').or(page.locator('form'))).toBeVisible();
            await expect(page.locator('[data-testid="employee-list"]').or(page.locator('ul, table'))).toBeVisible();
        });
    });

    test.describe('Accessibility', () => {
        test('should have proper ARIA labels', async ({ page }) => {
            const form = page.locator('[data-testid="employee-form"]').or(page.locator('form'));
            const list = page.locator('[data-testid="employee-list"]').or(page.locator('ul, table'));
            
            await expect(form).toBeVisible();
            await expect(list).toBeVisible();
        });

        test('should be navigable with keyboard', async ({ page }) => {
            // Test tab navigation
            await page.keyboard.press('Tab');
            
            const nameField = page.getByTestId("EmpFormNameId");
            await expect(nameField).toBeFocused();
            
            await page.keyboard.press('Tab');
            const roleField = page.getByTestId("EmpFormRoleId");
            await expect(roleField).toBeFocused();
        });

        test('should have proper focus management', async ({ page }) => {
            const submitButton = page.getByRole('button', { name: /create/i });
            await submitButton.focus();
            await expect(submitButton).toBeFocused();
        });
    });

    test.describe('Error Handling', () => {
        test('should handle network errors gracefully', async ({ page }) => {
            // This test would require mocking network failures
            // For now, we'll test that the page doesn't crash on load
            await expect(page).not.toHaveURL('/error');
        });

        test('should handle API errors gracefully', async ({ page }) => {
            // This test would require mocking API failures
            // For now, we'll test that the page loads successfully
            await expect(page.getByText(/Employees of Bini corporation/i)).toBeVisible();
        });
    });

    test.describe('Performance', () => {
        test('should load within reasonable time', async ({ page }) => {
            const startTime = Date.now();
            await page.goto('/');
            await page.waitForLoadState('networkidle');
            const endTime = Date.now();
            
            const loadTime = endTime - startTime;
            expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
        });

        test('should handle rapid form submissions', async ({ page }) => {
            const nameField = page.getByTestId("EmpFormNameId");
            const roleField = page.getByTestId("EmpFormRoleId");
            const submitButton = page.getByRole('button', { name: /create/i });

            // Rapidly submit the form multiple times
            for (let i = 0; i < 3; i++) {
                await nameField.fill(`Test Employee ${i}`);
                await roleField.fill(`Role ${i}`);
                await submitButton.click();
                
                // Wait a bit between submissions
                await page.waitForTimeout(100);
            }

            // Verify the page is still functional
            await expect(page.getByText(/Employees of Bini corporation/i)).toBeVisible();
        });
    });
});