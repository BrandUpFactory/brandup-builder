'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

export default function SettingsPage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [licenses, setLicenses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastLogin, setLastLogin] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error',
    message: string
  } | null>(null)

  // Disable scroll on settings page (can be removed if not desired)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Load user and licenses
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true)
      
      // Get user
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Fehler beim Laden des Users:', error)
        setIsLoading(false)
        return
      }
      
      const currentUser = data?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        // Load user's licenses
        const { data: licenseData, error: licenseError } = await supabase
          .from('licenses')
          .select('*, templates(name, description)')
          .eq('user_id', currentUser.id)
          .order('activation_date', { ascending: false })
        
        if (!licenseError) {
          setLicenses(licenseData || [])
        }
        
        // Get last login time
        try {
          setLastLogin(
            new Date(currentUser.last_sign_in_at || '').toLocaleString('de-DE', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          )
        } catch (e) {
          console.error('Could not parse last login date', e)
        }
      }
      
      setIsLoading(false)
    }

    loadUserData()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const isLoggedIn = !!user

  const handleCreateLicense = async () => {
    try {
      const res = await fetch('/api/licenses/new', { method: 'POST' })
      const json = await res.json()

      if (json.success) {
        setNotification({
          type: 'success',
          message: `Neue Lizenz erstellt: ${json.license.license_key}`
        })
        
        // Reload licenses
        if (user) {
          const { data } = await supabase
            .from('licenses')
            .select('*, templates(name, description)')
            .eq('user_id', user.id)
            .order('activation_date', { ascending: false })
          
          setLicenses(data || [])
        }
      } else {
        setNotification({
          type: 'error',
          message: json.error || 'Ein Fehler ist aufgetreten'
        })
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Ein unerwarteter Fehler ist aufgetreten'
      })
      console.error('License creation error:', error)
    }
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  return (
    <div className="h-screen bg-white px-4 sm:px-6 md:px-10 py-6 md:py-10 text-[#1c2838] overflow-auto">
      {/* Header with notification */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8">
        <h1 className="text-2xl font-semibold">Einstellungen</h1>
        
        {notification && (
          <div className={`mt-2 sm:mt-0 px-4 py-2 rounded-lg text-sm ${
            notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {notification.message}
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:h-[calc(100%-5rem)]">
        <div className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Deine Lizenzen</h2>
              
              {isLoggedIn && (
                <button
                  onClick={handleCreateLicense}
                  className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-3 rounded-lg text-xs md:text-sm transition"
                >
                  <span className="hidden md:inline">➕</span> Neue Lizenz
                </button>
              )}
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : isLoggedIn ? (
              <div className="space-y-3 text-sm text-gray-700">
                {licenses.length > 0 ? (
                  <>
                    <div className="max-h-[400px] overflow-y-auto space-y-3 pr-1">
                      {licenses.map((license) => (
                        <div key={license.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                          <div className="flex justify-between mb-1">
                            <strong>{license.templates?.name || 'Unbenanntes Template'}</strong>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              license.used ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {license.used ? 'Aktiviert' : 'Nicht aktiviert'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mb-1">
                            Erstellung: {new Date(license.created_at).toLocaleDateString('de-DE')}
                            {license.activation_date && (
                              <> • Aktiviert: {new Date(license.activation_date).toLocaleDateString('de-DE')}</>
                            )}
                          </div>
                          <div className="font-mono text-xs bg-gray-100 rounded p-1.5 mt-1">
                            {license.license_code}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                      Für jede erworbene Section erhältst du eine eigene Lizenz.
                      Deine Lizenzen sind unbefristet gültig.
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Du hast noch keine Lizenzen.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-gray-500 mb-4">Bitte melde dich an, um deine Lizenzen zu sehen.</p>
                <Link href="/login">
                  <button className="bg-[#1c2838] text-white px-6 py-2 rounded-full text-sm hover:opacity-90 transition">
                    Jetzt anmelden
                  </button>
                </Link>
              </div>
            )}
          </div>
          
          <Link
            href="https://brandupelements.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm mt-6 text-[#8db5d8] hover:underline self-start flex items-center gap-1"
          >
            <span>➕</span> Neue Lizenz erwerben
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {isLoggedIn ? (
            <>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm flex-1">
                <h2 className="text-lg font-medium mb-2">Profilinformationen</h2>
                <div className="text-sm text-gray-700 space-y-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">E-Mail</span>
                    <strong>{user.email}</strong>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Benutzer-ID</span>
                    <code className="text-xs bg-gray-100 p-1 rounded">{user.id}</code>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm flex-1">
                <h2 className="text-lg font-medium mb-3">Sicherheit & Login</h2>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Letzter Login</span>
                  <strong className="text-sm">{lastLogin || 'Nicht verfügbar'}</strong>
                </div>
                <button 
                  onClick={() => alert('Diese Funktion ist noch nicht verfügbar.')}
                  className="mt-4 text-white bg-[#1c2838] hover:bg-opacity-90 px-4 py-2 rounded-lg text-sm w-full"
                >
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