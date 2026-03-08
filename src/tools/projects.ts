import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { KaneoClient } from "../client.js";

export function registerProjectTools(server: McpServer, client: KaneoClient) {
  server.tool(
    "list_projects",
    "List all projects in a workspace",
    {
      workspaceId: z.string().describe("Workspace ID"),
    },
    async ({ workspaceId }) => {
      const data = await client.get(
        `/api/project?workspaceId=${encodeURIComponent(workspaceId)}`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "create_project",
    "Create a new project in a workspace",
    {
      name: z.string().describe("Project name"),
      workspaceId: z.string().describe("Workspace ID"),
      icon: z.string().describe("Project icon (emoji or icon identifier)"),
      slug: z.string().optional().describe("Project slug"),
    },
    async ({ name, workspaceId, icon, slug }) => {
      const body: Record<string, unknown> = { name, workspaceId, icon };
      if (slug) body.slug = slug;
      const data = await client.post("/api/project", body);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "get_project",
    "Get a specific project by ID",
    {
      id: z.string().describe("Project ID"),
      workspaceId: z.string().optional().describe("Workspace ID"),
    },
    async ({ id, workspaceId }) => {
      let path = `/api/project/${encodeURIComponent(id)}`;
      if (workspaceId)
        path += `?workspaceId=${encodeURIComponent(workspaceId)}`;
      const data = await client.get(path);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "update_project",
    "Update an existing project. All fields are required — omitted fields will keep their current values.",
    {
      id: z.string().describe("Project ID"),
      workspaceId: z.string().describe("Workspace ID"),
      name: z.string().optional().describe("Project name"),
      icon: z.string().optional().describe("Project icon"),
      slug: z.string().optional().describe("Project slug"),
      description: z.string().optional().describe("Project description"),
      isPublic: z
        .boolean()
        .optional()
        .describe("Whether the project is public"),
    },
    async ({ id, workspaceId, ...updates }) => {
      // Kaneo API requires all fields in PUT — fetch current then merge
      const current = (await client.get(
        `/api/project/${encodeURIComponent(id)}?workspaceId=${encodeURIComponent(workspaceId)}`,
      )) as Record<string, unknown>;
      const body = {
        name: updates.name ?? current.name,
        icon: updates.icon ?? current.icon,
        slug: updates.slug ?? current.slug,
        description: updates.description ?? current.description ?? "",
        isPublic: updates.isPublic ?? current.isPublic ?? false,
      };
      const data = await client.put(
        `/api/project/${encodeURIComponent(id)}`,
        body,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "delete_project",
    "Delete a project by ID",
    {
      id: z.string().describe("Project ID"),
    },
    async ({ id }) => {
      const data = await client.delete(
        `/api/project/${encodeURIComponent(id)}`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
