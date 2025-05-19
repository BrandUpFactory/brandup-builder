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
  const [sectionTitle, setSectionTitle] = useState<string>('')
  const [user, setUser] = useState<any>(null)
  
  // Update currentSectionData when sectionData changes
  useEffect(() => {
    if (Object.keys(sectionData).length > 0) {
      console.log("Setting current section data:", sectionData);
      setCurrentSectionData(sectionData);
    }
  }, [sectionData]);

  // Handle data changes from section components
  const handleDataChange = (newData: any) => {
    console.log("Data changed:", newData);
    setCurrentSectionData(newData);
  };

  // Save section data function as a regular function to avoid dependency issues
  const saveSection = async (newData: any) => {
    if (!section) return false
    
    try {
      // Ensure we're storing stringified JSON data
      const dataToSave = typeof newData === 'string' ? newData : JSON.stringify(newData);
      
      console.log("Saving data:", dataToSave);
      console.log("Current section data:", currentSectionData);
      
      const { error } = await supabase
        .from('sections')
        .update({ 
          data: dataToSave,
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
  };

  // Handle save button click as a regular function to avoid dependency issues
  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)
    
    try {
      const success = await saveSection(currentSectionData)
      if (success) {
        setSaveMessage({ text: 'Änderungen gespeichert', type: 'success' })
        
        // Show save success notification
        const saveSuccessNotification = document.getElementById('saveSuccessNotification');
        if (saveSuccessNotification) {
          saveSuccessNotification.classList.remove('hidden');
          setTimeout(() => {
            saveSuccessNotification.classList.add('hidden');
          }, 2000);
        }
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
  };

  // Create a new section version
  const createNewSectionVersion = async () => {
    try {
      setIsLoading(true);
      
      // Check if user and template are available
      if (!user) {
        console.error('No user found when creating new version');
        setError('Benutzer nicht gefunden. Bitte melden Sie sich an.');
        setIsLoading(false);
        return;
      }
      
      if (!template) {
        console.error('No template found when creating new version');
        setError('Template nicht gefunden. Bitte laden Sie die Seite neu.');
        setIsLoading(false);
        return;
      }
      
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
      
      const userId = user.id;
      const templateId = template.id;
      
      console.log(`Creating new version for user ${userId} and template ${templateId}`);
      
      // Count existing sections for this template
      const { data: existingSections, error: countError } = await supabase
        .from('sections')
        .select('id')
        .eq('user_id', userId)
        .eq('template_id', templateId);
      
      if (countError) {
        console.error('Error counting sections:', countError);
        setError('Fehler beim Zählen der vorhandenen Versionen.');
        setIsLoading(false);
        return;
      }
      
      // Check if max limit reached (5 versions)
      if (existingSections && existingSections.length >= 5) {
        console.error('Maximum version limit reached:', existingSections.length);
        setError('Sie haben das Maximum von 5 Versionen für dieses Template erreicht. Bitte löschen Sie eine vorhandene Version, um eine neue zu erstellen.');
        setIsLoading(false);
        throw new Error('Maximum von 5 Versionen für dieses Template erreicht. Bitte löschen Sie eine vorhandene Version, um eine neue zu erstellen.');
      }
      
      // Create a new section
      const newVersionNumber = existingSections ? existingSections.length + 1 : 1;
      const newVersionTitle = `${template.name} ${newVersionNumber}`;
      
      console.log(`Creating new section with title: ${newVersionTitle}`);
      
      const { data: newSection, error: newSectionError } = await supabase
        .from('sections')
        .insert({
          user_id: userId,
          template_id: templateId,
          title: newVersionTitle,
          data: JSON.stringify(defaultData),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (newSectionError) {
        console.error('Error creating new section:', newSectionError);
        setError('Fehler beim Erstellen einer neuen Version. Bitte versuchen Sie es später erneut.');
        setIsLoading(false);
        return;
      }
      
      if (!newSection || newSection.length === 0) {
        console.error('No section created despite successful request');
        setError('Fehler beim Erstellen einer neuen Version. Die Datenbank hat keine Version zurückgegeben.');
        setIsLoading(false);
        return;
      }
      
      console.log('New section created successfully:', newSection[0].id);
      
      // Redirect to the new section
      router.push(`/editor/${templateId}?id=${newSection[0].id}`);
      
    } catch (err) {
      console.error('Unexpected error creating new section:', err);
      setError('Ein unerwarteter Fehler ist aufgetreten.');
      setIsLoading(false);
    }
  };

  // Load editor data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Check authentication
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (!authUser) {
          setError('Sie müssen angemeldet sein, um auf diesen Bereich zuzugreifen.')
          setIsLoading(false)
          return
        }
        
        setUser(authUser)

        // Check if user has access to this template
        const canAccess = await hasAccessToTemplate(authUser.id, templateId)
        
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
            .eq('user_id', authUser.id)
            .eq('template_id', templateId)
            .single()
          
          if (sectionError || !sectionData) {
            console.error('Fehler beim Laden der Section:', sectionError)
            setError('Die angeforderte Section konnte nicht gefunden werden oder gehört nicht zu diesem Benutzer.')
            setIsLoading(false)
            return
          }
          
          setSection(sectionData)
          const parsedData = typeof sectionData.data === 'string' 
            ? JSON.parse(sectionData.data) 
            : (sectionData.data || {});
          setSectionData(parsedData)
          setCurrentSectionData(parsedData)
          setSectionTitle(sectionData.title || template.name || '')
        } else {
          // If no section ID is provided, find the first section for this template
          const { data: sections, error: sectionsError } = await supabase
            .from('sections')
            .select('*')
            .eq('user_id', authUser.id)
            .eq('template_id', templateId)
            .order('created_at', { ascending: false })
            .limit(1)
          
          if (!sectionsError && sections && sections.length > 0) {
            setSection(sections[0])
            const parsedData = typeof sections[0].data === 'string' 
              ? JSON.parse(sections[0].data) 
              : (sections[0].data || {});
            setSectionData(parsedData)
            setCurrentSectionData(parsedData)
            setSectionTitle(sections[0].title || template.name || '')
            
            // Update URL to include section ID for better navigation
            router.replace(`/editor/${templateId}?id=${sections[0].id}`)
          } else {
            // No sections found for this template - create a new one
            console.log("No sections found, creating new section for template:", templateId);
            
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
            
            // Create a new section
            try {
              const userId = authUser.id; // Use authUser which is guaranteed to exist at this point
              const versionTitle = templateData.name; // Use template name for first version
              
              console.log(`Automatically creating first version "${versionTitle}" for user ${userId} and template ${templateId}`);
              
              const { data: newSection, error: newSectionError } = await supabase
                .from('sections')
                .insert({
                  user_id: userId,
                  template_id: templateId,
                  title: versionTitle,
                  data: JSON.stringify(defaultData),
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .select();
              
              if (newSectionError) {
                console.error('Fehler beim Erstellen einer neuen Section:', newSectionError);
                setError('Fehler beim Erstellen einer neuen Section. Bitte versuchen Sie es später erneut.');
                setIsLoading(false);
                return;
              }
              
              if (!newSection || newSection.length === 0) {
                console.error('No section created despite successful request');
                setError('Fehler beim Erstellen einer neuen Section. Die Datenbank hat keine Section zurückgegeben.');
                setIsLoading(false);
                return;
              }
              
              console.log('New section created successfully:', newSection[0].id);
              
              // Use the new section
              setSection(newSection[0]);
              setSectionData(defaultData);
              setCurrentSectionData(defaultData);
              setSectionTitle(newSection[0].title || templateData.name || '');
              
              // Update URL to include section ID
              router.replace(`/editor/${templateId}?id=${newSection[0].id}`);
            } catch (err) {
              console.error('Unerwarteter Fehler beim Erstellen einer neuen Section:', err);
              setError('Ein unerwarteter Fehler ist aufgetreten.');
              setIsLoading(false);
              return;
            }
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

  // Handle version name change as a regular function to avoid dependency issues
  const handleVersionNameChange = async (newName: string) => {
    if (!section) return
    
    try {
      const { error } = await supabase
        .from('sections')
        .update({ 
          title: newName,
          updated_at: new Date().toISOString()
        })
        .eq('id', section.id)
      
      if (error) {
        console.error('Fehler beim Speichern des Versionsnamens:', error)
      } else {
        // Update local section state immediately
        section.title = newName;
        // Create a new object to trigger a re-render
        setSection({...section});
      }
      
    } catch (err) {
      console.error('Unerwarteter Fehler beim Speichern des Versionsnamens:', err)
    }
  };

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
      versionName={section?.title}
      onVersionNameChange={handleVersionNameChange}
      onVersionCreate={createNewSectionVersion}
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
  onBack,
  versionName,
  onVersionNameChange,
  onVersionCreate
}: {
  section: any;
  template: any;
  sectionData: any;
  onDataChange: (data: any) => void;
  onSave: () => void;
  isSaving: boolean;
  saveMessage: {text: string, type: 'success' | 'error'} | null;
  onBack: () => void;
  versionName?: string;
  onVersionNameChange?: (name: string) => void;
  onVersionCreate?: () => void;
}) {
  // Check if we have a version create function
  const hasVersionCreate = !!onVersionCreate;
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
      <div className="bg-white border-b px-6 py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {template.image_url && (
              <img 
                src={template.image_url} 
                alt={template.name} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-lg font-bold text-[#1c2838] max-w-[250px]"
              >
                Hero Section
              </span>
            </div>
            <p className="text-xs text-gray-500">Template: {template.name}</p>
          </div>
        </div>
        
        <div className="flex gap-3 items-center justify-end">
          {saveMessage && (
            <span className={`px-3 py-1 rounded-full text-sm ${
              saveMessage.type === 'success' 
                ? 'bg-green-50 text-green-600' 
                : 'bg-red-50 text-red-600'
            }`}>
              {saveMessage.text}
            </span>
          )}
          
          <div className="flex items-center gap-2">
            <button 
              onClick={onBack}
              className="bg-gray-100 text-gray-800 px-4 py-2 text-sm rounded-lg hover:bg-gray-200 transition shadow-sm flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Zurück
            </button>
          </div>
        </div>
      </div>
      
      {/* Editor Layout */}
      <div className="flex-grow overflow-auto">
        <EditorLayout
          settings={settings}
          preview={preview}
          code={code}
          versionName={versionName}
          onVersionNameChange={onVersionNameChange}
          onVersionCreate={onVersionCreate}
        />
      </div>
    </div>
  );
}