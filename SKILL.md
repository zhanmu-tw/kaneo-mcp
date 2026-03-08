---
name: kaneo
description: Manage projects, tasks, columns, labels, time entries, notifications, and more in Kaneo — an open-source project management tool.
---

# Kaneo CLI

CLI tool for [Kaneo](https://kaneo.app). Provides 48 functions to manage your Kaneo workspace — projects, tasks, board columns, labels, time entries, activities, notifications, search, and workflow rules.

## Invocation

```bash
kaneo <api-url> <workspace-id> <api-token> <function> [--arg=value ...]
```

The `workspace-id` positional arg is automatically injected as `workspaceId` into any function that needs it.

---

## Important API Quirks

1. **PUT endpoints require full objects** — `update_project`, `update_task`, and `update_time_entry` auto-fetch the current resource, merge your changes, then PUT the full object. You only need to supply the fields you want to change.
2. **No `null` values** — Kaneo rejects `null` in request bodies. Use empty string `""` for optional string fields you want to clear.
3. **Some "optional" fields are required** — `icon` (projects), `status` (tasks), `workspaceId` (search), `userId` (activities/assignee).
4. **Priority values** — Must be one of: `no-priority`, `low`, `medium`, `high`, `urgent`.
5. **Status = column name** — Task statuses correspond to board column names (e.g. `"To Do"`, `"In Progress"`, `"Done"`).
6. **JSON args** — For `import_tasks` and `reorder_columns`, pass complex data as JSON strings: `--tasks='[{"title":"x","status":"To Do"}]'`

---

## Functions Reference (48 total)

### Config (1)

| Function     | Description                        | Args     |
| ------------ | ---------------------------------- | -------- |
| `get_config` | Get app settings and configuration | _(none)_ |

---

### Projects (5)

| Function         | Description                    | Required Args         | Optional Args                                               |
| ---------------- | ------------------------------ | --------------------- | ----------------------------------------------------------- |
| `list_projects`  | List all projects in workspace | _(auto: workspaceId)_ |                                                             |
| `create_project` | Create a new project           | `--name`, `--icon`    | `--slug`                                                    |
| `get_project`    | Get project by ID              | `--id`                |                                                             |
| `update_project` | Update a project               | `--id`                | `--name`, `--icon`, `--slug`, `--description`, `--isPublic` |
| `delete_project` | Delete a project               | `--id`                |                                                             |

---

### Tasks (13)

| Function                  | Description               | Required Args                        | Optional Args                                                                                              |
| ------------------------- | ------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `list_tasks`              | List tasks by project     | `--projectId`                        |                                                                                                            |
| `create_task`             | Create a task             | `--projectId`, `--title`, `--status` | `--description`, `--priority`, `--dueDate`, `--userId`                                                     |
| `get_task`                | Get task by ID            | `--id`                               |                                                                                                            |
| `update_task`             | Update all task fields    | `--id`                               | `--title`, `--description`, `--priority`, `--status`, `--projectId`, `--position`, `--dueDate`, `--userId` |
| `delete_task`             | Delete a task             | `--id`                               |                                                                                                            |
| `export_tasks`            | Export all project tasks  | `--projectId`                        |                                                                                                            |
| `import_tasks`            | Import tasks (JSON array) | `--projectId`, `--tasks`             |                                                                                                            |
| `update_task_status`      | Change task status        | `--id`, `--status`                   |                                                                                                            |
| `update_task_priority`    | Change task priority      | `--id`, `--priority`                 |                                                                                                            |
| `update_task_assignee`    | Assign/unassign task      | `--id`, `--userId`                   |                                                                                                            |
| `update_task_due_date`    | Change due date           | `--id`, `--dueDate`                  |                                                                                                            |
| `update_task_title`       | Change task title         | `--id`, `--title`                    |                                                                                                            |
| `update_task_description` | Change task description   | `--id`, `--description`              |                                                                                                            |

**Priority values:** `no-priority`, `low`, `medium`, `high`, `urgent`

---

### Columns (5)

| Function          | Description               | Required Args              | Optional Args                              |
| ----------------- | ------------------------- | -------------------------- | ------------------------------------------ |
| `get_columns`     | Get project board columns | `--projectId`              |                                            |
| `create_column`   | Create a column           | `--projectId`, `--name`    | `--icon`, `--color`, `--isFinal`           |
| `reorder_columns` | Reorder columns (JSON)    | `--projectId`, `--columns` |                                            |
| `update_column`   | Update a column           | `--id`                     | `--name`, `--icon`, `--color`, `--isFinal` |
| `delete_column`   | Delete a column           | `--id`                     |                                            |

---

### Activities (5)

| Function          | Description           | Required Args                                 | Optional Args |
| ----------------- | --------------------- | --------------------------------------------- | ------------- |
| `get_activities`  | Get task activities   | `--taskId`                                    |               |
| `create_activity` | Create a system event | `--taskId`, `--userId`, `--message`, `--type` |               |
| `create_comment`  | Add a comment         | `--taskId`, `--comment`                       |               |
| `update_comment`  | Edit a comment        | `--activityId`, `--comment`                   |               |
| `delete_comment`  | Delete a comment      | `--id`                                        |               |

**Activity types:** `comment`, `task`, `status_changed`, `priority_changed`, `unassigned`, `assignee_changed`, `due_date_changed`, `title_changed`, `description_changed`, `create`

---

### Time Entries (4)

| Function                | Description               | Required Args             | Optional Args                               |
| ----------------------- | ------------------------- | ------------------------- | ------------------------------------------- |
| `get_task_time_entries` | Get time entries for task | `--taskId`                |                                             |
| `get_time_entry`        | Get time entry by ID      | `--id`                    |                                             |
| `create_time_entry`     | Log time on a task        | `--taskId`, `--startTime` | `--endTime`, `--description`                |
| `update_time_entry`     | Update a time entry       | `--id`                    | `--startTime`, `--endTime`, `--description` |

**Times must be ISO 8601** — e.g. `2026-03-08T16:00:00+08:00`

---

### Labels (6)

| Function               | Description              | Required Args         | Optional Args       |
| ---------------------- | ------------------------ | --------------------- | ------------------- |
| `get_task_labels`      | Get labels on a task     | `--taskId`            |                     |
| `get_workspace_labels` | Get all workspace labels | _(auto: workspaceId)_ |                     |
| `create_label`         | Create a label           | `--name`, `--color`   | `--taskId`          |
| `get_label`            | Get label by ID          | `--id`                |                     |
| `update_label`         | Update a label           | `--id`                | `--name`, `--color` |
| `delete_label`         | Delete a label           | `--id`                |                     |

---

### Notifications (5)

| Function                      | Description           | Required Args                      | Optional Args                                        |
| ----------------------------- | --------------------- | ---------------------------------- | ---------------------------------------------------- |
| `list_notifications`          | Get all notifications | _(none)_                           |                                                      |
| `create_notification`         | Create a notification | `--userId`, `--title`, `--message` | `--type`, `--relatedEntityId`, `--relatedEntityType` |
| `mark_notification_read`      | Mark one as read      | `--id`                             |                                                      |
| `mark_all_notifications_read` | Mark all as read      | _(none)_                           |                                                      |
| `clear_all_notifications`     | Delete all            | _(none)_                           |                                                      |

---

### Search (1)

| Function        | Description              | Required Args | Optional Args                                     |
| --------------- | ------------------------ | ------------- | ------------------------------------------------- |
| `global_search` | Search across everything | `--q`         | `--type`, `--projectId`, `--limit`, `--userEmail` |

**Search types:** `all`, `tasks`, `projects`, `workspaces`, `comments`, `activities`

---

### Workflow Rules (3)

| Function               | Description          | Required Args                                                   | Optional Args |
| ---------------------- | -------------------- | --------------------------------------------------------------- | ------------- |
| `get_workflow_rules`   | Get project rules    | `--projectId`                                                   |               |
| `upsert_workflow_rule` | Create/update a rule | `--projectId`, `--integrationType`, `--eventType`, `--columnId` |               |
| `delete_workflow_rule` | Delete a rule        | `--id`                                                          |               |

---

## Usage Examples

### List all projects

```bash
kaneo https://kaneo.example.com ws123 tok456 list_projects
```

### Create a task

```bash
kaneo https://kaneo.example.com ws123 tok456 create_task \
  --projectId=abc123 \
  --title="Fix login bug" \
  --status="To Do" \
  --priority=high
```

### Move a task to Done

```bash
kaneo https://kaneo.example.com ws123 tok456 update_task_status \
  --id=task123 \
  --status="Done"
```

### Search for tasks

```bash
kaneo https://kaneo.example.com ws123 tok456 global_search \
  --q=authentication \
  --type=tasks
```

### Log 2 hours of work

```bash
kaneo https://kaneo.example.com ws123 tok456 create_time_entry \
  --taskId=task123 \
  --startTime="2026-03-08T14:00:00+08:00" \
  --endTime="2026-03-08T16:00:00+08:00" \
  --description="Bug fixing"
```

### Import tasks (JSON)

```bash
kaneo https://kaneo.example.com ws123 tok456 import_tasks \
  --projectId=abc123 \
  --tasks='[{"title":"Design homepage","status":"To Do","priority":"high"},{"title":"Write docs","status":"Backlog"}]'
```

### Create a label on a task

```bash
kaneo https://kaneo.example.com ws123 tok456 create_label \
  --name=bug \
  --color="#ef4444" \
  --taskId=task123
```

---

## Recommended Workflow

1. **List projects** — `list_projects` to find project IDs
2. **Check columns** — `get_columns --projectId=...` to see available statuses
3. **Perform action** — create/update/delete tasks, labels, etc.
4. **Confirm** — parse the JSON output

### Common ID Resolution

| You Have     | Function to Call                     | Use                     |
| ------------ | ------------------------------------ | ----------------------- |
| Project name | `list_projects` → find by name       | `id`                    |
| Task title   | `global_search --q=... --type=tasks` | `id`                    |
| Column name  | `get_columns --projectId=...`        | column `name` as status |
| Label name   | `get_workspace_labels`               | `id`                    |

---

## Notes

1. **All output is JSON** — pipe through `jq` for formatting or filtering
2. **Status is a column name, not an ID** — use the exact string (e.g. `"To Do"`)
3. **Use specific update functions** — prefer `update_task_status` over `update_task` for single-field changes
4. **Labels are workspace-scoped** — they can be attached to tasks across any project
5. **workspaceId is auto-injected** — from the positional arg; no need to pass `--workspaceId` unless overriding
