import { Locator, Page } from "@playwright/test";

export class NavBar {
    private page: Page;
    readonly homeLink: Locator
    readonly eventsLink: Locator
    readonly myBookingLink: Locator
    readonly logoutBtn: Locator
    readonly adminBtn: Locator
    readonly manageEvents: Locator
    readonly manageBookings: Locator

    constructor(page: Page) {
        this.page = page;
        this.homeLink = page.getByRole('link', { name: 'Home' });
        this.eventsLink = page.getByText('Events', { exact: true })
        this.myBookingLink = page.getByTestId('nav-bookings')
        this.logoutBtn = page.getByRole('link', { name: "Logout" })
        this.adminBtn = page.getByRole('button', { name: 'Admin' })
        this.manageEvents = page.locator('a').filter({ hasText: 'Manage Events' }).last();
        this.manageBookings = page.getByRole('link', { name: 'Manage Bookings' })
    }

    async clickHomeLink() {
        await this.homeLink.click();
    }

    async clickEventsLink() {
        await this.eventsLink.click();
    }

    async clickMyBookingLink() {
        await this.myBookingLink.click();
    }

    async clickAdminBtn() {
        await this.adminBtn.click();
    }

    async clickManageEvents() {
        await this.manageEvents.click();
    }

    async clickManageBookings() {
        await this.manageBookings.click();
    }

}