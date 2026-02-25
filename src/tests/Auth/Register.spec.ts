import { test } from "@playwright/test";
import { RegisterPage } from "../../Pages/Auth/Register";
import testData from "../../Test-Data/resgister.json";
import { LoginPage } from "../../Pages/Auth/Login";
test('Register', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.clickRegisterBtn();
    const uniqueEmail = testData.register_user.email.replace('@', `+${Date.now()}@`);
    await registerPage.fillEmail(uniqueEmail);
    await registerPage.fillPassword(testData.register_user.password);
    await registerPage.fillConfirmPassword(testData.register_user.confirm_password);
    await registerPage.clickCreateAccountBtn();
});