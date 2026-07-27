import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const publicationFields = {
  title: z.string(),
  summary: z.string(),
  order: z.number().int().nonnegative(),
  sourceState: z.enum(["confirmed", "analysis", "trial", "proposal", "unconfirmed"]),
  publishState: z.enum(["draft", "review", "approved", "hidden"]),
  visibility: z.enum(["public", "internal"]),
  publicSourceKeys: z.array(z.string()),
  lastReviewedAt: z.string(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  image: z.string().optional()
};

const ranks = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/ranks"
  }),
  schema: z.object(publicationFields)
});

export const collections = { ranks };
