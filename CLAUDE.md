# KPI Dashboard

Portfolio/demo project showcasing modern Angular: zoneless, signals-first, standalone.
Audience for the code: senior Angular reviewers. Hold a high bar.

## Stack
- Angular 22 (standalone components only — there are NO NgModules in this repo)
- Zoneless change detection (Zone.js is NOT installed)
- Signals for all reactive state
- TypeScript strict mode
- Vitest for unit tests (or Karma/Jasmine if package.json says so — check first)

## Commands
- Dev server: `ng serve`
- Unit tests: `ng test`
- Single spec: `ng test --include='**/kpi-card.spec.ts'`
- Lint: `ng lint`
- Build: `ng build`
- Always run `ng lint` and the relevant `ng test` after touching files with logic.

## Project layout
- `src/app/core/` — singleton services, signal stores, http resources
- `src/app/features/<feature>/` — feature folders, each self-contained
- `src/app/shared/` — reusable dumb components, pipes, directives
- One component per file; kebab-case filenames (`kpi-card.component.ts`)

## Hard rules (always)
- Use `input()` / `output()` / `model()` functional APIs. NEVER `@Input()` / `@Output()`.
- Use `signal()`, `computed()`, `linkedSignal()` for state. Use `effect()` sparingly and only for side effects, never to sync state.
- Prefer `httpResource()` over manual `HttpClient.subscribe()`.
- Prefer Signal Forms over Reactive/Template forms.
- `changeDetection: ChangeDetectionStrategy.OnPush` on every component (it's the v22 default, but set it explicitly).
- Use the new control flow (`@if`, `@for`, `@switch`). NEVER `*ngIf` / `*ngFor`.
- Components stay dumb. Business logic lives in signal-based services in `core/`.

## Hard rules (never)
- Don't add RxJS where a signal or `httpResource()` does the job. RxJS only for genuine event streams (e.g. `toSignal()` at a boundary).
- Don't install Zone.js or reintroduce NgModules.
- Don't rewrite or reformat files unrelated to the current task. A one-line fix touches one line.
- Don't add dependencies without asking first.

## Workflow expectations
- For anything beyond a trivial edit: propose a short plan first, wait for my OK, then implement.
- Make the smallest change that satisfies the request.
- When you finish a unit of work, run tests/lint and report the result — don't claim it works without running it.

## Detailed references (loaded on demand)
@.claude/rules/signals-patterns.md
@.claude/rules/testing.md
@.claude/rules/git-workflow.md

For architecture and the live task list, see @docs/architecture.md (read it before adding features).
