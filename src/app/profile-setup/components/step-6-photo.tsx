"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProfileSetupStore } from "@/store/profileSetupStore"
import { Camera, X } from "lucide-react"

export function Step6Photo() {
  const { personal, avatar, setAvatar, nextStep, prevStep } = useProfileSetupStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>(avatar.previewUrl)

  const initials = [personal.firstName[0], personal.lastName[0]].filter(Boolean).join("").toUpperCase() || "?"

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)

    const base64 = await toBase64(file)
    setAvatar({
      base64,
      filename: file.name,
      mimeType: file.type,
      previewUrl,
    })
  }

  function handleRemove() {
    setPreview("")
    setAvatar({ base64: "", filename: "", mimeType: "", previewUrl: "" })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <Avatar className="size-32">
            <AvatarImage src={preview} />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="size-4" />
          {preview ? "Change photo" : "Upload photo"}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          Optional — JPG, PNG or WebP, max 5MB. <br />
          You can always update this later from your profile settings.
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <div className="flex gap-3">
          {!preview && <Button variant="ghost" onClick={nextStep}>Skip</Button>}
          <Button onClick={nextStep}>{preview ? "Continue" : "Continue without photo"}</Button>
        </div>
      </div>
    </div>
  )
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(",")[1]) // strip data:...;base64, prefix
    }
    reader.onerror = reject
  })
}
