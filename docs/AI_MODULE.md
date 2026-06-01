# AI Commissioner Advisor — Architecture & Reference

**Status:** Implemented (April 2026)
**Model:** GPT-5.4 via OpenAI Responses API
**Route:** `/ai`

---

## Overview

The AI Commissioner Advisor is a consultative chat module that helps NHS commissioners explore digital health products, compare costs, find funding, and build business cases. It uses GPT-5.4's native function-calling to query the HealthStore's structured JSON data on demand, and OpenAI's built-in web search to verify current NHS policy, NICE guidance, and funding deadlines.

The AI behaves like a **specialist business development advisor** — it asks clarifying questions first, understands the commissioner's needs, and then guides them through options rather than dumping information. It knows who the commissioner is, their ICB, population, strategic priorities, and local health challenges.

---

## Architecture

```
Browser                     Server (Next.js)              OpenAI
  |                              |                          |
  |-- POST /api/ai/chat ------->|                          |
  |   { messages[] }             |                          |
  |                              |-- getSession() --------->|
  |                              |-- getProfile(entityId)   |
  |                              |-- buildSystemPrompt()    |
  |                              |                          |
  |                              |-- responses.create() --->|
  |                              |   model: gpt-5.4         |
  |                              |   tools: 8 functions     |
  |                              |          + web_search    |
  |                              |   instructions: prompt   |
  |                              |     + profile context    |
  |                              |                          |
  | <-- SSE: commentary --------|<-- function_call --------|
  |                              |-- executeTool() locally  |
  |                              |-- function_call_output ->|
  |                              |                          |
  | <-- SSE: commentary --------|<-- web_search_call ------|
  |                              |   (handled by OpenAI)    |
  |                              |                          |
  | <-- SSE: text_delta --------|<-- text response --------|
  | <-- SSE: done --------------|                          |
```

---

## Prompt Hardening — 5-Layer Defence

### Layer 1: Identity Lock
The system prompt declares a fixed, non-negotiable identity. Any attempt to change persona, reveal instructions, or role-play is declined with a redirect.

### Layer 2: Scope Boundary
Explicit enumeration of what the AI will and will not do. Won't discuss non-health topics, generate code, give clinical advice, or process PII.

### Layer 3: Injection Resistance
Specific instructions to refuse "ignore previous instructions", "you are now...", "pretend to be..." style attacks.

### Layer 4: Output Safety
Never fabricates data. If tool lookup returns nothing, says so. Never impersonates real officials. Labels synthetic data as illustrative.

### Layer 5: PII Guardrails
Refuses to process patient-identifiable information. Reminds users the conversation is not clinically governed.

---

## Consultative Behaviour Model

The AI is instructed to behave like a financial advisor / BDM, not a search engine:

1. **Discovery first** — asks 1-2 clarifying questions before looking anything up
2. **Never dumps information** — builds the conversation in layers
3. **Matchmaking, not selling** — presents trade-offs honestly, doesn't promote products
4. **Implementation-focused** — frames everything in terms of pathway change, workforce, costs, provider impact
5. **Forward momentum** — every response ends with a next step or question

---

## Commissioner Profiles

Four realistic (synthetic) commissioner profiles in `lib/ai/commissionerProfiles.ts`:

| Entity ID | ICB | Commissioner | Population |
|-----------|-----|-------------|-----------|
| `shropshire-telford-wrekin-icb` | Shropshire, Telford and Wrekin | Sarah Thornton | 510,000 |
| `cornwall-and-isles-of-scilly-icb` | Cornwall and Isles of Scilly | James Penrose | 570,000 |
| `north-east-london-icb` | North East London | Priya Chakraborty | 2,100,000 |
| `west-yorkshire-icb` | West Yorkshire | David Hartley | 2,400,000 |

Each profile includes: population, role title, strategic priorities, local health challenges, current digital position, budget context, deprivation profile, rural/urban mix, and personalised starter prompts.

The primary demo user (no entity selection) defaults to the Shropshire profile.

---

## Web Search

OpenAI's built-in `web_search` tool is enabled alongside custom function tools. Configuration:
- **User location:** GB (approximate)
- **Domain filtering:** Not applied at tool level (GPT-5.4 is instructed via prompt to prefer NHS sources)
- **Usage guidance in prompt:** Use for verifying current NICE guidance, funding deadlines, ICB strategies, supplier news

---

## Commentary Stream

Instead of showing incremental tool-call badges, the UI shows a single rolling commentary line below the message area. The server emits `commentary` SSE events with human-readable status text:

- "Thinking about your question..."
- "Searching the app catalogue"
- "Looking at pricing and financial models"
- "Searching NHS sources for the latest information..."
- "Pulling together my response..."

Commentary clears when the text response begins streaming.

---

## Tool Definitions

| Tool | Purpose | Data source |
|------|---------|-------------|
| `search_apps` | Find apps by condition, keyword, pathway/outcome tags | `getAllApps()` + Fuse.js search |
| `get_app_detail` | Full product dossier for a specific app | `getAppBySlug()` |
| `get_app_financials` | Pricing, tariff, ROI, P&L fields only | `getAppBySlug()` — financial subset |
| `compare_apps` | Side-by-side comparison of 2-3 apps | `getAppBySlug()` x N |
| `list_funding` | Open/upcoming funding, optional condition filter | `getOpenFunding()` |
| `get_funding_detail` | Full detail on a specific funding scheme | `getAllFunding()` by ID |
| `get_condition_overview` | Condition area summary with app list | `getConditionAreas()` + `getAppsByCondition()` |
| `get_enums` | Vocabulary definitions (pricing models, maturity, etc.) | `enums.json` |
| `web_search` | Live web lookup for current NHS policy, NICE guidance, funding | OpenAI built-in |

---

## File Map

```
lib/ai/
  config.ts               — OpenAI client, model ID, reasoning effort
  systemPrompt.ts         — 5-layer hardened prompt + buildSystemPrompt(profile)
  commissionerProfiles.ts — 4 realistic commissioner profiles
  tools.ts                — Tool definitions (JSON schema)
  toolExecutor.ts         — Tool execution against JSON data layer
  stream.ts               — SSE streaming utilities (text_delta, commentary, error, done)

app/api/ai/chat/
  route.ts                — POST handler (session, profile, tool loop, web search, streaming)

app/ai/
  page.tsx                — Async server component (reads session, resolves profile)
  AiChatClient.tsx        — Chat UI with personalised greeting, commentary line, streaming

components/ai/
  ChatMessage.tsx         — Message rendering with markdown + citation links
  ChatInput.tsx           — Input textarea + send button
  ToolCallIndicator.tsx   — (Legacy — replaced by commentary stream in AiChatClient)
```

---

## Environment Variables

| Variable | Required | Notes |
|----------|----------|-------|
| `OPENAI_API_KEY` | Yes | OpenAI API key with GPT-5.4 access |

---

## Cost Considerations

- GPT-5.4: $2.50/1M input tokens, $15/1M output tokens
- Web search: additional per-search cost (see OpenAI pricing)
- Commissioner profile adds ~500 tokens to system prompt per request
- Consultative behaviour (shorter initial responses, more turns) may increase turn count but reduces per-turn cost
- Estimated cost per conversation (5-8 turns): ~$0.15-0.30
