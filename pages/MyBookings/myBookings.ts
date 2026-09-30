import { Locator, Page, expect } from "@playwright/test";

export class MyBookingsPage {
    private page: Page;
    readonly cancelBtn: Locator
    readonly yesCancleItBtn: Locator
    readonly cancelBookingSuccessMsg: Locator
    readonly viewDetailsBtn: Locator
    readonly editButton: Locator
    readonly updateButton: Locator
    readonly cancelEventButton: Locator

    constructor(page: Page) {
        this.page = page;
        this.cancelBtn = page.getByRole('button', { name: 'Cancel Booking' }).first();
        this.yesCancleItBtn = page.getByRole('button', { name: 'Yes, cancel it' });
        this.cancelBookingSuccessMsg = page.getByText('Booking cancelled successfully');
        this.viewDetailsBtn = page.getByRole('button', { name: 'View Details' }).first();
        this.editButton = page.getByRole('button', { name: 'Edit' }).first();
        this.updateButton = page.getByRole('button', { name: '💾 Update Event' });
        this.cancelEventButton = page.getByRole('button', { name: 'Cancel edit' });
    }

    async navigate() {
        await this.page.goto('/bookings');
        await expect(this.page.getByRole('heading', { name: 'My Bookings' })).toBeVisible();
    }

    // Booking ref badge on a booking card, e.g. "D-2HZKJH"
    bookingRefText(ref: string): Locator {
        return this.page.getByText(ref, { exact: true });
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
    async clickEditButton() {
        await this.editButton.click();
    }

    async clickUpdateButton() {
        await this.updateButton.click();
    }
    async clickCancelEventButton() {
        await this.cancelEventButton.click();
    }
}
