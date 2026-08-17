# Csda Studio - Spec-Driven Development

This project was generated from the SDD MVP template.

## Context
- Project type: `frontend`
- Domain: `spec-driven authoring`

## Structure
- `spec.md`: business manifesto and goals.
- `AI_RULES.md`: AI execution contract.
- `features/`: acceptance criteria in Gherkin.
- `docs/specs/traceability.md`: requirement -> scenario -> domain -> implementation -> test mapping.
- `docs/specs/domain-model.md`: bounded contexts, aggregates, value objects, and events.
- `docs/specs/use-cases.md`: use cases mapped to requirements and commands/queries.
- `docs/specs/commands.md`: commands and queries expected by the application layer.
- `docs/specs/events.md`: domain events used for meaningful state changes.
- `docs/specs/aggregates.md`: aggregate roots and invariants.
- `docs/specs/status-model.md`: lightweight Unified Process maturity states.
- `docs/specs/review-checklist.md`: pre-implementation and architecture gates.
- `docs/specs/adr/`: architecture decision records.


## Running it

```bash
npm install
npm run verify          # typecheck + unit tests + build — green
npm run test:e2e:req015  # the one implemented scenario, end to end
npm run dev
```

**`npm run test:e2e` is red on purpose.** It runs all 16 scenarios; 14 have no
step definitions yet, and undefined steps are failures. That is the spec gate
working, not a broken build — the harness fills them in one requirement at a
time. Use `npm run verify` as the green signal until then.

## Where this project is

Phase 5 of the dogfood: the scaffold exists and **REQ-015 (health) is green
end to end** — domain, use case, port, adapter, React component, unit tests,
and a Cucumber scenario that serves the real `dist/` over a plain static file
server and requests `/health.json`.

```text
src/
  domain/        health.ts            pure types + rules, no React, no I/O
  application/   get-health.ts        UC-015 / QRY-005, depends on the port only
    ports/       health-port.ts
  adapters/      static-health-adapter.ts
  ui/            App.tsx  HealthBadge.tsx
  main.tsx                            composition root — the only place an adapter is named
```

REQ-001..REQ-014 are next, via `csda harness run`.

### Two deviations worth knowing about

- **No Playwright or Tailwind yet.** `AI_RULES.md` freezes them into the stack,
  but REQ-015 is an HTTP request against a built static asset — no browser and
  no styling involved. They arrive with the first requirement that needs them,
  rather than sitting in `package.json` unused.
- **Vitest has its own config file.** Vitest bundles its own copy of Vite, so a
  shared `vite.config.ts` makes `tsc` compare two different `Plugin` types and
  fail. `vitest.config.ts` carries no React plugin, which also means the unit
  suite cannot accidentally reach into `src/ui`.

## Recommended Workflow
1. Define or refine `spec.md`.
2. Refine domain model documents in `docs/specs/`.
3. Adapt scenarios in `features/`.
4. Map scenarios in `docs/specs/traceability.md`.
5. Implement software until acceptance criteria pass.

## Support Command
- Validate spec structure:
  - `../mvp-spec-template/scripts/validate_specs.sh .`
