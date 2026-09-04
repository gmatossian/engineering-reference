import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('renders the application shell without detectable accessibility violations', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Engineering Reference',
    }),
  ).toBeVisible();

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
