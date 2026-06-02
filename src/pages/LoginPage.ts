import type { Page} from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import type { User } from '../types';

export class LoginPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────

  private readonly usernameInput = this.page.locator('input[name="username"]');
  private readonly passwordInput = this.page.locator('input[name="password"]');
  private readonly submitBtn = this.page.locator('button[type="submit"]');
  private readonly errorAlert = this.page.locator('.oxd-alert--error, .oxd-alert');
  private readonly invalidCredentialMsg = this.page.locator('.oxd-alert-content-text');
  private readonly requiredMsg = this.page.locator('.oxd-input-group__message');
  private readonly logo = this.page.locator('.orangehrm-login-logo, img[alt*="orange" i]');

  constructor(page: Page) {
    super(page);
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate('/web/index.php/auth/login');
  }

  async login(user: User): Promise<void> {
    await this.fill(this.usernameInput, user.email, 'username');
    await this.fill(this.passwordInput, user.password, 'password');
    await this.click(this.submitBtn, 'login button');
  }

  async loginAndWait(user: User): Promise<void> {
    await this.login(user);
    await this.page.waitForURL(/\/web\/index\.php\/dashboard\/index/, { timeout: 15_000 });
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.invalidCredentialMsg, 5_000);
    return this.getText(this.invalidCredentialMsg);
  }

  async clearAndLogin(user: User): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
    await this.login(user);
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertOnLoginPage(): Promise<void> {
    await this.assertURL(/\/web\/index\.php\/auth\/login/);
    await this.assertVisible(this.usernameInput, 'username field should be visible');
    await this.assertVisible(this.passwordInput, 'password field should be visible');
  }

  async assertLoginFailed(): Promise<void> {
    await expect(this.errorAlert).toBeVisible({ timeout: 5_000 });
  }

  async assertLoggedIn(): Promise<void> {
    await this.assertURL(/\/web\/index\.php\/dashboard\/index/);
  }

  async assertRequiredValidation(): Promise<void> {
    await expect(this.requiredMsg.first()).toBeVisible({ timeout: 5_000 });
  }
}
