import type { ToolFn } from "../registry.js";

export const workflowRuleTools: Record<string, ToolFn> = {
  get_workflow_rules: async (client, args) => {
    return client.get(
      `/api/workflow-rule/${encodeURIComponent(args.projectId)}`,
    );
  },

  upsert_workflow_rule: async (client, args) => {
    return client.put(
      `/api/workflow-rule/${encodeURIComponent(args.projectId)}`,
      {
        integrationType: args.integrationType,
        eventType: args.eventType,
        columnId: args.columnId,
      },
    );
  },

  delete_workflow_rule: async (client, args) => {
    return client.delete(`/api/workflow-rule/${encodeURIComponent(args.id)}`);
  },
};
