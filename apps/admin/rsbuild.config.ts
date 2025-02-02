import { defineConfig } from "@rsbuild/core";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginReact } from "@rsbuild/plugin-react";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions: (opts) => {
        opts.plugins?.unshift("babel-plugin-react-compiler");
      },
    }),
  ],
  source: {
    entry: { index: "./src/main.tsx" },
    define: {
      "process.env": JSON.stringify(process.env),
    },
  },
  html: {
    template: "./index.html",
  },
  tools: {
    rspack: {
      plugins: [TanStackRouterRspack()],
    },
  },
});
