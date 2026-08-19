import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import { createElement } from "react";
import { DiskPackSource } from "../support/disk-pack-source.ts";
import { installDom, waitFor } from "../support/dom.ts";
import type { StudioWorld } from "../support/world.ts";

const PICKER = '[data-testid="pack-picker"]';
const PACK_ID = '[data-testid="pack-id"]';
const PANEL = '[data-testid="requirements-panel"]';
const BANNER = '[data-testid="error-banner"]';

Given("the studio is open with no pack loaded", async function (this: StudioWorld) {
  this.dom = installDom();

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
      // REQ-015's port is unrelated to this scenario; the shell only needs it
      // to render something.
      healthPort: { read: async () => null },
      packSource: new DiskPackSource(() => this.pickPath),
      packParser: new JsYamlPackParser(),
    })
  );
  this.unmount = () => root.unmount();

  await waitFor(() => document.querySelector(PICKER), "the pack picker to render");
  assert.equal(document.querySelector(PANEL), null, "a pack is already loaded");
});

When("I pick the file {string}", async function (this: StudioWorld, path: string) {
  this.pickPath = path;
  const picker = document.querySelector<HTMLElement>(PICKER);
  assert.ok(picker, "the pack picker is not rendered");
  picker.click();
  // Picking is over once the studio has said something about the file — the
  // pack's id, or the reason it refused it. Waiting for the id alone would make
  // a scenario about a rejected pack fail as a timeout instead of on its own
  // assertion.
  await waitFor(
    () => document.querySelector(PACK_ID) ?? document.querySelector(BANNER),
    `the studio to report on ${path}`
  );
});

Then("the header shows {string}", function (this: StudioWorld, expected: string) {
  const header = document.querySelector("header");
  assert.ok(header, "the studio has no header");
  assert.ok(
    header.textContent?.includes(expected),
    `header reads "${header.textContent}", expected it to show "${expected}"`
  );
});

Then("the requirements panel lists at least one entry", function (this: StudioWorld) {
  const panel = document.querySelector(PANEL);
  assert.ok(panel, "the requirements panel is not rendered");
  assert.ok(panel.querySelectorAll("li").length >= 1, "the requirements panel lists nothing");
});
