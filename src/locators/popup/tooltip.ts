/**
 * Tooltip — shadcn Tooltip (Radix Tooltip).
 * Portal-mounted; the content element has role="tooltip".
 * Trigger is hovered/focused to reveal the tooltip.
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Tooltip extends BaseComponent {
    //#region Locators
    private trigger(label: string): Locator {
        return this.scope().locator(`[data-slot="tooltip-trigger"], [aria-describedby]`).filter({ hasText: label }).first();
    }

    private triggerByTestId(testId: string): Locator {
        return this.scope().getByTestId(testId);
    }

    // Tooltip content is portal-mounted.
    private content(): Locator {
        return this.page.locator('[role="tooltip"]').first();
    }
    //#endregion

    //#region Actions
    /** Hover the trigger to make the tooltip appear. */
    async hover(label: string): Promise<void> {
        const trigger = this.trigger(label);
        await this.waitForVisible(trigger);
        await trigger.hover();
    }

    async hoverByTestId(testId: string): Promise<void> {
        const trigger = this.triggerByTestId(testId);
        await this.waitForVisible(trigger);
        await trigger.hover();
    }

    /** Move mouse away to hide the tooltip. */
    async moveAway(): Promise<void> {
        await this.page.mouse.move(0, 0);
    }
    //#endregion

    //#region Assertions
    async expectVisible(expectedText?: string): Promise<void> {
        await this.waitForVisible(this.content());
        if (expectedText) {
            await expect(this.content()).toContainText(expectedText);
        } else {
            await expect(this.content()).toBeVisible();
        }
    }

    async expectHidden(): Promise<void> {
        await expect(this.content()).toBeHidden();
    }

    async expectText(text: string): Promise<void> {
        await expect(this.content()).toHaveText(text);
    }
    //#endregion
}
