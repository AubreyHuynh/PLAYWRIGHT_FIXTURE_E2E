import { BaseComponent } from '../baseComponent'

export class Tooltip extends BaseComponent {
  async getText(): Promise<string> {
    return (await this.root.innerText()).trim()
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible()
  }
}
