import { describe, expect, it } from "vitest";
import { healthReported, isHealthy, toHealth } from "../../src/domain/health";
import { getHealth } from "../../src/application/get-health";
import type { HealthPort } from "../../src/application/ports/health-port";

describe("toHealth", () => {
  it("accepts a well-formed document", () => {
    expect(toHealth({ status: "UP", version: "0.1.0" })).toEqual({
      status: "UP",
      version: "0.1.0",
    });
  });

  it("defaults a missing version rather than rejecting the document", () => {
    expect(toHealth({ status: "UP" })).toEqual({ status: "UP", version: "unknown" });
  });

  it("rejects anything that is not a known status", () => {
    // The asset is whatever the deployment served — a proxy error page parses
    // as JSON often enough to matter.
    expect(toHealth({ status: "ok" })).toBeNull();
    expect(toHealth({})).toBeNull();
    expect(toHealth(null)).toBeNull();
    expect(toHealth("UP")).toBeNull();
    expect(toHealth([])).toBeNull();
  });
});

describe("isHealthy", () => {
  it("is false for DOWN and for an absent document", () => {
    expect(isHealthy({ status: "UP", version: "1" })).toBe(true);
    expect(isHealthy({ status: "DOWN", version: "1" })).toBe(false);
    expect(isHealthy(null)).toBe(false);
  });
});

describe("getHealth", () => {
  const portReturning = (health: ReturnType<typeof toHealth>): HealthPort => ({
    read: async () => health,
  });

  it("reports the event when the document is present", async () => {
    const health = { status: "UP", version: "0.1.0" } as const;
    const result = await getHealth(portReturning(health));
    expect(result.healthy).toBe(true);
    expect(result.event).toEqual(healthReported(health));
  });

  it("emits no event when there is nothing to report", async () => {
    const result = await getHealth(portReturning(null));
    expect(result.healthy).toBe(false);
    expect(result.event).toBeNull();
  });
});
