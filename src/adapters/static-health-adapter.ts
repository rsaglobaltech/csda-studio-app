import { toHealth } from "../domain/health";
import type { Health } from "../domain/health";
import type { HealthPort } from "../application/ports/health-port";

/**
 * Reads `health.json` from the served bundle. This is the only I/O REQ-015
 * needs, and it is a same-origin static asset — not a network call to a
 * backend, which AI_RULES rules out for v0.1.0.
 */
export class StaticHealthAdapter implements HealthPort {
  constructor(private readonly url: string = "./health.json") {}

  async read(): Promise<Health | null> {
    try {
      const response = await fetch(this.url, { headers: { accept: "application/json" } });
      if (!response.ok) return null;
      return toHealth(await response.json());
    } catch {
      // A missing or unparseable document means "not healthy", not a crash:
      // the shell has to render something either way.
      return null;
    }
  }
}
