import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';

Given('I am on the login page', async ({ pageObjects }) => {
  await pageObjects.loginPage.navigate();
});

When('I go to the register page', async ({ pageObjects }) => {
  await pageObjects.loginPage.clickRegisterBtn();
});

When('I register with email {string} and password {string}', async ({ pageObjects }, email, password) => {
  const uniqueEmail = email.replace('@', `+${Date.now()}@`);
  await pageObjects.registerPage.fillEmail(uniqueEmail);
  await pageObjects.registerPage.fillPassword(password);
  await pageObjects.registerPage.fillConfirmPassword(password);
  await pageObjects.registerPage.clickCreateAccountBtn();
});

When('I try to register with existing email {string}', async ({ pageObjects }, email) => {
  await pageObjects.registerPage.fillEmail(email);
  await pageObjects.registerPage.fillPassword('Testing@123');
  await pageObjects.registerPage.fillConfirmPassword('Testing@123');
  await pageObjects.registerPage.clickCreateAccountBtnOnly();
});

When('I try to register with email {string} password {string} and confirm password {string}', async ({ pageObjects }, email, password, confirmPassword) => {
  await pageObjects.registerPage.fillEmail(email);
  await pageObjects.registerPage.fillPassword(password);
  await pageObjects.registerPage.fillConfirmPassword(confirmPassword);
  await pageObjects.registerPage.clickCreateAccountBtnOnly();
});

Then('I am logged in and see the logout button', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});

Then('I should see error message {string}', async ({ pageObjects }, errorMessage) => {
  await expect(pageObjects.registerPage.getErrorLocator(errorMessage)).toBeVisible();
});
