'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import ChatMessage from '@/components/ai/ChatMessage'
import ChatInput from '@/components/ai/ChatInput'
import { BotMessageSquare, Sparkles } from 'lucide-react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type ClientProfile = {
  commissionerName: string
  roleTitle: string
  icbName: string
  region: string
  starterPrompts: { label: string; prompt: string }[]
}

export default function AiChatClient({ profile }: { profile: ClientProfile }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [commentary, setCommentary] = useState('')
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const idCounter = useRef(0)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, commentary, scrollToBottom])

  const sendMessage = useCallback(
    async (content: string) => {
      if (isLoading) return

      const userMsg: Message = {
        id: `msg-${++idCounter.current}`,
        role: 'user',
        content,
      }

      const newMessages = [...messages, userMsg]
      setMessages(newMessages)
      setIsLoading(true)
      setCommentary('')
      setError(null)

      const assistantId = `msg-${++idCounter.current}`

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages.map(m => ({
              role: m.role,
              content: m.content,
            })),
          }),
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => null)
          throw new Error(errData?.error ?? `Request failed (${res.status})`)
        }

        const reader = res.body?.getReader()
        if (!reader) throw new Error('No response stream')

        const decoder = new TextDecoder()
        let buffer = ''
        let assistantText = ''
        let assistantMessageAdded = false

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          let eventType = ''
          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7).trim()
            } else if (line.startsWith('data: ')) {
              const dataStr = line.slice(6)
              try {
                const data = JSON.parse(dataStr)
                if (eventType === 'text_delta' && data.text) {
                  if (!assistantMessageAdded) {
                    assistantMessageAdded = true
                    setCommentary('')
                    setMessages(prev => [
                      ...prev,
                      { id: assistantId, role: 'assistant', content: '' },
                    ])
                  }
                  assistantText += data.text
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === assistantId ? { ...m, content: assistantText } : m,
                    ),
                  )
                } else if (eventType === 'commentary' && data.text !== undefined) {
                  setCommentary(data.text)
                } else if (eventType === 'error') {
                  throw new Error(data.message ?? 'Unknown error')
                }
              } catch (e) {
                if (e instanceof Error && e.message !== 'Unknown error') {
                  if (eventType === 'error') throw e
                }
              }
            }
          }
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Something went wrong'
        setError(msg)
        setMessages(prev => prev.filter(m => m.id !== assistantId))
      } finally {
        setIsLoading(false)
        setCommentary('')
      }
    },
    [messages, isLoading],
  )

  const isEmpty = messages.length === 0

  return (
    <div className="flex h-full flex-col">
      {/* Scrollable message area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center pt-12 pb-8">
              <div
                className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: '#E6F0FB' }}
              >
                <BotMessageSquare
                  className="h-8 w-8"
                  style={{ color: 'var(--nhs-blue)' }}
                />
              </div>
              <h1
                className="mb-1 text-2xl font-bold"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'Frutiger, Arial, sans-serif',
                }}
              >
                Hello, {profile.commissionerName}
              </h1>
              <p
                className="mb-1 text-sm font-medium"
                style={{ color: 'var(--nhs-blue)' }}
              >
                {profile.roleTitle}
              </p>
              <p
                className="mb-6 text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                {profile.icbName} &middot; {profile.region}
              </p>
              <p
                className="mb-8 max-w-md text-center text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                I can help you explore digital health options, model costs for your
                population, find funding, and work through implementation planning.
                Tell me what you&rsquo;re working on.
              </p>
              <div className="grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
                {profile.starterPrompts.map(s => (
                  <button
                    key={s.label}
                    onClick={() => sendMessage(s.prompt)}
                    disabled={isLoading}
                    className="group flex items-start gap-2.5 rounded-xl border px-4 py-3 text-left text-sm transition-all hover:shadow-sm"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--card)',
                      color: 'var(--text-primary)',
                      fontFamily: 'Frutiger, Arial, sans-serif',
                    }}
                  >
                    <Sparkles
                      className="mt-0.5 h-4 w-4 flex-shrink-0"
                      style={{ color: 'var(--nhs-blue)' }}
                    />
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
              <p
                className="mt-8 text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                Data sourced from HealthStore catalogue. Verify all information with
                suppliers before procurement decisions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(m => (
                <ChatMessage key={m.id} role={m.role} content={m.content} />
              ))}
              {error && (
                <div
                  className="rounded-lg border px-4 py-3 text-sm"
                  style={{
                    borderColor: 'var(--nhs-red)',
                    background: '#FEF2F2',
                    color: 'var(--nhs-red)',
                  }}
                >
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Commentary line + sticky input bar */}
      <div className="flex-shrink-0">
        {commentary && (
          <div className="px-4">
            <div className="mx-auto flex max-w-3xl items-center gap-2 py-2">
              <span className="ai-thinking-dot" />
              <span
                className="text-xs"
                style={{ color: 'var(--text-muted)', fontFamily: 'Frutiger, Arial, sans-serif' }}
              >
                {commentary}
              </span>
            </div>
          </div>
        )}
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}
