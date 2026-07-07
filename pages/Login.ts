import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly signUpname: Locator;
  readonly signUpemailAddress: Locator;
  readonly signUpButton: Locator;
  readonly loginEmailAddress: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly loginUserText:Locator;

  constructor(page: Page) {
    this.page = page;
    this.signUpname = page.getByRole("textbox", { name: "Name" });
    this.signUpemailAddress = page
      .locator("form")
      .filter({ hasText: "Signup" })
      .getByPlaceholder("Email Address");
    this.signUpButton = page.getByRole("button", { name: "Signup" });
    this.loginEmailAddress = page
      .locator("form")
      .filter({ hasText: "Login" })
      .getByPlaceholder("Email Address");
    this.loginPassword = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.loginUserText = page.locator('#header');
  }

  async gotoLogin() {
    await this.page.goto(`/login`);
  }

  async fillName(name: string) {
    await this.signUpname.fill(name);
  }

  async fillEmailAddress(email: string) {
    await this.signUpemailAddress.fill(email);
  }

  async clickSignUpButton() {
    await this.signUpButton.click();
  }

  async fillLoginCredential(email:string,password:string) {
    await this.loginEmailAddress.fill(email);
    await this.loginPassword.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }
}
