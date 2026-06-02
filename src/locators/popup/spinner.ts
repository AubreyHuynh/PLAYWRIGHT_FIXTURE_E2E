import { BaseComponent } from '../baseComponent'

export class Spinner extends BaseComponent {
  async waitForHide(timeout = 10_000): Promise<void> {
    await this.root.waitFor({ state: 'hidden', timeout })
  }

  async isLoading(): Promise<boolean> {
    return this.root.isVisible()
  }
}
