---
name: kaneo
version: 1.0.0
description: >
  Manage Kaneo project management via CLI.
  Use when working with Kaneo tasks, projects, board columns, labels, time entries,
  comments, notifications, and workflow rules. Trigger on: "create task", "move task",
  "show board", "list projects", "add comment", "kaneo", "project management", "kanban".
---

# Kaneo Skill

## Credentials

```
API_URL:      <FILL_IN>
WORKSPACE_ID: <FILL_IN>
API_TOKEN:    <FILL_IN>
```

## Overview

Kaneo CLI wraps the Kaneo REST API into a single command. All calls return JSON to stdout, errors go to stderr with exit code 1.

```bash
kaneo <api-url> <workspace-id> <api-token> <function> [--arg=value ...]
```

The `workspace-id` positional arg is automatically available as `workspaceId` to any function that needs it — you don't need to pass `--workspaceId` separately.

### Helper

Always use this shorthand to call the CLI (substitute values from Credentials above):

```bash
kn() {
  kaneo "<API_URL>" "<WORKSPACE_ID>" "<API_TOKEN>" "$@"
}
```

Check for errors:

```bash
result=$(kn get_config)
if [ $? -ne 0 ]; then
  echo "Error: $result" >&2
fi
```

---

## Config

```bash
# Get app settings (registration, demo mode, SSO, SMTP, guest access)
kn get_config
```

---

## Projects

```bash
# List all projects in workspace
kn list_projects

# Create project (icon is required)
kn create_project --name="My Project" --icon="📋"
kn create_project --name="My Project" --icon="📋" --slug="my-project"

# Get project by ID
kn get_project --id=PROJECT_ID

# Update project (only pass fields you want to change)
kn update_project --id=PROJECT_ID --name="Renamed" --description="Updated desc"
kn update_project --id=PROJECT_ID --isPublic=true

# Delete project (irreversible)
kn delete_project --id=PROJECT_ID
```

---

## Columns (Board)

```bash
# Get all columns for a project
kn get_columns --projectId=PROJECT_ID

# Create column
kn create_column --projectId=PROJECT_ID --name="In Review"
kn create_column --projectId=PROJECT_ID --name="Done" --color="#22c55e" --isFinal=true

# Update column
kn update_column --id=COLUMN_ID --name="QA Review" --color="#3b82f6"

# Reorder columns (pass JSON array)
kn reorder_columns --projectId=PROJECT_ID \
  --columns='[{"id":"col1","position":0},{"id":"col2","position":1}]'

# Delete column
kn delete_column --id=COLUMN_ID
```

---

## Tasks

```bash
# List all tasks in a project (grouped by column)
kn list_tasks --projectId=PROJECT_ID

# Create task (title, status, and projectId are required)
kn create_task --projectId=PROJECT_ID --title="Fix login bug" --status="To Do"
kn create_task --projectId=PROJECT_ID \
  --title="Fix login bug" \
  --status="To Do" \
  --priority=high \
  --description="Users can't log in with SSO" \
  --dueDate="2026-03-15T00:00:00+08:00" \
  --userId=USER_ID

# Get task by ID
kn get_task --id=TASK_ID

# Update task (full update — only pass fields you want to change)
kn update_task --id=TASK_ID --title="Updated title" --priority=urgent

# Delete task
kn delete_task --id=TASK_ID

# Export all project tasks
kn export_tasks --projectId=PROJECT_ID

# Import tasks (JSON array)
kn import_tasks --projectId=PROJECT_ID \
  --tasks='[{"title":"Task 1","status":"To Do","priority":"high"},{"title":"Task 2","status":"Backlog"}]'
```

### Granular task updates

Prefer these over `update_task` when changing a single field — they're faster (no fetch-merge-PUT):

```bash
# Change status (must match a column name exactly)
kn update_task_status --id=TASK_ID --status="In Progress"
kn update_task_status --id=TASK_ID --status="Done"

# Change priority
kn update_task_priority --id=TASK_ID --priority=urgent

# Assign / unassign
kn update_task_assignee --id=TASK_ID --userId=USER_ID
kn update_task_assignee --id=TASK_ID --userId=""    # unassign

# Change due date
kn update_task_due_date --id=TASK_ID --dueDate="2026-04-01T00:00:00+08:00"

# Change title
kn update_task_title --id=TASK_ID --title="New title"

# Change description
kn update_task_description --id=TASK_ID --description="Updated description"
```

### Priority values

`no-priority`, `low`, `medium`, `high`, `urgent`

---

## Activities & Comments

```bash
# Get all activities for a task (comments, status changes, etc.)
kn get_activities --taskId=TASK_ID

# Add a comment
kn create_comment --taskId=TASK_ID --comment="Looks good, ship it!"

# Update a comment
kn update_comment --activityId=ACTIVITY_ID --comment="Updated comment text"

# Delete a comment
kn delete_comment --id=ACTIVITY_ID

# Create system activity (for automated events)
kn create_activity --taskId=TASK_ID --userId=USER_ID \
  --message="Status changed to Done" --type=status_changed
```

### Activity types

`comment`, `task`, `status_changed`, `priority_changed`, `unassigned`, `assignee_changed`, `due_date_changed`, `title_changed`, `description_changed`, `create`

---

## Time Entries

```bash
# Get time entries for a task
kn get_task_time_entries --taskId=TASK_ID

# Get single time entry
kn get_time_entry --id=ENTRY_ID

# Log time (startTime required, endTime optional for "running" timers)
kn create_time_entry --taskId=TASK_ID \
  --startTime="2026-03-08T14:00:00+08:00" \
  --endTime="2026-03-08T16:00:00+08:00" \
  --description="Bug fixing"

# Update time entry (only pass fields you want to change)
kn update_time_entry --id=ENTRY_ID --description="Updated description"
```

All times must be **ISO 8601** format, e.g. `2026-03-08T16:00:00+08:00`.

---

## Labels

```bash
# Get all labels in the workspace
kn get_workspace_labels

# Get labels on a specific task
kn get_task_labels --taskId=TASK_ID

# Create label (optionally attach to a task)
kn create_label --name="bug" --color="#ef4444"
kn create_label --name="bug" --color="#ef4444" --taskId=TASK_ID

# Get label by ID
kn get_label --id=LABEL_ID

# Update label
kn update_label --id=LABEL_ID --name="critical-bug" --color="#dc2626"

# Delete label
kn delete_label --id=LABEL_ID
```

Labels are **workspace-scoped** — they can be shared across all projects.

---

## Notifications

```bash
# Get all notifications
kn list_notifications

# Create notification for a user
kn create_notification --userId=USER_ID --title="Task assigned" \
  --message="You've been assigned to Fix login bug" \
  --type=task_assignee_changed \
  --relatedEntityId=TASK_ID --relatedEntityType=task

# Mark one as read
kn mark_notification_read --id=NOTIFICATION_ID

# Mark all as read
kn mark_all_notifications_read

# Clear all notifications
kn clear_all_notifications
```

### Notification types

`info`, `task_created`, `workspace_created`, `task_status_changed`, `task_assignee_changed`, `time_entry_created`

---

## Search

```bash
# Search across everything
kn global_search --q="authentication"

# Search specific type
kn global_search --q="login" --type=tasks

# Search with filters
kn global_search --q="bug" --type=tasks --projectId=PROJECT_ID --limit=10
```

### Search types

`all`, `tasks`, `projects`, `workspaces`, `comments`, `activities`

---

## Workflow Rules

```bash
# Get rules for a project
kn get_workflow_rules --projectId=PROJECT_ID

# Create / update a workflow rule
kn upsert_workflow_rule --projectId=PROJECT_ID \
  --integrationType=github \
  --eventType=pull_request_merged \
  --columnId=COLUMN_ID

# Delete a workflow rule
kn delete_workflow_rule --id=RULE_ID
```

---

## Agent Workflow

When operating autonomously, follow this loop to process tasks assigned to you:

### 1. Discover your tasks

```bash
# Search for tasks assigned to you (use your user email)
kn global_search --q="" --type=tasks --userEmail=YOUR_EMAIL

# Or list all tasks in a project and filter by assignee
kn list_tasks --projectId=PROJECT_ID
# → look for tasks where userId matches your user ID
```

### 2. Pick a task and start working

```bash
# Read the task details
task=$(kn get_task --id=TASK_ID)

# Read any existing comments/context
kn get_activities --taskId=TASK_ID

# Move to In Progress
kn update_task_status --id=TASK_ID --status="In Progress"

# Leave a comment that you've started
kn create_comment --taskId=TASK_ID --comment="Starting work on this task"
```

### 3. Do the work

Carry out whatever the task describes — write code, create files, run commands, etc.

### 4. Report progress

```bash
# Comment with what you did
kn create_comment --taskId=TASK_ID --comment="Implemented the feature. Changes: ..."

# Log time if applicable
kn create_time_entry --taskId=TASK_ID \
  --startTime="2026-03-08T09:00:00+08:00" \
  --endTime="2026-03-08T11:00:00+08:00" \
  --description="Implementation work"
```

### 5. Move to next stage

```bash
# Move to review / done depending on the board setup
kn update_task_status --id=TASK_ID --status="In Review"
kn create_comment --taskId=TASK_ID --comment="Ready for review"

# Or if complete:
kn update_task_status --id=TASK_ID --status="Done"
kn create_comment --taskId=TASK_ID --comment="Task completed"
```

### 6. Pick the next task

Repeat from step 1. Prioritize by:

1. `urgent` priority tasks first
2. `high` priority next
3. Tasks with the nearest `dueDate`
4. `medium` then `low` last

---

## Common Workflows

### Set up a new project with custom columns

```bash
# 1. Create the project
project_id=$(kn create_project --name="Sprint 1" --icon="🚀" | jq -r '.id')

# 2. Add custom columns
kn create_column --projectId=$project_id --name="Backlog"
kn create_column --projectId=$project_id --name="In Progress"
kn create_column --projectId=$project_id --name="In Review"
kn create_column --projectId=$project_id --name="Done" --isFinal=true

# 3. Verify
kn get_columns --projectId=$project_id
```

### Create a task and track time

```bash
# 1. Find the project
project_id=$(kn list_projects | jq -r '.[] | select(.name=="Sprint 1") | .id')

# 2. Check available columns
kn get_columns --projectId=$project_id | jq '.[].name'

# 3. Create the task
task_id=$(kn create_task --projectId=$project_id \
  --title="Implement OAuth" --status="To Do" --priority=high | jq -r '.id')

# 4. Log time
kn create_time_entry --taskId=$task_id \
  --startTime="2026-03-08T09:00:00+08:00" \
  --endTime="2026-03-08T11:30:00+08:00" \
  --description="Initial implementation"

# 5. Move to In Progress
kn update_task_status --id=$task_id --status="In Progress"
```

### Move task through workflow

```bash
task_id=TASK_ID

# Move through stages
kn update_task_status --id=$task_id --status="In Progress"
kn create_comment --taskId=$task_id --comment="Started working on this"

kn update_task_status --id=$task_id --status="In Review"
kn create_comment --taskId=$task_id --comment="Ready for review"

kn update_task_status --id=$task_id --status="Done"
```

### Bulk import tasks from a sprint plan

```bash
project_id=PROJECT_ID
kn import_tasks --projectId=$project_id --tasks='[
  {"title": "Design homepage", "status": "To Do", "priority": "high"},
  {"title": "Set up CI/CD", "status": "To Do", "priority": "medium"},
  {"title": "Write API docs", "status": "Backlog", "priority": "low"},
  {"title": "Auth integration", "status": "To Do", "priority": "urgent"}
]'
```

### Get a board overview

```bash
project_id=PROJECT_ID

# Get columns and tasks
columns=$(kn get_columns --projectId=$project_id)
tasks=$(kn list_tasks --projectId=$project_id)

# Display as JSON
echo "$tasks" | jq '.'
```

---

## Notes

- **Status = column name** — use the exact column name string (e.g. `"To Do"`, not a column ID)
- **No null values** — Kaneo rejects `null` in request bodies; use `""` to clear a field
- **icon is required** for `create_project` — use an emoji like `"📋"`
- **userId is required** for `create_activity` and `update_task_assignee`
- **workspaceId is auto-injected** from the positional arg; no need to pass `--workspaceId`
- **PUT endpoints auto-merge** — `update_project`, `update_task`, and `update_time_entry` fetch the current resource first, so you only need to pass changed fields
- **All dates use ISO 8601** — e.g. `2026-03-08T16:00:00+08:00`
- **Output is always JSON** — pipe through `jq` for formatting or field extraction
