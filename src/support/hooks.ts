import { test } from '@playwright/test';
import type { World } from './world';

// ── Shared world instance per worker ─────────────────────────────────────────
// Tests that need shared state can import and use these hooks by
// calling attachHooks(test) from their fixture or spec file.

export function attachHooks(): void {
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`\n[Before] ${testInfo.title}`);
    await page.context().tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true,
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = `test-results/screenshots/${testInfo.title.replace(/\s/g, '_')}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      testInfo.attachments.push({
        name: 'screenshot',
        path: screenshotPath,
        contentType: 'image/png',
      });
    }

    const tracePath = `test-results/traces/${testInfo.title.replace(/\s/g, '_')}.zip`;
    await page.context().tracing.stop({ path: tracePath });

    console.log(`[After]  ${testInfo.title} — ${testInfo.status}`);
  });
}

// ── World-based hooks ─────────────────────────────────────────────────────────
// Use these when tests operate on a World instance rather than raw page.

export function attachWorldHooks(getWorld: () => World): void {
  test.beforeEach(async (_ctx, testInfo) => {
    console.log(`\n[Before] ${testInfo.title}`);
    getWorld().reset();
  });

  test.afterEach(async (_ctx, testInfo) => {
    const world = getWorld();
    if (testInfo.status !== testInfo.expectedStatus && world.page) {
      const screenshotPath = `test-results/screenshots/${testInfo.title.replace(/\s/g, '_')}.png`;
      await world.page.screenshot({ path: screenshotPath, fullPage: true });
      testInfo.attachments.push({
        name: 'screenshot',
        path: screenshotPath,
        contentType: 'image/png',
      });
    }
    console.log(`[After]  ${testInfo.title} — ${testInfo.status}`);
  });
}
