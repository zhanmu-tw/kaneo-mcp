#!/usr/bin/env node

import { KaneoClient } from "./client.js";
import { registry } from "./registry.js";

const USAGE = `Usage: kaneo <api-url> <workspace-id> <api-token> <function> [--arg=value ...]

Available functions:
  Config:          get_config
  Projects:        list_projects, create_project, get_project, update_project, delete_project
  Tasks:           list_tasks, create_task, get_task, update_task, delete_task,
                   export_tasks, import_tasks, update_task_status, update_task_priority,
                   update_task_assignee, update_task_due_date, update_task_title,
                   update_task_description
  Columns:         get_columns, create_column, reorder_columns, update_column, delete_column
  Activities:      get_activities, create_activity, create_comment, update_comment, delete_comment
  Time Entries:    get_task_time_entries, get_time_entry, create_time_entry, update_time_entry
  Labels:          get_task_labels, get_workspace_labels, create_label, get_label,
                   update_label, delete_label
  Notifications:   list_notifications, create_notification, mark_notification_read,
                   mark_all_notifications_read, clear_all_notifications
  Search:          global_search
  Workflow Rules:  get_workflow_rules, upsert_workflow_rule, delete_workflow_rule

Examples:
  kaneo https://kaneo.example.com ws123 tok456 list_projects
  kaneo https://kaneo.example.com ws123 tok456 create_task --projectId=abc --title="Fix bug" --status="To Do"
  kaneo https://kaneo.example.com ws123 tok456 global_search --q=auth
`;

// ── Parse CLI args ──────────────────────────────────────────────────────

const argv = process.argv.slice(2);

if (argv.length < 4 || argv.includes("--help") || argv.includes("-h")) {
  console.error(USAGE);
  process.exit(1);
}

const [apiUrl, workspaceId, apiToken, fnName, ...rest] = argv;

// Parse --key=value flags into an args object
const args: Record<string, string> = { workspaceId };

for (const arg of rest) {
  const match = arg.match(/^--([^=]+)=(.*)$/);
  if (match) {
    args[match[1]] = match[2];
  } else if (arg.startsWith("--")) {
    // --flag with no value → treat as "true"
    args[arg.slice(2)] = "true";
  } else {
    console.error(`Unknown argument: ${arg}\n`);
    console.error(USAGE);
    process.exit(1);
  }
}

// ── Dispatch ────────────────────────────────────────────────────────────

const fn = registry[fnName];

if (!fn) {
  console.error(`Unknown function: ${fnName}\n`);
  console.error(USAGE);
  process.exit(1);
}

const client = new KaneoClient(apiUrl, apiToken);

try {
  const result = await fn(client, args);
  console.log(JSON.stringify(result, null, 2));
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
}
