import { expect, type Locator, type Page } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;
  readonly title: Locator;
  readonly name: Locator;
  readonly emailAddress: Locator;
  readonly password: Locator;
  readonly days: Locator;
  readonly months: Locator;
  readonly years: Locator;
  readonly newsletter: Locator;
  readonly formText: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly company: Locator;
  readonly address1: Locator;
  readonly address2: Locator;
  readonly country: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly zipcode: Locator;
  readonly mobileNumber: Locator;
  readonly createAccount: Locator;
  readonly accountCreationMessage: Locator;
  readonly continueLink: Locator;
  readonly loggedinUserHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.getByRole("textbox", { name: "Name *", exact: true });
    this.emailAddress = page.getByRole("textbox", { name: "Email *" });
    this.title = page.getByRole("radio", { name: "Mr." });
    this.password = page.getByRole("textbox", { name: "Password *" });
    this.days = page.locator("#days");
    this.months = page.locator("#months");
    this.years = page.locator("#years");
    this.newsletter = page.getByRole("checkbox", {
      name: "Sign up for our newsletter!",
    });
    this.formText = page.locator("#form");
    this.firstName = page.getByRole("textbox", { name: "First name *" });
    this.lastName = page.getByRole("textbox", { name: "Last name *" });
    this.company = page.getByRole("textbox", { name: "Company", exact: true });
    this.address1 = page.getByRole("textbox", {
      name: "Address * (Street address, P.",
    });
    this.address2 = page.getByRole("textbox", { name: "Address 2" });
    this.country = page.getByLabel("Country *");
    this.city = page.getByRole("textbox", { name: "City * Zipcode *" });
    this.state = page.getByRole("textbox", { name: "State *" });
    this.zipcode = page.locator("#zipcode");
    this.mobileNumber = page.getByRole("textbox", { name: "Mobile Number *" });
    this.createAccount = page.getByRole("button", { name: "Create Account" });
    this.accountCreationMessage = page.locator("b");
    this.continueLink = page.getByRole("link", { name: "Continue" });
    this.loggedinUserHeader = page.locator("#header");
  }

  async clickRadioIcon() {
    await this.title.click();
  }

  async fillPassword(password: string) {
    await this.password.fill(password);
  }

  async selectDate(
    birth_date: string,
    birth_month: string,
    birth_year: string,
  ) {
    await this.days.selectOption(birth_date);
    await this.months.selectOption(birth_month);
    await this.years.selectOption(birth_year);
  }
  async checkNewsletter() {
    await this.newsletter.check();
  }

  async clickCreateAccount() {
    await this.createAccount.click();
  }

  async clickContinue() {
    await this.continueLink.click();
  }

  async fillDetails(
    firstname: string,
    lastname: string,
    company: string,
    address1: string,
    address2: string,
    country: string,
    state: string,
    city: string,
    zipcode: string,
    mobile_number: string,
  ) {
    await this.firstName.fill(firstname);
    await this.lastName.fill(lastname);
    await this.company.fill(company);
    await this.address1.fill(address1);
    await this.address2.fill(address2);
    await this.country.selectOption(country);
    await this.state.fill(state);
    await this.city.fill(city);
    await this.zipcode.fill(zipcode);
    await this.mobileNumber.fill(mobile_number);
  }
  async fillRegistrationForm(data: {
    password: string;
    birth_date: string;
    birth_month: string;
    birth_year: string;
    firstname: string;
    lastname: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobile_number: string;
  }) {
    await this.clickRadioIcon();
    await this.fillPassword(data.password);
    await this.selectDate(data.birth_date, data.birth_month, data.birth_year);
    await this.checkNewsletter();
    await this.fillDetails(
      data.firstname,
      data.lastname,
      data.company,
      data.address1,
      data.address2,
      data.country,
      data.state,
      data.city,
      data.zipcode,
      data.mobile_number,
    );
  }
}
