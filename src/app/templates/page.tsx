'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

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
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()
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
  }, [])

  return (
    <div className="p-6 md:p-12">
      <h1 className="text-2xl md:text-3xl font-bold text-[#1c2838] mb-6">Alle Templates</h1>

      {loading ? (
        <p className="text-sm text-gray-500">⏳ Lade Templates...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : templates.length === 0 ? (
        <p className="text-sm text-gray-500">Keine Templates gefunden.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border rounded-xl overflow-hidden shadow-sm bg-white flex flex-col hover:shadow-md transition"
            >
              <div className="aspect-square w-full relative">
                <img
                  src={template.image_url}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col gap-2 flex-grow">
                <h2 className="text-sm font-medium text-[#1c2838]">{template.name}</h2>
                <p className="text-xs text-gray-500 mb-2">{template.description}</p>

                {template.edit_url && (
                  <Link href={template.edit_url}>
                    <button className="bg-[#1c2838] text-white text-xs px-4 py-1.5 rounded-full w-full">
                      Bearbeiten
                    </button>
                  </Link>
                )}

                {template.buy_url && (
                  <Link
                    href={template.buy_url}
                    target="_blank"
                    className="bg-[#1c2838] text-white text-xs px-4 py-1.5 rounded-full text-center"
                  >
                    Kaufen
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
