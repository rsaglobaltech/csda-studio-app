import { load } from "js-yaml";
import type { PackParserPort } from "../application/ports/pack-parser-port";

/**
 * The bundled `js-yaml`, as AI_RULES requires — never a CDN.
 */
export class JsYamlPackParser implements PackParserPort {
  parse(text: string): unknown {
    try {
      return load(text) ?? null;
    } catch {
      // A file the user picked can be anything. Reporting *why* it is not YAML
      // is REQ-002; loading only needs to know there is no document here.
      return null;
    }
  }
}
