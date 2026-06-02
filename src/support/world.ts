import type { Browser, BrowserContext, Page } from '@playwright/test';
import { config } from './config';
import { PageManager } from './pageManager';

// ── World ─────────────────────────────────────────────────────────────────────
// Shared test context that holds browser, page, and page-manager references.
// One World instance per test worker; call reset() in beforeEach.

export class World {
  browser: Browser | null = null;
  context: BrowserContext | null = null;
  page: Page | null = null;
  pageManager: PageManager | null = null;

  /** Arbitrary data bag for sharing state between steps/fixtures. */
  readonly store = new Map<string, unknown>();

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  /** Wire up a Playwright Page (and its context/browser) into the world. */
  attach(page: Page): void {
    this.page = page;
    this.context = page.context();
    this.browser = this.context.browser() ?? null;
    this.pageManager = new PageManager(page);
  }

  /** Clear per-test state but keep browser/context if provided externally. */
  reset(): void {
    this.store.clear();
    if (this.page && this.pageManager) {
      this.pageManager.reset(this.page);
    }
  }

  // ── Store helpers ─────────────────────────────────────────────────────────

  set<T>(key: string, value: T): void {
    this.store.set(key, value);
  }

  get<T>(key: string): T {
    if (!this.store.has(key)) throw new Error(`World store: key "${key}" not found`);
    return this.store.get(key) as T;
  }

  getOrDefault<T>(key: string, fallback: T): T {
    return this.store.has(key) ? (this.store.get(key) as T) : fallback;
  }

  // ── Accessors (throw if not attached) ────────────────────────────────────

  getPage(): Page {
    if (!this.page) throw new Error('World has no Page — call attach(page) first');
    return this.page;
  }

  getContext(): BrowserContext {
    if (!this.context) throw new Error('World has no BrowserContext');
    return this.context;
  }

  getPageManager(): PageManager {
    if (!this.pageManager) throw new Error('World has no PageManager — call attach(page) first');
    return this.pageManager;
  }

  // ── Config passthrough ────────────────────────────────────────────────────

  get baseURL(): string {
    return config.baseURL;
  }
}
