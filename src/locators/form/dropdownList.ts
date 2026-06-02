import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class DropdownList extends BaseComponent {
  getTrigger(): Locator {
    return this.root.locator('.oxd-select-text')
  }

  getOption(text: string): Locator {
    return this.root.locator(
      `//div[contains(@class,"oxd-select-option")][normalize-space()="${text}"]`
    )
  }

  async select(text: string): Promise<void> {
    await this.getTrigger().click()
    await this.getOption(text).click()
  }

  async getSelected(): Promise<string> {
    return (await this.root.locator('.oxd-select-text--active span, .oxd-select-text span').first().innerText()).trim()
  }
}
