import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Radio extends BaseComponent {
  getByLabel(label: string): Locator {
    return this.root.locator(
      `//label[normalize-space()="${label}"]/preceding-sibling::input[@type="radio"] | ` +
      `//label[normalize-space()="${label}"]/..//input[@type="radio"]`
    )
  }

  async select(locator: Locator): Promise<void> {
    await locator.click()
  }

  async isSelected(locator: Locator): Promise<boolean> {
    return locator.isChecked()
  }
}
