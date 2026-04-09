import type {
  ResponseInputItem,
  ResponseFunctionToolCall,
} from 'openai/resources/responses/responses'
import { openai, AI_MODEL, REASONING_EFFORT, MAX_TOOL_ROUNDS } from '@/lib/ai/config'
import { buildSystemPrompt } from '@/lib/ai/systemPrompt'
import { getCommissionerProfile } from '@/lib/ai/commissionerProfiles'
import { aiTools } from '@/lib/ai/tools'
import { executeTool } from '@/lib/ai/toolExecutor'
import { createSSEStream } from '@/lib/ai/stream'
import { getSession } from '@/lib/session'

export const runtime = 'nodejs'
export const maxDuration = 60

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
}

const WEB_SEARCH_TOOL = {
  type: 'web_search' as const,
  user_location: { type: 'approximate' as const, country: 'GB' },
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
    const profile = getCommissionerProfile(session.commissioningEntityId)
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
            const text = response.output_text ?? ''

            writer.writeCommentary('')

            const chunkSize = 12
            for (let i = 0; i < text.length; i += chunkSize) {
              writer.writeTextDelta(text.slice(i, i + chunkSize))
              await new Promise(resolve => setTimeout(resolve, 15))
            }

            writer.writeDone()
            writer.close()
            return
          }

          // Append full model output to input for the next round
          for (const item of response.output) {
            input.push(item as ResponseInputItem)
          }

          if (hasWebSearch) {
            writer.writeCommentary('Searching NHS sources for the latest information...')
          }

          for (const call of functionCalls) {
            const commentary = TOOL_COMMENTARY[call.name] ?? `Using ${call.name}`
            writer.writeCommentary(commentary)

            let args: Record<string, unknown> = {}
            try {
              args = JSON.parse(call.arguments)
            } catch {
              args = {}
            }

            const result = executeTool(call.name, args)

            const output: ResponseInputItem.FunctionCallOutput = {
              type: 'function_call_output',
              call_id: call.call_id,
              output: result.result,
            }
            input.push(output)
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

        const text = finalResponse.output_text ?? ''
        writer.writeCommentary('')

        const chunkSize = 12
        for (let i = 0; i < text.length; i += chunkSize) {
          writer.writeTextDelta(text.slice(i, i + chunkSize))
          await new Promise(resolve => setTimeout(resolve, 15))
        }

        writer.writeDone()
        writer.close()
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
