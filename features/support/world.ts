import { After, setWorldConstructor, World } from "@cucumber/cucumber";
import type { Server } from "node:http";

export class StudioWorld extends World {
  server: Server | null = null;
  origin = "";
  response: Response | null = null;
  body: string = "";
}

setWorldConstructor(StudioWorld);

After(async function (this: StudioWorld) {
  if (!this.server) return;
  await new Promise<void>((resolve, reject) =>
    this.server!.close((err) => (err ? reject(err) : resolve()))
  );
  this.server = null;
});
