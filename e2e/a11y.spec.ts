import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

for (const { name, path } of PAGES) {
  test(`${name} has no WCAG A/AA violations`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);

    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

    expect(
      violations.map((v) => `${v.id} (${v.nodes.length}): ${v.help} — ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
      `axe violations on ${path}`,
    ).toEqual([]);
  });
}

test('every page answers, and an unknown address answers 404', async ({ request }) => {
  for (const { name, path } of PAGES) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(name === 'not-found' ? 404 : 200);
  }
});
