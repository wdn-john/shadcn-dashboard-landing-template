"use client"

import { create } from "zustand"

export type JobDetailsSnapshot = {
  id: number
  progressId?: number
  title?: string
  status: string
  expertName?: string
  expertProfession?: string
}

export type JobProgressSnapshot = {
  id: number
  status: string
  isCompleted: boolean
  completionPercentage: number
  currentStep: number
  steps: Array<{
    id: number
    title: { en: string; fr: string }
    summary: { en: string; fr: string }
    status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "BLOCKED" | "SKIPPED"
    note: { text: string } | null
    orderIndex: number
  }>
}

type JobSyncStore = {
  syncedJobDetails: JobDetailsSnapshot | null
  syncedJobProgress: JobProgressSnapshot | null
  lastEventType: string | null
  setSyncData: (
    details: JobDetailsSnapshot,
    progress: JobProgressSnapshot,
    eventType: string
  ) => void
}

export const useJobSyncStore = create<JobSyncStore>((set) => ({
  syncedJobDetails: null,
  syncedJobProgress: null,
  lastEventType: null,
  setSyncData: (syncedJobDetails, syncedJobProgress, lastEventType) =>
    set({ syncedJobDetails, syncedJobProgress, lastEventType }),
}))
