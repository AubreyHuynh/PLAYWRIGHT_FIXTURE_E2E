import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'
import type { User } from '../types'
import { Input, Button, Alert } from '../locators'

export class LoginPage extends BasePage {
  private readonly input = new Input(this.page.locator('body'))
  private readonly button = new Button(this.page.locator('body'))
  private readonly alert = new Alert(this.page.locator('body'))

  constructor(page: Page) {
    super(page)
  }

  async goto(): Promise<void> {
    await this.navigate('/web/index.php/auth/login')
  }

  async login(user: User): Promise<void> {
    await this.input.fillByName('username', user.username)
    await this.input.fillByName('password', user.password)
    await this.button.clickByType('submit')
  }

  async loginAndWait(user: User): Promise<void> {
    await this.login(user)
    await this.page.waitForURL(/\/web\/index\.php\/dashboard\/index/, { timeout: 15_000 })
  }

  async getErrorMessage(): Promise<string> {
    await this.alert.waitForVisible(5_000)
    return this.alert.getText()
  }

  async clearAndLogin(user: User): Promise<void> {
    await this.input.getByName('username').clear()
    await this.input.getByName('password').clear()
    await this.login(user)
  }

  async assertOnLoginPage(): Promise<void> {
    await this.assertURL(/\/web\/index\.php\/auth\/login/)
    await this.assertVisible(this.input.getByName('username'), 'username field should be visible')
    await this.assertVisible(this.input.getByName('password'), 'password field should be visible')
  }

  async assertLoginFailed(): Promise<void> {
    await expect(this.alert.getContainer()).toBeVisible({ timeout: 5_000 })
  }

  async assertLoggedIn(): Promise<void> {
    await this.assertURL(/\/web\/index\.php\/dashboard\/index/)
  }

  async assertRequiredValidation(): Promise<void> {
    await expect(
      this.page.locator('.oxd-input-group__message').first()
    ).toBeVisible({ timeout: 5_000 })
  }
}
