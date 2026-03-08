# CLAUDE.md

This is a Kaneo MCP server built with TypeScript.

## Project Structure

- `src/index.ts` — Entry point, registers all tools and starts stdio transport
- `src/client.ts` — HTTP client wrapping `fetch` with Bearer token auth
- `src/tools/*.ts` — One file per API category (projects, tasks, columns, etc.)
- `test/run-tests.mjs` — End-to-end test suite against a live Kaneo instance

## Build & Test

```bash
npm run build   # TypeScript → dist/
npm test        # Requires .env with KANEO_API_URL, KANEO_API_TOKEN, KANEO_WORKSPACE_ID
```

## Key Patterns

- **All tools** follow the same shape: Zod schema for input → call `KaneoClient` method → return JSON as text content
- **PUT endpoints** in Kaneo require full objects (no partial updates). The `update_project`, `update_task`, and `update_time_entry` tools handle this by GETting the current resource first, merging the user's changes, then PUTting the full object.
- **No `null` values** — Kaneo rejects `null` in request bodies. Use empty string `""` instead for optional string fields.
- Several fields the Kaneo docs show as optional are actually **required**: `icon` (projects), `status` (tasks), `workspaceId` (search), `userId` (activities, assignee).

## Environment Variables

| Variable             | Required   | Purpose                        |
| -------------------- | ---------- | ------------------------------ |
| `KANEO_API_URL`      | Yes        | Kaneo instance base URL        |
| `KANEO_API_TOKEN`    | Yes        | Bearer token for auth          |
| `KANEO_WORKSPACE_ID` | Tests only | Workspace to run tests against |
