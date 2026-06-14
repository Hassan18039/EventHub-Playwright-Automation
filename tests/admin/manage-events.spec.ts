import { test, expect } from "../fixtures/baseTest";
import eventData from "../../data/admin/manage-events.json";

test.describe("Admin Manage Events", () => {
  test.beforeEach(async ({ loginPage }) => {
    // Login as admin first
    await loginPage.navigate();
    await loginPage.login(eventData.adminUser.email, eventData.adminUser.password);
  });

  test("Admin can successfully add a new valid event", async ({ manageEventsPage, page, navBar }) => {
    await navBar.clickAdminBtn();
    await navBar.clickManageEvents();
    await manageEventsPage.navigateToManageEvents();
    await manageEventsPage.fillEventDetails(eventData.validEvent);
    await manageEventsPage.clickAddEventBtn();
    await expect(page).toHaveURL(/.*admin\/events/);
  });

  test("Admin can add event with different category", async ({ manageEventsPage, navBar,page }) => {
    await navBar.clickAdminBtn();
    await navBar.clickManageEvents();
    await manageEventsPage.fillEventDetails(eventData.validEventFestival);
    await manageEventsPage.clickAddEventBtn();

    await expect(page).toHaveURL(/.*admin\/events/);
  });

  test("Form validation fails when title is empty", async ({ manageEventsPage, page }) => {
    await manageEventsPage.fillEventDetails(eventData.invalidEventMissingTitle);
    await manageEventsPage.clickAddEventBtn();

    
    const errorMessage = page.locator('[class*="error"], [role="alert"]');
    await expect(errorMessage).toBeVisible();
  });

  test("Form validation fails when description is empty", async ({ manageEventsPage, page }) => {
    await manageEventsPage.fillEventDetails(eventData.invalidEventMissingDescription);
    await manageEventsPage.clickAddEventBtn();

    const errorMessage = page.locator('[class*="error"], [role="alert"]');
    await expect(errorMessage).toBeVisible();
  });

  test("Form validation fails when price is zero", async ({ manageEventsPage, page }) => {
    await manageEventsPage.fillEventDetails(eventData.invalidEventZeroPrice);
    await manageEventsPage.clickAddEventBtn();

    const errorMessage = page.locator('[class*="error"], [role="alert"]');
    await expect(errorMessage).toBeVisible();
  });

  test("Form validation fails when total seats is zero", async ({ manageEventsPage, page }) => {
    await manageEventsPage.fillEventDetails(eventData.invalidEventZeroSeats);
    await manageEventsPage.clickAddEventBtn();

    const errorMessage = page.locator('[class*="error"], [role="alert"]');
    await expect(errorMessage).toBeVisible();
  });

  test("Image URL is optional field", async ({ manageEventsPage, page }) => {
    const eventWithoutImage = {
      title: eventData.validEvent.title,
      description: eventData.validEvent.description,
      category: eventData.validEvent.category,
      city: eventData.validEvent.city,
      venue: eventData.validEvent.venue,
      dateTime: eventData.validEvent.dateTime,
      price: eventData.validEvent.price,
      seats: eventData.validEvent.seats
    };

    await manageEventsPage.fillEventDetails(eventWithoutImage);
    await manageEventsPage.clickAddEventBtn();

    await expect(page).toHaveURL(/.*admin\/events/);
  });
});
