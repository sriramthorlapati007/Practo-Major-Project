import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout : 500_000,
  retries: process.env.CI ? 2 : 0,
  
  reporter: [
    ['line'], // Console output
    ['allure-playwright', {
      outputFolder: 'allure-results', // Allure results folder
      detail: true,
      suiteTitle: false,
    }],
  ],
  use: {
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',
    
 launchOptions: {
       slowMo: 100,
       headless: false
     }
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'smoke',
      testMatch: /.*\.spec\.ts/,
      grep: /@smoke/,
      retries: 0,
      timeout: 70_000,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'sanity',
      testMatch: /.*\.spec\.ts/,
      grep: /@sanity/,
      retries: 0,
      timeout: 100_000,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'regression',
      testMatch: /.*\.spec\.ts/,
      grep: /@regression/,
      retries: 0,
      timeout: 100_000,
      use: { ...devices['Desktop Chrome'] },
    },
/*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },/*

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
