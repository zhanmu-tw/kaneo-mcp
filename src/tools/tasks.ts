import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { KaneoClient } from "../client.js";

const PriorityEnum = z
  .enum(["no-priority", "low", "medium", "high", "urgent"])
  .optional()
  .describe("Task priority");

export function registerTaskTools(server: McpServer, client: KaneoClient) {
  server.tool(
    "list_tasks",
    "List all tasks for a specific project, organized by columns",
    {
      projectId: z.string().describe("Project ID"),
    },
    async ({ projectId }) => {
      const data = await client.get(
        `/api/task/tasks/${encodeURIComponent(projectId)}`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "create_task",
    "Create a new task in a project",
    {
      projectId: z.string().describe("Project ID"),
      title: z.string().describe("Task title"),
      description: z.string().optional().describe("Task description"),
      priority: PriorityEnum,
      status: z.string().describe("Task status (column name) — required"),
      dueDate: z.string().optional().describe("Due date (ISO 8601 string)"),
      userId: z.string().optional().describe("Assignee user ID"),
    },
    async ({ projectId, ...body }) => {
      const data = await client.post(
        `/api/task/${encodeURIComponent(projectId)}`,
        body,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "get_task",
    "Get a specific task by ID",
    {
      id: z.string().describe("Task ID"),
    },
    async ({ id }) => {
      const data = await client.get(`/api/task/${encodeURIComponent(id)}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "update_task",
    "Update all fields of a task",
    {
      id: z.string().describe("Task ID"),
      title: z.string().optional().describe("Task title"),
      description: z.string().optional().describe("Task description"),
      priority: PriorityEnum,
      status: z.string().optional().describe("Task status"),
      projectId: z
        .string()
        .optional()
        .describe("Project ID (to move task between projects)"),
      position: z.number().optional().describe("Task position within column"),
      dueDate: z.string().optional().describe("Due date (ISO 8601 string)"),
      userId: z.string().optional().describe("Assignee user ID"),
    },
    async ({ id, ...updates }) => {
      // Kaneo API requires all fields in PUT — fetch current then merge
      const current = (await client.get(
        `/api/task/${encodeURIComponent(id)}`,
      )) as Record<string, unknown>;
      const body = {
        title: updates.title ?? current.title,
        description: updates.description ?? current.description ?? "",
        priority: updates.priority ?? current.priority ?? "no-priority",
        status: updates.status ?? current.status,
        projectId: updates.projectId ?? current.projectId,
        position: updates.position ?? current.position ?? 0,
        dueDate: updates.dueDate ?? (current.dueDate || ""),
        userId: updates.userId ?? (current.userId || ""),
      };
      const data = await client.put(
        `/api/task/${encodeURIComponent(id)}`,
        body,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "delete_task",
    "Delete a task by ID",
    {
      id: z.string().describe("Task ID"),
    },
    async ({ id }) => {
      const data = await client.delete(`/api/task/${encodeURIComponent(id)}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "export_tasks",
    "Export all tasks from a project",
    {
      projectId: z.string().describe("Project ID"),
    },
    async ({ projectId }) => {
      const data = await client.get(
        `/api/task/export/${encodeURIComponent(projectId)}`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "import_tasks",
    "Import multiple tasks into a project",
    {
      projectId: z.string().describe("Project ID"),
      tasks: z
        .array(
          z.object({
            title: z.string().describe("Task title"),
            status: z.string().describe("Task status (column name)"),
            description: z.string().optional().describe("Task description"),
            priority: z.string().optional().describe("Task priority"),
            dueDate: z.string().optional().describe("Due date"),
            userId: z.string().optional().describe("Assignee user ID"),
          }),
        )
        .describe("Array of tasks to import"),
    },
    async ({ projectId, tasks }) => {
      const data = await client.post(
        `/api/task/import/${encodeURIComponent(projectId)}`,
        { tasks },
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "update_task_status",
    "Update only the status of a task",
    {
      id: z.string().describe("Task ID"),
      status: z.string().describe("New status (column name)"),
    },
    async ({ id, status }) => {
      const data = await client.put(
        `/api/task/status/${encodeURIComponent(id)}`,
        { status },
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "update_task_priority",
    "Update only the priority of a task",
    {
      id: z.string().describe("Task ID"),
      priority: z
        .enum(["no-priority", "low", "medium", "high", "urgent"])
        .describe("New priority"),
    },
    async ({ id, priority }) => {
      const data = await client.put(
        `/api/task/priority/${encodeURIComponent(id)}`,
        { priority },
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "update_task_assignee",
    "Assign or unassign a task to a user",
    {
      id: z.string().describe("Task ID"),
      userId: z
        .string()
        .describe("User ID to assign (empty string to unassign)"),
    },
    async ({ id, userId }) => {
      const data = await client.put(
        `/api/task/assignee/${encodeURIComponent(id)}`,
        { userId },
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "update_task_due_date",
    "Update only the due date of a task",
    {
      id: z.string().describe("Task ID"),
      dueDate: z.string().describe("New due date (ISO 8601 string)"),
    },
    async ({ id, dueDate }) => {
      const data = await client.put(
        `/api/task/due-date/${encodeURIComponent(id)}`,
        { dueDate },
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "update_task_title",
    "Update only the title of a task",
    {
      id: z.string().describe("Task ID"),
      title: z.string().describe("New title"),
    },
    async ({ id, title }) => {
      const data = await client.put(
        `/api/task/title/${encodeURIComponent(id)}`,
        { title },
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.tool(
    "update_task_description",
    "Update only the description of a task",
    {
      id: z.string().describe("Task ID"),
      description: z.string().describe("New description"),
    },
    async ({ id, description }) => {
      const data = await client.put(
        `/api/task/description/${encodeURIComponent(id)}`,
        { description },
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
