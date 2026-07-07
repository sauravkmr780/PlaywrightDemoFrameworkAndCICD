import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { LoginPage } from "../../pages/Login";
import { RegisterPage } from "../../pages/Register";

const name: string = faker.person.fullName();
const email: string = faker.internet.email();
const password: string = faker.internet.password();
const birth_date: string = "15";
const birth_month: string = "6";
const birth_year: string = "1990";
const firstname: string = faker.person.firstName();
const lastname: string = faker.person.lastName();
const company: string = faker.company.name();
const address1: string = faker.location.streetAddress();
const address2: string = faker.location.secondaryAddress();
const country: string = "Canada";
const zipcode: string = faker.location.zipCode();
const state: string = faker.location.state();
const city: string = faker.location.city();
const mobile_number: string = faker.phone.number();

test("@smoke @regression TC_UI_003 — New User Signup", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const registerPage = new RegisterPage(page);

  // Step 1 — Navigate to login page
  await loginPage.gotoLogin();

  // Step 2 — Fill signup form on login page
  await loginPage.fillName(name);
  await loginPage.fillEmailAddress(email);
  await loginPage.clickSignUpButton();

  // Step 3 — Verify redirected to signup/register page
  await expect(page).toHaveURL(/\/signup/);

  // Step 4 — Verify name and email pre-populated from previous step
  await expect(registerPage.name).toHaveValue(name);
  await expect(registerPage.emailAddress).toHaveValue(email);

  // Step 5 — Fill full registration form using encapsulated method
  await registerPage.fillRegistrationForm({
    password,
    birth_date,
    birth_month,
    birth_year,
    firstname,
    lastname,
    company,
    address1,
    address2,
    country,
    state,
    city,
    zipcode,
    mobile_number,
  });

  // Step 6 — Verify address section visible before submitting
  await expect(registerPage.formText).toContainText("Address Information");
  await expect(registerPage.country).toHaveValue("Canada");

  // Step 7 — Submit registration
  await expect(registerPage.createAccount).toBeVisible();
  await registerPage.clickCreateAccount();

  // Step 8 — Verify account created
  await expect(registerPage.accountCreationMessage).toContainText("Account Created!");
  await expect(registerPage.continueLink).toBeVisible();
  await registerPage.clickContinue();

  // Step 9 — Verify logged in as new user
  await expect(registerPage.loggedinUserHeader).toContainText(`Logged in as ${name}`);
});