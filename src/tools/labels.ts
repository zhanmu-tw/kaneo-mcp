import type { ToolFn } from "../registry.js";

export const labelTools: Record<string, ToolFn> = {
  get_task_labels: async (client, args) => {
    return client.get(`/api/label/task/${encodeURIComponent(args.taskId)}`);
  },

  get_workspace_labels: async (client, args) => {
    return client.get(
      `/api/label/workspace/${encodeURIComponent(args.workspaceId)}`,
    );
  },

  create_label: async (client, args) => {
    const body: Record<string, unknown> = {
      name: args.name,
      color: args.color,
      workspaceId: args.workspaceId,
    };
    if (args.taskId) body.taskId = args.taskId;
    return client.post("/api/label", body);
  },

  get_label: async (client, args) => {
    return client.get(`/api/label/${encodeURIComponent(args.id)}`);
  },

  update_label: async (client, args) => {
    const body: Record<string, unknown> = {};
    if (args.name) body.name = args.name;
    if (args.color) body.color = args.color;
    return client.put(`/api/label/${encodeURIComponent(args.id)}`, body);
  },

  delete_label: async (client, args) => {
    return client.delete(`/api/label/${encodeURIComponent(args.id)}`);
  },
};
