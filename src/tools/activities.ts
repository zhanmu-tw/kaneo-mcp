import type { ToolFn } from "../registry.js";

export const activityTools: Record<string, ToolFn> = {
  get_activities: async (client, args) => {
    return client.get(`/api/activity/${encodeURIComponent(args.taskId)}`);
  },

  create_activity: async (client, args) => {
    return client.post("/api/activity/create", {
      taskId: args.taskId,
      userId: args.userId,
      message: args.message,
      type: args.type,
    });
  },

  create_comment: async (client, args) => {
    return client.post("/api/activity/comment", {
      taskId: args.taskId,
      comment: args.comment,
    });
  },

  update_comment: async (client, args) => {
    return client.put("/api/activity/comment", {
      activityId: args.activityId,
      comment: args.comment,
    });
  },

  delete_comment: async (client, args) => {
    return client.delete(
      `/api/activity/comment/${encodeURIComponent(args.id)}`,
    );
  },
};
