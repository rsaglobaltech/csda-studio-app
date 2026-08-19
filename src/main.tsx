import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./ui/App";
import { FilePickerPackSource } from "./adapters/file-picker-pack-source";
import { JsYamlPackParser } from "./adapters/js-yaml-pack-parser";
import { StaticHealthAdapter } from "./adapters/static-health-adapter";

// Composition root: the only place a concrete adapter is named.
const root = document.getElementById("root");
if (!root) throw new Error("index.html is missing #root");

createRoot(root).render(
  <StrictMode>
    <App
      healthPort={new StaticHealthAdapter()}
      packSource={new FilePickerPackSource()}
      packParser={new JsYamlPackParser()}
    />
  </StrictMode>
);
