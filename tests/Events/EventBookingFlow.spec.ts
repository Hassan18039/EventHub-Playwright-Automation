import { test, expect } from "../fixtures/baseTest";
import user from "../../data/auth/user.json";

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

  test('User can successfully cancel a booking', async ({ eventsPage, homePage, eventDetailsPage, navBar, myBookingsPage }) => {
    await navBar.clickMyBookingLink();
    await myBookingsPage.clickCancelBtn();
    await myBookingsPage.clickYesCancleItBtn();
    await myBookingsPage.verifyCancelBookingSuccessMsg();

  });
});