import { healthReported, isHealthy } from "../domain/health";
import type { Health, HealthReported } from "../domain/health";
import type { HealthPort } from "./ports/health-port";

export interface GetHealthResult {
  readonly health: Health | null;
  readonly healthy: boolean;
  readonly event: HealthReported | null;
}

/**
 * UC-015 Report Deployment Health / QRY-005 GetHealthQuery.
 *
 * Depends on the port interface only — never on the adapter — so the use case
 * is testable without a server.
 */
export async function getHealth(port: HealthPort): Promise<GetHealthResult> {
  const health = await port.read();
  return {
    health,
    healthy: isHealthy(health),
    event: health ? healthReported(health) : null,
  };
}
