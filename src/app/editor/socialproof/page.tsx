'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import SocialProofSection from '@/sections/SocialProofSection'
import EditorLayout from '@/components/EditorLayout'

interface Version {
  id: number
  title: string
  created_at: string
  data: string
  section_id: number
}

// Loading fallback component
function EditorLoading() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
  );
}

// Main editor component wrapped with search params
function SocialProofEditor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sectionId = searchParams.get('id')
  const supabase = createClient()
  
  const [versionName, setVersionName] = useState<string>('Unbenannte Version')
  const [sectionData, setSectionData] = useState({
    firstName1: "Steffi",
    firstName2: "Daniela",
    userCount: "12.752",
    brandName: "Regenliebe",
    backgroundColor: "#f7f7f7",
    avatarImage1: "https://cdn.shopify.com/s/files/1/0818/2123/7577/files/Profil-2.jpg?v=1738073619",
    avatarImage2: "https://cdn.shopify.com/s/files/1/0818/2123/7577/files/Profil-4.jpg?v=1738083098",
    verifiedImage: "https://cdn.shopify.com/s/files/1/0818/2123/7577/files/insta-blue.png?v=1738073828",
    avatarBorderColor: "#ffffff",
    textColor: "#000000",
    showBreakOnLarge: true,
    avatarSize: "32px",
    borderRadius: "12px",
    padding: "8px 12px"
  })
  const [originalSectionData, setOriginalSectionData] = useState({})
  const [isLoading, setIsLoading] = useState(!!sectionId)
  const [currentVersionId, setCurrentVersionId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Load existing section data if we have an ID
  useEffect(() => {
    if (sectionId) {
      const fetchSectionData = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('sections')
          .select('*')
          .eq('id', sectionId)
          .single()
        
        if (error) {
          console.error('Error loading section:', error)
        } else if (data) {
          // Load section data from JSON stored in database
          const parsedData = data.data ? JSON.parse(data.data) : {}
          const newSectionData = {
            ...sectionData,
            ...parsedData
          };
          
          setSectionData(newSectionData);
          
          // Store the original data to compare for changes
          setOriginalSectionData(JSON.parse(JSON.stringify(newSectionData)));
          
          // Set version name
          setVersionName(data.title || 'Unbenannte Version')
          
          // Load latest version ID to set as current
          const { data: versionData } = await supabase
            .from('section_versions')
            .select('id')
            .eq('section_id', sectionId)
            .order('created_at', { ascending: false })
            .limit(1)
            
          if (versionData && versionData.length > 0) {
            setCurrentVersionId(versionData[0].id)
          }
        }
        
        setIsLoading(false)
      }
      
      fetchSectionData()
    }
  }, [sectionId, supabase])
  
  // Handle version name change
  const handleVersionNameChange = async (name: string) => {
    try {
      // Set the name in the UI immediately
      setVersionName(name)
      
      // If we have a section ID, update the name in the database
      if (sectionId) {
        const { error } = await supabase
          .from('sections')
          .update({ title: name })
          .eq('id', Number(sectionId))
        
        if (error) {
          throw error
        }
        
        console.log('Version name updated successfully')
      }
    } catch (error) {
      console.error('Error updating section name:', error)
      alert('Fehler beim Umbenennen der Version. Bitte versuche es erneut.')
    }
  }
  
  // Handle section data change
  const handleDataChange = (newData: any) => {
    setSectionData(prev => ({
      ...prev,
      ...newData
    }))
  }
  
  // Track if there are unsaved changes
  useEffect(() => {
    if (Object.keys(originalSectionData).length > 0) {
      try {
        // Sort the keys in both objects to ensure consistent comparison
        const sortObjectKeys = (obj: any) => {
          const sorted: any = {};
          Object.keys(obj).sort().forEach(key => {
            sorted[key] = obj[key];
          });
          return sorted;
        };
        
        const sortedCurrentData = sortObjectKeys(sectionData);
        const sortedOriginalData = sortObjectKeys(originalSectionData);
        
        const hasChanges = JSON.stringify(sortedCurrentData) !== JSON.stringify(sortedOriginalData);
        console.log("Has unsaved changes:", hasChanges);
        setHasUnsavedChanges(hasChanges);
      } catch (e) {
        console.error("Error comparing section data:", e);
      }
    }
  }, [sectionData, originalSectionData])
  
  // Save current section data
  const handleSave = async () => {
    if (!sectionId) {
      console.error('Cannot save: No section ID')
      return
    }
    
    setIsSaving(true)
    
    try {
      // Update the main section data
      const { error: sectionError } = await supabase
        .from('sections')
        .update({ 
          title: versionName,
          data: JSON.stringify(sectionData)
        })
        .eq('id', Number(sectionId))
        
      if (sectionError) throw sectionError
      
      console.log('Section data saved successfully')
      
      // Update original data to match current data (no more unsaved changes)
      setOriginalSectionData(JSON.parse(JSON.stringify(sectionData)));
      setHasUnsavedChanges(false);
      
      // Wait a moment to show the saving state
      setTimeout(() => {
        setIsSaving(false)
        // Show success message
        alert('Änderungen erfolgreich gespeichert!')
      }, 500)
      
    } catch (error) {
      console.error('Error saving section:', error)
      setIsSaving(false)
      alert('Fehler beim Speichern. Bitte versuche es erneut.')
    }
  }
  
  // Handle import data
  const handleImportData = (importedData: any) => {
    // Validate imported data to ensure it has the expected structure
    const requiredFields = ['firstName1', 'firstName2', 'userCount', 'brandName'];
    const hasRequiredFields = requiredFields.every(field => 
      importedData.hasOwnProperty(field)
    );
    
    if (!hasRequiredFields) {
      alert('Die importierten Daten haben nicht das richtige Format für eine Social Proof Section.');
      return;
    }
    
    // Update section data
    setSectionData(prev => ({
      ...prev,
      ...importedData
    }));
  };
  
  // Create a wrapper component to handle the SocialProofSection format
  const SocialProofSectionWrapper = () => {
    const { settings, preview, code } = SocialProofSection({
      initialData: sectionData,
      onDataChange: handleDataChange
    });
    
    return (
      <EditorLayout
        title="Social Proof"
        settings={settings}
        preview={preview}
        code={code}
        versionName={versionName}
        onVersionNameChange={handleVersionNameChange}
        sectionId={sectionId ? Number(sectionId) : undefined}
        onSave={handleSave}
        exportData={sectionData}
        onImportData={handleImportData}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : isSaving ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mr-3"></div>
            <span>Speichern...</span>
          </div>
        </div>
      ) : null}
      
      <SocialProofSectionWrapper />
    </>
  );
}

// Export the page component with Suspense boundary
export default function SocialProofEditorPage() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <SocialProofEditor />
    </Suspense>
  );
}