'use client'

import { useState } from 'react'
import Image from 'next/image'
import { UploadCloud, X, Plus, Link as LinkIcon, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlField, setShowUrlField] = useState(false)
  const supabase = createClient()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newUrls: string[] = []

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        const filePath = `products/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file)

        if (uploadError) {
          throw uploadError
        }

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        if (data?.publicUrl) {
          newUrls.push(data.publicUrl)
        }
      }

      onChange([...images, ...newUrls])
      toast.success(`${newUrls.length} image(s) uploadée(s)`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'upload"
      toast.error(
        `Upload échoué : ${msg}. Vous pouvez aussi coller une URL d'image directe.`
      )
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleAddUrl = () => {
    if (!urlInput.trim()) return
    onChange([...images, urlInput.trim()])
    setUrlInput('')
    setShowUrlField(false)
    toast.success('Image ajoutée')
  }

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* Previews Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-[3/4] bg-gray-100 border border-gray-200 group overflow-hidden"
            >
              <Image
                src={url}
                alt={`Image ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white p-1 transition-colors"
                title="Supprimer l'image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-2 left-2 bg-black text-white text-[10px] tracking-widest uppercase px-2 py-0.5 font-medium">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 hover:border-black cursor-pointer transition-colors bg-gray-50/50">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>Upload en cours vers Supabase...</span>
            </div>
          ) : (
            <div className="text-center">
              <UploadCloud className="w-6 h-6 text-gray-500 mx-auto mb-2" />
              <p className="text-xs font-medium uppercase tracking-wider text-black">
                Téléverser des photos
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                PNG, JPG ou WEBP (Supabase Storage)
              </p>
            </div>
          )}
        </label>

        <button
          type="button"
          onClick={() => setShowUrlField(!showUrlField)}
          className="sm:w-44 border border-gray-300 hover:border-black p-4 flex flex-col items-center justify-center text-center transition-colors text-xs uppercase tracking-wider text-black bg-white"
        >
          <LinkIcon className="w-5 h-5 mb-1 text-gray-500" />
          <span>Ajouter via URL</span>
        </button>
      </div>

      {/* URL Input field fallback */}
      {showUrlField && (
        <div className="flex gap-2 p-3 bg-gray-50 border border-gray-200">
          <input
            type="url"
            placeholder="https://images.unsplash.com/... ou URL d'image"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 border border-gray-300 px-3 py-2 text-xs outline-none focus:border-black bg-white"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-gray-800"
          >
            Ajouter
          </button>
        </div>
      )}
    </div>
  )
}
