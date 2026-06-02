import type { FullConfig } from '@playwright/test';
import { chromium } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0].use.baseURL || 'https://opensource-demo.orangehrmlive.com';
  const authDir = path.join(__dirname, '.auth');

  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(`${baseURL}/web/index.php/auth/login`);
    await page.waitForLoadState('networkidle');

    const username = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;
    if (!username || !password) {
      throw new Error('TEST_EMAIL and TEST_PASSWORD must be set in .env');
    }

    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/\/web\/index\.php\/dashboard\/index/, { timeout: 15_000 });

    await context.storageState({ path: '.auth/user.json' });
    console.log('[Global Setup] Auth state saved to .auth/user.json');
  } catch (error) {
    console.error('[Global Setup] Login failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
