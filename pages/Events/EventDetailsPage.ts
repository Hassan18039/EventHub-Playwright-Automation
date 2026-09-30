import { Page, Locator, expect } from "@playwright/test";

export type BookingDetails = {
    eventId: number;
    fullName: string;
    email: string;
    phone: string;
    quantity: number;
};

export class EventDetailsPage {
    private page: Page;
    readonly fullNameInput: Locator;
    readonly emailInput: Locator;
    readonly phoneInput: Locator;
    readonly confirmBookingBtn: Locator;
    readonly bookingConfirmationText: Locator;
    readonly nameErrorMsg: Locator;
    readonly emailErrorMsg: Locator;
    readonly phoneErrorMsg: Locator;
    readonly increaseQuantityBtn: Locator;
    readonly availableSeatsText: Locator;
    readonly bookingRefText: Locator;


    constructor(page: Page) {
        this.page = page;
        this.fullNameInput = page.getByRole('textbox', { name: 'Full Name*' });
        this.emailInput = page.getByRole('textbox', { name: 'Email*' });
        this.phoneInput = page.getByRole('textbox', { name: 'Phone Number*' });
        this.confirmBookingBtn = page.getByRole('button', { name: 'Confirm Booking' });
        this.bookingConfirmationText = page.getByText('Booking Confirmed!');
        this.nameErrorMsg = page.getByText('Name must be at least 2 chars');
        this.emailErrorMsg = page.getByText('Enter a valid email');
        this.phoneErrorMsg = page.getByText('Enter a valid 10-digit phone');
        this.increaseQuantityBtn = page.getByRole('button', { name: '+' });
        // Shown as e.g. "7393 / 10000 seats"
        this.availableSeatsText = page.getByText(/^\d+ \/ \d+ seats$/);
        // Booking ref on the confirmation card, e.g. "D-2HZKJH"
        this.bookingRefText = page.getByText(/^[A-Z]-[A-Z0-9]{6}$/);
    }

    async navigate(eventId: number) {
        await this.page.goto(`/events/${eventId}`);
        await this.verifyPageLoaded();
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

    async setTicketQuantity(quantity: number) {
        // Quantity starts at 1, so click "+" for every extra ticket
        for (let i = 1; i < quantity; i++) {
            await this.increaseQuantityBtn.click();
        }
    }

    // Opens the event and reads "7393 / 10000 seats" → 7393
    async getAvailableSeats(eventId: number): Promise<number> {
        await this.navigate(eventId);
        const text = await this.availableSeatsText.innerText();
        return Number(text.split('/')[0].trim());
    }

    async getBookingRef(): Promise<string> {
        await this.verifyBookingConfirmationText();
        return (await this.bookingRefText.innerText()).trim();
    }

    // Books the event end-to-end and returns the booking ref (e.g. "H-3TEWKW")
    async bookEvent(booking: BookingDetails): Promise<string> {
        await this.navigate(booking.eventId);
        await this.setTicketQuantity(booking.quantity);
        await this.fillBookingDetails(booking.fullName, booking.email, booking.phone);
        await this.clickConfirmBookingBtn();
        return this.getBookingRef();
    }

    async clickConfirmBookingBtn() {
        await this.confirmBookingBtn.click();
    }

    async verifyBookingConfirmationText() {
        await expect(this.bookingConfirmationText).toBeVisible();
    }

    async verifyValidationErrorMessages() {
        await expect(this.nameErrorMsg).toBeVisible();
        await expect(this.emailErrorMsg).toBeVisible();
        await expect(this.phoneErrorMsg).toBeVisible();
    }
}
