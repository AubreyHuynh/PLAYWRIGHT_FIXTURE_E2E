import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Switch extends BaseComponent {
  getToggle(): Locator {
    return this.root.locator('input[type="checkbox"].oxd-switch-input, input.oxd-switch-input')
  }

  async toggle(): Promise<void> {
    await this.root.locator('.oxd-switch-wrapper, label.oxd-switch').click()
  }

  async isOn(): Promise<boolean> {
    return this.getToggle().isChecked()
  }
}
