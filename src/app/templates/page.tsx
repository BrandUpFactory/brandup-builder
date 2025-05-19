'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import AccessCodeModal from '@/components/AccessCodeModal'

interface Template {
  id: string
  name: string
  description: string
  image_url: string
  edit_url: string
  buy_url: string
  active: boolean
}

export default function TemplatesPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  // Benutzer prüfen
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (!error && data.user) {
        setUser(data.user)
      }
    }

    fetchUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Templates laden
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase.from('templates').select('*')

        if (error) {
          console.error('Supabase Fehler:', error)
          setError('Fehler beim Laden der Templates.')
        } else {
          setTemplates(data || [])
        }
      } catch (err) {
        console.error('Allgemeiner Fehler:', err)
        setError('Etwas ist schiefgelaufen.')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [supabase])

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleUnlockClick = (template: Template) => {
    if (!user) {
      // Wenn nicht eingeloggt, zur Login-Seite weiterleiten
      router.push('/login')
      return
    }
    
    // Modal öffnen mit dem ausgewählten Template
    setSelectedTemplate(template)
    setIsModalOpen(true)
  }

  return (
    <div className="p-6 md:p-12">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1c2838]">
          Alle Templates
        </h1>

        <input
          type="text"
          placeholder="🔎 Suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-full text-sm w-full sm:w-64 md:w-72 bg-[#f4f7fa] text-[#1c2838] focus:outline-none focus:ring-2 focus:ring-[#1c2838]"
        />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">⏳ Lade Templates...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : filteredTemplates.length === 0 ? (
        <p className="text-sm text-gray-500">Keine passenden Templates gefunden.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="border rounded-xl overflow-hidden shadow-sm bg-white flex flex-col hover:shadow-md transition"
            >
              <div className="h-48 w-full relative bg-gray-50 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <img
                    src="/Schloss_Icon.png"
                    alt="Locked"
                    className="w-10 h-10 object-contain opacity-90"
                  />
                </div>
                <img
                  src={template.image_url}
                  alt={template.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="p-3 flex flex-col gap-2 flex-grow">
                <h2 className="text-sm font-medium text-[#1c2838] truncate">{template.name}</h2>
                <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>

                <div className="mt-auto flex flex-col gap-2">
                  <button 
                    onClick={() => handleUnlockClick(template)}
                    className="bg-[#676058] hover:opacity-90 text-white text-xs px-4 py-1.5 rounded-full w-full transition"
                  >
                    Freischalten
                  </button>

                  <Link
                    href={template.buy_url || '#'}
                    target="_blank"
                    className="bg-[#1c2838] text-white text-xs px-4 py-1.5 rounded-full text-center w-full"
                  >
                    Kaufen
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Access Code Modal */}
      {selectedTemplate && (
        <AccessCodeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          templateId={selectedTemplate.id}
          templateName={selectedTemplate.name}
          user={user}
        />
      )}
    </div>
  )
}
