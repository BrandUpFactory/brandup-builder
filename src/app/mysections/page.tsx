'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

interface SectionEntry {
  id: number
  title: string
  template_id: string
  created_at: string
  template?: {
    name: string
    image_url: string
  }
}

export default function MySectionsPage() {
  const supabase = createClient()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [sections, setSections] = useState<SectionEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Fehler beim Abrufen des Users:', error)
        setCheckingAuth(false)
        return
      }

      if (!data?.user) {
        router.push('/login')
        return
      }

      setUser(data.user)
      setCheckingAuth(false)
    }

    fetchUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) router.push('/login')
      else setUser(session.user)
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  useEffect(() => {
    if (!user) return

    const fetchSections = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('sections')
        .select(`
          id, 
          title, 
          template_id, 
          created_at,
          templates:template_id (name, image_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      // Daten umformen, damit templates unter template steht
      const formattedData = data?.map(item => ({
        ...item,
        template: item.templates,
        templates: undefined
      })) ?? []

      if (error) {
        console.error('Fehler beim Laden der Sections:', error)
      } else {
        setSections(formattedData)
      }

      setLoading(false)
    }

    fetchSections()
  }, [user, supabase])

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-sm">
        🔄 Authentifizierung wird geprüft...
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 h-screen overflow-auto bg-[#f9f9f9]">
      <div className="bg-white shadow rounded-lg p-6 md:p-8 w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1c2838] mb-3">Meine Sections</h1>
        <p className="text-sm text-gray-600">
          Hier findest du alle gespeicherten Varianten deiner bearbeiteten Templates.
        </p>

        <div className="mt-6">
          {loading ? (
            <p className="text-center text-gray-400 text-sm">⏳ Lade deine Sections...</p>
          ) : sections.length === 0 ? (
            <div className="text-center text-gray-400 text-sm">
              💾 Noch keine Sections gespeichert. Beginne jetzt mit dem Builder!
            </div>
          ) : (
            <ul className="space-y-4">
              {sections.map((section) => (
                <li
                  key={section.id}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col md:flex-row"
                >
                  {/* Template Vorschaubild */}
                  <div className="md:w-24 h-24 relative bg-gray-50 flex-shrink-0">
                    {section.template?.image_url ? (
                      <img 
                        src={section.template.image_url} 
                        alt={section.title || 'Section'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xl">
                        📄
                      </div>
                    )}
                  </div>
                  
                  {/* Informationen */}
                  <div className="p-4 flex-grow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="font-medium text-[#1c2838] text-sm mb-1">
                        {section.title || 'Unbenannte Section'}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {section.template?.name || `Template ${section.template_id}`} •{' '}
                        {new Date(section.created_at).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                    <Link
                      href={`/editor/${section.template_id}?id=${section.id}`}
                      className="bg-[#1c2838] text-white px-4 py-1.5 text-xs rounded-full hover:opacity-90 transition whitespace-nowrap"
                    >
                      Bearbeiten
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
