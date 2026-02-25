import { Page ,Locator, expect} from "@playwright/test";

export class RegisterPage {
    private page: Page;
    readonly emailInput : Locator;
    readonly passwordInput : Locator;
    readonly confirmPasswordInput : Locator;
    readonly createAccountBtn : Locator;
    readonly logOutBtn : Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByRole('textbox', { name: 'you@email.com' });
        this.passwordInput = page.getByRole('textbox', { name: 'Min 8 chars, uppercase, number & symbol' });
        this.confirmPasswordInput = page.getByRole('textbox', { name: 'Repeat your password' });
        this.createAccountBtn = page.getByRole('button', { name: 'Create Account' })
        this.logOutBtn = page.getByRole('button', { name: 'Logout' })
    }

    async fillEmail(email : string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password : string) {
        await this.passwordInput.fill(password);
    }

    async fillConfirmPassword(confirmPassword : string) {
        await this.confirmPasswordInput.fill(confirmPassword);
    }

    async clickCreateAccountBtn() {
        await this.createAccountBtn.click();
        await expect(this.logOutBtn).toBeVisible();
    }
 
}