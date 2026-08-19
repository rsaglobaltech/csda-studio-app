import assert from "node:assert/strict";
import { createElement } from "react";
import { DiskPackSource } from "./disk-pack-source.ts";
import { installDom, waitFor } from "./dom.ts";
import type { StudioWorld } from "./world.ts";

export const PICKER = '[data-testid="pack-picker"]';
export const PACK_ID = '[data-testid="pack-id"]';
export const PANEL = '[data-testid="requirements-panel"]';
export const BANNER = '[data-testid="error-banner"]';

/**
 * Render the real studio into a fresh DOM, wired to the real YAML parser and to
 * a source that reads the fixture off disk. Two scenarios open the studio and a
 * third will, so the wiring lives here rather than being copied per step file.
 */
export async function renderStudio(world: StudioWorld): Promise<void> {
  world.dom = installDom();

  // Imported after the DOM exists: react-dom decides at module scope whether
  // it is running in a browser.
  const [{ createRoot }, { App }, { JsYamlPackParser }] = await Promise.all([
    import("react-dom/client"),
    import("../../src/ui/App.tsx"),
    import("../../src/adapters/js-yaml-pack-parser.ts"),
  ]);

  const container = document.getElementById("root");
  assert.ok(container, "the test DOM is missing #root");

  const root = createRoot(container);
  root.render(
    createElement(App, {
      // REQ-015's port is unrelated to these scenarios; the shell only needs it
      // to render something.
      healthPort: { read: async () => null },
      packSource: new DiskPackSource(() => world.pickPath),
      packParser: new JsYamlPackParser(),
    })
  );
  world.unmount = () => root.unmount();

  await waitFor(() => document.querySelector(PICKER), "the pack picker to render");
}

/**
 * Pick a file and wait until the studio has said something about it — the
 * pack's id, or the reason it refused it. Waiting for the id alone would make a
 * scenario about a rejected pack fail as a timeout instead of on its own
 * assertion.
 */
export async function pickFile(world: StudioWorld, path: string): Promise<void> {
  world.pickPath = path;
  const picker = document.querySelector<HTMLElement>(PICKER);
  assert.ok(picker, "the pack picker is not rendered");
  picker.click();
  await waitFor(
    () => document.querySelector(PACK_ID) ?? document.querySelector(BANNER),
    `the studio to report on ${path}`
  );
}
