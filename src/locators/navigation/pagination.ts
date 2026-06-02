import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Pagination extends BaseComponent {
  getNextButton(): Locator {
    return this.root.locator(
      'button[aria-label="next"], .oxd-pagination-right, i.bi-chevron-right'
    ).first()
  }

  getPrevButton(): Locator {
    return this.root.locator(
      'button[aria-label="prev"], .oxd-pagination-left, i.bi-chevron-left'
    ).first()
  }

  getPageButton(num: number): Locator {
    return this.root.locator(
      `//li[normalize-space()="${num}"] | //button[normalize-space()="${num}"]`
    )
  }

  async getCurrentPage(): Promise<number> {
    const active = this.root.locator(
      '.oxd-pagination-page-selected, [aria-current="page"]'
    ).first()
    return Number((await active.innerText()).trim())
  }

  async goToPage(num: number): Promise<void> {
    await this.getPageButton(num).click()
  }
}
