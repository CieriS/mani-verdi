import { defineConfig, devices } from '@playwright/test';

/**
 * The production build, served by `astro preview` on a port of its own: what is tested is what
 * gets deployed. A dev server on the default port is never reused by mistake.
 */
const PORT = Number(process.env.PORT ?? 4332);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',
  // One set of reference screenshots, Chromium on Linux (see e2e/visual.spec.ts). On CI a missing
  // reference must fail: the default would write it and the retry would then pass.
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  updateSnapshots: process.env.CI ? 'none' : 'missing',
  use: { baseURL: BASE_URL, trace: 'on-first-retry' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --ignore-lock`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
