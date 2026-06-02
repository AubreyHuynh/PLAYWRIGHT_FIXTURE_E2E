import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Button extends BaseComponent {
  getByText(text: string): Locator {
    return this.root.locator(`//button[normalize-space()="${text}"]`)
  }

  getByType(type: string): Locator {
    return this.root.locator(`button[type="${type}"]`)
  }

  getByClass(cls: string): Locator {
    return this.root.locator(`button.${cls}`)
  }

  async clickByText(text: string): Promise<void> {
    await this.getByText(text).click()
  }

  async clickByType(type: string): Promise<void> {
    await this.getByType(type).click()
  }

  async isDisabledByText(text: string): Promise<boolean> {
    return this.getByText(text).isDisabled()
  }
}
