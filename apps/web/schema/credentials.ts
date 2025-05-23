import {z} from "zod";

export const CreateCredentialSchema = z.object({
  name: z.string().max(30),
  value: z.string().max(500)
 
}); 

export type CreateCredentialSchemaType = z.infer<typeof CreateCredentialSchema>;






