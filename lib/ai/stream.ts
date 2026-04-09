/**
 * SSE streaming utilities for the AI chat API route.
 * Encodes events in the standard text/event-stream format
 * and provides a ReadableStream wrapper for Next.js Response.
 */

export function encodeSSE(event: string, data: string): Uint8Array {
  const encoder = new TextEncoder()
  return encoder.encode(`event: ${event}\ndata: ${data}\n\n`)
}

export type StreamWriter = {
  writeTextDelta: (text: string) => void
  writeCommentary: (text: string) => void
  writeError: (message: string) => void
  writeDone: () => void
  close: () => void
}

export function createSSEStream(): { readable: ReadableStream; writer: StreamWriter } {
  let controller: ReadableStreamDefaultController<Uint8Array> | null = null

  const readable = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c
    },
  })

  const writer: StreamWriter = {
    writeTextDelta(text: string) {
      controller?.enqueue(encodeSSE('text_delta', JSON.stringify({ text })))
    },
    writeCommentary(text: string) {
      controller?.enqueue(encodeSSE('commentary', JSON.stringify({ text })))
    },
    writeError(message: string) {
      controller?.enqueue(encodeSSE('error', JSON.stringify({ message })))
    },
    writeDone() {
      controller?.enqueue(encodeSSE('done', '{}'))
    },
    close() {
      try {
        controller?.close()
      } catch {
        // already closed
      }
    },
  }

  return { readable, writer }
}
