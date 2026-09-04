import type { TopicMetadata } from './source-schemas.ts';
import { topicMetadataSchema } from './source-schemas.ts';
import type { ParsedTopicSource } from './parse-topic-source.ts';
import { formatSchemaIssues } from './format-schema-issues.ts';

export type TopicSource = TopicMetadata & {
  sourcePath: string;
  markdownBody: string;
};

export function validateTopicSource(
  sourcePath: string,
  parsedSource: ParsedTopicSource,
): TopicSource {
  const metadataResult = topicMetadataSchema.safeParse(parsedSource.metadata);

  if (!metadataResult.success) {
    const details = formatSchemaIssues(metadataResult.error, 'metadata');

    throw new Error(`${sourcePath}: Invalid Topic metadata: ${details}`, {
      cause: metadataResult.error,
    });
  }

  const metadata = metadataResult.data;

  const hasMeaningfulMarkdown = parsedSource.markdownBody.trim().length > 0;
  const hasChildren = metadata.childTopicIds.length > 0;

  if (!hasMeaningfulMarkdown && !hasChildren) {
    throw new Error(
      `${sourcePath}: Topic must have meaningful Markdown content or at least one child Topic`,
    );
  }

  return {
    sourcePath,
    ...metadata,
    markdownBody: parsedSource.markdownBody,
  };
}
