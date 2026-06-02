import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Upload extends BaseComponent {
  getInput(): Locator {
    return this.root.locator('input[type="file"]')
  }

  async uploadFile(path: string): Promise<void> {
    await this.getInput().setInputFiles(path)
  }
}
