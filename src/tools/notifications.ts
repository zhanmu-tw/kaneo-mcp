import type { ToolFn } from "../registry.js";

export const notificationTools: Record<string, ToolFn> = {
  list_notifications: async (client) => {
    return client.get("/api/notification");
  },

  create_notification: async (client, args) => {
    const body: Record<string, unknown> = {
      userId: args.userId,
      title: args.title,
      message: args.message,
    };
    if (args.type) body.type = args.type;
    if (args.relatedEntityId) body.relatedEntityId = args.relatedEntityId;
    if (args.relatedEntityType) body.relatedEntityType = args.relatedEntityType;
    return client.post("/api/notification", body);
  },

  mark_notification_read: async (client, args) => {
    return client.patch(
      `/api/notification/${encodeURIComponent(args.id)}/read`,
    );
  },

  mark_all_notifications_read: async (client) => {
    return client.patch("/api/notification/read-all");
  },

  clear_all_notifications: async (client) => {
    return client.delete("/api/notification/clear-all");
  },
};
