#!/usr/bin/env node
/**
 * Capital Flow Desk — thin MCP (UnlockFlowEvent v1)
 * Local / illustrative seed only. NFA. Not live Agent Feed.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_DIR = join(ROOT, "data");

type UnlockFlowEvent = Record<string, unknown> & {
  event_id: string;
  asset: string;
  horizon: string;
  illustrative?: boolean;
};

const HORIZONS = ["T-30", "T-7", "T-48h", "T0", "T+7"] as const;

function loadEvents(): UnlockFlowEvent[] {
  const parsed = JSON.parse(
    readFileSync(join(DATA_DIR, "events.json"), "utf8"),
  ) as UnlockFlowEvent[];
  if (!Array.isArray(parsed)) throw new Error("data/events.json must be an array");
  return parsed;
}

function loadSchema(): unknown {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "unlock-flow-event.schema.json"), "utf8"),
  );
}

function jsonResult(payload: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
  };
}

function errorResult(message: string) {
  return {
    content: [{ type: "text" as const, text: message }],
    isError: true,
  };
}

async function main() {
  const events = loadEvents();
  const schema = loadSchema();

  const server = new McpServer({
    name: "cfd-mcp-unlockflow",
    version: "0.1.0",
  });

  server.registerTool(
    "list_unlock_events",
    {
      description:
        "List local UnlockFlowEvent v1 samples (illustrative). Optional filters: asset ticker, horizon. Seeds have illustrative:true — NFA, not live Agent Feed. Live feed: @CapitalFlowDeskBot / @Mohammad_GNA (99/299 USDT TRC-20).",
      inputSchema: {
        asset: z
          .string()
          .optional()
          .describe("Optional ticker filter, e.g. ENA or ZRO (case-insensitive)"),
        horizon: z
          .enum(HORIZONS)
          .optional()
          .describe("Optional horizon: T-30 | T-7 | T-48h | T0 | T+7"),
      },
    },
    async ({ asset, horizon }) => {
      let out = events;
      if (asset) {
        const a = asset.trim().toUpperCase();
        out = out.filter((e) => String(e.asset).toUpperCase() === a);
      }
      if (horizon) out = out.filter((e) => e.horizon === horizon);
      return jsonResult({
        count: out.length,
        disclaimer: "NFA",
        note: "Local illustrative seeds only. Live Agent Feed onboard: @CapitalFlowDeskBot or @Mohammad_GNA.",
        pricing_usdt_trc20: { starter: 99, pro: 299 },
        events: out,
      });
    },
  );

  server.registerTool(
    "get_unlock_event",
    {
      description:
        "Fetch one UnlockFlowEvent by event_id from local illustrative seeds.",
      inputSchema: {
        event_id: z
          .string()
          .min(1)
          .describe("Stable event id, e.g. uf_20261005_ena_t30"),
      },
    },
    async ({ event_id }) => {
      const hit = events.find((e) => e.event_id === event_id);
      if (!hit) {
        return errorResult(
          `Unknown event_id: ${event_id}. Known: ${events.map((e) => e.event_id).join(", ")}`,
        );
      }
      return jsonResult(hit);
    },
  );

  server.registerTool(
    "get_schema",
    {
      description: 'Return UnlockFlowEvent JSON Schema v1 (schema_version "1").',
      inputSchema: {},
    },
    async () =>
      jsonResult({
        schema_version: "1",
        title: "UnlockFlowEvent",
        disclaimer: "NFA",
        schema,
      }),
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
