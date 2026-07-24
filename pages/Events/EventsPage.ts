import { Page, Locator, expect } from "@playwright/test";

export class EventsPage {
    private page: Page;

    readonly eventsPageTitle: Locator;
    readonly bookNowBtn: Locator;
    readonly eventCategoryLable: Locator;

    constructor(page: Page) {
        this.page = page;
        this.eventsPageTitle = page.getByText('Upcoming Events', { exact: true })
        this.bookNowBtn = page.getByRole('link', { name: 'Book Now' }).first();
        this.eventCategoryLable = page.getByText('Festival', { exact: true }).first();
    }

    async verifyEventsPageTitle() {
        await expect(this.eventsPageTitle).toBeVisible();
    }

    async clickBookNowBtn() {
        await expect(this.eventCategoryLable).toBeVisible();
        await expect(this.bookNowBtn).toHaveText('Book Now');
        await this.bookNowBtn.click();
    }

}