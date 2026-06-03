import type { Page } from '@playwright/test';
import type { BasePage } from '../pages/BasePage';
import { DashboardPage } from '../pages/DashboardPage';
import { EmployeeDetailPage } from '../pages/EmployeeDetailPage';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { LoginPage } from '../pages/LoginPage';

// ── Page registry ─────────────────────────────────────────────────────────────

type PageConstructor<T extends BasePage> = new (page: Page) => T;

interface PageRegistry {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  employeeListPage: EmployeeListPage;
  employeeDetailPage: EmployeeDetailPage;
}

type PageKey = keyof PageRegistry;

// ── PageManager ───────────────────────────────────────────────────────────────
// Lazily instantiates and caches page objects. Pass a new Page to reset().

export class PageManager {
  private cache = new Map<string, BasePage>();

  constructor(private page: Page) {}

  // ── Typed accessors (preferred) ───────────────────────────────────────────

  get loginPage(): LoginPage {
    return this.resolve('loginPage', LoginPage);
  }

  get dashboardPage(): DashboardPage {
    return this.resolve('dashboardPage', DashboardPage);
  }

  get employeeListPage(): EmployeeListPage {
    return this.resolve('employeeListPage', EmployeeListPage);
  }

  get employeeDetailPage(): EmployeeDetailPage {
    return this.resolve('employeeDetailPage', EmployeeDetailPage);
  }

  // ── Generic accessor ──────────────────────────────────────────────────────

  getPage<K extends PageKey>(key: K): PageRegistry[K] {
    const constructors: { [K in PageKey]: PageConstructor<PageRegistry[K]> } = {
      loginPage: LoginPage,
      dashboardPage: DashboardPage,
      employeeListPage: EmployeeListPage,
      employeeDetailPage: EmployeeDetailPage,
    };
    return this.resolve(key, constructors[key]) as PageRegistry[K];
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  reset(page: Page): void {
    this.page = page;
    this.cache.clear();
  }

  getCurrentPage(): Page {
    return this.page;
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  private resolve<T extends BasePage>(key: string, Ctor: PageConstructor<T>): T {
    if (!this.cache.has(key)) {
      this.cache.set(key, new Ctor(this.page));
    }
    return this.cache.get(key) as T;
  }
}
