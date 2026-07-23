import { Page, Locator, expect } from "@playwright/test";

export class HomePage {
    private page: Page;

    readonly browseEventsBtn: Locator;


    constructor(page: Page) {
        this.page = page;
        this.browseEventsBtn = page.getByText('Browse Events →', { exact: true });

    }

    async clickBrowseEventsBtn() {
        await this.browseEventsBtn.click();
    }

    async verifyPageLoaded() {
        await expect(this.page).toHaveURL(/eventhub\.rahulshettyacademy\.com\/?$/);
    }

}
