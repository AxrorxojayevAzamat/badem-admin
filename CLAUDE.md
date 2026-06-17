# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:4200
npm run build      # production build → dist/
npm test           # run unit tests with Vitest
npm run watch      # incremental dev build
```

Scaffolding:
```bash
ng generate component component-name
ng generate service service-name
ng generate --help   # full list of schematics
```

## Stack

- **Angular 22** with standalone components (no NgModules)
- **TypeScript 6**, **RxJS 7.8**
- **Vitest** for unit tests (not Karma/Jasmine)
- **Prettier** for formatting (`.prettierrc`)

## Architecture

This is a freshly scaffolded Angular admin app. Key conventions Angular 22 introduces:

- Components use `signal()` for reactive state instead of class properties where possible
- Components are standalone (`imports: [...]` directly on the decorator, no shared modules)
- Routing is centralized in `src/app/app.routes.ts`; providers in `src/app/app.config.ts`
- Styles: global in `src/styles.scss`, component-scoped in `*.scss` alongside each component
