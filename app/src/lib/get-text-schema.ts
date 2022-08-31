import { z } from "zod";

export const getTextSchema = z.object({
  text: z.string().min(2).max(255),
});
