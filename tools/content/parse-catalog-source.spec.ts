import { describe, expect, it } from 'vitest';
import { parseCatalogSource } from './parse-catalog-source.ts';

describe('parseCatalogSource', () => {
  it('parses and validates the ordered landing Topic IDs', () => {
    const sourcePath = 'content/catalog.yaml';
    const sourceText = [
      'landingTopicIds:',
      '  - "11111111-1111-4111-8111-111111111111"',
      '  - "22222222-2222-4222-8222-222222222222"',
      '',
    ].join('\n');

    expect(parseCatalogSource(sourcePath, sourceText)).toEqual({
      sourcePath,
      landingTopicIds: [
        '11111111-1111-4111-8111-111111111111',
        '22222222-2222-4222-8222-222222222222',
      ],
    });
  });

  it('includes the source path when the YAML is malformed', () => {
    const sourcePath = 'content/catalog.yaml';
    const sourceText = 'landingTopicIds: [not valid YAML';

    expect(() => parseCatalogSource(sourcePath, sourceText)).toThrow(`${sourcePath}: Invalid YAML`);
  });

  it('reports the source path and field when the catalog shape is invalid', () => {
    const sourcePath = 'content/catalog.yaml';
    const sourceText = ['landingTopicIds:', '  - "not-a-uuid"', ''].join('\n');

    expect(() => parseCatalogSource(sourcePath, sourceText)).toThrow(
      `${sourcePath}: Invalid catalog: landingTopicIds.0:`,
    );
  });
});
