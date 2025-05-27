'use client'

import React, { useState, useEffect } from 'react'
import DevicePreview from './DevicePreview'
import VersionHistory from './VersionHistory'
import ExportImportPanel from './ExportImportPanel'

interface EditorLayoutProps {
  settings: React.ReactNode
  preview: React.ReactNode
  code: React.ReactNode
  title?: string
  versionName?: string
  onVersionNameChange?: (name: string) => void
  sectionId?: number
  onSave?: () => void
  onVersionSelect?: (version: any) => void
  onVersionCreate?: () => void
  onVersionDelete?: (versionId: number) => void
  currentVersionId?: number | null
  exportData?: object
  onImportData?: (data: any) => void
  hasUnsavedChanges?: boolean
  onDeviceChange?: (device: 'desktop' | 'tablet' | 'mobile') => void
  onShowTutorial?: () => void
  previewMode?: 'builder' | 'product'
  onPreviewModeChange?: (mode: 'builder' | 'product') => void
  productUrl?: string
  onProductUrlChange?: (url: string) => void
}

export default function EditorLayout({ 
  settings, 
  preview, 
  code, 
  title = 'Section Builder',
  versionName,
  onVersionNameChange,
  sectionId,
  onSave,
  onVersionSelect,
  onVersionCreate,
  onVersionDelete,
  currentVersionId,
  exportData = {},
  onImportData,
  hasUnsavedChanges = false,
  onDeviceChange,
  onShowTutorial,
  previewMode,
  onPreviewModeChange,
  productUrl,
  onProductUrlChange
}: EditorLayoutProps) {
  // Check if we have a version create function
  const hasVersionCreate = !!onVersionCreate;
  const [activeTab, setActiveTab] = useState<'settings' | 'preview' | 'code' | 'history'>('settings')
  const [editing, setEditing] = useState(false)
  const [editingName, setEditingName] = useState(versionName || 'Unbenannte Version')
  const [showSettings, setShowSettings] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)
  const [creatingVersion, setCreatingVersion] = useState(false)
  const [versionLimitError, setVersionLimitError] = useState(false)
  const [versionCreateError, setVersionCreateError] = useState(false)
  
  // Update editingName when versionName changes
  useEffect(() => {
    setEditingName(versionName || 'Unbenannte Version')
  }, [versionName])
  
  // Add keyboard shortcut for saving (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (onSave) {
          onSave()
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSave])
  
  const handleNameSave = () => {
    setEditing(false)
    if (onVersionNameChange && editingName.trim() !== '') {
      onVersionNameChange(editingName)
      // Show success notification
      setNameSuccess(true)
      setTimeout(() => setNameSuccess(false), 2000)
    }
  }

  // Save function that will be called by a keyboard shortcut
  const handleSave = () => {
    console.log("EditorLayout: handleSave called");
    
    if (onSave) {
      console.log("EditorLayout: Calling parent onSave function from keyboard shortcut");
      // Call the parent's onSave function
      onSave();
    } else {
      console.error("EditorLayout: onSave function is not defined");
    }
  }
  
  // Handle creating a new version
  const handleCreateVersion = async () => {
    if (onVersionCreate && !creatingVersion) {
      setCreatingVersion(true);
      try {
        console.log('Creating new version - button clicked');
        await onVersionCreate();
        console.log('Version creation successful - redirecting...');
      } catch (error: any) {
        console.error('Error creating new version:', error);
        
        // Specific error handling based on error message
        if (error?.message?.includes('Maximum') || error?.message?.includes('maximum') || error?.message?.includes('limit')) {
          console.log('Showing version limit error notification');
          setVersionLimitError(true);
          setTimeout(() => setVersionLimitError(false), 5000);
        } else {
          // For other errors, show a generic error notification
          console.log('Showing generic version create error notification');
          setVersionCreateError(true);
          setTimeout(() => setVersionCreateError(false), 5000);
        }
      } finally {
        // Reset the creating state after a short delay
        // This prevents flashing of button states during navigation
        setTimeout(() => {
          setCreatingVersion(false);
        }, 500);
      }
    }
  }
  
  // On small screens, show tabs for navigation
  const mobileView = (
    <div className="md:hidden">
      <div className="flex border-b mb-4">
        <button 
          onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}
          className={`px-4 py-2 text-sm whitespace-nowrap ${activeTab === 'settings' ? 'border-b-2 border-[#1c2838] font-medium' : 'text-gray-600'}`}
        >
          Einstellungen
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); setActiveTab('preview'); }}
          className={`px-4 py-2 text-sm whitespace-nowrap ${activeTab === 'preview' ? 'border-b-2 border-[#1c2838] font-medium' : 'text-gray-600'}`}
        >
          Vorschau
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); setActiveTab('code'); }}
          className={`px-4 py-2 text-sm whitespace-nowrap ${activeTab === 'code' ? 'border-b-2 border-[#1c2838] font-medium' : 'text-gray-600'}`}
        >
          Code
        </button>
      </div>
      
      {activeTab === 'settings' && (
        <div className="border rounded-xl p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Einstellungen</h2>
          {settings}
        </div>
      )}
      
      {activeTab === 'preview' && (
        <div className="border rounded-xl mb-4 h-96">
          <DevicePreview 
            onDeviceChange={onDeviceChange}
            previewMode={previewMode}
            onPreviewModeChange={onPreviewModeChange}
            productUrl={productUrl}
            onProductUrlChange={onProductUrlChange}
          >
            {preview}
          </DevicePreview>
        </div>
      )}
      
      {activeTab === 'code' && (
        <div className="border rounded-xl p-4 bg-[#f9f9f9] mb-4">
          <h2 className="text-lg font-semibold mb-2">Liquid Code</h2>
          <div className="text-sm whitespace-pre-wrap">
            {code}
          </div>
        </div>
      )}
    </div>
  )
  
  // On larger screens, show grid layout
  const desktopView = (
    <div className="hidden md:block">
      <div className="grid grid-cols-12 gap-4">
        {/* Settings Sidebar */}
        <div className={`${showSettings ? 'col-span-4' : 'col-span-1'} transition-all duration-300`}>
          <div className="border rounded-xl bg-white h-[calc(100vh-200px)] flex flex-col">
            <div className="p-2 bg-gray-50 border-b flex items-center justify-between">
              <h2 className={`text-sm font-semibold text-gray-700 ${!showSettings && 'hidden'}`}>Einstellungen</h2>
              <button 
                onClick={() => setShowSettings(!showSettings)} 
                className="text-gray-400 hover:text-gray-700 p-1 transition rounded"
                title={showSettings ? "Einstellungen minimieren" : "Einstellungen maximieren"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {showSettings ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  )}
                </svg>
              </button>
            </div>
            <div className={`flex-1 ${showSettings ? 'p-4' : 'p-0'}`} style={{ overflowY: showSettings ? 'auto' : 'hidden' }}>
              {showSettings ? (
                settings
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <button
                    onClick={(e) => { e.preventDefault(); setShowSettings(true); }}
                    className="transform -rotate-90 whitespace-nowrap text-sm text-gray-500 hover:text-[#1c2838] transition"
                  >
                    Einstellungen anzeigen
                  </button>
                </div>
              )}
            </div>
            
            {/* Version History and Import/Export at bottom of sidebar */}
            {showSettings && (
              <div className="p-3 border-t bg-gray-50 space-y-3">
                {onImportData && (
                  <ExportImportPanel
                    data={exportData}
                    onImport={onImportData}
                    title={title}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Area - Changed to have preview and code side by side */}
        <div className={`${showSettings ? 'col-span-8' : 'col-span-11'} flex flex-col h-[calc(100vh-200px)]`}>
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Preview */}
            <div className="border rounded-xl bg-white overflow-auto">
              <DevicePreview 
                onDeviceChange={onDeviceChange}
                previewMode={previewMode}
                onPreviewModeChange={onPreviewModeChange}
                productUrl={productUrl}
                onProductUrlChange={onProductUrlChange}
              >
                {preview}
              </DevicePreview>
            </div>

            {/* Code Output */}
            <div className="border rounded-xl p-4 bg-[#f9f9f9] overflow-auto">
              <h2 className="text-lg font-semibold mb-2">Liquid Code</h2>
              <div className="text-sm whitespace-pre-wrap">
                {code}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-4 md:p-6 bg-white text-[#1c2838]">
      {/* Notifications */}
      {copySuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fadeIn">
          Code wurde in die Zwischenablage kopiert!
        </div>
      )}
      {nameSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fadeIn">
          Versionsname erfolgreich geändert!
        </div>
      )}
      
      {/* Removed unsaved changes indicator per client request */}
      
      {/* Version limit error notification */}
      {versionLimitError && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fadeIn">
          Sie haben das Maximum von 5 Versionen für dieses Template erreicht. Bitte löschen Sie eine vorhandene Version.
        </div>
      )}
      {/* Generic version create error notification */}
      {versionCreateError && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fadeIn">
          Fehler beim Erstellen einer neuen Version. Bitte versuchen Sie es später erneut.
        </div>
      )}
      
      {/* Editor Header with Version Control only - Fixed position */}
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-3 sticky top-0 bg-white z-10 py-3 border-b">
        <div>
          <div className="flex items-center mt-1">
            {editing ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onBlur={handleNameSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                />
                <button 
                  onClick={handleNameSave}
                  className="ml-2 bg-[#1c2838] hover:bg-opacity-80 transition text-white rounded-full p-1 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <span className="text-sm text-gray-600 mr-1">Version:</span>
                <span className="text-sm font-medium">{versionName || 'Unbenannte Version'}</span>
                <button 
                  onClick={() => setEditing(true)}
                  className="ml-1.5 text-gray-400 hover:text-[#1c2838] transition"
                  title="Version umbenennen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="bg-gray-50 rounded-lg flex shadow-sm">
              <button 
                onClick={() => {
                  // Find the actual code content from ReactNode
                  let codeText = '';
                  
                  try {
                    // Check if code is a React element with pre tag inside
                    if (code && typeof code === 'object' && 'props' in code) {
                      // Handle code being a React element with children
                      const codeElement = code as React.ReactElement;
                      
                      // If it has children with a pre tag
                      if (codeElement.props.children) {
                        const children = codeElement.props.children;
                        
                        // Find the pre element with the actual code
                        let preElement;
                        
                        if (Array.isArray(children)) {
                          // Look for the pre element in the array
                          preElement = children.find(child => 
                            typeof child === 'object' && 
                            'type' in child && 
                            child.type === 'pre'
                          );
                        } else if (typeof children === 'object' && 'type' in children && children.type === 'pre') {
                          preElement = children;
                        }
                        
                        // Extract content from pre element
                        if (preElement && 'props' in preElement && preElement.props.children) {
                          codeText = preElement.props.children;
                        }
                      }
                    }
                    
                    // If we couldn't extract it from the structure, try direct text
                    if (!codeText && typeof code === 'string') {
                      codeText = code;
                    }
                    
                    // Final fallback, but skip [object Object]
                    if (!codeText && code !== undefined && code !== null) {
                      const tempText = String(code);
                      if (tempText !== '[object Object]') {
                        codeText = tempText;
                      } else {
                        throw new Error('Unable to extract code content');
                      }
                    }
                  } catch (err) {
                    // If all else fails, look for a pre element in the DOM to extract the content
                    const preElement = document.querySelector('pre');
                    if (preElement) {
                      codeText = preElement.textContent || '';
                    }
                  }
                  
                  // Copy to clipboard
                  navigator.clipboard.writeText(codeText);
                  setCopySuccess(true);
                  setTimeout(() => setCopySuccess(false), 2000);
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 transition font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Code kopieren
              </button>
              <button 
                onClick={() => window.open('https://www.brandupfactory.com/help-center', '_blank')}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 transition font-medium border-l border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Hilfe
              </button>
              <button 
                onClick={() => {
                  if (onShowTutorial) {
                    onShowTutorial();
                  }
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 transition font-medium border-l border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Anleitung
              </button>
            </div>
        </div>
      </div>
      
      {mobileView}
      {desktopView}
    </div>
  )
}