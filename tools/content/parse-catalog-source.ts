import { parse } from 'yaml';
import type { CatalogSource } from './source-schemas.ts';
import { catalogSourceSchema } from './source-schemas.ts';
import { formatSchemaIssues } from './format-schema-issues.ts';

export type ParsedCatalogSource = CatalogSource & {
  sourcePath: string;
};

export function parseCatalogSource(sourcePath: string, sourceText: string): ParsedCatalogSource {
  let parsedSource: unknown;

  try {
    parsedSource = parse(sourceText);
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : String(error);

    throw new Error(`${sourcePath}: Invalid YAML: ${detail}`, { cause: error });
  }

  const catalogResult = catalogSourceSchema.safeParse(parsedSource);

  if (!catalogResult.success) {
    const details = formatSchemaIssues(catalogResult.error, 'catalog');

    throw new Error(`${sourcePath}: Invalid catalog: ${details}`, { cause: catalogResult.error });
  }

  const catalog = catalogResult.data;

  return {
    sourcePath,
    ...catalog,
  };
}
