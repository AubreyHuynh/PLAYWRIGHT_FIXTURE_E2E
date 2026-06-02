import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Table extends BaseComponent {
  getAllRows(): Locator {
    return this.root.locator('.oxd-table-row--clickable')
  }

  getRow(index: number): Locator {
    return this.getAllRows().nth(index)
  }

  getRowByText(text: string): Locator {
    return this.root.locator(
      `//div[contains(@class,"oxd-table-row") and .//div[normalize-space()="${text}"]]`
    )
  }

  getCell(rowLocator: Locator, colIndex: number): Locator {
    return rowLocator.locator('.oxd-table-cell').nth(colIndex)
  }

  getActionButton(rowLocator: Locator, action: string): Locator {
    return rowLocator.locator(
      `//button[@title="${action}"] | ` +
      `//button[.//*[normalize-space()="${action}"]] | ` +
      `//button[normalize-space()="${action}"]`
    )
  }

  async getColumnValues(colIndex: number): Promise<string[]> {
    const rows = this.getAllRows()
    const count = await rows.count()
    const values: string[] = []
    for (let i = 0; i < count; i++) {
      const cell = rows.nth(i).locator('.oxd-table-cell').nth(colIndex)
      values.push((await cell.innerText()).trim())
    }
    return values
  }

  async rowCount(): Promise<number> {
    return this.getAllRows().count()
  }
}
