/**
 * Button — shadcn Button (any variant: default, destructive, outline,
 * secondary, ghost, link) and icon-only buttons.
 *
 * Locates by accessible name first; falls back to test-id or variant class
 * so tests survive label copy changes less fragile than text matching.
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Button extends BaseComponent {
    //#region Locators
    private btn(name: string): Locator {
        return this.scope().getByRole("button", { name });
    }

    private btnByTestId(testId: string): Locator {
        return this.scope().getByTestId(testId);
    }

    private submitBtn(): Locator {
        return this.scope().locator('button[type="submit"]').first();
    }

    private resetBtn(): Locator {
        return this.scope().locator('button[type="reset"]').first();
    }
    //#endregion

    //#region Actions
    async click(name: string): Promise<void> {
        const target = this.btn(name);
        await this.waitForVisible(target);
        await target.click();
    }

    async clickByTestId(testId: string): Promise<void> {
        const target = this.btnByTestId(testId);
        await this.waitForVisible(target);
        await target.click();
    }

    async clickSubmit(): Promise<void> {
        const target = this.submitBtn();
        await this.waitForVisible(target);
        await target.click();
    }

    async clickReset(): Promise<void> {
        const target = this.resetBtn();
        await this.waitForVisible(target);
        await target.click();
    }
    //#endregion

    //#region Assertions
    async expectVisible(name: string): Promise<void> {
        await expect(this.btn(name)).toBeVisible();
    }

    async expectHidden(name: string): Promise<void> {
        await expect(this.btn(name)).toBeHidden();
    }

    async expectEnabled(name: string): Promise<void> {
        await expect(this.btn(name)).toBeEnabled();
    }

    async expectDisabled(name: string): Promise<void> {
        await expect(this.btn(name)).toBeDisabled();
    }

    async expectVariant(
        name: string,
        variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    ): Promise<void> {
        await expect(this.btn(name)).toHaveAttribute("data-variant", variant);
    }

    async expectLoading(name: string): Promise<void> {
        // shadcn sets aria-disabled + a spinner sibling when loading
        await expect(this.btn(name)).toHaveAttribute("aria-disabled", "true");
    }
    //#endregion
}
