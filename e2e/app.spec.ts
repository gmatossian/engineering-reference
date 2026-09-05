import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const JAVA_TOPIC_ID = 'd3ef7c8b-ee6b-48f5-9039-2aa94d03c19c';

test('navigates from the landing view to a bundled Topic', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Engineering Reference',
    }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Java', exact: true }).click();

  await expect(page).toHaveURL(`/topics/${JAVA_TOPIC_ID}`);
  await expect(page.getByRole('heading', { level: 1, name: 'Java' })).toBeVisible();
  await expect(page).toHaveTitle('Java | Engineering Reference');

  await page.getByRole('button', { name: 'Back', exact: true }).click();

  await expect(page).toHaveURL('/');
  await expect(page).toHaveTitle('Engineering Reference');

  await page.getByRole('link', { name: 'Java', exact: true }).click();
  await page.getByRole('link', { name: 'Home', exact: true }).click();

  await expect(page).toHaveURL('/');
  await expect(page).toHaveTitle('Engineering Reference');
});

test('presents an unknown Topic without redirecting', async ({ page }) => {
  await page.goto('/topics/unknown-topic');

  await expect(page).toHaveURL('/topics/unknown-topic');
  await expect(page.getByRole('heading', { level: 1, name: 'Topic not found' })).toBeVisible();
  await expect(page).toHaveTitle('Topic not found | Engineering Reference');
});

test('renders the application without detectable accessibility violations', async ({ page }) => {
  await page.goto('/');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
