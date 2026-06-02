import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { Input, Button, Toast, Tabs } from '../locators'

export class EmployeeDetailPage extends BasePage {
  private readonly input = new Input(this.page.locator('body'))
  private readonly button = new Button(this.page.locator('body'))
  private readonly toast = new Toast(this.page.locator('body'))
  private readonly tabs = new Tabs(
    this.page.locator('.orangehrm-tabs, .orangehrm-edit-employee-sidebar')
  )

  private readonly pageHeader = this.page.locator(
    '.oxd-topbar-header-breadcrumb h6, .orangehrm-edit-employee-name h6'
  ).first()

  constructor(page: Page) {
    super(page)
  }

  getFieldByLabel(label: string): Locator {
    return this.input.getByLabel(label)
  }

  getSelectByLabel(label: string): Locator {
    return this.page.locator(
      `//label[normalize-space()="${label}"]/../following-sibling::div//div[contains(@class,"oxd-select-text")]`
    )
  }

  async goto(empNumber: string | number): Promise<void> {
    await this.navigate(
      `/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`
    )
  }

  async gotoAddEmployee(): Promise<void> {
    await this.navigate('/web/index.php/pim/addEmployee')
  }

  async fillFirstName(value: string): Promise<void> {
    await this.input.fillByName('firstName', value)
  }

  async fillLastName(value: string): Promise<void> {
    await this.input.fillByName('lastName', value)
  }

  async fillMiddleName(value: string): Promise<void> {
    await this.input.fillByName('middleName', value)
  }

  async saveChanges(): Promise<void> {
    await this.button.getByText('Save').click()
    await this.toast.waitForSuccess(8_000)
  }

  async cancelChanges(): Promise<void> {
    await this.button.getByText('Cancel').click()
  }

  async navigateToTab(
    tabName: 'Personal Details' | 'Contact Details' | 'Job'
  ): Promise<void> {
    await this.tabs.clickTab(tabName)
    await this.waitForPageLoad()
  }

  async getFirstName(): Promise<string> {
    return this.input.getByName('firstName').inputValue()
  }

  async getLastName(): Promise<string> {
    return this.input.getByName('lastName').inputValue()
  }

  async getEmployeeId(): Promise<string> {
    return this.input.getByLabel('Employee Id').inputValue()
  }

  async getPageHeading(): Promise<string> {
    return this.getText(this.pageHeader)
  }

  async assertOnPersonalDetails(): Promise<void> {
    await this.assertURL(/\/web\/index\.php\/pim\/(viewPersonalDetails|addEmployee)/)
    await this.assertVisible(
      this.input.getByName('firstName'),
      'first name input should be visible'
    )
  }

  async assertSaveSuccess(): Promise<void> {
    await expect(
      this.toast.getByType('success'),
      'Success toast should be visible'
    ).toBeVisible({ timeout: 8_000 })
  }

  async assertFirstName(expected: string): Promise<void> {
    await expect(this.input.getByName('firstName')).toHaveValue(expected)
  }

  async assertLastName(expected: string): Promise<void> {
    await expect(this.input.getByName('lastName')).toHaveValue(expected)
  }
}
