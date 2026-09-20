import { expect, test } from '@playwright/test';

test(
  'loads the real generated catalog and a canonical nested route',
  { tag: '@real-catalog' },
  async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Engineering Reference' }),
    ).toBeVisible();

    const curatedTopics = page.getByRole('navigation', { name: 'Curated paths' });
    const firstTopic = curatedTopics.getByRole('link').first();
    const destination = await firstTopic.getAttribute('href');

    expect(destination).toMatch(/^\/topics\/[0-9a-f-]+$/u);
    await page.goto(destination!);

    await expect(page).toHaveURL(new RegExp(`${destination!}$`, 'u'));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: 'Browse surrounding topics' }).first(),
    ).toBeVisible();
  },
);
