import { test, expect } from "../fixtures/baseTest";
import eventData from "../../data/admin/manage-events.json";

test.describe("Admin Delete Event", () => {
  test.beforeEach(async ({ loginPage, navBar, manageEventsPage }) => {
    // Login as admin, then open the Manage Events screen
    await loginPage.navigate();
    await loginPage.login(eventData.adminUser.email, eventData.adminUser.password);
    await navBar.clickAdminBtn();
    await navBar.clickManageEvents();
    await manageEventsPage.verifyPageLoaded();
  });

  // Each test creates its own uniquely-titled event so parallel tests never delete each other's data
  test("Admin can delete an event", async ({ manageEventsPage }) => {
    const event = { ...eventData.deleteEvent, title: `${eventData.deleteEvent.title} ${Date.now()}` };
    await manageEventsPage.createEvent(event);

    await manageEventsPage.deleteEvent(event.title);

    await expect(manageEventsPage.eventRow(event.title)).toBeHidden();
  });
});
