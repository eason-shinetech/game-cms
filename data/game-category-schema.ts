import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const GameCategorySchema = z.object({
  name: z.string(),
  gameCount: z.number(),
});

export type GameCategoryList = z.infer<typeof GameCategorySchema>;
