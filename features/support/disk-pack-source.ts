import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { PackSourcePort, PickedPackFile } from "../../src/application/ports/pack-source-port.ts";

/**
 * The studio's own source adapter opens a file dialog. Node has no dialog, so
 * the step definitions stand in for the one thing a scenario cannot perform —
 * the user choosing a file — and hand back exactly what the browser adapter
 * hands back: the reported path and the file's text.
 *
 * Everything downstream of this is the real thing: the real YAML parser, the
 * real use case, the real component, and the real fixture on disk.
 */
export class DiskPackSource implements PackSourcePort {
  constructor(private readonly nextPath: () => string | null) {}

  async pick(): Promise<PickedPackFile | null> {
    const path = this.nextPath();
    if (path === null) return null;
    return { path, text: await readFile(resolve(process.cwd(), path), "utf8") };
  }
}
