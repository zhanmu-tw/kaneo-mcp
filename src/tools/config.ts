import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { KaneoClient } from "../client.js";

export function registerConfigTools(server: McpServer, client: KaneoClient) {
  server.tool(
    "get_config",
    "Get Kaneo application settings and configuration (registration, demo mode, SSO, SMTP, guest access)",
    {},
    async () => {
      const data = await client.get("/api/config");
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
