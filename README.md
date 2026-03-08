# kaneo-mcp

MCP server for [Kaneo](https://kaneo.app). Gives AI assistants access to your Kaneo workspace — manage projects, tasks, columns, labels, time entries, and more.

## Quick Start

Add to your MCP client config (Claude Desktop, Cursor, etc.):

```json
{
  "mcpServers": {
    "kaneo": {
      "command": "npx",
      "args": ["-y", "github:zhanmu-tw/kaneo-mcp"],
      "env": {
        "KANEO_API_URL": "https://kaneo.yourdomain.com",
        "KANEO_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

That's it — `npx` handles install and build automatically.

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

## Development

```bash
git clone https://github.com/zhanmu-tw/kaneo-mcp.git
cd kaneo-mcp
npm install
npm run build
npm run dev    # watch mode
```

## Testing

```bash
cp .env.example .env   # fill in your values
npm test
```

Runs the full end-to-end test suite against your Kaneo instance (44 tests). Creates temporary resources and cleans them up.

## License

MIT
