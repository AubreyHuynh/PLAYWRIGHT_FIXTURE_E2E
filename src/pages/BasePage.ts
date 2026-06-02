import type { Page, Locator} from '@playwright/test';
import { expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  // ── Navigation ────────────────────────────────────────────────────────────

  async navigate(path: string = '/'): Promise<void> {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // ── Interaction wrappers (with built-in waits + logging) ──────────────────

  async click(locator: Locator, label = 'element'): Promise<void> {
    console.log(`  → click: ${label}`);
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fill(locator: Locator, value: string, label = 'field'): Promise<void> {
    console.log(`  → fill "${label}" = "${value}"`);
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(value);
  }

  async selectOption(locator: Locator, value: string, label = 'select'): Promise<void> {
    console.log(`  → select "${label}" = "${value}"`);
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  async hover(locator: Locator, label = 'element'): Promise<void> {
    console.log(`  → hover: ${label}`);
    await locator.hover();
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent())?.trim() ?? '';
  }

  async getAttributeValue(locator: Locator, attr: string): Promise<string | null> {
    await locator.waitFor({ state: 'visible' });
    return locator.getAttribute(attr);
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async getCount(locator: Locator): Promise<number> {
    return locator.count();
  }

  // ── Waits ─────────────────────────────────────────────────────────────────

  async waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForHidden(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  async waitForURL(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern);
  }

  // ── Dialog handling ───────────────────────────────────────────────────────

  async acceptNextDialog(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
  }

  async dismissNextDialog(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.dismiss());
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  async assertText(locator: Locator, expected: string): Promise<void> {
    await expect(locator).toHaveText(expected);
  }

  async assertURL(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }

  // ── Utilities ─────────────────────────────────────────────────────────────

  async scrollTo(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /** Parse currency string like "$12.99" → 12.99 */
  protected parsePrice(text: string): number {
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }
}
