import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./ui/App";
import { StaticHealthAdapter } from "./adapters/static-health-adapter";

// Composition root: the only place a concrete adapter is named.
const root = document.getElementById("root");
if (!root) throw new Error("index.html is missing #root");

createRoot(root).render(
  <StrictMode>
    <App healthPort={new StaticHealthAdapter()} />
  </StrictMode>
);
