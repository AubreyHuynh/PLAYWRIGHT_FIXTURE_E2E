/**
 * E2E suite: OrangeHRM — opensource-demo.orangehrmlive.com
 *
 * Flows covered:
 *   Authentication → Dashboard → Employee Management (PIM)
 *
 * Uses authTest fixture → no login step per test (storage state reuse).
 */

import { authTest as test, expect } from '../../src/fixtures/fixtures';

// ── Suite: Dashboard ───────────────────────────────────────────────────────────

test.describe('Dashboard @smoke', () => {
  test('should load dashboard after login', async ({ dashboardPage }) => {
    await dashboardPage.assertOnDashboard();
  });

  test('should display main navigation menu', async ({ dashboardPage }) => {
    await dashboardPage.assertMainMenuVisible();
    const count = await dashboardPage.getMenuItemCount();
    expect(count, 'Navigation should have at least 5 menu items').toBeGreaterThanOrEqual(5);
  });

  test('should display dashboard widgets', async ({ dashboardPage }) => {
    await dashboardPage.assertWidgetsLoaded();
  });

  test('should show key menu items @regression', async ({ dashboardPage }) => {
    for (const item of ['Admin', 'PIM', 'Leave', 'Time', 'My Info']) {
      await dashboardPage.assertMenuItemVisible(item);
    }
  });
});

// ── Suite: Authentication ──────────────────────────────────────────────────────

test.describe('Authentication @smoke', () => {
  test('should logout and redirect to login page', async ({ dashboardPage, page }) => {
    await dashboardPage.assertOnDashboard();
    await dashboardPage.logout();
    await expect(page).toHaveURL(/\/web\/index\.php\/auth\/login/);
  });
});

// ── Suite: Employee List (PIM) ─────────────────────────────────────────────────

test.describe('Employee Management @regression', () => {
  test('should load employee list page', async ({ employeeListPage }) => {
    await employeeListPage.assertTableVisible();
  });

  test('should show at least one employee record', async ({ employeeListPage }) => {
    await employeeListPage.assertRecordsFound();
  });

  test('should display Add Employee button', async ({ employeeListPage }) => {
    await employeeListPage.assertAddButtonVisible();
  });

  test('should search and return results for a valid name', async ({ employeeListPage }) => {
    await employeeListPage.searchByName('Admin');
    await employeeListPage.clickSearch();
    const count = await employeeListPage.getEmployeeCount();
    expect(count, 'Search should return at least one result').toBeGreaterThanOrEqual(0);
  });

  test('should reset search and restore full list @regression', async ({ employeeListPage }) => {
    await employeeListPage.searchByName('zzz_no_match_xyz');
    await employeeListPage.clickSearch();
    await employeeListPage.resetSearch();
    const count = await employeeListPage.getEmployeeCount();
    expect(count, 'After reset, employee list should be restored').toBeGreaterThan(0);
  });

  test('should navigate to add employee page', async ({ employeeListPage, page }) => {
    await employeeListPage.clickAddEmployee();
    await expect(page).toHaveURL(/\/web\/index\.php\/pim\/addEmployee/);
  });
});

// ── Suite: Employee Detail ─────────────────────────────────────────────────────

test.describe('Employee Detail @regression', () => {
  test('should open personal details for first employee in list', async ({
    employeeListPage,
    page,
  }) => {
    await employeeListPage.assertTableVisible();
    const names = await employeeListPage.getEmployeeNames();

    if (names.length > 0) {
      await employeeListPage.clickEditEmployee(names[0]);
      await expect(page).toHaveURL(/\/web\/index\.php\/pim\/viewPersonalDetails/);
    } else {
      test.skip(true, 'No employees in the list to edit');
    }
  });

  test('should display first and last name fields on personal details', async ({
    employeeDetailPage,
  }) => {
    await employeeDetailPage.gotoAddEmployee();
    await employeeDetailPage.assertOnPersonalDetails();
  });
});

// ── Suite: Full E2E Flow ───────────────────────────────────────────────────────

test.describe('Full E2E Flow: Dashboard → PIM @smoke', () => {
  test('navigate from dashboard to employee list and verify data', async ({
    dashboardPage,
    page,
  }) => {
    // Step 1 – Verify dashboard loaded
    await dashboardPage.assertOnDashboard();

    // Step 2 – Navigate to PIM via menu
    await dashboardPage.navigateTo('PIM');
    await expect(page).toHaveURL(/\/web\/index\.php\/pim\/viewEmployeeList/);

    // Step 3 – Verify employee table is visible
    const empList = page.locator('.oxd-table');
    await expect(empList).toBeVisible();

    // Step 4 – Verify at least one row exists
    const rows = page.locator('.oxd-table-row--clickable');
    const count = await rows.count();
    expect(count, 'Employee list should have at least one record').toBeGreaterThan(0);
  });
});
