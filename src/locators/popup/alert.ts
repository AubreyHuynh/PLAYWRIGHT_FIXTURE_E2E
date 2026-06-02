/**
 * Alert — shadcn Alert (static, inline banner — not a toast).
 * Renders as a <div role="alert"> with an optional title and description.
 *
 * For transient toast alerts see toast.ts.
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Alert extends BaseComponent {
    //#region Locators
    private alert(variant?: string): Locator {
        if (variant) {
            return this.scope().locator(`[role="alert"][data-variant="${variant}"], [role="alert"].${variant}`).first();
        }
        return this.scope().getByRole("alert").first();
    }

    private alertTitle(alert: Locator): Locator {
        return alert.locator("[data-slot='alert-title'], .font-medium, h5").first();
    }

    private alertDescription(alert: Locator): Locator {
        return alert.locator("[data-slot='alert-description'], p").first();
    }
    //#endregion

    //#region Actions
    /** Dismiss the alert if it has a close button. */
    async dismiss(variant?: string): Promise<void> {
        const target = this.alert(variant);
        await this.waitForVisible(target);
        const close = target.getByRole("button", { name: /close|dismiss/i });
        await close.click();
    }
    //#endregion

    //#region Assertions
    async expectVisible(variant?: string): Promise<void> {
        await expect(this.alert(variant)).toBeVisible();
    }

    async expectHidden(variant?: string): Promise<void> {
        await expect(this.alert(variant)).toBeHidden();
    }

    async expectTitle(title: string, variant?: string): Promise<void> {
        await expect(this.alertTitle(this.alert(variant))).toHaveText(title);
    }

    async expectDescription(description: string, variant?: string): Promise<void> {
        await expect(this.alertDescription(this.alert(variant))).toContainText(description);
    }

    async expectVariant(variant: "default" | "destructive" | string): Promise<void> {
        const el = this.scope().getByRole("alert").first();
        await expect(el).toHaveAttribute("data-variant", variant);
    }
    //#endregion
}
