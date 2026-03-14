import { test as base } from 'playwright-bdd';
import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../../src/Pages/Auth/Login';
import { RegisterPage } from '../../src/Pages/Auth/Register';

// One place to add pages – like beforeEach in simple Playwright, but as a fixture
// (beforeEach can't be used in step files – they're loaded at generation time)
type PageObjects = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
};

export const test = base.extend<{ pageObjects: PageObjects }>({
  pageObjects: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);
    await use({ loginPage, registerPage });
  },
});

export const { Given, When, Then } = createBdd(test);
