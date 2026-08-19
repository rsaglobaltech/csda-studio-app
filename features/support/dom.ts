import { JSDOM } from "jsdom";
import type { DOMWindow } from "jsdom";

/**
 * A DOM for the step definitions to render the real studio into.
 *
 * REQ-015 could assert against the built bundle over HTTP because its subject
 * was a static asset. A scenario that says "I pick a file" and "the header
 * shows …" is about the rendered component, so the steps need somewhere to
 * render it. This is that somewhere — the studio itself never imports jsdom.
 */
export interface DomHandle {
  readonly window: DOMWindow;
  cleanup(): void;
}

const HTML = '<!doctype html><html><body><div id="root"></div></body></html>';

export function installDom(): DomHandle {
  const dom = new JSDOM(HTML, { url: "http://localhost/", pretendToBeVisual: true });
  const globals = globalThis as unknown as Record<string, unknown>;
  const source = dom.window as unknown as Record<string, unknown>;
  const installed: string[] = ["window", "document"];

  globals.window = dom.window;
  globals.document = dom.window.document;

  for (const key of Object.getOwnPropertyNames(dom.window)) {
    if (key in globals) continue;
    const value = source[key];
    // Lower-case members are window methods (`addEventListener`,
    // `requestAnimationFrame`, …) and break when called with `globalThis` as
    // the receiver. Upper-case ones are interface constructors and must stay
    // unbound so `instanceof` and `.prototype` keep working.
    globals[key] =
      typeof value === "function" && /^[a-z]/.test(key) ? value.bind(dom.window) : value;
    installed.push(key);
  }

  return {
    window: dom.window,
    cleanup() {
      dom.window.close();
      for (const key of installed) delete globals[key];
    },
  };
}

/**
 * Poll until `probe` returns something, so a step can wait for React to finish
 * a render it triggered without reaching for `act`.
 */
export async function waitFor<T>(
  probe: () => T | null | undefined,
  message: string,
  timeoutMs = 2000
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const value = probe();
    if (value !== null && value !== undefined) return value;
    if (Date.now() > deadline) throw new Error(`timed out after ${timeoutMs}ms waiting: ${message}`);
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}
