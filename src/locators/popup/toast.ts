import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Toast extends BaseComponent {
  getByType(type: 'success' | 'error' | 'warn' | 'info'): Locator {
    return this.root.locator(`.oxd-toast--${type}`)
  }

  getMessage(): Locator {
    return this.root.locator('.oxd-toast-content--text-message, .oxd-text').first()
  }

  async waitForSuccess(timeout = 8_000): Promise<void> {
    await this.getByType('success').waitFor({ state: 'visible', timeout })
  }

  async waitForError(timeout = 8_000): Promise<void> {
    await this.getByType('error').waitFor({ state: 'visible', timeout })
  }
}
