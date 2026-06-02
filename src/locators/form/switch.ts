/**
 * Switch — shadcn Switch (Radix Switch).
 * Rendered as a <button role="switch"> with aria-checked="true|false".
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Switch extends BaseComponent {
    //#region Locators
    private switchEl(name: string): Locator {
        return this.scope().getByRole("switch", { name });
    }
    //#endregion

    //#region Actions
    /** Turn the switch ON. No-op if already on. */
    async turnOn(name: string): Promise<void> {
        const sw = this.switchEl(name);
        await this.waitForVisible(sw);
        if ((await sw.getAttribute("aria-checked")) !== "true") {
            await sw.click();
        }
    }

    /** Turn the switch OFF. No-op if already off. */
    async turnOff(name: string): Promise<void> {
        const sw = this.switchEl(name);
        await this.waitForVisible(sw);
        if ((await sw.getAttribute("aria-checked")) === "true") {
            await sw.click();
        }
    }

    /** Toggle regardless of current state. */
    async toggle(name: string): Promise<void> {
        const sw = this.switchEl(name);
        await this.waitForVisible(sw);
        await sw.click();
    }
    //#endregion

    //#region Assertions
    async expectOn(name: string): Promise<void> {
        await expect(this.switchEl(name)).toHaveAttribute("aria-checked", "true");
    }

    async expectOff(name: string): Promise<void> {
        await expect(this.switchEl(name)).toHaveAttribute("aria-checked", "false");
    }

    async expectEnabled(name: string): Promise<void> {
        await expect(this.switchEl(name)).toBeEnabled();
    }

    async expectDisabled(name: string): Promise<void> {
        await expect(this.switchEl(name)).toBeDisabled();
    }

    async expectVisible(name: string): Promise<void> {
        await expect(this.switchEl(name)).toBeVisible();
    }
    //#endregion
}
