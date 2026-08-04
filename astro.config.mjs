import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://mc.lunadeer.cn",
  output: "static",
  integrations: [mdx(), react(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
      wrap: false,
    },
  },
  vite: {
    optimizeDeps: {
      include: ["lucide-astro"],
    },
  },
});
