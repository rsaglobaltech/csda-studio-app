import { useState } from "react";
import { HealthBadge } from "./HealthBadge";
import { PackPicker } from "./PackPicker";
import type { HealthPort } from "../application/ports/health-port";
import type { PackParserPort } from "../application/ports/pack-parser-port";
import type { PackSourcePort } from "../application/ports/pack-source-port";
import type { Pack } from "../domain/pack";

export function App({
  healthPort,
  packSource,
  packParser,
}: {
  healthPort: HealthPort;
  packSource: PackSourcePort;
  packParser: PackParserPort;
}) {
  // One piece of state, held by the one component that owns both the header and
  // the panel. A store would be premature until three components share it.
  const [pack, setPack] = useState<Pack | null>(null);

  return (
    <>
      <header>
        <h1>CsdaStudio</h1>
        {pack ? <p data-testid="pack-id">{pack.id}</p> : null}
      </header>
      <main>
        <PackPicker source={packSource} parser={packParser} onLoaded={setPack} />
        {pack ? (
          <section aria-label="Requirements" data-testid="requirements-panel">
            <ul>
              {pack.requirements.map((requirement) => (
                <li key={requirement.id}>
                  {requirement.id} — {requirement.title}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <p>
          Deployment health: <HealthBadge port={healthPort} />
        </p>
      </main>
    </>
  );
}
