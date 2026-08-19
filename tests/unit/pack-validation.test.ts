import { describe, expect, it } from "vitest";
import { findSchemaViolations, packValidationFailed } from "../../src/domain/pack-validation";
import { validatePack } from "../../src/application/validate-pack";
import { loadPack } from "../../src/application/load-pack";
import type { PackParserPort } from "../../src/application/ports/pack-parser-port";
import type { PackSourcePort } from "../../src/application/ports/pack-source-port";

const FAILED_AT = new Date("2026-05-15T16:44:38.941Z");

describe("findSchemaViolations", () => {
  it("accepts a document whose requirements all carry an id", () => {
    expect(
      findSchemaViolations({
        metadata: { name: "Parking Management Backend Domain Pack" },
        requirements: [
          { id: "REQ-001", title: "Alert operators" },
          { id: "REQ-002", title: "Register vehicle entry" },
        ],
      })
    ).toEqual([]);
  });

  it("names the entry that is missing its id", () => {
    expect(
      findSchemaViolations({
        requirements: [{ title: "Alert operators" }, { id: "REQ-002", title: "Register entry" }],
      })
    ).toEqual(["Required field 'id' missing on requirements[0]"]);
  });

  it("reports every violation, in document order", () => {
    expect(
      findSchemaViolations({
        requirements: [{ id: "REQ-001" }, { title: "no id" }, { id: "   " }, { id: 7 }],
      })
    ).toEqual([
      "Required field 'id' missing on requirements[1]",
      "Required field 'id' missing on requirements[2]",
      "Required field 'id' missing on requirements[3]",
    ]);
  });

  it("rejects a requirements entry that is not a mapping", () => {
    expect(findSchemaViolations({ requirements: ["REQ-001", null] })).toEqual([
      "Entry requirements[0] must be a mapping",
      "Entry requirements[1] must be a mapping",
    ]);
  });

  it("rejects a requirements key that is not a list", () => {
    expect(findSchemaViolations({ requirements: "REQ-001" })).toEqual([
      "Field 'requirements' must be a list",
    ]);
  });

  it("accepts a pack that declares no requirements at all", () => {
    // Absent is not the same as malformed: REQ-002 is about violations, and a
    // pack with nothing to list has not violated anything.
    expect(findSchemaViolations({ metadata: {} })).toEqual([]);
    expect(findSchemaViolations({ requirements: null })).toEqual([]);
    expect(findSchemaViolations({ requirements: [] })).toEqual([]);
  });

  it("rejects anything that is not a document", () => {
    // Unparseable YAML reaches the domain as null, so it is reported here too
    // rather than disappearing inside the parser.
    const message = "The picked file does not hold a pack document";
    expect(findSchemaViolations(null)).toEqual([message]);
    expect(findSchemaViolations("requirements")).toEqual([message]);
    expect(findSchemaViolations([{ id: "REQ-001" }])).toEqual([message]);
  });
});

describe("packValidationFailed", () => {
  it("carries the message and the moment it failed", () => {
    expect(
      packValidationFailed(["Required field 'id' missing on requirements[0]"], FAILED_AT)
    ).toEqual({
      type: "PackValidationFailed",
      errorMessage: "Required field 'id' missing on requirements[0]",
      failedAt: "2026-05-15T16:44:38.941Z",
    });
  });

  it("keeps every violation in the one message the event carries", () => {
    expect(packValidationFailed(["first", "second"], FAILED_AT).errorMessage).toBe("first; second");
  });
});

describe("validatePack", () => {
  const clock = () => FAILED_AT;

  it("emits PackValidationFailed for a document that breaks the schema", () => {
    const result = validatePack({ parsed: { requirements: [{ title: "no id" }] } }, clock);
    expect(result.violations).toEqual(["Required field 'id' missing on requirements[0]"]);
    expect(result.event).toEqual({
      type: "PackValidationFailed",
      errorMessage: "Required field 'id' missing on requirements[0]",
      failedAt: "2026-05-15T16:44:38.941Z",
    });
  });

  it("emits nothing for a document that conforms", () => {
    const result = validatePack({ parsed: { requirements: [{ id: "REQ-001" }] } }, clock);
    expect(result.violations).toEqual([]);
    expect(result.event).toBeNull();
  });
});

describe("loadPack, on an invalid pack", () => {
  const clock = () => FAILED_AT;
  const sourceReturning = (text: string): PackSourcePort => ({
    pick: async () => ({ path: "fixtures/broken-no-id.yaml", text }),
  });
  const parser: PackParserPort = {
    parse: (text) => (text === "" ? null : { requirements: [{ title: "no id" }] }),
  };

  it("refuses the pack and reports why", async () => {
    const result = await loadPack(sourceReturning("requirements: …"), parser, clock);
    expect(result.pack).toBeNull();
    expect(result.event).toBeNull();
    expect(result.failure).toEqual({
      type: "PackValidationFailed",
      errorMessage: "Required field 'id' missing on requirements[0]",
      failedAt: "2026-05-15T16:44:38.941Z",
    });
  });

  it("reports a file that holds no document at all", async () => {
    const result = await loadPack(sourceReturning(""), parser, clock);
    expect(result.pack).toBeNull();
    expect(result.failure?.errorMessage).toBe("The picked file does not hold a pack document");
  });

  it("reports nothing when the user picks nothing", async () => {
    const result = await loadPack({ pick: async () => null }, parser, clock);
    expect(result.failure).toBeNull();
  });
});
