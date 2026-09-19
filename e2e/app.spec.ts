import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const JAVA_TOPIC_ID = 'd3ef7c8b-ee6b-48f5-9039-2aa94d03c19c';
const COLLECTIONS_TOPIC_ID = 'c29c5725-0b1f-480d-88f4-5c9d3b7f0dc5';
const QUEUE_TOPIC_ID = '8cbea92a-606e-4ed3-839c-c7fff67f0909';
const COMPLEXITY_TOPIC_ID = 'bf417331-9329-42b4-9517-351ef6af3b85';
const HTTP_STATUS_CODES_TOPIC_ID = 'b97384d3-f986-4850-a6b0-a1c3b893ee86';
const TRADEOFF_TRIGGERS_TOPIC_ID = '9009159b-54aa-4724-94a2-5189a1e21437';

test.describe('cross-browser smoke', { tag: '@smoke' }, () => {
  test('renders the landing page and its bundled Topics', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Engineering Reference',
      }),
    ).toBeVisible();
    await expect(page.getByRole('search')).toBeVisible();
    await expect(page.getByRole('searchbox', { name: 'Search topics' })).toBeVisible();
    await expect(page.locator('main').getByRole('search')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'All topics' })).toHaveAttribute('href', '/topics');
    await expect(page.getByRole('navigation', { name: 'Domains' }).getByRole('link')).toHaveCount(
      8,
    );
    await expect(
      page.getByRole('navigation', { name: 'Domains' }).getByRole('link', {
        name: /^Java/,
      }),
    ).toHaveAttribute('href', '/topics?domain=java');
    await expect(
      page.getByRole('navigation', { name: 'Curated paths' }).getByRole('link', { name: /^Java/ }),
    ).toHaveAttribute('href', `/topics/${JAVA_TOPIC_ID}`);
  });

  test('searches and filters the complete Topic index', async ({ page }) => {
    await page.goto('/topics');

    await expect(page.getByRole('heading', { level: 1, name: 'All topics' })).toBeVisible();
    await expect(page.getByRole('status')).toContainText('67 topics');

    const search = page.getByRole('searchbox', { name: 'Search topics' });
    await search.fill('Queue');
    await search.press('Enter');
    await expect(page).toHaveURL('/topics?q=Queue');
    await expect(page.getByRole('status')).toContainText('3 topics');
    await expect(page.locator('.result__title')).toHaveText([
      'Queue',
      'Concurrent queues',
      'PriorityQueue',
    ]);

    await page.getByLabel('Domain').selectOption('java');
    await page.getByRole('radio', { name: 'Concepts' }).check();
    await expect(page).toHaveURL('/topics?q=Queue&domain=java&kind=concept');
    await expect(page.getByRole('status')).toContainText('2 topics');
  });

  test('loads a direct Topic URL and follows child navigation', async ({ page }) => {
    await page.goto(`/topics/${JAVA_TOPIC_ID}`);

    await expect(page).toHaveURL(`/topics/${JAVA_TOPIC_ID}`);
    await expect(page.getByRole('heading', { level: 1, name: 'Java' })).toBeVisible();
    await expect(page).toHaveTitle('Java | Engineering Reference');
    await expect(page.locator('.topic-content')).toHaveCount(0);

    await page.getByRole('link', { name: 'Collections framework', exact: true }).click();

    await expect(page).toHaveURL(`/topics/${COLLECTIONS_TOPIC_ID}`);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Collections framework' }),
    ).toBeFocused();
    await expect(page.locator('.topic-content')).toContainText(
      'Choose the interface by the behavior the program requires',
    );
  });

  test('presents an unknown Topic without redirecting', async ({ page }) => {
    await page.goto('/topics/unknown-topic');

    await expect(page).toHaveURL('/topics/unknown-topic');
    await expect(page.getByRole('heading', { level: 1, name: 'Topic not found' })).toBeVisible();
    await expect(page).toHaveTitle('Topic not found | Engineering Reference');
  });
});

test('navigates through bundled Topic detail with native history', async ({ page }) => {
  await page.goto(`/topics/${COLLECTIONS_TOPIC_ID}`);

  await expect(
    page.getByRole('heading', { level: 1, name: 'Collections framework' }),
  ).toBeVisible();
  await expect(page.locator('.topic-content')).toContainText(
    'Choose the interface by the behavior the program requires',
  );

  await page.getByRole('link', { name: 'Queue', exact: true }).click();

  await expect(page).toHaveURL(`/topics/${QUEUE_TOPIC_ID}`);
  await expect(page.getByRole('heading', { level: 1, name: 'Queue' })).toBeFocused();
  await expect(
    page.getByRole('img', {
      name: 'Elements entering at the tail and leaving from the head of a queue',
    }),
  ).toHaveAttribute('alt', 'Elements entering at the tail and leaving from the head of a queue');

  await expect(page.locator('.topic-content')).toContainText(
    'A queue holds elements before processing',
  );
  await expect(page.getByRole('link', { name: 'Complexity', exact: true })).toHaveAttribute(
    'href',
    `/topics/${COMPLEXITY_TOPIC_ID}`,
  );

  await page.getByRole('link', { name: 'Complexity', exact: true }).click();

  await expect(page).toHaveURL(`/topics/${COMPLEXITY_TOPIC_ID}`);
  await expect(page.getByRole('heading', { level: 1, name: 'Complexity' })).toBeFocused();
  await expect(page.locator('.topic-content table')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Subtopics' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Back', exact: true }).click();

  await expect(page).toHaveURL(`/topics/${QUEUE_TOPIC_ID}`);
  await expect(page.getByRole('heading', { level: 1, name: 'Queue' })).toBeFocused();

  await page.goForward();

  await expect(page).toHaveURL(`/topics/${COMPLEXITY_TOPIC_ID}`);
  await expect(page.getByRole('heading', { level: 1, name: 'Complexity' })).toBeFocused();

  await page.getByRole('link', { name: 'Engineering Reference', exact: true }).click();

  await expect(page).toHaveURL('/');
  await expect(page).toHaveTitle('Engineering Reference');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Engineering Reference' }),
  ).toBeFocused();
});

test('finds a Topic from the landing page without knowing its parent', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Search topics' });
  await search.fill('  Choosing storage  ');
  await search.press('Enter');

  await expect(page).toHaveURL(/\/topics\?q=Choosing(?:%20|\+)storage$/);
  await expect(page.getByRole('heading', { level: 1, name: 'All topics' })).toBeFocused();
  await expect(page.getByRole('status')).toContainText('1 topic');
  await expect(page.locator('.result__title')).toHaveText(['Choosing storage']);
});

test('presents Area overviews and grouped System Design results', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Domains' })
    .getByRole('link', { name: /^System Design/ })
    .click();

  await expect(page).toHaveURL('/topics?domain=system-design');
  await expect(page.getByRole('heading', { level: 1, name: 'All topics' })).toBeFocused();
  await expect(page.getByRole('status')).toContainText('7 topics');
  await expect(page.locator('app-topic-result-list h2')).toHaveText([
    'Overviews',
    'Operations',
    'Decision aids',
    'Exercises',
  ]);
  await expect(page.locator('.result__title')).toHaveText([
    'System Design',
    'Scale and estimation',
    'Choosing storage',
    'Pagination: offset vs cursor',
    'Short URL identifiers',
    'Trade-off triggers',
    'URL shortener',
  ]);
});

test('keeps control focus and replaces URL state while searching and filtering', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'All topics' }).click();
  const historyLength = await page.evaluate(() => history.length);
  const search = page.getByRole('searchbox', { name: 'Search topics' });

  await search.fill('Queue');
  await search.press('Enter');
  await expect(search).toBeFocused();
  await expect(page).toHaveURL('/topics?q=Queue');
  const domain = page.getByLabel('Domain');
  await domain.focus();
  await domain.selectOption('collections');
  await expect(domain).toBeFocused();
  const kind = page.getByRole('radio', { name: 'Concepts' });
  await kind.focus();
  await kind.check();
  await expect(kind).toBeFocused();
  expect(await page.evaluate(() => history.length)).toBe(historyLength);

  await page.goBack();
  await expect(page).toHaveURL('/');
});

test('normalizes invalid filters and provides a useful no-results state', async ({ page }) => {
  await page.goto('/topics?q=%20missing%20&domain=invalid&kind=invalid&other=value');

  await expect(page).toHaveURL('/topics?q=missing');
  await expect(page.getByRole('status')).toContainText('0 topics');
  await expect(page.getByRole('heading', { level: 3, name: 'No matching topics' })).toBeVisible();
  await expect(page.getByText('No topics match the title “missing”.')).toBeVisible();

  await page.getByRole('button', { name: 'Clear search and filters' }).click();
  await expect(page).toHaveURL('/topics');
  await expect(page.getByRole('status')).toContainText('67 topics');
});

test('keeps the complete index usable at a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/topics?domain=system-design');

  await page.getByRole('button', { name: 'Search topics' }).click();
  await expect(page.getByRole('searchbox', { name: 'Search topics' })).toBeVisible();
  await expect(page.getByLabel('Domain')).toBeVisible();
  await expect(page.getByRole('group', { name: 'Topic type' })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test('restores scroll position without displacing focus on browser history navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 640, height: 320 });
  await page.goto(`/topics/${COLLECTIONS_TOPIC_ID}`);
  await page.evaluate(() => {
    // The current fixture is short, so add test-only height to exercise native scroll restoration.
    document.body.style.minHeight = '2000px';
    window.scrollTo(0, 500);
  });

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
  await page
    .getByRole('link', { name: 'Queue', exact: true })
    .evaluate((link: HTMLAnchorElement) => link.click());

  await expect(page).toHaveURL(`/topics/${QUEUE_TOPIC_ID}`);
  await expect(page.getByRole('heading', { level: 1, name: 'Queue' })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  await page.goBack();

  await expect(page).toHaveURL(`/topics/${COLLECTIONS_TOPIC_ID}`);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Collections framework' }),
  ).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
});

test('bounds generated Topic content at a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(`/topics/${QUEUE_TOPIC_ID}`);

  const image = page.getByRole('img', {
    name: 'Elements entering at the tail and leaving from the head of a queue',
  });
  const codeOverflowRegion = page.getByRole('region', {
    name: 'Scrollable code block',
    exact: true,
  });

  await expect(image).toBeVisible();
  await expect
    .poll(() =>
      image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0),
    )
    .toBe(true);
  const imageDimensions = await image.evaluate((element: HTMLImageElement) => ({
    intrinsicRatio: element.naturalWidth / element.naturalHeight,
    parentWidth: element.parentElement!.getBoundingClientRect().width,
    renderedHeight: element.getBoundingClientRect().height,
    renderedWidth: element.getBoundingClientRect().width,
  }));

  expect(imageDimensions.renderedWidth).toBeLessThanOrEqual(imageDimensions.parentWidth);
  expect(imageDimensions.renderedWidth / imageDimensions.renderedHeight).toBeCloseTo(
    imageDimensions.intrinsicRatio,
    2,
  );

  const topicContent = page.locator('.topic-content');
  await topicContent.evaluate((element) => {
    // Authored fixtures currently fit; these test-only values exercise the overflow contract.
    const heading = document.createElement('h2');
    heading.dataset['testLongHeading'] = '';
    heading.textContent = 'VeryLongUnbrokenHeading'.repeat(20);
    element.append(heading);

    const link = document.createElement('a');
    link.dataset['testLongLink'] = '';
    link.href = `https://example.com/${'very-long-unbroken-path-segment'.repeat(20)}`;
    link.textContent = link.href;
    element.append(link);

    const code = element.querySelector('pre code');
    if (code !== null) {
      code.textContent = 'queue.offer(veryLongIdentifier);'.repeat(30);
    }
  });

  for (const selector of ['[data-test-long-heading]', '[data-test-long-link]']) {
    const dimensions = await page.locator(selector).evaluate((element) => ({
      contentWidth: element.closest('.topic-content')!.getBoundingClientRect().width,
      width: element.getBoundingClientRect().width,
    }));

    expect(dimensions.width).toBeLessThanOrEqual(dimensions.contentWidth);
  }

  expect(await codeOverflowRegion.evaluate((element) => getComputedStyle(element).overflowX)).toBe(
    'auto',
  );
  expect(await codeOverflowRegion.evaluate((element) => element.scrollWidth)).toBeGreaterThan(
    await codeOverflowRegion.evaluate((element) => element.clientWidth),
  );
  await codeOverflowRegion.focus();
  await expect(codeOverflowRegion).toBeFocused();
  expect(
    await codeOverflowRegion.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).not.toBe('none');
  await codeOverflowRegion.press('ArrowRight');
  await expect
    .poll(() => codeOverflowRegion.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);

  await page.goto(`/topics/${COMPLEXITY_TOPIC_ID}`);

  const tableOverflowRegion = page.getByRole('region', {
    name: 'Scrollable table',
    exact: true,
  });
  const table = tableOverflowRegion.locator('table');
  await table.evaluate((element) => {
    const row = element.querySelector('tbody tr');
    if (row !== null) {
      for (let index = 0; index < 10; index += 1) {
        const cell = document.createElement('td');
        cell.textContent = `Additional value ${index}`;
        row.append(cell);
      }
    }
  });

  expect(await table.evaluate((element) => getComputedStyle(element).display)).toBe('table');
  expect(await tableOverflowRegion.evaluate((element) => getComputedStyle(element).overflowX)).toBe(
    'auto',
  );
  expect(await tableOverflowRegion.evaluate((element) => element.scrollWidth)).toBeGreaterThan(
    await tableOverflowRegion.evaluate((element) => element.clientWidth),
  );
  await tableOverflowRegion.focus();
  await expect(tableOverflowRegion).toBeFocused();
  expect(
    await tableOverflowRegion.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).not.toBe('none');
  await tableOverflowRegion.press('ArrowRight');
  await expect
    .poll(() => tableOverflowRegion.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test('renders the application without detectable accessibility violations', async ({ page }) => {
  for (const viewport of [
    { name: 'wide', width: 1280, height: 720 },
    { name: 'narrow', width: 320, height: 640 },
  ]) {
    await page.setViewportSize(viewport);

    for (const path of [
      '/',
      '/topics',
      '/topics?domain=system-design',
      '/topics?q=does-not-exist',
      `/topics/${QUEUE_TOPIC_ID}`,
      `/topics/${COMPLEXITY_TOPIC_ID}`,
      `/topics/${HTTP_STATUS_CODES_TOPIC_ID}`,
      `/topics/${TRADEOFF_TRIGGERS_TOPIC_ID}`,
    ]) {
      await page.goto(path);

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      expect(
        accessibilityScanResults.violations,
        `accessibility violations at ${path} with the ${viewport.name} viewport`,
      ).toEqual([]);
    }
  }
});
