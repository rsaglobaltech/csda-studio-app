import { requirementsListed, toRequirementRows } from "../domain/requirements-list";
import type { RequirementRow, RequirementsListed } from "../domain/requirements-list";
import type { Pack } from "../domain/pack";

export interface BrowseRequirementsResult {
  readonly rows: readonly RequirementRow[];
  readonly total: number;
  readonly event: RequirementsListed | null;
}

/**
 * UC-003 Browse Requirements / QRY-001 BrowseRequirementsQuery.
 *
 * A query over the pack the studio already holds. UC-001 did the reading, so
 * there is nothing left to ask the outside world for and this use case declares
 * no port — the layering rule is that application depends on port interfaces
 * only, not that it must invent one.
 *
 * With no pack there is no listing and no event: the studio cannot have listed
 * requirements it never loaded. A pack that declares none still lists — an
 * empty pack was browsed, and `total: 0` is the honest answer.
 */
export function browseRequirements(
  pack: Pack | null,
  now: () => Date = () => new Date()
): BrowseRequirementsResult {
  if (pack === null) return { rows: [], total: 0, event: null };

  const rows = toRequirementRows(pack.requirements);
  return { rows, total: rows.length, event: requirementsListed(rows, now()) };
}
