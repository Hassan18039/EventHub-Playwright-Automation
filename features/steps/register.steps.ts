import { test } from 'playwright-bdd';
import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { LoginPage } from '../../src/Pages/Auth/Login';
import { RegisterPage } from '../../src/Pages/Auth/Register';

const { Given, When, Then } = createBdd(test);

Given('I am on the login page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
});

When('I go to the register page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.clickRegisterBtn();
});

When('I register with email {string} and password {string}', async ({ page }, email, password) => {
  const registerPage = new RegisterPage(page);
  const uniqueEmail = email.replace('@', `+${Date.now()}@`);
  await registerPage.fillEmail(uniqueEmail);
  await registerPage.fillPassword(password);
  await registerPage.fillConfirmPassword(password);
  await registerPage.clickCreateAccountBtn();
});

Then('I am logged in and see the logout button', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});
