import type {
  Browser,
  BrowserContext,
  BrowserType,
  Page} from '@playwright/test';
import {
  chromium,
  firefox,
  webkit,
} from '@playwright/test';
import { config } from './config';

type BrowserName = 'chromium' | 'firefox' | 'webkit';

const BROWSERS: Record<BrowserName, BrowserType> = { chromium, firefox, webkit };

export class BrowserManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;

  async launch(browserName: BrowserName = 'chromium'): Promise<Browser> {
    const engine = BROWSERS[browserName];
    this.browser = await engine.launch({ headless: config.headless });
    return this.browser;
  }

  async newContext(storageStatePath?: string): Promise<BrowserContext> {
    if (!this.browser) throw new Error('Call launch() before newContext()');

    this.context = await this.browser.newContext({
      baseURL: config.baseURL,
      ...(storageStatePath ? { storageState: storageStatePath } : {}),
    });

    this.context.setDefaultTimeout(config.actionTimeout);
    this.context.setDefaultNavigationTimeout(config.navigationTimeout);
    return this.context;
  }

  async newPage(): Promise<Page> {
    if (!this.context) throw new Error('Call newContext() before newPage()');
    return this.context.newPage();
  }

  async saveStorageState(filePath: string): Promise<void> {
    if (!this.context) throw new Error('No active context to save');
    await this.context.storageState({ path: filePath });
  }

  async closeContext(): Promise<void> {
    await this.context?.close();
    this.context = null;
  }

  async closeBrowser(): Promise<void> {
    await this.context?.close();
    await this.browser?.close();
    this.context = null;
    this.browser = null;
  }

  getBrowser(): Browser {
    if (!this.browser) throw new Error('No browser launched');
    return this.browser;
  }

  getContext(): BrowserContext {
    if (!this.context) throw new Error('No browser context created');
    return this.context;
  }
}
