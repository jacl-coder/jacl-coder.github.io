import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { fileURLToPath } from "node:url";

export default defineConfig({
  site: "https://blog.lxp520.top",
  integrations: [mdx(), sitemap(), tailwind()],
  vite: {
    resolve: {
      alias: {
        "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
        "@layouts": fileURLToPath(new URL("./src/layouts", import.meta.url)),
        "@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
        "@consts": fileURLToPath(new URL("./src/consts.ts", import.meta.url)),
        "@types": fileURLToPath(new URL("./src/types.ts", import.meta.url)),
      },
    },
  },
});
