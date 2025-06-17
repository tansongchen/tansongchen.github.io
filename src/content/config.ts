import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection, type DataEntryMap } from "astro:content";
import type { ZodRawShape } from "astro:schema";
import { fileToImageAsset, fileToUrl, notionLoader } from "notion-astro-loader";
import {
  notionPageSchema,
  propertySchema,
  transformedPropertySchema,
} from "notion-astro-loader/schemas";
import type { Dress, Music, Photo, Recipe, Video } from "..";
import exifr from "exifr";
import type { ExifData } from "../components/ExifImage.astro";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    categories: z.array(z.string()),
    cover: z.string(),
    date: z.coerce.date(),
  }),
});

function defineNotionCollection<T extends ZodRawShape>(
  database: string,
  extra: T
) {
  return defineCollection({
    loader: notionLoader({
      auth: import.meta.env.NOTION_TOKEN,
      database_id: database,
    }),
    schema: notionPageSchema({
      properties: z.object({
        Name: transformedPropertySchema.title,
        Date: transformedPropertySchema.date.transform((x) => x!.start),
        Categories: transformedPropertySchema.multi_select,
        Description: transformedPropertySchema.rich_text,
        ...extra,
      }),
    }),
  });
}

const notNull = <T>(x: T) => x !== null;

const videos = defineNotionCollection("ad2cddcf3e644aa1b7582ec34b5f8f34", {
  UID: transformedPropertySchema.rich_text,
});
const photos = defineNotionCollection("34e2befe9a77492c825996d6e238880d", {});
const musics = defineNotionCollection("297a072af5854bf38a23e1fa11c23349", {
  Opus: transformedPropertySchema.number.refine(notNull),
  Number: transformedPropertySchema.number.refine(notNull),
  "Bilibili URL": transformedPropertySchema.rich_text,
  Lilypond: propertySchema.files.transform((x) => fileToUrl(x.files[0])),
  Score: propertySchema.files.transform((x) => fileToUrl(x.files[0])),
});
const recipes = defineNotionCollection("7a13ff42f6174106be20fa0401af6ff3", {
  Rating: transformedPropertySchema.select.refine(notNull),
});
const dresses = defineNotionCollection("8001b0eba0a5401c8ffe343ad1ce07ca", {
  Photographer: transformedPropertySchema.select.refine(notNull),
});

export const collections = {
  articles,
  photos,
  videos,
  musics,
  recipes,
  dresses,
};

type Entry<K extends keyof DataEntryMap> = DataEntryMap[K][string];
type NotionKey = Exclude<keyof DataEntryMap, "articles">;

function preprocess(entry: Entry<NotionKey>) {
  const { properties } = entry.data;
  return {
    title: properties.Name,
    date: properties.Date,
    categories: properties.Categories,
    description: properties.Description,
  };
}

export const preprocessPhoto = async (entry: Entry<"photos">) => {
  const image = fileToUrl(entry.data.cover!);
  const exif: ExifData = await exifr.parse(image, true);
  return {
    ...preprocess(entry),
    image,
    exif,
    date: new Date(exif.DateTimeOriginal),
  } satisfies Photo;
};

export const preprocessVideo = async (entry: Entry<"videos">) => {
  return {
    uid: entry.data.properties.UID,
    ...preprocess(entry),
  } satisfies Video;
};

export const preprocessMusic = async (entry: Entry<"musics">) => {
  const { Opus, Number, Lilypond, Score } = entry.data.properties;
  return {
    opus: Opus,
    number: Number,
    lilypond: Lilypond,
    score: Score,
    ...preprocess(entry),
  } satisfies Music;
};

export const preprocessRecipe = async (entry: Entry<"recipes">) => {
  const image = fileToUrl(entry.data.cover!);
  const exif: ExifData = await exifr.parse(image, true);
  return {
    ...preprocess(entry),
    rating: entry.data.properties.Rating,
    image,
    date: new Date(exif.DateTimeOriginal),
  } satisfies Recipe;
};

export const preprocessDress = async (entry: Entry<"dresses">) => {
  const image = fileToUrl(entry.data.cover!);
  const exif: ExifData = await exifr.parse(image, true);
  return {
    ...preprocess(entry),
    photographer: entry.data.properties.Photographer,
    image,
    exif,
    date: new Date(exif.DateTimeOriginal),
  } satisfies Dress;
};

export const preprocessAll = async (
  key: Exclude<keyof DataEntryMap, "articles">,
  entry: any
) => {
  if (key === "photos") return await preprocessPhoto(entry);
  if (key === "videos") return await preprocessVideo(entry);
  if (key === "musics") return await preprocessMusic(entry);
  if (key === "recipes") return await preprocessRecipe(entry);
  return await preprocessDress(entry);
};
