import { test as base } from 'playwright-bdd';
import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../../../pages/auth/Login.page';
import { RegisterPage } from '../../../pages/auth/Register.page';

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
