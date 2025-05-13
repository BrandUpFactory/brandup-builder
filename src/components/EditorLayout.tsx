'use client'

import React from 'react'

interface EditorLayoutProps {
  settings: React.ReactNode
  preview: React.ReactNode
  code: React.ReactNode
}

export default function EditorLayout({ settings, preview, code }: EditorLayoutProps) {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white text-[#1c2838]">
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
}
