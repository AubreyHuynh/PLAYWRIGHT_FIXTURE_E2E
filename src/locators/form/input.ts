/**
 * Input — shadcn Input (plain text / email / password / search).
 * Targets the native <input> via its accessible label, placeholder, or
 * explicit test-id so the locator survives styling changes.
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Input extends BaseComponent {
    //#region Locators
    private field(label: string): Locator {
        return this.scope().getByLabel(label);
    }

    private fieldByPlaceholder(placeholder: string): Locator {
        return this.scope().getByPlaceholder(placeholder);
    }

    private fieldByTestId(testId: string): Locator {
        return this.scope().getByTestId(testId);
    }
    //#endregion

    //#region Actions
    async fill(label: string, value: string): Promise<void> {
        const field = this.field(label);
        await this.waitForVisible(field);
        await field.clear();
        await field.fill(value);
    }

    async fillByPlaceholder(placeholder: string, value: string): Promise<void> {
        const field = this.fieldByPlaceholder(placeholder);
        await this.waitForVisible(field);
        await field.clear();
        await field.fill(value);
    }

    async fillByTestId(testId: string, value: string): Promise<void> {
        const field = this.fieldByTestId(testId);
        await this.waitForVisible(field);
        await field.clear();
        await field.fill(value);
    }

    async clear(label: string): Promise<void> {
        const field = this.field(label);
        await this.waitForVisible(field);
        await field.clear();
    }

    async type(label: string, value: string): Promise<void> {
        const field = this.field(label);
        await this.waitForVisible(field);
        await field.pressSequentially(value);
    }
    //#endregion

    //#region Assertions
    async expectValue(label: string, expected: string): Promise<void> {
        await expect(this.field(label)).toHaveValue(expected);
    }

    async expectPlaceholder(label: string, expected: string): Promise<void> {
        await expect(this.field(label)).toHaveAttribute("placeholder", expected);
    }

    async expectEnabled(label: string): Promise<void> {
        await expect(this.field(label)).toBeEnabled();
    }

    async expectDisabled(label: string): Promise<void> {
        await expect(this.field(label)).toBeDisabled();
    }

    async expectVisible(label: string): Promise<void> {
        await expect(this.field(label)).toBeVisible();
    }

    async expectError(label: string, message: string): Promise<void> {
        const field = this.field(label);
        // Error message is typically in an aria-describedby element or adjacent sibling
        const describedById = await field.getAttribute("aria-describedby");
        if (describedById) {
            await expect(this.scope().locator(`#${describedById}`)).toContainText(message);
        } else {
            // Fall back to adjacent error text (shadcn FormMessage pattern)
            await expect(
                this.scope().locator(`[data-slot="form-message"]:near(input)`).first()
            ).toContainText(message);
        }
    }
    //#endregion
}
