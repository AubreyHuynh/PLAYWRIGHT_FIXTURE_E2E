import type { APIRequestContext} from '@playwright/test';
import { test as base, request } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/HomePage';
import { EmployeeDetailPage } from '../pages/ProductDetailPage';
import { EmployeeListPage } from '../pages/CartPage';

// ── Fixture types ─────────────────────────────────────────────────────────────

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  employeeListPage: EmployeeListPage;
  employeeDetailPage: EmployeeDetailPage;
  // Aliases kept for backward compatibility
  homePage: DashboardPage;
  cartPage: EmployeeListPage;
  productDetailPage: EmployeeDetailPage;
};

type ApiFixtures = {
  apiContext: APIRequestContext;
};

// ── Unauthenticated fixture set ───────────────────────────────────────────────
// Use for login tests and flows that start without a session.

export const test = base.extend<PageFixtures & ApiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  employeeListPage: async ({ page }, use) => {
    await use(new EmployeeListPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new EmployeeListPage(page));
  },

  employeeDetailPage: async ({ page }, use) => {
    await use(new EmployeeDetailPage(page));
  },

  productDetailPage: async ({ page }, use) => {
    await use(new EmployeeDetailPage(page));
  },

  apiContext: async (_ctx, use) => {
    const ctx = await request.newContext({
      baseURL: process.env.API_BASE_URL || process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    await use(ctx);
    await ctx.dispose();
  },
});

// ── Authenticated fixture set ─────────────────────────────────────────────────
// Reuses saved auth state from global-setup — no re-login per test.

export const authTest = base.extend<PageFixtures & ApiFixtures>({
  storageState: '.auth/user.json',

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await use(dashboard);
  },

  homePage: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await use(dashboard);
  },

  employeeListPage: async ({ page }, use) => {
    const empList = new EmployeeListPage(page);
    await empList.goto();
    await use(empList);
  },

  cartPage: async ({ page }, use) => {
    const empList = new EmployeeListPage(page);
    await empList.goto();
    await use(empList);
  },

  employeeDetailPage: async ({ page }, use) => {
    await use(new EmployeeDetailPage(page));
  },

  productDetailPage: async ({ page }, use) => {
    await use(new EmployeeDetailPage(page));
  },

  apiContext: async ({ storageState }, use) => {
    const ctx = await request.newContext({
      baseURL: process.env.API_BASE_URL || process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
      storageState: storageState as string,
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    await use(ctx);
    await ctx.dispose();
  },
});

export { expect } from '@playwright/test';
