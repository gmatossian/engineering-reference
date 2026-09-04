import { parse } from 'yaml';

export interface ParsedTopicSource {
  metadata: unknown;
  markdownBody: string;
}

export function parseTopicSource(sourcePath: string, sourceText: string): ParsedTopicSource {
  const openingDelimiterMatch = /^---(\r?\n)/.exec(sourceText);

  if (openingDelimiterMatch === null) {
    throw new Error(`${sourcePath}: Topic source must begin with a front-matter delimiter`);
  }

  const openingDelimiter = openingDelimiterMatch[0];
  const lineEnding = openingDelimiterMatch[1];
  const closingDelimiterPattern = lineEnding === '\r\n' ? /\r\n---(?=\r\n|$)/ : /\n---(?=\n|$)/;

  const closingDelimiterMatch = closingDelimiterPattern.exec(sourceText);

  if (closingDelimiterMatch === null) {
    throw new Error(`${sourcePath}: Topic source is missing its closing front-matter delimiter`);
  }

  const closingDelimiterIndex = closingDelimiterMatch.index;

  const metadataText = sourceText.slice(openingDelimiter.length, closingDelimiterIndex);

  let metadata: unknown;

  try {
    metadata = parse(metadataText);
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : String(error);

    throw new Error(`${sourcePath}: Invalid YAML front matter: ${detail}`, { cause: error });
  }

  const afterClosingDelimiter = closingDelimiterIndex + closingDelimiterMatch[0].length;

  const bodyStartIndex = sourceText.startsWith(lineEnding, afterClosingDelimiter)
    ? afterClosingDelimiter + lineEnding.length
    : afterClosingDelimiter;

  const markdownBody = sourceText.slice(bodyStartIndex);

  return {
    metadata,
    markdownBody,
  };
}
