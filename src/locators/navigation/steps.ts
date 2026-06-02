/**
 * Steps — multi-step wizard / stepper component.
 * shadcn doesn't ship a first-party Steps; this targets the common pattern
 * of an ordered list where each item carries data-state="active|completed|inactive".
 *
 * Covers both:
 *   - click-navigable steps   → clickStep()
 *   - display-only indicators → expectState()
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class Steps extends BaseComponent {
    //#region Locators
    private list(): Locator {
        return this.scope().locator('[data-slot="steps"], ol[aria-label], [role="list"]').first();
    }

    private stepByIndex(index: number): Locator {
        return this.list().locator("li, [data-slot='step']").nth(index);
    }

    private stepByLabel(label: string): Locator {
        return this.list().locator("li, [data-slot='step']").filter({ hasText: label }).first();
    }
    //#endregion

    //#region Actions
    async clickStep(label: string): Promise<void> {
        const step = this.stepByLabel(label);
        await this.waitForVisible(step);
        await step.click();
    }

    async clickStepByIndex(index: number): Promise<void> {
        const step = this.stepByIndex(index);
        await this.waitForVisible(step);
        await step.click();
    }
    //#endregion

    //#region Assertions
    async expectStepActive(label: string): Promise<void> {
        await expect(this.stepByLabel(label)).toHaveAttribute("data-state", "active");
    }

    async expectStepCompleted(label: string): Promise<void> {
        await expect(this.stepByLabel(label)).toHaveAttribute("data-state", "completed");
    }

    async expectStepInactive(label: string): Promise<void> {
        await expect(this.stepByLabel(label)).toHaveAttribute("data-state", "inactive");
    }

    async expectStepCount(count: number): Promise<void> {
        await expect(this.list().locator("li, [data-slot='step']")).toHaveCount(count);
    }

    async expectVisible(): Promise<void> {
        await expect(this.list()).toBeVisible();
    }
    //#endregion
}
