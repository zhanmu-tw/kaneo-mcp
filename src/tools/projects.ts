import type { ToolFn } from "../registry.js";

export const projectTools: Record<string, ToolFn> = {
  list_projects: async (client, args) => {
    return client.get(
      `/api/project?workspaceId=${encodeURIComponent(args.workspaceId)}`,
    );
  },

  create_project: async (client, args) => {
    const body: Record<string, unknown> = {
      name: args.name,
      workspaceId: args.workspaceId,
      icon: args.icon,
    };
    if (args.slug) body.slug = args.slug;
    return client.post("/api/project", body);
  },

  get_project: async (client, args) => {
    let path = `/api/project/${encodeURIComponent(args.id)}`;
    if (args.workspaceId)
      path += `?workspaceId=${encodeURIComponent(args.workspaceId)}`;
    return client.get(path);
  },

  update_project: async (client, args) => {
    const current = (await client.get(
      `/api/project/${encodeURIComponent(args.id)}?workspaceId=${encodeURIComponent(args.workspaceId)}`,
    )) as Record<string, unknown>;
    const body = {
      name: args.name ?? current.name,
      icon: args.icon ?? current.icon,
      slug: args.slug ?? current.slug,
      description: args.description ?? current.description ?? "",
      isPublic:
        args.isPublic !== undefined
          ? args.isPublic === "true"
          : (current.isPublic ?? false),
    };
    return client.put(`/api/project/${encodeURIComponent(args.id)}`, body);
  },

  delete_project: async (client, args) => {
    return client.delete(`/api/project/${encodeURIComponent(args.id)}`);
  },
};
