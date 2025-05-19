'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { hasAccessToTemplate } from '@/features/template'
import EditorLayout from '@/components/EditorLayout'
import HeroSection from '@/sections/HeroSection'

// Error component 
const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="h-screen flex items-center justify-center flex-col gap-4 p-6 bg-white text-[#1c2838]">
    <h1 className="text-2xl font-bold">Fehler</h1>
    <p>{message}</p>
    <button 
      onClick={() => window.history.back()}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Zurück
    </button>
  </div>
)

// Loading component
const LoadingDisplay = () => (
  <div className="h-screen flex items-center justify-center p-6 bg-white text-[#1c2838]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
)

export default function TemplateEditorClient({ 
  templateId, 
  searchParams 
}: { 
  templateId: string;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createClient()
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  
  // Use URL search params first, then fall back to server provided searchParams
  const sectionId = urlSearchParams.get('id') || (searchParams.id as string)
  
  // Initialize ALL state variables at the top level
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [template, setTemplate] = useState<any>(null)
  const [section, setSection] = useState<any>(null)
  const [sectionData, setSectionData] = useState<any>({})
  const [hasAccess, setHasAccess] = useState(false)
  const [currentSectionData, setCurrentSectionData] = useState<any>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null)
  
  // Update currentSectionData when sectionData changes
  useEffect(() => {
    if (Object.keys(sectionData).length > 0) {
      setCurrentSectionData(sectionData);
    }
  }, [sectionData]);

  // Handle data changes from section components
  const handleDataChange = useCallback((newData: any) => {
    setCurrentSectionData(newData)
  }, []);

  // Save section data function
  const saveSection = useCallback(async (newData: any) => {
    if (!section) return false
    
    try {
      const { error } = await supabase
        .from('sections')
        .update({ 
          data: newData,
          updated_at: new Date().toISOString()
        })
        .eq('id', section.id)
      
      if (error) {
        console.error('Fehler beim Speichern:', error)
        return false
      }
      
      // Update local state
      setSectionData(newData)
      return true
    } catch (err) {
      console.error('Unerwarteter Fehler beim Speichern:', err)
      return false
    }
  }, [section, supabase]);

  // Handle save button click
  const handleSave = useCallback(async () => {
    setIsSaving(true)
    setSaveMessage(null)
    
    try {
      const success = await saveSection(currentSectionData)
      if (success) {
        setSaveMessage({ text: 'Änderungen gespeichert', type: 'success' })
      } else {
        setSaveMessage({ text: 'Fehler beim Speichern', type: 'error' })
      }
    } catch (error) {
      setSaveMessage({ text: 'Ein unerwarteter Fehler ist aufgetreten', type: 'error' })
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null)
      }, 3000)
    }
  }, [currentSectionData, saveSection]);

  // Load editor data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Check authentication
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setError('Sie müssen angemeldet sein, um auf diesen Bereich zuzugreifen.')
          setIsLoading(false)
          return
        }

        // Check if user has access to this template
        const canAccess = await hasAccessToTemplate(user.id, templateId)
        
        if (!canAccess) {
          setError('Sie haben keinen Zugriff auf dieses Template.')
          setIsLoading(false)
          return
        }
        
        setHasAccess(true)

        // Load template information
        const { data: templateData, error: templateError } = await supabase
          .from('templates')
          .select('*')
          .eq('id', templateId)
          .single()
        
        if (templateError || !templateData) {
          console.error('Fehler beim Laden des Templates:', templateError)
          setError('Das angeforderte Template konnte nicht gefunden werden.')
          setIsLoading(false)
          return
        }
        
        setTemplate(templateData)

        // If section ID is provided, load section data
        if (sectionId) {
          const { data: sectionData, error: sectionError } = await supabase
            .from('sections')
            .select('*')
            .eq('id', sectionId)
            .eq('user_id', user.id)
            .eq('template_id', templateId)
            .single()
          
          if (sectionError || !sectionData) {
            console.error('Fehler beim Laden der Section:', sectionError)
            setError('Die angeforderte Section konnte nicht gefunden werden oder gehört nicht zu diesem Benutzer.')
            setIsLoading(false)
            return
          }
          
          setSection(sectionData)
          setSectionData(sectionData.data || {})
        } else {
          // If no section ID is provided, find the first section for this template
          const { data: sections, error: sectionsError } = await supabase
            .from('sections')
            .select('*')
            .eq('user_id', user.id)
            .eq('template_id', templateId)
            .order('created_at', { ascending: false })
            .limit(1)
          
          if (!sectionsError && sections && sections.length > 0) {
            setSection(sections[0])
            setSectionData(sections[0].data || {})
            
            // Update URL to include section ID for better navigation
            router.replace(`/editor/${templateId}?id=${sections[0].id}`)
          } else {
            // No sections found for this template
            setError('Keine Abschnitte für dieses Template gefunden.')
            setIsLoading(false)
            return
          }
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('Unerwarteter Fehler:', err)
        setError('Ein unerwarteter Fehler ist aufgetreten.')
        setIsLoading(false)
      }
    }

    loadData()
  }, [templateId, sectionId, router, supabase]);

  // Render loading state
  if (isLoading) {
    return <LoadingDisplay />
  }

  // Render error state
  if (error) {
    return <ErrorDisplay message={error} />
  }

  // Render missing access/data state
  if (!hasAccess || !template || !section) {
    return <ErrorDisplay message="Zugriff verweigert oder fehlende Daten" />
  }

  // Render the editor with a wrapper component to handle HeroSection properly
  return (
    <EditorWrapper 
      section={section}
      template={template}
      sectionData={currentSectionData}
      onDataChange={handleDataChange}
      onSave={handleSave}
      isSaving={isSaving}
      saveMessage={saveMessage}
      onBack={() => router.push('/mysections')}
    />
  );
}

// Separate wrapper component to prevent React hooks errors
function EditorWrapper({
  section,
  template,
  sectionData,
  onDataChange,
  onSave,
  isSaving,
  saveMessage,
  onBack
}: {
  section: any;
  template: any;
  sectionData: any;
  onDataChange: (data: any) => void;
  onSave: () => void;
  isSaving: boolean;
  saveMessage: {text: string, type: 'success' | 'error'} | null;
  onBack: () => void;
}) {
  // Create the hero section component
  const editorContent = () => {
    // For now, we always use HeroSection
    const { settings, preview, code } = HeroSection({
      initialData: sectionData,
      onDataChange: onDataChange
    });
    
    return { settings, preview, code };
  };
  
  // Get the content safely
  const { settings, preview, code } = editorContent();
  
  return (
    <div className="h-screen flex flex-col">
      {/* Header with save button */}
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-[#1c2838]">{section.title || template.name}</h1>
          <p className="text-xs text-gray-500">Template: {template.name}</p>
        </div>
        <div className="flex gap-3 items-center">
          {saveMessage && (
            <span className={`text-sm ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {saveMessage.text}
            </span>
          )}
          <button 
            onClick={onSave}
            disabled={isSaving}
            className="bg-[#1c2838] text-white px-4 py-1.5 text-sm rounded-full hover:opacity-90 transition flex items-center gap-1"
          >
            {isSaving ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Speichern...
              </>
            ) : 'Speichern'}
          </button>
          <button 
            onClick={onBack}
            className="bg-gray-200 text-gray-800 px-4 py-1.5 text-sm rounded-full hover:bg-gray-300 transition"
          >
            Zurück
          </button>
        </div>
      </div>
      
      {/* Editor Layout */}
      <div className="flex-grow overflow-auto">
        <EditorLayout
          settings={settings}
          preview={preview}
          code={code}
        />
      </div>
    </div>
  );
}