import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Card extends BaseComponent {
  getTitle(): Locator {
    return this.root.locator('.oxd-text--h6, h6').first()
  }

  getBody(): Locator {
    return this.root.locator('.orangehrm-card-container, .oxd-sheet, .widget-body').first()
  }

  getByTitle(title: string): Locator {
    return this.root.locator(
      `//p[normalize-space()="${title}"]/ancestor::div[contains(@class,"widget")] | ` +
      `//h6[normalize-space()="${title}"]/ancestor::div[contains(@class,"widget")]`
    )
  }
}
