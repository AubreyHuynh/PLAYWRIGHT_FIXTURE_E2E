import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class InputNumber extends BaseComponent {
  getByLabel(label: string): Locator {
    return this.root.locator(
      `//label[normalize-space()="${label}"]/following-sibling::div//input | ` +
      `//label[normalize-space()="${label}"]/following-sibling::input`
    )
  }

  getByName(name: string): Locator {
    return this.root.locator(`input[name="${name}"]`)
  }

  async fillByLabel(label: string, value: number): Promise<void> {
    const input = this.getByLabel(label)
    await input.clear()
    await input.fill(String(value))
  }

  async getValueByLabel(label: string): Promise<number> {
    const raw = await this.getByLabel(label).inputValue()
    return Number(raw)
  }
}
