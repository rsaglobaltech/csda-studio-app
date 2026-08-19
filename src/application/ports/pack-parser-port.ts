/**
 * Turning pack text into a document tree. AI_RULES fixes the implementation as
 * bundled `js-yaml`; the application only needs the shape, which keeps the use
 * case free of the parser and its failure modes.
 */
export interface PackParserPort {
  /** Returns the parsed document, or null when the text cannot be parsed. */
  parse(text: string): unknown;
}
