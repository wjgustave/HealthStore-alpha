'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'
import { sortPdpShareBlocksByPageOrder } from '@/lib/pdpShareKeys'

export type PrintLayout =
  | { mode: 'none' }
  | { mode: 'all' }
  | { mode: 'include'; keys: ReadonlySet<string> }

export type ShareRegisteredBlock = { key: string; label: string; description?: string }

type BlockMeta = { label: string; description?: string }

type PdpSharePrintContextValue = {
  /** Current print layout; drives expand/hide during print. */
  printLayout: PrintLayout
  /** Register a shareable block; returns cleanup. */
  registerBlock: (key: string, label: string, description?: string) => () => void
  /** Ordered list for the Share modal (PDP visual order; sidebar last). */
  registeredBlocks: ShareRegisteredBlock[]
  /** Apply selection and open the system print dialog. */
  beginModalPrint: (keys: Set<string>) => void
}

const PdpSharePrintContext = createContext<PdpSharePrintContextValue | null>(null)

export function usePdpSharePrint(): PdpSharePrintContextValue {
  const v = useContext(PdpSharePrintContext)
  if (!v) {
    throw new Error('usePdpSharePrint must be used within PdpSharePrintProvider')
  }
  return v
}

/** Optional: expanders used outside PDP provider keep working. */
export function usePdpSharePrintOptional(): PdpSharePrintContextValue | null {
  return useContext(PdpSharePrintContext)
}

export function PdpSharePrintProvider({ children }: { children: ReactNode }) {
  const [printLayout, setPrintLayout] = useState<PrintLayout>({ mode: 'none' })
  const [blocks, setBlocks] = useState<Map<string, BlockMeta>>(() => new Map())
  /** When true, `beforeprint` must not upgrade `none` → `all` (modal already set `include`). */
  const selectivePrintFromModalRef = useRef(false)

  const registerBlock = useCallback((key: string, label: string, description?: string) => {
    setBlocks(prev => {
      const cur = prev.get(key)
      if (cur?.label === label && cur?.description === description) return prev
      const next = new Map(prev)
      next.set(key, { label, description })
      return next
    })
    return () => {
      setBlocks(prev => {
        if (!prev.has(key)) return prev
        const next = new Map(prev)
        next.delete(key)
        return next
      })
    }
  }, [])

  const registeredBlocks = useMemo(
    () =>
      sortPdpShareBlocksByPageOrder(
        Array.from(blocks.entries()).map(([key, meta]) => ({
          key,
          label: meta.label,
          description: meta.description,
        })),
      ),
    [blocks],
  )

  const beginModalPrint = useCallback((keys: Set<string>) => {
    selectivePrintFromModalRef.current = true
    flushSync(() => setPrintLayout({ mode: 'include', keys }))
    requestAnimationFrame(() => {
      window.print()
    })
  }, [])

  useEffect(() => {
    const onBefore = () => {
      flushSync(() => {
        if (selectivePrintFromModalRef.current) {
          return
        }
        setPrintLayout(prev => {
          if (prev.mode === 'none') return { mode: 'all' }
          return prev
        })
      })
    }
    const onAfter = () => {
      selectivePrintFromModalRef.current = false
      setPrintLayout({ mode: 'none' })
    }
    window.addEventListener('beforeprint', onBefore)
    window.addEventListener('afterprint', onAfter)
    return () => {
      window.removeEventListener('beforeprint', onBefore)
      window.removeEventListener('afterprint', onAfter)
    }
  }, [])

  const value = useMemo(
    () => ({
      printLayout,
      registerBlock,
      registeredBlocks,
      beginModalPrint,
    }),
    [printLayout, registerBlock, registeredBlocks, beginModalPrint],
  )

  return (
    <PdpSharePrintContext.Provider value={value}>{children}</PdpSharePrintContext.Provider>
  )
}

/**
 * Wrapper that registers a shareable region (e.g. hero) and hides it in print when excluded.
 * Use `excludeFromShareUi` for blocks that must never appear in the Share checklist, share links, or selective PDF.
 */
export function PdpShareRegion({
  shareKey,
  label,
  description,
  className = '',
  excludeFromShareUi = false,
  children,
}: {
  shareKey: string
  label: string
  /** Shown as subline in Share modal checklist (optional). */
  description?: string
  className?: string
  /** Omit from Share modal / link keys; always hidden for selective (modal) print. */
  excludeFromShareUi?: boolean
  children: ReactNode
}) {
  const { printLayout, registerBlock } = usePdpSharePrint()

  useEffect(() => {
    if (excludeFromShareUi) return undefined
    return registerBlock(shareKey, label, description)
  }, [shareKey, label, description, registerBlock, excludeFromShareUi])

  const hideForPrint =
    printLayout.mode !== 'none' &&
    (excludeFromShareUi ||
      (printLayout.mode === 'include' && !printLayout.keys.has(shareKey)))

  return (
    <div className={`${hideForPrint ? 'pdp-share-excluded-print ' : ''}${className}`.trim()}>
      {children}
    </div>
  )
}
