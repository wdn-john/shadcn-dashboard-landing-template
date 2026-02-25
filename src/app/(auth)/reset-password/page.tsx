import { ResetPasswordForm } from "./components/reset-password-form"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token = "" } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ResetPasswordForm token={token} className="w-full max-w-5xl" />
    </div>
  )
}
