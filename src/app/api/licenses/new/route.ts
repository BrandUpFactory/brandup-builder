import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST() {
  const supabase = createClient()

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  const licenseKey = `BRUP-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

  const { data, error: insertError } = await supabase
    .from('licenses')
    .insert([
      {
        user_id: user.id,
        license_key: licenseKey,
        is_active: true
      }
    ])
    .select('*')
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, license: data })
}
