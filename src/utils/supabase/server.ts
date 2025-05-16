import { cookies as getCookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies'

export const createClient = () => {
  const cookieStore = getCookies() as unknown as RequestCookies

  // Supabase erwartet set/remove, aber Middleware regelt das
  const cookieHandler = {
    get(name: string) {
      return cookieStore.get(name)?.value ?? null
    },
    getAll() {
      return cookieStore.getAll()
    },
    set() {},     // handled by middleware
    remove() {},  // handled by middleware
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieHandler,
    }
  )
}
