import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'
import type { SearchFilters } from '../types'
import { Table, Input, Button } from '../locators'

export class EmployeeListPage extends BasePage {
  private readonly table = new Table(this.page.locator('.oxd-table'))
  private readonly searchInput = new Input(this.page.locator('body'))
  private readonly actionButton = new Button(this.page.locator('body'))

  private readonly recordsFoundText = this.page.locator(
    '.oxd-text--span:has-text("Record"), span:has-text("Record")'
  ).first()

  constructor(page: Page) {
    super(page)
  }

  getRowByEmployeeName(name: string): Locator {
    return this.table.getRowByText(name)
  }

  getActionButtonInRow(name: string, action: 'Edit' | 'Delete'): Locator {
    return this.table.getActionButton(this.table.getRowByText(name), action)
  }

  async goto(): Promise<void> {
    await this.navigate('/web/index.php/pim/viewEmployeeList')
  }

  async searchByName(name: string): Promise<void> {
    await this.searchInput.fillByPlaceholder('Type for hints...', name)
    await this.waitForPageLoad()
  }

  async clickSearch(): Promise<void> {
    await this.actionButton.getByText('Search').click()
    await this.waitForPageLoad()
  }

  async searchEmployee(
    filters: Partial<Pick<SearchFilters, 'employeeName' | 'employeeId'>>
  ): Promise<void> {
    if (filters.employeeName) {
      await this.searchInput.fillByPlaceholder('Type for hints...', filters.employeeName)
    }
    if (filters.employeeId) {
      await this.searchInput.fillByLabel('Employee Id', filters.employeeId)
    }
    await this.actionButton.getByText('Search').click()
    await this.waitForPageLoad()
  }

  async resetSearch(): Promise<void> {
    await this.actionButton.getByType('reset').click()
    await this.waitForPageLoad()
  }

  async clickAddEmployee(): Promise<void> {
    await this.actionButton.getByText('Add').click()
    await this.page.waitForURL(/\/web\/index\.php\/pim\/addEmployee/)
  }

  async clickEditEmployee(name: string): Promise<void> {
    await this.table.getActionButton(this.table.getRowByText(name), 'Edit').click()
    await this.page.waitForURL(/\/web\/index\.php\/pim\/viewPersonalDetails/)
  }

  async clickDeleteEmployee(name: string): Promise<void> {
    await this.table.getActionButton(this.table.getRowByText(name), 'Delete').click()
  }

  async clickEmployeeRow(name: string): Promise<void> {
    await this.table.getRowByText(name).click()
  }

  async getEmployeeCount(): Promise<number> {
    return this.table.rowCount()
  }

  async getRecordsFoundText(): Promise<string> {
    if (await this.recordsFoundText.isVisible()) {
      return this.getText(this.recordsFoundText)
    }
    return ''
  }

  async getEmployeeNames(): Promise<string[]> {
    return this.table.getColumnValues(2)
  }

  async isTableVisible(): Promise<boolean> {
    return this.table.isVisible()
  }

  async assertTableVisible(): Promise<void> {
    await expect(
      this.page.locator('.oxd-table'),
      'Employee table should be visible'
    ).toBeVisible()
  }

  async assertEmployeeInList(name: string): Promise<void> {
    await expect(
      this.table.getRowByText(name),
      `Employee "${name}" should appear in the list`
    ).toBeVisible()
  }

  async assertEmployeeNotInList(name: string): Promise<void> {
    await expect(
      this.table.getRowByText(name),
      `Employee "${name}" should not appear in the list`
    ).not.toBeVisible()
  }

  async assertRecordsFound(): Promise<void> {
    const count = await this.getEmployeeCount()
    expect(count, 'Employee list should have at least one record').toBeGreaterThan(0)
  }

  async assertAddButtonVisible(): Promise<void> {
    await expect(
      this.actionButton.getByText('Add'),
      'Add button should be visible'
    ).toBeVisible()
  }
}
