'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import RenameDialog from '@/components/RenameDialog'

// Function to format date nicely with time
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  
  // Format date as dd.mm.yyyy
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  // Format time as hh:mm
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

// Component for Section Preview - renders actual section layout in miniature
const SectionPreview = ({ sectionData }: { sectionData: any }) => {
  let data;
  try {
    data = typeof sectionData === 'string' ? JSON.parse(sectionData) : sectionData;
  } catch {
    data = {};
  }

  const {
    title = 'Hero Section',
    subtitle = 'Beispiel Subtitle',
    color = '#f5f7fa',
    buttonText = 'Button',
    imageUrl = '/BG_Card_55.jpg',
    textColor = '#ffffff',
    showButton = true,
    alignment = 'center',
    padding = '80px'
  } = data;

  // Convert padding to scale
  const paddingValue = parseInt(padding) || 80;
  const scaledPadding = Math.max(4, paddingValue / 20); // Scale down for preview

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Actual Section Layout - Scaled Down */}
      <div 
        className="relative w-full h-full flex items-center"
        style={{ 
          backgroundColor: color,
          padding: `${scaledPadding}px`
        }}
      >
        {/* Background Image */}
        {imageUrl && (
          <div className="absolute inset-0">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
              style={{ opacity: 0.4 }}
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        )}
        
        {/* Content Container */}
        <div 
          className={`relative z-10 w-full ${
            alignment === 'left' ? 'text-left' : 
            alignment === 'right' ? 'text-right' : 
            'text-center'
          }`}
        >
          {/* Title */}
          <h1 
            className="font-bold mb-1 leading-tight"
            style={{ 
              color: textColor,
              fontSize: '10px'
            }}
          >
            {title}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p 
              className="mb-2 opacity-90 leading-relaxed"
              style={{ 
                color: textColor,
                fontSize: '6px'
              }}
            >
              {subtitle}
            </p>
          )}
          
          {/* Button */}
          {showButton && buttonText && (
            <div
              className="inline-block px-2 py-1 rounded font-medium transition-all duration-300 shadow-sm"
              style={{
                backgroundColor: textColor === '#ffffff' ? '#1c2838' : '#ffffff',
                color: textColor === '#ffffff' ? '#ffffff' : '#1c2838',
                fontSize: '5px'
              }}
            >
              {buttonText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface SectionEntry {
  id: number
  title: string
  template_id: string
  created_at: string
  updated_at?: string
  data?: any // Section data for preview
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

  // Track active dropdown
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  
  // Add event listener to close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = () => {
      setActiveDropdown(null);
    };
    
    // Add the global click handler
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('click', handleClick);
    };
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
      
      // Hole die aktivierten Templates des Benutzers durch Lizenzen
      const { data: userLicenses, error: licensesError } = await supabase
        .from('licenses')
        .select('template_id')
        .eq('user_id', user.id)
        .eq('used', true)
      
      if (licensesError) {
        console.error('Error loading licenses:', licensesError)
        setLoading(false)
        return
      }
      
      // Erstelle ein Set mit den Template-IDs, für die der Benutzer Lizenzen hat
      const userTemplateIds = new Set(userLicenses?.map(license => license.template_id) || [])
      
      // Hole nur die Templates, für die der Benutzer Lizenzen hat
      const { data: templatesData, error: templatesError } = await supabase
        .from('templates')
        .select('*')
        .eq('active', true)
        .in('id', Array.from(userTemplateIds))
      
      if (templatesError) {
        console.error('Error loading templates:', templatesError)
        setLoading(false)
        return
      }
      
      setTemplates(templatesData || [])
      
      // Get user's sections with data
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select(`
          id, 
          title, 
          template_id, 
          created_at,
          updated_at,
          data,
          templates:template_id (name, image_url)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
      
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c2838]"></div>
          <p className="mt-4 text-gray-600 text-sm">Authentifizierung wird geprüft...</p>
        </div>
      </div>
    )
  }

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

  // Create a new section directly
  const createNewSection = async (templateId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      // Default section data
      const defaultData = {
        title: "Hero Section",
        subtitle: "Erstelle professionelle Shopify-Sektionen mit unserem intuitiven Builder.",
        color: "#f5f7fa",
        buttonText: "Jetzt entdecken",
        buttonLink: "#",
        imageUrl: "/BG_Card_55.jpg",
        alignment: "center",
        textColor: "#ffffff",
        padding: "80px",
        showButton: true
      };

      // Get the template info
      const template = allTemplatesWithSections[templateId]?.template;
      const existingSections = allTemplatesWithSections[templateId]?.sections || [];

      // Check if max limit reached (5 versions)
      if (existingSections.length >= 5) {
        alert('Sie haben das Maximum von 5 Versionen für dieses Template erreicht. Bitte löschen Sie eine vorhandene Version, um eine neue zu erstellen.');
        setLoading(false);
        return;
      }

      // Create version name
      const versionNumber = existingSections.length + 1;
      const versionTitle = `${template.name} ${versionNumber}`;
      
      // Insert the new section
      const { data: newSection, error: insertError } = await supabase
        .from('sections')
        .insert({
          user_id: user.id,
          template_id: templateId,
          title: versionTitle,
          data: JSON.stringify(defaultData),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (insertError || !newSection || newSection.length === 0) {
        console.error('Error creating new section:', insertError);
        alert('Fehler beim Erstellen einer neuen Version. Bitte versuchen Sie es später erneut.');
        setLoading(false);
        return;
      }

      console.log('New section created with ID:', newSection[0].id);
      
      // Redirect to editor with the new section
      router.push(`/editor/${templateId}?id=${newSection[0].id}`);

    } catch (error) {
      console.error('Error creating section:', error);
      alert('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#8dbbda]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#1c2838]/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#8dbbda]/3 rounded-full blur-3xl"></div>
      </div>

      {/* Rename Dialog */}
      <RenameDialog
        isOpen={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        onRename={handleRename}
        currentName={sectionToRename?.title || ''}
        title="Version umbenennen"
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1c2838] to-[#263545] flex items-center justify-center mr-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-[#1c2838] tracking-tight">Meine Sections</h1>
                <p className="text-gray-600 mt-1">Hier findest du alle gespeicherten Varianten deiner bearbeiteten Templates.</p>
                <p className="text-orange-500 mt-2 text-xs">
                  <a 
                    href="https://www.brandupfactory.com/help-center" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-orange-600 transition-colors"
                  >
                    Hilfe anfordern
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">Templates: </span>
              <span className="font-semibold text-[#1c2838]">{templates.length}</span>
            </div>
            <Link 
              href="/templates" 
              className="group bg-gradient-to-r from-[#1c2838] to-[#263545] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Neue Section erstellen</span>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1c2838]"></div>
                <p className="mt-6 text-gray-600 text-lg">Lade deine Templates...</p>
              </div>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg">
              <div className="text-6xl mb-6">🎨</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Keine Templates verfügbar</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                Es sind aktuell keine Templates verfügbar. Besuche unseren Shop, um Templates zu erwerben.
              </p>
              <Link 
                href="/templates" 
                className="inline-flex items-center px-6 py-3 bg-[#1c2838] text-white rounded-xl hover:bg-[#263545] transition-colors"
              >
                Templates entdecken
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(allTemplatesWithSections).map(([templateId, { template, sections }]) => (
                <div key={templateId} className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg overflow-hidden">
                  {/* Template Header with Large Image */}
                  <div className="relative h-48 lg:h-32 bg-gradient-to-r from-gray-100 to-gray-50 overflow-hidden">
                    {/* Background Image */}
                    {template?.image_url && (
                      <div className="absolute inset-0">
                        <img 
                          src={template.image_url} 
                          alt={template.name} 
                          className="w-full h-full object-cover opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1c2838]/60 to-[#1c2838]/30"></div>
                      </div>
                    )}
                    
                    {/* Template Info */}
                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center h-full p-6 lg:p-8">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Large Template Image */}
                        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white/50 flex-shrink-0 bg-white">
                          {template?.image_url ? (
                            <img 
                              src={template.image_url} 
                              alt={template.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Template Details */}
                        <div className="text-white">
                          <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                            {template?.name || `Template ${templateId}`}
                          </h2>
                          <p className="text-white/80 text-sm lg:text-base">
                            {sections.length} {sections.length === 1 ? 'Version' : 'Versionen'} erstellt
                          </p>
                        </div>
                      </div>
                      
                      {/* Template Stats */}
                      <div className="mt-4 lg:mt-0 flex items-center space-x-6 text-white/90">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{sections.length}</div>
                          <div className="text-xs uppercase tracking-wider">Versionen</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{5 - sections.length}</div>
                          <div className="text-xs uppercase tracking-wider">Verfügbar</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sections Grid */}
                  <div className="p-6 lg:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {sections.length > 0 ? (
                        <>
                          {sections.map((section) => (
                            <div
                              key={section.id}
                              className="group bg-white rounded-2xl border border-gray-100 hover:border-[#8dbbda]/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                              {/* Section Preview */}
                              <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                                {section.data ? (
                                  <SectionPreview sectionData={section.data} />
                                ) : (
                                  <>
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#1c2838]/5 to-[#8dbbda]/5"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="text-center text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-sm">Section Preview</span>
                                      </div>
                                    </div>
                                  </>
                                )}
                                
                                {/* Hover Overlay - Fix z-index */}
                                <div className="absolute inset-0 bg-[#1c2838]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 pointer-events-none">
                                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 pointer-events-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1c2838]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Section Info */}
                              <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-[#1c2838] mb-1 truncate">
                                      {section.title || 'Version ' + (sections.indexOf(section) + 1)}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                      Bearbeitet: {formatDate(section.updated_at || section.created_at)}
                                    </p>
                                  </div>
                                  
                                  {/* Dropdown Menu */}
                                  <div className="relative ml-2">
                                    <button 
                                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveDropdown(activeDropdown === section.id ? null : section.id);
                                      }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                      </svg>
                                    </button>
                                    
                                    {activeDropdown === section.id && (
                                      <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                        <button 
                                          className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSectionToRename(section);
                                            setRenameDialogOpen(true);
                                            setActiveDropdown(null);
                                          }}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                          </svg>
                                          <span>Umbenennen</span>
                                        </button>
                                        <button 
                                          className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 transition-colors flex items-center space-x-2"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Möchtest du diese Version wirklich löschen?')) {
                                              const deleteSection = async () => {
                                                try {
                                                  const { error } = await supabase
                                                    .from('sections')
                                                    .delete()
                                                    .eq('id', section.id);
                                                  
                                                  if (error) {
                                                    throw error;
                                                  }
                                                  
                                                  setSections(sections.filter(s => s.id !== section.id));
                                                  const updatedSections = {...allTemplatesWithSections};
                                                  updatedSections[templateId].sections = updatedSections[templateId].sections.filter(s => s.id !== section.id);
                                                  setAllTemplatesWithSections(updatedSections);
                                                  
                                                } catch (error) {
                                                  console.error('Fehler beim Löschen:', error);
                                                  alert('Fehler beim Löschen. Bitte versuche es erneut.');
                                                }
                                              };
                                              deleteSection();
                                            }
                                            setActiveDropdown(null);
                                          }}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                          <span>Löschen</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Action Button */}
                                <Link
                                  href={`/editor/${section.template_id}?id=${section.id}`}
                                  className="block w-full bg-gradient-to-r from-[#1c2838] to-[#263545] text-white text-center py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
                                >
                                  Bearbeiten
                                </Link>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="col-span-full text-center p-12 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                          <div className="mb-4 text-5xl">🎨</div>
                          <h3 className="text-xl font-semibold text-[#1c2838] mb-2">Keine Versionen für dieses Template</h3>
                          <p className="text-gray-500 text-sm mb-6">
                            Erstelle deine erste Version, um mit diesem Template zu arbeiten.
                          </p>
                        </div>
                      )}
                      
                      {/* Create New Version Card */}
                      {sections.length < 5 && (
                        <div
                          className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#8dbbda] hover:from-[#8dbbda]/5 hover:to-[#8dbbda]/10 transition-all duration-300 cursor-pointer"
                          onClick={() => createNewSection(templateId)}
                        >
                          <div className="aspect-video flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-4 bg-[#1c2838] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-[#1c2838] mb-1">
                                {sections.length === 0 ? 'Erste Version' : 'Neue Version'}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {5 - sections.length} von 5 verfügbar
                              </p>
                            </div>
                          </div>
                          
                          <div className="p-5">
                            <div className="w-full bg-[#8dbbda]/20 text-[#1c2838] text-center py-3 rounded-xl font-medium group-hover:bg-[#8dbbda]/30 transition-colors">
                              Erstellen
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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