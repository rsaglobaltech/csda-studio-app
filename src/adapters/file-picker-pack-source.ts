import type { PackSourcePort, PickedPackFile } from "../application/ports/pack-source-port";

/**
 * Opens the browser's own file dialog through a detached `<input type="file">`.
 *
 * This is the whole of REQ-001's I/O: the file never leaves the machine and
 * nothing is fetched, which is what "browser-only, no network" means.
 */
export class FilePickerPackSource implements PackSourcePort {
  constructor(private readonly ownerDocument: Document = document) {}

  pick(): Promise<PickedPackFile | null> {
    return new Promise((resolve, reject) => {
      const input = this.ownerDocument.createElement("input");
      input.type = "file";
      input.accept = ".yaml,.yml";
      input.hidden = true;

      const finish = (file: File | null) => {
        input.remove();
        if (file === null) {
          resolve(null);
          return;
        }
        // `webkitRelativePath` is set when the file came from a picked
        // directory, and is the only way the browser reports one; a single
        // picked file reports its name alone.
        const path = file.webkitRelativePath || file.name;
        file.text().then((text) => resolve({ path, text }), reject);
      };

      input.addEventListener("change", () => finish(input.files?.[0] ?? null));
      input.addEventListener("cancel", () => finish(null));

      this.ownerDocument.body.append(input);
      input.click();
    });
  }
}
