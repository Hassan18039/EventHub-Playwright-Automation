import { Locator, Page, expect } from '@playwright/test';

export class LoginPage {
  private page: Page;
  readonly registerBtn: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInBtn: Locator;
  readonly errorMessage: Locator;
  readonly emailValidationError: Locator;
  readonly passwordValidationError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.registerBtn = page.getByRole('link', { name: 'Register' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInBtn = page.getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.getByText('Invalid email or password', { exact: true })
    this.emailValidationError = page.getByText('Enter a valid email', { exact: true });
    this.passwordValidationError = page.getByText('Password must be at least 6 characters', { exact: true });
  }

  async navigate() {
    await this.page.goto('/login');
    await expect(this.page).toHaveURL(/\/login/);
  }

  async clickRegisterBtn() {
    await this.registerBtn.click();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInBtn.click();
  }
  
  async passAndEmailErrorMessage() {

    await expect(this.errorMessage).toBeVisible();
  }

  async emailValidationErrorMessage() {
    await expect(this.emailValidationError).toBeVisible();
  }

  async passwordValidationErrorMessage() {
    await expect(this.passwordValidationError).toBeVisible();
  }

}
