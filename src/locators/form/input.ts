import type { Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Input extends BaseComponent {
  getByLabel(label: string): Locator {
    return this.root.locator(
      `//label[normalize-space()="${label}"]/following-sibling::div//input | ` +
      `//label[normalize-space()="${label}"]/following-sibling::input`
    )
  }

  getByName(name: string): Locator {
    return this.root.locator(`input[name="${name}"]`)
  }

  getByClass(cls: string): Locator {
    return this.root.locator(`.${cls}`)
  }

  getByPlaceholder(text: string): Locator {
    return this.root.locator(`input[placeholder="${text}"]`)
  }

  async fillByLabel(label: string, value: string): Promise<void> {
    const input = this.getByLabel(label)
    await input.clear()
    await input.fill(value)
  }

  async fillByName(name: string, value: string): Promise<void> {
    const input = this.getByName(name)
    await input.clear()
    await input.fill(value)
  }

  async fillByPlaceholder(placeholder: string, value: string): Promise<void> {
    const input = this.getByPlaceholder(placeholder)
    await input.clear()
    await input.fill(value)
  }

  async getValueByLabel(label: string): Promise<string> {
    return this.getByLabel(label).inputValue()
  }

  async expectError(label: string, message: string): Promise<void> {
    const errorSpan = this.root.locator(
      `//label[normalize-space()="${label}"]/ancestor::div[contains(@class,"oxd-input-group")]` +
      `//span[contains(@class,"oxd-input-group__message")]`
    )
    await expect(errorSpan).toHaveText(message)
  }
}
