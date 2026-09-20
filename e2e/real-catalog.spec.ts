import { expect, test } from '@playwright/test';

test(
  'loads the real generated catalog and a canonical nested route',
  { tag: '@real-catalog' },
  async ({ page }) => {
    const expectedTopicCountText = process.env['ENGINEERING_REFERENCE_REAL_TOPIC_COUNT'];
    expect(
      expectedTopicCountText,
      'Run Playwright through `npm run test:e2e` so the real-catalog verification context is available.',
    ).toMatch(/^[1-9]\d*$/u);
    const expectedTopicCount = Number(expectedTopicCountText);

    await page.goto('/');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Engineering Reference' }),
    ).toBeVisible();

    const curatedTopics = page.getByRole('navigation', { name: 'Curated paths' });
    const firstTopic = curatedTopics.getByRole('link').first();
    const destination = await firstTopic.getAttribute('href');

    expect(destination).toMatch(/^\/topics\/[0-9a-f-]+$/u);

    await page.goto('/topics');
    await expect(page.getByRole('status')).toHaveText(
      `${expectedTopicCount} ${expectedTopicCount === 1 ? 'topic' : 'topics'}`,
    );

    await page.goto(destination!);

    await expect(page).toHaveURL(new RegExp(`${destination!}$`, 'u'));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: 'Browse surrounding topics' }).first(),
    ).toBeVisible();
  },
);
