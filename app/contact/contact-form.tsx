'use client'

import { useTransition } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Turnstile } from '@marsidev/react-turnstile'
import { MaterialIcon } from '@/components/icons/material-icon'
import { sendContactMessage } from './actions'

const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom est trop long (max 100)'),
  email: z.string().email('Email invalide').max(150, 'Email trop long').optional().or(z.literal('')),
  phone: z.string().regex(/^\+?[0-9\s\-()]{8,20}$/, 'Format de téléphone invalide').optional().or(z.literal('')),
  subject: z.enum(['information', 'partenariat', 'evenement', 'support', 'autre'], {
    message: 'Veuillez sélectionner un sujet valide'
  }),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(2000, 'Message trop long (max 2000)'),
}).refine(data => data.email || data.phone, {
  message: "Veuillez renseigner au moins un email ou un contact",
  path: ["email"]
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaKey, setCaptchaKey] = useState(0) // Forces Turnstile remount
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = (data: ContactFormData) => {
    if (!captchaToken) {
      toast.error('Veuillez valider le captcha.')
      return
    }

    startTransition(async () => {
      // Clean empty strings to undefined
      const submissionData = {
        ...data,
        email: data.email || undefined,
        phone: data.phone || undefined,
        captchaToken,
      }
      const result = await sendContactMessage(submissionData)
      
      // Reset captcha visual widget no matter what
      setCaptchaToken(null)
      setCaptchaKey(prev => prev + 1)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(result.message)
        reset()
      }
    })
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6 bg-white p-8 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-100"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          Nom complet
        </label>
        <input
          {...register('name')}
          id="name"
          type="text"
          disabled={isPending}
          className="block w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:border-[var(--aduti-primary)] focus:ring-[var(--aduti-primary)] sm:text-sm disabled:opacity-70"
        />
        {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            disabled={isPending}
            className="block w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:border-[var(--aduti-primary)] focus:ring-[var(--aduti-primary)] sm:text-sm disabled:opacity-70"
          />
          {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="phone">
            Contact (Téléphone)
          </label>
          <input
            {...register('phone')}
            id="phone"
            type="text"
            disabled={isPending}
            className="block w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:border-[var(--aduti-primary)] focus:ring-[var(--aduti-primary)] sm:text-sm disabled:opacity-70"
          />
          {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="subject">
          Objet de la demande
        </label>
        <select
          {...register('subject')}
          id="subject"
          disabled={isPending}
          className="block w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:border-[var(--aduti-primary)] focus:ring-[var(--aduti-primary)] sm:text-sm disabled:opacity-70"
          defaultValue=""
        >
          <option value="">Sélectionnez un sujet</option>
          <option value="information">Information</option>
          <option value="partenariat">Proposition de partenariat</option>
          <option value="evenement">Événements ADUTI</option>
          <option value="support">Support technique site web</option>
          <option value="autre">Autre demande</option>
        </select>
        {errors.subject && <p className="text-xs text-red-500 font-medium">{errors.subject.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="message">
          Votre message
        </label>
        <textarea
          {...register('message')}
          id="message"
          rows={5}
          disabled={isPending}
          className="block w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:border-[var(--aduti-primary)] focus:ring-[var(--aduti-primary)] sm:text-sm disabled:opacity-70"
        />
        {errors.message && <p className="text-xs text-red-500 font-medium">{errors.message.message}</p>}
      </div>

      <div className="pt-2">
        {turnstileSiteKey ? (
          <div className="mb-4 flex justify-center">
            <Turnstile
              key={captchaKey}
              siteKey={turnstileSiteKey}
              onSuccess={(token) => setCaptchaToken(token)}
              options={{ theme: 'light', size: 'normal' }}
            />
          </div>
        ) : (
          <p className="mb-4 text-xs text-amber-600 font-medium">
            Captcha non configuré. Définissez <code>NEXT_PUBLIC_TURNSTILE_SITE_KEY</code>.
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center py-3.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[var(--aduti-primary)] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--aduti-primary)] transition-all disabled:opacity-70"
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi en cours...
            </>
          ) : (
            <>
              Envoyer le message
              <MaterialIcon name="send" className="ml-2 w-[18px] h-[18px]" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
