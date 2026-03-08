import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { KaneoClient } from "../client.js";

export function registerLabelTools(server: McpServer, client: KaneoClient) {
  server.tool(
    "get_task_labels",
    "Get all labels assigned to a specific task",
    {
      taskId: z.string().describe("Task ID"),
    },
    async ({ taskId }) => {
      const data = await client.get(
        `/api/label/task/${encodeURIComponent(taskId)}`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "get_workspace_labels",
    "Get all labels for a specific workspace",
    {
      workspaceId: z.string().describe("Workspace ID"),
    },
    async ({ workspaceId }) => {
      const data = await client.get(
        `/api/label/workspace/${encodeURIComponent(workspaceId)}`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "create_label",
    "Create a new label in a workspace (optionally attach to a task)",
    {
      name: z.string().describe("Label name"),
      color: z.string().describe("Label color (hex code)"),
      workspaceId: z.string().describe("Workspace ID"),
      taskId: z.string().optional().describe("Task ID to attach the label to"),
    },
    async (args) => {
      const data = await client.post("/api/label", args);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "get_label",
    "Get a specific label by ID",
    {
      id: z.string().describe("Label ID"),
    },
    async ({ id }) => {
      const data = await client.get(`/api/label/${encodeURIComponent(id)}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "update_label",
    "Update an existing label",
    {
      id: z.string().describe("Label ID"),
      name: z.string().optional().describe("Label name"),
      color: z.string().optional().describe("Label color (hex code)"),
    },
    async ({ id, ...body }) => {
      const data = await client.put(
        `/api/label/${encodeURIComponent(id)}`,
        body,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "delete_label",
    "Delete a label",
    {
      id: z.string().describe("Label ID"),
    },
    async ({ id }) => {
      const data = await client.delete(`/api/label/${encodeURIComponent(id)}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
