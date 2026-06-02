/**
 * Card — shadcn Card.
 * Composed of data-slot parts: "card", "card-header", "card-title",
 * "card-description", "card-content", "card-footer".
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Card extends BaseComponent {
    //#region Locators
    private card(title?: string): Locator {
        if (title) {
            return this.scope()
                .locator('[data-slot="card"]')
                .filter({ has: this.scope().locator(`[data-slot="card-title"]:has-text("${title}")`) })
                .first();
        }
        return this.scope().locator('[data-slot="card"]').first();
    }

    private cardByIndex(index: number): Locator {
        return this.scope().locator('[data-slot="card"]').nth(index);
    }

    private title(card: Locator): Locator {
        return card.locator('[data-slot="card-title"]').first();
    }

    private description(card: Locator): Locator {
        return card.locator('[data-slot="card-description"]').first();
    }

    private content(card: Locator): Locator {
        return card.locator('[data-slot="card-content"]').first();
    }

    private footer(card: Locator): Locator {
        return card.locator('[data-slot="card-footer"]').first();
    }
    //#endregion

    //#region Actions
    async clickCard(title: string): Promise<void> {
        const target = this.card(title);
        await this.waitForVisible(target);
        await target.click();
    }

    async clickFooterButton(cardTitle: string, buttonName: string): Promise<void> {
        const btn = this.footer(this.card(cardTitle)).getByRole("button", { name: buttonName });
        await this.waitForVisible(btn);
        await btn.click();
    }
    //#endregion

    //#region Assertions
    async expectVisible(title?: string): Promise<void> {
        await expect(this.card(title)).toBeVisible();
    }

    async expectTitle(cardTitle: string): Promise<void> {
        await expect(this.title(this.card(cardTitle))).toBeVisible();
    }

    async expectDescription(cardTitle: string, description: string): Promise<void> {
        await expect(this.description(this.card(cardTitle))).toContainText(description);
    }

    async expectContentContains(cardTitle: string, text: string): Promise<void> {
        await expect(this.content(this.card(cardTitle))).toContainText(text);
    }

    async expectCount(count: number): Promise<void> {
        await expect(this.scope().locator('[data-slot="card"]')).toHaveCount(count);
    }

    async expectNthCardTitle(index: number, title: string): Promise<void> {
        await expect(this.title(this.cardByIndex(index))).toHaveText(title);
    }
    //#endregion
}
