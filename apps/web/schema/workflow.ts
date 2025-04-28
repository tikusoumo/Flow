import { z } from "zod";

export const CreateWorkflowSchema = z.object({
  name: z.string().max(50),
  description: z.string().max(80).optional(),
});

export const DublicateWorkflowSchema = CreateWorkflowSchema.extend({
  workflowId: z.string(),
});

export type CreateWorkflowSchemaType = z.infer<typeof CreateWorkflowSchema>;

export type DublicateWorkflowSchemaType = z.infer<
  typeof DublicateWorkflowSchema
>;
