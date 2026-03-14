import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {
  private page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly createAccountBtn: Locator;
  readonly logOutBtn: Locator;
  readonly passwordMismatchError: Locator;
  readonly emailAlreadyRegisteredError: Locator;
  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'you@email.com' });
    this.passwordInput = page.getByRole('textbox', { name: 'Min 8 chars, uppercase, number & symbol' });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Repeat your password' });
    this.createAccountBtn = page.getByRole('button', { name: 'Create Account' });
    this.logOutBtn = page.getByRole('button', { name: 'Logout' });
    this.passwordMismatchError = page.getByText('Password do not match');
    this.emailAlreadyRegisteredError = page.getByText('Email already registered');
}

  /** Error message – in form or in toast (e.g. relative overflow-hidden container). */
  getErrorLocator(message: string): Locator {
    return this.page.getByText(message);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(confirmPassword: string) {
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async clickCreateAccountBtn() {
    await this.createAccountBtn.click();
    await expect(this.logOutBtn).toBeVisible();
  }

  async clickCreateAccountBtnOnly() {
    await this.createAccountBtn.click();
    await this.page.waitForTimeout(1000);
  }

  async checkPasswordMismatchError() {
    await expect(this.passwordMismatchError).toBeVisible();
  }

  async checkPasswordMismatchErrorMessage(errorMessage: string) {
    await expect(this.passwordMismatchError).toHaveText(errorMessage, { ignoreCase: true });
  }

  async checkEmailAlreadyRegisteredErrorText(errorMessage: string) {
    await expect(this.emailAlreadyRegisteredError).toHaveText(errorMessage, { ignoreCase: true });
  }
}
