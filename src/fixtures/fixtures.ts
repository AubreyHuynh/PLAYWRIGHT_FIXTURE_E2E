import type { APIRequestContext } from '@playwright/test';
import { test as base, request } from '@playwright/test';
import { config } from '../support/config';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EmployeeDetailPage } from '../pages/EmployeeDetailPage';
import { EmployeeListPage } from '../pages/EmployeeListPage';

// ── Fixture types ─────────────────────────────────────────────────────────────

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  employeeListPage: EmployeeListPage;
  employeeDetailPage: EmployeeDetailPage;
};

type ApiFixtures = {
  apiContext: APIRequestContext;
};

// ── Shared factory ────────────────────────────────────────────────────────────

async function createApiContext(storageState?: string): Promise<APIRequestContext> {
  return request.newContext({
    baseURL: config.apiBaseURL,
    ...(storageState ? { storageState } : {}),
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

// ── Unauthenticated fixture set ───────────────────────────────────────────────
// Use for login tests and flows that start without a session.

export const test = base.extend<PageFixtures & ApiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  employeeListPage: async ({ page }, use) => {
    await use(new EmployeeListPage(page));
  },

  employeeDetailPage: async ({ page }, use) => {
    await use(new EmployeeDetailPage(page));
  },

  apiContext: async (_ctx, use) => {
    const ctx = await createApiContext();
    await use(ctx);
    await ctx.dispose();
  },
});

// ── Authenticated fixture set ─────────────────────────────────────────────────
// Reuses saved auth state from global-setup — no re-login per test.

export const authTest = base.extend<PageFixtures & ApiFixtures>({
  storageState: config.authStatePath,

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await use(dashboard);
  },

  employeeListPage: async ({ page }, use) => {
    const empList = new EmployeeListPage(page);
    await empList.goto();
    await use(empList);
  },

  employeeDetailPage: async ({ page }, use) => {
    await use(new EmployeeDetailPage(page));
  },

  apiContext: async ({ storageState }, use) => {
    const ctx = await createApiContext(storageState as string);
    await use(ctx);
    await ctx.dispose();
  },
});

export { expect } from '@playwright/test';
