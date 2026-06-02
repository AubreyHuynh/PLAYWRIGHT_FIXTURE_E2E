import { type Locator, type Page } from "@playwright/test";

export class BaseComponent {
    protected readonly page: Page;
    private readonly _scope: Locator | undefined;

    constructor(page: Page, scope?: Locator) {
        this.page = page;
        this._scope = scope;
    }

    /**
     * Returns the scoped root locator, or a body-level locator when no scope
     * was provided. Use `this.scope()` for elements that live in the component
     * tree. Use `this.page` directly for portal-mounted elements (listboxes,
     * dialogs, toasts) that Radix renders at the body level.
     */
    protected scope(): Locator {
        return this._scope ?? this.page.locator("body");
    }

    protected async waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
        await locator.waitFor({ state: "visible", timeout });
    }

    protected async waitForHidden(locator: Locator, timeout = 10_000): Promise<void> {
        await locator.waitFor({ state: "hidden", timeout });
    }
}
