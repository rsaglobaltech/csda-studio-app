import { defineConfig } from "vitest/config";

// Separate from vite.config.ts on purpose. Vitest bundles its own copy of
// Vite, so sharing one config file makes `tsc` compare two different Plugin
// types and fail on the react plugin. The unit suite exercises `src/domain`
// and `src/application`, which are React-free by construction, so it needs no
// plugin at all — and if that ever stops being true, the layering rule in
// AI_RULES.md has been broken.
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
