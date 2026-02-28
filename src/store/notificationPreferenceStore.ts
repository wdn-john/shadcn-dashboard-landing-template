import { create } from "zustand"
import { persist } from "zustand/middleware"

export type NotifStyle = "modal" | "toast"

interface NotificationPreferenceStore {
  notifStyle: NotifStyle
  toggle: () => void
}

export const useNotificationPreferenceStore =
  create<NotificationPreferenceStore>()(
    persist(
      (set, get) => ({
        notifStyle: "modal",
        toggle: () =>
          set({
            notifStyle: get().notifStyle === "modal" ? "toast" : "modal",
          }),
      }),
      { name: "workedin-notification-preference" }
    )
  )
