import { Then } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import type { StudioWorld } from "../support/world.ts";

const BANNER = '[data-testid="error-banner"]';
const PANEL = '[data-testid="requirements-panel"]';

// The studio is opened and the file is picked by load_pack.steps.ts — the same
// two steps, run against a fixture that violates the schema instead of one that
// satisfies it.

Then("I see the error {string}", function (this: StudioWorld, expected: string) {
  const banner = document.querySelector(BANNER);
  assert.ok(banner, "the studio reported no error at all");
  assert.ok(
    banner.textContent?.includes(expected),
    `the error reads "${banner.textContent}", expected it to say "${expected}"`
  );
});

Then("no entities are listed", function (this: StudioWorld) {
  assert.equal(
    document.querySelector(PANEL),
    null,
    "the studio listed entities from a pack it should have rejected"
  );
});
