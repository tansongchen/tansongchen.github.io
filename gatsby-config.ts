import type { GatsbyConfig } from "gatsby"
import { config as env } from "dotenv"

env({path: `.env.${process.env.NODE_ENV}`});

export const CUISINE_DATABASE = '7a13ff42f6174106be20fa0401af6ff3';

const config: GatsbyConfig = {
  graphqlTypegen: true,
  siteMetadata: {
    siteUrl: "https://tansongchen.com",
    title: "Songchen Tan Personal Website",
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
    "gatsby-plugin-sharp",
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
      resolve: "gatsby-plugin-mdx",
      options: {
        remarkPlugins: [require("remark-math")],
        mediaTypes: ["text/x-markdown"]
      },
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        purgeOnly: ['src/styles/bulma.scss'], // Purge only these files/folders
        purgeCSSOptions: {
          // https://purgecss.com/configuration.html#options
          // safelist: ['safelist'], // Don't remove this selector
        },
      },
    },
    {
      resolve: `gatsby-source-notion`,
      options: {
        previewCallRate: 0,
        databases: [
          CUISINE_DATABASE
        ]
      }
    }
  ],
};

export default config;
