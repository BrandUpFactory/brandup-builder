import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export const requireAuth = async () => {
  const cookieStore = await cookies() // ✅ await hinzufügen

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: () => {},     // no-op
        remove: () => {},  // no-op
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('NOT_AUTHENTICATED')
  }

  return user
}
