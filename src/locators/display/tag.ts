/**
 * Tag / Badge — shadcn Badge component.
 * Rendered as a <div> or <span> with data-slot="badge" and an optional
 * data-variant attribute ("default" | "secondary" | "destructive" | "outline").
 *
 * For removable tags (e.g. in a multi-select or filter bar), a close button
 * is expected inside the badge element.
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Tag extends BaseComponent {
    //#region Locators
    private badge(text?: string): Locator {
        if (text) {
            return this.scope()
                .locator('[data-slot="badge"]')
                .filter({ hasText: text })
                .first();
        }
        return this.scope().locator('[data-slot="badge"]').first();
    }

    private allBadges(): Locator {
        return this.scope().locator('[data-slot="badge"]');
    }

    private closeButton(badge: Locator): Locator {
        return badge.getByRole("button", { name: /remove|close|delete/i });
    }
    //#endregion

    //#region Actions
    /** Click a removable tag's close button. */
    async remove(text: string): Promise<void> {
        const target = this.badge(text);
        await this.waitForVisible(target);
        await this.closeButton(target).click();
    }

    async click(text: string): Promise<void> {
        const target = this.badge(text);
        await this.waitForVisible(target);
        await target.click();
    }
    //#endregion

    //#region Assertions
    async expectVisible(text: string): Promise<void> {
        await expect(this.badge(text)).toBeVisible();
    }

    async expectHidden(text: string): Promise<void> {
        await expect(this.badge(text)).toBeHidden();
    }

    async expectVariant(
        text: string,
        variant: "default" | "secondary" | "destructive" | "outline"
    ): Promise<void> {
        await expect(this.badge(text)).toHaveAttribute("data-variant", variant);
    }

    async expectCount(count: number): Promise<void> {
        await expect(this.allBadges()).toHaveCount(count);
    }

    async expectRemovable(text: string): Promise<void> {
        await expect(this.closeButton(this.badge(text))).toBeVisible();
    }
    //#endregion
}
