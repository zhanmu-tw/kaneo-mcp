import { KaneoClient } from "./client.js";
import { configTools } from "./tools/config.js";
import { projectTools } from "./tools/projects.js";
import { taskTools } from "./tools/tasks.js";
import { columnTools } from "./tools/columns.js";
import { activityTools } from "./tools/activities.js";
import { timeEntryTools } from "./tools/time-entries.js";
import { labelTools } from "./tools/labels.js";
import { notificationTools } from "./tools/notifications.js";
import { searchTools } from "./tools/search.js";
import { workflowRuleTools } from "./tools/workflow-rules.js";

export type ToolFn = (
  client: KaneoClient,
  args: Record<string, string>,
) => Promise<unknown>;

export const registry: Record<string, ToolFn> = {
  ...configTools,
  ...projectTools,
  ...taskTools,
  ...columnTools,
  ...activityTools,
  ...timeEntryTools,
  ...labelTools,
  ...notificationTools,
  ...searchTools,
  ...workflowRuleTools,
};
