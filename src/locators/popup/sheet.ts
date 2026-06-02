/**
 * Sheet — shadcn Sheet (Radix Dialog rendered as a side drawer).
 * Portal-mounted at body level; role="dialog" with data-slot="sheet-content"
 * and a data-side attribute ("top" | "right" | "bottom" | "left").
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Sheet extends BaseComponent {
    //#region Locators
    // Sheet is portal-mounted — anchor to this.page, not this.scope().
    private sheet(title?: string): Locator {
        const base = this.page.locator("[data-slot='sheet-content'], [role='dialog'][class*='sheet']");
        if (title) {
            return base.filter({ has: this.page.getByText(title, { exact: true }) }).first();
        }
        return base.first();
    }

    private closeButton(sheet: Locator): Locator {
        return sheet.getByRole("button", { name: /close/i });
    }

    private header(sheet: Locator): Locator {
        return sheet.locator("[data-slot='sheet-header']").first();
    }

    private footer(sheet: Locator): Locator {
        return sheet.locator("[data-slot='sheet-footer']").first();
    }
    //#endregion

    //#region Actions
    async close(title?: string): Promise<void> {
        const s = this.sheet(title);
        await this.waitForVisible(s);
        await this.closeButton(s).click();
    }

    /** Close by clicking the semi-transparent overlay. */
    async clickOverlay(): Promise<void> {
        await this.page.locator("[data-slot='sheet-overlay']").click({ position: { x: 10, y: 10 } });
    }

    async pressEscape(): Promise<void> {
        await this.page.keyboard.press("Escape");
    }

    async clickFooterButton(label: string, title?: string): Promise<void> {
        const btn = this.footer(this.sheet(title)).getByRole("button", { name: label });
        await this.waitForVisible(btn);
        await btn.click();
    }
    //#endregion

    //#region Assertions
    async expectVisible(title?: string): Promise<void> {
        await expect(this.sheet(title)).toBeVisible();
    }

    async expectHidden(title?: string): Promise<void> {
        await expect(this.sheet(title)).toBeHidden();
    }

    async expectTitle(title: string): Promise<void> {
        await expect(
            this.sheet().getByRole("heading", { name: title })
        ).toBeVisible();
    }

    async expectSide(side: "top" | "right" | "bottom" | "left", title?: string): Promise<void> {
        await expect(this.sheet(title)).toHaveAttribute("data-side", side);
    }

    async expectContainsText(text: string, title?: string): Promise<void> {
        await expect(this.sheet(title)).toContainText(text);
    }
    //#endregion
}
