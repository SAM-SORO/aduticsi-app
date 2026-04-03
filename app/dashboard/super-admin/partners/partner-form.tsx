'use client'

import React, { useState, useRef, useTransition } from 'react'
import Image from 'next/image'
import { Plus, X, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { createPartner } from './actions'
import logger from '@/lib/logger'

export function PartnerForm() {
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setIsPreviewing(true)
  }

  const handleClearPreview = () => {
    setPreviewUrl(null)
    setIsPreviewing(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      try {
        const result = await createPartner(formData)
        if (result.success) {
          toast.success('Partenaire ajouté avec succès')
          formRef.current?.reset()
          handleClearPreview()
        } else {
          toast.error('Erreur lors de l’ajout du partenaire')
        }
      } catch (err) {
        logger.error({ err }, 'Error in PartnerForm submission');
        toast.error('Une erreur est survenue')
      }
    })
  }

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full outline outline-1 outline-white/20">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-slate-100 rounded-full" />
              <div className="w-16 h-16 border-4 border-[var(--aduti-primary)] border-t-transparent rounded-full animate-spin absolute inset-0" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ajout en cours...</h3>
            <p className="text-sm text-slate-500 text-center">
              Veuillez patienter pendant l&apos;upload du logo et la création du partenaire.
            </p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[var(--aduti-primary)]" />
            Nouveau Partenaire
          </h3>
        </div>
        
        <form ref={formRef} onSubmit={onSubmit} className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nom du partenaire</label>
            <input 
              type="text" 
              name="name" 
              required
              placeholder="ex: Google, Microsoft..." 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--aduti-primary)] focus:border-[var(--aduti-primary)] outline-none text-sm transition-all"
            />
          </div>


          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Logo du partenaire</label>
            
            {isPreviewing && previewUrl ? (
              <div className="relative h-32 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden group">
                <Image 
                  src={previewUrl} 
                  alt="Preview" 
                  fill 
                  className="object-contain p-4"
                />
                <button
                  type="button"
                  onClick={handleClearPreview}
                  className="absolute top-2 right-2 p-1.5 bg-white shadow-md rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 hover:border-[var(--aduti-primary)]/30 transition-all text-slate-400 hover:text-slate-600 group"
              >
                <div className="size-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-xs font-medium">Cliquez pour uploader le logo</span>
                <span className="text-[10px] text-slate-400">PNG, JPG up to 5MB</span>
              </button>
            )}

            <input 
              ref={fileInputRef}
              type="file" 
              name="image" 
              accept="image/*"
              required
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-[var(--aduti-primary)] text-white rounded-lg font-bold text-sm hover:brightness-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--aduti-primary)]/10"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Chargement...
              </>
            ) : (
              'Ajouter le partenaire'
            )}
          </button>
        </form>
      </div>
    </>
  )
}
