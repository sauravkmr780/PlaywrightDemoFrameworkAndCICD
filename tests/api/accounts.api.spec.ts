import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

/**
 * API Test Suite — Account Module
 * Site: automationexercise.com
 * TC_API_005: Create new account (Faker data)
 * TC_API_006: Verify login with valid credentials (chain from TC_API_005)
 * TC_API_007: Get user detail by email (chain from TC_API_005)
 * TC_API_008: Verify login with invalid credentials (negative)
 * TC_API_009: Verify login with missing password (negative)
 * TC_API_011: Create account with duplicate email (negative)
 * TC_API_010: Delete account — cleanup (chain from TC_API_005)
 * TC_API_012: DELETE method on verifyLogin — method not allowed (negative)
 *
 * Note: Tests run in serial order using test.describe.serial()
 * TC_API_005 creates a user and stores email/password/name in shared variables
 * All subsequent tests in this suite depend on TC_API_005 running first
 */

let testEmail: string = faker.internet.email();
let testPassword: string = faker.internet.password({ length: 10 });
let testName: string = faker.person.fullName();


/*using faker each time different email,name and password returns
   console.log(testName)
   console.log(testEmail)
   console.log(testPassword)
*/
const createUserPayload = {
  name: testName,
  email: testEmail,
  password: testPassword,
  title: process.env.title ?? 'Mr',
  birth_date: process.env.birth_date ?? '15',
  birth_month: process.env.birth_month ?? '6',
  birth_year: process.env.birth_year ?? '1990',
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  company: faker.company.name(),
  address1: faker.location.streetAddress(),
  address2: faker.location.secondaryAddress(),
  country: process.env.country ?? 'Canada',
  zipcode: faker.location.zipCode(),
  state: faker.location.state(),
  city: faker.location.city(),
  mobile_number: faker.phone.number(),
};

test.describe.serial("Account creation", () => {
  test("TC_API_005 — Create new account ", async ({ request }) => {
    const res = await request.post(`/api/createAccount`, {
      multipart: createUserPayload,
    });
    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    const resJson = await res.json();
    console.log(resJson);
    expect(resJson.responseCode).toBe(201);
    expect(resJson.message).toContain("User created!");
    console.log(testEmail);
  });

  test("TC_API_006 — Verify login with valid credentials ", async ({
    request,
  }) => {
    const res = await request.post(`/api/verifyLogin`, {
      multipart: {
        email: testEmail,
        password: testPassword,
      },
    });
    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    const resJson = await res.json();
    console.log(resJson);
    expect(resJson.responseCode).toBe(200);
    expect(resJson.message).toContain("User exists!");
  });

  test("TC_API_007 — Get user detail by email ", async ({ request }) => {
    const res = await request.get(`/api/getUserDetailByEmail`, {
      params: {
        email: testEmail,
      },
    });
    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    const resJson = await res.json();
    console.log(resJson);
    expect(resJson.responseCode).toBe(200);
    expect(resJson.user.email).toEqual(createUserPayload.email);
    expect(resJson.user.name).toEqual(createUserPayload.name);
    expect(resJson.user.id).toBeDefined();
    expect(resJson.user.name).toBeDefined();
    expect(resJson.user.email).toBeDefined();
    expect(resJson.user.title).toBeDefined();
    expect(resJson.user.birth_day).toBeDefined();
    expect(resJson.user.country).toBeDefined();
  });

  test("TC_API_008 — Verify login with invalid credentials ", async ({
    request,
  }) => {
    const res = await request.post(`/api/verifyLogin`, {
      multipart: {
        email: "invalid_user@fakeemail.com",
        password: "WrongPassword123",
      },
    });
    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    const resJson = await res.json();
    console.log(resJson);
    expect(resJson.responseCode).toBe(404);
    expect(resJson.message).toContain("User not found!");
  });

  test("TC_API_009 — Verify login with missing password ", async ({
    request,
  }) => {
    const res = await request.post(`/api/verifyLogin`, {
      multipart: {
        email: "invalid_user@fakeemail.com",
        password: "", //(empty)
      },
    });
    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    const resJson = await res.json();
    console.log(resJson);
    expect(resJson.responseCode).toBe(400);
    expect(resJson.message).toContain("Bad request");
  });

  test("TC_API_011 — Create account with duplicate email ", async ({
    request,
  }) => {
    const res = await request.post(`/api/createAccount`, {
      multipart: createUserPayload,
    });
    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    const resJson = await res.json();
    console.log(resJson);
    expect(resJson.responseCode).toBe(400);
    expect(resJson.message).toContain("Email already exists!");
  });

  test("TC_API_010 — Delete account ", async ({ request }) => {
    const res = await request.delete(`/api/deleteAccount`, {
      multipart: {
        email: testEmail,
        password: testPassword,
      },
    });
    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    const resJson = await res.json();
    console.log(resJson);
    expect(resJson.responseCode).toBe(200);
    expect(resJson.message).toContain("Account deleted!");
  });

  test("TC_API_012 — DELETE method on verifyLogin ", async ({ request }) => {
    const res = await request.delete(`/api/verifyLogin`);
    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    const resJson = await res.json();
    console.log(resJson);
    expect(resJson.responseCode).toBe(405);
    expect(resJson.message).toContain("This request method is not supported.");
  });
});
