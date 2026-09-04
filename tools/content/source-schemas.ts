import { z } from 'zod';

const uuidSchema = z.uuid();

export const catalogSourceSchema = z.strictObject({
  landingTopicIds: z.array(uuidSchema),
});

export type CatalogSource = z.infer<typeof catalogSourceSchema>;

export const topicMetadataSchema = z.strictObject({
  id: uuidSchema,
  title: z.string().trim().min(1),
  childTopicIds: z.array(uuidSchema),
});

export type TopicMetadata = z.infer<typeof topicMetadataSchema>;
