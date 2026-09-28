import { test, expect } from "../fixtures/baseTest";
import eventData from "../../data/admin/manage-events.json";
import { AUTH_STATE } from "../fixtures/authState";

test.describe("Admin Edit Event", () => {
  test.use({ storageState: AUTH_STATE.admin });

  // Each test creates its own uniquely-titled event so parallel tests never edit each other's data
  let event: typeof eventData.editEvent;
  let currentTitle: string;

  test.beforeEach(async ({ homePage, navBar, manageEventsPage }) => {
    await homePage.navigate();
    await navBar.clickAdminBtn();
    await navBar.clickManageEvents();
    await manageEventsPage.verifyPageLoaded();

    event = { ...eventData.editEvent, title: `${eventData.editEvent.title} ${Date.now()}` };
    currentTitle = event.title;
    await manageEventsPage.createEvent(event);
  });

  // Remove the event so the account stays under the app's 6-event limit
  test.afterEach(async ({ manageEventsPage }) => {
    await manageEventsPage.deleteEvent(currentTitle).catch(() => {});
  });

  test("Edit form opens with all the event details prefilled", async ({ manageEventsPage }) => {
    await manageEventsPage.clickEditBtn(event.title);

    await manageEventsPage.verifyEditFormPrefilled(event);
    await expect(manageEventsPage.updateEventBtn).toBeVisible();
    await expect(manageEventsPage.cancelEditBtn).toBeVisible();
  });

  test("Admin can update the event title", async ({ manageEventsPage }) => {
    const newTitle = `${event.title} Updated`;

    await manageEventsPage.clickEditBtn(event.title);
    await manageEventsPage.updateEventDetails({ title: newTitle });
    await manageEventsPage.clickUpdateEventBtn();
    currentTitle = newTitle;

    await expect(manageEventsPage.eventUpdatedToast).toBeVisible();
    // Updated in place, not added as a new event
    await expect(manageEventsPage.eventRowsWithExactTitle(newTitle)).toHaveCount(1);
    await expect(manageEventsPage.eventRowsWithExactTitle(event.title)).toHaveCount(0);
  });

  test("Admin can update multiple fields at once", async ({ manageEventsPage }) => {
    const updates = eventData.editEventUpdates;

    await manageEventsPage.clickEditBtn(event.title);
    await manageEventsPage.updateEventDetails(updates);
    await manageEventsPage.clickUpdateEventBtn();

    await expect(manageEventsPage.eventUpdatedToast).toBeVisible();
    const row = manageEventsPage.eventRow(event.title);
    await expect(row).toContainText(updates.category);
    await expect(row).toContainText(updates.city);
    await expect(row).toContainText(updates.expectedDate);
    await expect(row).toContainText(updates.expectedPrice);
    // Seats cell is "available/total"; the app keeps available seats unchanged when total is edited
    await expect(row).toContainText(updates.expectedTotalSeats);
  });

  test("Admin can clear the optional description", async ({ manageEventsPage, page }) => {
    await manageEventsPage.clickEditBtn(event.title);
    await manageEventsPage.updateEventDetails({ description: "" });
    await manageEventsPage.clickUpdateEventBtn();
    await expect(manageEventsPage.eventUpdatedToast).toBeVisible();

    // The app reopens Edit with the stale description until the page is reloaded,
    // even though the empty value is saved — reload to read what was persisted
    await page.reload();
    await manageEventsPage.clickEditBtn(event.title);
    await expect(manageEventsPage.descriptionInput).toHaveValue("");
  });

  test("Update fails when the title is cleared", async ({ manageEventsPage }) => {
    await manageEventsPage.clickEditBtn(event.title);
    await manageEventsPage.updateEventDetails({ title: "" });
    await manageEventsPage.clickUpdateEventBtn();

    await expect(manageEventsPage.titleErrorMessage).toBeVisible();
    await expect(manageEventsPage.eventUpdatedToast).toBeHidden();
    await expect(manageEventsPage.eventRow(event.title)).toBeVisible();
  });

  test("Update fails when total seats is set to zero", async ({ manageEventsPage }) => {
    await manageEventsPage.clickEditBtn(event.title);
    await manageEventsPage.updateEventDetails({ seats: "0" });
    await manageEventsPage.clickUpdateEventBtn();

    await expect(manageEventsPage.totalSeatsErrorMessage).toBeVisible();
    await expect(manageEventsPage.eventUpdatedToast).toBeHidden();
    await expect(manageEventsPage.eventRow(event.title)).toContainText(`${event.seats}/${event.seats}`);
  });

  test("Cancelling an edit discards the changes", async ({ manageEventsPage }) => {
    await manageEventsPage.clickEditBtn(event.title);
    await manageEventsPage.updateEventDetails({ title: `${event.title} Discarded`, city: "Chennai" });
    await manageEventsPage.clickCancelEditBtn();

    await expect(manageEventsPage.editEventHeading).toBeHidden();
    await expect(manageEventsPage.eventRow(`${event.title} Discarded`)).toBeHidden();
    await expect(manageEventsPage.eventRow(event.title)).toContainText(event.city);
  });
});
