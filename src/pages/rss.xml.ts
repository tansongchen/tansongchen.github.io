import rss, { type RSSFeedItem } from "@astrojs/rss";
import { getCollection, type DataEntryMap } from "astro:content";
import collections, { slugify } from "..";

async function generateItems() {
  const result: RSSFeedItem[] = [];
  for (const article of await getCollection("articles")) {
    const { data } = article;
    result.push({
      title: data.title,
      pubDate: data.date,
      description: data.description,
      link: `/articles/${slugify(data.title)}`,
    });
  }
  for (const [type, collection] of Object.entries(collections)) {
    if (type === "articles") continue;
    for (const { data } of await getCollection(
      type as Exclude<keyof DataEntryMap, "articles">
    )) {
      const { Name, Description, Date } = data.properties;
      result.push({
        title: Name,
        description: Description,
        link: `/${type}/${slugify(Name)}`,
        pubDate: Date,
      });
    }
  }
  result.sort((a, b) => b.pubDate!.getTime() - a.pubDate!.getTime());
  return result;
}

const items = await generateItems();

export function GET(context: any) {
  return rss({
    title: "众妙斋",
    description: "让您可以在您喜爱的 RSS 阅读器上获取众妙斋的更新",
    site: context.site,
    items,
  });
}
