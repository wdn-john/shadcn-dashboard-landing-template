"use client"

import { create } from "zustand"
import type { MissionDetailsDTO } from "@/types/MissionDetailsDTO"
import type { MissionProgressDTO } from "@/types/MissionProgress"

type MissionSyncStore = {
  syncedDetails: MissionDetailsDTO | null
  syncedProgress: MissionProgressDTO | null
  lastEventType: string | null
  setSyncData: (
    details: MissionDetailsDTO,
    progress: MissionProgressDTO,
    eventType: string
  ) => void
}

export const useMissionSyncStore = create<MissionSyncStore>((set) => ({
  syncedDetails: null,
  syncedProgress: null,
  lastEventType: null,
  setSyncData: (syncedDetails, syncedProgress, lastEventType) =>
    set({ syncedDetails, syncedProgress, lastEventType }),
}))
