# Capital Flow Desk — MCP UnlockFlow (thin)

Thin **stdio** MCP server that exposes **UnlockFlowEvent v1** tools for directory / host listing readiness.

**Product:** CFD Agent Feed (SKU B) sample surface  
**Schema:** UnlockFlowEvent `schema_version: "1"` (copied from `../agent-feed/schema.json`)  
**Status:** Local illustrative seeds only — **not** a live authenticated feed  
**NFA:** Research framing. Not financial advice. Do not convert `sell_pressure_score` into trade instructions.

---

## What it is

| | |
|--|--|
| **Wedge** | Supply shock → capital-flow judgment (calendar is input; realized flow is the read) |
| **Transport** | stdio (MCP host launches this process) |
| **Data** | `data/events.json` — illustrative ENA + ZRO events (`illustrative: true`) |
| **Schema tool** | `data/unlock-flow-event.schema.json` |

This package is for **MCP directory listing / host wiring demos**. Live Agent Feed pull + Pro webhook stay behind onboarding — no API tokens in this repo.

---

## Tools

| Tool | Args | Returns |
|------|------|---------|
| `list_unlock_events` | `asset?`, `horizon?` | Local UnlockFlowEvent[] (+ count / NFA note) |
| `get_unlock_event` | `event_id` | One UnlockFlowEvent |
| `get_schema` | — | UnlockFlowEvent JSON Schema v1 |

Horizons: `T-30` · `T-7` · `T-48h` · `T0` · `T+7`.

Seed ids:

- `uf_20261005_ena_t30` — Ethena original-investor acceleration (size **estimate**)
- `uf_20260920_zro_t48h` — LayerZero digest cliff window (**estimate** labels)

Always surface `disclaimer: "NFA"` and respect `precision_grade` / `illustrative`.

---

## Run locally (stdio)

Requires **Node.js ≥ 20**.

```bash
cd /workspace/crypto-research-desk/mcp-unlockflow
npm install
npm start
```

`npm start` runs `npx tsx src/index.ts` and speaks MCP over **stdin/stdout** (log only on stderr).

### Cursor / Claude Desktop style config

Repo-root **`.mcp.json`** (Open Plugins / [cursor.directory](https://cursor.directory/plugins/new) auto-detect):

```json
{
  "mcpServers": {
    "cfd-unlockflow": {
      "command": "npx",
      "args": ["-y", "tsx", "src/index.ts"]
    }
  }
}
```

Paste the same block into Cursor **Settings → MCP** / Claude Desktop `mcpServers`, or clone this repo and point the host at it.

After npm publish (`@capitalflowdesk/mcp-unlockflow`):

```json
{
  "mcpServers": {
    "cfd-unlockflow": {
      "command": "npx",
      "args": ["-y", "@capitalflowdesk/mcp-unlockflow"]
    }
  }
}
```

Or after local `npm install`:

```bash
npm run start
```

Optional smoke with Inspector (host launches the process):

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

---

## Pricing (draft Agent Feed)

| Tier | Price | Includes (draft) |
|------|------:|------------------|
| **Starter** | **99 USDT / mo** | Authenticated UnlockFlowEvent pull; schema-stable v1 |
| **Pro** | **299 USDT / mo** | Starter + webhook (`cfd.unlock_flow.v1`) on publish / horizon refresh |

Settlement: USDT **TRC-20** · wallet in `../PRODUCTS.md`  
**Onboard:** [@CapitalFlowDeskBot](https://t.me/CapitalFlowDeskBot) or [@Mohammad_GNA](https://t.me/Mohammad_GNA) — subject **Agent Feed / UnlockFlowEvent**.

**Optional Tip Jar:** If this MCP work is useful, [leave a Telegram Stars tip](https://mhr2027r-dotcom.github.io/capital-flow-desk-web/tip-jar/) or [open the bot Tip Jar](https://t.me/CapitalFlowDeskBot?start=tip). Tips are gratitude only; they never unlock Members or Agent Feed access. **NFA.**

Human Telegram membership is a **separate** SKU — do **not** paste Members invite links here.

---

## Registry metadata

`server.json` is a **draft** for Official MCP Registry readiness. **Do not publish** until namespace ownership and packaging are intentional.

---

## Layout

```text
mcp-unlockflow/
  .mcp.json            # cursor.directory / Open Plugins auto-detect
  README.md
  package.json
  server.json          # registry draft — do not publish until intentional
  bin/cfd-mcp-unlockflow.js
  src/index.ts         # stdio MCP
  scripts/publish-npm.sh
  data/
    events.json        # ENA + ZRO illustrative seeds
    unlock-flow-event.schema.json
```

Deps: `@modelcontextprotocol/sdk`, `zod`, `tsx`.

---

*Not financial advice.*


## Smoke test

```bash
cd mcp-unlockflow && npx tsx scripts/smoke.ts
```
Expect `SMOKE_PASS` and tools: `list_unlock_events`, `get_unlock_event`, `get_schema`.

## Install (Cursor / Claude Desktop / cursor.directory)

1. **cursor.directory** — open https://cursor.directory/plugins/new → paste  
   `https://github.com/mhr2027r-dotcom/mcp-unlockflow`  
   Auto-detect uses repo-root **`.mcp.json`**.
2. **Manual host config** (same payload as `.mcp.json`):

```json
{
  "mcpServers": {
    "cfd-unlockflow": {
      "command": "npx",
      "args": ["-y", "tsx", "src/index.ts"]
    }
  }
}
```

Run from a clone of this repo (host cwd = repo root), or after publish:

```json
{
  "mcpServers": {
    "cfd-unlockflow": {
      "command": "npx",
      "args": ["-y", "@capitalflowdesk/mcp-unlockflow"]
    }
  }
}
```

Clone: `git clone https://github.com/mhr2027r-dotcom/mcp-unlockflow.git`

## Live Agent Feed (paid)

Illustrative seeds only in this repo. Live UnlockFlow feed after USDT TRC-20 onboard:
- Starter **99** / Pro **299** USDT · @CapitalFlowDeskBot · @Mohammad_GNA
- Free notes: https://t.me/CapitalFlowDeskHQ

NFA.
