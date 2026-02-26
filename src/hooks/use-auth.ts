"use client"
import { useRouter } from "next/navigation"

function useAuth() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.replace("/auth/sign-in")
  }
  return {
    logout: handleLogout,
  }
}

export default useAuth
