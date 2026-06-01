# DTx Funding Finder

**Status:** Implemented (June 2026)
**Lives in:** `lib/ai/funding/`
**Surfaces as:** A **conversational** capability in the AI Advisor. The advisor calls the `find_dtx_funding` tool mid-conversation (`lib/ai/tools.ts` + `lib/ai/toolExecutor.ts`) over the chat route `POST /api/ai/chat`; results render as `FundingResults` cards inline in the transcript.

The "Find NHS funding" starter button kicks off this conversation; there is no separate form to fill in. The region is taken automatically from the commissioner's profile.

> The guided 4-step wizard (`components/ai/FundingWizard.tsx`) and the direct API route `POST /api/ai-advisor/funding-search` still exist in the repo but are **no longer wired into the UI** — funding now runs only through the conversational path. They are kept for easy reversibility and can be deleted if no longer wanted.

---

## What it is

A guided tool inside the AI Advisor that helps NHS commissioners find current funding opportunities for digital therapeutics (DTx). The user answers a few deterministic questions; the app makes **one** model call that returns a JSON array of candidate funds; the app then **scores each one 0–100 in code** and renders ranked, interactive result cards inline in the chat transcript.

## Why it is built this way

- **Scoring is owned by application code, never the model.** This makes confidence scores repeatable, auditable, and defensible (important for NHS governance). The model only classifies each result into a fixed `match_type` enum and supplies the raw facts; the code maps that to points.
- **The model is provider-agnostic.** The finder depends only on a small `LLMProvider` interface, so the underlying model/vendor can be swapped without touching prompts, parsing, scoring, or UI.
- **Inputs are constrained.** Region, search type, and selection all come from hard-coded lists, so the prompt is lean and the request is always well-formed.

## The conversational flow (`find_dtx_funding`)

Funding runs entirely through chat — either by asking directly (e.g. "where can I get funding for COPD?") or by clicking the **Find NHS funding** starter button, which seeds a funding intent (`startFundingConversation()` in `AiAdvisorPanel.tsx`) and lets the advisor take it from there. The flow:

1. **Region is taken silently from the commissioner's profile.** The system prompt (`lib/ai/systemPrompt.ts`) tells the advisor to use the region from the Commissioner context automatically and **not** ask for it — only asking if the profile has no region, or if the commissioner explicitly wants a different region.
2. So the advisor only needs to gather **a condition or a specific DTx app**. If that is missing or ambiguous, it asks and offers the options as clickable `[[...]]` suggestion chips. The applicant is always assumed to be a commissioner.
3. The model calls the `find_dtx_funding` tool (defined in `lib/ai/tools.ts`, args constrained to the region/condition/app enums).
4. **Route backstop:** before executing the call, `app/api/ai/chat/route.ts` injects the profile region into `args.region` whenever the model omitted it or passed an invalid value, while leaving a deliberate, valid override untouched. If neither the model nor the profile yields a valid region, the executor returns a "missing region" error and the advisor asks.
5. The async executor (`lib/ai/toolExecutor.ts`) maps the args to `{ region, mode, selection }`, runs `runFundingFinder`, and returns **two things**:
   - a compact JSON summary (fund name, provider, score, match_type, applicant_fit, region_scope) fed back to the model so it can frame the results without inventing detail, and
   - the full `FundingResult[]` + meta as a `funding` payload.
6. The chat route streams the payload to the client as a `funding_results` SSE event (`lib/ai/stream.ts`), then lets the model write a short conversational framing.
7. `AiAdvisorPanel` attaches the results to the assistant message; that message renders the streamed prose **and** the `FundingResults` cards together. The card's **New funding search** button re-seeds the conversation via `startFundingConversation()`.
8. **Follow-ups:** the advisor always ends a funding answer with 1–2 clickable `[[...]]` follow-up suggestions (compare the top funds, how to apply, model deployment costs, search another condition) to keep the conversation going.

Because the model only frames the results (the cards carry the real data and scores), the conversational path cannot fabricate funds or alter scores.

## Hard-coded reference data (`data.ts`)

- `REGIONS` — the 7 NHS England regions (no "National" / no "Other"). "National" can still appear in a result's `region_scope`.
- `CONDITIONS` — COPD, Pulmonary Rehabilitation, Cardiac Rehabilitation (each tagged Respiratory / CVD).
- `APPS` — 11 DTx apps, each tagged with condition + area.
- `SEARCH_MODE` — `condition | app`.
- Synonym / mapping strings used to enrich the prompt.

> Note: the app list is hard-coded per spec and may include products not present in the main catalogue.

## JSON output contract

The model must return **only** a JSON array. Each element:

```json
{
  "fund_name": "string",
  "provider": "string (e.g. NHSE, NIHR, Innovate UK, AHSN, ICB)",
  "eligibility_summary": "string",
  "amount_range": "string or null",
  "deadline": "string or null",
  "region_scope": "National or a specific region name",
  "match_type": "dtx_specific | condition | condition_area | generic_digital_health",
  "match_rationale": "string",
  "applicant_fit": "commissioner_eligible | adoption_partner | developer_or_academic_only | unclear"
}
```

`applicant_fit` is the model's honest assessment of **who can access the fund**, from the perspective of a commissioning/procuring NHS organisation (ICB, trust, foundation trust, PCN, CIC, community provider). It is used as a deterministic eligibility filter (see below) — not for scoring.

## Scoring table (`score.ts`)

`scoreResult(result, region)` returns a 0–100 score (capped at 100):

| Dimension     | Rule                                                    | Points |
| ------------- | ------------------------------------------------------- | ------ |
| Topic match   | `dtx_specific`                                          | 45     |
|               | `condition`                                             | 35     |
|               | `condition_area`                                        | 20     |
|               | `generic_digital_health`                                | 10     |
| Geography     | exact region (substring match)                          | 25     |
|               | `National`                                              | 20     |
|               | other / unclear                                         | 5      |
| Recency       | open / rolling / ongoing                                | 15     |
|               | dated and known                                         | 10     |
|               | unknown                                                 | 5      |
| Eligibility   | clear summary (> 20 chars)                              | 10     |
|               | otherwise                                               | 3      |
| Amount        | a known amount range                                    | 5      |

Confidence bands shown in the UI: **Strong** ≥ 75, **Moderate** ≥ 50, **Weak** ≥ 30, **Low** below 30.

> Eligibility is deliberately **kept out of the 0–100 score** — the confidence score is a pure measure of *match relevance*. Who can access a fund is handled separately as a hard filter + ranking nudge (next section).

## Eligibility filter (`applicant_fit`)

The tool is built for a commissioning/procuring NHS organisation, so funds only a technology developer/SME or academic can apply for are noise. This is enforced in two layers:

1. **Prompt** — a PERSPECTIVE / INCLUDE / EXCLUDE block frames the model as answering for an NHS commissioner/provider, and the schema requires an `applicant_fit` classification.
2. **Code (deterministic backstop, `index.ts`)** — even if the prompt lets one through:
   - `coerceResult` validates `applicant_fit` against the enum, defaulting unknown/missing values to `unclear`.
   - Results classified `developer_or_academic_only` are **dropped** before scoring.
   - Sorting is **confidence score first**, then an eligibility tiebreaker (`commissioner_eligible` > `adoption_partner` > `unclear`), so equally-relevant funds the commissioner can actually access rank higher.

The UI surfaces this per card: a green "You can apply" / "As adoption partner" chip, or a muted "Eligibility unclear". `developer_or_academic_only` never reaches the UI.

## Provider adapter (`provider/`)

```ts
// provider/types.ts
export interface LLMProvider {
  generate(input: { system: string; user: string; webSearch: boolean; maxTokens: number }): Promise<string>
}
```

- `provider/openai.ts` — `OpenAIProvider` uses the OpenAI Responses API with the built-in `web_search` tool (GB-located). If web search is unavailable the model answers from its own knowledge (results may be less current).
- `provider/index.ts` — `getProvider()` returns the active provider.

**Adding a provider:** implement `LLMProvider` in one new file (e.g. `provider/anthropic.ts`) and return it from `getProvider()`. Nothing else in the finder changes.

**Where the key is injected:** the OpenAI key is read server-side from `OPENAI_API_KEY` via the shared client in `lib/ai/config.ts`. Keys never reach the client bundle; the browser only talks to the auth-gated API route.

## Robust parsing (`parse.ts`)

`extractFundingArray(text)` survives messy model output:

1. Strips code fences, then scans back from the last `]` to find a complete, valid array (ignoring surrounding prose).
2. **Truncation fallback** — a string-aware balanced-brace scanner collects every complete top-level `{…}` object, so a cut-off response still yields the results that did arrive.
3. On total failure it throws an error containing the first ~160 characters of the response (useful for debugging, surfaced by the API route).

## Orchestration (`index.ts`)

`runFundingFinder({ region, mode, selection }, provider?)`:

1. Builds the system + user prompts (`prompt.ts`), including the commissioner PERSPECTIVE/INCLUDE/EXCLUDE framing, condition/area synonyms, and condition-specific funder hints.
2. Calls `provider.generate(...)` (web search on, ~6000 max output tokens — high enough to fit a full 8–15-result array without truncation).
3. Parses with `extractFundingArray`, drops entries without a `fund_name`, normalises fields, and drops `developer_or_academic_only` results.
4. Scores each with `scoreResult`, then sorts by `_score` descending with an `applicant_fit` tiebreaker.

## API route

`POST /api/ai-advisor/funding-search` (`runtime = 'nodejs'`, `maxDuration = 60`):

- Auth-gated: returns **401** if the session is not logged in.
- Validates `region ∈ REGIONS`, `mode ∈ SEARCH_MODE`, and `selection` against the matching list (**400** otherwise).
- Returns `{ results: FundingResult[] }` on success, or a useful error message (with HTTP status / first ~160 chars of the model output) on failure — **502** for finder errors, never a generic message.

## Tests

`lib/ai/funding/__tests__/`:

- `score.test.ts` — match_type weighting/order, geography (exact vs national vs other, substring matching), recency, eligibility, amount, and the cap at 100.
- `parse.test.ts` — clean array, fenced, prose-wrapped, truncated-array recovery, string-aware braces, and the total-failure error.
- `finder.test.ts` — end-to-end via an injected stub provider: `developer_or_academic_only` is dropped, missing `applicant_fit` defaults to `unclear`, eligible funds beat `unclear` at equal score, and confidence still ranks first.

Run with `npm run test`.

## Limitations & disclaimer

- Results are **AI-generated** and may be incomplete or out of date. The UI always shows a disclaimer to verify eligibility, amounts, and deadlines directly with the funder before relying on them.
- Region comes from the commissioner profile and is scored against the 7 NHS England regions; "National" still scores via the geography rule when it appears in a result.
- The finder is reachable only conversationally via the `find_dtx_funding` chat tool. The guided wizard and `POST /api/ai-advisor/funding-search` remain in the repo but are unwired. The advisor's general chat is otherwise unaffected.
- Conversational searches are slower than a normal chat reply: the funding tool nests its own web-search model call inside a chat round. The "Searching NHS funding sources..." commentary covers the wait, and it stays within the route's `maxDuration = 60`.
