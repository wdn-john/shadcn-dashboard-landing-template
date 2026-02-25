import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile Setup — Workedin",
}

export default function ProfileSetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      {children}
    </div>
  )
}
