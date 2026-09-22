'use client'

import { useCallback, useEffect, useState } from 'react'
import { ALL_TASKS, STORAGE_KEY, type TaskAnswers } from '@/lib/supplierOnboarding'
import { fillAllWithSamples } from '@/lib/supplierOnboardingSampleAnswers'

/**
 * Per-task answers and completion state for the supplier onboarding task list.
 *
 * Client-side prototype: mirrored to localStorage so saved answers and the
 * Completed / Incomplete statuses survive navigation and refresh. State is
 * restored after mount (not in the initializer) so SSR and first client render
 * agree — every task renders as Incomplete until `hydrated` is true. Swap for a
 * server-backed store (Neon, as the EOI submissions use) when this holds real
 * supplier data.
 */
export type OnboardingSubmission = { reference: string; submittedAt: string }

type Progress = {
  /** taskId -> true once the task has been saved with every question answered. */
  complete: Record<string, boolean>
  /** taskId -> questionId -> answer. */
  answers: Record<string, TaskAnswers>
  /** Set once "Confirm and submit" has been pressed on Check your answers. */
  submission?: OnboardingSubmission
}

const EMPTY: Progress = { complete: {}, answers: {} }
const NO_ANSWERS: TaskAnswers = {}

/** Fired on `window` after storage is wiped so every mounted hook resets in place. */
const CLEARED_EVENT = 'hs-supplier-onboard:cleared'

/** Wipe all saved onboarding answers and statuses (footer "Clear data"). */
export function clearOnboardingProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable — in-memory state is still reset via the event.
  }
  window.dispatchEvent(new Event(CLEARED_EVENT))
}

function readStorage(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return EMPTY
    if (parsed.complete && parsed.answers) return parsed as Progress
    // Earlier prototype shape was a bare taskId -> boolean map.
    return { complete: parsed as Record<string, boolean>, answers: {} }
  } catch {
    return EMPTY
  }
}

export function useOnboardingProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setProgress(readStorage())
    setHydrated(true)
  }, [])

  useEffect(() => {
    const onCleared = () => setProgress(EMPTY)
    window.addEventListener(CLEARED_EVENT, onCleared)
    return () => window.removeEventListener(CLEARED_EVENT, onCleared)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // Storage full/unavailable — state still works in memory.
    }
  }, [hydrated, progress])

  const isComplete = useCallback(
    (taskId: string) => hydrated && progress.complete[taskId] === true,
    [hydrated, progress],
  )

  const getAnswers = useCallback(
    (taskId: string): TaskAnswers => progress.answers[taskId] ?? NO_ANSWERS,
    [progress],
  )

  /** Persist answers for a task (merged over any existing ones) and set its status. */
  const saveTask = useCallback((taskId: string, answers: TaskAnswers, complete: boolean) => {
    setProgress((p) => ({
      complete: { ...p.complete, [taskId]: complete },
      answers: { ...p.answers, [taskId]: { ...(p.answers[taskId] ?? {}), ...answers } },
    }))
  }, [])

  /**
   * Prototype shortcut ("Mark all as complete"): fills every unanswered question
   * with representative sample content (real answers are kept) and flags every
   * task Completed, so Check your answers reads like a genuine submission.
   */
  const markAllComplete = useCallback(() => {
    setProgress((p) => ({
      ...p,
      answers: fillAllWithSamples(p.answers),
      complete: Object.fromEntries(ALL_TASKS.map((t) => [t.id, true])),
    }))
  }, [])

  /** True once every task in every section is Completed (gates Submit). */
  const allComplete = hydrated && ALL_TASKS.every((t) => progress.complete[t.id] === true)

  /**
   * Record the submission (prototype: generates a reference locally; a real
   * service would POST the answers and receive one back).
   */
  const completeSubmission = useCallback((): OnboardingSubmission => {
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase()
    const submission: OnboardingSubmission = {
      reference: `HSO-${suffix}`,
      submittedAt: new Date().toISOString(),
    }
    setProgress((p) => ({ ...p, submission }))
    return submission
  }, [])

  const submission = hydrated ? progress.submission : undefined

  return {
    hydrated,
    isComplete,
    getAnswers,
    saveTask,
    markAllComplete,
    allComplete,
    submission,
    completeSubmission,
  }
}
