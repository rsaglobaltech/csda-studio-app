import type { Health } from "../../domain/health";

/**
 * The one thing the application needs from the outside world to answer
 * QRY-005: a way to read the deployment's health document. Whether that is a
 * fetch, a file read or a stub is the adapter's problem.
 */
export interface HealthPort {
  read(): Promise<Health | null>;
}
