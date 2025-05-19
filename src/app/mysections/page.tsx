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
  templates?: any // Der Typ, wie er direkt von Supabase kommt
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
      const formattedData = data?.map(item => {
        // Überprüfen, welche Form die zurückgegebenen Daten haben
        let templateData = undefined;
        
        if (item.templates) {
          // Wenn templates ein Array ist
          if (Array.isArray(item.templates)) {
            templateData = item.templates[0] ? {
              name: item.templates[0]?.name || '',
              image_url: item.templates[0]?.image_url || ''
            } : undefined;
          } 
          // Wenn templates ein Objekt ist
          else if (typeof item.templates === 'object' && item.templates !== null) {
            templateData = {
              name: (item.templates as { name?: string }).name || '',
              image_url: (item.templates as { image_url?: string }).image_url || ''
            };
          }
        }
        
        return {
          ...item,
          template: templateData,
          templates: undefined
        };
      }) ?? []

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

  // Gruppierte Sections nach Template
  const groupedSections = sections.reduce((acc, section) => {
    const templateId = section.template_id;
    if (!acc[templateId]) {
      acc[templateId] = [];
    }
    acc[templateId].push(section);
    return acc;
  }, {} as Record<string, SectionEntry[]>);

  return (
    <div className="p-6 md:p-10 h-screen overflow-auto bg-[#f9f9f9]">
      <div className="bg-white shadow rounded-xl p-6 md:p-8 w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1c2838] mb-1">Meine Sections</h1>
            <p className="text-sm text-gray-600">
              Hier findest du alle gespeicherten Varianten deiner bearbeiteten Templates.
            </p>
          </div>
          <Link href="/templates" className="bg-[#1c2838] text-white px-4 py-2 text-sm rounded-lg hover:opacity-90 transition">
            Neue Section erstellen
          </Link>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-5xl mb-4">💾</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Noch keine Sections gespeichert</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Beginne mit dem Erstellen deiner ersten Section, um sie hier zu sehen.
              </p>
              <Link href="/templates" className="bg-[#1c2838] text-white px-6 py-2 rounded-lg hover:opacity-90 transition">
                Mit dem Builder starten
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedSections).map(([templateId, templateSections]) => {
                // Nehme das erste Section-Element, um Template-Informationen zu erhalten
                const templateInfo = templateSections[0]?.template;
                
                return (
                  <div key={templateId} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                        {templateInfo?.image_url ? (
                          <img 
                            src={templateInfo.image_url} 
                            alt={templateInfo.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-lg">📄</span>
                        )}
                      </div>
                      <h2 className="font-medium text-[#1c2838]">
                        {templateInfo?.name || `Template ${templateId}`}
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {templateSections.map((section) => (
                        <div
                          key={section.id}
                          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition"
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-medium text-[#1c2838] mb-1">
                                  {section.title || 'Version ' + (templateSections.indexOf(section) + 1)}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  Bearbeitet: {new Date(section.created_at).toLocaleDateString('de-DE')}
                                </p>
                              </div>
                              <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                                Version {templateSections.indexOf(section) + 1}
                              </div>
                            </div>
                            
                            <div className="flex justify-between mt-4">
                              <Link
                                href={`/editor/${section.template_id}?id=${section.id}`}
                                className="bg-[#1c2838] text-white px-3 py-2 text-xs rounded-lg hover:opacity-90 transition flex-grow text-center mr-2 shadow-sm"
                              >
                                Bearbeiten
                              </Link>
                              <div className="relative group" tabIndex={0}>
                                <button 
                                  className="bg-[#1c2838] text-white px-3 py-2 text-xs rounded-lg hover:opacity-90 transition shadow-sm"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                  </svg>
                                </button>
                                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden group-hover:block transition-opacity duration-300 group-focus-within:block">
                                  <div className="py-1">
                                    <button 
                                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 rounded-t-lg text-gray-700 transition flex items-center"
                                      onClick={() => {
                                        const newName = prompt('Neuer Name für die Version:', section.title || `Version ${templateSections.indexOf(section) + 1}`);
                                        if (newName && newName.trim()) {
                                          // Implementiere das tatsächliche Umbenennen
                                          const updateSectionName = async () => {
                                            try {
                                              const { error } = await supabase
                                                .from('sections')
                                                .update({ title: newName })
                                                .eq('id', section.id);
                                              
                                              if (error) {
                                                throw error;
                                              }
                                              
                                              // Aktualisiere die lokale Ansicht ohne Neuladen
                                              const updatedSections = [...sections];
                                              const sectionIndex = updatedSections.findIndex(s => s.id === section.id);
                                              if (sectionIndex !== -1) {
                                                updatedSections[sectionIndex].title = newName;
                                                setSections(updatedSections);
                                              }
                                              
                                              alert(`Version wurde in "${newName}" umbenannt!`);
                                            } catch (error) {
                                              console.error('Fehler beim Umbenennen:', error);
                                              alert('Fehler beim Umbenennen. Bitte versuche es erneut.');
                                            }
                                          };
                                          updateSectionName();
                                        }
                                      }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Umbenennen
                                    </button>
                                    <button 
                                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-red-600 rounded-b-lg transition flex items-center"
                                      onClick={() => {
                                        if (confirm('Möchtest du diese Version wirklich löschen?')) {
                                          // Implementiere das tatsächliche Löschen
                                          const deleteSection = async () => {
                                            try {
                                              const { error } = await supabase
                                                .from('sections')
                                                .delete()
                                                .eq('id', section.id);
                                              
                                              if (error) {
                                                throw error;
                                              }
                                              
                                              // Aktualisiere die lokale Ansicht ohne Neuladen
                                              setSections(sections.filter(s => s.id !== section.id));
                                              alert('Version wurde erfolgreich gelöscht!');
                                            } catch (error) {
                                              console.error('Fehler beim Löschen:', error);
                                              alert('Fehler beim Löschen. Bitte versuche es erneut.');
                                            }
                                          };
                                          deleteSection();
                                        }
                                      }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      Löschen
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Neue Version erstellen, wenn weniger als 5 Versionen */}
                      {templateSections.length < 5 && (
                        <div
                          className="bg-white rounded-lg border border-dashed border-gray-300 p-4 flex flex-col items-center justify-center h-40 hover:bg-gray-50 cursor-pointer transition group shadow-sm hover:shadow-md"
                          onClick={() => router.push(`/editor/${templateId}`)}
                        >
                          <div className="bg-[#1c2838] bg-opacity-10 rounded-full p-3 mb-3 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1c2838]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Neue Version erstellen</span>
                          <span className="text-xs text-gray-500 mt-1">({5 - templateSections.length} von 5 verfügbar)</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
