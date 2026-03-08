---
name: kaneo
description: Manage projects, tasks, columns, labels, time entries, notifications, and more in Kaneo — an open-source project management tool.
---

# Kaneo MCP Server

MCP server for [Kaneo](https://kaneo.app). Provides 48 tools to manage your Kaneo workspace — projects, tasks, board columns, labels, time entries, activities, notifications, search, and workflow rules.

## Invocation

Environment variables (`KANEO_API_URL`, `KANEO_API_TOKEN`) are pre-configured in `.env`. Just run:

```bash
node --env-file=.env dist/index.js
```

---

## Important API Quirks

> **READ THESE BEFORE USING THE TOOLS**

1. **PUT endpoints require full objects** — `update_project`, `update_task`, and `update_time_entry` auto-fetch the current resource, merge your changes, then PUT the full object. You only need to supply the fields you want to change.
2. **No `null` values** — Kaneo rejects `null` in request bodies. Use empty string `""` for optional string fields you want to clear.
3. **Some "optional" fields are required** — `icon` (projects), `status` (tasks), `workspaceId` (search), `userId` (activities/assignee).
4. **Priority values** — Must be one of: `no-priority`, `low`, `medium`, `high`, `urgent`.
5. **Status = column name** — Task statuses correspond to board column names (e.g. `"To Do"`, `"In Progress"`, `"Done"`).

---

## Tools Reference (48 total)

### Config (1 tool)

#### `get_config`

Get Kaneo application settings and configuration (registration, demo mode, SSO, SMTP, guest access).

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| _(none)_  | —    | —        | —           |

---

### Projects (5 tools)

#### `list_projects`

List all projects in a workspace.

| Parameter     | Type   | Required | Description  |
| ------------- | ------ | -------- | ------------ |
| `workspaceId` | string | ✅       | Workspace ID |

#### `create_project`

Create a new project in a workspace.

| Parameter     | Type   | Required | Description                             |
| ------------- | ------ | -------- | --------------------------------------- |
| `name`        | string | ✅       | Project name                            |
| `workspaceId` | string | ✅       | Workspace ID                            |
| `icon`        | string | ✅       | Project icon (emoji or icon identifier) |
| `slug`        | string | ❌       | Project slug                            |

#### `get_project`

Get a specific project by ID.

| Parameter     | Type   | Required | Description  |
| ------------- | ------ | -------- | ------------ |
| `id`          | string | ✅       | Project ID   |
| `workspaceId` | string | ❌       | Workspace ID |

#### `update_project`

Update an existing project. Only supply fields you want to change — current values are preserved for the rest.

| Parameter     | Type    | Required | Description                   |
| ------------- | ------- | -------- | ----------------------------- |
| `id`          | string  | ✅       | Project ID                    |
| `workspaceId` | string  | ✅       | Workspace ID                  |
| `name`        | string  | ❌       | Project name                  |
| `icon`        | string  | ❌       | Project icon                  |
| `slug`        | string  | ❌       | Project slug                  |
| `description` | string  | ❌       | Project description           |
| `isPublic`    | boolean | ❌       | Whether the project is public |

#### `delete_project`

Delete a project by ID.

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `id`      | string | ✅       | Project ID  |

---

### Tasks (13 tools)

#### `list_tasks`

List all tasks for a project, organized by columns.

| Parameter   | Type   | Required | Description |
| ----------- | ------ | -------- | ----------- |
| `projectId` | string | ✅       | Project ID  |

#### `create_task`

Create a new task in a project.

| Parameter     | Type   | Required | Description                                              |
| ------------- | ------ | -------- | -------------------------------------------------------- |
| `projectId`   | string | ✅       | Project ID                                               |
| `title`       | string | ✅       | Task title                                               |
| `status`      | string | ✅       | Task status (column name)                                |
| `description` | string | ❌       | Task description                                         |
| `priority`    | enum   | ❌       | `no-priority` \| `low` \| `medium` \| `high` \| `urgent` |
| `dueDate`     | string | ❌       | Due date (ISO 8601)                                      |
| `userId`      | string | ❌       | Assignee user ID                                         |

#### `get_task`

Get a specific task by ID.

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `id`      | string | ✅       | Task ID     |

#### `update_task`

Update all fields of a task. Only supply fields you want to change.

| Parameter     | Type   | Required | Description                                              |
| ------------- | ------ | -------- | -------------------------------------------------------- |
| `id`          | string | ✅       | Task ID                                                  |
| `title`       | string | ❌       | Task title                                               |
| `description` | string | ❌       | Task description                                         |
| `priority`    | enum   | ❌       | `no-priority` \| `low` \| `medium` \| `high` \| `urgent` |
| `status`      | string | ❌       | Task status (column name)                                |
| `projectId`   | string | ❌       | Project ID (to move between projects)                    |
| `position`    | number | ❌       | Position within column                                   |
| `dueDate`     | string | ❌       | Due date (ISO 8601)                                      |
| `userId`      | string | ❌       | Assignee user ID                                         |

#### `delete_task`

Delete a task by ID.

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `id`      | string | ✅       | Task ID     |

#### `export_tasks`

Export all tasks from a project.

| Parameter   | Type   | Required | Description |
| ----------- | ------ | -------- | ----------- |
| `projectId` | string | ✅       | Project ID  |

#### `import_tasks`

Import multiple tasks into a project.

| Parameter   | Type   | Required | Description                       |
| ----------- | ------ | -------- | --------------------------------- |
| `projectId` | string | ✅       | Project ID                        |
| `tasks`     | array  | ✅       | Array of task objects (see below) |

Each task object in the array:

| Field         | Type   | Required | Description               |
| ------------- | ------ | -------- | ------------------------- |
| `title`       | string | ✅       | Task title                |
| `status`      | string | ✅       | Task status (column name) |
| `description` | string | ❌       | Task description          |
| `priority`    | string | ❌       | Task priority             |
| `dueDate`     | string | ❌       | Due date                  |
| `userId`      | string | ❌       | Assignee user ID          |

#### `update_task_status`

Update only the status of a task.

| Parameter | Type   | Required | Description              |
| --------- | ------ | -------- | ------------------------ |
| `id`      | string | ✅       | Task ID                  |
| `status`  | string | ✅       | New status (column name) |

#### `update_task_priority`

Update only the priority of a task.

| Parameter  | Type   | Required | Description                                              |
| ---------- | ------ | -------- | -------------------------------------------------------- |
| `id`       | string | ✅       | Task ID                                                  |
| `priority` | enum   | ✅       | `no-priority` \| `low` \| `medium` \| `high` \| `urgent` |

#### `update_task_assignee`

Assign or unassign a task to a user.

| Parameter | Type   | Required | Description                             |
| --------- | ------ | -------- | --------------------------------------- |
| `id`      | string | ✅       | Task ID                                 |
| `userId`  | string | ✅       | User ID (empty string `""` to unassign) |

#### `update_task_due_date`

Update only the due date of a task.

| Parameter | Type   | Required | Description             |
| --------- | ------ | -------- | ----------------------- |
| `id`      | string | ✅       | Task ID                 |
| `dueDate` | string | ✅       | New due date (ISO 8601) |

#### `update_task_title`

Update only the title of a task.

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `id`      | string | ✅       | Task ID     |
| `title`   | string | ✅       | New title   |

#### `update_task_description`

Update only the description of a task.

| Parameter     | Type   | Required | Description     |
| ------------- | ------ | -------- | --------------- |
| `id`          | string | ✅       | Task ID         |
| `description` | string | ✅       | New description |

---

### Columns (5 tools)

#### `get_columns`

Get all columns for a project (board columns / statuses).

| Parameter   | Type   | Required | Description |
| ----------- | ------ | -------- | ----------- |
| `projectId` | string | ✅       | Project ID  |

#### `create_column`

Create a new column in a project board.

| Parameter   | Type    | Required | Description                         |
| ----------- | ------- | -------- | ----------------------------------- |
| `projectId` | string  | ✅       | Project ID                          |
| `name`      | string  | ✅       | Column name                         |
| `icon`      | string  | ❌       | Column icon                         |
| `color`     | string  | ❌       | Column color                        |
| `isFinal`   | boolean | ❌       | Whether this is a final/done column |

#### `reorder_columns`

Reorder columns in a project board.

| Parameter   | Type   | Required | Description                                 |
| ----------- | ------ | -------- | ------------------------------------------- |
| `projectId` | string | ✅       | Project ID                                  |
| `columns`   | array  | ✅       | Array of `{ id: string, position: number }` |

#### `update_column`

Update a column's properties.

| Parameter | Type    | Required | Description                         |
| --------- | ------- | -------- | ----------------------------------- |
| `id`      | string  | ✅       | Column ID                           |
| `name`    | string  | ❌       | Column name                         |
| `icon`    | string  | ❌       | Column icon                         |
| `color`   | string  | ❌       | Column color                        |
| `isFinal` | boolean | ❌       | Whether this is a final/done column |

#### `delete_column`

Delete a column from a project board.

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `id`      | string | ✅       | Column ID   |

---

### Activities (5 tools)

#### `get_activities`

Get all activities (comments, status changes, etc.) for a specific task.

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `taskId`  | string | ✅       | Task ID     |

#### `create_activity`

Create a new activity (system-generated event) on a task.

| Parameter | Type   | Required | Description                                                                                                                                                                    |
| --------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `taskId`  | string | ✅       | Task ID                                                                                                                                                                        |
| `userId`  | string | ✅       | User ID                                                                                                                                                                        |
| `message` | string | ✅       | Activity message                                                                                                                                                               |
| `type`    | string | ✅       | Activity type: `comment`, `task`, `status_changed`, `priority_changed`, `unassigned`, `assignee_changed`, `due_date_changed`, `title_changed`, `description_changed`, `create` |

#### `create_comment`

Create a new comment on a task.

| Parameter | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| `taskId`  | string | ✅       | Task ID      |
| `comment` | string | ✅       | Comment text |

#### `update_comment`

Update an existing comment.

| Parameter    | Type   | Required | Description          |
| ------------ | ------ | -------- | -------------------- |
| `activityId` | string | ✅       | Activity/comment ID  |
| `comment`    | string | ✅       | Updated comment text |

#### `delete_comment`

Delete a comment from a task.

| Parameter | Type   | Required | Description         |
| --------- | ------ | -------- | ------------------- |
| `id`      | string | ✅       | Comment/activity ID |

---

### Time Entries (4 tools)

#### `get_task_time_entries`

Get all time entries for a specific task.

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `taskId`  | string | ✅       | Task ID     |

#### `get_time_entry`

Get a specific time entry by ID.

| Parameter | Type   | Required | Description   |
| --------- | ------ | -------- | ------------- |
| `id`      | string | ✅       | Time entry ID |

#### `create_time_entry`

Create a new time entry for a task.

| Parameter     | Type   | Required | Description              |
| ------------- | ------ | -------- | ------------------------ |
| `taskId`      | string | ✅       | Task ID                  |
| `startTime`   | string | ✅       | Start time (ISO 8601)    |
| `endTime`     | string | ❌       | End time (ISO 8601)      |
| `description` | string | ❌       | Description of work done |

#### `update_time_entry`

Update an existing time entry. Only supply fields you want to change.

| Parameter     | Type   | Required | Description              |
| ------------- | ------ | -------- | ------------------------ |
| `id`          | string | ✅       | Time entry ID            |
| `startTime`   | string | ❌       | Start time (ISO 8601)    |
| `endTime`     | string | ❌       | End time (ISO 8601)      |
| `description` | string | ❌       | Description of work done |

---

### Labels (6 tools)

#### `get_task_labels`

Get all labels assigned to a specific task.

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `taskId`  | string | ✅       | Task ID     |

#### `get_workspace_labels`

Get all labels for a specific workspace.

| Parameter     | Type   | Required | Description  |
| ------------- | ------ | -------- | ------------ |
| `workspaceId` | string | ✅       | Workspace ID |

#### `create_label`

Create a new label in a workspace (optionally attach to a task).

| Parameter     | Type   | Required | Description                    |
| ------------- | ------ | -------- | ------------------------------ |
| `name`        | string | ✅       | Label name                     |
| `color`       | string | ✅       | Label color (hex code)         |
| `workspaceId` | string | ✅       | Workspace ID                   |
| `taskId`      | string | ❌       | Task ID to attach the label to |

#### `get_label`

Get a specific label by ID.

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `id`      | string | ✅       | Label ID    |

#### `update_label`

Update an existing label.

| Parameter | Type   | Required | Description            |
| --------- | ------ | -------- | ---------------------- |
| `id`      | string | ✅       | Label ID               |
| `name`    | string | ❌       | Label name             |
| `color`   | string | ❌       | Label color (hex code) |

#### `delete_label`

Delete a label.

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `id`      | string | ✅       | Label ID    |

---

### Notifications (5 tools)

#### `list_notifications`

Get all notifications for the current user.

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| _(none)_  | —    | —        | —           |

#### `create_notification`

Create a new notification for a user.

| Parameter           | Type   | Required | Description                                                                                                       |
| ------------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `userId`            | string | ✅       | Target user ID                                                                                                    |
| `title`             | string | ✅       | Notification title                                                                                                |
| `message`           | string | ✅       | Notification message                                                                                              |
| `type`              | string | ❌       | `info`, `task_created`, `workspace_created`, `task_status_changed`, `task_assignee_changed`, `time_entry_created` |
| `relatedEntityId`   | string | ❌       | Related entity ID                                                                                                 |
| `relatedEntityType` | string | ❌       | Related entity type (`task`, `workspace`)                                                                         |

#### `mark_notification_read`

Mark a specific notification as read.

| Parameter | Type   | Required | Description     |
| --------- | ------ | -------- | --------------- |
| `id`      | string | ✅       | Notification ID |

#### `mark_all_notifications_read`

Mark all notifications as read for the current user.

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| _(none)_  | —    | —        | —           |

#### `clear_all_notifications`

Delete all notifications for the current user.

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| _(none)_  | —    | —        | —           |

---

### Search (1 tool)

#### `global_search`

Search across tasks, projects, workspaces, comments, and activities.

| Parameter     | Type   | Required | Description                                                                  |
| ------------- | ------ | -------- | ---------------------------------------------------------------------------- |
| `q`           | string | ✅       | Search query (minimum 1 character)                                           |
| `workspaceId` | string | ✅       | Workspace ID                                                                 |
| `type`        | enum   | ❌       | `all` \| `tasks` \| `projects` \| `workspaces` \| `comments` \| `activities` |
| `projectId`   | string | ❌       | Filter by project ID                                                         |
| `limit`       | number | ❌       | Maximum number of results                                                    |
| `userEmail`   | string | ❌       | Filter by user email                                                         |

---

### Workflow Rules (3 tools)

#### `get_workflow_rules`

Get all workflow rules for a project.

| Parameter   | Type   | Required | Description |
| ----------- | ------ | -------- | ----------- |
| `projectId` | string | ✅       | Project ID  |

#### `upsert_workflow_rule`

Create or update a workflow rule for a project.

| Parameter         | Type   | Required | Description      |
| ----------------- | ------ | -------- | ---------------- |
| `projectId`       | string | ✅       | Project ID       |
| `integrationType` | string | ✅       | Integration type |
| `eventType`       | string | ✅       | Event type       |
| `columnId`        | string | ✅       | Target column ID |

#### `delete_workflow_rule`

Delete a workflow rule.

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| `id`      | string | ✅       | Workflow rule ID |

---

## Usage Examples

### Example 1: User says "Show me all my projects"

First, you need a workspace ID. Use `get_config` or ask the user for their workspace ID, then:

```
Tool: list_projects
Arguments: { "workspaceId": "<WORKSPACE_ID>" }
```

Return a formatted summary: project names, IDs, descriptions, and any relevant metadata.

---

### Example 2: User says "Create a task called 'Fix login bug' in the Backend project"

**Step 1**: Find the project ID — use `list_projects` with the workspace ID, find the project named "Backend".

**Step 2**: Find the available columns — use `get_columns` with the project ID, pick the default starting column (e.g. "To Do").

**Step 3**: Create the task:

```
Tool: create_task
Arguments: {
  "projectId": "<BACKEND_PROJECT_ID>",
  "title": "Fix login bug",
  "status": "To Do"
}
```

Return confirmation with the new task ID.

---

### Example 3: User says "Move task ABC123 to Done"

```
Tool: update_task_status
Arguments: { "id": "ABC123", "status": "Done" }
```

---

### Example 4: User says "What's on my board for project X?"

**Step 1**: Get columns — `get_columns` with the project ID.

**Step 2**: Get tasks — `list_tasks` with the project ID.

**Step 3**: Return a formatted board view grouped by column:

```
📋 To Do (3)
  - Fix login bug [high] — due 2026-03-10
  - Add dark mode [medium]
  - Update docs [low]

🔄 In Progress (1)
  - Refactor auth module [urgent] — assigned to user@example.com

✅ Done (5)
  ...
```

---

### Example 5: User says "Log 2 hours of work on task ABC123"

Calculate start/end times based on current time and duration:

```
Tool: create_time_entry
Arguments: {
  "taskId": "ABC123",
  "startTime": "2026-03-08T06:00:00+08:00",
  "endTime": "2026-03-08T08:00:00+08:00",
  "description": "Development work"
}
```

---

### Example 6: User says "Search for anything related to authentication"

```
Tool: global_search
Arguments: {
  "q": "authentication",
  "workspaceId": "<WORKSPACE_ID>",
  "type": "all"
}
```

Return grouped results: matching tasks, projects, comments, and activities.

---

### Example 7: User says "Add a 'bug' label to task ABC123"

**Step 1**: Check if a "bug" label already exists — `get_workspace_labels` with workspace ID.

**Step 2a**: If it exists, use `create_label` with the existing label's name/color and the `taskId` to attach it.

**Step 2b**: If it doesn't exist, create a new one:

```
Tool: create_label
Arguments: {
  "name": "bug",
  "color": "#ef4444",
  "workspaceId": "<WORKSPACE_ID>",
  "taskId": "ABC123"
}
```

---

### Example 8: User says "Set up a new project for the mobile app"

```
Tool: create_project
Arguments: {
  "name": "Mobile App",
  "workspaceId": "<WORKSPACE_ID>",
  "icon": "📱"
}
```

Default columns (To Do, In Progress, Done) are usually auto-created. If custom columns are needed:

```
Tool: create_column
Arguments: { "projectId": "<NEW_PROJECT_ID>", "name": "Backlog" }
Tool: create_column
Arguments: { "projectId": "<NEW_PROJECT_ID>", "name": "In Review" }
Tool: create_column
Arguments: { "projectId": "<NEW_PROJECT_ID>", "name": "Released", "isFinal": true }
```

---

### Example 9: User says "Import these tasks into the project"

```
Tool: import_tasks
Arguments: {
  "projectId": "<PROJECT_ID>",
  "tasks": [
    { "title": "Design homepage", "status": "To Do", "priority": "high" },
    { "title": "Set up CI/CD", "status": "To Do", "priority": "medium" },
    { "title": "Write API docs", "status": "Backlog", "priority": "low" }
  ]
}
```

---

## Recommended Workflow

When a user mentions Kaneo-related work, follow this general pattern:

1. **Identify the workspace** — Ask the user or use a known workspace ID.
2. **Identify the project** — `list_projects` → match by name.
3. **Identify columns** — `get_columns` → understand the board structure.
4. **Perform the action** — Create/update/delete tasks, labels, time entries, etc.
5. **Confirm the result** — Return a clear, formatted confirmation.

### Common ID Resolution

| User Says            | Action                                                          |
| -------------------- | --------------------------------------------------------------- |
| A project name       | `list_projects` → find by name → use `id`                       |
| A task title         | `global_search` with `type: "tasks"` → find by title → use `id` |
| A column/status name | `get_columns` → find by name → use column `name` as status      |
| A label name         | `get_workspace_labels` → find by name → use `id`                |

---

## Notes

1. **All dates should use ISO 8601 format** — e.g. `2026-03-08T16:00:00+08:00`
2. **Status is a column name, not an ID** — Use the exact column name string (e.g. `"To Do"`, not the column ID)
3. **Use specific update tools when possible** — Prefer `update_task_status` over `update_task` when only changing status. This avoids the fetch-merge-PUT overhead.
4. **Columns determine the board** — Always check available columns before creating tasks or changing statuses.
5. **Labels are workspace-scoped** — Labels belong to workspaces, not projects. They can be attached to tasks across any project in the workspace.
6. **Time entries need ISO 8601 timestamps** — Not durations. Calculate start/end times from the user's intent.
7. **Comments vs Activities** — Use `create_comment` for user-facing comments. Use `create_activity` for system-level events with a specific `type`.
