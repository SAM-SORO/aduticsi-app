'use client'

import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { X, Check, RotateCcw } from 'lucide-react'

interface ImageCropperProps {
  image: string
  onCropComplete: (croppedImage: Blob) => void
  onCancel: () => void
  circular?: boolean
}

export function ImageCropper({ image, onCropComplete, onCancel, circular = true }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onCropCompleteInternal = useCallback((_ref: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
    })

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any
  ): Promise<Blob> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
      }, 'image/jpeg')
    })
  }

  const handleDone = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels)
      onCropComplete(croppedImage)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Recadrer votre photo</h3>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="relative h-80 bg-slate-100">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape={circular ? 'round' : 'rect'}
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-slate-600">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--aduti-primary)]"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setCrop({ x: 0, y: 0 })
                setZoom(1)
              }}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </button>
            <button
              onClick={handleDone}
              className="flex-1 px-6 py-2 bg-[var(--aduti-primary)] text-white font-bold rounded-xl hover:bg-[var(--aduti-primary-hover)] transition-all shadow-lg shadow-[var(--aduti-primary)]/20 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
