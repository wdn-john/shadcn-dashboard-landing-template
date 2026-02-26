"use client"

import { useCallback, useRef, useState } from "react"
import Cropper from "react-easy-crop"
import type { Area } from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { useProfileSetupStore } from "@/store/profileSetupStore"
import { Camera, X, ZoomIn } from "lucide-react"

export function Step6Photo() {
  const { personal, avatar, setAvatar, nextStep, prevStep } = useProfileSetupStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [preview, setPreview] = useState<string>(avatar.previewUrl)

  // Cropper dialog state
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropFilename, setCropFilename] = useState("")
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const initials = [personal.firstName[0], personal.lastName[0]].filter(Boolean).join("").toUpperCase() || "?"

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCropFilename(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      setCropSrc(reader.result as string)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
    }
    reader.readAsDataURL(file)
    // Reset input so the same file can be re-selected
    e.target.value = ""
  }

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  async function handleApplyCrop() {
    if (!cropSrc || !croppedAreaPixels) return
    const { base64, previewUrl } = await getCroppedImage(cropSrc, croppedAreaPixels)
    setPreview(previewUrl)
    setAvatar({ base64, filename: cropFilename, mimeType: "image/jpeg", previewUrl })
    setCropSrc(null)
  }

  function handleRemove() {
    setPreview("")
    setAvatar({ base64: "", filename: "", mimeType: "", previewUrl: "" })
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

      {/* Crop dialog */}
      <Dialog open={!!cropSrc} onOpenChange={(open) => { if (!open) setCropSrc(null) }}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Crop your photo</DialogTitle>
          </DialogHeader>

          {/* Cropper canvas */}
          <div className="relative h-72 bg-black">
            {cropSrc && (
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          {/* Zoom slider */}
          <div className="px-6 py-4 space-y-2">
            <div className="flex items-center gap-3">
              <ZoomIn className="size-4 text-muted-foreground shrink-0" />
              <Slider
                min={1}
                max={3}
                step={0.05}
                value={[zoom]}
                onValueChange={([v]) => setZoom(v)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">Drag to reposition · Scroll or slide to zoom</p>
          </div>

          <DialogFooter className="px-6 pb-6 gap-2">
            <Button variant="outline" onClick={() => setCropSrc(null)}>Cancel</Button>
            <Button onClick={handleApplyCrop}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

async function getCroppedImage(src: string, pixelCrop: Area): Promise<{ base64: string; previewUrl: string }> {
  const image = await loadImage(src)
  const canvas = document.createElement("canvas")
  const size = 512 // output size
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Canvas toBlob failed"))
      const previewUrl = URL.createObjectURL(blob)
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1]
        resolve({ base64, previewUrl })
      }
      reader.onerror = reject
    }, "image/jpeg", 0.92)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
