import type { Page, Locator} from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class EmployeeDetailPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────

  private readonly pageHeader = this.page.locator('.oxd-topbar-header-breadcrumb h6, .orangehrm-edit-employee-name h6').first();
  private readonly firstNameInput = this.page.locator('input[name="firstName"]');
  private readonly middleNameInput = this.page.locator('input[name="middleName"]');
  private readonly lastNameInput = this.page.locator('input[name="lastName"]');
  private readonly employeeIdInput = this.page.locator('input.oxd-input').nth(4);
  private readonly saveBtn = this.page.locator('button[type="submit"]:has-text("Save"), .oxd-button--secondary:has-text("Save")').first();
  private readonly cancelBtn = this.page.locator('button[type="button"]:has-text("Cancel"), .oxd-button--ghost:has-text("Cancel")').first();
  private readonly successToast = this.page.locator('.oxd-toast--success, .oxd-toast-content--success').first();
  private readonly personalDetailsTab = this.page.locator('a:has-text("Personal Details"), .orangehrm-tabs-item:has-text("Personal Details")').first();
  private readonly contactDetailsTab = this.page.locator('a:has-text("Contact Details"), .orangehrm-tabs-item:has-text("Contact Details")').first();
  private readonly jobTab = this.page.locator('a:has-text("Job"), .orangehrm-tabs-item:has-text("Job")').first();
  private readonly profilePicture = this.page.locator('.employee-image, img.oxd-userdropdown-img').first();

  constructor(page: Page) {
    super(page);
  }

  // ── Dynamic Locators ──────────────────────────────────────────────────────

  getFieldByLabel(label: string): Locator {
    return this.page.locator(
      `//label[normalize-space()="${label}"]/following::input[1] | ` +
      `//label[normalize-space()="${label}"]/../following-sibling::div//input`
    );
  }

  getSelectByLabel(label: string): Locator {
    return this.page.locator(
      `//label[normalize-space()="${label}"]/../following-sibling::div//div[contains(@class,"oxd-select-text")]`
    );
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(empNumber: string | number): Promise<void> {
    await this.navigate(`/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`);
  }

  async gotoAddEmployee(): Promise<void> {
    await this.navigate('/web/index.php/pim/addEmployee');
  }

  async fillFirstName(value: string): Promise<void> {
    await this.fill(this.firstNameInput, value, 'first name');
  }

  async fillLastName(value: string): Promise<void> {
    await this.fill(this.lastNameInput, value, 'last name');
  }

  async fillMiddleName(value: string): Promise<void> {
    await this.fill(this.middleNameInput, value, 'middle name');
  }

  async saveChanges(): Promise<void> {
    await this.click(this.saveBtn, 'save');
    await this.waitForVisible(this.successToast, 8_000);
  }

  async cancelChanges(): Promise<void> {
    await this.click(this.cancelBtn, 'cancel');
  }

  async navigateToTab(tabName: 'Personal Details' | 'Contact Details' | 'Job'): Promise<void> {
    const tabMap = {
      'Personal Details': this.personalDetailsTab,
      'Contact Details': this.contactDetailsTab,
      'Job': this.jobTab,
    };
    await this.click(tabMap[tabName], `tab: ${tabName}`);
    await this.waitForPageLoad();
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  async getFirstName(): Promise<string> {
    return this.firstNameInput.inputValue();
  }

  async getLastName(): Promise<string> {
    return this.lastNameInput.inputValue();
  }

  async getEmployeeId(): Promise<string> {
    return this.employeeIdInput.inputValue();
  }

  async getPageHeading(): Promise<string> {
    return this.getText(this.pageHeader);
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertOnPersonalDetails(): Promise<void> {
    await this.assertURL(/\/web\/index\.php\/pim\/(viewPersonalDetails|addEmployee)/);
    await this.assertVisible(this.firstNameInput, 'first name input should be visible');
  }

  async assertSaveSuccess(): Promise<void> {
    await expect(this.successToast, 'Success toast should be visible').toBeVisible({ timeout: 8_000 });
  }

  async assertFirstName(expected: string): Promise<void> {
    await expect(this.firstNameInput).toHaveValue(expected);
  }

  async assertLastName(expected: string): Promise<void> {
    await expect(this.lastNameInput).toHaveValue(expected);
  }
}

export { EmployeeDetailPage as ProductDetailPage };
