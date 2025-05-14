import { supabase } from '@/lib/supabaseClient'

interface CreateManualLicenseParams {
  templateId: string
  source?: string
  notes?: string
}

/**
 * Erstellt eine neue Lizenz manuell (z. B. für Tests oder manuelle Vergabe).
 */
export async function createManualLicense({
  templateId,
  source = 'manual',
  notes = ''
}: CreateManualLicenseParams) {
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
