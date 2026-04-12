import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/auth/Login.page';
import { RegisterPage } from '../../pages/auth/Register.page';

test.describe('User Registration', () => {
  let loginPage: LoginPage;
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
    await loginPage.navigate();
    await loginPage.clickRegisterBtn();
  });

  test('New user successfully registers', async () => {
    const uniqueEmail = 'testing@gmail.com'.replace('@', `+${Date.now()}@`);
    await registerPage.fillEmail(uniqueEmail);
    await registerPage.fillPassword('Testing@123');
    await registerPage.fillConfirmPassword('Testing@123');
    await registerPage.clickCreateAccountBtn();
    await expect(registerPage.logOutBtn).toBeVisible();
  });

  const invalidInputs = [
    { email: 'negative@test.com', password: 'Testing@123', confirmPassword: 'WrongPass@1', errorMessage: 'Passwords do not match' },
    { email: 'testing@gmail.com', password: 'Testing@123', confirmPassword: 'Testing@123', errorMessage: 'Email already registered' },
  ];

  for (const { email, password, confirmPassword, errorMessage } of invalidInputs) {
    test(`Registration fails for invalid input with email: ${email}`, async () => {
      await registerPage.fillEmail(email);
      await registerPage.fillPassword(password);
      await registerPage.fillConfirmPassword(confirmPassword);
      await registerPage.clickCreateAccountBtnOnly();

      await expect(registerPage.getErrorLocator(errorMessage)).toBeVisible();
    });
  }
});
