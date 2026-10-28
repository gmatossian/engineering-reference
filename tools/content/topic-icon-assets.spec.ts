import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { TOPIC_ICON_KEYS } from '../../contracts/runtime-catalog.ts';

describe('Topic icon assets', () => {
  it.each([...TOPIC_ICON_KEYS, 'generic'])('provides a local SVG for %s', async (iconKey) => {
    const source = await readFile(
      new URL(`../../public/icons/topics/${iconKey}.svg`, import.meta.url),
      'utf8',
    );

    expect(source).toMatch(/<svg\b[^>]*\bviewBox="0 0 24 24"/su);
    expect(source).toContain('</svg>');
  });
});
