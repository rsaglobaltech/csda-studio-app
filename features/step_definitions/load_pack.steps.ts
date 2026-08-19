import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import { PANEL, pickFile, renderStudio } from "../support/studio.ts";
import type { StudioWorld } from "../support/world.ts";

const ROW = '[data-testid="requirement-row"]';

Given("the studio is open with no pack loaded", async function (this: StudioWorld) {
  await renderStudio(this);
  assert.equal(document.querySelector(PANEL), null, "a pack is already loaded");
});

When("I pick the file {string}", async function (this: StudioWorld, path: string) {
  await pickFile(this, path);
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
  assert.ok(panel.querySelectorAll(ROW).length >= 1, "the requirements panel lists nothing");
});
