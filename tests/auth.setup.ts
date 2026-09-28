import { test as setup, expect } from './fixtures/baseTest';
import { AUTH_STATE } from './fixtures/authState';
import user from '../data/auth/user.json';
import eventData from '../data/admin/manage-events.json';

// Logs in once per account and saves the session, so specs start already logged in
setup('authenticate as user', async ({ loginPage, homePage, navBar, page }) => {
  await loginPage.navigate();
  await loginPage.login(user.validUser.email, user.validUser.password);
  await homePage.verifyPageLoaded();
  await expect(navBar.logOutBtn).toBeVisible();
  await page.context().storageState({ path: AUTH_STATE.user });
});

setup('authenticate as admin', async ({ loginPage, homePage, navBar, page }) => {
  await loginPage.navigate();
  await loginPage.login(eventData.adminUser.email, eventData.adminUser.password);
  await homePage.verifyPageLoaded();
  await expect(navBar.logOutBtn).toBeVisible();
  await page.context().storageState({ path: AUTH_STATE.admin });
});
