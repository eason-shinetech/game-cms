import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const GameUserSchema = z.object({
  userId: z.string(),
  gameCount: z.number(),
  lastDate: z.string(),
  loginCount: z.number(),
});

export type GameUserList = z.infer<typeof GameUserSchema>;
