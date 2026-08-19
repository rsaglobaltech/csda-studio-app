import { After, setWorldConstructor, World } from "@cucumber/cucumber";
import type { Server } from "node:http";
import type { DomHandle } from "./dom.ts";

export class StudioWorld extends World {
  server: Server | null = null;
  origin = "";
  response: Response | null = null;
  body: string = "";

  /** The rendered studio, for scenarios whose subject is the UI. */
  dom: DomHandle | null = null;
  unmount: (() => void) | null = null;
  /** The file the next pick resolves to — set by the "I pick the file" step. */
  pickPath: string | null = null;
}

setWorldConstructor(StudioWorld);

After(async function (this: StudioWorld) {
  if (this.unmount) {
    this.unmount();
    this.unmount = null;
  }
  if (this.dom) {
    this.dom.cleanup();
    this.dom = null;
  }
  if (!this.server) return;
  await new Promise<void>((resolve, reject) =>
    this.server!.close((err) => (err ? reject(err) : resolve()))
  );
  this.server = null;
});
