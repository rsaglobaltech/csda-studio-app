import { packIdFromPath, packLoaded, toPack } from "../domain/pack";
import type { Pack, PackLoaded } from "../domain/pack";
import type { PackValidationFailed } from "../domain/pack-validation";
import { validatePack } from "./validate-pack";
import type { PackParserPort } from "./ports/pack-parser-port";
import type { PackSourcePort } from "./ports/pack-source-port";

export interface LoadPackResult {
  readonly pack: Pack | null;
  readonly event: PackLoaded | null;
  /** REQ-002: why the picked file was refused, or null when it was not. */
  readonly failure: PackValidationFailed | null;
}

const NOTHING_LOADED: LoadPackResult = { pack: null, event: null, failure: null };

/**
 * UC-001 Load Pack From Disk / CMD-001 LoadPackCommand.
 *
 * Depends on the two port interfaces only — never on an adapter — so the use
 * case runs in a unit test with neither a file dialog nor a YAML parser.
 *
 * A picked file is validated (UC-002) before it becomes a pack: the aggregate's
 * invariant is that a pack conforms to the schema before any view is shown, so
 * a document that fails yields the failure and no pack at all.
 */
export async function loadPack(
  source: PackSourcePort,
  parser: PackParserPort,
  now: () => Date = () => new Date()
): Promise<LoadPackResult> {
  const picked = await source.pick();
  if (picked === null) return NOTHING_LOADED;

  const parsed = parser.parse(picked.text);
  const validation = validatePack({ parsed }, now);
  if (validation.event !== null) {
    return { pack: null, event: null, failure: validation.event };
  }

  const pack = toPack(parsed, packIdFromPath(picked.path));
  if (pack === null) return NOTHING_LOADED;

  return { pack, event: packLoaded(pack, now()), failure: null };
}
