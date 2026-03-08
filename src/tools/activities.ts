import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { KaneoClient } from "../client.js";

export function registerActivityTools(server: McpServer, client: KaneoClient) {
  server.tool(
    "get_activities",
    "Get all activities (comments, status changes, etc.) for a specific task",
    {
      taskId: z.string().describe("Task ID"),
    },
    async ({ taskId }) => {
      const data = await client.get(
        `/api/activity/${encodeURIComponent(taskId)}`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "create_activity",
    "Create a new activity (system-generated event) on a task",
    {
      taskId: z.string().describe("Task ID"),
      userId: z.string().describe("User ID"),
      message: z.string().describe("Activity message"),
      type: z
        .string()
        .describe(
          "Activity type (comment, task, status_changed, priority_changed, unassigned, assignee_changed, due_date_changed, title_changed, description_changed, create)",
        ),
    },
    async (args) => {
      const data = await client.post("/api/activity/create", args);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "create_comment",
    "Create a new comment on a task",
    {
      taskId: z.string().describe("Task ID"),
      comment: z.string().describe("Comment text"),
    },
    async (args) => {
      const data = await client.post("/api/activity/comment", args);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "update_comment",
    "Update an existing comment",
    {
      activityId: z.string().describe("Activity/comment ID"),
      comment: z.string().describe("Updated comment text"),
    },
    async (args) => {
      const data = await client.put("/api/activity/comment", args);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "delete_comment",
    "Delete a comment from a task",
    {
      id: z.string().describe("Comment/activity ID"),
    },
    async ({ id }) => {
      const data = await client.delete(
        `/api/activity/comment/${encodeURIComponent(id)}`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
