import { defineConfig } from "astro/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import icon from "astro-icon";
import AstroPWA from "@vite-pwa/astro";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import { description, site, title } from "./src";

export default defineConfig({
  site,
  integrations: [
    react(),
    icon(),
    sitemap(),
    AstroPWA({
      base: "/",
      scope: "/",
      includeAssets: ["favicon.svg"],
      registerType: "autoUpdate",
      manifest: {
        name: title,
        short_name: title,
        description: description,
        theme_color: "#ffffff",
      },
      pwaAssets: {
        config: true,
      },
      workbox: {
        navigateFallback: "/404",
        globPatterns: ["**/*.{css,js,html,xml,svg,png,webp,gif,ico,txt}"],
        maximumFileSizeToCacheInBytes: 10000000
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
    }),
  ],
  image: {
    domains: ["**.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
      },
    ],
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      langAlias: {
        fortran: "fortran-free-form",
      },
    },
  },
});
