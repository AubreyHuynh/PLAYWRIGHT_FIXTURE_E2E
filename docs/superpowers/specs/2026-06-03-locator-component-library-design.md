# Locator Component Library Design

**Date:** 2026-06-03  
**Project:** OrangeHRM Playwright TypeScript E2E  
**Status:** Approved

---

## Overview

Rebuild a typed component library under `src/locators/` that wraps Playwright `Locator` with dynamic, strategy-aware methods. Each component receives a scoped root `Locator` and exposes child locators using the most stable selector strategy for that element type (XPath axes, id, name, class, text). All four existing page objects are fully refactored to use components instead of inline selectors.

---

## Goals

- Replace scattered inline XPath/CSS strings in page objects with reusable, named component classes
- Establish consistent locator strategies per element type
- Keep page objects thin: they own component instances and action methods, not raw selector strings
- Support dynamic text-driven and index-driven locator resolution at runtime

---

## Directory Structure

```
src/locators/
├── baseComponent.ts
├── form/
│   ├── input.ts
│   ├── inputNumber.ts
│   ├── button.ts
│   ├── checkbox.ts
│   ├── radio.ts
│   ├── dropdownList.ts
│   ├── datePicker.ts
│   ├── switch.ts
│   └── upload.ts
├── display/
│   ├── card.ts
│   ├── table.ts
│   └── tag.ts
├── navigation/
│   ├── tabs.ts
│   ├── pagination.ts
│   └── steps.ts
├── popup/
│   ├── alert.ts
│   ├── dialog.ts
│   ├── sheet.ts
│   ├── spinner.ts
│   ├── toast.ts
│   └── tooltip.ts
└── index.ts
```

---

## BaseComponent

All components extend `BaseComponent`. The constructor receives a scoped `Locator` stored as `root`. All child locators chain off `this.root`.

```typescript
export abstract class BaseComponent {
  constructor(protected readonly root: Locator) {}

  isVisible(): Promise<boolean>
  waitForVisible(timeout?: number): Promise<void>
  waitForHidden(timeout?: number): Promise<void>
  count(): Promise<number>
  scrollIntoView(): Promise<void>
}
```

---

## Locator Strategy Reference

| Use Case | Strategy | Example |
|---|---|---|
| Label → field relationship | XPath axes (`following-sibling`, `ancestor`) | `//label[normalize-space()="Name"]/following-sibling::input` |
| Unique form fields | `name` or `id` attribute | `input[name="firstName"]` |
| OrangeHRM styled elements | `oxd-` class selectors | `.oxd-table-row--clickable` |
| Row/cell by dynamic text | XPath `normalize-space()` + `text()` | `//div[contains(@class,"oxd-table-row") and .//div[normalize-space()="John"]]` |
| nth element | Playwright `.nth(index)` | `.nth(0)` |
| Button by purpose | `type` attribute or XPath `normalize-space()` | `button[type="submit"]` |

---

## Component Specifications

### Form Components

#### `Input`
```typescript
class Input extends BaseComponent {
  // Locator resolvers — callers can chain .fill() / .inputValue() directly
  getByLabel(label: string): Locator       // XPath axes: label → following-sibling input
  getByName(name: string): Locator         // input[name="..."]
  getByClass(cls: string): Locator         // .cls
  getByPlaceholder(text: string): Locator  // input[placeholder="..."]
  // Convenience action methods (accept string key, resolve locator internally)
  fillByLabel(label: string, value: string): Promise<void>
  fillByName(name: string, value: string): Promise<void>
  fillByPlaceholder(placeholder: string, value: string): Promise<void>
  getValueByLabel(label: string): Promise<string>
  expectError(label: string, message: string): Promise<void>  // XPath axes: label → sibling error span
}
```

#### `InputNumber`
```typescript
class InputNumber extends BaseComponent {
  // Targets numeric inputs (.oxd-input paired with spinbutton role or input[type="number"])
  getByLabel(label: string): Locator       // XPath axes: label → following-sibling input
  getByName(name: string): Locator         // input[name="..."]
  fillByLabel(label: string, value: number): Promise<void>
  getValueByLabel(label: string): Promise<number>
}

#### `Button`
```typescript
class Button extends BaseComponent {
  getByText(text: string): Locator          // XPath normalize-space()
  getByType(type: string): Locator          // button[type="..."]
  getByClass(cls: string): Locator          // button.cls
  clickByText(text: string): Promise<void>
  clickByType(type: string): Promise<void>
  isDisabledByText(text: string): Promise<boolean>
}
```

#### `Checkbox`
```typescript
class Checkbox extends BaseComponent {
  getByLabel(label: string): Locator        // XPath axes: label → input[type="checkbox"]
  check(locator: Locator): Promise<void>
  uncheck(locator: Locator): Promise<void>
  isChecked(locator: Locator): Promise<boolean>
}
```

#### `Radio`
```typescript
class Radio extends BaseComponent {
  getByLabel(label: string): Locator        // XPath axes: label → input[type="radio"]
  select(locator: Locator): Promise<void>
  isSelected(locator: Locator): Promise<boolean>
}
```

#### `DropdownList`
```typescript
class DropdownList extends BaseComponent {
  getTrigger(): Locator                     // .oxd-select-text
  getOption(text: string): Locator          // XPath: oxd-select-option + normalize-space()
  select(text: string): Promise<void>       // click trigger → click option
  getSelected(): Promise<string>
}
```

#### `DatePicker`
```typescript
class DatePicker extends BaseComponent {
  getInput(): Locator                       // input.oxd-date-input or input[placeholder]
  getCalendarToggle(): Locator              // button or icon within root
  selectDate(value: string): Promise<void>  // fill input directly or open calendar
  getValue(): Promise<string>
}
```

#### `Switch`
```typescript
class Switch extends BaseComponent {
  getToggle(): Locator                      // input[type="checkbox"].oxd-switch-input
  toggle(): Promise<void>
  isOn(): Promise<boolean>
}
```

#### `Upload`
```typescript
class Upload extends BaseComponent {
  getInput(): Locator                       // input[type="file"]
  uploadFile(path: string): Promise<void>
}
```

---

### Display Components

#### `Table`
```typescript
class Table extends BaseComponent {
  getAllRows(): Locator                                     // .oxd-table-row--clickable
  getRow(index: number): Locator                          // .nth(index)
  getRowByText(text: string): Locator                     // XPath: row containing cell text
  getCell(rowLocator: Locator, colIndex: number): Locator // nth child div in row
  getActionButton(rowLocator: Locator, action: string): Locator // XPath: button by text in row
  getColumnValues(colIndex: number): Promise<string[]>    // extract all values in a column
  rowCount(): Promise<number>
}
```

#### `Card`
```typescript
class Card extends BaseComponent {
  getTitle(): Locator                       // .oxd-text--h6 or heading within root
  getBody(): Locator                        // root content area
  getByTitle(title: string): Locator        // XPath text() match on card title
}
```

#### `Tag`
```typescript
class Tag extends BaseComponent {
  getByText(text: string): Locator          // XPath normalize-space()
  getText(): Promise<string>
  getAllTexts(): Promise<string[]>
}
```

---

### Navigation Components

#### `Tabs`
```typescript
class Tabs extends BaseComponent {
  getTab(label: string): Locator            // XPath: tab by normalize-space()
  getActiveTab(): Locator                   // .oxd-tab-link--active or aria-selected
  clickTab(label: string): Promise<void>
  getActiveTabLabel(): Promise<string>
}
```

#### `Pagination`
```typescript
class Pagination extends BaseComponent {
  getNextButton(): Locator                  // button or icon for next page
  getPrevButton(): Locator                  // button or icon for prev page
  getPageButton(num: number): Locator       // XPath text() match on page number
  getCurrentPage(): Promise<number>
  goToPage(num: number): Promise<void>
}
```

#### `Steps`
```typescript
class Steps extends BaseComponent {
  getStep(label: string): Locator           // XPath normalize-space()
  getActiveStep(): Locator                  // active/current step indicator
  getStepByIndex(index: number): Locator    // nth step
}
```

---

### Popup Components

#### `Toast`
```typescript
class Toast extends BaseComponent {
  getByType(type: 'success' | 'error' | 'warn' | 'info'): Locator  // .oxd-toast--{type}
  getMessage(): Locator                     // .oxd-toast-content--text-message
  waitForSuccess(timeout?: number): Promise<void>
  waitForError(timeout?: number): Promise<void>
}
```

#### `Alert`
```typescript
class Alert extends BaseComponent {
  getContainer(): Locator                   // .oxd-alert
  getMessage(): Locator                     // .oxd-alert-content-text
  isError(): Promise<boolean>               // checks .oxd-alert--error class
  getText(): Promise<string>
}
```

#### `Dialog`
```typescript
class Dialog extends BaseComponent {
  getTitle(): Locator                       // .oxd-dialog-title or h6 within root
  getConfirmButton(text: string): Locator   // XPath button by text
  getCancelButton(text: string): Locator    // XPath button by text
  isOpen(): Promise<boolean>
  close(): Promise<void>
}
```

#### `Sheet`
```typescript
class Sheet extends BaseComponent {
  getContent(): Locator                     // root content area
  getCloseButton(): Locator                 // close icon or button
  isOpen(): Promise<boolean>
}
```

#### `Spinner`
```typescript
class Spinner extends BaseComponent {
  waitForHide(timeout?: number): Promise<void>  // wait until spinner gone
  isLoading(): Promise<boolean>
}
```

#### `Tooltip`
```typescript
class Tooltip extends BaseComponent {
  getText(): Promise<string>
  isVisible(): Promise<boolean>
}
```

---

## Page Object Refactor

All four page objects replace inline selectors with component instances. Components are declared as `readonly` properties on the page class.

### Pattern

```typescript
// Page object declares components
readonly table = new Table(this.page.locator('.oxd-table'))
readonly addButton = new Button(this.page.locator('button:has-text("Add")'))
readonly toast = new Toast(this.page.locator('.oxd-toast-container'))

// Action methods use component methods
async clickEditEmployee(name: string) {
  const row = this.table.getRowByText(name)
  await this.table.getActionButton(row, 'Edit').click()
}
```

### Pages to Refactor

| Page | Key Components Used |
|---|---|
| `LoginPage` | `Input` (username/password), `Button` (submit), `Alert` (error) |
| `DashboardPage` | `Tabs` (menu items), `Card` (widgets), `Button` (user dropdown) |
| `EmployeeListPage` | `Table` (employee list), `Input` (search), `Button` (add/search/reset) |
| `EmployeeDetailPage` | `Input` (name fields), `Button` (save/cancel), `Toast` (success), `Tabs` (navigation) |

---

## Barrel Export (`src/locators/index.ts`)

All components exported from a single entry point:

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

---

## Out of Scope

- Changes to `playwright.config.ts`, `fixtures.ts`, `pageManager.ts`, or `global-setup.ts`
- Adding new test cases
- Changes to `test-data/` or `types/`
