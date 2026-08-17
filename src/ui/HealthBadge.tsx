import { useEffect, useState } from "react";
import { getHealth } from "../application/get-health";
import type { GetHealthResult } from "../application/get-health";
import type { HealthPort } from "../application/ports/health-port";

/**
 * The UI depends on the application use case and on the port *interface*.
 * The concrete adapter is injected from main.tsx, which keeps this component
 * renderable in a test without any I/O.
 */
export function HealthBadge({ port }: { port: HealthPort }) {
  const [result, setResult] = useState<GetHealthResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHealth(port).then((r) => {
      if (!cancelled) setResult(r);
    });
    return () => {
      cancelled = true;
    };
  }, [port]);

  if (!result) return <span aria-busy="true">checking…</span>;

  return (
    <span role="status" data-healthy={result.healthy}>
      {result.healthy ? "UP" : "DOWN"}
      {result.health ? ` · v${result.health.version}` : ""}
    </span>
  );
}
