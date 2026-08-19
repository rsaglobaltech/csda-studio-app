/**
 * REQ-003 / AGG-001 PackDocument — "a list view with id, title, priority and
 * status".
 *
 * Pure domain: no React, no I/O, no DOM. Projecting the requirements a pack
 * declares into the rows a reader scans is a rule, so it lives here and is
 * tested without rendering anything. `pack.ts` records what the author wrote;
 * this decides what a row reads when they wrote nothing.
 */

import type { PackRequirement } from "./pack";

export interface RequirementRow {
  readonly id: string;
  readonly title: string;
  readonly priority: string;
  readonly status: string;
}

/**
 * EVT-003 RequirementsListed — payload `total`, `listed_at`.
 */
export interface RequirementsListed {
  readonly type: "RequirementsListed";
  readonly total: number;
  readonly listedAt: string;
}

/**
 * What a cell reads for a field the pack never stated. An em dash rather than a
 * blank: the scenario asks that every row show its id, title and priority, and
 * an empty cell reads as a rendering fault rather than as an author's omission.
 */
export const UNSTATED = "—";

/**
 * The rows for a pack's requirements, in the order the document declares them.
 *
 * Document order is the pack author's own ordering, which is the one thing that
 * makes the list scannable against the file they wrote. Nothing is sorted or
 * dropped here — every requirement the pack declares gets exactly one row.
 */
export function toRequirementRows(
  requirements: readonly PackRequirement[]
): readonly RequirementRow[] {
  return requirements.map((requirement) => ({
    id: requirement.id,
    title: stated(requirement.title),
    priority: stated(requirement.priority),
    status: stated(requirement.status),
  }));
}

function stated(value: string): string {
  const trimmed = value.trim();
  return trimmed === "" ? UNSTATED : trimmed;
}

export function requirementsListed(
  rows: readonly RequirementRow[],
  listedAt: Date
): RequirementsListed {
  return { type: "RequirementsListed", total: rows.length, listedAt: listedAt.toISOString() };
}
