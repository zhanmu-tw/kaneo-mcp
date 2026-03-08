import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { KaneoClient } from "../client.js";

export function registerNotificationTools(
  server: McpServer,
  client: KaneoClient,
) {
  server.tool(
    "list_notifications",
    "Get all notifications for the current user",
    {},
    async () => {
      const data = await client.get("/api/notification");
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "create_notification",
    "Create a new notification for a user",
    {
      userId: z.string().describe("Target user ID"),
      title: z.string().describe("Notification title"),
      message: z.string().describe("Notification message"),
      type: z
        .string()
        .optional()
        .describe(
          "Notification type (info, task_created, workspace_created, task_status_changed, task_assignee_changed, time_entry_created)",
        ),
      relatedEntityId: z.string().optional().describe("Related entity ID"),
      relatedEntityType: z
        .string()
        .optional()
        .describe("Related entity type (task, workspace)"),
    },
    async (args) => {
      const data = await client.post("/api/notification", args);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "mark_notification_read",
    "Mark a specific notification as read",
    {
      id: z.string().describe("Notification ID"),
    },
    async ({ id }) => {
      const data = await client.patch(
        `/api/notification/${encodeURIComponent(id)}/read`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "mark_all_notifications_read",
    "Mark all notifications as read for the current user",
    {},
    async () => {
      const data = await client.patch("/api/notification/read-all");
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "clear_all_notifications",
    "Delete all notifications for the current user",
    {},
    async () => {
      const data = await client.delete("/api/notification/clear-all");
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
