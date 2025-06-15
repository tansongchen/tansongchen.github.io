import { defineConfig } from "astro/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import icon from "astro-icon";
import AstroPWA from "@vite-pwa/astro";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://tansongchen.com",
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
        name: "众妙斋",
        short_name: "众妙斋",
        description: "谭淞宸的个人网站",
        theme_color: "#ffffff",
      },
      pwaAssets: {
        config: true,
      },
      workbox: {
        navigateFallback: "/404",
        globPatterns: ["**/*.{css,js,html,svg,png,ico,txt}"],
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
