import { Page, Locator, expect } from '@playwright/test';

export class EmployeePage {
  readonly page: Page;
  readonly nameField: Locator;
  readonly roleField: Locator;
  readonly submitButton: Locator;
  readonly employeeList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameField = page.getByTestId('EmpFormNameId');
    this.roleField = page.getByTestId('EmpFormRoleId');
    this.submitButton = page.getByRole('button', { name: /create/i });
    this.employeeList = page.locator('[data-testid="employee-list"]');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async addEmployee(name: string, role: string) {
    await this.nameField.fill(name);
    // Open the MUI Select dropdown
    await this.roleField.click();
    // Click the option with the role text
    await this.page.getByRole('option', { name: role }).click();
    await this.submitButton.click();
    // Wait for the employee to appear in the list
    await this.page.waitForSelector(`[aria-label='Employee List Item'] >> text=${name}`);
  }

  async isEmployeePresent(name: string, role: string) {
    // Find a list item with both name and role
    const items = await this.page.locator("[aria-label='Employee List Item']").all();
    for (const item of items) {
      const text = await item.textContent();
      if (text && text.includes(name) && text.includes(role)) {
        return true;
      }
    }
    return false;
  }

  async deleteEmployee(name: string) {
    const row = this.employeeList.locator('li, tr').filter({ hasText: name });
    const deleteButton = row.getByRole('button', { name: /delete/i });
    if (await deleteButton.count() > 0) {
      this.page.once('dialog', dialog => dialog.accept());
      await deleteButton.first().click();
    }
  }
} 