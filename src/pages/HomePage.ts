import type { Page, Locator} from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────

  private readonly dashboardHeader = this.page.locator('.oxd-topbar-header-breadcrumb h6, .oxd-topbar-header-breadcrumb');
  private readonly mainMenu = this.page.locator('.oxd-main-menu');
  private readonly quickLaunchPanel = this.page.locator('.oxd-grid-item, .quick-launch');
  private readonly userDropdown = this.page.locator('.oxd-userdropdown-tab');
  private readonly userDropdownMenu = this.page.locator('.oxd-dropdown-menu');
  private readonly logoutLink = this.page.locator('a:has-text("Logout"), li:has-text("Logout")').last();
  private readonly topbar = this.page.locator('.oxd-topbar');
  private readonly dashboardWidgets = this.page.locator('.orangehrm-dashboard-widget, .oxd-grid-item--gutters');

  constructor(page: Page) {
    super(page);
  }

  // ── Dynamic Locators ──────────────────────────────────────────────────────

  getMenuItemByText(label: string): Locator {
    return this.page.locator(`.oxd-main-menu-item:has-text("${label}"), .oxd-nav-item:has-text("${label}")`);
  }

  getQuickLaunchItem(label: string): Locator {
    return this.page.locator(`.quick-launch-item:has-text("${label}"), p:has-text("${label}")`);
  }

  getDashboardWidget(title: string): Locator {
    return this.page.locator(
      `//p[normalize-space()="${title}"]/ancestor::div[contains(@class,"widget")] | ` +
      `//h6[normalize-space()="${title}"]/ancestor::div[contains(@class,"widget")]`
    );
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate('/web/index.php/dashboard/index');
  }

  async navigateTo(menuLabel: string): Promise<void> {
    const item = this.getMenuItemByText(menuLabel);
    await this.click(item, `menu: ${menuLabel}`);
    await this.waitForPageLoad();
  }

  async logout(): Promise<void> {
    await this.click(this.userDropdown, 'user dropdown');
    await this.waitForVisible(this.userDropdownMenu);
    await this.click(this.logoutLink, 'logout');
    await this.page.waitForURL(/\/web\/index\.php\/auth\/login/);
  }

  async openUserMenu(): Promise<void> {
    await this.click(this.userDropdown, 'user dropdown');
    await this.waitForVisible(this.userDropdownMenu);
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  async getWidgetCount(): Promise<number> {
    return this.dashboardWidgets.count();
  }

  async getPageTitle(): Promise<string> {
    return this.getText(this.dashboardHeader);
  }

  async getMenuItemCount(): Promise<number> {
    return this.page.locator('.oxd-main-menu-item').count();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertOnDashboard(): Promise<void> {
    await this.assertURL(/\/web\/index\.php\/dashboard\/index/);
    await this.assertVisible(this.topbar, 'topbar should be visible');
  }

  async assertMainMenuVisible(): Promise<void> {
    await expect(this.mainMenu).toBeVisible();
  }

  async assertMenuItemVisible(label: string): Promise<void> {
    await expect(this.getMenuItemByText(label), `"${label}" menu item should be visible`).toBeVisible();
  }

  async assertWidgetsLoaded(): Promise<void> {
    const count = await this.getWidgetCount();
    expect(count, 'Dashboard should have at least one widget').toBeGreaterThan(0);
  }
}

export { DashboardPage as HomePage };
