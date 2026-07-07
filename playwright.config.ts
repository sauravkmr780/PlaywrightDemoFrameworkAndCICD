import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
//sensitive test data setup
const ENV = process.env.ENV || 'qa';
dotenv.config({ path: path.resolve(__dirname, `.env.${ENV}`) });
//non -sensitive test data setup
const testdata = require(`./testdata/${ENV}.json`);
Object.assign(process.env, testdata);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['line'], 
    ['html', { open: 'never' }] 
  ],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure-and-retries',
    video: 'retain-on-failure-and-retries',
    screenshot: 'only-on-failure',
    headless: true
  },

  projects: [
    // Add a dedicated API testing project that only runs once
    {
      name: 'api-tests',
      testMatch: /.*\.api\.spec\.ts/,
    },
    // Your UI projects should ignore the API test files
    {
      name: 'chromium',
      testIgnore: /.*\.api\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: /.*\.api\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: /.*\.api\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
  ],
});