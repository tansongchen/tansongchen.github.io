import type { GatsbyConfig } from "gatsby";
import { config as env } from "dotenv";

env({path: `.env.${process.env.NODE_ENV}`});

const RECIPES_DATABASE = '7a13ff42f6174106be20fa0401af6ff3';
const VIDEOS_DATABASE = 'ad2cddcf3e644aa1b7582ec34b5f8f34';

const config: GatsbyConfig = {
  siteMetadata: {
    siteUrl: "https://tansongchen.com",
    title: "众妙斋",
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`],
          placeholder: `blurred`,
          quality: 50,
          breakpoints: [750, 1080, 1366, 1920],
          backgroundColor: `transparent`,
          tracedSVGOptions: {},
          blurredOptions: {},
          jpgOptions: {},
          pngOptions: {},
          webpOptions: {},
          avifOptions: {},
        }
      }
    },
    "gatsby-transformer-sharp",
    "gatsby-transformer-yaml",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "contents",
        path: "contents/",
      },
      __key: "contents",
    },
    "gatsby-plugin-sass",
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-notion`,
      options: {
        previewCallRate: 0,
        databases: [
          RECIPES_DATABASE,
          VIDEOS_DATABASE
        ]
      }
    },
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        remarkPlugins: [require("remark-math")]
      },
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        purgeOnly: ['src/styles/index.scss'], // Purge only these files/folders
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        feeds: [
          {
            serialize: ({ query: { site, notionDatabase }}) => {
              return notionDatabase.childrenNotionPage.map(node => {
                return {
                  title: node.title,
                  categories: [node.properties.Category],
                  description: node.properties.Rating,
                  url: site.siteMetadata.siteUrl + '/recipes/',
                  guid: node.title,
                  enclosure: {
                    url: site.siteMetadata.siteUrl + node.image.childImageSharp.resize.src
                  },
                  date: new Date(node.lastEditedTime)
                }
              })
            },
            query: `
            {
              notionDatabase(title: {eq: "菜谱"}) {
                childrenNotionPage {
                  title
                  properties {
                    Category
                    Complexity
                    Rating
                  }
                  lastEditedTime
                  image {
                    childImageSharp {
                      resize(width: 500, height: 500, toFormat: WEBP) {
                        src
                      }
                    }
                  }
                }
              }
            }
            `,
            output: `/rss.xml`,
            title: "众妙斋",
            description: "让您可以在您喜爱的 RSS 阅读器上获取众妙斋的更新（目前仅支持美食板块）",
            feed_url: 'https://tansongchen.com/rss.xml',
            site_url: 'https://tansongchen.com',
            image_url: 'https://tansongchen.com/favicon-32x32.png',
            managingEditor: '谭淞宸',
            webMaster: '谭淞宸',
            copyright: '谭淞宸 2017 - 2022',
            languages: 'zh'
          }
        ]
      }
    }
  ],
  graphqlTypegen: true,
};

export default config;
