import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Dialog extends BaseComponent {
  getTitle(): Locator {
    return this.root.locator('.oxd-dialog-title, h6').first()
  }

  getConfirmButton(text: string): Locator {
    return this.root.locator(`//button[normalize-space()="${text}"]`)
  }

  getCancelButton(text: string): Locator {
    return this.root.locator(`//button[normalize-space()="${text}"]`)
  }

  async isOpen(): Promise<boolean> {
    return this.root.isVisible()
  }

  async close(): Promise<void> {
    await this.root.locator(
      'button[aria-label="close"], .oxd-dialog-close, i.bi-x'
    ).first().click()
  }
}
