/**
 * Toast — shadcn Sonner toast (or shadcn Toaster).
 * Portal-mounted at body level; Sonner uses role="status" per toast item
 * inside a <ol> with data-sonner-toaster. shadcn Toaster uses role="status"
 * on each <li> inside [data-radix-toast-viewport].
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Toast extends BaseComponent {
    //#region Locators
    // Toast is portal-mounted — always anchor to this.page.
    private toastList(): Locator {
        return this.page.locator(
            "[data-sonner-toaster], [data-radix-toast-viewport]"
        );
    }

    private toast(description?: string): Locator {
        if (description) {
            return this.toastList()
                .locator("li, [role='status']")
                .filter({ hasText: description })
                .first();
        }
        return this.toastList().locator("li, [role='status']").first();
    }

    private closeButton(toast: Locator): Locator {
        return toast.getByRole("button", { name: /close|dismiss/i });
    }
    //#endregion

    //#region Actions
    async dismiss(description?: string): Promise<void> {
        const target = this.toast(description);
        await this.waitForVisible(target);
        await this.closeButton(target).click();
    }

    /** Wait for a toast with the given text to appear. */
    async waitFor(description: string, timeout = 10_000): Promise<void> {
        await this.waitForVisible(this.toast(description), timeout);
    }

    /** Wait for a toast to disappear (auto-dismiss or after manual close). */
    async waitForToastHidden(description?: string, timeout = 15_000): Promise<void> {
        await super.waitForHidden(this.toast(description), timeout);
    }
    //#endregion

    //#region Assertions
    async expectVisible(description?: string): Promise<void> {
        await expect(this.toast(description)).toBeVisible();
    }

    async expectHidden(description?: string): Promise<void> {
        await expect(this.toast(description)).toBeHidden();
    }

    async expectType(type: "success" | "error" | "warning" | "info", description?: string): Promise<void> {
        await expect(this.toast(description)).toHaveAttribute("data-type", type);
    }

    async expectContainsText(text: string): Promise<void> {
        await expect(this.toast(text)).toContainText(text);
    }
    //#endregion
}
