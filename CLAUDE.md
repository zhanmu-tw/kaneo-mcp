# CLAUDE.md

This is a Kaneo CLI tool built with TypeScript.

## Project Structure

- `src/index.ts` — CLI entry point, parses args and dispatches to tool functions
- `src/client.ts` — HTTP client wrapping `fetch` with Bearer token auth
- `src/registry.ts` — Central registry merging all tool maps
- `src/tools/*.ts` — One file per API category, each exports a `Record<string, ToolFn>`
- `test/run-tests.mjs` — End-to-end test suite against a live Kaneo instance

## Build & Test

```bash
npm run build   # TypeScript → dist/
npm test        # Requires .env with KANEO_API_URL, KANEO_API_TOKEN, KANEO_WORKSPACE_ID
```

## Key Patterns

- **All tools** follow the same shape: plain async function `(client, args) => result`
- **CLI args** are parsed from `--key=value` flags; `workspaceId` is auto-injected from the positional arg
- **PUT endpoints** in Kaneo require full objects (no partial updates). The `update_project`, `update_task`, and `update_time_entry` tools handle this by GETting the current resource first, merging the user's changes, then PUTting the full object.
- **No `null` values** — Kaneo rejects `null` in request bodies. Use empty string `""` instead for optional string fields.
- Several fields the Kaneo docs show as optional are actually **required**: `icon` (projects), `status` (tasks), `workspaceId` (search), `userId` (activities, assignee).

## Environment Variables

| Variable             | Required   | Purpose                        |
| -------------------- | ---------- | ------------------------------ |
| `KANEO_API_URL`      | Tests only | Kaneo instance base URL        |
| `KANEO_API_TOKEN`    | Tests only | Bearer token for auth          |
| `KANEO_WORKSPACE_ID` | Tests only | Workspace to run tests against |

Note: In production, API URL, workspace ID, and token are passed as CLI positional arguments.
