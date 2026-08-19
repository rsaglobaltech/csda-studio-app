import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { JsYamlPackParser } from "../../src/adapters/js-yaml-pack-parser.ts";
import { packIdFromPath, toPack } from "../../src/domain/pack.ts";
import { PANEL, pickFile, renderStudio } from "../support/studio.ts";
import { waitFor } from "../support/dom.ts";
import type { StudioWorld } from "../support/world.ts";

/** The pack fixture that declares five requirements. */
const FIXTURE = "fixtures/parking-management/backend/pack.yaml";
const ROW = '[data-testid="requirement-row"]';

Given(
  "I have loaded a pack with {int} requirements",
  async function (this: StudioWorld, count: number) {
    // Read the fixture first and hold the studio to it. Counting rows against a
    // number typed into the scenario would pass just as happily if the pack on
    // disk had grown a sixth requirement; counting them against the file means
    // "5 rows" can only be right for the reason the scenario says it is.
    const text = await readFile(resolve(process.cwd(), FIXTURE), "utf8");
    const pack = toPack(new JsYamlPackParser().parse(text), packIdFromPath(FIXTURE));
    assert.ok(pack, `${FIXTURE} does not hold a pack document`);
    assert.equal(
      pack.requirements.length,
      count,
      `${FIXTURE} declares ${pack.requirements.length} requirements, the scenario needs ${count}`
    );
    this.packOnDisk = pack;

    await renderStudio(this);
    await pickFile(this, FIXTURE);
  }
);

When("I open the Requirements view", async function (this: StudioWorld) {
  // Loading a pack opens the Requirements view over it — v0.1.0 has no second
  // view to navigate away from, so opening it is waiting for it to be there.
  await waitFor(() => document.querySelector(PANEL), "the Requirements view to open");
});

Then("I see {int} rows", function (this: StudioWorld, expected: number) {
  const view = document.querySelector(PANEL);
  assert.ok(view, "the Requirements view is not open");
  const rows = view.querySelectorAll(ROW);
  assert.equal(rows.length, expected, `the view shows ${rows.length} rows, expected ${expected}`);
});

Then(
  "each row shows the requirement id, title and priority",
  function (this: StudioWorld) {
    const pack = this.packOnDisk;
    assert.ok(pack, "no pack was loaded");
    const rows = [...document.querySelectorAll(ROW)];
    assert.ok(rows.length > 0, "the view shows no rows at all");

    rows.forEach((row, index) => {
      const requirement = pack.requirements[index];
      assert.ok(requirement, `row ${index + 1} corresponds to no requirement in the pack`);
      for (const field of ["id", "title", "priority"] as const) {
        const cell = row.querySelector(`[data-field="${field}"]`);
        assert.ok(cell, `row ${index + 1} shows no ${field}`);
        assert.equal(
          cell.textContent?.trim(),
          requirement[field],
          `row ${index + 1} shows the wrong ${field}`
        );
      }
    });
  }
);
