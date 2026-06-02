# Locator Component Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a typed component library under `src/locators/` and fully refactor all four page objects to use it.

**Architecture:** Each component extends `BaseComponent` and receives a scoped Playwright `Locator` as `root`. Dynamic locator methods chain off `root` using XPath axes, `name`/`id` attributes, `oxd-` class selectors, or Playwright `.nth()`. Page objects declare component instances as `readonly` properties and delegate locator resolution to them.

**Tech Stack:** Playwright `@playwright/test`, TypeScript, OrangeHRM `oxd-` design system.

---

## File Map

**Create:**
- `src/locators/baseComponent.ts`
- `src/locators/form/input.ts`
- `src/locators/form/inputNumber.ts`
- `src/locators/form/button.ts`
- `src/locators/form/checkbox.ts`
- `src/locators/form/radio.ts`
- `src/locators/form/dropdownList.ts`
- `src/locators/form/datePicker.ts`
- `src/locators/form/switch.ts`
- `src/locators/form/upload.ts`
- `src/locators/display/card.ts`
- `src/locators/display/table.ts`
- `src/locators/display/tag.ts`
- `src/locators/navigation/tabs.ts`
- `src/locators/navigation/pagination.ts`
- `src/locators/navigation/steps.ts`
- `src/locators/popup/alert.ts`
- `src/locators/popup/dialog.ts`
- `src/locators/popup/sheet.ts`
- `src/locators/popup/spinner.ts`
- `src/locators/popup/toast.ts`
- `src/locators/popup/tooltip.ts`
- `src/locators/index.ts`

**Modify:**
- `src/pages/LoginPage.ts`
- `src/pages/DashboardPage.ts`
- `src/pages/EmployeeListPage.ts`
- `src/pages/EmployeeDetailPage.ts`

---

## Task 1: BaseComponent

**Files:**
- Create: `src/locators/baseComponent.ts`

- [ ] **Step 1: Create `src/locators/baseComponent.ts`**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/baseComponent.ts
git commit -m "feat: add BaseComponent foundation for locator library"
```

---

## Task 2: Form — Input

**Files:**
- Create: `src/locators/form/input.ts`

- [ ] **Step 1: Create `src/locators/form/input.ts`**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/form/input.ts
git commit -m "feat: add Input component"
```

---

## Task 3: Form — InputNumber

**Files:**
- Create: `src/locators/form/inputNumber.ts`

- [ ] **Step 1: Create `src/locators/form/inputNumber.ts`**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/form/inputNumber.ts
git commit -m "feat: add InputNumber component"
```

---

## Task 4: Form — Button

**Files:**
- Create: `src/locators/form/button.ts`

- [ ] **Step 1: Create `src/locators/form/button.ts`**

```typescript
import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Button extends BaseComponent {
  getByText(text: string): Locator {
    return this.root.locator(`//button[normalize-space()="${text}"]`)
  }

  getByType(type: string): Locator {
    return this.root.locator(`button[type="${type}"]`)
  }

  getByClass(cls: string): Locator {
    return this.root.locator(`button.${cls}`)
  }

  async clickByText(text: string): Promise<void> {
    await this.getByText(text).click()
  }

  async clickByType(type: string): Promise<void> {
    await this.getByType(type).click()
  }

  async isDisabledByText(text: string): Promise<boolean> {
    return this.getByText(text).isDisabled()
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/form/button.ts
git commit -m "feat: add Button component"
```

---

## Task 5: Form — Checkbox

**Files:**
- Create: `src/locators/form/checkbox.ts`

- [ ] **Step 1: Create `src/locators/form/checkbox.ts`**

```typescript
import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Checkbox extends BaseComponent {
  getByLabel(label: string): Locator {
    return this.root.locator(
      `//label[normalize-space()="${label}"]/preceding-sibling::input[@type="checkbox"] | ` +
      `//label[normalize-space()="${label}"]/..//input[@type="checkbox"]`
    )
  }

  async check(locator: Locator): Promise<void> {
    if (!(await locator.isChecked())) {
      await locator.click()
    }
  }

  async uncheck(locator: Locator): Promise<void> {
    if (await locator.isChecked()) {
      await locator.click()
    }
  }

  async isChecked(locator: Locator): Promise<boolean> {
    return locator.isChecked()
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/form/checkbox.ts
git commit -m "feat: add Checkbox component"
```

---

## Task 6: Form — Radio

**Files:**
- Create: `src/locators/form/radio.ts`

- [ ] **Step 1: Create `src/locators/form/radio.ts`**

```typescript
import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Radio extends BaseComponent {
  getByLabel(label: string): Locator {
    return this.root.locator(
      `//label[normalize-space()="${label}"]/preceding-sibling::input[@type="radio"] | ` +
      `//label[normalize-space()="${label}"]/..//input[@type="radio"]`
    )
  }

  async select(locator: Locator): Promise<void> {
    await locator.click()
  }

  async isSelected(locator: Locator): Promise<boolean> {
    return locator.isChecked()
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/form/radio.ts
git commit -m "feat: add Radio component"
```

---

## Task 7: Form — DropdownList

**Files:**
- Create: `src/locators/form/dropdownList.ts`

- [ ] **Step 1: Create `src/locators/form/dropdownList.ts`**

```typescript
import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class DropdownList extends BaseComponent {
  getTrigger(): Locator {
    return this.root.locator('.oxd-select-text')
  }

  getOption(text: string): Locator {
    return this.root.locator(
      `//div[contains(@class,"oxd-select-option")][normalize-space()="${text}"]`
    )
  }

  async select(text: string): Promise<void> {
    await this.getTrigger().click()
    await this.getOption(text).click()
  }

  async getSelected(): Promise<string> {
    return (await this.root.locator('.oxd-select-text--active span, .oxd-select-text span').first().innerText()).trim()
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/form/dropdownList.ts
git commit -m "feat: add DropdownList component"
```

---

## Task 8: Form — DatePicker

**Files:**
- Create: `src/locators/form/datePicker.ts`

- [ ] **Step 1: Create `src/locators/form/datePicker.ts`**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/form/datePicker.ts
git commit -m "feat: add DatePicker component"
```

---

## Task 9: Form — Switch

**Files:**
- Create: `src/locators/form/switch.ts`

- [ ] **Step 1: Create `src/locators/form/switch.ts`**

```typescript
import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Switch extends BaseComponent {
  getToggle(): Locator {
    return this.root.locator('input[type="checkbox"].oxd-switch-input, input.oxd-switch-input')
  }

  async toggle(): Promise<void> {
    await this.root.locator('.oxd-switch-wrapper, label.oxd-switch').click()
  }

  async isOn(): Promise<boolean> {
    return this.getToggle().isChecked()
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/form/switch.ts
git commit -m "feat: add Switch component"
```

---

## Task 10: Form — Upload

**Files:**
- Create: `src/locators/form/upload.ts`

- [ ] **Step 1: Create `src/locators/form/upload.ts`**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/form/upload.ts
git commit -m "feat: add Upload component"
```

---

## Task 11: Display — Table

**Files:**
- Create: `src/locators/display/table.ts`

- [ ] **Step 1: Create `src/locators/display/table.ts`**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/display/table.ts
git commit -m "feat: add Table component"
```

---

## Task 12: Display — Card

**Files:**
- Create: `src/locators/display/card.ts`

- [ ] **Step 1: Create `src/locators/display/card.ts`**

```typescript
import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Card extends BaseComponent {
  getTitle(): Locator {
    return this.root.locator('.oxd-text--h6, h6').first()
  }

  getBody(): Locator {
    return this.root.locator('.orangehrm-card-container, .oxd-sheet, .widget-body').first()
  }

  getByTitle(title: string): Locator {
    return this.root.locator(
      `//p[normalize-space()="${title}"]/ancestor::div[contains(@class,"widget")] | ` +
      `//h6[normalize-space()="${title}"]/ancestor::div[contains(@class,"widget")]`
    )
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/display/card.ts
git commit -m "feat: add Card component"
```

---

## Task 13: Display — Tag

**Files:**
- Create: `src/locators/display/tag.ts`

- [ ] **Step 1: Create `src/locators/display/tag.ts`**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/display/tag.ts
git commit -m "feat: add Tag component"
```

---

## Task 14: Navigation — Tabs

**Files:**
- Create: `src/locators/navigation/tabs.ts`

- [ ] **Step 1: Create `src/locators/navigation/tabs.ts`**

```typescript
import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Tabs extends BaseComponent {
  getTab(label: string): Locator {
    return this.root.locator(
      `//a[normalize-space()="${label}"] | ` +
      `//li[normalize-space()="${label}"] | ` +
      `//*[contains(@class,"oxd-tab-link")][normalize-space()="${label}"]`
    )
  }

  getActiveTab(): Locator {
    return this.root.locator('.oxd-tab-link--active, [aria-selected="true"]').first()
  }

  async clickTab(label: string): Promise<void> {
    await this.getTab(label).click()
  }

  async getActiveTabLabel(): Promise<string> {
    return (await this.getActiveTab().innerText()).trim()
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/navigation/tabs.ts
git commit -m "feat: add Tabs component"
```

---

## Task 15: Navigation — Pagination

**Files:**
- Create: `src/locators/navigation/pagination.ts`

- [ ] **Step 1: Create `src/locators/navigation/pagination.ts`**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/navigation/pagination.ts
git commit -m "feat: add Pagination component"
```

---

## Task 16: Navigation — Steps

**Files:**
- Create: `src/locators/navigation/steps.ts`

- [ ] **Step 1: Create `src/locators/navigation/steps.ts`**

```typescript
import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Steps extends BaseComponent {
  getStep(label: string): Locator {
    return this.root.locator(`//*[normalize-space()="${label}"]`)
  }

  getActiveStep(): Locator {
    return this.root.locator(
      '.orangehrm-wizard-item--active, .active, [aria-current="step"]'
    ).first()
  }

  getStepByIndex(index: number): Locator {
    return this.root.locator('.orangehrm-wizard-item, .oxd-wizard-item').nth(index)
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/navigation/steps.ts
git commit -m "feat: add Steps component"
```

---

## Task 17: Popup — Toast

**Files:**
- Create: `src/locators/popup/toast.ts`

- [ ] **Step 1: Create `src/locators/popup/toast.ts`**

```typescript
import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Toast extends BaseComponent {
  getByType(type: 'success' | 'error' | 'warn' | 'info'): Locator {
    return this.root.locator(`.oxd-toast--${type}`)
  }

  getMessage(): Locator {
    return this.root.locator('.oxd-toast-content--text-message, .oxd-text').first()
  }

  async waitForSuccess(timeout = 8_000): Promise<void> {
    await this.getByType('success').waitFor({ state: 'visible', timeout })
  }

  async waitForError(timeout = 8_000): Promise<void> {
    await this.getByType('error').waitFor({ state: 'visible', timeout })
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/popup/toast.ts
git commit -m "feat: add Toast component"
```

---

## Task 18: Popup — Alert

**Files:**
- Create: `src/locators/popup/alert.ts`

- [ ] **Step 1: Create `src/locators/popup/alert.ts`**

```typescript
import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Alert extends BaseComponent {
  getContainer(): Locator {
    return this.root.locator('.oxd-alert')
  }

  getMessage(): Locator {
    return this.root.locator('.oxd-alert-content-text')
  }

  async isError(): Promise<boolean> {
    return this.root.locator('.oxd-alert--error').isVisible()
  }

  async getText(): Promise<string> {
    return (await this.getMessage().innerText()).trim()
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/popup/alert.ts
git commit -m "feat: add Alert component"
```

---

## Task 19: Popup — Dialog

**Files:**
- Create: `src/locators/popup/dialog.ts`

- [ ] **Step 1: Create `src/locators/popup/dialog.ts`**

```typescript
import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Dialog extends BaseComponent {
  getTitle(): Locator {
    return this.root.locator('.oxd-dialog-title, h6').first()
  }

  getConfirmButton(text: string): Locator {
    return this.root.locator(`//button[normalize-space()="${text}"]`)
  }

  getCancelButton(text: string): Locator {
    return this.root.locator(`//button[normalize-space()="${text}"]`)
  }

  async isOpen(): Promise<boolean> {
    return this.root.isVisible()
  }

  async close(): Promise<void> {
    await this.root.locator(
      'button[aria-label="close"], .oxd-dialog-close, i.bi-x'
    ).first().click()
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/popup/dialog.ts
git commit -m "feat: add Dialog component"
```

---

## Task 20: Popup — Sheet

**Files:**
- Create: `src/locators/popup/sheet.ts`

- [ ] **Step 1: Create `src/locators/popup/sheet.ts`**

```typescript
import type { Locator } from '@playwright/test'
import { BaseComponent } from '../baseComponent'

export class Sheet extends BaseComponent {
  getContent(): Locator {
    return this.root.locator('.oxd-sheet-content, .sheet-body').first()
  }

  getCloseButton(): Locator {
    return this.root.locator('button[aria-label="close"], i.bi-x').first()
  }

  async isOpen(): Promise<boolean> {
    return this.root.isVisible()
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/popup/sheet.ts
git commit -m "feat: add Sheet component"
```

---

## Task 21: Popup — Spinner

**Files:**
- Create: `src/locators/popup/spinner.ts`

- [ ] **Step 1: Create `src/locators/popup/spinner.ts`**

```typescript
import { BaseComponent } from '../baseComponent'

export class Spinner extends BaseComponent {
  async waitForHide(timeout = 10_000): Promise<void> {
    await this.root.waitFor({ state: 'hidden', timeout })
  }

  async isLoading(): Promise<boolean> {
    return this.root.isVisible()
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/popup/spinner.ts
git commit -m "feat: add Spinner component"
```

---

## Task 22: Popup — Tooltip

**Files:**
- Create: `src/locators/popup/tooltip.ts`

- [ ] **Step 1: Create `src/locators/popup/tooltip.ts`**

```typescript
import { BaseComponent } from '../baseComponent'

export class Tooltip extends BaseComponent {
  async getText(): Promise<string> {
    return (await this.root.innerText()).trim()
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible()
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/popup/tooltip.ts
git commit -m "feat: add Tooltip component"
```

---

## Task 23: Barrel Export

**Files:**
- Create: `src/locators/index.ts`

- [ ] **Step 1: Create `src/locators/index.ts`**

```typescript
export { BaseComponent } from './baseComponent'
export { Input } from './form/input'
export { InputNumber } from './form/inputNumber'
export { Button } from './form/button'
export { Checkbox } from './form/checkbox'
export { Radio } from './form/radio'
export { DropdownList } from './form/dropdownList'
export { DatePicker } from './form/datePicker'
export { Switch } from './form/switch'
export { Upload } from './form/upload'
export { Card } from './display/card'
export { Table } from './display/table'
export { Tag } from './display/tag'
export { Tabs } from './navigation/tabs'
export { Pagination } from './navigation/pagination'
export { Steps } from './navigation/steps'
export { Alert } from './popup/alert'
export { Dialog } from './popup/dialog'
export { Sheet } from './popup/sheet'
export { Spinner } from './popup/spinner'
export { Toast } from './popup/toast'
export { Tooltip } from './popup/tooltip'
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/locators/index.ts
git commit -m "feat: add locator component library barrel export"
```

---

## Task 24: Refactor LoginPage

**Files:**
- Modify: `src/pages/LoginPage.ts`

`LoginPage` uses:
- `Input` scoped to `body` for `getByName('username')` and `getByName('password')`
- `Button` scoped to `body` for `getByType('submit')`
- `Alert` scoped to `body` for error container and message

- [ ] **Step 1: Replace `src/pages/LoginPage.ts`**

```typescript
import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'
import type { User } from '../types'
import { Input, Button, Alert } from '../locators'

export class LoginPage extends BasePage {
  private readonly input = new Input(this.page.locator('body'))
  private readonly button = new Button(this.page.locator('body'))
  private readonly alert = new Alert(this.page.locator('body'))

  constructor(page: Page) {
    super(page)
  }

  async goto(): Promise<void> {
    await this.navigate('/web/index.php/auth/login')
  }

  async login(user: User): Promise<void> {
    await this.input.fillByName('username', user.username)
    await this.input.fillByName('password', user.password)
    await this.button.clickByType('submit')
  }

  async loginAndWait(user: User): Promise<void> {
    await this.login(user)
    await this.page.waitForURL(/\/web\/index\.php\/dashboard\/index/, { timeout: 15_000 })
  }

  async getErrorMessage(): Promise<string> {
    await this.alert.waitForVisible(5_000)
    return this.alert.getText()
  }

  async clearAndLogin(user: User): Promise<void> {
    await this.input.getByName('username').clear()
    await this.input.getByName('password').clear()
    await this.login(user)
  }

  async assertOnLoginPage(): Promise<void> {
    await this.assertURL(/\/web\/index\.php\/auth\/login/)
    await this.assertVisible(this.input.getByName('username'), 'username field should be visible')
    await this.assertVisible(this.input.getByName('password'), 'password field should be visible')
  }

  async assertLoginFailed(): Promise<void> {
    await expect(this.alert.getContainer()).toBeVisible({ timeout: 5_000 })
  }

  async assertLoggedIn(): Promise<void> {
    await this.assertURL(/\/web\/index\.php\/dashboard\/index/)
  }

  async assertRequiredValidation(): Promise<void> {
    await expect(
      this.page.locator('.oxd-input-group__message').first()
    ).toBeVisible({ timeout: 5_000 })
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/pages/LoginPage.ts
git commit -m "refactor: LoginPage — replace inline locators with Input, Button, Alert components"
```

---

## Task 25: Refactor DashboardPage

**Files:**
- Modify: `src/pages/DashboardPage.ts`

`DashboardPage` uses:
- `Tabs` scoped to `.oxd-main-menu` for sidebar navigation items
- `Card` scoped to `body` for widget lookups
- `Button` scoped to `.oxd-topbar` for user dropdown and logout

- [ ] **Step 1: Replace `src/pages/DashboardPage.ts`**

```typescript
import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { Tabs, Card, Button } from '../locators'

export class DashboardPage extends BasePage {
  private readonly mainMenuTabs = new Tabs(this.page.locator('.oxd-main-menu'))
  private readonly widgetCard = new Card(this.page.locator('body'))
  private readonly topbarButton = new Button(this.page.locator('.oxd-topbar'))

  private readonly dashboardHeader = this.page.locator(
    '.oxd-topbar-header-breadcrumb h6, .oxd-topbar-header-breadcrumb'
  )
  private readonly mainMenu = this.page.locator('.oxd-main-menu')
  private readonly userDropdownMenu = this.page.locator('.oxd-dropdown-menu')
  private readonly topbar = this.page.locator('.oxd-topbar')
  private readonly dashboardWidgets = this.page.locator(
    '.orangehrm-dashboard-widget, .oxd-grid-item--gutters'
  )

  constructor(page: Page) {
    super(page)
  }

  getMenuItemByText(label: string): Locator {
    return this.mainMenuTabs.getTab(label)
  }

  getQuickLaunchItem(label: string): Locator {
    return this.page.locator(
      `.quick-launch-item:has-text("${label}"), p:has-text("${label}")`
    )
  }

  getDashboardWidget(title: string): Locator {
    return this.widgetCard.getByTitle(title)
  }

  async goto(): Promise<void> {
    await this.navigate('/web/index.php/dashboard/index')
  }

  async navigateTo(menuLabel: string): Promise<void> {
    await this.mainMenuTabs.clickTab(menuLabel)
    await this.waitForPageLoad()
  }

  async openUserMenu(): Promise<void> {
    await this.topbarButton.getByClass('oxd-userdropdown-tab').click()
    await this.waitForVisible(this.userDropdownMenu)
  }

  async logout(): Promise<void> {
    await this.openUserMenu()
    await this.page.locator('a:has-text("Logout"), li:has-text("Logout")').last().click()
    await this.page.waitForURL(/\/web\/index\.php\/auth\/login/)
  }

  async getWidgetCount(): Promise<number> {
    return this.dashboardWidgets.count()
  }

  async getPageTitle(): Promise<string> {
    return this.getText(this.dashboardHeader)
  }

  async getMenuItemCount(): Promise<number> {
    return this.page.locator('.oxd-main-menu-item').count()
  }

  async assertOnDashboard(): Promise<void> {
    await this.assertURL(/\/web\/index\.php\/dashboard\/index/)
    await this.assertVisible(this.topbar, 'topbar should be visible')
  }

  async assertMainMenuVisible(): Promise<void> {
    await expect(this.mainMenu).toBeVisible()
  }

  async assertMenuItemVisible(label: string): Promise<void> {
    await expect(
      this.mainMenuTabs.getTab(label),
      `"${label}" menu item should be visible`
    ).toBeVisible()
  }

  async assertWidgetsLoaded(): Promise<void> {
    const count = await this.getWidgetCount()
    expect(count, 'Dashboard should have at least one widget').toBeGreaterThan(0)
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/pages/DashboardPage.ts
git commit -m "refactor: DashboardPage — replace inline locators with Tabs, Card, Button components"
```

---

## Task 26: Refactor EmployeeListPage

**Files:**
- Modify: `src/pages/EmployeeListPage.ts`

`EmployeeListPage` uses:
- `Table` scoped to `.oxd-table` for all row/action lookups
- `Input` scoped to `.oxd-table-filter-area, body` for search inputs
- `Button` scoped to `body` for add/search/reset buttons

- [ ] **Step 1: Replace `src/pages/EmployeeListPage.ts`**

```typescript
import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'
import type { SearchFilters } from '../types'
import { Table, Input, Button } from '../locators'

export class EmployeeListPage extends BasePage {
  private readonly table = new Table(this.page.locator('.oxd-table'))
  private readonly searchInput = new Input(this.page.locator('body'))
  private readonly actionButton = new Button(this.page.locator('body'))

  private readonly recordsFoundText = this.page.locator(
    '.oxd-text--span:has-text("Record"), span:has-text("Record")'
  ).first()

  constructor(page: Page) {
    super(page)
  }

  getRowByEmployeeName(name: string): Locator {
    return this.table.getRowByText(name)
  }

  getActionButtonInRow(name: string, action: 'Edit' | 'Delete'): Locator {
    return this.table.getActionButton(this.table.getRowByText(name), action)
  }

  async goto(): Promise<void> {
    await this.navigate('/web/index.php/pim/viewEmployeeList')
  }

  async searchByName(name: string): Promise<void> {
    await this.searchInput.fillByPlaceholder('Type for hints...', name)
    await this.waitForPageLoad()
  }

  async clickSearch(): Promise<void> {
    await this.actionButton.getByText('Search').click()
    await this.waitForPageLoad()
  }

  async searchEmployee(
    filters: Partial<Pick<SearchFilters, 'employeeName' | 'employeeId'>>
  ): Promise<void> {
    if (filters.employeeName) {
      await this.searchInput.fillByPlaceholder('Type for hints...', filters.employeeName)
    }
    if (filters.employeeId) {
      await this.searchInput.fillByLabel('Employee Id', filters.employeeId)
    }
    await this.actionButton.getByText('Search').click()
    await this.waitForPageLoad()
  }

  async resetSearch(): Promise<void> {
    await this.actionButton.getByType('reset').click()
    await this.waitForPageLoad()
  }

  async clickAddEmployee(): Promise<void> {
    await this.actionButton.getByText('Add').click()
    await this.page.waitForURL(/\/web\/index\.php\/pim\/addEmployee/)
  }

  async clickEditEmployee(name: string): Promise<void> {
    await this.table.getActionButton(this.table.getRowByText(name), 'Edit').click()
    await this.page.waitForURL(/\/web\/index\.php\/pim\/viewPersonalDetails/)
  }

  async clickDeleteEmployee(name: string): Promise<void> {
    await this.table.getActionButton(this.table.getRowByText(name), 'Delete').click()
  }

  async clickEmployeeRow(name: string): Promise<void> {
    await this.table.getRowByText(name).click()
  }

  async getEmployeeCount(): Promise<number> {
    return this.table.rowCount()
  }

  async getRecordsFoundText(): Promise<string> {
    if (await this.recordsFoundText.isVisible()) {
      return this.getText(this.recordsFoundText)
    }
    return ''
  }

  async getEmployeeNames(): Promise<string[]> {
    return this.table.getColumnValues(2)
  }

  async isTableVisible(): Promise<boolean> {
    return this.table.isVisible()
  }

  async assertTableVisible(): Promise<void> {
    await expect(
      this.page.locator('.oxd-table'),
      'Employee table should be visible'
    ).toBeVisible()
  }

  async assertEmployeeInList(name: string): Promise<void> {
    await expect(
      this.table.getRowByText(name),
      `Employee "${name}" should appear in the list`
    ).toBeVisible()
  }

  async assertEmployeeNotInList(name: string): Promise<void> {
    await expect(
      this.table.getRowByText(name),
      `Employee "${name}" should not appear in the list`
    ).not.toBeVisible()
  }

  async assertRecordsFound(): Promise<void> {
    const count = await this.getEmployeeCount()
    expect(count, 'Employee list should have at least one record').toBeGreaterThan(0)
  }

  async assertAddButtonVisible(): Promise<void> {
    await expect(
      this.actionButton.getByText('Add'),
      'Add button should be visible'
    ).toBeVisible()
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/pages/EmployeeListPage.ts
git commit -m "refactor: EmployeeListPage — replace inline locators with Table, Input, Button components"
```

---

## Task 27: Refactor EmployeeDetailPage

**Files:**
- Modify: `src/pages/EmployeeDetailPage.ts`

`EmployeeDetailPage` uses:
- `Input` scoped to `body` for name fields by `name` attribute
- `Button` scoped to `body` for save/cancel
- `Toast` scoped to `body` for success feedback
- `Tabs` scoped to `.orangehrm-tabs` for tab navigation

- [ ] **Step 1: Replace `src/pages/EmployeeDetailPage.ts`**

```typescript
import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { Input, Button, Toast, Tabs } from '../locators'

export class EmployeeDetailPage extends BasePage {
  private readonly input = new Input(this.page.locator('body'))
  private readonly button = new Button(this.page.locator('body'))
  private readonly toast = new Toast(this.page.locator('body'))
  private readonly tabs = new Tabs(
    this.page.locator('.orangehrm-tabs, .orangehrm-edit-employee-sidebar')
  )

  private readonly pageHeader = this.page.locator(
    '.oxd-topbar-header-breadcrumb h6, .orangehrm-edit-employee-name h6'
  ).first()

  constructor(page: Page) {
    super(page)
  }

  getFieldByLabel(label: string): Locator {
    return this.input.getByLabel(label)
  }

  getSelectByLabel(label: string): Locator {
    return this.page.locator(
      `//label[normalize-space()="${label}"]/../following-sibling::div//div[contains(@class,"oxd-select-text")]`
    )
  }

  async goto(empNumber: string | number): Promise<void> {
    await this.navigate(
      `/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`
    )
  }

  async gotoAddEmployee(): Promise<void> {
    await this.navigate('/web/index.php/pim/addEmployee')
  }

  async fillFirstName(value: string): Promise<void> {
    await this.input.fillByName('firstName', value)
  }

  async fillLastName(value: string): Promise<void> {
    await this.input.fillByName('lastName', value)
  }

  async fillMiddleName(value: string): Promise<void> {
    await this.input.fillByName('middleName', value)
  }

  async saveChanges(): Promise<void> {
    await this.button.getByText('Save').click()
    await this.toast.waitForSuccess(8_000)
  }

  async cancelChanges(): Promise<void> {
    await this.button.getByText('Cancel').click()
  }

  async navigateToTab(
    tabName: 'Personal Details' | 'Contact Details' | 'Job'
  ): Promise<void> {
    await this.tabs.clickTab(tabName)
    await this.waitForPageLoad()
  }

  async getFirstName(): Promise<string> {
    return this.input.getByName('firstName').inputValue()
  }

  async getLastName(): Promise<string> {
    return this.input.getByName('lastName').inputValue()
  }

  async getEmployeeId(): Promise<string> {
    return this.input.getByLabel('Employee Id').inputValue()
  }

  async getPageHeading(): Promise<string> {
    return this.getText(this.pageHeader)
  }

  async assertOnPersonalDetails(): Promise<void> {
    await this.assertURL(/\/web\/index\.php\/pim\/(viewPersonalDetails|addEmployee)/)
    await this.assertVisible(
      this.input.getByName('firstName'),
      'first name input should be visible'
    )
  }

  async assertSaveSuccess(): Promise<void> {
    await expect(
      this.toast.getByType('success'),
      'Success toast should be visible'
    ).toBeVisible({ timeout: 8_000 })
  }

  async assertFirstName(expected: string): Promise<void> {
    await expect(this.input.getByName('firstName')).toHaveValue(expected)
  }

  async assertLastName(expected: string): Promise<void> {
    await expect(this.input.getByName('lastName')).toHaveValue(expected)
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Final compile and run smoke tests**

Run: `npx tsc --noEmit`
Expected: no errors

Run: `npx playwright test --grep @smoke --project=chromium`
Expected: all smoke tests pass (Dashboard, Auth, Full E2E suites)

- [ ] **Step 4: Commit**

```bash
git add src/pages/EmployeeDetailPage.ts
git commit -m "refactor: EmployeeDetailPage — replace inline locators with Input, Button, Toast, Tabs components"
```
