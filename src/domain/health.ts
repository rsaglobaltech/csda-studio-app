/**
 * REQ-015 / AGG-004 StudioShell — deployment health.
 *
 * Pure domain: no React, no I/O, no DOM. The rule about what counts as
 * healthy lives here so it can be tested without serving anything.
 */

export type HealthStatus = "UP" | "DOWN";

export interface Health {
  readonly status: HealthStatus;
  /** The studio version this build was cut from. */
  readonly version: string;
}

/**
 * EVT-015 HealthReported — the event shape the shell reports upward.
 */
export interface HealthReported {
  readonly type: "HealthReported";
  readonly health: Health;
}

/**
 * Narrow unknown parsed JSON to a Health, or return null.
 *
 * The health document is fetched from a static asset, which means it is
 * whatever the deployment actually served — possibly an HTML error page a
 * proxy substituted. Parsing has to assume nothing.
 */
export function toHealth(value: unknown): Health | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Record<string, unknown>;
  const status = candidate.status;
  if (status !== "UP" && status !== "DOWN") return null;
  const version = typeof candidate.version === "string" ? candidate.version : "unknown";
  return { status, version };
}

export function isHealthy(health: Health | null): boolean {
  return health?.status === "UP";
}

export function healthReported(health: Health): HealthReported {
  return { type: "HealthReported", health };
}
