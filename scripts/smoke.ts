import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "src/index.ts"],
    cwd: "/workspace/crypto-research-desk/mcp-unlockflow",
  });
  const client = new Client({ name: "cfd-smoke", version: "0.1.0" });
  await client.connect(transport);
  const tools = await client.listTools();
  console.log("TOOLS", tools.tools.map((t) => t.name).join(","));
  const listed = await client.callTool({ name: "list_unlock_events", arguments: {} });
  const text = (listed.content as { type: string; text?: string }[])
    .map((c) => c.text || "")
    .join("");
  const parsed = JSON.parse(text);
  console.log("LIST_COUNT", parsed.count, "PRICES", parsed.pricing_usdt_trc20);
  const one = await client.callTool({
    name: "get_unlock_event",
    arguments: { event_id: "uf_20261005_ena_t30" },
  });
  const oneText = (one.content as { type: string; text?: string }[])
    .map((c) => c.text || "")
    .join("");
  console.log("GET_ENA", JSON.parse(oneText).asset);
  const sch = await client.callTool({ name: "get_schema", arguments: {} });
  const schText = (sch.content as { type: string; text?: string }[])
    .map((c) => c.text || "")
    .join("");
  console.log("SCHEMA_OK", JSON.parse(schText).schema_version);
  await client.close();
  console.log("SMOKE_PASS");
}

main().catch((e) => {
  console.error("SMOKE_FAIL", e);
  process.exit(1);
});
