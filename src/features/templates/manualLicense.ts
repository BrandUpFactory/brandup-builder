import { supabase } from '@/lib/supabaseClient'

export async function createManualLicense({
  templateId,
  source = 'manual',
  notes = ''
}: {
  templateId: string
  source?: string
  notes?: string
}) {
  const { data, error } = await supabase.from('licenses').insert([
    {
      template_id: templateId,
      source,
      notes
    }
  ])

  if (error) {
    console.error('❌ Fehler beim Erstellen der Lizenz:', error)
    return null
  }

  return data?.[0] ?? null
}