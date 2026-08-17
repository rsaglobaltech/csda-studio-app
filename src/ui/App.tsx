import { HealthBadge } from "./HealthBadge";
import type { HealthPort } from "../application/ports/health-port";

export function App({ healthPort }: { healthPort: HealthPort }) {
  return (
    <main>
      <h1>CsdaStudio</h1>
      <p>
        Deployment health: <HealthBadge port={healthPort} />
      </p>
    </main>
  );
}
