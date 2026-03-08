import type { ToolFn } from "../registry.js";

export const timeEntryTools: Record<string, ToolFn> = {
  get_task_time_entries: async (client, args) => {
    return client.get(
      `/api/time-entry/task/${encodeURIComponent(args.taskId)}`,
    );
  },

  get_time_entry: async (client, args) => {
    return client.get(`/api/time-entry/${encodeURIComponent(args.id)}`);
  },

  create_time_entry: async (client, args) => {
    const body: Record<string, unknown> = {
      taskId: args.taskId,
      startTime: args.startTime,
    };
    if (args.endTime) body.endTime = args.endTime;
    if (args.description) body.description = args.description;
    return client.post("/api/time-entry", body);
  },

  update_time_entry: async (client, args) => {
    const current = (await client.get(
      `/api/time-entry/${encodeURIComponent(args.id)}`,
    )) as Record<string, unknown>;
    const body = {
      startTime: args.startTime ?? current.startTime,
      endTime: args.endTime ?? current.endTime ?? "",
      description: args.description ?? current.description ?? "",
    };
    return client.put(`/api/time-entry/${encodeURIComponent(args.id)}`, body);
  },
};
