# 0001. Vite, React and TypeScript stack

## Status

Accepted

## Context

The repository held only a README. The todo list app needs a project skeleton with a dev server, a production build and unit tests, and the team asked for no UI framework, router or state library.

## Decision

Build the app with Vite, React and TypeScript. `npm run dev` serves the page, `npm run build` type-checks and writes to `dist/`, and `npm test` runs Vitest with a jsdom environment. State lives in React component state; no router, state library or UI framework is added.

## Alternatives considered

- Plain HTML and JavaScript: no build step, but no type checking and more manual DOM code as the app grows.
- A full framework such as Next.js: server rendering and routing that a single client-side page does not need.

## Consequences

- One `package.json` at the root holds the app, its build and its tests.
- Adding a router, state library or component library later is a new decision.

## Related

- docs/adr/0002-browser-local-task-storage.md
