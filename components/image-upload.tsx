"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  onRemove: (url: string) => void
}

export const ImageUpload = ({ value, onChange, onRemove }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    if (files.length === 0) return

    setUploading(true)

    try {
      const uploadedUrls = []

      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload image")
        }

        const data = await response.json()
        uploadedUrls.push(data.secure_url)
      }

      onChange([...value, ...uploadedUrls])
    } catch (error) {
      console.error("Error uploading images:", error)
      alert("Error uploading images. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        {value.map((url, index) => (
          <div key={index} className="relative w-24 h-24 rounded overflow-hidden border">
            <Image src={url || "/placeholder.svg"} alt={`Uploaded image ${index + 1}`} fill className="object-cover" />
            <button
              onClick={() => onRemove(url)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
              type="button"
            >
              &times;
            </button>
          </div>
        ))}
        {value.length === 0 && (
          <div className="w-24 h-24 rounded border border-dashed flex items-center justify-center text-gray-400">
            No images
          </div>
        )}
      </div>

      <input type="file" id="upload" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
      <label htmlFor="upload">
        <Button asChild variant="secondary" disabled={uploading} type="button">
          <span className="flex items-center gap-2">
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Images"
            )}
          </span>
        </Button>
      </label>
    </div>
  )
}
