import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const AI_MODEL = 'gpt-5.4' as const
export const REASONING_EFFORT = 'medium' as const
export const MAX_TOOL_ROUNDS = 8
