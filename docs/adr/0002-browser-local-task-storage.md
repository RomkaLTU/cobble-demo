# 0002. Browser-local task storage

## Status

Accepted

## Context

The list must survive a page reload, with no sign-in and no sharing between people or devices.

## Decision

Store the tasks in `localStorage` under the key `todo.tasks` as a JSON array of `{ id, text, done }`. `src/storage.ts` owns reading and writing that key. A missing, unreadable or malformed value is read as an empty list. Open tabs of the same browser reload the list when another tab changes the key.

## Alternatives considered

- A backend with a database: shared lists, but needs a server, accounts and hosting the ticket rules out.
- IndexedDB: more capacity and an async API that a short list of text does not need.

## Consequences

- Each browser keeps its own list; clearing site data deletes it.
- A malformed stored value is dropped and overwritten on the next save.
- Sharing lists between people or devices later needs a new storage decision that supersedes this one.

## Related

- docs/adr/0001-vite-react-typescript-stack.md
