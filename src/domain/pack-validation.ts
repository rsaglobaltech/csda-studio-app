/**
 * REQ-002 / AGG-001 PackDocument — "a loaded pack must conform to the canonical
 * pack schema before any view is shown".
 *
 * Judging a parsed document against the schema is a rule, not I/O, so it lives
 * here and is tested without a file picker, a parser or a component. `pack.ts`
 * decides whether there is a pack at all; this decides whether the pack the
 * author wrote is one they meant to write.
 */

/**
 * EVT-002 PackValidationFailed — payload `error_message`, `failed_at`.
 */
export interface PackValidationFailed {
  readonly type: "PackValidationFailed";
  readonly errorMessage: string;
  readonly failedAt: string;
}

/**
 * Every way the picked document breaks the schema, in document order, or an
 * empty list when it holds.
 *
 * The input is whatever the parser made of a file the user chose, so this
 * assumes nothing: a document that failed to parse arrives as null and is a
 * violation like any other, because REQ-002 is that neither invalid YAML nor a
 * schema violation is swallowed.
 */
export function findSchemaViolations(value: unknown): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return ["The picked file does not hold a pack document"];
  }

  const document = value as Record<string, unknown>;
  const listed = document.requirements;
  if (listed === undefined || listed === null) return [];
  if (!Array.isArray(listed)) return ["Field 'requirements' must be a list"];

  return listed.flatMap((entry, index) => requirementViolations(entry, index));
}

function requirementViolations(value: unknown, index: number): string[] {
  const at = `requirements[${index}]`;
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return [`Entry ${at} must be a mapping`];
  }

  const id = (value as Record<string, unknown>).id;
  if (typeof id !== "string" || id.trim() === "") {
    return [`Required field 'id' missing on ${at}`];
  }
  return [];
}

/**
 * The event a failed validation produces. `error_message` is singular in the
 * spec, so several violations are reported as one sentence rather than the
 * first one silently standing in for the rest.
 */
export function packValidationFailed(
  violations: readonly string[],
  failedAt: Date
): PackValidationFailed {
  return {
    type: "PackValidationFailed",
    errorMessage: violations.join("; "),
    failedAt: failedAt.toISOString(),
  };
}
