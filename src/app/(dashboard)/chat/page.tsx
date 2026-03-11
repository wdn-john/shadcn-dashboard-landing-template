import { getSession } from "@/lib/server/getSession"
import { ChatPageClient } from "./components/chat-page-client"

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ room?: string }>
}) {
  const [session, params] = await Promise.all([getSession(), searchParams])
  const userId = String(session.user?.id ?? "")

  return <ChatPageClient userId={userId} defaultRoomId={params.room} />
}
