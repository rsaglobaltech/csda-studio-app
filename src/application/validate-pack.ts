import { findSchemaViolations, packValidationFailed } from "../domain/pack-validation";
import type { PackValidationFailed } from "../domain/pack-validation";

/** CMD-002 ValidatePackCommand carries the parsed document. */
export interface ValidatePackCommand {
  readonly parsed: unknown;
}

export interface ValidatePackResult {
  readonly violations: readonly string[];
  /** Null when the document conforms — nothing failed, so nothing is emitted. */
  readonly event: PackValidationFailed | null;
}

/**
 * UC-002 Validate Loaded Pack / CMD-002 ValidatePackCommand.
 *
 * Takes a document that is already parsed, so the use case needs no parser
 * port and no adapter: the rule is in the domain and the clock is the only
 * thing injected.
 */
export function validatePack(
  command: ValidatePackCommand,
  now: () => Date = () => new Date()
): ValidatePackResult {
  const violations = findSchemaViolations(command.parsed);
  return {
    violations,
    event: violations.length === 0 ? null : packValidationFailed(violations, now()),
  };
}
