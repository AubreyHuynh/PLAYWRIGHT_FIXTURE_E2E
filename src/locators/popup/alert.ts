import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Alert extends BaseComponent {
  getContainer(): Locator {
    return this.root.locator('.oxd-alert')
  }

  getMessage(): Locator {
    return this.root.locator('.oxd-alert-content-text')
  }

  async isError(): Promise<boolean> {
    return this.root.locator('.oxd-alert--error').isVisible()
  }

  async getText(): Promise<string> {
    return (await this.getMessage().innerText()).trim()
  }
}
