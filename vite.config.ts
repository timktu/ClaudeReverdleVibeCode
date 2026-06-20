import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// `base` must match the GitHub Pages project-site sub-path
// (https://<owner>.github.io/<repo>/). In CI this is injected as VITE_BASE,
// derived from the repo name (see .github/workflows/deploy-pages.yml), so it is
// always correct regardless of repo name. The fallback below is only for local
// production builds. For a user/org site (<owner>.github.io) set VITE_BASE=/.
const base = process.env.VITE_BASE ?? "/ClaudeReverdleVibeCode/";

export default defineConfig(({ command }) => ({
  base: command === "build" ? base : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  root: "client",
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
}));
