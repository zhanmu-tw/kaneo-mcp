import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { KaneoClient } from "../client.js";

export function registerColumnTools(server: McpServer, client: KaneoClient) {
  server.tool(
    "get_columns",
    "Get all columns for a project (board columns / statuses)",
    {
      projectId: z.string().describe("Project ID"),
    },
    async ({ projectId }) => {
      const data = await client.get(
        `/api/column/${encodeURIComponent(projectId)}`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "create_column",
    "Create a new column in a project board",
    {
      projectId: z.string().describe("Project ID"),
      name: z.string().describe("Column name"),
      icon: z.string().optional().describe("Column icon"),
      color: z.string().optional().describe("Column color"),
      isFinal: z
        .boolean()
        .optional()
        .describe("Whether this is a final/done column"),
    },
    async ({ projectId, ...body }) => {
      const data = await client.post(
        `/api/column/${encodeURIComponent(projectId)}`,
        body,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "reorder_columns",
    "Reorder columns in a project board",
    {
      projectId: z.string().describe("Project ID"),
      columns: z
        .array(
          z.object({
            id: z.string().describe("Column ID"),
            position: z.number().describe("New position"),
          }),
        )
        .describe("Array of column IDs with their new positions"),
    },
    async ({ projectId, columns }) => {
      const data = await client.put(
        `/api/column/reorder/${encodeURIComponent(projectId)}`,
        {
          columns,
        },
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "update_column",
    "Update a column's properties",
    {
      id: z.string().describe("Column ID"),
      name: z.string().optional().describe("Column name"),
      icon: z.string().optional().describe("Column icon"),
      color: z.string().optional().describe("Column color"),
      isFinal: z
        .boolean()
        .optional()
        .describe("Whether this is a final/done column"),
    },
    async ({ id, ...body }) => {
      const data = await client.put(
        `/api/column/${encodeURIComponent(id)}`,
        body,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "delete_column",
    "Delete a column from a project board",
    {
      id: z.string().describe("Column ID"),
    },
    async ({ id }) => {
      const data = await client.delete(`/api/column/${encodeURIComponent(id)}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
