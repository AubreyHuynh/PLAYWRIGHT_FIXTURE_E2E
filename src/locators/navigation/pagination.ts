/**
 * Pagination — shadcn Pagination component.
 * Built from <nav aria-label="pagination"> with numbered page links,
 * Previous / Next anchors, and optional ellipsis items.
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Pagination extends BaseComponent {
    //#region Locators
    private nav(): Locator {
        return this.scope().getByRole("navigation", { name: /pagination/i });
    }

    private pageLink(page: number): Locator {
        return this.nav().getByRole("link", { name: String(page), exact: true });
    }

    private prevLink(): Locator {
        return this.nav().getByRole("link", { name: /previous/i });
    }

    private nextLink(): Locator {
        return this.nav().getByRole("link", { name: /next/i });
    }

    private currentPage(): Locator {
        // shadcn marks the active page with aria-current="page"
        return this.nav().locator('[aria-current="page"]');
    }
    //#endregion

    //#region Actions
    async goToPage(page: number): Promise<void> {
        const link = this.pageLink(page);
        await this.waitForVisible(link);
        await link.click();
    }

    async goToPrevious(): Promise<void> {
        const link = this.prevLink();
        await this.waitForVisible(link);
        await link.click();
    }

    async goToNext(): Promise<void> {
        const link = this.nextLink();
        await this.waitForVisible(link);
        await link.click();
    }
    //#endregion

    //#region Assertions
    async expectCurrentPage(page: number): Promise<void> {
        await expect(this.currentPage()).toHaveText(String(page));
    }

    async expectPreviousDisabled(): Promise<void> {
        await expect(this.prevLink()).toHaveAttribute("aria-disabled", "true");
    }

    async expectNextDisabled(): Promise<void> {
        await expect(this.nextLink()).toHaveAttribute("aria-disabled", "true");
    }

    async expectPageVisible(page: number): Promise<void> {
        await expect(this.pageLink(page)).toBeVisible();
    }

    async expectVisible(): Promise<void> {
        await expect(this.nav()).toBeVisible();
    }
    //#endregion
}
