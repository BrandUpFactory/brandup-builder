'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import RenameDialog from '@/components/RenameDialog'

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
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [sectionToRename, setSectionToRename] = useState<SectionEntry | null>(null)
  const [allTemplatesWithSections, setAllTemplatesWithSections] = useState<Record<string, {template: any, sections: SectionEntry[]}>>({})
  const [templates, setTemplates] = useState<any[]>([])

  // Add event listener to close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdowns = document.querySelectorAll('.dropdown-container.active');
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target as Node)) {
          dropdown.classList.remove('active');
        }
      });
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

    const fetchTemplatesAndSections = async () => {
      setLoading(true)
      
      // Get all templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('templates')
        .select('*')
        .eq('active', true)
      
      if (templatesError) {
        console.error('Error loading templates:', templatesError)
        setLoading(false)
        return
      }
      
      setTemplates(templatesData || [])
      
      // Get user's sections
      const { data: sectionsData, error: sectionsError } = await supabase
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
      
      if (sectionsError) {
        console.error('Error loading sections:', sectionsError)
        setLoading(false)
        return
      }
      
      // Format sections data
      const formattedSections = sectionsData?.map(item => {
        let templateData = undefined;
        
        if (item.templates) {
          if (Array.isArray(item.templates)) {
            templateData = item.templates[0] ? {
              name: item.templates[0]?.name || '',
              image_url: item.templates[0]?.image_url || ''
            } : undefined;
          } else if (typeof item.templates === 'object' && item.templates !== null) {
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
      
      setSections(formattedSections)
      
      // Group sections by template_id
      const sectionsGrouped = formattedSections.reduce((acc, section) => {
        const templateId = section.template_id;
        if (!acc[templateId]) {
          acc[templateId] = [];
        }
        acc[templateId].push(section);
        return acc;
      }, {} as Record<string, SectionEntry[]>);
      
      // Create a combined data structure with all templates
      const allTemplatesWithSectionsData = templatesData.reduce((acc, template) => {
        acc[template.id] = {
          template: {
            id: template.id,
            name: template.name,
            image_url: template.image_url,
          },
          sections: sectionsGrouped[template.id] || []
        };
        return acc;
      }, {} as Record<string, {template: any, sections: SectionEntry[]}>) 
      
      setAllTemplatesWithSections(allTemplatesWithSectionsData)
      setLoading(false)
    }

    fetchTemplatesAndSections()
  }, [user, supabase])

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-sm">
        🔄 Authentifizierung wird geprüft...
      </div>
    )
  }

  // We're now using allTemplatesWithSections instead of groupedSections

  // Handle rename
  const handleRename = async (newName: string) => {
    if (!sectionToRename) return;
    
    try {
      const { error } = await supabase
        .from('sections')
        .update({ title: newName })
        .eq('id', sectionToRename.id);
      
      if (error) {
        throw error;
      }
      
      // Update the local view without reloading
      const updatedSections = [...sections];
      const sectionIndex = updatedSections.findIndex(s => s.id === sectionToRename.id);
      if (sectionIndex !== -1) {
        updatedSections[sectionIndex].title = newName;
        setSections(updatedSections);
      }
      
    } catch (error) {
      console.error('Fehler beim Umbenennen:', error);
      alert('Fehler beim Umbenennen. Bitte versuche es erneut.');
    }
  };

  return (
    <div className="p-6 md:p-10 h-screen bg-[#f9f9f9]" style={{ overflow: 'visible' }}>
      {/* Rename Dialog */}
      <RenameDialog
        isOpen={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        onRename={handleRename}
        currentName={sectionToRename?.title || ''}
        title="Version umbenennen"
      />
      
      <div className="bg-white shadow rounded-xl p-6 md:p-8 w-full max-w-5xl mx-auto" style={{ overflow: 'visible' }}>
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
          ) : templates.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-5xl mb-4">💾</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Keine Templates verfügbar</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Es sind aktuell keine Templates verfügbar.
              </p>
            </div>
          ) : (
            <div className="space-y-8" style={{ overflow: 'visible' }}>
              {Object.entries(allTemplatesWithSections).map(([templateId, { template, sections }]) => (
                <div key={templateId} className="bg-gray-50 rounded-xl p-4 border border-gray-100" style={{ overflow: 'visible' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                      {template?.image_url ? (
                        <img 
                          src={template.image_url} 
                          alt={template.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-lg">📄</span>
                      )}
                    </div>
                    <h2 className="font-medium text-[#1c2838]">
                      {template?.name || `Template ${templateId}`}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ overflow: 'visible' }}>
                    {sections.length > 0 ? (
                      <>
                        {sections.map((section) => (
                          <div
                            key={section.id}
                            className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition"
                            style={{ overflow: 'visible' }}
                          >
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-medium text-[#1c2838] mb-1">
                                    {section.title || 'Version ' + (sections.indexOf(section) + 1)}
                                  </h3>
                                  <p className="text-xs text-gray-500">
                                    Bearbeitet: {new Date(section.created_at).toLocaleDateString('de-DE')}
                                  </p>
                                </div>
                                <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                                  Version {sections.indexOf(section) + 1}
                                </div>
                              </div>
                              
                              <div className="flex justify-between mt-4">
                                <Link
                                  href={`/editor/${section.template_id}?id=${section.id}`}
                                  className="bg-[#1c2838] text-white px-3 py-2 text-xs rounded-lg hover:opacity-90 transition flex-grow text-center mr-2 shadow-sm"
                                >
                                  Bearbeiten
                                </Link>
                                <div className="dropdown-container relative" style={{ overflow: 'visible' }}>
                                  <button 
                                    className="bg-[#1c2838] text-white px-3 py-2 text-xs rounded-lg hover:opacity-90 transition shadow-sm"
                                    onClick={(e) => {
                                      e.currentTarget.parentElement?.classList.toggle('active');
                                      e.stopPropagation();
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                  </button>
                                  <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] hidden dropdown-menu">
                                    <div className="py-1">
                                      <button 
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 rounded-t-lg text-gray-700 transition flex items-center"
                                        onClick={() => {
                                          setSectionToRename(section);
                                          setRenameDialogOpen(true);
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
                                                // Also update the allTemplatesWithSections state
                                                const updatedSections = {...allTemplatesWithSections};
                                                updatedSections[templateId].sections = updatedSections[templateId].sections.filter(s => s.id !== section.id);
                                                setAllTemplatesWithSections(updatedSections);
                                                
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
                      </>
                    ) : (
                      <div className="col-span-full text-center p-8 bg-white rounded-lg border border-gray-100">
                        <div className="mb-3 text-4xl">🎨</div>
                        <h3 className="text-lg font-medium text-[#1c2838] mb-2">Keine Versionen für dieses Template</h3>
                        <p className="text-gray-500 text-sm mb-4">
                          Erstelle deine erste Version, um mit diesem Template zu arbeiten.
                        </p>
                      </div>
                    )}
                    
                    {/* Neue Version erstellen, wenn weniger als 5 Versionen */}
                    {sections.length < 5 && (
                      <div
                        className="bg-white rounded-lg border border-dashed border-gray-300 p-4 flex flex-col items-center justify-center h-40 hover:bg-gray-50 cursor-pointer transition group shadow-sm hover:shadow-md"
                        onClick={() => router.push(`/editor/${templateId}`)}
                      >
                        <div className="bg-[#1c2838] rounded-full p-3 mb-3 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                          {sections.length === 0 ? 'Erste Version erstellen' : 'Neue Version erstellen'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">({5 - sections.length} von 5 verfügbar)</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
