import { createServerClientInstance } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createServerClientInstance()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  return NextResponse.json({ success: true })
}
