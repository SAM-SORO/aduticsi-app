'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { ContactMessage } from '@prisma/client'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { deleteMessages } from './actions'
import { MaterialIcon } from '@/components/icons/material-icon'

interface MessageInboxProps {
  messages: ContactMessage[]
  total: number
  currentPage: number
  totalPages: number
  query: string
}

export function MessageInbox({ messages, total, currentPage, totalPages, query }: MessageInboxProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [readingMessage, setReadingMessage] = useState<ContactMessage | null>(null)
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState(query)

  // -- Actions
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const sp = new URLSearchParams(searchParams.toString())
    if (searchQuery.trim()) {
      sp.set('query', searchQuery.trim())
    } else {
      sp.delete('query')
    }
    sp.set('page', '1') // reset page on search
    router.push(`${pathname}?${sp.toString()}`)
  }

  const handleDelete = async () => {
    if (selectedIds.size === 0) return
    const ids = Array.from(selectedIds)
    
    // Optimistic UI close if deleting the currently reading message
    if (readingMessage && ids.includes(readingMessage.id)) {
      setReadingMessage(null)
    }

    startTransition(async () => {
      const res = await deleteMessages(ids)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success(`${res?.count || ids.length} message(s) supprimé(s)`)
        setSelectedIds(new Set()) // clear selection
      }
    })
  }

  // -- Selection logic
  const toggleSelection = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds)
    if (checked) newSet.add(id)
    else newSet.delete(id)
    setSelectedIds(newSet)
  }

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(messages.map(m => m.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const allSelected = messages.length > 0 && selectedIds.size === messages.length
  const someSelected = selectedIds.size > 0 && !allSelected

  // Format date correctly
  const formatDate = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleDateString('fr-FR', { 
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    })
  }

  // Get Avatar Initials
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl border border-slate-200 overflow-hidden relative shadow-sm">
      
      {/* HEADER / TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50 gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
          <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher nom, email, sujet..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-[var(--aduti-primary)] focus:ring-[var(--aduti-primary)] transition-all bg-white"
          />
        </form>

        {/* Pagination Info & Controls */}
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span>{total} messages</span>
          <div className="flex gap-1">
            <button
              disabled={currentPage <= 1 || isPending}
              onClick={() => {
                const sp = new URLSearchParams(searchParams.toString())
                sp.set('page', (currentPage - 1).toString())
                router.push(`${pathname}?${sp.toString()}`)
              }}
              className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <MaterialIcon name="chevron_left" className="w-5 h-5" />
            </button>
            <button
              disabled={currentPage >= totalPages || isPending}
              onClick={() => {
                const sp = new URLSearchParams(searchParams.toString())
                sp.set('page', (currentPage + 1).toString())
                router.push(`${pathname}?${sp.toString()}`)
              }}
              className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <MaterialIcon name="chevron_right" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ACTION BAR (Appears when items are selected) */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center justify-between"
          >
            <span className="text-sm font-semibold text-blue-900">
              {selectedIds.size} message(s) sélectionné(s)
            </span>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold transition-colors disabled:opacity-50 shadow-sm"
            >
              <MaterialIcon name="delete" className="w-[16px] h-[16px]" />
              {isPending ? 'Suppression...' : 'Supprimer'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MESSAGES LIST */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-full">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <MaterialIcon name="inbox" className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Boîte de réception vide</h3>
            <p className="text-slate-500 mt-1 max-w-sm">
              Aucun message ne correspond à vos critères ou la boîte est totalement vide.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {/* Header Row — masqué sur mobile */}
            <div className="hidden sm:flex items-center px-4 py-3 bg-white border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider sticky top-0 z-10">
              <div className="w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={input => {
                    if (input) input.indeterminate = someSelected
                  }}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="rounded border-slate-300 text-[var(--aduti-primary)] focus:ring-[var(--aduti-primary)] w-4 h-4 cursor-pointer"
                />
              </div>
              <div className="w-[180px] shrink-0">Expéditeur</div>
              <div className="flex-1 truncate">Sujet &amp; Message</div>
              <div className="w-[100px] text-right shrink-0">Date</div>
            </div>

            {/* List */}
            {messages.map((m) => {
              const checked = selectedIds.has(m.id)
              const isReading = readingMessage?.id === m.id

              return (
                <div 
                  key={m.id} 
                  className={`flex items-start sm:items-center px-4 py-3 cursor-pointer group transition-colors border-l-4 ${
                    checked ? 'bg-blue-50/50 border-[var(--aduti-primary)]' : 
                    isReading ? 'bg-slate-50 border-slate-300' : 'bg-white border-transparent hover:bg-slate-50'
                  }`}
                  onClick={() => setReadingMessage(m)}
                >
                  <div className="w-10 shrink-0 pt-0.5 sm:pt-0" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => toggleSelection(m.id, e.target.checked)}
                      className="rounded border-slate-300 text-[var(--aduti-primary)] focus:ring-[var(--aduti-primary)] w-4 h-4 cursor-pointer mt-1"
                    />
                  </div>
                  
                  {/* Vue Mobile: Compact */}
                  <div className="flex-1 min-w-0 sm:hidden">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                          {getInitials(m.name)}
                        </div>
                        <span className="text-sm font-bold text-slate-900 truncate">{m.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">{formatDate(m.created_at)}</span>
                    </div>
                    <div className="ml-9 truncate">
                      <span className="text-xs font-semibold text-slate-700">{m.subject}</span>
                      <span className="text-xs text-slate-400 ml-1">{m.message.replace(/\n/g, ' ').substring(0, 60)}...</span>
                    </div>
                  </div>

                  {/* Vue Desktop: Colonnes */}
                  <div className="hidden sm:flex flex-1 items-center min-w-0">
                    {/* Sender */}
                    <div className="w-[180px] shrink-0 flex items-center gap-3 pr-4 truncate">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                        {getInitials(m.name)}
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-bold text-slate-900 truncate">{m.name}</div>
                      </div>
                    </div>

                    {/* Body Snippet */}
                    <div className="flex-1 truncate text-sm flex items-center gap-2 min-w-0 pr-4">
                      <span className="font-semibold text-slate-900 shrink-0">{m.subject}</span>
                      <span className="text-slate-400 shrink-0">-</span>
                      <span className="text-slate-500 truncate">{m.message.replace(/\n/g, ' ')}</span>
                    </div>

                    {/* Date */}
                    <div className="w-[100px] shrink-0 text-right text-xs font-medium text-slate-500">
                      {formatDate(m.created_at)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* READING DRAWER (Slide-over) */}
      <AnimatePresence>
        {readingMessage && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReadingMessage(null)}
              className="absolute inset-0 bg-slate-900/10 z-20 backdrop-blur-[1px]"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%', boxShadow: '-4px 0 24px rgba(0,0,0,0)' }}
              animate={{ x: 0, boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' }}
              exit={{ x: '100%', boxShadow: '-4px 0 24px rgba(0,0,0,0)' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-lg bg-white z-30 flex flex-col border-l border-slate-200"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h3 className="font-bold text-lg text-slate-900 truncate pr-4">Lecture du message</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setSelectedIds(new Set([readingMessage.id]))
                      handleDelete()
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Supprimer ce message"
                  >
                    <MaterialIcon name="delete" className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setReadingMessage(null)}
                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <MaterialIcon name="close" className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Meta details */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-[var(--aduti-primary)] shrink-0">
                      {getInitials(readingMessage.name)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{readingMessage.name}</h4>
                      <div className="text-sm text-slate-500 mt-0.5 space-y-1">
                        {readingMessage.email && (
                          <a href={`mailto:${readingMessage.email}`} className="flex items-center gap-1 hover:text-[var(--aduti-primary)]">
                            <MaterialIcon name="mail" className="w-4 h-4" /> {readingMessage.email}
                          </a>
                        )}
                        {readingMessage.phone && (
                          <a href={`tel:${readingMessage.phone}`} className="flex items-center gap-1 hover:text-[var(--aduti-primary)]">
                            <MaterialIcon name="call" className="w-4 h-4" /> {readingMessage.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded inline-block text-right shrink-0">
                    {formatDate(readingMessage.created_at)}
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Subject & Body */}
                <div>
                  <h2 className="text-xl font-[family-name:var(--font-display)] font-bold text-slate-900 mb-6">
                    {readingMessage.subject}
                  </h2>
                  <div className="prose prose-slate prose-sm sm:prose-base max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {readingMessage.message}
                  </div>
                </div>

                {/* Footer details (IP) */}
                <div className="pt-8 mt-8 border-t border-slate-100 text-xs text-slate-400 flex items-center gap-2">
                  <MaterialIcon name="info" className="w-4 h-4" />
                  Envoyé via formulaire sécurisé (IP: {readingMessage.ip_address || "Inconnue"})
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
