import type { GatsbyConfig } from "gatsby";
import { config as env } from "dotenv";
import feeds from "./src/utils/rss";

env({path: `.env`});

const RECIPES_DATABASE = '7a13ff42f6174106be20fa0401af6ff3';
const VIDEOS_DATABASE = 'ad2cddcf3e644aa1b7582ec34b5f8f34';
const DRESSES_DATABASE = '8001b0eba0a5401c8ffe343ad1ce07ca';
const PHOTOS_DATABASE = '34e2befe9a77492c825996d6e238880d';

const config: GatsbyConfig = {
  siteMetadata: {
    siteUrl: "https://tansongchen.com",
    title: "众妙斋",
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: `众妙斋`,
        short_name: `众妙斋`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#ffffff`,
        display: `standalone`,
        icon: "src/images/icon-pwa.png",
        icon_options: {
          purpose: `maskable`,
        },
      },
    },
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`webp`],
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
        },
        stripMetadata: false,
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
    {
      resolve: `gatsby-source-notion`,
      options: {
        previewCallRate: 0,
        databases: [
          PHOTOS_DATABASE,
          VIDEOS_DATABASE,
          RECIPES_DATABASE,
          DRESSES_DATABASE,
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
        purgeOnly: ['src/styles/index.scss'],
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        feeds: feeds
      }
    }
  ],
  graphqlTypegen: true,
};

export default config;
