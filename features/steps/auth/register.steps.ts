import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';

Given('I am on the login page', async ({ pageObjects }) => {
  await pageObjects.loginPage.navigate();
});

Given('I navigate to the registration page', async ({ pageObjects }) => {
  await pageObjects.loginPage.clickRegisterBtn();
});

When('I go to the register page', async ({ pageObjects }) => {
  await pageObjects.loginPage.clickRegisterBtn();
});

When('I register with valid credentials', async ({ pageObjects }) => {
  const uniqueEmail = 'testing@gmail.com'.replace('@', `+${Date.now()}@`);
  await pageObjects.registerPage.fillEmail(uniqueEmail);
  await pageObjects.registerPage.fillPassword('Testing@123');
  await pageObjects.registerPage.fillConfirmPassword('Testing@123');
  await pageObjects.registerPage.clickCreateAccountBtn();
});

When('I attempt to register with email {string} and password {string} and confirm password {string}', async ({ pageObjects }, email, password, confirmPassword) => {
  await pageObjects.registerPage.fillEmail(email);
  await pageObjects.registerPage.fillPassword(password);
  await pageObjects.registerPage.fillConfirmPassword(confirmPassword);
  await pageObjects.registerPage.clickCreateAccountBtnOnly();
});

Then('I am logged in', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});

Then('I see the logout button', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});

Then('I should see error message {string}', async ({ pageObjects }, errorMessage) => {
  await expect(pageObjects.registerPage.getErrorLocator(errorMessage)).toBeVisible();
});
