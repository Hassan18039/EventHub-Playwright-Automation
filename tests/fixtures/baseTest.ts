import { test as base } from '@playwright/test';
import { LoginPage } from '../../pages/auth/Login.page';
import { RegisterPage } from '../../pages/auth/Register.page';
import { HomePage } from '../../pages/Home/HomePage';
import { EventsPage } from '../../pages/Events/EventsPage';
import { EventDetailsPage } from '../../pages/Events/EventDetailsPage';

type CustomFixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  homePage: HomePage;
  eventsPage: EventsPage;
  eventDetailsPage: EventDetailsPage;
};

// Extend base test by providing our page objects automatically to all tests.
export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  eventsPage: async ({ page }, use) => {
    await use(new EventsPage(page));
  },
  eventDetailsPage: async ({ page }, use) => {
    await use(new EventDetailsPage(page));
  },
});

export { expect } from '@playwright/test';
