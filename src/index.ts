#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { KaneoClient } from "./client.js";
import { registerConfigTools } from "./tools/config.js";
import { registerProjectTools } from "./tools/projects.js";
import { registerTaskTools } from "./tools/tasks.js";
import { registerColumnTools } from "./tools/columns.js";
import { registerActivityTools } from "./tools/activities.js";
import { registerTimeEntryTools } from "./tools/time-entries.js";
import { registerLabelTools } from "./tools/labels.js";
import { registerNotificationTools } from "./tools/notifications.js";
import { registerSearchTools } from "./tools/search.js";
import { registerWorkflowRuleTools } from "./tools/workflow-rules.js";

const KANEO_API_URL = process.env.KANEO_API_URL;
const KANEO_API_TOKEN = process.env.KANEO_API_TOKEN;

if (!KANEO_API_URL) {
  console.error("Error: KANEO_API_URL environment variable is required");
  process.exit(1);
}

if (!KANEO_API_TOKEN) {
  console.error("Error: KANEO_API_TOKEN environment variable is required");
  process.exit(1);
}

const client = new KaneoClient(KANEO_API_URL, KANEO_API_TOKEN);

const server = new McpServer({
  name: "kaneo-mcp",
  version: "1.0.0",
});

// Register all tool categories
registerConfigTools(server, client);
registerProjectTools(server, client);
registerTaskTools(server, client);
registerColumnTools(server, client);
registerActivityTools(server, client);
registerTimeEntryTools(server, client);
registerLabelTools(server, client);
registerNotificationTools(server, client);
registerSearchTools(server, client);
registerWorkflowRuleTools(server, client);

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
