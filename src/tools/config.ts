import type { ToolFn } from "../registry.js";

export const configTools: Record<string, ToolFn> = {
  get_config: async (client) => {
    return client.get("/api/config");
  },
};
