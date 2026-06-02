import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Tabs extends BaseComponent {
  getTab(label: string): Locator {
    return this.root.locator(
      `//a[normalize-space()="${label}"] | ` +
      `//li[normalize-space()="${label}"] | ` +
      `//*[contains(@class,"oxd-tab-link")][normalize-space()="${label}"]`
    )
  }

  getActiveTab(): Locator {
    return this.root.locator('.oxd-tab-link--active, [aria-selected="true"]').first()
  }

  async clickTab(label: string): Promise<void> {
    await this.getTab(label).click()
  }

  async getActiveTabLabel(): Promise<string> {
    return (await this.getActiveTab().innerText()).trim()
  }
}
