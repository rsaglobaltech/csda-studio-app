/**
 * REQ-001 / AGG-001 PackDocument — a pack loaded from disk.
 *
 * Pure domain: no React, no I/O, no DOM. Narrowing a parsed document and
 * naming the pack are rules, so they live here and are tested without a file
 * picker.
 */

export interface PackRequirement {
  readonly id: string;
  readonly title: string;
  /** REQ-003: what the document said, `""` when it said nothing. */
  readonly priority: string;
  readonly status: string;
}

export interface Pack {
  /** `<pack>/<project type>`, the identity a pack is referred to by. */
  readonly id: string;
  readonly requirements: readonly PackRequirement[];
}

/**
 * EVT-001 PackLoaded — payload `pack_id`, `loaded_at`.
 */
export interface PackLoaded {
  readonly type: "PackLoaded";
  readonly packId: string;
  readonly loadedAt: string;
}

/**
 * A pack is identified by the two directory segments that hold it:
 * `parking-management/backend/pack.yaml` is `parking-management/backend`, the
 * same `<pack>/<project type>` shape `.specops.lock` records. Shallower paths
 * give up a segment at a time rather than failing — the picker reports whatever
 * the user chose, not a guaranteed layout.
 */
export function packIdFromPath(path: string): string {
  const segments = path
    .split(/[/\\]/)
    .filter((segment) => segment !== "" && segment !== ".");
  const directories = segments.slice(0, -1);
  if (directories.length >= 2) return directories.slice(-2).join("/");
  if (directories.length === 1) return directories[0];
  const fileName = segments[segments.length - 1] ?? "";
  return fileName.replace(/\.[^.]+$/, "") || "pack";
}

/**
 * Narrow a parsed YAML document to a Pack, or return null.
 *
 * The document is whatever the user picked, so this assumes nothing about it.
 * Judging *why* a document is unacceptable and reporting it is REQ-002's job;
 * loading only needs to know whether there is a pack here at all.
 */
export function toPack(value: unknown, id: string): Pack | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  const listed = Array.isArray(candidate.requirements) ? candidate.requirements : [];
  return { id, requirements: listed.flatMap(toRequirement) };
}

function toRequirement(value: unknown): PackRequirement[] {
  if (typeof value !== "object" || value === null) return [];
  const candidate = value as Record<string, unknown>;
  const { id } = candidate;
  if (typeof id !== "string" || id === "") return [];
  // Only the id is load-bearing. Every other field records what the author
  // wrote, verbatim; deciding what a reader sees when they wrote nothing is
  // `requirements-list.ts`'s job, not this one's.
  return [
    {
      id,
      title: text(candidate.title),
      priority: text(candidate.priority),
      status: text(candidate.status),
    },
  ];
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function packLoaded(pack: Pack, loadedAt: Date): PackLoaded {
  return { type: "PackLoaded", packId: pack.id, loadedAt: loadedAt.toISOString() };
}
