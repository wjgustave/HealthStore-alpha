import type {
  ResponseInputItem,
  ResponseFunctionToolCall,
} from 'openai/resources/responses/responses'
import { openai, AI_MODEL, REASONING_EFFORT, MAX_TOOL_ROUNDS } from '@/lib/ai/config'
import { buildSystemPrompt } from '@/lib/ai/systemPrompt'
import { resolveFundingRegion } from '@/lib/ai/commissionerProfiles'
import { getResolvedOrganisationProfile } from '@/lib/ai/organisationProfileResolver'
import { aiTools } from '@/lib/ai/tools'
import { executeTool } from '@/lib/ai/toolExecutor'
import { createSSEStream } from '@/lib/ai/stream'
import { getSession } from '@/lib/session'
import { REGIONS, type Region } from '@/lib/ai/funding'

export const runtime = 'nodejs'
export const maxDuration = 300

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const TOOL_COMMENTARY: Record<string, string> = {
  search_apps: 'Searching the app catalogue',
  get_app_detail: 'Pulling up the full product dossier',
  get_app_financials: 'Looking at pricing and financial models',
  compare_apps: 'Building a side-by-side comparison',
  list_funding: 'Checking available funding opportunities',
  get_funding_detail: 'Loading funding scheme details',
  get_condition_overview: 'Reviewing the condition landscape',
  get_enums: 'Checking standard definitions',
  find_dtx_funding: 'Searching NHS funding sources...',
}

const WEB_SEARCH_TOOL = {
  type: 'web_search' as const,
  user_location: { type: 'approximate' as const, country: 'GB' },
}

const FUNDING_STARTER_MESSAGE =
  'I want to find NHS funding for deploying a digital therapeutic.'

function inferDefaultFundingCondition(focus: string[]): 'copd' | 'pr' | 'cr' | null {
  for (const item of focus) {
    const v = item.trim().toLowerCase()
    if (v === 'copd') return 'copd'
    if (v === 'pr' || v === 'pulmonary_rehabilitation') return 'pr'
    if (v === 'cr' || v === 'cardiac_rehab' || v === 'cardiac_rehabilitation') return 'cr'
  }
  return null
}

async function streamAssistantText(
  writer: ReturnType<typeof createSSEStream>['writer'],
  text: string,
) {
  writer.writeCommentary('')
  const chunkSize = 12
  for (let i = 0; i < text.length; i += chunkSize) {
    writer.writeTextDelta(text.slice(i, i + chunkSize))
    await new Promise(resolve => setTimeout(resolve, 15))
  }
  writer.writeDone()
  writer.close()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const messages: ChatMessage[] = body.messages ?? []

    if (!messages.length) {
      return Response.json({ error: 'No messages provided' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    const session = await getSession()

    if (!session.isLoggedIn) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getResolvedOrganisationProfile(session)
    const fundingRegion = resolveFundingRegion(profile)
    const systemPrompt = buildSystemPrompt(profile)

    const { readable, writer } = createSSEStream()

    const allTools = [
      ...aiTools,
      WEB_SEARCH_TOOL,
    ] as unknown as Parameters<typeof openai.responses.create>[0]['tools']

    const processRequest = async () => {
      try {
        const input: ResponseInputItem[] = messages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))

        const latestUserMessage = messages
          .filter(m => m.role === 'user')
          .at(-1)
          ?.content.trim()

        // Deterministic funding starter path: clicking "Find NHS funding & deployment routes"
        // should immediately return funding cards in the chat.
        if (
          latestUserMessage === FUNDING_STARTER_MESSAGE &&
          fundingRegion
        ) {
          const defaultCondition = inferDefaultFundingCondition(profile.conditionFocus) ?? 'copd'
          const args: Record<string, unknown> = {
            region: fundingRegion,
            condition: defaultCondition,
          }
          const result = await executeTool('find_dtx_funding', args)
          if (result.funding) {
            writer.writeFundingResults(result.funding)
            await streamAssistantText(
              writer,
              `I searched funding routes for ${result.funding.selectionLabel} in ${result.funding.region}. The ranked opportunities are shown above. [[Compare the top two funds]] [[How do I apply for the strongest match?]]`,
            )
            return
          }
          writer.writeFundingFallback(
            'Funding search could not return result cards from the starter button. Please try asking for COPD, Pulmonary Rehab, or Cardiac Rehab funding.',
          )
          await streamAssistantText(
            writer,
            'I could not load funding cards from the starter action this time. Please ask for a specific funding search, for example: "Find COPD funding in my region."',
          )
          return
        }

        let rounds = 0

        while (rounds < MAX_TOOL_ROUNDS) {
          rounds++

          writer.writeCommentary(rounds === 1 ? 'Thinking about your question...' : 'Pulling together my response...')

          const response = await openai.responses.create({
            model: AI_MODEL,
            instructions: systemPrompt,
            input,
            tools: allTools,
            reasoning: { effort: REASONING_EFFORT },
          })

          const functionCalls = response.output.filter(
            (item): item is ResponseFunctionToolCall => item.type === 'function_call',
          )

          const hasWebSearch = response.output.some(
            item => item.type === 'web_search_call',
          )

          if (functionCalls.length === 0 && !hasWebSearch) {
            await streamAssistantText(writer, response.output_text ?? '')
            return
          }

          // Append full model output to input for the next round
          for (const item of response.output) {
            input.push(item as ResponseInputItem)
          }

          if (hasWebSearch) {
            writer.writeCommentary('Searching NHS sources for the latest information...')
          }

          let fundingDelivered = false
          let fundingToolCalled = false

          for (const call of functionCalls) {
            const commentary = TOOL_COMMENTARY[call.name] ?? `Using ${call.name}`
            writer.writeCommentary(commentary)

            let args: Record<string, unknown> = {}
            try {
              args = JSON.parse(call.arguments)
            } catch {
              args = {}
            }

            // Funding searches default to the commissioner's own region from their
            // profile. Only inject it when the model omitted or gave an invalid region;
            // an explicit, valid region (a deliberate override) is left untouched.
            if (call.name === 'find_dtx_funding') {
              fundingToolCalled = true
              const r = args.region
              if (
                (typeof r !== 'string' || !REGIONS.includes(r as Region)) &&
                fundingRegion
              ) {
                args.region = fundingRegion
              }
            }

            const result = await executeTool(call.name, args)

            if (result.funding) {
              writer.writeFundingResults(result.funding)
              fundingDelivered = true
            }

            const output: ResponseInputItem.FunctionCallOutput = {
              type: 'function_call_output',
              call_id: call.call_id,
              output: result.result,
            }
            input.push(output)
          }

          if (fundingToolCalled && !fundingDelivered) {
            writer.writeFundingFallback(
              'Funding search ran, but no result cards were returned. Please try again in a moment.',
            )
          }

          // Funding search nests a slow web-search model call; skip another full
          // tool-enabled round so we stay within Vercel's function timeout.
          if (
            fundingDelivered &&
            functionCalls.length > 0 &&
            functionCalls.every(c => c.name === 'find_dtx_funding')
          ) {
            writer.writeCommentary('Finalising my response...')
            const finalResponse = await openai.responses.create({
              model: AI_MODEL,
              instructions: systemPrompt,
              input,
              reasoning: { effort: 'low' },
            })
            await streamAssistantText(writer, finalResponse.output_text ?? '')
            return
          }
        }

        // Exhausted tool rounds — get a final answer without tools
        writer.writeCommentary('Finalising my response...')

        const finalResponse = await openai.responses.create({
          model: AI_MODEL,
          instructions: systemPrompt,
          input,
          reasoning: { effort: REASONING_EFFORT },
        })

        await streamAssistantText(writer, finalResponse.output_text ?? '')
      } catch (err) {
        console.error('[AI Chat] Error:', err)
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        writer.writeError(message)
        writer.close()
      }
    }

    processRequest()

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    console.error('[AI Chat] Request error:', err)
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
