import { test, expect } from '../fixtures/baseTest';
import userData from '../../data/auth/user.json';


test.describe('User Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
});

test('User can login with valid credentials', async ({ loginPage, navBar, homePage }) => {
    await loginPage.login(userData.validUser.email, userData.validUser.password);
    await homePage.verifyPageLoaded();
  });

  test('Successful login shows the logged-in navbar state', async ({ loginPage, navBar }) => {
    await loginPage.login(userData.validUser.email, userData.validUser.password);
    await expect(navBar.logOutBtn).toBeVisible();
  });

  test('User can navigate to the Register page from login', async ({ loginPage, page }) => {
    await loginPage.clickRegisterBtn();
    await expect(page).toHaveURL(/\/register/);
  });

  test('Session persists after a page reload', async ({ loginPage, navBar, homePage, page }) => {
    await loginPage.login(userData.validUser.email, userData.validUser.password);
    await homePage.verifyPageLoaded();
    await page.reload();
    await expect(navBar.logOutBtn).toBeVisible();
  });

  test('User can log out after logging in', async ({ loginPage, navBar }) => {
    await loginPage.login(userData.validUser.email, userData.validUser.password);
    await expect(navBar.logOutBtn).toBeVisible();
    await navBar.logOutBtn.click();
    await expect(loginPage.signInBtn).toBeVisible();
  });

})
