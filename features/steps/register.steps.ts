import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';

Given('I am on the login page', async ({ pageObjects }) => {
  await pageObjects.loginPage.navigate();
});

When('I go to the register page', async ({ pageObjects }) => {
  await pageObjects.loginPage.clickRegisterBtn();
});

When('I register with email {string} and password {string}', async ({ pageObjects }, email, password) => {
  const { registerPage } = pageObjects;
  const uniqueEmail = email.replace('@', `+${Date.now()}@`);
  await registerPage.fillEmail(uniqueEmail);
  await registerPage.fillPassword(password);
  await registerPage.fillConfirmPassword(password);
  await registerPage.clickCreateAccountBtn();
});

Then('I am logged in and see the logout button', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});
