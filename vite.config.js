import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import macrosPlugin from "vite-plugin-babel-macros";

//import eslintPlugin from "vite-plugin-eslint";

export default defineConfig({
  plugins: [react(), macrosPlugin()],
  build: {
    // to output your build into build dir the same as Webpack
    outDir: "build",
  },
  server: {
    open: true,
    port: 3000,
  },
});
