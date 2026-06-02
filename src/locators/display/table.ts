/**
 * Table — shadcn Table.
 * data-slot parts: "table", "table-header", "table-head", "table-body",
 * "table-row", "table-cell", "table-footer", "table-caption".
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Table extends BaseComponent {
    //#region Locators
    private table(): Locator {
        return this.scope().locator('[data-slot="table"]').first();
    }

    private headers(): Locator {
        return this.table().locator('[data-slot="table-head"]');
    }

    private rows(): Locator {
        return this.table().locator('[data-slot="table-body"] [data-slot="table-row"]');
    }

    private row(index: number): Locator {
        return this.rows().nth(index);
    }

    private rowByText(text: string): Locator {
        return this.rows().filter({ hasText: text }).first();
    }

    private cell(row: Locator, columnIndex: number): Locator {
        return row.locator('[data-slot="table-cell"]').nth(columnIndex);
    }

    private emptyState(): Locator {
        return this.table().locator('[data-slot="table-body"] [data-slot="table-row"]:only-child [data-slot="table-cell"][colspan]').first();
    }
    //#endregion

    //#region Actions
    async clickRow(index: number): Promise<void> {
        const target = this.row(index);
        await this.waitForVisible(target);
        await target.click();
    }

    async clickRowByText(text: string): Promise<void> {
        const target = this.rowByText(text);
        await this.waitForVisible(target);
        await target.click();
    }

    async clickCellButton(rowIndex: number, columnIndex: number, buttonName: string): Promise<void> {
        const btn = this.cell(this.row(rowIndex), columnIndex).getByRole("button", { name: buttonName });
        await this.waitForVisible(btn);
        await btn.click();
    }

    async clickCellButtonInRow(rowText: string, columnIndex: number, buttonName: string): Promise<void> {
        const btn = this.cell(this.rowByText(rowText), columnIndex).getByRole("button", { name: buttonName });
        await this.waitForVisible(btn);
        await btn.click();
    }

    async clickSortHeader(headerText: string): Promise<void> {
        const header = this.headers().filter({ hasText: headerText }).getByRole("button");
        await this.waitForVisible(header);
        await header.click();
    }
    //#endregion

    //#region Assertions
    async expectVisible(): Promise<void> {
        await expect(this.table()).toBeVisible();
    }

    async expectRowCount(count: number): Promise<void> {
        await expect(this.rows()).toHaveCount(count);
    }

    async expectRowVisible(text: string): Promise<void> {
        await expect(this.rowByText(text)).toBeVisible();
    }

    async expectRowHidden(text: string): Promise<void> {
        await expect(this.rowByText(text)).toBeHidden();
    }

    async expectCellText(rowIndex: number, columnIndex: number, text: string): Promise<void> {
        await expect(this.cell(this.row(rowIndex), columnIndex)).toHaveText(text);
    }

    async expectCellContains(rowIndex: number, columnIndex: number, text: string): Promise<void> {
        await expect(this.cell(this.row(rowIndex), columnIndex)).toContainText(text);
    }

    async expectHeaderVisible(headerText: string): Promise<void> {
        await expect(this.headers().filter({ hasText: headerText })).toBeVisible();
    }

    async expectEmpty(): Promise<void> {
        await expect(this.rows()).toHaveCount(0).catch(async () => {
            // Some tables render an empty-state row instead of 0 rows
            await expect(this.emptyState()).toBeVisible();
        });
    }

    async expectSortDirection(
        headerText: string,
        direction: "ascending" | "descending" | "none"
    ): Promise<void> {
        const header = this.headers().filter({ hasText: headerText }).first();
        await expect(header).toHaveAttribute("aria-sort", direction);
    }
    //#endregion
}
