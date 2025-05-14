'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

interface SectionEntry {
  id: number
  title: string
  template_id: string
  created_at: string
}

export default function MySectionsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [sections, setSections] = useState<SectionEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Fehler beim Abrufen des Users:', error)
        return
      }
      setUser(data?.user ?? null)
    }

    fetchUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchSections = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('sections')
        .select('id, title, template_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fehler beim Laden der Sections:', error)
      } else {
        setSections(data ?? [])
      }

      setLoading(false)
    }

    fetchSections()
  }, [user])

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
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <h2 className="font-medium text-[#1c2838] text-sm">
                      {section.title || 'Unbenannte Section'}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Template: {section.template_id} –{' '}
                      {new Date(section.created_at).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                  <Link
                    href={`/editor/${section.template_id}?id=${section.id}`}
                    className="bg-[#1c2838] text-white px-4 py-1.5 text-xs rounded-full hover:opacity-90 transition whitespace-nowrap"
                  >
                    Bearbeiten
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
