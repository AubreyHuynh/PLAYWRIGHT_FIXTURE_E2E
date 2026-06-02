/**
 * Tabs — shadcn Tabs (Radix Tabs).
 * The tab list has role="tablist"; each trigger has role="tab";
 * the active panel has role="tabpanel".
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Tabs extends BaseComponent {
    //#region Locators
    private tabList(): Locator {
        return this.scope().getByRole("tablist");
    }

    private tab(label: string): Locator {
        return this.tabList().getByRole("tab", { name: label });
    }

    private activePanel(): Locator {
        return this.scope().getByRole("tabpanel");
    }
    //#endregion

    //#region Actions
    async clickTab(label: string): Promise<void> {
        const target = this.tab(label);
        await this.waitForVisible(target);
        await target.click();
    }
    //#endregion

    //#region Assertions
    async expectTabActive(label: string): Promise<void> {
        await expect(this.tab(label)).toHaveAttribute("aria-selected", "true");
    }

    async expectTabInactive(label: string): Promise<void> {
        await expect(this.tab(label)).toHaveAttribute("aria-selected", "false");
    }

    async expectTabEnabled(label: string): Promise<void> {
        await expect(this.tab(label)).toBeEnabled();
    }

    async expectTabDisabled(label: string): Promise<void> {
        await expect(this.tab(label)).toBeDisabled();
    }

    async expectPanelVisible(): Promise<void> {
        await expect(this.activePanel()).toBeVisible();
    }

    async expectPanelContains(text: string): Promise<void> {
        await expect(this.activePanel()).toContainText(text);
    }
    //#endregion
}
