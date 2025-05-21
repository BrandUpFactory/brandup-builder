'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient, fixImagePath } from '@/utils/supabase/client'
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
  const [unlockedTemplates, setUnlockedTemplates] = useState<string[]>([])

  // Funktion, um zu prüfen, ob ein Template freigeschaltet ist
  const hasAccessToTemplate = (templateId: string) => {
    return unlockedTemplates.includes(templateId);
  }

  // Benutzer prüfen
  useEffect(() => {
    // Add test image when component loads to check if public files are accessible
    const testImg = new Image();
    testImg.onload = () => console.log('Test image loaded successfully');
    testImg.onerror = (e) => console.error('Test image failed to load:', e);
    testImg.src = '/delivery_info_1.jpg'; // The specific image mentioned

    // Another test with the logo
    const logoImg = new Image();
    logoImg.onload = () => console.log('Logo image loaded successfully');
    logoImg.onerror = (e) => console.error('Logo image failed to load:', e);
    logoImg.src = '/BrandUp_Elements_Logo_2000_800.png';
    
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (!error && data.user) {
        setUser(data.user)
        
        // Wenn Benutzer angemeldet ist, lade freigeschaltete Templates
        const { data: licenses } = await supabase
          .from('licenses')
          .select('template_id')
          .eq('user_id', data.user.id)
          .eq('used', true)
        
        if (licenses && licenses.length > 0) {
          const templateIds = licenses.map(license => license.template_id);
          setUnlockedTemplates(templateIds);
        }
      }
    }

    fetchUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      
      // Bei Auth-Änderungen neu laden
      if (session?.user) {
        fetchUser();
      } else {
        setUnlockedTemplates([]);
      }
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
              <div className="relative bg-gray-50 aspect-square w-full overflow-hidden">
                <div className="h-full w-full flex items-center justify-center">
                  <img
                    src={template.image_url ? 
                      (template.image_url.startsWith('\\') ? 
                        '/' + template.image_url.substring(1) : 
                        template.image_url) 
                      : '/BrandUp_Elements_Logo_2000_800.png'}
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/BrandUp_Elements_Logo_2000_800.png';
                    }}
                  />
                </div>
                {!hasAccessToTemplate(template.id) && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-black/20">
                    <img
                      src="/Schloss_Icon.png"
                      alt="Locked"
                      className="w-10 h-10 object-contain opacity-90"
                    />
                  </div>
                )}
                {hasAccessToTemplate(template.id) && (
                  <div className="absolute top-2 right-2 z-10 bg-green-500 rounded-full p-1 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-3 flex flex-col gap-2 flex-grow">
                <h2 className="text-sm font-medium text-[#1c2838] truncate">{template.name}</h2>
                <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>

                <div className="mt-auto flex flex-col gap-2">
                  {hasAccessToTemplate(template.id) ? (
                    <Link
                      href={`/mysections`}
                      className="bg-[#1c2838] hover:opacity-90 text-white text-xs px-4 py-1.5 rounded-full w-full text-center transition"
                    >
                      Bearbeiten
                    </Link>
                  ) : (
                    <>
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
                    </>
                  )}
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
