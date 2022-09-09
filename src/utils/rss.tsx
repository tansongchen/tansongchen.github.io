import slugify from "./slugify";
import { arts, createDate } from "./metadata";

interface Item {
  title: string,
  description: string,
  url: string,
  date: Date,
  enclosure?: {
    url: string,
  }
}

interface RSSPage {
  title: string,
  properties: {
    Date: {
      start: string
    } | null
    Description: string;
  }
  image: any
}

const feeds = [
  {
    serialize: ({ query: { allNotionDatabase, allMdx, site }}: any) => {
      const result: Item[] = [];
      for (const mdx of allMdx.nodes) {
        const { slug, frontmatter } = mdx;
        const { title, date, cover, abstract } = frontmatter;
        result.push({
          title: title,
          date: createDate(date),
          enclosure: {
            url: cover,
          },
          description: abstract,
          url: `${site.siteMetadata.siteUrl}/${slug}`
        });
      }
      for (const database of allNotionDatabase.nodes) {
        const title = database.title;
        const art = arts.find(x => x.name === title)!;
        for (const page of database.childrenNotionPage as RSSPage[]) {
          page.title && result.push({
            title: page.title,
            description: page.properties.Description,
            url: `${site.siteMetadata.siteUrl}/${art.slug}/${slugify(page.title)}`,
            enclosure: page.image ? {
              url: `${site.siteMetadata.siteUrl}${page.image?.childImageSharp?.original?.src}`
            } : undefined,
            date: createDate(page.properties.Date?.start || page.image?.childImageSharp?.fields?.exif?.exif?.DateTimeOriginal)
          });
        }
      }
      result.sort((a, b) => b.date.getTime() - a.date.getTime());
      return result;
    },
    query: `
      query RSS {
        allMdx(filter: {slug: {ne: null}}) {
          nodes {
            slug
            frontmatter {
              title
              date
              cover
              abstract
            }
          }
        }
        allNotionDatabase {
          nodes {
            childrenNotionPage {
              title
              properties {
                Date {
                  start
                }
                Description
              }
              image {
                childImageSharp {
                  original {
                    src
                  }
                  fields {
                    exif {
                      exif {
                        DateTimeOriginal
                      }
                    }
                  }
                }
              }
            }
            title
          }
        }
      }
    `,
    output: `/rss.xml`,
    title: "众妙斋",
    description: "让您可以在您喜爱的 RSS 阅读器上获取众妙斋的更新",
    feed_url: 'https://tansongchen.com/rss.xml',
    site_url: 'https://tansongchen.com',
    image_url: 'https://tansongchen.com/favicon-32x32.png',
    managingEditor: '谭淞宸',
    webMaster: '谭淞宸',
    copyright: '谭淞宸 2017 - 2022',
    languages: 'zh'
  }
];

export default feeds;
