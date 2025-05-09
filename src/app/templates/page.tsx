'use client'

import { useEffect } from 'react'

export default function TemplatesPage() {
  useEffect(() => {
    // Nur auf Desktop Scroll deaktivieren
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className="flex items-start justify-center min-h-screen pt-[10vh] px-4 bg-white">
      <div className="max-w-4xl w-full bg-white shadow rounded-lg p-8 text-sm text-black leading-relaxed">
        <h1 className="text-2xl font-semibold mb-4">Deine Templates</h1>
        <p className="text-gray-600 mb-6">
          Hier findest du alle deine gespeicherten Templates. In Kürze kannst du eigene Vorlagen erstellen, speichern und bearbeiten.
        </p>

        <div className="text-center text-gray-400 text-sm">
          🛠️ Kommt bald: Template-Bibliothek mit visueller Vorschau.
        </div>
      </div>
    </div>
  )
}
