import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { Tabs, Card, Button } from '../locators'

export class DashboardPage extends BasePage {
  private readonly mainMenuTabs = new Tabs(this.page.locator('.oxd-main-menu'))
  private readonly widgetCard = new Card(this.page.locator('body'))
  private readonly topbarButton = new Button(this.page.locator('.oxd-topbar'))

  private readonly dashboardHeader = this.page.locator(
    '.oxd-topbar-header-breadcrumb h6, .oxd-topbar-header-breadcrumb'
  )
  private readonly mainMenu = this.page.locator('.oxd-main-menu')
  private readonly userDropdownMenu = this.page.locator('.oxd-dropdown-menu')
  private readonly topbar = this.page.locator('.oxd-topbar')
  private readonly dashboardWidgets = this.page.locator(
    '.orangehrm-dashboard-widget, .oxd-grid-item--gutters'
  )

  constructor(page: Page) {
    super(page)
  }

  getMenuItemByText(label: string): Locator {
    return this.mainMenuTabs.getTab(label)
  }

  getQuickLaunchItem(label: string): Locator {
    return this.page.locator(
      `.quick-launch-item:has-text("${label}"), p:has-text("${label}")`
    )
  }

  getDashboardWidget(title: string): Locator {
    return this.widgetCard.getByTitle(title)
  }

  async goto(): Promise<void> {
    await this.navigate('/web/index.php/dashboard/index')
  }

  async navigateTo(menuLabel: string): Promise<void> {
    await this.mainMenuTabs.clickTab(menuLabel)
    await this.waitForPageLoad()
  }

  async openUserMenu(): Promise<void> {
    await this.topbarButton.getByClass('oxd-userdropdown-tab').click()
    await this.waitForVisible(this.userDropdownMenu)
  }

  async logout(): Promise<void> {
    await this.openUserMenu()
    await this.page.locator('a:has-text("Logout"), li:has-text("Logout")').last().click()
    await this.page.waitForURL(/\/web\/index\.php\/auth\/login/)
  }

  async getWidgetCount(): Promise<number> {
    return this.dashboardWidgets.count()
  }

  async getPageTitle(): Promise<string> {
    return this.getText(this.dashboardHeader)
  }

  async getMenuItemCount(): Promise<number> {
    return this.page.locator('.oxd-main-menu-item').count()
  }

  async assertOnDashboard(): Promise<void> {
    await this.assertURL(/\/web\/index\.php\/dashboard\/index/)
    await this.assertVisible(this.topbar, 'topbar should be visible')
  }

  async assertMainMenuVisible(): Promise<void> {
    await expect(this.mainMenu).toBeVisible()
  }

  async assertMenuItemVisible(label: string): Promise<void> {
    await expect(
      this.mainMenuTabs.getTab(label),
      `"${label}" menu item should be visible`
    ).toBeVisible()
  }

  async assertWidgetsLoaded(): Promise<void> {
    const count = await this.getWidgetCount()
    expect(count, 'Dashboard should have at least one widget').toBeGreaterThan(0)
  }

  getMenuItem(label: string): Locator {
    return this.page.locator(`.oxd-main-menu-item:has-text("${label}")`)
  }

  getDashboardHeading(): Locator {
    return this.page.locator('.oxd-topbar-header-breadcrumb h6').first()
  }
}
