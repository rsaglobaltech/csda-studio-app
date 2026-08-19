import { describe, expect, it } from "vitest";
import { UNSTATED, requirementsListed, toRequirementRows } from "../../src/domain/requirements-list";
import { browseRequirements } from "../../src/application/browse-requirements";
import type { PackRequirement } from "../../src/domain/pack";

const requirement = (over: Partial<PackRequirement> = {}): PackRequirement => ({
  id: "REQ-001",
  title: "Alert operators",
  priority: "Must",
  status: "Draft",
  ...over,
});

describe("toRequirementRows", () => {
  it("gives every declared requirement one row, in document order", () => {
    const rows = toRequirementRows([
      requirement({ id: "REQ-003", title: "Calculate parking fee", priority: "Must" }),
      requirement({ id: "REQ-001", title: "Alert operators", priority: "Should" }),
    ]);
    expect(rows).toEqual([
      { id: "REQ-003", title: "Calculate parking fee", priority: "Must", status: "Draft" },
      { id: "REQ-001", title: "Alert operators", priority: "Should", status: "Draft" },
    ]);
  });

  it("reads a field the author never stated as unstated rather than as blank", () => {
    expect(toRequirementRows([requirement({ title: "", priority: "  ", status: "" })])).toEqual([
      { id: "REQ-001", title: UNSTATED, priority: UNSTATED, status: UNSTATED },
    ]);
  });

  it("lists nothing for a pack that declares nothing", () => {
    expect(toRequirementRows([])).toEqual([]);
  });
});

describe("requirementsListed", () => {
  it("carries the total listed and the moment it was listed", () => {
    expect(
      requirementsListed(toRequirementRows([requirement()]), new Date("2026-05-15T16:44:38.941Z"))
    ).toEqual({ type: "RequirementsListed", total: 1, listedAt: "2026-05-15T16:44:38.941Z" });
  });
});

describe("browseRequirements", () => {
  const clock = () => new Date("2026-05-15T16:44:38.941Z");

  it("lists the loaded pack's requirements and emits RequirementsListed", () => {
    const pack = {
      id: "parking-management/backend",
      requirements: [requirement(), requirement({ id: "REQ-002", title: "Register entry" })],
    };
    const result = browseRequirements(pack, clock);
    expect(result.rows.map((row) => row.id)).toEqual(["REQ-001", "REQ-002"]);
    expect(result.total).toBe(2);
    expect(result.event).toEqual({
      type: "RequirementsListed",
      total: 2,
      listedAt: "2026-05-15T16:44:38.941Z",
    });
  });

  it("lists an empty pack, because an empty pack was still browsed", () => {
    const result = browseRequirements({ id: "some/pack", requirements: [] }, clock);
    expect(result.rows).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.event).toEqual({
      type: "RequirementsListed",
      total: 0,
      listedAt: "2026-05-15T16:44:38.941Z",
    });
  });

  it("emits nothing when no pack is loaded", () => {
    const result = browseRequirements(null, clock);
    expect(result.rows).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.event).toBeNull();
  });
});
