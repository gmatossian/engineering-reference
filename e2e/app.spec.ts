import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { FIXTURE_TOPIC_IDS, fixtureTopicPath } from './fixture';

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
        name: /^Java/u,
      }),
    ).toHaveAttribute('href', '/topics?domain=java');
    await expect(
      page
        .getByRole('navigation', { name: 'Curated paths' })
        .getByRole('link', { name: /^Atlas/u }),
    ).toHaveAttribute('href', fixtureTopicPath(FIXTURE_TOPIC_IDS.atlas));
  });

  test('searches and filters the complete Topic index', async ({ page }) => {
    await page.goto('/topics');

    await expect(page.getByRole('heading', { level: 1, name: 'All topics' })).toBeVisible();
    await expect(page.getByRole('status')).toContainText('20 topics');

    const search = page.getByRole('searchbox', { name: 'Search topics' });
    await search.fill('Beacon');
    await search.press('Enter');
    await expect(page).toHaveURL('/topics?q=Beacon');
    await expect(page.getByRole('status')).toContainText('3 topics');
    await expect(page.locator('.result__title')).toHaveText([
      'Beacon',
      'Beacon operations',
      'Async beacon patterns',
    ]);

    await page.getByLabel('Domain').selectOption('java');
    await page.getByRole('radio', { name: 'Concepts' }).check();
    await expect(page).toHaveURL('/topics?q=Beacon&domain=java&kind=concept');
    await expect(page.getByRole('status')).toContainText('2 topics');
  });

  test('loads a direct Topic URL and follows child navigation', async ({ page }) => {
    await page.goto(fixtureTopicPath(FIXTURE_TOPIC_IDS.atlas));

    await expect(page).toHaveURL(fixtureTopicPath(FIXTURE_TOPIC_IDS.atlas));
    await expect(page.getByRole('heading', { level: 1, name: 'Atlas' })).toBeVisible();
    await expect(page).toHaveTitle('Atlas | Engineering Reference');
    await expect(page.locator('.topic-content')).toHaveCount(0);

    await page
      .getByRole('navigation', { name: 'Explore this topic' })
      .getByRole('link', { name: 'Branch Alpha', exact: true })
      .click();

    await expect(page).toHaveURL(fixtureTopicPath(FIXTURE_TOPIC_IDS.branchAlpha));
    await expect(page.getByRole('heading', { level: 1, name: 'Branch Alpha' })).toBeFocused();
    await expect(page.locator('.topic-content')).toContainText(
      'Fixture guidance keeps browser behavior stable',
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
  await page.goto(fixtureTopicPath(FIXTURE_TOPIC_IDS.branchAlpha));

  await expect(page.getByRole('heading', { level: 1, name: 'Branch Alpha' })).toBeVisible();
  await expect(page.locator('.topic-content')).toContainText(
    'Fixture guidance keeps browser behavior stable',
  );

  await page
    .getByRole('navigation', { name: 'Explore this topic' })
    .getByRole('link', { name: 'Shared path', exact: true })
    .click();

  await expect(page).toHaveURL(fixtureTopicPath(FIXTURE_TOPIC_IDS.sharedPath));
  await expect(page.getByRole('heading', { level: 1, name: 'Shared path' })).toBeFocused();
  await expect(
    page
      .locator('.topic-hierarchy-wide')
      .getByRole('navigation', { name: 'Browse surrounding topics' })
      .getByRole('link', { name: 'Shared path', exact: true })
      .first(),
  ).toHaveAttribute('aria-current', 'page');
  await expect(
    page.getByRole('img', {
      name: 'Nodes entering and leaving a stable fixture flow',
    }),
  ).toHaveAttribute('alt', 'Nodes entering and leaving a stable fixture flow');

  await expect(page.locator('.topic-content')).toContainText(
    'A shared path appears beneath both fixture branches',
  );
  const detailLink = page
    .getByRole('navigation', { name: 'Explore this topic' })
    .getByRole('link', { name: 'Detail table', exact: true });
  await expect(detailLink).toHaveAttribute('href', fixtureTopicPath(FIXTURE_TOPIC_IDS.detailTable));

  await detailLink.click();

  await expect(page).toHaveURL(fixtureTopicPath(FIXTURE_TOPIC_IDS.detailTable));
  await expect(page.getByRole('heading', { level: 1, name: 'Detail table' })).toBeFocused();
  await expect(page.locator('.topic-content table')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Explore this topic' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Back', exact: true }).click();

  await expect(page).toHaveURL(fixtureTopicPath(FIXTURE_TOPIC_IDS.sharedPath));
  await expect(page.getByRole('heading', { level: 1, name: 'Shared path' })).toBeFocused();

  await page.goForward();

  await expect(page).toHaveURL(fixtureTopicPath(FIXTURE_TOPIC_IDS.detailTable));
  await expect(page.getByRole('heading', { level: 1, name: 'Detail table' })).toBeFocused();

  await page.getByRole('link', { name: 'Engineering Reference', exact: true }).click();

  await expect(page).toHaveURL('/');
  await expect(page).toHaveTitle('Engineering Reference');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Engineering Reference' }),
  ).toBeFocused();
});

test('projects every real path and repeated occurrence for a multi-parent Topic', async ({
  page,
}) => {
  await page.goto(fixtureTopicPath(FIXTURE_TOPIC_IDS.sharedPath));

  const paths = page.getByRole('navigation', { name: 'Topic paths' });
  await expect(paths.getByRole('list')).toHaveCount(2);
  await expect(paths.getByRole('list', { name: 'Path 1 of 2' })).toContainText(
    /Atlas\s*Branch Alpha\s*Shared path/u,
  );
  await expect(paths.getByRole('list', { name: 'Path 2 of 2' })).toContainText(
    /Atlas\s*Branch Beta\s*Shared path/u,
  );

  const foundIn = paths.getByText('Found in', { exact: true });
  const firstPath = paths.getByRole('list', { name: 'Path 1 of 2' });
  const secondPath = paths.getByRole('list', { name: 'Path 2 of 2' });
  const [wideLabelBounds, wideFirstPathBounds, wideSecondPathBounds] = await Promise.all([
    foundIn.boundingBox(),
    firstPath.boundingBox(),
    secondPath.boundingBox(),
  ]);
  expect(wideLabelBounds).not.toBeNull();
  expect(wideFirstPathBounds).not.toBeNull();
  expect(wideSecondPathBounds).not.toBeNull();
  expect(Math.abs(wideLabelBounds!.y - wideFirstPathBounds!.y)).toBeLessThanOrEqual(4);
  expect(Math.abs(wideFirstPathBounds!.x - wideSecondPathBounds!.x)).toBeLessThanOrEqual(1);

  const hierarchy = page
    .locator('.topic-hierarchy-wide')
    .getByRole('navigation', { name: 'Browse surrounding topics' });
  const currentOccurrences = hierarchy.getByRole('link', { name: 'Shared path' });
  await expect(currentOccurrences).toHaveCount(2);
  await expect(currentOccurrences.nth(0)).toHaveAttribute(
    'href',
    fixtureTopicPath(FIXTURE_TOPIC_IDS.sharedPath),
  );
  await expect(currentOccurrences.nth(1)).toHaveAttribute('aria-current', 'page');
  const disclosureListIds = await page
    .locator('[id*="-topic-children-"]')
    .evaluateAll((lists) => lists.map(({ id }) => id));
  expect(new Set(disclosureListIds).size).toBe(disclosureListIds.length);

  await expect(page.getByRole('navigation', { name: 'Topic classification' })).toHaveCount(0);

  await page.reload();
  await expect(paths.getByRole('list')).toHaveCount(2);
  await expect(currentOccurrences).toHaveCount(2);

  await page.setViewportSize({ width: 320, height: 640 });
  const [narrowLabelBounds, narrowFirstPathBounds, narrowSecondPathBounds] = await Promise.all([
    foundIn.boundingBox(),
    firstPath.boundingBox(),
    secondPath.boundingBox(),
  ]);
  expect(narrowLabelBounds).not.toBeNull();
  expect(narrowFirstPathBounds).not.toBeNull();
  expect(narrowSecondPathBounds).not.toBeNull();
  expect(narrowFirstPathBounds!.y).toBeGreaterThan(narrowLabelBounds!.y);
  expect(Math.abs(narrowLabelBounds!.x - narrowFirstPathBounds!.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(narrowFirstPathBounds!.x - narrowSecondPathBounds!.x)).toBeLessThanOrEqual(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test('keeps disclosure state independent for repeated hierarchy occurrences', async ({ page }) => {
  await page.goto(fixtureTopicPath(FIXTURE_TOPIC_IDS.sharedPath));

  const hierarchy = page
    .locator('.topic-hierarchy-wide')
    .getByRole('navigation', { name: 'Browse surrounding topics' });
  await expect(hierarchy.getByRole('button', { name: 'Collapse Shared path' })).toHaveCount(2);
  const historyLength = await page.evaluate(() => history.length);

  await hierarchy.getByRole('button', { name: 'Collapse Shared path' }).first().click();

  await expect(hierarchy.getByRole('button', { name: 'Expand Shared path' })).toHaveCount(1);
  await expect(hierarchy.getByRole('button', { name: 'Collapse Shared path' })).toHaveCount(1);
  await expect(page).toHaveURL(fixtureTopicPath(FIXTURE_TOPIC_IDS.sharedPath));
  expect(await page.evaluate(() => history.length)).toBe(historyLength);

  await page.setViewportSize({ width: 375, height: 720 });
  const narrowExplorer = page.locator('.topic-hierarchy-narrow');
  await narrowExplorer.locator('summary').click();
  await expect(narrowExplorer.getByRole('button', { name: 'Expand Shared path' })).toHaveCount(1);
  await expect(narrowExplorer.getByRole('button', { name: 'Collapse Shared path' })).toHaveCount(1);
});

test(
  'collapses narrow hierarchy context after Topic navigation and focuses the new heading',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto(fixtureTopicPath(FIXTURE_TOPIC_IDS.sharedPath));

    const explorer = page.locator('.topic-hierarchy-narrow');
    await expect(explorer).not.toHaveAttribute('open', '');
    await expect(explorer.locator('summary')).toContainText('2 paths');
    await explorer.locator('summary').click();
    await expect(explorer).toHaveAttribute('open', '');

    await explorer.getByRole('link', { name: 'Detail table', exact: true }).first().click();

    await expect(page).toHaveURL(fixtureTopicPath(FIXTURE_TOPIC_IDS.detailTable));
    await expect(page.getByRole('heading', { level: 1, name: 'Detail table' })).toBeFocused();
    await expect(explorer).not.toHaveAttribute('open', '');

    await explorer.locator('summary').click();
    await expect(explorer.getByRole('link', { name: 'Detail table' })).toHaveCount(2);
    await expect(explorer.getByRole('link', { name: 'Detail table' }).first()).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(explorer.getByRole('button', { name: 'Collapse Shared path' })).toHaveCount(2);
  },
);

test('provides a wide-layout hierarchy bypass to the first Topic content region', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 420 });
  await page.goto(fixtureTopicPath(FIXTURE_TOPIC_IDS.sharedPath));

  const skipLink = page.getByRole('link', { name: 'Skip to topic content' });
  const initialUrl = page.url();
  const historyLength = await page.evaluate(() => history.length);
  await skipLink.focus();
  await expect(skipLink).toBeVisible();
  await skipLink.click();
  const primaryContent = page.locator('#topic-primary-content');
  await expect(primaryContent).toBeFocused();
  await expect(page).toHaveURL(initialUrl);
  expect(await page.evaluate(() => history.length)).toBe(historyLength);
  expect(
    await primaryContent.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return bounds.top >= 0 && bounds.top < window.innerHeight;
    }),
  ).toBe(true);
});

test('provides wide in-page heading navigation for sufficiently structured Topics', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(fixtureTopicPath(FIXTURE_TOPIC_IDS.queryShape));

  const outline = page.getByRole('navigation', { name: 'On this page' });
  const guardrailsLink = outline.getByRole('link', { name: 'Guardrails', exact: true });

  await expect(outline).toBeVisible();
  await expect(outline.getByRole('list')).toHaveCount(1);
  await expect(guardrailsLink).toHaveAttribute(
    'href',
    `${fixtureTopicPath(FIXTURE_TOPIC_IDS.queryShape)}#section-guardrails`,
  );

  await guardrailsLink.focus();
  await expect(guardrailsLink).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(
    `${fixtureTopicPath(FIXTURE_TOPIC_IDS.queryShape)}#section-guardrails`,
  );
  await expect(page.getByRole('heading', { level: 2, name: 'Guardrails' })).toBeFocused();

  await page.evaluate(() => window.scrollTo(0, 0));
  await guardrailsLink.click();
  await expect(page.getByRole('heading', { level: 2, name: 'Guardrails' })).toBeInViewport();

  await page.goto(`${fixtureTopicPath(FIXTURE_TOPIC_IDS.queryShape)}#section-references`);
  const directHeadingBounds = await page
    .getByRole('heading', { level: 2, name: 'References' })
    .boundingBox();
  expect(directHeadingBounds).not.toBeNull();
  expect(directHeadingBounds!.y).toBeGreaterThanOrEqual(64);
  expect(directHeadingBounds!.y).toBeLessThan(900);

  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(outline).toBeHidden();

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(fixtureTopicPath(FIXTURE_TOPIC_IDS.entityLifecycle));
  await expect(page.getByRole('navigation', { name: 'On this page' })).toHaveCount(0);
});

test(
  'presents authored Related Topics as distinct directed onward navigation',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.goto(fixtureTopicPath(FIXTURE_TOPIC_IDS.navigatorExercise));

    const related = page.getByRole('navigation', { name: 'Related topics' });
    const links = related.getByRole('link');
    await expect(links).toHaveCount(2);
    await expect(links.nth(0)).toContainText('Scale model');
    await expect(links.nth(0)).toContainText('Operations · System Design');
    await expect(links.nth(0)).toHaveAttribute(
      'href',
      fixtureTopicPath(FIXTURE_TOPIC_IDS.scaleModel),
    );
    await expect(links.nth(1)).toContainText('Decision matrix');

    await links.nth(0).focus();
    await expect(links.nth(0)).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(fixtureTopicPath(FIXTURE_TOPIC_IDS.scaleModel));
    await expect(page.getByRole('heading', { level: 1, name: 'Scale model' })).toBeFocused();
    await expect(page.getByRole('navigation', { name: 'Related topics' })).toHaveCount(0);

    await page.goBack();
    await expect(page).toHaveURL(fixtureTopicPath(FIXTURE_TOPIC_IDS.navigatorExercise));
    await expect(page.getByRole('heading', { level: 1, name: 'Navigator exercise' })).toBeFocused();

    await page.goForward();
    await expect(page).toHaveURL(fixtureTopicPath(FIXTURE_TOPIC_IDS.scaleModel));
    await expect(page.getByRole('heading', { level: 1, name: 'Scale model' })).toBeFocused();

    await page.goBack();
    await expect(page).toHaveURL(fixtureTopicPath(FIXTURE_TOPIC_IDS.navigatorExercise));
    await expect(page.getByRole('heading', { level: 1, name: 'Navigator exercise' })).toBeFocused();

    await page.setViewportSize({ width: 320, height: 640 });
    await expect(related).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  },
);

test('finds a Topic from the landing page without knowing its parent', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Search topics' });
  await search.fill('  Storage choice  ');
  await search.press('Enter');

  await expect(page).toHaveURL(/\/topics\?q=Storage(?:%20|\+)choice$/u);
  await expect(page.getByRole('heading', { level: 1, name: 'All topics' })).toBeFocused();
  await expect(page.getByRole('status')).toContainText('1 topic');
  await expect(page.locator('.result__title')).toHaveText(['Storage choice']);
});

test('presents and expands the System Design hierarchy', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Domains' })
    .getByRole('link', { name: /^System Design/ })
    .click();

  await expect(page).toHaveURL('/topics?domain=system-design');
  await expect(page.getByRole('heading', { level: 1, name: 'All topics' })).toBeFocused();
  await expect(page.getByRole('status')).toContainText('7 topics');
  const hierarchy = page.getByRole('navigation', { name: 'Browse System Design topics' });
  await expect(
    hierarchy.locator(
      '.domain-hierarchy__children--root > ul > li > .domain-hierarchy__item .domain-hierarchy__title',
    ),
  ).toHaveText(['Scale model', 'Navigator exercise', 'Decision matrix', 'Pagination choice']);

  await hierarchy.getByRole('button', { name: 'Expand Navigator exercise' }).click();
  await expect(hierarchy.getByRole('link', { name: /^Identifier strategy/u })).toBeVisible();
  await expect(hierarchy.getByRole('link', { name: /^Storage choice/u })).toBeVisible();
  await expect(hierarchy.locator('.domain-hierarchy__title')).toHaveText([
    'Workshop',
    'Scale model',
    'Navigator exercise',
    'Identifier strategy',
    'Storage choice',
    'Decision matrix',
    'Pagination choice',
  ]);
});

test('keeps control focus and replaces URL state while searching and filtering', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'All topics' }).click();
  const historyLength = await page.evaluate(() => history.length);
  const search = page.getByRole('searchbox', { name: 'Search topics' });

  await search.fill('Beacon');
  await search.press('Enter');
  await expect(search).toBeFocused();
  await expect(page).toHaveURL('/topics?q=Beacon');
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
  await expect(page.getByRole('status')).toContainText('20 topics');
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
  await page.goto(fixtureTopicPath(FIXTURE_TOPIC_IDS.branchAlpha));
  await page.evaluate(() => {
    // The current fixture is short, so add test-only height to exercise native scroll restoration.
    document.body.style.minHeight = '2000px';
    window.scrollTo(0, 500);
  });

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
  await page
    .getByRole('link', { name: 'Shared path', exact: true })
    .first()
    .evaluate((link: HTMLAnchorElement) => link.click());

  await expect(page).toHaveURL(fixtureTopicPath(FIXTURE_TOPIC_IDS.sharedPath));
  await expect(page.getByRole('heading', { level: 1, name: 'Shared path' })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  await page.goBack();

  await expect(page).toHaveURL(fixtureTopicPath(FIXTURE_TOPIC_IDS.branchAlpha));
  await expect(page.getByRole('heading', { level: 1, name: 'Branch Alpha' })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
});

test('bounds generated Topic content at a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(fixtureTopicPath(FIXTURE_TOPIC_IDS.sharedPath));

  const image = page.getByRole('img', {
    name: 'Nodes entering and leaving a stable fixture flow',
  });
  const codeOverflowRegion = page.getByRole('region', {
    name: 'Common operations code block',
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
      code.textContent = 'fixture.offer(veryLongIdentifier);'.repeat(30);
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

  await page.goto(fixtureTopicPath(FIXTURE_TOPIC_IDS.detailTable));

  const tableOverflowRegion = page.getByRole('region', {
    name: 'Detail table table',
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

test('uses additional desktop width for dense generated content without widening prose', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(fixtureTopicPath(FIXTURE_TOPIC_IDS.statusReference));

  const prose = page.locator('.topic-content > p').first();
  const tableRegion = page.getByRole('region', {
    name: 'Success family table',
    exact: true,
  });
  const hierarchy = page.locator('.topic-hierarchy-wide');
  const [proseBounds, tableBounds, hierarchyBounds] = await Promise.all([
    prose.boundingBox(),
    tableRegion.boundingBox(),
    hierarchy.boundingBox(),
  ]);

  expect(proseBounds).not.toBeNull();
  expect(tableBounds).not.toBeNull();
  expect(hierarchyBounds).not.toBeNull();
  expect(tableBounds!.width - proseBounds!.width).toBeGreaterThan(100);
  expect(proseBounds!.width).toBeLessThanOrEqual(740);
  expect(hierarchyBounds!.x + hierarchyBounds!.width).toBeLessThan(tableBounds!.x);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);

  await page.setViewportSize({ width: 1200, height: 800 });
  expect((await prose.boundingBox())!.width).toBeLessThanOrEqual(740);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(fixtureTopicPath(FIXTURE_TOPIC_IDS.queryShape));

  const diagram = page.getByRole('img', {
    name: 'Three stable fixture query shapes',
  });
  const diagramProse = page.locator('.topic-content > p:not(:has(> img:only-child))').first();
  await expect
    .poll(() =>
      diagram.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0),
    )
    .toBe(true);
  const [diagramBounds, diagramProseBounds] = await Promise.all([
    diagram.boundingBox(),
    diagramProse.boundingBox(),
  ]);

  expect(diagramBounds).not.toBeNull();
  expect(diagramProseBounds).not.toBeNull();
  expect(diagramBounds!.width - diagramProseBounds!.width).toBeGreaterThan(100);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test('renders the application without detectable accessibility violations', async ({ page }) => {
  for (const viewport of [
    { name: 'wide', width: 1440, height: 720 },
    { name: 'narrow', width: 320, height: 640 },
  ]) {
    await page.setViewportSize(viewport);

    for (const path of [
      '/',
      '/topics',
      '/topics?domain=system-design',
      '/topics?q=does-not-exist',
      fixtureTopicPath(FIXTURE_TOPIC_IDS.sharedPath),
      fixtureTopicPath(FIXTURE_TOPIC_IDS.detailTable),
      fixtureTopicPath(FIXTURE_TOPIC_IDS.statusReference),
      fixtureTopicPath(FIXTURE_TOPIC_IDS.decisionMatrix),
      fixtureTopicPath(FIXTURE_TOPIC_IDS.navigatorExercise),
      fixtureTopicPath(FIXTURE_TOPIC_IDS.queryShape),
    ]) {
      await page.goto(path);

      if (viewport.name === 'narrow' && path === fixtureTopicPath(FIXTURE_TOPIC_IDS.sharedPath)) {
        await page.locator('.topic-hierarchy-narrow summary').click();
      }

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      expect(
        accessibilityScanResults.violations,
        `accessibility violations at ${path} with the ${viewport.name} viewport`,
      ).toEqual([]);
    }
  }
});
