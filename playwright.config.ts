import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',

  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      grepInvert: /@real-catalog/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      grep: /@smoke/,
      grepInvert: /@real-catalog/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      grep: /@smoke/,
      grepInvert: /@real-catalog/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'real-catalog',
      grep: /@real-catalog/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4174',
      },
    },
  ],

  webServer: [
    {
      command: 'npm run serve:e2e:fixture',
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'npm run serve:e2e:catalog',
      url: 'http://127.0.0.1:4174',
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
