import { test, expect } from "../fixtures/baseTest";
import user from "../../data/auth/user.json";
import bookEventData from "../../data/Book-Event/book-event.json";
import { AUTH_STATE } from "../fixtures/authState";

test.describe("Event Booking Flow", () => {
  // Already logged in as validUser via the saved session from auth.setup.ts
  test.use({ storageState: AUTH_STATE.user });

  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test('User can successfully book a ticket', async ({ eventsPage, homePage, eventDetailsPage }) => {
    await homePage.clickBrowseEventsBtn();
    await eventsPage.clickBookNowBtn();
    await eventDetailsPage.verifyPageLoaded();
    await eventDetailsPage.fillBookingDetails(user.validUser.fullName, user.validUser.email, user.validUser.phone);
    await eventDetailsPage.verifyQuantityAndPrice(300, 1);
    await eventDetailsPage.clickConfirmBookingBtn();
    await eventDetailsPage.verifyBookingConfirmationText();
  });

  test('System displays validation errors for empty booking fields', async ({ eventsPage, homePage, eventDetailsPage }) => {
    await homePage.clickBrowseEventsBtn();
    await eventsPage.clickBookNowBtn();
    await eventDetailsPage.verifyPageLoaded();
    await eventDetailsPage.clickConfirmBookingBtn();
    await eventDetailsPage.verifyValidationErrorMessages();
  })

  test('System displays validation errors for invalid booking form data', async ({ eventsPage, homePage, eventDetailsPage }) => {
    await homePage.clickBrowseEventsBtn();
    await eventsPage.clickBookNowBtn();
    await eventDetailsPage.verifyPageLoaded();
    await eventDetailsPage.fillBookingDetails(bookEventData.invalidFormData.fullName,
      bookEventData.invalidFormData.email,
      bookEventData.invalidFormData.phone);
    await eventDetailsPage.clickConfirmBookingBtn();
    await eventDetailsPage.verifyValidationErrorMessages();
  })
});