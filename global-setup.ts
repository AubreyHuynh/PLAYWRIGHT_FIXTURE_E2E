import type { FullConfig } from '@playwright/test';
import { chromium } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { config } from './src/support/config';
import { LoginPage } from './src/pages/LoginPage';

async function globalSetup(_config: FullConfig): Promise<void> {
  const authDir = path.join(__dirname, path.dirname(config.authStatePath));

  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: config.baseURL });
  const page = await context.newPage();

  try {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndWait({
      username: config.credentials.username,
      password: config.credentials.password,
    });

    await context.storageState({ path: config.authStatePath });
    console.log(`[Global Setup] Auth state saved to ${config.authStatePath}`);
  } catch (error) {
    console.error('[Global Setup] Login failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
