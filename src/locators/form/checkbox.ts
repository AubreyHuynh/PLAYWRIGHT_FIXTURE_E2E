import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Checkbox extends BaseComponent {
  getByLabel(label: string): Locator {
    return this.root.locator(
      `//label[normalize-space()="${label}"]/preceding-sibling::input[@type="checkbox"] | ` +
      `//label[normalize-space()="${label}"]/..//input[@type="checkbox"]`
    )
  }

  async check(locator: Locator): Promise<void> {
    if (!(await locator.isChecked())) {
      await locator.click()
    }
  }

  async uncheck(locator: Locator): Promise<void> {
    if (await locator.isChecked()) {
      await locator.click()
    }
  }

  async isChecked(locator: Locator): Promise<boolean> {
    return locator.isChecked()
  }
}
