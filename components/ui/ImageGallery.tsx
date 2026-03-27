'use client'

import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  alt?: string
}

/**
 * Facebook-style image gallery:
 * - 1 image: full width banner
 * - 2 images: side by side
 * - 3 images: 1 big + 2 small right column
 * - 4+ images: 1 big + 3 small, with "+N more" overlay on last
 * Clicking any image opens a full-screen lightbox with prev/next navigation.
 */
export function ImageGallery({ images, alt = '' }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, [])

  const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage = useCallback(() =>
    setLightboxIndex(i => (i !== null ? (i - 1 + images.length) % images.length : null)), [images.length])
  const nextImage = useCallback(() =>
    setLightboxIndex(i => (i !== null ? (i + 1) % images.length : null)), [images.length])

  if (images.length === 0) return null

  const gridClass = (() => {
    if (images.length === 1) return 'grid-cols-1'
    if (images.length === 2) return 'grid-cols-2'
    return 'grid-cols-2'
  })()

  const showExtra = images.length > 4

  return (
    <>
      {/* Gallery grid */}
      <div className={`grid gap-1 rounded-2xl overflow-hidden ${gridClass}`} style={{ maxHeight: 480 }}>
        {images.length === 1 && (
          <GalleryCell src={images[0]} alt={alt} onClick={() => openLightbox(0)} tall />
        )}

        {images.length === 2 && (
          <>
            <GalleryCell src={images[0]} alt={alt} onClick={() => openLightbox(0)} tall />
            <GalleryCell src={images[1]} alt={alt} onClick={() => openLightbox(1)} tall />
          </>
        )}

        {images.length === 3 && (
          <>
            <GalleryCell src={images[0]} alt={alt} onClick={() => openLightbox(0)} tall />
            <div className="grid grid-rows-2 gap-1">
              <GalleryCell src={images[1]} alt={alt} onClick={() => openLightbox(1)} />
              <GalleryCell src={images[2]} alt={alt} onClick={() => openLightbox(2)} />
            </div>
          </>
        )}

        {images.length >= 4 && (
          <>
            <GalleryCell src={images[0]} alt={alt} onClick={() => openLightbox(0)} tall />
            <div className="grid grid-rows-3 gap-1">
              <GalleryCell src={images[1]} alt={alt} onClick={() => openLightbox(1)} />
              <GalleryCell src={images[2]} alt={alt} onClick={() => openLightbox(2)} />
              <div className="relative cursor-pointer group" onClick={() => openLightbox(3)}>
                <div className="w-full h-full min-h-[100px] relative overflow-hidden bg-slate-900">
                  <Image src={images[3]} alt={alt} fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                  {showExtra && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-2xl font-black drop-shadow-lg">
                        +{images.length - 4}
                      </span>
                    </div>
                  )}
                  {!showExtra && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-7 h-7 text-white drop-shadow-lg" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && mounted && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-black/98 flex items-center justify-center backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
            onClick={closeLightbox}
            aria-label="Fermer"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-black tracking-[0.2em] uppercase border border-white/10">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Prev */}
          {images.length > 1 && (
            <button
              className="absolute left-6 z-10 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 active:scale-90"
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              aria-label="Précédent"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full max-w-7xl max-h-[90vh] mx-12 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[90vh]">
              <Image
                src={images[lightboxIndex]}
                alt={`${alt} ${lightboxIndex + 1}`}
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              className="absolute right-6 z-10 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 active:scale-90"
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              aria-label="Suivant"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10 max-w-[90vw] overflow-x-auto px-6 py-3 bg-black/20 backdrop-blur-xl rounded-[2rem] border border-white/10">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    idx === lightboxIndex
                      ? 'border-white scale-110 shadow-2xl shadow-blue-500/20'
                      : 'border-white/20 opacity-40 hover:opacity-100 hover:border-white/50'
                  }`}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx) }}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  )
}

interface GalleryCellProps {
  src: string
  alt: string
  onClick: () => void
  tall?: boolean
}

function GalleryCell({ src, alt, onClick, tall }: GalleryCellProps) {
  return (
    <div
      className="relative overflow-hidden bg-slate-100 cursor-pointer group"
      style={{ minHeight: tall ? 240 : 100 }}
      onClick={onClick}
    >
      <Image src={src} alt={alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
      </div>
    </div>
  )
}
