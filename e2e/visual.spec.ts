import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

/**
 * Reference screenshots of every page, desktop and phone. Rendering differs between operating
 * systems, so the references are Chromium on Linux (the CI) and the suite is skipped elsewhere.
 * Locally: `_infra/scripts/playwright-docker.sh . -- e2e/visual.spec.ts` (README, "Test").
 */
test.skip(({ browserName }) => browserName !== 'chromium' || process.platform !== 'linux', 'references exist for Chromium on Linux only');

for (const { name, path } of PAGES) {
  test(`${name} matches its reference`, async ({ page, isMobile }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    // Lazy images below the fold load on scroll: bring them all in before the full-page shot.
    await page.evaluate(async () => {
      for (const img of document.querySelectorAll('img')) img.loading = 'eager';
      await Promise.all([...document.images].map((img) => (img.complete ? null : img.decode().catch(() => null))));
    });

    await expect(page).toHaveScreenshot(`${name}-${isMobile ? 'phone' : 'desktop'}.png`, {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.002,
    });
  });
}
