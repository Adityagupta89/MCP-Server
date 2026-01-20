import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "mcp-server",
  version: "3.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "add-number",
  "Add two number",
  {
    a: z.number().describe("First number"),
    b: z.number().describe("Second Number"),
  },
  async ({ a, b }) => {
    return {
      content: [{ type: "text", text: `Total is ${a + b}` }],
    };
  }
);

server.tool(
  "get_github_repo",
  "Get all the repo for username",
  {
    username: z.string().describe("Github Account Name"),
  },
  async ({ username }) => {
    const res = await fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        "User-Agent": "MCP_Server",
      },
    });
    if (!res.ok) throw new Error("Github api Error");
    const repos = await res.json();
    const repolist = repos.map(
      (repo: any, i: number) => `${i + 1}. ${repo.name}`
    );
    return repolist;
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Error in main!:", error);
  process.exit(1);
});
