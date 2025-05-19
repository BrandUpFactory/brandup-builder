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
  onImportData
}: EditorLayoutProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'preview' | 'code' | 'history'>('settings')
  const [editing, setEditing] = useState(false)
  const [editingName, setEditingName] = useState(versionName || 'Unbenannte Version')
  const [showSettings, setShowSettings] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  
  // Update editingName when versionName changes
  useEffect(() => {
    setEditingName(versionName || 'Unbenannte Version')
  }, [versionName])
  
  const handleNameSave = () => {
    setEditing(false)
    if (onVersionNameChange && editingName.trim() !== '') {
      onVersionNameChange(editingName)
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave()
    }
  }
  
  // On small screens, show tabs for navigation
  const mobileView = (
    <div className="md:hidden">
      <div className="flex border-b mb-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-sm whitespace-nowrap ${activeTab === 'settings' ? 'border-b-2 border-[#1c2838] font-medium' : 'text-gray-600'}`}
        >
          Einstellungen
        </button>
        <button 
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 text-sm whitespace-nowrap ${activeTab === 'preview' ? 'border-b-2 border-[#1c2838] font-medium' : 'text-gray-600'}`}
        >
          Vorschau
        </button>
        <button 
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 text-sm whitespace-nowrap ${activeTab === 'code' ? 'border-b-2 border-[#1c2838] font-medium' : 'text-gray-600'}`}
        >
          Code
        </button>
      </div>
      
      {activeTab === 'settings' && (
        <div className="border rounded-xl p-4 overflow-auto mb-4">
          <h2 className="text-lg font-semibold mb-2">Einstellungen</h2>
          {settings}
        </div>
      )}
      
      {activeTab === 'preview' && (
        <div className="border rounded-xl overflow-auto mb-4 h-96">
          <DevicePreview>
            {preview}
          </DevicePreview>
        </div>
      )}
      
      {activeTab === 'code' && (
        <div className="border rounded-xl p-4 overflow-auto bg-[#f9f9f9] mb-4">
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
        <div className={`${showSettings ? 'col-span-3' : 'col-span-1'} transition-all duration-300`}>
          <div className="border rounded-xl overflow-hidden bg-white h-[calc(100vh-200px)] flex flex-col">
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
            <div className={`flex-1 overflow-auto ${showSettings ? 'p-4' : 'p-0'}`}>
              {showSettings ? (
                settings
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <button
                    onClick={() => setShowSettings(true)}
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
        <div className={`${showSettings ? 'col-span-9' : 'col-span-11'} flex flex-col h-[calc(100vh-200px)]`}>
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Preview */}
            <div className="border rounded-xl overflow-hidden bg-white">
              <DevicePreview>
                {preview}
              </DevicePreview>
            </div>

            {/* Code Output */}
            <div className="border rounded-xl p-4 overflow-auto bg-[#f9f9f9]">
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
      {/* Notification for copy success */}
      {copySuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          Code wurde in die Zwischenablage kopiert!
        </div>
      )}
      
      {/* Editor Header with Title and Version Control */}
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1c2838]">
            {title}
            <span className="ml-2 bg-gradient-to-r from-[#1c2838] to-[#354153] text-white text-xs px-2 py-0.5 rounded-full">
              Editor
            </span>
          </h1>
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-600 mr-1">Version:</span>
            <span className="text-sm font-medium">{versionName || 'Unbenannte Version'}</span>
          </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-gray-50 rounded-lg flex overflow-hidden shadow-sm">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(code?.toString() || '');
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
          </div>
          
          <button 
            onClick={handleSave}
            className="bg-[#1c2838] text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium shadow-sm flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Speichern
          </button>
        </div>
      </div>
      
      {mobileView}
      {desktopView}
    </div>
  )
}