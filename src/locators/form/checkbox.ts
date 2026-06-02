/**
 * Checkbox — shadcn Checkbox (Radix Checkbox).
 * Rendered as <button role="checkbox"> with aria-checked="true|false|mixed".
 *
 * Covers:
 *   - single checkbox     → check() / uncheck() / toggle()
 *   - indeterminate state → expectIndeterminate()
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Checkbox extends BaseComponent {
    //#region Locators
    private box(name: string): Locator {
        // Radix renders a <button role="checkbox">; native inputs use role="checkbox" too.
        return this.scope().getByRole("checkbox", { name });
    }

    private boxByTestId(testId: string): Locator {
        return this.scope().getByTestId(testId);
    }
    //#endregion

    //#region Actions
    /** Check the checkbox. No-op if already checked. */
    async check(name: string): Promise<void> {
        const target = this.box(name);
        await this.waitForVisible(target);
        if ((await target.getAttribute("aria-checked")) !== "true") {
            await target.click();
        }
    }

    /** Uncheck the checkbox. No-op if already unchecked. */
    async uncheck(name: string): Promise<void> {
        const target = this.box(name);
        await this.waitForVisible(target);
        if ((await target.getAttribute("aria-checked")) === "true") {
            await target.click();
        }
    }

    /** Toggle regardless of current state. */
    async toggle(name: string): Promise<void> {
        const target = this.box(name);
        await this.waitForVisible(target);
        await target.click();
    }
    //#endregion

    //#region Assertions
    async expectChecked(name: string): Promise<void> {
        await expect(this.box(name)).toHaveAttribute("aria-checked", "true");
    }

    async expectUnchecked(name: string): Promise<void> {
        await expect(this.box(name)).toHaveAttribute("aria-checked", "false");
    }

    async expectIndeterminate(name: string): Promise<void> {
        await expect(this.box(name)).toHaveAttribute("aria-checked", "mixed");
    }

    async expectEnabled(name: string): Promise<void> {
        await expect(this.box(name)).toBeEnabled();
    }

    async expectDisabled(name: string): Promise<void> {
        await expect(this.box(name)).toBeDisabled();
    }

    async expectVisible(name: string): Promise<void> {
        await expect(this.box(name)).toBeVisible();
    }
    //#endregion
}
