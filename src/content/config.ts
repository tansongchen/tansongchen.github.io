import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { notionLoader } from "notion-astro-loader";

const database = defineCollection({
  loader: notionLoader({
    auth: import.meta.env.NOTION_TOKEN,
    database_id: import.meta.env.NOTION_DATABASE_ID,
    // Use Notion sorting and filtering
    // filter: {
    //   property: "Hidden",
    //   checkbox: { equals: false },
    // },
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./articles" }),
  // schema: /* ... */
});

export const collections = { database, articles };
