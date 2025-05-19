'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { unlockTemplateWithCode } from '@/features/template'
import { User } from '@supabase/supabase-js'

interface AccessCodeModalProps {
  isOpen: boolean
  onClose: () => void
  templateId: string
  templateName: string
  user: User | null
}

export default function AccessCodeModal({
  isOpen,
  onClose,
  templateId,
  templateName,
  user,
}: AccessCodeModalProps) {
  const [accessCode, setAccessCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Fokussiert das Input-Feld, wenn das Modal geöffnet wird
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Schließt das Modal beim Klick außerhalb
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // ESC-Taste zum Schließen
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  // Submit-Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    setError(null)
    setSuccess(null)
    setIsLoading(true)
    
    try {
      const userAgent = navigator.userAgent
      const result = await unlockTemplateWithCode(
        user.id,
        templateId,
        accessCode,
        undefined, // IP wird serverseitig bestimmt
        userAgent
      )
      
      if (result.success) {
        setSuccess(result.message)
        // Erfolgreich freigeschaltet - warte kurz und leite zum Editor weiter
        setTimeout(() => {
          // Wenn eine sectionId zurückgegeben wurde, nutzen wir sie für die Weiterleitung
          if (result.sectionId) {
            router.push(`/editor/${templateId}?id=${result.sectionId}`)
          } else {
            router.push(`/editor/${templateId}`)
          }
        }, 1500)
      } else {
        setError(result.message)
      }
    } catch (err) {
      console.error('Fehler beim Freischalten:', err)
      setError('Ein unerwarteter Fehler ist aufgetreten.')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8 transform transition-all"
      >
        <h2 className="text-xl font-bold text-[#1c2838] mb-1">
          Template freischalten
        </h2>
        <p className="text-sm text-gray-600 mb-5">
          Gib deinen Access-Code ein, um "{templateName}" zu aktivieren
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="XXX-XXXX-XXXX"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 bg-[#f4f7fa] text-[#1c2838] focus:outline-none focus:ring-2 focus:ring-[#1c2838]"
            disabled={isLoading}
            autoComplete="off"
          />
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg text-green-600 text-sm">
              {success}
            </div>
          )}
          
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition flex-1"
              disabled={isLoading}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1c2838] text-white rounded-full text-sm hover:opacity-90 transition flex-1 flex justify-center items-center"
              disabled={isLoading || !accessCode.trim()}
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Freischalten'
              )}
            </button>
          </div>
        </form>
        
        <p className="text-xs text-center text-gray-500 mt-6">
          Du findest deinen Access-Code in der E-Mail-Bestätigung
          nach dem Kauf des Templates.
        </p>
      </div>
    </div>
  )
}