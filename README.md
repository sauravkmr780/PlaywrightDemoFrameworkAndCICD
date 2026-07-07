Playwright E-Commerce Automation Framework

A scalable, production-ready test automation framework built with Playwright + TypeScript, covering UI and API automation for an e-commerce application. Designed with enterprise best practices: Page Object Model, environment-based configuration, secure credential management, and CI/CD integration via GitHub Actions.


Tech Stack

ToolPurposePlaywrightUI + API test automationTypeScriptProgramming languageFaker.jsDynamic test data generationdotenvEnvironment variable managementcross-envCross-platform ENV variable passingGitHub ActionsCI/CD pipeline


Folder Structure

PlaywrightFrameworkSetup/
├── .github/
│   └── workflows/
│       └── playwright.yml        # CI/CD pipeline configuration
├── pages/                        # Page Object Model classes
│   ├── Login.ts                  # Login + Signup page locators & methods
│   └── Register.ts               # Registration page locators & methods
├── tests/
│   ├── api/                      # API test suites
│   │   ├── products.api.spec.ts  # TC_API_001 to TC_API_004
│   │   └── accounts.api.spec.ts  # TC_API_005 to TC_API_012
│   └── ui/                       # UI test suites
│       ├── login.spec.ts         # TC_UI_001, TC_UI_002
│       └── signup.spec.ts        # TC_UI_003
├── testdata/                     # Non-sensitive test data per environment
│   ├── qa.json
│   ├── stage.json
│   └── prod.json
├── .env.qa                       # Sensitive credentials — QA (gitignored)
├── .env.stage                    # Sensitive credentials — Stage (gitignored)
├── .env.prod                     # Sensitive credentials — Prod (gitignored)
├── .gitignore
├── playwright.config.ts          # Framework configuration
├── package.json
└── tsconfig.json


Framework Design

1. Page Object Model (POM)

Locators and reusable methods are encapsulated inside dedicated page classes, keeping test files clean and maintainable.

typescript// pages/Login.ts
export class LoginPage {
  constructor(page: Page) {
    this.loginEmailAddress = page.locator('[data-qa="login-email"]');
    this.loginPassword = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
  }

  async login(email: string, password: string) {
    await this.loginEmailAddress.fill(email);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
  }
}

Benefits:


One locator change fixes all test cases automatically
Test files only contain assertions and flow — no locator clutter
Demonstrates OOP principles: Encapsulation, Abstraction, Inheritance (extends BasePage)



2. Test Data Strategy

Test data is split by sensitivity:

Non-sensitive data → testdata/<env>.json

Committed to the repository. Contains UI labels, static form values, and config that varies per environment but contains no credentials.

json// testdata/qa.json
{
  "title": "Mr",
  "birth_date": "15",
  "birth_month": "6",
  "birth_year": "1990"
}

Sensitive data → .env.<env> files

Gitignored — never committed to the repository. Contains credentials and base URLs.

# .env.qa (local only — not in repo)
BASE_URL=https://automationexercise.com
VALID_EMAIL_ADDRESS=your@email.com
VALID_PASSWORD=yourpassword
VALID_NAME=Your Name

Dynamic test data → Faker.js

For API tests that create new users, Faker generates unique data on every run — preventing duplicate email errors and ensuring test independence.

typescriptconst testEmail = faker.internet.email();
const testPassword = faker.internet.password({ length: 10 });
const testName = faker.person.fullName();


3. Environment Switching

The framework supports running tests against different environments (QA, Stage, Prod) without changing any test code.

playwright.config.ts reads the ENV variable and loads the matching .env file:

typescriptconst ENV = process.env.ENV || 'qa';
dotenv.config({ path: `.env.${ENV}` });

Run tests per environment:

bashnpm run test:qa     # loads .env.qa
npm run test:stage  # loads .env.stage
npm run test:prod   # loads .env.prod


4. Sensitive Credentials in CI/CD (GitHub Secrets)

Since .env files are gitignored, CI/CD gets credentials from GitHub Repository Secrets — encrypted at rest and never visible in logs.

Secrets configured in Settings → Secrets and variables → Actions:

Secret NamePurposeBASE_URLApplication base URLVALID_EMAIL_ADDRESSTest user emailVALID_PASSWORDTest user passwordVALID_NAMETest user display name

These are injected into the pipeline via the env: block in playwright.yml:

yamlenv:
  BASE_URL: ${{ secrets.BASE_URL }}
  VALID_EMAIL_ADDRESS: ${{ secrets.VALID_EMAIL_ADDRESS }}
  VALID_PASSWORD: ${{ secrets.VALID_PASSWORD }}
  VALID_NAME: ${{ secrets.VALID_NAME }}

The test code reads process.env.VALID_EMAIL_ADDRESS — same call works both locally (from .env file via dotenv) and in CI (from GitHub Secrets injection). The test code never changes between environments.


Test Coverage

API Tests — automationexercise.com/api

Test IDDescriptionTypeTC_API_001Get all products listPositiveTC_API_002Get all brands listPositiveTC_API_003Search product by keywordPositiveTC_API_004Search product with empty keywordNegativeTC_API_005Create new account (Faker data)PositiveTC_API_006Verify login with valid credentialsPositive (chained)TC_API_007Get user detail by emailPositive (chained)TC_API_008Verify login with invalid credentialsNegativeTC_API_009Verify login with missing passwordNegativeTC_API_011Create account with duplicate emailNegativeTC_API_010Delete account (cleanup)Positive (chained)TC_API_012DELETE method on verifyLoginNegative (wrong method)

API chaining pattern: TC_API_005 creates a user → TC_API_006/007 validate it → TC_API_011 tests duplicate → TC_API_010 deletes (cleanup). All chained tests run in serial order using test.describe.serial().

UI Tests — automationexercise.com

Test IDDescriptionTagsTC_UI_001Valid login navigates to homepage@smoke @regressionTC_UI_002Invalid login shows error message@regressionTC_UI_003New user signup end-to-end flow@regression


CI/CD Pipeline — GitHub Actions

The pipeline runs automatically on every push/PR to master, and can also be triggered manually with environment selection.

Pipeline stages:


Checkout code
Setup Node.js 20
Install dependencies (npm ci)
Install Playwright browsers (npx playwright install --with-deps)
Run tests (headless, with secrets injected)
Upload HTML report as artifact (retained 7 days)


Manual trigger with environment selection:

Go to GitHub → Actions → Playwright Tests → Run workflow → select qa, stage, or prod.

yamlworkflow_dispatch:
  inputs:
    environment:
      type: choice
      options: [qa, stage, prod]


Local Setup

bash# 1. Clone the repo
git clone https://github.com/sauravkmr780/PlaywrightDemoFrameworkAndCICD.git
cd PlaywrightDemoFrameworkAndCICD

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Create your local .env.qa file (not in repo — create manually)
# Add: BASE_URL, VALID_EMAIL_ADDRESS, VALID_PASSWORD, VALID_NAME

# 5. Run tests
npm run test:qa

# 6. View HTML report
npm run report


Key Design Decisions


POM over inline locators — one locator change fixes all tests, not just one
Sensitive/non-sensitive data split — security-first approach, critical for banking/enterprise projects
Faker for API test data — unique email per run prevents duplicate account errors and ensures test independence
test.describe.serial() — used for chained API tests where order matters (create → verify → delete)
storageState reuse — login once, reuse session across tests to reduce CI execution time
cross-env — ensures ENV=qa works identically on Windows, Mac, and Linux CI runners