import { Locator, Page, expect } from "@playwright/test";

export class LoginPage {
    private page: Page;
    readonly registerBtn : Locator;

    constructor(page: Page) {
        this.page = page;

        this.registerBtn =page.getByRole('link', { name: 'Register' })
    }

    async navigate(){
        await this.page.goto('https://eventhub.rahulshettyacademy.com/login');
        await expect(this.page).toHaveURL('https://eventhub.rahulshettyacademy.com/login');
    }

   async clickRegisterBtn() {
    await this.registerBtn.click();
   }
}