import { useMemo, useState } from "react";
import { ErrorBanner } from "./ErrorBanner";
import { HealthBadge } from "./HealthBadge";
import { PackPicker } from "./PackPicker";
import { RequirementsList } from "./RequirementsList";
import { browseRequirements } from "../application/browse-requirements";
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
  // Two pieces of state, held by the one component that owns the header, the
  // banner and the panel. A store would be premature until three components
  // share them.
  const [pack, setPack] = useState<Pack | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UC-003 runs once per pack, not once per render: listing is what the studio
  // did when this pack arrived, and EVT-003 should not be produced again
  // because an unrelated piece of state changed.
  const listing = useMemo(() => browseRequirements(pack), [pack]);

  // A rejected pack replaces whatever was on screen, so the studio never shows
  // an error next to entities from an earlier, unrelated file.
  function loaded(next: Pack) {
    setPack(next);
    setError(null);
  }

  function failed(message: string) {
    setPack(null);
    setError(message);
  }

  return (
    <>
      <header>
        <h1>CsdaStudio</h1>
        {pack ? <p data-testid="pack-id">{pack.id}</p> : null}
      </header>
      <main>
        <PackPicker
          source={packSource}
          parser={packParser}
          onLoaded={loaded}
          onFailed={failed}
        />
        {error ? <ErrorBanner message={error} /> : null}
        {/* Loading a pack opens the Requirements view over it. A rejected pack
            leaves no view at all, so the studio never lists entities from a
            file it refused. */}
        {pack ? <RequirementsList rows={listing.rows} /> : null}
        <p>
          Deployment health: <HealthBadge port={healthPort} />
        </p>
      </main>
    </>
  );
}
