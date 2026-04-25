import { test, expect } from "../fixtures/baseTest";
import user from "../../data/auth/user.json";
import bookEventData from "../../data/Book-Event/book-event.json";

test.describe("Event Booking Flow", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(
      user.validUser.email,
      user.validUser.password
    );
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