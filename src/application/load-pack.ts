import { packIdFromPath, packLoaded, toPack } from "../domain/pack";
import type { Pack, PackLoaded } from "../domain/pack";
import type { PackParserPort } from "./ports/pack-parser-port";
import type { PackSourcePort } from "./ports/pack-source-port";

export interface LoadPackResult {
  readonly pack: Pack | null;
  readonly event: PackLoaded | null;
}

const NOTHING_LOADED: LoadPackResult = { pack: null, event: null };

/**
 * UC-001 Load Pack From Disk / CMD-001 LoadPackCommand.
 *
 * Depends on the two port interfaces only — never on an adapter — so the use
 * case runs in a unit test with neither a file dialog nor a YAML parser.
 */
export async function loadPack(
  source: PackSourcePort,
  parser: PackParserPort,
  now: () => Date = () => new Date()
): Promise<LoadPackResult> {
  const picked = await source.pick();
  if (picked === null) return NOTHING_LOADED;

  const pack = toPack(parser.parse(picked.text), packIdFromPath(picked.path));
  if (pack === null) return NOTHING_LOADED;

  return { pack, event: packLoaded(pack, now()) };
}
