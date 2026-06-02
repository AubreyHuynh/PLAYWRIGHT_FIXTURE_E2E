/**
 * Upload — shadcn / standard file input with optional drag-and-drop zone.
 *
 * Covers two flavours:
 *   - hidden <input type="file"> behind a labelled button → uploadFile()
 *   - visible dropzone area                              → dropFile()
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Upload extends BaseComponent {
    //#region Locators
    private fileInput(label: string): Locator {
        // shadcn hides the real input; find it by its accessible label or the
        // aria-label on the wrapper, then reach the underlying <input>.
        return this.scope()
            .locator(`label:has-text("${label}") input[type="file"], ` +
                     `[aria-label="${label}"] input[type="file"], ` +
                     `input[type="file"][aria-label="${label}"]`)
            .first();
    }

    private dropzone(label: string): Locator {
        return this.scope().getByLabel(label);
    }

    private fileList(label: string): Locator {
        return this.scope()
            .locator(`[aria-label="${label}"]`)
            .locator("..")
            .locator("[data-slot='file-list'], [class*='file-list'], ul")
            .first();
    }

    private removeButton(fileName: string): Locator {
        return this.scope()
            .locator(`[data-filename="${fileName}"], li:has-text("${fileName}")`)
            .getByRole("button", { name: /remove|delete/i })
            .first();
    }
    //#endregion

    //#region Actions
    /** Upload one or more files via the hidden file input. */
    async uploadFile(label: string, filePaths: string | string[]): Promise<void> {
        const input = this.fileInput(label);
        await input.setInputFiles(filePaths);
    }

    /** Simulate dropping files onto a visible dropzone. */
    async dropFile(label: string, filePaths: string | string[]): Promise<void> {
        const zone = this.dropzone(label);
        await this.waitForVisible(zone);
        await zone.setInputFiles(filePaths);
    }

    /** Remove an already-uploaded file by its display name. */
    async removeFile(fileName: string): Promise<void> {
        const btn = this.removeButton(fileName);
        await this.waitForVisible(btn);
        await btn.click();
    }
    //#endregion

    //#region Assertions
    async expectFileVisible(label: string, fileName: string): Promise<void> {
        await expect(this.fileList(label)).toContainText(fileName);
    }

    async expectFileNotVisible(label: string, fileName: string): Promise<void> {
        await expect(this.fileList(label)).not.toContainText(fileName);
    }

    async expectAccept(label: string, mimeOrExtension: string): Promise<void> {
        await expect(this.fileInput(label)).toHaveAttribute("accept", new RegExp(mimeOrExtension));
    }

    async expectMultiple(label: string): Promise<void> {
        await expect(this.fileInput(label)).toHaveAttribute("multiple", "");
    }

    async expectDropzoneVisible(label: string): Promise<void> {
        await expect(this.dropzone(label)).toBeVisible();
    }
    //#endregion
}
