import { Page, Locator, expect } from "@playwright/test";

export class EventDetailsPage {
    private page: Page;
    readonly fullNameInput: Locator;
    readonly emailInput: Locator;
    readonly phoneInput: Locator;
    readonly confirmBookingBtn: Locator;
    readonly bookingConfirmationText: Locator;


    constructor(page: Page) {
        this.page = page;
        this.fullNameInput = page.getByRole('textbox', { name: 'Full Name*' });
        this.emailInput = page.getByRole('textbox', { name: 'Email*' });
        this.phoneInput = page.getByRole('textbox', { name: 'Phone Number*' });
        this.confirmBookingBtn = page.getByRole('button', { name: 'Confirm Booking' });
        this.bookingConfirmationText = page.getByText('Booking Confirmed!');
    }

    async verifyPageLoaded() {
        await expect(this.page).toHaveURL(/.*details|.*events\/\d+/i);
    }

    async fillBookingDetails(fullName: string, email: string, phone: string) {
        await this.fullNameInput.fill(fullName);
        await this.emailInput.fill(email);
        await this.phoneInput.fill(phone);
    }

    async verifyQuantityAndPrice(price: number, ticketCount: number) {
        // This handles pluralization just in case the UI dynamically displays 'tickets' for counts > 1
        const ticketWord = ticketCount === 1 ? 'ticket' : 'tickets';
        const expectedText = `$${price} × ${ticketCount} ${ticketWord}`;

        // We use regex or exact matching. Here we try exact match first.
        const dynamicQuantityLabel = this.page.getByText(expectedText, { exact: true });

        // If the pluralization logic isn't used in UI (e.g. always "10 ticket"), we fallback to 'ticket'
        await expect(
            dynamicQuantityLabel.or(this.page.getByText(`$${price} × ${ticketCount} ticket`, { exact: true }))
        ).toBeVisible();
    }

    async clickConfirmBookingBtn() {
        await this.confirmBookingBtn.click();
    }

    async verifyBookingConfirmationText() {
        await expect(this.bookingConfirmationText).toBeVisible();
    }

}
