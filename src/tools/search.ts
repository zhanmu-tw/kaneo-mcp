import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { KaneoClient } from "../client.js";

export function registerSearchTools(server: McpServer, client: KaneoClient) {
  server.tool(
    "global_search",
    "Search across tasks, projects, workspaces, comments, and activities",
    {
      q: z.string().describe("Search query (minimum 1 character)"),
      type: z
        .enum([
          "all",
          "tasks",
          "projects",
          "workspaces",
          "comments",
          "activities",
        ])
        .optional()
        .describe("Type of results to return (default: all)"),
      workspaceId: z.string().describe("Workspace ID (required for search)"),
      projectId: z.string().optional().describe("Filter by project ID"),
      limit: z.number().optional().describe("Maximum number of results"),
      userEmail: z.string().optional().describe("Filter by user email"),
    },
    async ({ q, type, workspaceId, projectId, limit, userEmail }) => {
      const params = new URLSearchParams({ q });
      if (type) params.set("type", type);
      if (workspaceId) params.set("workspaceId", workspaceId);
      if (projectId) params.set("projectId", projectId);
      if (limit !== undefined) params.set("limit", String(limit));
      if (userEmail) params.set("userEmail", userEmail);
      const data = await client.get(`/api/search?${params.toString()}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
