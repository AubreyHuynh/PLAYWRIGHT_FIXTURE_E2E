import type { Page } from '@playwright/test';
import type { BasePage } from '../pages/BasePage';
import { CartPage } from '../pages/CartPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';

// ── Page registry ─────────────────────────────────────────────────────────────
// Maps string keys to page-object constructors for generic lookup.

type PageConstructor<T extends BasePage> = new (page: Page) => T;

interface PageRegistry {
  loginPage: LoginPage;
  homePage: HomePage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
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

  get homePage(): HomePage {
    return this.resolve('homePage', HomePage);
  }

  get productDetailPage(): ProductDetailPage {
    return this.resolve('productDetailPage', ProductDetailPage);
  }

  get cartPage(): CartPage {
    return this.resolve('cartPage', CartPage);
  }

  // ── Generic accessor ──────────────────────────────────────────────────────

  getPage<K extends PageKey>(key: K): PageRegistry[K] {
    const constructors: { [K in PageKey]: PageConstructor<PageRegistry[K]> } = {
      loginPage: LoginPage,
      homePage: HomePage,
      productDetailPage: ProductDetailPage,
      cartPage: CartPage,
    };
    return this.resolve(key, constructors[key]) as PageRegistry[K];
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  /** Replace the underlying Page and clear the cache (call between tests). */
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
