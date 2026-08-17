import { useState } from "react";
import { loadPack } from "../application/load-pack";
import type { PackParserPort } from "../application/ports/pack-parser-port";
import type { PackSourcePort } from "../application/ports/pack-source-port";
import type { Pack } from "../domain/pack";

/**
 * The UI depends on the use case and on the port *interfaces*. The concrete
 * picker is injected from main.tsx, so this component renders in a test
 * without a file dialog.
 */
export function PackPicker({
  source,
  parser,
  onLoaded,
}: {
  source: PackSourcePort;
  parser: PackParserPort;
  onLoaded: (pack: Pack) => void;
}) {
  const [busy, setBusy] = useState(false);

  function pick() {
    setBusy(true);
    loadPack(source, parser)
      .then((result) => {
        if (result.pack) onLoaded(result.pack);
      })
      // Nothing loads and the button becomes usable again. Telling the user
      // what went wrong is REQ-002.
      .catch(() => undefined)
      .finally(() => setBusy(false));
  }

  return (
    <button type="button" data-testid="pack-picker" aria-busy={busy} disabled={busy} onClick={pick}>
      Open pack.yaml
    </button>
  );
}
