import { Locator, Page, expect } from '@playwright/test';

export class LoginPage {
  private page: Page;
  readonly registerBtn: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.registerBtn = page.getByRole('link', { name: 'Register' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInBtn = page.getByRole('button', { name: 'Sign In' });
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

}
