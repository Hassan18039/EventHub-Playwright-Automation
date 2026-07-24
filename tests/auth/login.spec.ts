import { test, expect } from '../fixtures/baseTest';
import userData from '../../data/auth/user.json';


test.describe('User Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
});

test('User can login with valid credentials', {tag: '@positive'}, async ({ loginPage, navBar, homePage }) => {
    await loginPage.login(userData.validUser.email, userData.validUser.password);
    await homePage.verifyPageLoaded();
  });

  test('Successful login shows the logged-in navbar state',{tag: '@positive'}, async ({ loginPage, navBar }) => {
    await loginPage.login(userData.validUser.email, userData.validUser.password);
    await expect(navBar.logOutBtn).toBeVisible();
  });

  test('User can navigate to the Register page from login', {tag: '@positive'}, async ({ loginPage, page }) => {
    await loginPage.clickRegisterBtn();
    await expect(page).toHaveURL(/\/register/);
  });

  test('Session persists after a page reload', {tag: '@positive'}, async ({ loginPage, navBar, homePage, page }) => {
    await loginPage.login(userData.validUser.email, userData.validUser.password);
    await homePage.verifyPageLoaded();
    await page.reload();
    await expect(navBar.logOutBtn).toBeVisible();
  });

  test('User can log out after logging in', {tag: '@positive'}, async ({ loginPage, navBar }) => {
    await loginPage.login(userData.validUser.email, userData.validUser.password);
    await expect(navBar.logOutBtn).toBeVisible();
    await navBar.logOutBtn.click();
    await expect(loginPage.signInBtn).toBeVisible();
  });

  test('Login shows error message with invalid credentials', {tag: '@negative'}, async ({ loginPage }) => {
    await loginPage.login(userData.invalidUser.email, userData.invalidUser.password);
    await loginPage.passAndEmailErrorMessage();
  });

  test('Login form shows validation errors for empty fields', {tag: '@negative'}, async ({ loginPage }) => {
    await loginPage.login('', '');
    await loginPage.emailValidationErrorMessage();
    await loginPage.passwordValidationErrorMessage();
  });

  test('Login form shows validation error for invalid email format', {tag: '@negative'}, async ({ loginPage }) => {
    await loginPage.login(userData.invalidEmailFormatAndShortPassword.email, userData.validUser.password);
    await loginPage.emailValidationErrorMessage();
  });

  test('Login form shows validation error for short password', {tag: '@negative'}, async ({ loginPage }) => {
    await loginPage.login(userData.validUser.email, userData.invalidEmailFormatAndShortPassword.shortPassword);
    await loginPage.passwordValidationErrorMessage();
  })
});
