import type { Page, Locator} from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import type { SearchFilters } from '../types';

export class EmployeeListPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────

  private readonly employeeTable = this.page.locator('.oxd-table');
  private readonly tableRows = this.page.locator('.oxd-table-row--clickable, .oxd-table-body .oxd-table-row');
  private readonly addEmployeeBtn = this.page.locator('button:has-text("Add")').first();
  private readonly searchBtn = this.page.locator('button[type="submit"]:has-text("Search"), .oxd-button--secondary:has-text("Search")').first();
  private readonly resetBtn = this.page.locator('button[type="reset"]:has-text("Reset"), .oxd-button--ghost:has-text("Reset")').first();
  private readonly recordsFoundText = this.page.locator('.oxd-text--span:has-text("Record"), span:has-text("Record")').first();
  private readonly noRecordsText = this.page.locator('.oxd-table-card, .orangehrm-container').first();
  private readonly employeeNameInput = this.page.locator('input[placeholder="Type for hints..."]').first();
  private readonly employeeIdInput = this.page.locator('input.oxd-input').nth(1);
  private readonly statusDropdown = this.page.locator('.oxd-select-wrapper').first();
  private readonly tableHeader = this.page.locator('.oxd-table-header');

  constructor(page: Page) {
    super(page);
  }

  // ── Dynamic Locators ──────────────────────────────────────────────────────

  getRowByEmployeeName(name: string): Locator {
    return this.page.locator(
      `//div[@class="oxd-table-row oxd-table-row--clickable"]//div[normalize-space()="${name}"]/ancestor::div[@class="oxd-table-row oxd-table-row--clickable"] | ` +
      `//div[contains(@class,"oxd-table-row")]//div[normalize-space()="${name}"]/ancestor::div[contains(@class,"oxd-table-row")]`
    );
  }

  getActionButtonInRow(name: string, action: 'Edit' | 'Delete'): Locator {
    return this.page.locator(
      `//div[normalize-space()="${name}"]/ancestor::div[contains(@class,"oxd-table-row")]//button[@title="${action}" or contains(.,"${action}")]`
    );
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate('/web/index.php/pim/viewEmployeeList');
  }

  async searchByName(name: string): Promise<void> {
    await this.fill(this.employeeNameInput, name, 'employee name');
    await this.waitForPageLoad();
  }

  async clickSearch(): Promise<void> {
    await this.click(this.searchBtn, 'search button');
    await this.waitForPageLoad();
  }

  async searchEmployee(filters: Partial<SearchFilters>): Promise<void> {
    if (filters.employeeName) {
      await this.fill(this.employeeNameInput, filters.employeeName, 'employee name');
    }
    await this.click(this.searchBtn, 'search');
    await this.waitForPageLoad();
  }

  async resetSearch(): Promise<void> {
    await this.click(this.resetBtn, 'reset');
    await this.waitForPageLoad();
  }

  async clickAddEmployee(): Promise<void> {
    await this.click(this.addEmployeeBtn, 'add employee');
    await this.page.waitForURL(/\/web\/index\.php\/pim\/addEmployee/);
  }

  async clickEditEmployee(name: string): Promise<void> {
    const editBtn = this.getActionButtonInRow(name, 'Edit');
    await this.click(editBtn, `edit: ${name}`);
    await this.page.waitForURL(/\/web\/index\.php\/pim\/viewPersonalDetails/);
  }

  async clickDeleteEmployee(name: string): Promise<void> {
    const deleteBtn = this.getActionButtonInRow(name, 'Delete');
    await this.click(deleteBtn, `delete: ${name}`);
  }

  async clickEmployeeRow(name: string): Promise<void> {
    const row = this.getRowByEmployeeName(name);
    await this.click(row, `employee row: ${name}`);
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  async getEmployeeCount(): Promise<number> {
    return this.tableRows.count();
  }

  async getRecordsFoundText(): Promise<string> {
    if (await this.recordsFoundText.isVisible()) {
      return this.getText(this.recordsFoundText);
    }
    return '';
  }

  async getEmployeeNames(): Promise<string[]> {
    const nameColumns = this.page.locator('.oxd-table-row--clickable .oxd-table-cell:nth-child(3)');
    const count = await nameColumns.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await nameColumns.nth(i).textContent();
      if (text?.trim()) names.push(text.trim());
    }
    return names;
  }

  async isTableVisible(): Promise<boolean> {
    return this.employeeTable.isVisible();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertTableVisible(): Promise<void> {
    await expect(this.employeeTable, 'Employee table should be visible').toBeVisible();
  }

  async assertEmployeeInList(name: string): Promise<void> {
    await expect(
      this.getRowByEmployeeName(name),
      `Employee "${name}" should appear in the list`
    ).toBeVisible();
  }

  async assertEmployeeNotInList(name: string): Promise<void> {
    await expect(
      this.getRowByEmployeeName(name),
      `Employee "${name}" should not appear in the list`
    ).not.toBeVisible();
  }

  async assertRecordsFound(): Promise<void> {
    const count = await this.getEmployeeCount();
    expect(count, 'Employee list should have at least one record').toBeGreaterThan(0);
  }

  async assertAddButtonVisible(): Promise<void> {
    await expect(this.addEmployeeBtn, 'Add button should be visible').toBeVisible();
  }
}

export { EmployeeListPage as CartPage };
