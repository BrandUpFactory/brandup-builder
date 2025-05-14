'use client'

import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    })

    if (error) {
      alert('❌ GitHub Login fehlgeschlagen.')
      console.error('GitHub Login Error:', error)
    }
  }

  const signInWithEmail = async () => {
    const email = prompt('Bitte gib deine E-Mail-Adresse ein:')
    if (!email) return

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      alert('❌ Fehler beim Versenden des Login-Links.')
      console.error('Magic Link Error:', error)
    } else {
      alert('✅ Ein Login-Link wurde an deine E-Mail geschickt.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-[#1c2838]">
      <div className="p-8 shadow-md border rounded max-w-sm w-full">
        <h1 className="text-xl font-bold mb-6">Login</h1>
        <button
          onClick={signInWithGithub}
          className="w-full bg-black text-white py-2 rounded hover:opacity-80 mb-4"
        >
          Mit GitHub einloggen
        </button>
        <button
          onClick={signInWithEmail}
          className="w-full border border-gray-300 text-sm py-2 rounded hover:bg-gray-50"
        >
          Magic Link per E-Mail
        </button>
      </div>
    </div>
  )
}
