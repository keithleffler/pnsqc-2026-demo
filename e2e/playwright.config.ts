import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import dotenv from 'dotenv';

dotenv.config();

const isCI = process.env.CI === 'true';
const headless = process.env.HEADLESS === 'true';
const browserName = process.env.BROWSER || 'chromium';

// Generates Playwright spec files from the .feature files + step definitions.
// The returned path is the testDir Playwright (and the VS Code extension) runs.
const testDir = defineBddConfig({
  features: 'src/tests/features/**/*.feature',
  steps: 'src/tests/steps/**/*.ts',
});

export default defineConfig({
  testDir,
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  workers: isCI ? Number(process.env.CI_WORKERS) || 1 : undefined,
  use: {
    headless,
    screenshot: 'only-on-failure',
    video: process.env.VIDEO_CI === 'true' ? 'on' : 'retain-on-failure',
    trace: 'on-first-retry',
  },
  reporter: [['html', { open: 'never' }]],
  projects: [
    {
      name: browserName,
      use: {
        browserName: browserName as 'chromium' | 'firefox' | 'webkit',
      },
    },
  ],
});
