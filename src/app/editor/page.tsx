'use client'

import Link from 'next/link'

export default function EditorPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-white px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-[#1c2838] mb-4">
        Wähle ein Template, um den Editor zu verwenden
      </h1>
      <p className="text-gray-600 text-sm md:text-base max-w-xl mb-10">
        Starte mit einem bestehenden Template oder greife auf deine gespeicherten Sektionen zurück, um direkt mit der Bearbeitung loszulegen.
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/templates">
          <button className="bg-[#1c2838] text-white px-6 py-3 rounded-full text-sm hover:opacity-90 transition">
            Templates durchsuchen
          </button>
        </Link>
        <Link href="/mysections">
          <button className="bg-[#1c2838] text-white px-6 py-3 rounded-full text-sm hover:opacity-90 transition">
            Meine Sektionen
          </button>
        </Link>
      </div>
    </div>
  )
}
