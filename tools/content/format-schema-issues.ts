import type { ZodError } from 'zod';

export function formatSchemaIssues(error: ZodError, rootLabel: string): string {
  return error.issues
    .map((issue) => {
      const field = issue.path.length > 0 ? issue.path.join('.') : rootLabel;

      return `${field}: ${issue.message}`;
    })
    .join('; ');
}
