import { Page, Locator, expect } from "@playwright/test";

export class ManageEventsPage {
  private page: Page;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly categorySelect: Locator;
  readonly cityInput: Locator;
  readonly venueInput: Locator;
  readonly eventDateInput: Locator;
  readonly priceInput: Locator;
  readonly totalSeatsInput: Locator;
  readonly imageUrlInput: Locator;
  readonly addEventBtn: Locator;
  readonly titleErrorMessage: Locator;
  readonly totalSeatsErrorMessage: Locator;
  readonly successToast: Locator;
  readonly deleteEventBtn: Locator;
  readonly eventDeletedToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByPlaceholder('Event title');
    this.descriptionInput = page.getByRole('textbox', { name: 'Describe the event…' })
    this.categorySelect = page.getByLabel('Category*');
    this.cityInput = page.getByPlaceholder('e.g. Bangalore');
    this.venueInput = page.getByPlaceholder('Venue name & address');
    this.eventDateInput = page.getByRole('textbox', { name: 'Event Date & Time*' });
    this.priceInput = page.getByPlaceholder('0.00');
    this.totalSeatsInput = page.getByPlaceholder('e.g. 500');
    this.imageUrlInput = page.getByRole('textbox', { name: 'Image URL (optional)' });
    this.addEventBtn = page.getByRole('button', { name: 'Add Event' });
    this.titleErrorMessage = page.getByText('Title is required', { exact: true })
    this.totalSeatsErrorMessage = page.getByText('Must have at least 1 seat', { exact: true });
    this.successToast = page.getByText('Event created!', { exact: true });
    this.deleteEventBtn = page.getByRole('button', { name: 'Delete' }).first();
    this.eventDeletedToast = page.getByText('Event deleted', { exact: true });

  }

  // Row in the "All Events" table for a given event title. Uses first() because
  // the app keeps up to 6 events, so repeated runs can leave same-titled rows.
  eventRow(title: string): Locator {
    return this.page.getByRole('row').filter({ hasText: title }).first();
  }

  async navigateToManageEvents() {
    await this.page.goto('/admin/events');
    await expect(this.page).toHaveURL(/.*admin\/events/);
  }

  async fillEventTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async fillEventDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async selectCategory(category: string) {
    await this.categorySelect.selectOption(category);
  }

  async fillCity(city: string) {
    await this.cityInput.fill(city);
  }

  async fillVenue(venue: string) {
    await this.venueInput.fill(venue);
  }

  async fillEventDateTime(dateTime: string) {
    await this.eventDateInput.fill(dateTime);
  }

  async fillPrice(price: string) {
    await this.priceInput.fill(price);
  }

  async fillTotalSeats(seats: string) {
    await this.totalSeatsInput.fill(seats);
  }

  async fillImageUrl(url: string) {
    await this.imageUrlInput.fill(url);
  }

  async fillEventDetails(eventData: {
    title: string;
    description: string;
    category: string;
    city: string;
    venue: string;
    dateTime: string;
    price: string;
    seats: string;
    imageUrl?: string;
  }) {
    await this.fillEventTitle(eventData.title);
    await this.fillEventDescription(eventData.description);
    await this.selectCategory(eventData.category);
    await this.fillCity(eventData.city);
    await this.fillVenue(eventData.venue);
    await this.fillEventDateTime(eventData.dateTime);
    await this.fillPrice(eventData.price);
    await this.fillTotalSeats(eventData.seats);
    if (eventData.imageUrl) {
      await this.fillImageUrl(eventData.imageUrl);
    }
  }

  async clickAddEventBtn() {
    await this.addEventBtn.click();
  }

  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/.*admin\/events/);
    await expect(this.page.getByText('New Event')).toBeVisible();
  }

  async deleteEvent() {
    await this.deleteEventBtn.click();
    await this.page.getByRole('button', { name: 'Delete event' }).click();
    await expect(this.eventDeletedToast).toBeVisible();
  }
}
