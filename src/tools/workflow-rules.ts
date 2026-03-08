import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { KaneoClient } from "../client.js";

export function registerWorkflowRuleTools(
  server: McpServer,
  client: KaneoClient,
) {
  server.tool(
    "get_workflow_rules",
    "Get all workflow rules for a project",
    {
      projectId: z.string().describe("Project ID"),
    },
    async ({ projectId }) => {
      const data = await client.get(
        `/api/workflow-rule/${encodeURIComponent(projectId)}`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "upsert_workflow_rule",
    "Create or update a workflow rule for a project",
    {
      projectId: z.string().describe("Project ID"),
      integrationType: z.string().describe("Integration type"),
      eventType: z.string().describe("Event type"),
      columnId: z.string().describe("Target column ID"),
    },
    async ({ projectId, ...body }) => {
      const data = await client.put(
        `/api/workflow-rule/${encodeURIComponent(projectId)}`,
        body,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "delete_workflow_rule",
    "Delete a workflow rule",
    {
      id: z.string().describe("Workflow rule ID"),
    },
    async ({ id }) => {
      const data = await client.delete(
        `/api/workflow-rule/${encodeURIComponent(id)}`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
