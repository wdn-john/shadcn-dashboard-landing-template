"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { useChatSocketStore } from "@/store/chatSocketStore"
import { useChatStore } from "@/store/chatStore"
import { useMissionSyncStore } from "@/store/missionSyncStore"
import { useJobSyncStore } from "@/store/jobSyncStore"
import type { MissionDetailsDTO } from "@/types/MissionDetailsDTO"
import type { MissionProgressDTO } from "@/types/MissionProgress"
import type { JobDetailsSnapshot, JobProgressSnapshot } from "@/store/jobSyncStore"

// ── Payload shapes (mirror mobile's MissionProvider / JobProvider) ──

type MissionSyncPayload = {
  missionProgressSync?: {
    missionDetailsDTO: MissionDetailsDTO
    missionProgressDTO: MissionProgressDTO
  }
  missionRevisionRequest?: {
    missionDetailsDTO: MissionDetailsDTO
    missionProgressDTO: MissionProgressDTO
    title?: string
    message?: string
  }
  missionApproved?: {
    missionDetailsDTO: MissionDetailsDTO
    missionProgressDTO: MissionProgressDTO
    title?: string
    message?: string
  }
}

type JobSyncPayload = {
  jobProgressSync?: {
    jobDetails: JobDetailsSnapshot
    jobProgress: JobProgressSnapshot
  }
  jobCompleted?: {
    jobDetails: JobDetailsSnapshot
    jobProgress: JobProgressSnapshot
    title?: string
    message?: string
  }
}

/**
 * Mounts in the dashboard layout.
 * Opens the WebSocket connection and wires all event handlers:
 * - Chat events (messages, typing, presence)
 * - Mission events for the expert: mission-progress-sync, mission-revision-request, mission-approved
 * - Job events for the client: job-progress-sync, job-completed
 */
export function ChatInitializer() {
  const connect = useChatSocketStore((s) => s.connect)
  const disconnect = useChatSocketStore((s) => s.disconnect)
  const registerHandler = useChatSocketStore((s) => s.registerHandler)
  const unregisterHandler = useChatSocketStore((s) => s.unregisterHandler)
  const handleEvent = useChatStore((s) => s.handleEvent)
  const setMissionSyncData = useMissionSyncStore((s) => s.setSyncData)
  const setJobSyncData = useJobSyncStore((s) => s.setSyncData)

  useEffect(() => {
    void connect()

    // ── Chat events ──
    registerHandler("new:chat:message", (p) => handleEvent("new:chat:message", p))
    registerHandler("typing:update", (p) => handleEvent("typing:update", p))
    registerHandler("presence:update", (p) => handleEvent("presence:update", p))

    // ── Mission events (expert-side) ──
    const missionHandler = (payload: unknown) => {
      const p = payload as MissionSyncPayload

      if (p.missionProgressSync) {
        const { missionDetailsDTO, missionProgressDTO } = p.missionProgressSync
        setMissionSyncData(missionDetailsDTO, missionProgressDTO, "mission-progress-sync")
      }

      if (p.missionRevisionRequest) {
        const { missionDetailsDTO, missionProgressDTO, title, message } = p.missionRevisionRequest
        setMissionSyncData(missionDetailsDTO, missionProgressDTO, "mission-revision-request")
        toast.warning(title ?? "Revision Requested", {
          description: message ?? "The client has requested a revision on your mission.",
        })
      }

      if (p.missionApproved) {
        const { missionDetailsDTO, missionProgressDTO, title, message } = p.missionApproved
        setMissionSyncData(missionDetailsDTO, missionProgressDTO, "mission-approved")
        toast.success(title ?? "Mission Approved", {
          description: message ?? "The client approved your mission. Payment has been released.",
        })
      }
    }

    // ── Job events (client-side) ──
    const jobHandler = (payload: unknown) => {
      const p = payload as JobSyncPayload

      if (p.jobProgressSync) {
        const { jobDetails, jobProgress } = p.jobProgressSync
        setJobSyncData(jobDetails, jobProgress, "job-progress-sync")
      }

      if (p.jobCompleted) {
        const { jobDetails, jobProgress, title, message } = p.jobCompleted
        setJobSyncData(jobDetails, jobProgress, "job-completed")
        toast.info(title ?? "Approval Required", {
          description: message ?? `${jobDetails.expertName ?? "Your expert"} has completed the work and is requesting your approval.`,
          action: {
            label: "Review",
            onClick: () => { window.location.href = `/jobs/${jobDetails.id}` },
          },
        })
      }
    }

    registerHandler("mission-progress-sync", missionHandler)
    registerHandler("mission-revision-request", missionHandler)
    registerHandler("mission-approved", missionHandler)
    registerHandler("job-progress-sync", jobHandler)
    registerHandler("job-completed", jobHandler)

    return () => {
      unregisterHandler("new:chat:message")
      unregisterHandler("typing:update")
      unregisterHandler("presence:update")
      unregisterHandler("mission-progress-sync")
      unregisterHandler("mission-revision-request")
      unregisterHandler("mission-approved")
      unregisterHandler("job-progress-sync")
      unregisterHandler("job-completed")
      disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
