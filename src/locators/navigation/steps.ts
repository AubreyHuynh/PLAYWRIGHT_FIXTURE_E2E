import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Steps extends BaseComponent {
  getStep(label: string): Locator {
    return this.root.locator(`//*[normalize-space()="${label}"]`)
  }

  getActiveStep(): Locator {
    return this.root.locator(
      '.orangehrm-wizard-item--active, .active, [aria-current="step"]'
    ).first()
  }

  getStepByIndex(index: number): Locator {
    return this.root.locator('.orangehrm-wizard-item, .oxd-wizard-item').nth(index)
  }
}
