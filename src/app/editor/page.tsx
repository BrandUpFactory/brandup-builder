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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Link href="/editor/hero">
          <div className="border p-6 rounded-lg shadow-sm hover:shadow-md transition bg-white">
            <h2 className="text-xl font-semibold mb-2 text-[#1c2838]">Hero Section</h2>
            <p className="text-sm text-gray-600 mb-4">Erstelle eine ansprechende Hero-Sektion für dein Shopify-Theme</p>
            <div className="bg-blue-50 text-blue-800 w-fit px-3 py-1 rounded-full text-xs">Standard</div>
          </div>
        </Link>
        
        <Link href="/editor/socialproof">
          <div className="border p-6 rounded-lg shadow-sm hover:shadow-md transition bg-white">
            <h2 className="text-xl font-semibold mb-2 text-[#1c2838]">Social Proof</h2>
            <p className="text-sm text-gray-600 mb-4">Zeige Besucherzahlen und Nutzernamen in einer stylischen Social Proof Box</p>
            <div className="bg-green-50 text-green-800 w-fit px-3 py-1 rounded-full text-xs">Neu</div>
          </div>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/templates">
          <button className="bg-[#1c2838] text-white px-6 py-3 rounded-full text-sm hover:opacity-90 transition">
            Alle Templates durchsuchen
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
