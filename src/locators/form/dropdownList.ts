/**
 * DropdownList — shadcn Select (Radix Select) combobox. The trigger has role
 * "combobox"; opening reveals a listbox with role "option" entries.
 *
 * Covers four flavours:
 *   - plain single-select       → select()
 *   - sectioned/grouped options → selectInSection()
 *   - searchable (combobox)     → searchAndSelect() / search()
 *   - multi-select              → selectMultiple() / unselect()
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class DropdownList extends BaseComponent {
    //#region Locators
    // NOTE: trigger lives in the page tree and supports scope. The listbox is
    // portal-mounted by Radix at the body level, so it must stay anchored at
    // `this.page` — scoping it to a dialog/sheet would never match.
    private trigger(name: string): Locator {
        return this.scope().getByRole("combobox", { name });
    }

    private listbox(): Locator {
        return this.page.getByRole("listbox");
    }

    private option(name: string): Locator {
        return this.listbox().getByRole("option", { name });
    }

    private sectionOption(section: string, optionName: string): Locator {
        return this.listbox()
            .locator(`[role="group"]`, { has: this.page.getByText(section, { exact: true }) })
            .getByRole("option", { name: optionName });
    }

    private searchInput(): Locator {
        return this.listbox().getByPlaceholder(/search/i);
    }
    //#endregion

    //#region Actions
    async select(name: string, option: string): Promise<void> {
        const trigger = this.trigger(name);
        await this.waitForVisible(trigger);
        await trigger.click();
        await this.option(option).click();
    }

    async selectInSection(name: string, section: string, option: string): Promise<void> {
        const trigger = this.trigger(name);
        await this.waitForVisible(trigger);
        await trigger.click();
        const target = this.sectionOption(section, option);
        await this.waitForVisible(target);
        await target.click();
    }

    async search(name: string, text: string): Promise<void> {
        const trigger = this.trigger(name);
        await this.waitForVisible(trigger);
        await trigger.click();
        const input = this.searchInput();
        await this.waitForVisible(input);
        await input.fill(text);
    }

    /** Open, type into the search box, then click the matching option. */
    async searchAndSelect(name: string, text: string, option: string): Promise<void> {
        await this.search(name, text);
        const target = this.option(option);
        await this.waitForVisible(target);
        await target.click();
    }

    /**
     * Multi-select: open the dropdown once, toggle each option on, then close.
     * Skips options already selected so the call is idempotent.
     */
    async selectMultiple(name: string, options: string[]): Promise<void> {
        const trigger = this.trigger(name);
        await this.waitForVisible(trigger);
        await trigger.click();
        for (const opt of options) {
            const target = this.option(opt);
            await this.waitForVisible(target);
            if ((await target.getAttribute("aria-selected")) !== "true") {
                await target.click();
            }
        }
        await this.page.keyboard.press("Escape");
    }

    /** Remove a single selection from a multi-select dropdown. */
    async unselect(name: string, option: string): Promise<void> {
        const trigger = this.trigger(name);
        await this.waitForVisible(trigger);
        await trigger.click();
        const target = this.option(option);
        await this.waitForVisible(target);
        if ((await target.getAttribute("aria-selected")) === "true") {
            await target.click();
        }
        await this.page.keyboard.press("Escape");
    }
    //#endregion

    //#region Assertions
    /**
     * Assertion methods open the dropdown to query option state, then close
     * it again (Escape) before returning so the next step doesn't inherit
     * an open dropdown.
     */
    async expectOptionEnabled(name: string, option: string): Promise<void> {
        await this.trigger(name).click();
        await expect(this.option(option)).toBeEnabled();
        await this.page.keyboard.press("Escape");
    }

    async expectOptionDisabled(name: string, option: string): Promise<void> {
        await this.trigger(name).click();
        await expect(this.option(option)).toBeDisabled();
        await this.page.keyboard.press("Escape");
    }

    async expectOptionSelected(name: string, option: string): Promise<void> {
        await this.trigger(name).click();
        await expect(this.option(option)).toHaveAttribute("aria-selected", "true");
        await this.page.keyboard.press("Escape");
    }

    /** Assert all expected options are currently selected (multi-select). */
    async expectSelectedValues(name: string, options: string[]): Promise<void> {
        await this.trigger(name).click();
        for (const opt of options) {
            await expect(this.option(opt)).toHaveAttribute("aria-selected", "true");
        }
        await this.page.keyboard.press("Escape");
    }
    //#endregion
}
