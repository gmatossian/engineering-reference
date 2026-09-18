import { z } from 'zod';
import {
  TOPIC_DOMAIN_KEYS,
  TOPIC_ICON_KEYS,
  TOPIC_KIND_KEYS,
} from '../../contracts/runtime-catalog.ts';

const uuidSchema = z.uuid();
const topicSummarySchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[^\r\n\u2028\u2029]*$/u, 'must be a single line');
const topicDomainsSchema = z
  .array(z.enum(TOPIC_DOMAIN_KEYS))
  .min(1)
  .refine((domains) => new Set(domains).size === domains.length, {
    message: 'must not contain duplicate domains',
  });

export const catalogSourceSchema = z.strictObject({
  landingTopicIds: z.array(uuidSchema),
});

export type CatalogSource = z.infer<typeof catalogSourceSchema>;

export const topicMetadataSchema = z.strictObject({
  id: uuidSchema,
  title: z.string().trim().min(1),
  summary: topicSummarySchema.optional(),
  iconKey: z.enum(TOPIC_ICON_KEYS).optional(),
  domains: topicDomainsSchema,
  kind: z.enum(TOPIC_KIND_KEYS),
  childTopicIds: z.array(uuidSchema),
  relatedTopicIds: z.array(uuidSchema),
});

export type TopicMetadata = z.infer<typeof topicMetadataSchema>;
