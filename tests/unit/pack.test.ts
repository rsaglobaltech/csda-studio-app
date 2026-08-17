import { describe, expect, it } from "vitest";
import { packIdFromPath, packLoaded, toPack } from "../../src/domain/pack";
import { loadPack } from "../../src/application/load-pack";
import type { PackParserPort } from "../../src/application/ports/pack-parser-port";
import type { PackSourcePort } from "../../src/application/ports/pack-source-port";

describe("packIdFromPath", () => {
  it("names a pack after the two directories that hold it", () => {
    expect(packIdFromPath("fixtures/parking-management/backend/pack.yaml")).toBe(
      "parking-management/backend"
    );
    expect(packIdFromPath("/home/me/packs/parking-management/backend/pack.yaml")).toBe(
      "parking-management/backend"
    );
    expect(packIdFromPath("C:\\packs\\parking-management\\backend\\pack.yaml")).toBe(
      "parking-management/backend"
    );
  });

  it("gives up a segment at a time on a shallower path", () => {
    // A browser reports the file name alone unless the user picked a directory,
    // so there is no layout to rely on.
    expect(packIdFromPath("backend/pack.yaml")).toBe("backend");
    expect(packIdFromPath("pack.yaml")).toBe("pack");
    expect(packIdFromPath("./pack.yml")).toBe("pack");
    expect(packIdFromPath("")).toBe("pack");
  });
});

describe("toPack", () => {
  it("keeps the requirements a pack declares, in order", () => {
    const document = {
      metadata: { name: "Parking Management Backend Domain Pack" },
      requirements: [
        { id: "REQ-001", title: "Alert operators", priority: "Must" },
        { id: "REQ-002", title: "Register vehicle entry", priority: "Must" },
      ],
    };
    expect(toPack(document, "parking-management/backend")).toEqual({
      id: "parking-management/backend",
      requirements: [
        { id: "REQ-001", title: "Alert operators" },
        { id: "REQ-002", title: "Register vehicle entry" },
      ],
    });
  });

  it("treats a pack with no requirements key as a pack that lists nothing", () => {
    expect(toPack({ metadata: {} }, "some/pack")).toEqual({ id: "some/pack", requirements: [] });
    expect(toPack({ requirements: "REQ-001" }, "some/pack")).toEqual({
      id: "some/pack",
      requirements: [],
    });
  });

  it("drops entries with no usable id and defaults a missing title", () => {
    expect(toPack({ requirements: [{ title: "no id" }, null, "REQ-003", { id: "" }] }, "p")).toEqual(
      { id: "p", requirements: [] }
    );
    expect(toPack({ requirements: [{ id: "REQ-001" }] }, "p")).toEqual({
      id: "p",
      requirements: [{ id: "REQ-001", title: "" }],
    });
  });

  it("rejects anything that is not a document", () => {
    // The file is whatever the user picked — a text file parses as a string.
    expect(toPack(null, "p")).toBeNull();
    expect(toPack("requirements", "p")).toBeNull();
    expect(toPack([{ id: "REQ-001" }], "p")).toBeNull();
  });
});

describe("packLoaded", () => {
  it("carries the pack id and the moment it loaded", () => {
    const pack = { id: "parking-management/backend", requirements: [] };
    expect(packLoaded(pack, new Date("2026-05-15T16:44:38.941Z"))).toEqual({
      type: "PackLoaded",
      packId: "parking-management/backend",
      loadedAt: "2026-05-15T16:44:38.941Z",
    });
  });
});

describe("loadPack", () => {
  const parser: PackParserPort = {
    parse: (text) => (text === "" ? null : { requirements: [{ id: "REQ-001", title: "First" }] }),
  };
  const sourceReturning = (path: string | null, text = ""): PackSourcePort => ({
    pick: async () => (path === null ? null : { path, text }),
  });
  const clock = () => new Date("2026-05-15T16:44:38.941Z");

  it("loads the picked pack and emits PackLoaded", async () => {
    const result = await loadPack(
      sourceReturning("fixtures/parking-management/backend/pack.yaml", "requirements: …"),
      parser,
      clock
    );
    expect(result.pack).toEqual({
      id: "parking-management/backend",
      requirements: [{ id: "REQ-001", title: "First" }],
    });
    expect(result.event).toEqual({
      type: "PackLoaded",
      packId: "parking-management/backend",
      loadedAt: "2026-05-15T16:44:38.941Z",
    });
  });

  it("emits nothing when the user picks nothing", async () => {
    const result = await loadPack(sourceReturning(null), parser, clock);
    expect(result.pack).toBeNull();
    expect(result.event).toBeNull();
  });

  it("emits nothing when the picked file holds no document", async () => {
    const result = await loadPack(sourceReturning("empty.yaml", ""), parser, clock);
    expect(result.pack).toBeNull();
    expect(result.event).toBeNull();
  });
});
