import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/Login";

test("TC_UI_001 — Valid Login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  //Navigate to /login
  await loginPage.gotoLogin();
  await expect(page).toHaveURL(/\/login/);
  //fill login credentials
  await loginPage.fillLoginCredential(
    process.env.VALID_EMAIL_ADDRESS!,
    process.env.VALID_PASSWORD!,
  );
  await expect(loginPage.loginEmailAddress).toHaveValue(
    process.env.VALID_EMAIL_ADDRESS!,
  );
  await expect(loginPage.loginPassword).toHaveValue(
    process.env.VALID_PASSWORD!,
  );
  await expect(loginPage.loginButton).toBeVisible();
  //Click login button
  await loginPage.clickLoginButton();
  //assert loggedin user
  await expect(loginPage.loginUserText).toContainText(
    `Logged in as ${process.env.VALID_NAME!}`,
  );
});
