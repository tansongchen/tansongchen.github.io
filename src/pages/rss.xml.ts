import rss, { type RSSFeedItem } from "@astrojs/rss";
import { getCollection, type DataEntryMap } from "astro:content";
import collections, { description, email, slugify, title } from "..";
import { preprocessAll } from "../content/config";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

async function generateItems() {
  const result: RSSFeedItem[] = [];
  for (const article of await getCollection("articles")) {
    const { data } = article;
    result.push({
      title: data.title,
      pubDate: data.date,
      description: data.description,
      link: `/articles/${slugify(data.title)}`,
      enclosure: undefined, // TODO: add enclosure for articles
    });
  }
  for (const type of Object.keys(collections) as (keyof DataEntryMap)[]) {
    if (type === "articles") continue;
    for (const raw of await getCollection(type)) {
      const data = await preprocessAll(type, raw);
      const { title, date, description, categories } = data;
      const link = `/${type}/${slugify(title)}`;
      result.push({
        title,
        link,
        description,
        categories,
        pubDate: date,
        content: raw.body
          ? sanitizeHtml(parser.render(raw.body), {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
            })
          : undefined,
        author: email,
        commentsUrl: link,
        enclosure: undefined, // TODO: add enclosure for photos, recipes, dresses
      });
    }
  }
  result.sort((a, b) => b.pubDate!.getTime() - a.pubDate!.getTime());
  return result;
}

const items = await generateItems();

export function GET(context: any) {
  return rss({
    title,
    description,
    site: context.site,
    items,
    stylesheet: "/pretty-feed-v3.xsl",
  });
}
