'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { ExternalLink } from 'lucide-react'

type Props = {
  role: 'user' | 'assistant'
  content: string
}

const mdComponents: Components = {
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-3">
      <table
        className="w-full text-sm border-collapse"
        style={{ borderColor: 'var(--border)' }}
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead style={{ background: 'var(--surface)' }} {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th
      className="px-3 py-2 text-left text-xs font-semibold border-b"
      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="px-3 py-2 text-sm border-b"
      style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
      {...props}
    >
      {children}
    </td>
  ),
  a: ({ children, href, ...props }) => {
    const isExternal = href?.startsWith('http')
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="inline-flex items-center gap-0.5 underline decoration-1 underline-offset-2"
        style={{ color: 'var(--nhs-blue)' }}
        {...props}
      >
        {children}
        {isExternal && <ExternalLink className="inline h-3 w-3 flex-shrink-0" />}
      </a>
    )
  },
  strong: ({ children, ...props }) => (
    <strong style={{ color: 'var(--text-primary)' }} {...props}>
      {children}
    </strong>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-5 my-2 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-5 my-2 space-y-1" {...props}>
      {children}
    </ol>
  ),
  p: ({ children, ...props }) => (
    <p className="my-2 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-base font-bold mt-4 mb-1" style={{ color: 'var(--text-primary)' }} {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="text-sm font-bold mt-3 mb-1" style={{ color: 'var(--text-primary)' }} {...props}>
      {children}
    </h4>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-3 pl-3 my-2 italic"
      style={{ borderColor: 'var(--nhs-blue)', color: 'var(--text-secondary)' }}
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: ({ ...props }) => (
    <hr className="my-4" style={{ borderColor: 'var(--border)' }} {...props} />
  ),
}

export default function ChatMessage({ role, content }: Props) {
  if (!content) return null

  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed"
          style={{
            background: 'var(--nhs-blue)',
            color: '#fff',
            fontFamily: 'Frutiger, Arial, sans-serif',
          }}
        >
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div
        className="max-w-[90%] rounded-2xl rounded-bl-md border px-4 py-3 text-sm leading-relaxed"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)',
          fontFamily: 'Frutiger, Arial, sans-serif',
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
