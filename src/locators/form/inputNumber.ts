/**
 * InputNumber — numeric input (shadcn Input with type="number", or a custom
 * spinner widget with increment/decrement buttons).
 *
 * Handles both:
 *   - native <input type="number"> wrapped in a label
 *   - custom spinbutton (role="spinbutton") with +/- buttons
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class InputNumber extends BaseComponent {
    //#region Locators
    private field(label: string): Locator {
        return this.scope().getByLabel(label);
    }

    private spinbutton(label: string): Locator {
        return this.scope().getByRole("spinbutton", { name: label });
    }

    private incrementBtn(label: string): Locator {
        return this.scope()
            .locator(`[aria-label="${label}"]`)
            .locator("..")
            .getByRole("button", { name: /increment|increase|\+/i })
            .first();
    }

    private decrementBtn(label: string): Locator {
        return this.scope()
            .locator(`[aria-label="${label}"]`)
            .locator("..")
            .getByRole("button", { name: /decrement|decrease|-/i })
            .first();
    }
    //#endregion

    //#region Actions
    async fill(label: string, value: number): Promise<void> {
        const field = this.field(label);
        await this.waitForVisible(field);
        await field.clear();
        await field.fill(String(value));
    }

    async increment(label: string, times = 1): Promise<void> {
        const btn = this.incrementBtn(label);
        await this.waitForVisible(btn);
        for (let i = 0; i < times; i++) {
            await btn.click();
        }
    }

    async decrement(label: string, times = 1): Promise<void> {
        const btn = this.decrementBtn(label);
        await this.waitForVisible(btn);
        for (let i = 0; i < times; i++) {
            await btn.click();
        }
    }

    /** Set value via keyboard ArrowUp/ArrowDown from the current value. */
    async adjustByKeyboard(label: string, delta: number): Promise<void> {
        const field = this.spinbutton(label);
        await this.waitForVisible(field);
        await field.focus();
        const key = delta > 0 ? "ArrowUp" : "ArrowDown";
        for (let i = 0; i < Math.abs(delta); i++) {
            await this.page.keyboard.press(key);
        }
    }
    //#endregion

    //#region Assertions
    async expectValue(label: string, expected: number): Promise<void> {
        await expect(this.field(label)).toHaveValue(String(expected));
    }

    async expectMin(label: string, min: number): Promise<void> {
        await expect(this.field(label)).toHaveAttribute("min", String(min));
    }

    async expectMax(label: string, max: number): Promise<void> {
        await expect(this.field(label)).toHaveAttribute("max", String(max));
    }

    async expectEnabled(label: string): Promise<void> {
        await expect(this.field(label)).toBeEnabled();
    }

    async expectDisabled(label: string): Promise<void> {
        await expect(this.field(label)).toBeDisabled();
    }
    //#endregion
}
