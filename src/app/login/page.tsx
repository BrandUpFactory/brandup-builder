'use client'

import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      alert('❌ GitHub Login fehlgeschlagen.')
    }
  }

  const signInWithEmail = async () => {
    const email = prompt('E-Mail?')
    if (!email) return

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      alert('❌ Fehler beim Versenden')
    } else {
      alert('✅ Link gesendet.')
    }
  }

  return (
    <div>
      <button onClick={signInWithGithub}>Login mit GitHub</button>
      <button onClick={signInWithEmail}>Login mit E-Mail</button>
    </div>
  )
}
