# kaneo-mcp

MCP server for the [Kaneo](https://kaneo.app) project management API. Gives AI assistants access to your Kaneo workspace — manage projects, tasks, columns, labels, time entries, and more.

## Setup

```bash
git clone https://github.com/your-org/kaneo-mcp.git
cd kaneo-mcp
npm install
npm run build
```

## Configuration

Copy `.env.example` to `.env` and fill in your values:

```
KANEO_API_URL=https://kaneo.yourdomain.com
KANEO_API_TOKEN=your-api-token
KANEO_WORKSPACE_ID=your-workspace-id
```

`KANEO_WORKSPACE_ID` is only needed for running tests.

## Usage

Add to your MCP client config (Claude Desktop, Cursor, etc.):

```json
{
  "mcpServers": {
    "kaneo": {
      "command": "node",
      "args": ["/absolute/path/to/kaneo-mcp/dist/index.js"],
      "env": {
        "KANEO_API_URL": "https://kaneo.yourdomain.com",
        "KANEO_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

## Tools (48)

| Category       | Count | Tools                                                                                                                                                                                                                                   |
| -------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Config         | 1     | `get_config`                                                                                                                                                                                                                            |
| Projects       | 5     | `list_projects` `create_project` `get_project` `update_project` `delete_project`                                                                                                                                                        |
| Tasks          | 13    | `list_tasks` `create_task` `get_task` `update_task` `delete_task` `export_tasks` `import_tasks` `update_task_status` `update_task_priority` `update_task_assignee` `update_task_due_date` `update_task_title` `update_task_description` |
| Columns        | 5     | `get_columns` `create_column` `reorder_columns` `update_column` `delete_column`                                                                                                                                                         |
| Activities     | 5     | `get_activities` `create_activity` `create_comment` `update_comment` `delete_comment`                                                                                                                                                   |
| Time Entries   | 4     | `get_task_time_entries` `get_time_entry` `create_time_entry` `update_time_entry`                                                                                                                                                        |
| Labels         | 6     | `get_task_labels` `get_workspace_labels` `create_label` `get_label` `update_label` `delete_label`                                                                                                                                       |
| Notifications  | 5     | `list_notifications` `create_notification` `mark_notification_read` `mark_all_notifications_read` `clear_all_notifications`                                                                                                             |
| Search         | 1     | `global_search`                                                                                                                                                                                                                         |
| Workflow Rules | 3     | `get_workflow_rules` `upsert_workflow_rule` `delete_workflow_rule`                                                                                                                                                                      |

## Testing

```bash
npm test
```

Runs the full end-to-end test suite against your Kaneo instance. Requires all three `.env` vars to be set. Creates temporary resources and cleans them up.

## Development

```bash
npm run dev    # watch mode
npm run build  # compile
npm start      # run server
```

## License

MIT
