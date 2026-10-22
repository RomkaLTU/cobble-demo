# 0001. Client-only Vite + React app with tasks in localStorage

## Status

Accepted

## Context

The todo app starts from an empty repository. It needs a stack and a place to keep tasks so that the list survives a reload and a browser restart. Later tasks (tick, remove) build on the same files and stored data.

## Decision

- The app is a client-only Vite + React + TypeScript single page, styled with one hand-written `src/styles.css`. No CSS framework or UI library.
- Tasks live in the browser's `localStorage` under the key `todo.tasks.v1` as a JSON array of `{ id, text, done, createdAt }`, ordered oldest first. `src/store.ts` owns this contract; components never touch storage directly.
- Store functions take the storage object as a parameter, so Vitest unit tests use an in-memory fake.

## Alternatives considered

- A backend with a database: shared, cross-device lists, but far more than a single-user todo list needs.
- IndexedDB: larger capacity and async access, but more code for a small list of short strings.
- Tailwind or a component library: faster styling, but the ticket asks for a small hand-written stylesheet.

## Consequences

- Each browser profile has its own list; nothing syncs between browsers or devices.
- A change to the stored shape needs a new key version (`todo.tasks.v2`) or a migration in `loadTasks`.
- Unreadable stored data is treated as an empty list.

## Related

None.
