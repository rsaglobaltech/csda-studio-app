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
  onFailed,
}: {
  source: PackSourcePort;
  parser: PackParserPort;
  onLoaded: (pack: Pack) => void;
  onFailed: (message: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  function pick() {
    setBusy(true);
    loadPack(source, parser)
      .then((result) => {
        if (result.pack) onLoaded(result.pack);
        else if (result.failure) onFailed(result.failure.errorMessage);
        // Neither: the user picked nothing. There is nothing to report.
      })
      // The file could not even be read. REQ-002 is that a failure reaches the
      // user rather than dying here.
      .catch((error: unknown) =>
        onFailed(error instanceof Error ? error.message : "The picked file could not be read")
      )
      .finally(() => setBusy(false));
  }

  return (
    <button type="button" data-testid="pack-picker" aria-busy={busy} disabled={busy} onClick={pick}>
      Open pack.yaml
    </button>
  );
}
