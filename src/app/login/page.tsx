'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

export default function LoginPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/settings`,
      },
    })
    setLoading(false)
    if (error) setMessage(`❌ Fehler: ${error.message}`)
  }

  const handleMagicLink = async () => {
    const email = prompt('Bitte gib deine E-Mail ein:')
    if (!email) return

    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/settings`,
      },
    })
    setLoading(false)
    setMessage(
      error
        ? '❌ Fehler beim Senden des Links.'
        : '✅ Magic Link gesendet – check deine Mail!'
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf2f8] to-[#fdfefe] px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-extrabold text-center text-[#1c2838] mb-6">
          Willkommen zurück
        </h1>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium text-[#1c2838] transition cursor-pointer"
          >
            <FcGoogle size={20} />
            Mit Google anmelden
          </button>

          <button
            onClick={() => handleOAuthLogin('github')}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-full bg-black hover:opacity-90 text-white text-sm font-medium transition cursor-pointer"
          >
            <FaGithub size={18} />
            Mit GitHub anmelden
          </button>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm text-gray-500">
              <span className="bg-white px-2">oder</span>
            </div>
          </div>

          <button
            onClick={handleMagicLink}
            disabled={loading}
            className="w-full py-2 rounded-full bg-[#1c2838] text-white hover:opacity-90 text-sm font-medium transition cursor-pointer"
          >
            Magic Link per E-Mail
          </button>

          {message && (
            <p className="text-center text-xs text-gray-600 mt-2">{message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
