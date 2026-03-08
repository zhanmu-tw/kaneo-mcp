import type { ToolFn } from "../registry.js";

export const taskTools: Record<string, ToolFn> = {
  list_tasks: async (client, args) => {
    return client.get(`/api/task/tasks/${encodeURIComponent(args.projectId)}`);
  },

  create_task: async (client, args) => {
    const body: Record<string, unknown> = {
      title: args.title,
      status: args.status,
    };
    if (args.description) body.description = args.description;
    if (args.priority) body.priority = args.priority;
    if (args.dueDate) body.dueDate = args.dueDate;
    if (args.userId) body.userId = args.userId;
    return client.post(`/api/task/${encodeURIComponent(args.projectId)}`, body);
  },

  get_task: async (client, args) => {
    return client.get(`/api/task/${encodeURIComponent(args.id)}`);
  },

  update_task: async (client, args) => {
    const current = (await client.get(
      `/api/task/${encodeURIComponent(args.id)}`,
    )) as Record<string, unknown>;
    const body = {
      title: args.title ?? current.title,
      description: args.description ?? current.description ?? "",
      priority: args.priority ?? current.priority ?? "no-priority",
      status: args.status ?? current.status,
      projectId: args.projectId ?? current.projectId,
      position:
        args.position !== undefined
          ? Number(args.position)
          : (current.position ?? 0),
      dueDate: args.dueDate ?? ((current.dueDate as string) || ""),
      userId: args.userId ?? ((current.userId as string) || ""),
    };
    return client.put(`/api/task/${encodeURIComponent(args.id)}`, body);
  },

  delete_task: async (client, args) => {
    return client.delete(`/api/task/${encodeURIComponent(args.id)}`);
  },

  export_tasks: async (client, args) => {
    return client.get(`/api/task/export/${encodeURIComponent(args.projectId)}`);
  },

  import_tasks: async (client, args) => {
    const tasks = JSON.parse(args.tasks);
    return client.post(
      `/api/task/import/${encodeURIComponent(args.projectId)}`,
      { tasks },
    );
  },

  update_task_status: async (client, args) => {
    return client.put(`/api/task/status/${encodeURIComponent(args.id)}`, {
      status: args.status,
    });
  },

  update_task_priority: async (client, args) => {
    return client.put(`/api/task/priority/${encodeURIComponent(args.id)}`, {
      priority: args.priority,
    });
  },

  update_task_assignee: async (client, args) => {
    return client.put(`/api/task/assignee/${encodeURIComponent(args.id)}`, {
      userId: args.userId,
    });
  },

  update_task_due_date: async (client, args) => {
    return client.put(`/api/task/due-date/${encodeURIComponent(args.id)}`, {
      dueDate: args.dueDate,
    });
  },

  update_task_title: async (client, args) => {
    return client.put(`/api/task/title/${encodeURIComponent(args.id)}`, {
      title: args.title,
    });
  },

  update_task_description: async (client, args) => {
    return client.put(`/api/task/description/${encodeURIComponent(args.id)}`, {
      description: args.description,
    });
  },
};
