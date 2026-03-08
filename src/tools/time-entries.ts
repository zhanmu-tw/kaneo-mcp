import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { KaneoClient } from "../client.js";

export function registerTimeEntryTools(server: McpServer, client: KaneoClient) {
  server.tool(
    "get_task_time_entries",
    "Get all time entries for a specific task",
    {
      taskId: z.string().describe("Task ID"),
    },
    async ({ taskId }) => {
      const data = await client.get(
        `/api/time-entry/task/${encodeURIComponent(taskId)}`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "get_time_entry",
    "Get a specific time entry by ID",
    {
      id: z.string().describe("Time entry ID"),
    },
    async ({ id }) => {
      const data = await client.get(
        `/api/time-entry/${encodeURIComponent(id)}`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "create_time_entry",
    "Create a new time entry for a task",
    {
      taskId: z.string().describe("Task ID"),
      startTime: z.string().describe("Start time (ISO 8601 string)"),
      endTime: z.string().optional().describe("End time (ISO 8601 string)"),
      description: z.string().optional().describe("Description of work done"),
    },
    async (args) => {
      const data = await client.post("/api/time-entry", args);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "update_time_entry",
    "Update an existing time entry",
    {
      id: z.string().describe("Time entry ID"),
      startTime: z.string().optional().describe("Start time (ISO 8601 string)"),
      endTime: z.string().optional().describe("End time (ISO 8601 string)"),
      description: z.string().optional().describe("Description of work done"),
    },
    async ({ id, ...updates }) => {
      // Kaneo API requires all fields in PUT — fetch current then merge
      const current = (await client.get(
        `/api/time-entry/${encodeURIComponent(id)}`,
      )) as Record<string, unknown>;
      const body = {
        startTime: updates.startTime ?? current.startTime,
        endTime: updates.endTime ?? current.endTime ?? "",
        description: updates.description ?? current.description ?? "",
      };
      const data = await client.put(
        `/api/time-entry/${encodeURIComponent(id)}`,
        body,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
