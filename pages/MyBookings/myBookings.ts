import { Locator, Page, expect } from "@playwright/test";

export class MyBookingsPage {
    private page: Page;
    readonly cancelBtn: Locator
    readonly yesCancleItBtn: Locator
    readonly cancelBookingSuccessMsg: Locator
    readonly viewDetailsBtn: Locator

    constructor(page: Page) {
        this.page = page;
        this.cancelBtn = page.getByRole('button', { name: 'Cancel Booking' }).first();
        this.yesCancleItBtn = page.getByRole('button', { name: 'Yes, cancel it' });
        this.cancelBookingSuccessMsg = page.getByText('Booking cancelled successfully');
        this.viewDetailsBtn = page.getByRole('button', { name: 'View Details' }).first();
    }

    async clickCancelBtn() {
        await this.cancelBtn.click();
    }
    async clickYesCancleItBtn() {
        await this.yesCancleItBtn.click();
    }
    async verifyCancelBookingSuccessMsg() {
        await expect(this.cancelBookingSuccessMsg).toBeVisible();
    }

    async clickViewDetails() {
        await this.viewDetailsBtn.first().click();
        await expect(this.page).toHaveURL(/\/bookings\/\d+/);
    }
}
