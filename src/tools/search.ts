import type { ToolFn } from "../registry.js";

export const searchTools: Record<string, ToolFn> = {
  global_search: async (client, args) => {
    const params = new URLSearchParams({ q: args.q });
    if (args.type) params.set("type", args.type);
    if (args.workspaceId) params.set("workspaceId", args.workspaceId);
    if (args.projectId) params.set("projectId", args.projectId);
    if (args.limit) params.set("limit", args.limit);
    if (args.userEmail) params.set("userEmail", args.userEmail);
    return client.get(`/api/search?${params.toString()}`);
  },
};
