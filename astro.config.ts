// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://tansongchen.com",
  integrations: [react(), icon()],
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      langAlias: {
        fortran: "fortran-free-form"
      }
    }
  },
});
