import { test, expect } from "../../fixtures/baseTest";
import bookingData from "../../../data/admin/manage-bookings.json";
import { AUTH_STATE } from "../../fixtures/authState";

test.describe("Admin Manage Bookings", () => {
  test.use({ storageState: AUTH_STATE.admin });
  // All tests share the admin account's bookings list, so run them one after another
  test.describe.configure({ mode: 'default' });

  // Each test books its own ticket and finds it by this ref
  let bookingRef: string;

  test.beforeEach(async ({ eventDetailsPage, homePage, navBar, manageBookingsPage }) => {
    bookingRef = await eventDetailsPage.bookEvent(bookingData.booking);

    // Open the Manage Bookings screen from the Admin menu
    await homePage.navigate();
    await navBar.clickAdminBtn();
    await navBar.clickManageBookings();
    await manageBookingsPage.verifyPageLoaded();
  });

  // Remove the booking so the account stays under the app's 9-booking limit
  test.afterEach(async ({ manageBookingsPage }) => {
    await manageBookingsPage.cancelBookingIfPresent(bookingRef);
  });

  test("New booking is listed with correct details", async ({ manageBookingsPage }) => {
    await manageBookingsPage.verifyBookingRow(bookingRef, bookingData.booking);
  });

  test("Newest booking is listed first", async ({ eventDetailsPage, manageBookingsPage }) => {
    const newerRef = await eventDetailsPage.bookEvent(bookingData.booking);
    await manageBookingsPage.navigate();

    await expect(manageBookingsPage.bookingRows.first()).toContainText(newerRef);

    await manageBookingsPage.cancelBooking(newerRef);
  });

  test("Admin can view booking details", async ({ manageBookingsPage }) => {
    await manageBookingsPage.clickViewBtn(bookingRef);

    await manageBookingsPage.verifyBookingDialog(bookingRef, bookingData.booking);
  });

  test("Admin can close the booking details dialog", async ({ manageBookingsPage }) => {
    await manageBookingsPage.clickViewBtn(bookingRef);
    await manageBookingsPage.clickCloseBtn(bookingRef);

    await expect(manageBookingsPage.bookingDialog(bookingRef)).toBeHidden();
  });

  test("Admin can cancel a booking", async ({ manageBookingsPage }) => {
    await manageBookingsPage.clickCancelBtn(bookingRef);
    await manageBookingsPage.clickYesCancelItBtn();

    await expect(manageBookingsPage.bookingRow(bookingRef)).toBeHidden();
  });

  test("Closing the cancel dialog keeps the booking", async ({ manageBookingsPage }) => {
    await manageBookingsPage.clickCancelBtn(bookingRef);
    await manageBookingsPage.clickKeepBookingBtn();

    await expect(manageBookingsPage.bookingRow(bookingRef)).toBeVisible();
  });

  test("Cancelling a booking gives the seats back to the event", async ({ eventDetailsPage, manageBookingsPage }) => {
    const seatsBefore = await eventDetailsPage.getAvailableSeats(bookingData.booking.eventId);

    await manageBookingsPage.navigate();
    await manageBookingsPage.cancelBooking(bookingRef);

    const seatsAfter = await eventDetailsPage.getAvailableSeats(bookingData.booking.eventId);
    expect(seatsAfter).toBe(seatsBefore + bookingData.booking.quantity);
  });

  test("Cancelled booking is removed from My Bookings too", async ({ manageBookingsPage, myBookingsPage }) => {
    await manageBookingsPage.cancelBooking(bookingRef);
    await myBookingsPage.navigate();

    await expect(myBookingsPage.bookingRefText(bookingRef)).toBeHidden();
  });

  test("Confirmed filter shows the confirmed booking", async ({ manageBookingsPage }) => {
    await manageBookingsPage.filterByStatus('Confirmed');

    await expect(manageBookingsPage.bookingRow(bookingRef)).toBeVisible();
  });

  // App behaviour: cancel deletes the booking instead of marking it "cancelled",
  // so this filter never has anything to show
  test("Cancelled filter shows no bookings", async ({ manageBookingsPage }) => {
    await manageBookingsPage.filterByStatus('Cancelled');

    await expect(manageBookingsPage.emptyStateMessage).toBeVisible();
  });
});

test.describe("Admin Manage Bookings - logged out", () => {
  // No saved session, so the visitor is logged out
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Logged-out user is redirected to login", async ({ page }) => {
    await page.goto('/admin/bookings');

    await expect(page).toHaveURL(/.*login/);
  });
});
