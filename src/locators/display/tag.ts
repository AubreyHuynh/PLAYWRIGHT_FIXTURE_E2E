import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Tag extends BaseComponent {
  getByText(text: string): Locator {
    return this.root.locator(
      `//span[normalize-space()="${text}"] | //div[normalize-space()="${text}"]`
    )
  }

  async getText(): Promise<string> {
    return (await this.root.innerText()).trim()
  }

  async getAllTexts(): Promise<string[]> {
    const tags = this.root.locator('.oxd-chip, .chip, span')
    const count = await tags.count()
    const texts: string[] = []
    for (let i = 0; i < count; i++) {
      texts.push((await tags.nth(i).innerText()).trim())
    }
    return texts.filter(Boolean)
  }
}
