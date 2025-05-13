import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const GameListSchema = z.object({
  _id: z.string(),
  thumb: z.string(),
  title: z.string(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  from: z.string(),
  status: z.string(),
  bannerImage: z.string(),
  isSetBanner: z.boolean(),
  clickCount: z.number(),
  popularity: z.string(),
});

export type GameList = z.infer<typeof GameListSchema>;
