import type { GatsbyConfig } from "gatsby";
import { config as env } from "dotenv";
import feeds from "./src/utils/rss";

env({ path: `.env` });

const PHOTOS_DATABASE = "34e2befe9a77492c825996d6e238880d";
const VIDEOS_DATABASE = "ad2cddcf3e644aa1b7582ec34b5f8f34";
const MUSICS_DATABASE = "297a072af5854bf38a23e1fa11c23349";
const RECIPES_DATABASE = "7a13ff42f6174106be20fa0401af6ff3";
const DRESSES_DATABASE = "8001b0eba0a5401c8ffe343ad1ce07ca";

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
      },
    },
    "gatsby-transformer-sharp",
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
          MUSICS_DATABASE,
          RECIPES_DATABASE,
          DRESSES_DATABASE,
        ],
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`,
              throwOnError: false,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true,
        develop: true,
        purgeCSSOptions: {
          safelist: ["has-navbar-fixed-top"],
        },
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        feeds: feeds,
      },
    },
  ],
  graphqlTypegen: true,
};

export default config;
