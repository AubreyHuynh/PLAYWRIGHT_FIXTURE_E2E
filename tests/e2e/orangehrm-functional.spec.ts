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
