import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { notionLoader } from "notion-astro-loader";
import {
  notionPageSchema,
  propertySchema,
  transformedPropertySchema,
} from "notion-astro-loader/schemas";

const recipes = defineCollection({
  loader: notionLoader({
    auth: import.meta.env.NOTION_TOKEN,
    database_id: "7a13ff42f6174106be20fa0401af6ff3",
  }),
  schema: notionPageSchema({
    properties: z.object({
      Name: transformedPropertySchema.title,
      Rating: propertySchema.select,
      Category: propertySchema.select,
    }),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./articles" }),
  schema: z.object({
    title: z.string(),
    abstract: z.string(),
    tags: z.array(z.string()),
    cover: z.string(),
    date: z.coerce.date(),
  }),
});

export const collections = { recipes, articles };
