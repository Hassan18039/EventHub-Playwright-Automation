import { Page, Locator, expect } from "@playwright/test";

export type ExpectedBooking = {
  eventTitle: string;
  eventCity: string;
  fullName: string;
  email: string;
  phone: string;
  quantity: number;
  expectedTotal: string;
  expectedStatus: string;
};

export class ManageBookingsPage {
  private page: Page;
  readonly pageHeading: Locator;
  readonly statusFilter: Locator;
  readonly bookingRows: Locator;
  readonly emptyStateMessage: Locator;
  readonly cancelDialog: Locator;
  readonly yesCancelItBtn: Locator;
  readonly keepBookingBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: 'Manage Bookings', level: 1 });
    this.statusFilter = page.getByRole('main').getByRole('combobox');
    // Data rows only (header row lives in <thead>)
    this.bookingRows = page.locator('tbody').getByRole('row');
    this.emptyStateMessage = page.getByText('No bookings found', { exact: true });
    this.cancelDialog = page.getByRole('dialog').filter({ hasText: 'Cancel this booking?' });
    this.yesCancelItBtn = this.cancelDialog.getByRole('button', { name: 'Yes, cancel it' });
    // The confirm dialog's own "Cancel" button closes it without cancelling the booking
    this.keepBookingBtn = this.cancelDialog.getByRole('button', { name: 'Cancel', exact: true });
  }

  // Table row for a booking, found by its unique booking ref (e.g. "D-2HZKJH")
  bookingRow(ref: string): Locator {
    return this.bookingRows.filter({ hasText: ref });
  }

  // "View" dialog, titled "Booking — <ref>"
  bookingDialog(ref: string): Locator {
    return this.page.getByRole('dialog', { name: `Booking — ${ref}` });
  }

  async navigate() {
    await this.page.goto('/admin/bookings');
    await this.verifyPageLoaded();
  }

  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/.*admin\/bookings/);
    await expect(this.pageHeading).toBeVisible();
    await expect(this.page.getByText(/total bookings$/)).toBeVisible();
  }

  // status: "All Statuses" | "Confirmed" | "Cancelled"
  async filterByStatus(status: string) {
    await this.statusFilter.selectOption(status);
  }

  async clickViewBtn(ref: string) {
    await this.bookingRow(ref).getByRole('button', { name: 'View' }).click();
    await expect(this.bookingDialog(ref)).toBeVisible();
  }

  async clickCloseBtn(ref: string) {
    await this.bookingDialog(ref).getByRole('button', { name: 'Close' }).click();
  }

  async clickCancelBtn(ref: string) {
    await this.bookingRow(ref).getByRole('button', { name: 'Cancel' }).click();
    await expect(this.cancelDialog).toBeVisible();
  }

  async clickYesCancelItBtn() {
    await this.yesCancelItBtn.click();
  }

  async clickKeepBookingBtn() {
    await this.keepBookingBtn.click();
  }

  async cancelBooking(ref: string) {
    await this.clickCancelBtn(ref);
    await this.clickYesCancelItBtn();
    await expect(this.bookingRow(ref)).toBeHidden();
  }

  // Used in afterEach: cancel the test's booking only if the test didn't already
  async cancelBookingIfPresent(ref: string) {
    await this.navigate();
    if (await this.bookingRow(ref).isVisible()) {
      await this.cancelBooking(ref);
    }
  }

  async verifyBookingRow(ref: string, booking: ExpectedBooking) {
    const row = this.bookingRow(ref);
    await expect(row).toContainText(booking.fullName);
    await expect(row).toContainText(booking.email);
    await expect(row).toContainText(booking.eventTitle);
    await expect(row).toContainText(booking.expectedTotal);
    await expect(row).toContainText(booking.expectedStatus);
  }

  async verifyBookingDialog(ref: string, booking: ExpectedBooking) {
    const dialog = this.bookingDialog(ref);
    await expect(dialog).toContainText(booking.eventTitle);
    await expect(dialog).toContainText(booking.eventCity);
    await expect(dialog).toContainText(booking.fullName);
    await expect(dialog).toContainText(booking.email);
    await expect(dialog).toContainText(booking.phone);
    await expect(dialog).toContainText(booking.expectedTotal);
    await expect(dialog).toContainText(booking.expectedStatus);
  }
}
