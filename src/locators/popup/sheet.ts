import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Sheet extends BaseComponent {
  getContent(): Locator {
    return this.root.locator('.oxd-sheet-content, .sheet-body').first()
  }

  getCloseButton(): Locator {
    return this.root.locator('button[aria-label="close"], i.bi-x').first()
  }

  async isOpen(): Promise<boolean> {
    return this.root.isVisible()
  }
}
