/**
 * CMD-001 LoadPackCommand carries a `file`. This is what the application needs
 * to obtain one: a way to ask the user for it. Whether that is a browser file
 * dialog or a path read straight off disk is the adapter's problem.
 */
export interface PickedPackFile {
  /** The path the picker reported — the pack's identity is derived from it. */
  readonly path: string;
  readonly text: string;
}

export interface PackSourcePort {
  /** Resolves null when the user picks nothing. */
  pick(): Promise<PickedPackFile | null>;
}
