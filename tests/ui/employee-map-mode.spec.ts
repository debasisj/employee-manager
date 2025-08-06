import { test, expect } from '@playwright/test';
import { EmployeePage } from './EmployeePage';

test.describe('Employee Page - Map Mode', () => {
  const testName = 'MapMode Test User';
  const testRole = 'QA Engineer';

  test('add and delete employee', async ({ page }) => {
    const employeePage = new EmployeePage(page);
    await employeePage.goto();

    // Add new employee
    await employeePage.addEmployee(testName, testRole);
    // Check employee is present
    await expect(await employeePage.isEmployeePresent(testName, testRole)).toBeTruthy();

    // Delete the employee
    await employeePage.deleteEmployee(testName);
    // Check employee is no longer present
    await expect(await employeePage.isEmployeePresent(testName, testRole)).toBeFalsy();
  });
}); 