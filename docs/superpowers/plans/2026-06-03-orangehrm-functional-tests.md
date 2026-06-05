# OrangeHRM Functional & Visual Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `tests/e2e/orangehrm-functional.spec.ts` with 5 test suites covering login validation, sidebar active state, employee form validation, button visual states, and typography baseline — using class checks for semantic error states and `toHaveCSS()` for brand colors.

**Architecture:** New spec file imports both `test` (unauthenticated) and `authTest` (authenticated) fixtures. POM additions expose Locator getters on LoginPage, DashboardPage, and EmployeeDetailPage so tests can call `toHaveCSS()` / `toHaveClass()` directly on returned locators.

**Tech Stack:** Playwright Test, TypeScript, OrangeHRM demo (opensource-demo.orangehrmlive.com)

---

### Task 1: Add Locator helpers to LoginPage

**Files:**
- Modify: `src/pages/LoginPage.ts`

- [ ] **Step 1: Add four public methods after the existing `assertRequiredValidation` method**

Open `src/pages/LoginPage.ts` and add the following methods inside the class body, after line 60 (`assertRequiredValidation`):

```typescript
  getUsernameInput(): Locator {
    return this.input.getByName('username')
  }

  getPasswordInput(): Locator {
    return this.input.getByName('password')
  }

  getRequiredMessage(index = 0): Locator {
    return this.page.locator('.oxd-input-group__message').nth(index)
  }

  getAlertMessage(): Locator {
    return this.alert.getMessage()
  }

  async submitEmpty(): Promise<void> {
    await this.button.clickByType('submit')
  }
```

Also add `Locator` to the import at line 1 so it reads:

```typescript
import type { Page, Locator } from '@playwright/test'
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 2: Add Locator helpers to DashboardPage

**Files:**
- Modify: `src/pages/DashboardPage.ts`

- [ ] **Step 1: Add two public methods after the existing `assertWidgetsLoaded` method (line 89)**

Open `src/pages/DashboardPage.ts` and append inside the class body:

```typescript
  getMenuItem(label: string): Locator {
    return this.page.locator(`.oxd-main-menu-item:has-text("${label}")`)
  }

  getDashboardHeading(): Locator {
    return this.page.locator('.oxd-topbar-header-breadcrumb h6').first()
  }
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 3: Add Locator helpers to EmployeeDetailPage

**Files:**
- Modify: `src/pages/EmployeeDetailPage.ts`

- [ ] **Step 1: Add five public methods after the existing `assertLastName` method (line 107)**

Open `src/pages/EmployeeDetailPage.ts` and append inside the class body:

```typescript
  getFirstNameInput(): Locator {
    return this.input.getByName('firstName')
  }

  getLastNameInput(): Locator {
    return this.input.getByName('lastName')
  }

  getFieldErrorMessage(fieldName: string): Locator {
    return this.page.locator(
      `xpath=//input[@name="${fieldName}"]/ancestor::div[contains(@class,"oxd-input-group")]` +
      `//span[contains(@class,"oxd-input-group__message")]`
    )
  }

  getSaveButton(): Locator {
    return this.button.getByText('Save')
  }

  getCancelButton(): Locator {
    return this.button.getByText('Cancel')
  }

  async clickSaveWithoutFilling(): Promise<void> {
    await this.button.getByText('Save').click()
  }
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 4: Create orangehrm-functional.spec.ts

**Files:**
- Create: `tests/e2e/orangehrm-functional.spec.ts`

- [ ] **Step 1: Create the file with all 5 suites**

```typescript
/**
 * E2E suite: OrangeHRM — Functional & Visual checks
 *
 * Flows covered:
 *   Login Validation · Sidebar Active State · Employee Form Validation
 *   Button Visual States · Typography Baseline
 *
 * Unauthenticated suites use `test`; authenticated suites use `authTest`.
 */

import { test, authTest, expect } from '../../src/fixtures/fixtures'

// ── Suite 1: Login Validation ───────────────────────────────────────────────

test.describe('Login Validation @smoke', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto()
  })

  test('should show Required messages on empty submit', async ({ loginPage }) => {
    await loginPage.submitEmpty()
    await expect(loginPage.getRequiredMessage(0), 'username Required message').toBeVisible()
    await expect(loginPage.getRequiredMessage(1), 'password Required message').toBeVisible()
  })

  test('required message text should read "Required"', async ({ loginPage }) => {
    await loginPage.submitEmpty()
    await expect(loginPage.getRequiredMessage(0)).toHaveText('Required')
    await expect(loginPage.getRequiredMessage(1)).toHaveText('Required')
  })

  test('required message text should be red', async ({ loginPage }) => {
    await loginPage.submitEmpty()
    await expect(loginPage.getRequiredMessage(0)).toHaveCSS('color', 'rgb(235, 9, 16)')
  })

  test('username input should have error class on empty submit', async ({ loginPage }) => {
    await loginPage.submitEmpty()
    await expect(loginPage.getUsernameInput()).toHaveClass(/oxd-input--error/)
  })

  test('password input should have error class on empty submit', async ({ loginPage }) => {
    await loginPage.submitEmpty()
    await expect(loginPage.getPasswordInput()).toHaveClass(/oxd-input--error/)
  })

  test('should show error alert on wrong credentials', async ({ loginPage }) => {
    await loginPage.login({ username: 'invalid_user_xyz', password: 'wrong_pass_xyz' })
    await expect(loginPage.getAlertMessage()).toBeVisible({ timeout: 8_000 })
  })
})

// ── Suite 2: Sidebar Active State ───────────────────────────────────────────

authTest.describe('Sidebar Active State @regression', () => {
  test('active menu item should gain active class after navigation to PIM', async ({
    dashboardPage,
  }) => {
    await dashboardPage.navigateTo('PIM')
    await expect(dashboardPage.getMenuItem('PIM')).toHaveClass(/active/)
  })

  test('active menu item should gain active class after navigation to Admin', async ({
    dashboardPage,
  }) => {
    await dashboardPage.navigateTo('Admin')
    await expect(dashboardPage.getMenuItem('Admin')).toHaveClass(/active/)
  })

  test('active menu item background should differ from inactive item background', async ({
    dashboardPage,
  }) => {
    await dashboardPage.navigateTo('PIM')
    const activeBg = await dashboardPage.getMenuItem('PIM').evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    )
    const inactiveBg = await dashboardPage.getMenuItem('Leave').evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    )
    expect(activeBg, 'active item background should differ from inactive').not.toBe(inactiveBg)
  })
})

// ── Suite 3: Employee Form Validation ───────────────────────────────────────

authTest.describe('Employee Form Validation @regression', () => {
  test.beforeEach(async ({ employeeDetailPage }) => {
    await employeeDetailPage.gotoAddEmployee()
  })

  test('should show Required on empty Save for firstName', async ({ employeeDetailPage }) => {
    await employeeDetailPage.clickSaveWithoutFilling()
    await expect(
      employeeDetailPage.getFieldErrorMessage('firstName'),
      'firstName Required message'
    ).toBeVisible()
  })

  test('should show Required on empty Save for lastName', async ({ employeeDetailPage }) => {
    await employeeDetailPage.clickSaveWithoutFilling()
    await expect(
      employeeDetailPage.getFieldErrorMessage('lastName'),
      'lastName Required message'
    ).toBeVisible()
  })

  test('firstName error message should read "Required"', async ({ employeeDetailPage }) => {
    await employeeDetailPage.clickSaveWithoutFilling()
    await expect(employeeDetailPage.getFieldErrorMessage('firstName')).toHaveText('Required')
  })

  test('lastName error message should read "Required"', async ({ employeeDetailPage }) => {
    await employeeDetailPage.clickSaveWithoutFilling()
    await expect(employeeDetailPage.getFieldErrorMessage('lastName')).toHaveText('Required')
  })

  test('firstName input should get error class on empty Save', async ({ employeeDetailPage }) => {
    await employeeDetailPage.clickSaveWithoutFilling()
    await expect(employeeDetailPage.getFirstNameInput()).toHaveClass(/oxd-input--error/)
  })

  test('lastName input should get error class on empty Save', async ({ employeeDetailPage }) => {
    await employeeDetailPage.clickSaveWithoutFilling()
    await expect(employeeDetailPage.getLastNameInput()).toHaveClass(/oxd-input--error/)
  })

  test('field error message should be red', async ({ employeeDetailPage }) => {
    await employeeDetailPage.clickSaveWithoutFilling()
    await expect(employeeDetailPage.getFieldErrorMessage('firstName')).toHaveCSS(
      'color',
      'rgb(235, 9, 16)'
    )
  })
})

// ── Suite 4: Button Visual States ───────────────────────────────────────────

authTest.describe('Button Visual States @regression', () => {
  test.beforeEach(async ({ employeeDetailPage }) => {
    await employeeDetailPage.gotoAddEmployee()
  })

  test('Save button should have brand orange background', async ({ employeeDetailPage }) => {
    await expect(employeeDetailPage.getSaveButton()).toHaveCSS(
      'background-color',
      'rgb(255, 112, 0)'
    )
  })

  test('Cancel button background should differ from Save button', async ({
    employeeDetailPage,
  }) => {
    const saveBg = await employeeDetailPage.getSaveButton().evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    )
    const cancelBg = await employeeDetailPage.getCancelButton().evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    )
    expect(saveBg, 'Save and Cancel backgrounds should differ').not.toBe(cancelBg)
  })
})

// ── Suite 5: Typography Baseline ────────────────────────────────────────────

authTest.describe('Typography Baseline @regression', () => {
  test('dashboard h6 heading should have font-weight 700', async ({ dashboardPage }) => {
    await expect(dashboardPage.getDashboardHeading()).toHaveCSS('font-weight', '700')
  })

  test('dashboard h6 heading should carry oxd-text--h6 class', async ({ dashboardPage }) => {
    await expect(dashboardPage.getDashboardHeading()).toHaveClass(/oxd-text--h6/)
  })
})
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run the new spec in headed mode to verify CSS values**

```bash
npx playwright test tests/e2e/orangehrm-functional.spec.ts --headed
```

If `toHaveCSS` assertions fail with a color mismatch (e.g. the error red is `rgb(255, 0, 0)` instead of `rgb(235, 9, 16)`), open browser DevTools on the live demo, inspect the failing element, copy the computed `color` value, and update the three `toHaveCSS('color', ...)` and one `toHaveCSS('background-color', ...)` calls in the spec to match.

- [ ] **Step 4: Run full suite headlessly and confirm green**

```bash
npx playwright test tests/e2e/orangehrm-functional.spec.ts
```

Expected: all tests pass (or any failures are only due to network flakiness from the live demo — re-run once before investigating).

- [ ] **Step 5: Commit**

```bash
git add src/pages/LoginPage.ts src/pages/DashboardPage.ts src/pages/EmployeeDetailPage.ts tests/e2e/orangehrm-functional.spec.ts
git commit -m "feat: add functional & visual test suite for OrangeHRM"
```

---

## Self-Review

### Spec coverage
| Designed feature | Task |
|---|---|
| Login Validation — Required messages visible | Task 4, Suite 1 |
| Login Validation — error class on inputs | Task 4, Suite 1 |
| Login Validation — error text color (red) | Task 4, Suite 1 |
| Login Validation — wrong credentials alert | Task 4, Suite 1 |
| Sidebar active state — class check | Task 4, Suite 2 |
| Sidebar active state — background color diff | Task 4, Suite 2 |
| Employee form validation — Required visible | Task 4, Suite 3 |
| Employee form validation — error class | Task 4, Suite 3 |
| Employee form validation — error color | Task 4, Suite 3 |
| Button visual — Save orange background | Task 4, Suite 4 |
| Button visual — Cancel differs from Save | Task 4, Suite 4 |
| Typography — h6 font-weight 700 | Task 4, Suite 5 |
| Typography — h6 carries oxd-text--h6 class | Task 4, Suite 5 |

### Placeholder scan
No TBDs, TODOs, or vague steps present.

### Type consistency
- `getUsernameInput()` / `getPasswordInput()` → return `Locator` ✓
- `getRequiredMessage(index)` → `Locator` ✓
- `getAlertMessage()` → `Locator` ✓
- `submitEmpty()` → `Promise<void>` ✓
- `getMenuItem(label)` → `Locator` ✓
- `getDashboardHeading()` → `Locator` ✓
- `getFirstNameInput()` / `getLastNameInput()` → `Locator` ✓
- `getFieldErrorMessage(fieldName)` → `Locator` ✓
- `getSaveButton()` / `getCancelButton()` → `Locator` ✓
- `clickSaveWithoutFilling()` → `Promise<void>` ✓
