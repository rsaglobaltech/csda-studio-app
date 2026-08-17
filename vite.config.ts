import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base: "./"` keeps every asset reference relative, so the build can be
// served from a sub-path or straight off the filesystem. REQ-015 requires a
// plain static file server to serve the output unchanged.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { outDir: "dist", emptyOutDir: true },
});
