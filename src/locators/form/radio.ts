/**
 * Radio — shadcn RadioGroup (Radix Radio Group).
 * The group has role="radiogroup"; each item has role="radio".
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Radio extends BaseComponent {
    //#region Locators
    private group(name: string): Locator {
        return this.scope().getByRole("radiogroup", { name });
    }

    private option(groupName: string, optionLabel: string): Locator {
        return this.group(groupName).getByRole("radio", { name: optionLabel });
    }

    private checkedOption(groupName: string): Locator {
        return this.group(groupName).locator('[role="radio"][aria-checked="true"]');
    }
    //#endregion

    //#region Actions
    async select(groupName: string, optionLabel: string): Promise<void> {
        const target = this.option(groupName, optionLabel);
        await this.waitForVisible(target);
        await target.click();
    }
    //#endregion

    //#region Assertions
    async expectSelected(groupName: string, optionLabel: string): Promise<void> {
        await expect(this.option(groupName, optionLabel)).toHaveAttribute("aria-checked", "true");
    }

    async expectNotSelected(groupName: string, optionLabel: string): Promise<void> {
        await expect(this.option(groupName, optionLabel)).toHaveAttribute("aria-checked", "false");
    }

    async expectOptionEnabled(groupName: string, optionLabel: string): Promise<void> {
        await expect(this.option(groupName, optionLabel)).toBeEnabled();
    }

    async expectOptionDisabled(groupName: string, optionLabel: string): Promise<void> {
        await expect(this.option(groupName, optionLabel)).toBeDisabled();
    }

    async expectGroupVisible(groupName: string): Promise<void> {
        await expect(this.group(groupName)).toBeVisible();
    }

    async expectCheckedValue(groupName: string, expectedLabel: string): Promise<void> {
        await expect(this.checkedOption(groupName)).toHaveAccessibleName(expectedLabel);
    }
    //#endregion
}
