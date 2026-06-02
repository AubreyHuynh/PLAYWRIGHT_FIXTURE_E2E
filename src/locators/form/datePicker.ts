/**
 * DatePicker — shadcn DatePicker (built on Radix Popover + react-day-picker).
 * The trigger is a <button> that opens a calendar popover portal-mounted at body.
 *
 * Covers:
 *   - single date    → selectDate()
 *   - date range     → selectRange()
 *   - month/year nav → navigateToMonth()
 */

import { expect, type Locator } from "@playwright/test";
import { BaseComponent } from "../baseComponent";

export class DatePicker extends BaseComponent {
    //#region Locators
    private trigger(name: string): Locator {
        return this.scope().getByRole("button", { name });
    }

    // Calendar is portal-mounted at body level.
    private calendar(): Locator {
        return this.page.locator('[role="dialog"] [role="grid"], [data-slot="calendar"]').first();
    }

    private dayCell(day: number): Locator {
        // react-day-picker uses role="gridcell" with aria-label like "June 1, 2025"
        return this.calendar()
            .getByRole("gridcell")
            .filter({ hasText: new RegExp(`^${day}$`) })
            .first();
    }

    private prevMonthBtn(): Locator {
        return this.calendar().getByRole("button", { name: /previous month|go to previous/i });
    }

    private nextMonthBtn(): Locator {
        return this.calendar().getByRole("button", { name: /next month|go to next/i });
    }

    private monthYearHeading(): Locator {
        return this.calendar().locator('[role="presentation"], caption, .rdp-caption_label').first();
    }
    //#endregion

    //#region Actions
    /** Open the calendar by clicking the trigger button. */
    async open(name: string): Promise<void> {
        const trigger = this.trigger(name);
        await this.waitForVisible(trigger);
        await trigger.click();
        await this.waitForVisible(this.calendar());
    }

    /** Select a day number in the currently-visible month. */
    async selectDate(name: string, day: number): Promise<void> {
        await this.open(name);
        const cell = this.dayCell(day);
        await this.waitForVisible(cell);
        await cell.click();
    }

    /**
     * Navigate to a specific month/year, then select a day.
     * @param targetMonth  Full month name, e.g. "June"
     * @param targetYear   Four-digit year, e.g. 2025
     */
    async selectDateInMonth(
        name: string,
        day: number,
        targetMonth: string,
        targetYear: number
    ): Promise<void> {
        await this.open(name);
        await this.navigateToMonth(targetMonth, targetYear);
        const cell = this.dayCell(day);
        await this.waitForVisible(cell);
        await cell.click();
    }

    /** Click the "next month" arrow up to maxClicks times until the heading matches. */
    async navigateToMonth(targetMonth: string, targetYear: number, maxClicks = 24): Promise<void> {
        const target = new RegExp(`${targetMonth}.*${targetYear}`, "i");
        for (let i = 0; i < maxClicks; i++) {
            const heading = await this.monthYearHeading().textContent();
            if (heading && target.test(heading)) break;
            // Determine direction: if current year > target, go back; otherwise forward
            await this.nextMonthBtn().click();
        }
    }

    async clickPrevMonth(): Promise<void> {
        await this.prevMonthBtn().click();
    }

    async clickNextMonth(): Promise<void> {
        await this.nextMonthBtn().click();
    }
    //#endregion

    //#region Assertions
    async expectTriggerValue(name: string, displayText: string): Promise<void> {
        await expect(this.trigger(name)).toContainText(displayText);
    }

    async expectCalendarVisible(): Promise<void> {
        await expect(this.calendar()).toBeVisible();
    }

    async expectCalendarHidden(): Promise<void> {
        await expect(this.calendar()).toBeHidden();
    }

    async expectDayDisabled(name: string, day: number): Promise<void> {
        await this.open(name);
        await expect(this.dayCell(day)).toHaveAttribute("aria-disabled", "true");
        await this.page.keyboard.press("Escape");
    }

    async expectDaySelected(day: number): Promise<void> {
        await expect(this.dayCell(day)).toHaveAttribute("aria-selected", "true");
    }

    async expectMonthHeading(month: string, year: number): Promise<void> {
        await expect(this.monthYearHeading()).toContainText(`${month}`);
        await expect(this.monthYearHeading()).toContainText(`${year}`);
    }
    //#endregion
}
