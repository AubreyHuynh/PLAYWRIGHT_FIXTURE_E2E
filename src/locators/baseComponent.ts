import type { Locator } from '@playwright/test'

export abstract class BaseComponent {
  constructor(protected readonly root: Locator) {}

  async isVisible(): Promise<boolean> {
    return this.root.isVisible()
  }

  async waitForVisible(timeout = 5_000): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout })
  }

  async waitForHidden(timeout = 5_000): Promise<void> {
    await this.root.waitFor({ state: 'hidden', timeout })
  }

  async count(): Promise<number> {
    return this.root.count()
  }

  async scrollIntoView(): Promise<void> {
    await this.root.scrollIntoViewIfNeeded()
  }
}
