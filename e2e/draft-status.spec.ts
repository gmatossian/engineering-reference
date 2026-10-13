import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { FIXTURE_TOPIC_IDS, fixtureTopicPath } from './fixture';

test(
  'filters drafts uniquely and restores their state through navigation and refresh',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.goto('/topics');
    const status = page.getByLabel('Status', { exact: true });
    await expect(status).toHaveValue('');
    await status.focus();
    await status.selectOption('draft');
    await expect(status).toBeFocused();
    await expect(page).toHaveURL('/topics?status=draft');
    await expect(page.getByRole('status')).toHaveText('2 draft topics');
    await expect(page.locator('.result__title')).toHaveText(['Shared path', 'Storage choice']);
    await expect(page.locator('app-topic-result-list .draft-status')).toHaveCount(2);
    await page.reload();
    await expect(status).toHaveValue('draft');

    await page.getByRole('link', { name: /^Shared path Draft/u }).click();
    const heading = page.getByRole('heading', { level: 1, name: 'Shared path', exact: true });
    await expect(page).toHaveURL(fixtureTopicPath(FIXTURE_TOPIC_IDS.sharedPath));
    await expect(heading).toBeFocused();
    await expect(heading).toHaveAccessibleDescription('Draft');
    const occurrences = page
      .locator('.topic-hierarchy-wide')
      .getByRole('link', { name: 'Shared path Draft', exact: true });
    await expect(occurrences).toHaveCount(2);
    await expect(occurrences.nth(0)).toHaveAttribute('aria-current', 'page');
    await expect(occurrences.nth(1)).toHaveAttribute(
      'href',
      fixtureTopicPath(FIXTURE_TOPIC_IDS.sharedPath),
    );
    await page.goBack();
    await expect(page).toHaveURL('/topics?status=draft');
    await expect(status).toHaveValue('draft');
    await page.goForward();
    await expect(heading).toBeFocused();
  },
);

test('combines draft filters, preserves status during header search, and clears constraints', async ({
  page,
}) => {
  await page.goto('/topics?status=draft');
  await page.getByLabel('Domain', { exact: true }).selectOption('databases');
  await page.getByRole('radio', { name: 'Decision aids', exact: true }).check();
  const search = page.getByRole('searchbox', { name: 'Search topics' });
  await search.fill('storage');
  await search.press('Enter');
  await expect
    .poll(() => Object.fromEntries(new URL(page.url()).searchParams))
    .toEqual({
      q: 'storage',
      domain: 'databases',
      kind: 'decision-aid',
      status: 'draft',
    });
  await expect(search).toBeFocused();
  await expect(page.getByRole('status')).toHaveText('1 draft topic');
  await expect(page.locator('.result__title')).toHaveText(['Storage choice']);
  await page.getByLabel('Status', { exact: true }).selectOption('accepted');
  await expect(page.getByRole('status')).toHaveText('0 accepted topics');
  await expect(page.locator('.topic-index__empty')).toContainText('status “Accepted”');
  await page.getByRole('button', { name: 'Clear search and filters' }).click();
  await expect(page).toHaveURL('/topics');
  await expect(page.getByLabel('Status', { exact: true })).toHaveValue('');
  await expect(page.getByRole('status')).toHaveText('20 topics');
  await page.goto('/topics?status=unknown&extra=unknown');
  await expect(page).toHaveURL('/topics');
});

test('keeps draft indicators and status controls accessible on narrow layouts', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/topics?status=draft');
  await expect(page.getByLabel('Status', { exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('2 draft topics');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole('link', { name: /^Shared path Draft/u }).click();
  const explorer = page.locator('.topic-hierarchy-narrow');
  await expect(explorer).not.toHaveAttribute('open');
  await explorer.locator('summary').click();
  await expect(explorer.getByRole('link', { name: 'Shared path Draft', exact: true })).toHaveCount(
    2,
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
});
