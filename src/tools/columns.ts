import type { ToolFn } from "../registry.js";

export const columnTools: Record<string, ToolFn> = {
  get_columns: async (client, args) => {
    return client.get(`/api/column/${encodeURIComponent(args.projectId)}`);
  },

  create_column: async (client, args) => {
    const body: Record<string, unknown> = { name: args.name };
    if (args.icon) body.icon = args.icon;
    if (args.color) body.color = args.color;
    if (args.isFinal !== undefined) body.isFinal = args.isFinal === "true";
    return client.post(
      `/api/column/${encodeURIComponent(args.projectId)}`,
      body,
    );
  },

  reorder_columns: async (client, args) => {
    const columns = JSON.parse(args.columns);
    return client.put(
      `/api/column/reorder/${encodeURIComponent(args.projectId)}`,
      { columns },
    );
  },

  update_column: async (client, args) => {
    const body: Record<string, unknown> = {};
    if (args.name) body.name = args.name;
    if (args.icon) body.icon = args.icon;
    if (args.color) body.color = args.color;
    if (args.isFinal !== undefined) body.isFinal = args.isFinal === "true";
    return client.put(`/api/column/${encodeURIComponent(args.id)}`, body);
  },

  delete_column: async (client, args) => {
    return client.delete(`/api/column/${encodeURIComponent(args.id)}`);
  },
};
