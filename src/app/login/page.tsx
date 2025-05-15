'use client'

import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/settings`,
      },
    })
  }

  const signInWithEmail = async () => {
    const email = prompt('E-Mail?')
    if (!email) return

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/settings`,
      },
    })

    if (error) {
      alert('Fehler beim Senden des Links.')
    } else {
      alert('Link gesendet!')
    }
  }

  return (
    <div className="p-10">
      <h1>Login</h1>
      <button onClick={signInWithGithub}>GitHub</button>
      <button onClick={signInWithEmail}>Magic Link</button>
    </div>
  )
}