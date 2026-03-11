"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useMainSocketStore } from "@/store/mainSocketStore"
import { useChatSocketStore } from "@/store/chatSocketStore"
import { useChatStore } from "@/store/chatStore"
import { useMissionSyncStore } from "@/store/missionSyncStore"
import { useJobSyncStore } from "@/store/jobSyncStore"
import type { MissionDetailsDTO } from "@/types/MissionDetailsDTO"
import type { MissionProgressDTO } from "@/types/MissionProgress"
import type {
  JobDetailsSnapshot,
  JobProgressSnapshot,
} from "@/store/jobSyncStore"
import type { UserRole } from "@/types/auth"
import { ServiceRequest } from "@/types/ServiceRequest"
import {
  NewServiceRequestModal,
  type ServiceRequestData,
} from "@/components/new-service-request-modal"
import { useNotificationPreferenceStore } from "@/store/notificationPreferenceStore"

// ── Payload shapes ────────────────────────────────────────────────────────────

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

type NewServiceRequestPayload = {
  newServiceRequest?: {
    requestPopUpData: ServiceRequestData
    syncServiceRequest: ServiceRequest
    title?: string
    message?: string
  }
}

type NewApplicationPayload = {
  title?: string
  message?: string
  applicantName?: string
  applicantAvatarUrl?: string
  appEntryId?: number
  requestId?: number
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SocketInitializer({ role }: { role?: UserRole }) {
  // Main socket (app events)
  const mainConnect = useMainSocketStore((s) => s.connect)
  const mainDisconnect = useMainSocketStore((s) => s.disconnect)
  const mainSubscribe = useMainSocketStore((s) => s.subscribeTopic)
  const mainRegister = useMainSocketStore((s) => s.registerHandler)
  const mainUnregister = useMainSocketStore((s) => s.unregisterHandler)

  // Chat socket (chat-only events)
  const chatConnect = useChatSocketStore((s) => s.connect)
  const chatDisconnect = useChatSocketStore((s) => s.disconnect)
  const chatRegister = useChatSocketStore((s) => s.registerHandler)
  const chatUnregister = useChatSocketStore((s) => s.unregisterHandler)

  const handleEvent = useChatStore((s) => s.handleEvent)
  const setMissionSyncData = useMissionSyncStore((s) => s.setSyncData)
  const setJobSyncData = useJobSyncStore((s) => s.setSyncData)

  const notifStyle = useNotificationPreferenceStore((s) => s.notifStyle)

  const [srModalOpen, setSrModalOpen] = useState(false)
  const [srRequest, setSrRequest] = useState<ServiceRequestData | null>(null)

  const isUserExpert = role === "ROLE_EXPERT"
  const isUserClient = role === "ROLE_CLIENT"

  // ── Connect both sockets ───────────────────────────────────────────────────
  useEffect(() => {
    void mainConnect()
    void chatConnect()

    return () => {
      mainDisconnect()
      chatDisconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Chat socket handlers (chat-specific events) ───────────────────────────
  useEffect(() => {
    // The server wraps each chat event payload in a named key, e.g.:
    //   new:chat:message → { newChatMessage: { messageDto, chatListItem, ... } }
    //   typing:update    → { typingUpdate: { roomId, userId, isTyping } }
    //   presence:update  → { presenceUpdate: { ... } }
    // We must unwrap before forwarding to chatStore, mirroring the mobile ChatProvider.

    chatRegister("new:chat:message", (p) => {
      const { newChatMessage } = p as {
        newChatMessage: { messageDto: unknown }
      }
      handleEvent("new:chat:message", newChatMessage?.messageDto)
    })
    chatRegister("typing:update", (p) => {
      const { typingUpdate } = p as { typingUpdate: unknown }
      handleEvent("typing:update", typingUpdate)
    })
    chatRegister("presence:update", (p) => {
      const { presenceUpdate } = p as { presenceUpdate: unknown }
      handleEvent("presence:update", presenceUpdate)
    })

    return () => {
      chatUnregister("new:chat:message")
      chatUnregister("typing:update")
      chatUnregister("presence:update")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Main socket handlers (mission + job events) ───────────────────────────
  useEffect(() => {
    const missionHandler = (payload: unknown) => {
      const p = payload as MissionSyncPayload

      if (p.missionProgressSync) {
        const { missionDetailsDTO, missionProgressDTO } = p.missionProgressSync
        setMissionSyncData(
          missionDetailsDTO,
          missionProgressDTO,
          "mission-progress-sync"
        )
      }

      if (p.missionRevisionRequest) {
        const { missionDetailsDTO, missionProgressDTO, title, message } =
          p.missionRevisionRequest
        setMissionSyncData(
          missionDetailsDTO,
          missionProgressDTO,
          "mission-revision-request"
        )
        toast.warning(title ?? "Revision Requested", {
          description:
            message ?? "The client has requested a revision on your mission.",
        })
      }

      if (p.missionApproved) {
        const { missionDetailsDTO, missionProgressDTO, title, message } =
          p.missionApproved
        setMissionSyncData(
          missionDetailsDTO,
          missionProgressDTO,
          "mission-approved"
        )
        toast.success(title ?? "Mission Approved", {
          description:
            message ??
            "The client approved your mission. Payment has been released.",
        })
      }
    }

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
          description:
            message ??
            `${
              jobDetails.expertName ?? "Your expert"
            } has completed the work and is requesting your approval.`,
          action: {
            label: "Review",
            onClick: () => {
              window.location.href = `/jobs/${jobDetails.id}`
            },
          },
        })
      }
    }

    mainRegister("mission-progress-sync", missionHandler)
    mainRegister("mission-revision-request", missionHandler)
    mainRegister("mission-approved", missionHandler)
    mainRegister("job-progress-sync", jobHandler)
    mainRegister("job-completed", jobHandler)

    return () => {
      mainUnregister("mission-progress-sync")
      mainUnregister("mission-revision-request")
      mainUnregister("mission-approved")
      mainUnregister("job-progress-sync")
      mainUnregister("job-completed")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Main socket: new service request (experts & admins only) ─────────────
  useEffect(() => {
    if (!isUserExpert) return

    mainSubscribe("new-service-request")

    const handler = (payload: unknown) => {
      const p = payload as NewServiceRequestPayload
      if (!p.newServiceRequest?.requestPopUpData) return
      const req = p.newServiceRequest.requestPopUpData

      if (notifStyle === "toast") {
        toast.info(req.title, {
          description: (
            <div className="flex items-start gap-2.5 mt-1">
              {req.avatarUrl ? (
                <img
                  src={req.avatarUrl}
                  alt={req.submittedBy}
                  className="size-7 rounded-full object-cover shrink-0 mt-0.5"
                />
              ) : (
                <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-semibold">
                  {req.submittedBy?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-medium leading-none mb-1">
                  {req.submittedBy}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
                  {req.description}
                </p>
              </div>
            </div>
          ),
          duration: 8_000,
          action: {
            label: "View",
            onClick: () => {
              window.location.href = `/browse-requests/${req.id}`
            },
          },
        })
      } else {
        setSrRequest(req)
        setSrModalOpen(true)
      }
    }

    mainRegister("new-service-request", handler)

    return () => {
      mainUnregister("new-service-request")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserExpert, notifStyle])

  // ── Main socket: new application (clients only) ───────────────────────────
  useEffect(() => {
    if (!isUserClient) return

    const handler = (payload: unknown) => {
      const p = payload as NewApplicationPayload
      console.log("Application ==>", p)
      toast.info("New Application", {
        description: (
          <div className="flex items-start gap-2.5 mt-1">
            <div className="min-w-0">
              <p className="text-xs font-medium leading-none mb-1">
                {p.applicantName}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
                {p.message}
              </p>
            </div>
          </div>
        ),
        duration: 8_000,
        action: p.requestId
          ? {
              label: "View",
              onClick: () => {
                window.location.href = `/requests/${p.requestId}`
              },
            }
          : undefined,
      })
    }

    mainRegister("new-application", handler)

    return () => {
      mainUnregister("new-application")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserClient])

  return (
    <NewServiceRequestModal
      open={srModalOpen}
      request={srRequest}
      onClose={() => setSrModalOpen(false)}
    />
  )
}
