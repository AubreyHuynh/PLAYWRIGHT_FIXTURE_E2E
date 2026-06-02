import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class DatePicker extends BaseComponent {
  getInput(): Locator {
    return this.root.locator('input.oxd-date-input, input[placeholder]').first()
  }

  getCalendarToggle(): Locator {
    return this.root.locator('button.oxd-date-input-calendar, i.oxd-icon').first()
  }

  async selectDate(value: string): Promise<void> {
    const input = this.getInput()
    await input.clear()
    await input.fill(value)
    await input.press('Tab')
  }

  async getValue(): Promise<string> {
    return this.getInput().inputValue()
  }
}
