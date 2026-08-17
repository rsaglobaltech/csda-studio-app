import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { serveStatic } from "../support/static-server.ts";
import type { StudioWorld } from "../support/world.ts";

const DIST = resolve(process.cwd(), "dist");

Given("a built copy of the studio is being served", async function (this: StudioWorld) {
  assert.ok(
    existsSync(DIST),
    "dist/ is missing — run `npm run build` before the end-to-end suite."
  );
  const { server, origin } = await serveStatic(DIST);
  this.server = server;
  this.origin = origin;
});

When("a client requests {string}", async function (this: StudioWorld, path: string) {
  this.response = await fetch(`${this.origin}${path}`);
  this.body = await this.response.text();
});

Then("the response status is {int}", function (this: StudioWorld, expected: number) {
  assert.ok(this.response, "no request has been made");
  assert.equal(this.response.status, expected);
});

Then(
  "the body parses as JSON containing {string}",
  function (this: StudioWorld, expectation: string) {
    // The scenario writes the expectation as "status: UP" — plain enough for
    // a domain reader, and unambiguous for one key/value pair.
    const [key, value] = expectation.split(":").map((part) => part.trim());
    let parsed: unknown;
    assert.doesNotThrow(() => {
      parsed = JSON.parse(this.body);
    }, `body is not JSON: ${this.body.slice(0, 120)}`);
    assert.equal((parsed as Record<string, unknown>)[key], value);
  }
);
