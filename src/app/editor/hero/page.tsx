'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import HeroSection from '@/sections/HeroSection'
import EditorLayout from '@/components/EditorLayout'

interface Version {
  id: number
  title: string
  created_at: string
  data: string
  section_id: number
}

export default function HeroEditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sectionId = searchParams.get('id')
  const supabase = createClient()
  
  const [versionName, setVersionName] = useState<string>('Unbenannte Version')
  const [sectionData, setSectionData] = useState({
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
  })
  const [isLoading, setIsLoading] = useState(!!sectionId)
  const [currentVersionId, setCurrentVersionId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
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
          setSectionData({
            ...sectionData,
            ...parsedData
          })
          
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
    setVersionName(name)
    
    // If we have a section ID, update the name in the database
    if (sectionId) {
      const { error } = await supabase
        .from('sections')
        .update({ title: name })
        .eq('id', sectionId)
      
      if (error) {
        console.error('Error updating section name:', error)
      }
    }
  }
  
  // Handle section data change
  const handleDataChange = (newData: any) => {
    setSectionData(prev => ({
      ...prev,
      ...newData
    }))
  }
  
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
      
      // Create a new version snapshot
      await handleCreateVersion()
      
      // Wait a moment to show the saving state
      setTimeout(() => {
        setIsSaving(false)
      }, 500)
      
    } catch (error) {
      console.error('Error saving section:', error)
      setIsSaving(false)
    }
  }
  
  // Create a new version snapshot
  const handleCreateVersion = async () => {
    if (!sectionId) return
    
    try {
      // Add a version record
      const { data: newVersion, error: versionError } = await supabase
        .from('section_versions')
        .insert({
          section_id: Number(sectionId),
          title: versionName,
          data: JSON.stringify(sectionData)
        })
        .select()
      
      if (versionError) throw versionError
      
      // Set the new version as current
      if (newVersion && newVersion.length > 0) {
        setCurrentVersionId(newVersion[0].id)
      }
      
      return newVersion
    } catch (error) {
      console.error('Error creating version:', error)
    }
  }
  
  // Load a specific version
  const handleVersionSelect = async (version: Version) => {
    try {
      // Parse the version data
      const versionData = JSON.parse(version.data || '{}')
      
      // Update the current UI state
      setSectionData(prev => ({
        ...prev,
        ...versionData
      }))
      
      // Update the version name
      setVersionName(version.title || 'Unbenannte Version')
      
      // Update current version ID
      setCurrentVersionId(version.id)
    } catch (error) {
      console.error('Error loading version:', error)
    }
  }
  
  // Delete a version
  const handleVersionDelete = async (versionId: number) => {
    if (!confirm('Möchtest du diese Version wirklich löschen?')) return
    
    try {
      const { error } = await supabase
        .from('section_versions')
        .delete()
        .eq('id', versionId)
        
      if (error) throw error
      
      // If we deleted the current version, set current to null
      if (currentVersionId === versionId) {
        // Load the most recent version
        const { data: latestVersion } = await supabase
          .from('section_versions')
          .select('*')
          .eq('section_id', sectionId)
          .neq('id', versionId)
          .order('created_at', { ascending: false })
          .limit(1)
          
        if (latestVersion && latestVersion.length > 0) {
          await handleVersionSelect(latestVersion[0])
        } else {
          setCurrentVersionId(null)
        }
      }
    } catch (error) {
      console.error('Error deleting version:', error)
    }
  }
  
  // Handle import data
  const handleImportData = (importedData: any) => {
    // Validate imported data to ensure it has the expected structure
    const requiredFields = ['title', 'subtitle', 'color', 'buttonText'];
    const hasRequiredFields = requiredFields.every(field => 
      importedData.hasOwnProperty(field)
    );
    
    if (!hasRequiredFields) {
      alert('Die importierten Daten haben nicht das richtige Format für eine Hero Section.');
      return;
    }
    
    // Update section data
    setSectionData(prev => ({
      ...prev,
      ...importedData
    }));
  };
  
  // Create a wrapper component to handle the HeroSection format
  const HeroSectionWrapper = () => {
    const { settings, preview, code } = HeroSection({
      initialData: sectionData,
      onDataChange: handleDataChange
    });
    
    return (
      <EditorLayout
        title="Hero Section"
        settings={settings}
        preview={preview}
        code={code}
        versionName={versionName}
        onVersionNameChange={handleVersionNameChange}
        sectionId={sectionId ? Number(sectionId) : undefined}
        onSave={handleSave}
        onVersionSelect={handleVersionSelect}
        onVersionCreate={handleCreateVersion}
        onVersionDelete={handleVersionDelete}
        currentVersionId={currentVersionId}
        exportData={sectionData}
        onImportData={handleImportData}
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
      
      <HeroSectionWrapper />
    </>
  );
}
