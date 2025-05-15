import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { randomUUID } from 'crypto'

export async function POST() {
  const supabase = await createClient() // ✅ await!

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  const licenseKey = `BRUP-${new Date().getFullYear()}-${randomUUID().slice(0, 4).toUpperCase()}`

  const { data, error: insertError } = await supabase
    .from('licenses')
    .insert([
      {
        user_id: user.id,
        license_key: licenseKey,
        valid_until: '2025-12-31',
        template_id: null // optional: später zuweisen
      }
    ])
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, license: data })
}
