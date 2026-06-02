/**
 * Spinner — loading indicator.
 * Targets elements with role="status" (shadcn) or common CSS class patterns.
 * Use waitForHidden() to block until loading finishes before asserting content.
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Spinner extends BaseComponent {
    //#region Locators
    private spinner(): Locator {
        return this.scope().locator(
            '[role="status"], [data-slot="spinner"], [class*="spinner"], [class*="loading"]'
        ).first();
    }

    private overlay(): Locator {
        return this.scope().locator(
            '[data-slot="loading-overlay"], [class*="loading-overlay"], [aria-busy="true"]'
        ).first();
    }
    //#endregion

    //#region Actions
    /** Block until the spinner disappears (loading complete). */
    async waitUntilHidden(timeout = 30_000): Promise<void> {
        await this.waitForHidden(this.spinner(), timeout);
    }

    /** Block until the spinner appears (loading started). */
    async waitUntilVisible(timeout = 10_000): Promise<void> {
        await this.waitForVisible(this.spinner(), timeout);
    }

    /** Block until the loading overlay disappears. */
    async waitForOverlayHidden(timeout = 30_000): Promise<void> {
        await this.waitForHidden(this.overlay(), timeout);
    }
    //#endregion

    //#region Assertions
    async expectVisible(): Promise<void> {
        await expect(this.spinner()).toBeVisible();
    }

    async expectHidden(): Promise<void> {
        await expect(this.spinner()).toBeHidden();
    }

    async expectAriaLabel(label: string): Promise<void> {
        await expect(this.spinner()).toHaveAttribute("aria-label", label);
    }
    //#endregion
}
