import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  entryPoints: ["src/index.ts"],
  format: "esm",
  minify: true,
  watch: process.env.NODE_ENV === "development",
});
