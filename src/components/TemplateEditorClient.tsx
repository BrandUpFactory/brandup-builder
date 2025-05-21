'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient, fixImagePath } from '@/utils/supabase/client'
import { hasAccessToTemplate } from '@/features/template'
import EditorLayout from '@/components/EditorLayout'
import HeroSection from '@/sections/HeroSection'
import NavigationManager, { registerNavigationManager } from '@/components/NavigationManager'

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
    console.log("⚡ TemplateEditor: Data changed from section component:", JSON.stringify(newData, null, 2));
    
    // Ensure data is valid before updating state
    if (newData && typeof newData === 'object') {
      // Make deep copy to avoid reference issues
      const dataCopy = JSON.parse(JSON.stringify(newData));
      setCurrentSectionData(dataCopy);
      console.log("⚡ TemplateEditor: Updated currentSectionData state");
    } else {
      console.error("⚡ TemplateEditor: Invalid data received from section component", newData);
    }
  };

  // Save section data function as a regular function to avoid dependency issues
  const saveSection = async (newData: any) => {
    if (!section) {
      console.error('⚡ SaveSection: No section available to save');
      alert('Fehler: Keine Section zum Speichern gefunden');
      return false;
    }
    
    try {
      // Make sure newData is a valid object
      if (!newData || typeof newData !== 'object') {
        console.error('⚡ SaveSection: Invalid data format for saving:', newData);
        alert('Fehler: Ungültiges Datenformat');
        return false;
      }
      
      // Print out current section info
      console.log("⚡ SaveSection: Current section:", {
        id: section.id,
        title: section.title,
        user_id: section.user_id,
        template_id: section.template_id
      });
      
      // Force create a clean object with exactly the properties we need
      const cleanData = {
        title: newData.title || "Untitled Hero Section",
        subtitle: newData.subtitle || "",
        color: newData.color || "#f5f7fa",
        buttonText: newData.buttonText || "Button",
        buttonLink: newData.buttonLink || "#",
        imageUrl: newData.imageUrl || "/BG_Card_55.jpg",
        alignment: newData.alignment || "center",
        textColor: newData.textColor || "#ffffff",
        padding: newData.padding || "80px",
        showButton: newData.showButton !== undefined ? newData.showButton : true
      };
      
      // Ensure we're storing stringified JSON data
      const dataToSave = JSON.stringify(cleanData);
      
      console.log("⚡ SaveSection: Saving section with ID:", section.id);
      console.log("⚡ SaveSection: Clean data being saved:", cleanData);
      console.log("⚡ SaveSection: Stringified data:", dataToSave);
      
      // Simple approach - store as string first
      try {
        console.log("⚡ SaveSection: Using straightforward update approach");
        const { error: simpleError } = await supabase
          .from('sections')
          .update({ 
            data: dataToSave,
            updated_at: new Date().toISOString()
          })
          .eq('id', section.id);
        
        if (simpleError) {
          console.error('⚡ SaveSection: Error with simple update:', simpleError);
          throw simpleError;
        } else {
          console.log("⚡ SaveSection: Simple update successful!");
          // Update local state to ensure UI is consistent
          setSectionData(cleanData);
          return true;
        }
      } catch (simpleError) {
        console.error("⚡ SaveSection: Simple update failed, trying alternative:", simpleError);
        
        // Try direct API endpoint as fallback
        console.log("⚡ SaveSection: Trying API endpoint fallback");
        try {
          const response = await fetch('/api/update-section', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sectionId: section.id,
              data: dataToSave
            }),
          });
          
          if (!response.ok) {
            throw new Error(`API response: ${response.status} ${response.statusText}`);
          }
          
          const result = await response.json();
          console.log("⚡ SaveSection: API endpoint result:", result);
          setSectionData(cleanData);
          return true;
        } catch (apiError) {
          console.error("⚡ SaveSection: API endpoint fallback failed:", apiError);
          
          // Last resort - try direct update
          console.log("⚡ SaveSection: Trying direct update as last resort");
          try {
            const { error: directError } = await supabase
              .from('sections')
              .update({ data: dataToSave })
              .eq('id', section.id);
              
            if (directError) {
              console.error("⚡ SaveSection: Direct update failed:", directError);
              throw directError;
            }
            
            console.log("⚡ SaveSection: Direct update succeeded!");
            setSectionData(cleanData);
            return true;
          } catch (directError) {
            console.error("⚡ SaveSection: All update attempts failed");
            throw directError;
          }
        }
      }
    } catch (err) {
      console.error('⚡ SaveSection: Final catch - unexpected error during save:', err);
      alert('Fehler beim Speichern der Section. Details in der Konsole.');
      return false;
    }
  };

  // Track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // No longer using the browser's built-in beforeunload handler
  // Using our custom exit dialog instead
  
  // Mark changes as unsaved when data changes
  useEffect(() => {
    if (Object.keys(currentSectionData).length > 0 && Object.keys(sectionData).length > 0) {
      // Check if current data is different from original data
      const unsavedChanges = JSON.stringify(currentSectionData) !== JSON.stringify(sectionData);
      setHasUnsavedChanges(unsavedChanges);
      
      // Register the navigation manager with current state
      registerNavigationManager(unsavedChanges, createExitConfirmation);
    }
  }, [currentSectionData, sectionData]);

  // Handle save button click as a regular function to avoid dependency issues
  const handleSave = async () => {
    console.log("⚡ SaveAction: Save button clicked");
    
    // Disable save button to prevent multiple clicks
    const saveButton = document.getElementById('saveButton');
    
    if (saveButton) {
      saveButton.setAttribute('disabled', 'true');
      saveButton.classList.add('opacity-50');
    }
    
    // Set saving state and clear any previous messages
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      console.log("⚡ SaveAction: Attempting to save section data");
      console.log("⚡ SaveAction: Current section data", JSON.stringify(currentSectionData, null, 2));
      
      // Check if the section exists
      if (!section) {
        console.error("⚡ SaveAction: No section object available");
        alert("Fehler: Keine Sektion zum Speichern gefunden.");
        return;
      }
      
      // Log the section ID we're saving to
      console.log("⚡ SaveAction: Saving to section with ID", section.id);
      
      // Call the save function with the current data
      const success = await saveSection(currentSectionData);
      
      if (success) {
        console.log("⚡ SaveAction: Save successful!");
        
        // Show success message in component state
        setSaveMessage({ text: 'Änderungen gespeichert', type: 'success' });
        
        // Mark that there are no unsaved changes
        setHasUnsavedChanges(false);
        
        // Reset the global variables directly to ensure navigation works
        (window as Window & typeof globalThis).hasUnsavedChangesGlobal = false;
        
        // We'll use only the saveMessage state to show notifications
        // No need to create a separate DOM notification
      } else {
        console.error("⚡ SaveAction: Save operation failed");
        setSaveMessage({ text: 'Fehler beim Speichern', type: 'error' });
        
        // Create and show error notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fadeIn';
        notification.textContent = 'Fehler beim Speichern. Bitte versuchen Sie es erneut.';
        document.body.appendChild(notification);
        
        // Remove notification after delay with fade animation
        setTimeout(() => {
          notification.classList.add('animate-fadeOut');
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification);
            }
          }, 500);
        }, 2000);
      }
    } catch (error) {
      console.error('⚡ SaveAction: Exception during save:', error);
      setSaveMessage({ text: 'Ein unerwarteter Fehler ist aufgetreten', type: 'error' });
      
      // Create and show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fadeIn';
      notification.textContent = 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
      document.body.appendChild(notification);
      
      // Remove notification after delay with fade animation
      setTimeout(() => {
        notification.classList.add('animate-fadeOut');
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 500);
      }, 2000);
    } finally {
      // Reset the saving state
      setIsSaving(false);
      
      // Re-enable the save button
      if (saveButton) {
        saveButton.removeAttribute('disabled');
        saveButton.classList.remove('opacity-50');
      }
      
      // Clear message after 2 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 2000);
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
        imageUrl: fixImagePath(defaultData?.imageUrl || "/BG_Card_55.jpg"),
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
              imageUrl: fixImagePath(newData.imageUrl),
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

  // Create exit confirmation dialog
  const createExitConfirmation = (targetUrl: string) => {
    console.log("⚡ Creating exit confirmation dialog with target:", targetUrl);
    console.log("⚡ Current unsaved changes state:", hasUnsavedChanges);
    
    // Double-check if we actually have unsaved changes
    // If we don't, just navigate directly without showing the dialog
    if (!hasUnsavedChanges) {
      console.log("⚡ No unsaved changes detected, navigating directly to:", targetUrl);
      window.location.href = targetUrl;
      return;
    }
    
    try {
      // Create a modern confirmation dialog with a blurred background
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[1000] animate-fadeIn';
      
      const dialog = document.createElement('div');
      dialog.className = 'bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-slideUp';
      
      const title = document.createElement('h2');
      title.className = 'text-xl font-bold mb-4 text-[#1c2838]';
      title.textContent = 'Ungespeicherte Änderungen';
      
      const message = document.createElement('p');
      message.className = 'text-gray-600 mb-6';
      message.textContent = 'Es gibt ungespeicherte Änderungen. Möchten Sie wirklich zurückgehen? Alle nicht gespeicherten Änderungen gehen verloren.';
      
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'flex justify-end gap-4';
      
      const cancelButton = document.createElement('button');
      cancelButton.className = 'px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition';
      cancelButton.textContent = 'Abbrechen';
      cancelButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("⚡ Cancel button clicked");
        document.body.removeChild(overlay);
      };
      
      const confirmButton = document.createElement('button');
      confirmButton.className = 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition';
      confirmButton.textContent = 'Ohne Speichern verlassen';
      confirmButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("⚡ Ohne Speichern verlassen clicked, navigating to:", targetUrl);
        
        try {
          // First turn off the unsaved changes flag - critical step!
          setHasUnsavedChanges(false);
          (window as Window & typeof globalThis).hasUnsavedChangesGlobal = false;
          
          document.body.removeChild(overlay);
          
          // Direct navigation using window.location for more reliable navigation
          if (targetUrl) {
            console.log("⚡ Redirecting to:", targetUrl);
            window.location.href = targetUrl;
          } else {
            console.error("⚡ No target URL provided for navigation");
          }
        } catch (error) {
          console.error("⚡ Error during navigation:", error);
        }
      };
      
      buttonContainer.appendChild(cancelButton);
      buttonContainer.appendChild(confirmButton);
      
      dialog.appendChild(title);
      dialog.appendChild(message);
      dialog.appendChild(buttonContainer);
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
    } catch (error) {
      console.error("⚡ Error creating exit confirmation dialog:", error);
      // In case of error, still try to navigate
      window.location.href = targetUrl;
    }
  };

  // Handle back navigation with unsaved changes check
  const handleBack = () => {
    console.log("Back button clicked, hasUnsavedChanges:", hasUnsavedChanges);
    
    // Double-check if the data has actually changed
    let realChanges = false;
    
    try {
      // Use a more robust comparison by sorting object keys
      const sortObjectKeys = (obj: any) => {
        const sorted: any = {};
        Object.keys(obj).sort().forEach(key => {
          sorted[key] = obj[key];
        });
        return sorted;
      };
      
      if (Object.keys(originalSectionData).length > 0 && Object.keys(currentSectionData).length > 0) {
        const sortedCurrent = sortObjectKeys(currentSectionData);
        const sortedOriginal = sortObjectKeys(originalSectionData);
        
        realChanges = JSON.stringify(sortedCurrent) !== JSON.stringify(sortedOriginal);
      }
    } catch (e) {
      console.error("Error comparing data in handleBack:", e);
    }
    
    // Only show confirmation if there are actual changes
    if (realChanges) {
      createExitConfirmation('/mysections');
    } else {
      // Force direct navigation without using Next.js router
      console.log("No real unsaved changes, navigating directly to /mysections");
      window.location.href = '/mysections';
    }
  };

  // Render the editor with a wrapper component to handle HeroSection properly
  return (
    <>
      <NavigationManager />
      
      <EditorWrapper 
        section={section}
        template={template}
        sectionData={currentSectionData}
        onDataChange={handleDataChange}
        onSave={handleSave}
        isSaving={isSaving}
        saveMessage={saveMessage}
        onBack={handleBack}
        versionName={section?.title}
        onVersionNameChange={handleVersionNameChange}
        onVersionCreate={createNewSectionVersion}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </>
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
  onVersionCreate,
  hasUnsavedChanges
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
  hasUnsavedChanges?: boolean;
}) {
  // Check if we have a version create function
  const hasVersionCreate = !!onVersionCreate;
  // Create the section component based on template type
  const editorContent = () => {
    // Get template name to determine which section component to use
    const templateName = template?.name?.toLowerCase() || '';
    
    // Check for Social Proof template
    if (templateName.includes('social proof')) {
      const SocialProofSection = require('@/sections/SocialProofSection').default;
      const { settings, preview, code } = SocialProofSection({
        initialData: sectionData,
        onDataChange: onDataChange
      });
      return { settings, preview, code };
    }
    // Check if template name contains "feature" for feature section
    else if (templateName.includes('feature') || templateName.includes('funktion')) {
      const FeatureSection = require('@/sections/FeatureSection').default;
      const { settings, preview, code } = FeatureSection({
        initialData: sectionData,
        onDataChange: onDataChange
      });
      return { settings, preview, code };
    } else {
      // Default: use hero section for all other templates
      const { settings, preview, code } = HeroSection({
        initialData: sectionData,
        onDataChange: onDataChange
      });
      return { settings, preview, code };
    }
  };
  
  // Get the content safely
  const { settings, preview, code } = editorContent();
  
  return (
    <div className="h-screen flex flex-col pt-[60px] md:pt-[60px]">
      {/* Header with save button - fixed positioned right below navbar*/}
      <div className="bg-white border-b px-6 py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-3 fixed left-0 md:left-64 right-0 top-16 z-40">
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
                Section Builder
                <span className="ml-2 bg-gradient-to-r from-[#1c2838] to-[#354153] text-white text-xs px-2 py-0.5 rounded-full">
                  Editor
                </span>
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
            
            <button 
              onClick={onSave}
              className={`bg-[#1c2838] text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium shadow-sm flex items-center gap-1.5 cursor-pointer`}
              id="saveButton"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Speichern
            </button>
          </div>
        </div>
      </div>
      
      {/* Editor Layout */}
      <div className="flex-grow">
        <EditorLayout
          settings={settings}
          preview={preview}
          code={code}
          versionName={versionName}
          onVersionNameChange={onVersionNameChange}
          onVersionCreate={onVersionCreate}
          onSave={onSave}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>
    </div>
  );
}