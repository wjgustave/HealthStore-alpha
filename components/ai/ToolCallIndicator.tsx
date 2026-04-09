'use client'

const TOOL_LABELS: Record<string, string> = {
  search_apps: 'Searching apps',
  get_app_detail: 'Loading app details',
  get_app_financials: 'Looking up financials',
  compare_apps: 'Comparing apps',
  list_funding: 'Checking funding',
  get_funding_detail: 'Loading funding details',
  get_condition_overview: 'Reviewing condition area',
  get_enums: 'Loading definitions',
}

type Props = {
  toolCalls: string[]
}

export default function ToolCallIndicator({ toolCalls }: Props) {
  if (!toolCalls.length) return null

  return (
    <div className="flex justify-start">
      <div className="flex flex-wrap items-center gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="ai-thinking-dot" />
          <span
            className="text-xs font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            Thinking
          </span>
        </div>
        {toolCalls.map((tool, i) => (
          <span
            key={`${tool}-${i}`}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{
              background: '#E6F0FB',
              color: 'var(--nhs-blue)',
            }}
          >
            <span className="ai-pulse-dot" />
            {TOOL_LABELS[tool] ?? tool}
          </span>
        ))}
      </div>
    </div>
  )
}
