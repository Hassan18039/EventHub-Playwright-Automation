import { test, expect } from "../fixtures/baseTest";
import eventData from "../../data/admin/manage-events.json";

test.describe("Admin Manage Events", () => {
  test.beforeEach(async ({ loginPage, navBar, manageEventsPage }) => {
    // Login as admin, then open the Manage Events screen
    await loginPage.navigate();
    await loginPage.login(eventData.adminUser.email, eventData.adminUser.password);
    await navBar.clickAdminBtn();
    await navBar.clickManageEvents();
    await manageEventsPage.verifyPageLoaded();
  });

  test("Admin can successfully add a new valid event", async ({ manageEventsPage }) => {
    await manageEventsPage.fillEventDetails(eventData.validEvent);
    await manageEventsPage.clickAddEventBtn();

    await expect(manageEventsPage.eventRow(eventData.validEvent.title)).toBeVisible();
  });

  test("Admin can add event with different category", async ({ manageEventsPage }) => {
    await manageEventsPage.fillEventDetails(eventData.validEventFestival);
    await manageEventsPage.clickAddEventBtn();

    await expect(manageEventsPage.eventRow(eventData.validEventFestival.title)).toBeVisible();
  });

  test("Form validation fails when title is empty", async ({ manageEventsPage }) => {
    await manageEventsPage.fillEventDetails(eventData.invalidEventMissingTitle);
    await manageEventsPage.clickAddEventBtn();

    await expect(manageEventsPage.titleErrorMessage).toBeVisible();
    await expect(manageEventsPage.successToast).toBeHidden();
  });

  test("Form validation fails when total seats is zero", async ({ manageEventsPage }) => {
    await manageEventsPage.fillEventDetails(eventData.invalidEventZeroSeats);
    await manageEventsPage.clickAddEventBtn();

    await expect(manageEventsPage.totalSeatsErrorMessage).toBeVisible();
    await expect(manageEventsPage.eventRow(eventData.invalidEventZeroSeats.title)).toBeHidden();
  });

  // Description is not marked required in the form, so an empty value is accepted
  test("Description is optional field", async ({ manageEventsPage }) => {
    await manageEventsPage.fillEventDetails(eventData.eventWithoutDescription);
    await manageEventsPage.clickAddEventBtn();

    await expect(manageEventsPage.eventRow(eventData.eventWithoutDescription.title)).toBeVisible();
  });

  // A price of 0 is a valid free event, not a validation error
  test("Event can be created with a price of zero", async ({ manageEventsPage }) => {
    await manageEventsPage.fillEventDetails(eventData.freeEvent);
    await manageEventsPage.clickAddEventBtn();

    await expect(manageEventsPage.eventRow(eventData.freeEvent.title)).toBeVisible();
  });

  test("Image URL is optional field", async ({ manageEventsPage }) => {
    const { imageUrl, ...eventWithoutImage } = eventData.validEvent;

    await manageEventsPage.fillEventDetails(eventWithoutImage);
    await manageEventsPage.clickAddEventBtn();

    await expect(manageEventsPage.eventRow(eventWithoutImage.title)).toBeVisible();
  });

  test("Admin can delete an event", async ({ manageEventsPage }) => {
    await manageEventsPage.deleteEvent();
  });
});
