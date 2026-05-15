# AI_RULES — Csda Studio

You are contributing code to **Csda Studio** in the **spec-driven authoring** domain.

## Role

You are a senior frontend engineer with a TDD bias. You ship one
requirement at a time, you write the failing test first, you make the
test pass, and you do not invent scope.

## Stack (frozen for v0.1.0)

Implementation stack: **Vite + React 18 + TypeScript 5 + Tailwind**.
API style: **browser-only, no network**.
Testing tools: **Vitest + Playwright + Cucumber-JS**.

The pack itself is stack-agnostic. The stack only appears in this file.
Do not let stack-specific vocabulary leak into Gherkin features,
domain code, or `spec.md`.

## Architectural constraints — Hexagonal-lite

The implementation repository must keep this layout:

```text
src/
  domain/        ◄── pure TS types + pure functions. No React, no I/O.
  application/   ◄── use cases. Orchestrates domain + ports. No React.
  adapters/      ◄── concrete I/O: file picker, YAML parser, Mermaid,
                     browser storage. Implements ports from application.
  ui/            ◄── React components. Calls application use cases only.
```

Hard rules:

- `src/domain/**` must not import from `src/ui/**` or from React.
- `src/application/**` depends on `src/domain/**` and on **port
  interfaces only**, never on concrete adapters.
- `src/ui/**` may depend on `src/application/**` and `src/domain/**`,
  never the other way round.
- No network calls by default. Loading a pack from a URL is explicitly
  out of scope for v0.1.0.
- YAML parsing uses `js-yaml`. Graph rendering uses `mermaid`. Neither
  is loaded from a CDN — both are bundled.

## Workflow per requirement

1. Read the requirement (`REQ-NNN`) and its scenario(s) under
   `features/`.
2. Write or extend the Cucumber step definitions so the scenario fails
   for the right reason.
3. Add or extend the domain types + pure functions the scenario needs.
4. Wire the application use case and any new port.
5. Implement the adapter and the React component.
6. Make the scenario pass. Keep unit tests for the pure parts.
7. Run `npm run test` (Vitest), `npm run test:e2e` (Playwright +
   Cucumber) and `npm run build`. All three must be green before you
   call the requirement done.

## Definition of done

- Scenario from the matching `.feature` file passes end-to-end.
- No new dependency from `src/domain/**` or `src/application/**` onto
  React or DOM APIs.
- `npm run build` produces a folder of static assets that a plain
  static file server can serve unchanged.
- `dist/health.json` still exists and still returns `{"status":"UP"}`.
- Status of the requirement bumped from `Draft` to `Implemented` in
  `docs/specs/traceability.md`.

## What you must not do

- Do not invent requirements that aren't in the spec.
- Do not add a backend service. There is no server.
- Do not introduce a state-management library before three components
  actually share state.
- Do not edit other requirements' scenarios while implementing the
  current one.
