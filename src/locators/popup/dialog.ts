/**
 * Dialog — shadcn Dialog / AlertDialog (Radix Dialog).
 * Portal-mounted at body level; uses role="dialog" with an accessible title.
 *
 * Covers:
 *   - regular Dialog   → open/close via any external trigger
 *   - AlertDialog      → confirm() / cancel() on the action buttons
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Dialog extends BaseComponent {
    //#region Locators
    // Dialogs are portal-mounted — always anchor to this.page, never this.scope().
    private dialog(title?: string): Locator {
        if (title) {
            return this.page
                .getByRole("dialog")
                .filter({ has: this.page.getByRole("heading", { name: title }) });
        }
        return this.page.getByRole("dialog");
    }

    private closeButton(dialog: Locator): Locator {
        return dialog.getByRole("button", { name: /close/i });
    }

    private confirmButton(dialog: Locator): Locator {
        return dialog.getByRole("button", { name: /confirm|ok|yes|continue|submit/i });
    }

    private cancelButton(dialog: Locator): Locator {
        return dialog.getByRole("button", { name: /cancel|no|dismiss/i });
    }
    //#endregion

    //#region Actions
    async close(title?: string): Promise<void> {
        const d = this.dialog(title);
        await this.waitForVisible(d);
        await this.closeButton(d).click();
    }

    async confirm(title?: string): Promise<void> {
        const d = this.dialog(title);
        await this.waitForVisible(d);
        await this.confirmButton(d).click();
    }

    async cancel(title?: string): Promise<void> {
        const d = this.dialog(title);
        await this.waitForVisible(d);
        await this.cancelButton(d).click();
    }

    /** Click the backdrop overlay to close (only works for non-modal dialogs). */
    async clickOutside(): Promise<void> {
        await this.page.locator("[data-slot='dialog-overlay']").click({ position: { x: 10, y: 10 } });
    }

    /** Press Escape to close the dialog. */
    async pressEscape(): Promise<void> {
        await this.page.keyboard.press("Escape");
    }
    //#endregion

    //#region Assertions
    async expectVisible(title?: string): Promise<void> {
        await expect(this.dialog(title)).toBeVisible();
    }

    async expectHidden(title?: string): Promise<void> {
        await expect(this.dialog(title)).toBeHidden();
    }

    async expectTitle(title: string): Promise<void> {
        await expect(
            this.dialog().getByRole("heading", { name: title })
        ).toBeVisible();
    }

    async expectDescription(text: string, title?: string): Promise<void> {
        await expect(this.dialog(title).getByText(text)).toBeVisible();
    }

    async expectConfirmEnabled(title?: string): Promise<void> {
        await expect(this.confirmButton(this.dialog(title))).toBeEnabled();
    }

    async expectConfirmDisabled(title?: string): Promise<void> {
        await expect(this.confirmButton(this.dialog(title))).toBeDisabled();
    }
    //#endregion
}
