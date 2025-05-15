'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function CallbackPage() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const exchange = async () => {
      await supabase.auth.exchangeCodeForSession(window.location.href)
      router.replace('/')
    }

    exchange()
  }, [])

  return <p className="p-10 text-center">🔄 Anmeldung läuft…</p>
}
