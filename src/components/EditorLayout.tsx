'use client'

import React, { useState } from 'react'

interface EditorLayoutProps {
  settings: React.ReactNode
  preview: React.ReactNode
  code: React.ReactNode
}

export default function EditorLayout({ settings, preview, code }: EditorLayoutProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'preview' | 'code'>('settings')
  
  // On small screens, show tabs for navigation
  const mobileView = (
    <div className="md:hidden">
      <div className="flex border-b mb-4">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-sm ${activeTab === 'settings' ? 'border-b-2 border-[#1c2838] font-medium' : 'text-gray-600'}`}
        >
          Einstellungen
        </button>
        <button 
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 text-sm ${activeTab === 'preview' ? 'border-b-2 border-[#1c2838] font-medium' : 'text-gray-600'}`}
        >
          Vorschau
        </button>
        <button 
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 text-sm ${activeTab === 'code' ? 'border-b-2 border-[#1c2838] font-medium' : 'text-gray-600'}`}
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
        <div className="border rounded-xl p-4 overflow-auto mb-4">
          <h2 className="text-lg font-semibold mb-2">Vorschau</h2>
          {preview}
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
    <div className="hidden md:grid md:grid-cols-3 gap-4">
      {/* Einstellungen / Konfigurator */}
      <div className="border rounded-xl p-4 overflow-auto">
        <h2 className="text-lg font-semibold mb-2">Einstellungen</h2>
        {settings}
      </div>

      {/* Vorschau */}
      <div className="border rounded-xl p-4 overflow-auto">
        <h2 className="text-lg font-semibold mb-2">Vorschau</h2>
        {preview}
      </div>

      {/* Code Output */}
      <div className="border rounded-xl p-4 overflow-auto bg-[#f9f9f9]">
        <h2 className="text-lg font-semibold mb-2">Liquid Code</h2>
        <div className="text-sm whitespace-pre-wrap">
          {code}
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 bg-white text-[#1c2838]">
      {mobileView}
      {desktopView}
    </div>
  )
}
