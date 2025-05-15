'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

export default function SettingsPage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Fehler beim Laden des Users:', error)
        return
      }
      setUser(data?.user ?? null)
    }

    loadUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isLoggedIn = !!user

  const handleCreateLicense = async () => {
    const res = await fetch('/api/licenses/new', { method: 'POST' })
    const json = await res.json()

    if (json.success) {
      alert(`✅ Neue Lizenz erstellt: ${json.license.license_key}`)
      // Optional: State aktualisieren, neu laden etc.
    } else {
      alert(`❌ Fehler: ${json.error}`)
    }
  }

  return (
    <div className="h-screen bg-white px-10 py-10 text-[#1c2838] overflow-hidden">
      <h1 className="text-2xl font-semibold mb-8">Einstellungen</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100%-5rem)]">
        <div className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-medium mb-4">Deine Lizenzen</h2>
            {isLoggedIn ? (
              <div className="space-y-3 text-sm text-gray-700">
                <div className="border border-gray-200 rounded-lg p-3 bg-white">
                  Lizenz #1 — <strong>Section Pro 01</strong><br />
                  Aktiv bis: <span className="text-gray-500">31.12.2025</span><br />
                  Lizenz-ID: <code>BRUP-2025-XF01</code>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 bg-white">
                  Lizenz #2 — <strong>Header Animation</strong><br />
                  Aktiv bis: <span className="text-gray-500">15.03.2026</span><br />
                  Lizenz-ID: <code>BRUP-2026-HA52</code>
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  Für jede erworbene Section erhältst du eine eigene Lizenz.
                </div>

                <button
                  onClick={handleCreateLicense}
                  className="mt-2 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
                >
                  ➕ Neue Lizenz generieren
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Bitte melde dich an, um deine Lizenzen zu sehen.</p>
            )}
          </div>
          <Link
            href="https://brandupelements.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm mt-6 text-[#8db5d8] hover:underline self-start"
          >
            ➕ Neue Lizenz erwerben
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {isLoggedIn ? (
            <>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm flex-1">
                <h2 className="text-lg font-medium mb-2">Profilinformationen</h2>
                <p className="text-sm text-gray-700 mb-2">
                  E-Mail: <strong>{user.email}</strong><br />
                  Benutzer-ID: <code>{user.id}</code>
                </p>
                <p className="text-xs text-gray-500">
                  Änderungen an deinem Profil erfolgen über dein Konto in Supabase.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm flex-1">
                <h2 className="text-lg font-medium mb-2">Sicherheit & Login</h2>
                <p className="text-sm text-gray-700 mb-2">
                  Letzter Login: <strong>09. Mai 2025 – 14:03 Uhr</strong>
                </p>
                <button className="text-sm text-[#8db5d8] hover:underline">
                  Passwort ändern
                </button>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm flex-1 flex items-center justify-center">
              <Link href="/login">
                <button className="bg-[#1c2838] text-white px-6 py-2 rounded-full text-sm hover:opacity-90 transition">
                  Jetzt anmelden
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
