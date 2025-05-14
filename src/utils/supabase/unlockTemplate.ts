import { createClient } from '@/utils/supabase/clients'

const supabase = createClient()

export async function unlockTemplateWithCode(
  userId: string,
  templateId: string,
  code: string
): Promise<{ success: boolean; message: string }> {
  // Suche nach passender, noch nicht verwendeter Lizenz
  const { data: license, error: licenseError } = await supabase
    .from('licenses')
    .select('id')
    .eq('template_id', templateId)
    .eq('license_code', code)
    .eq('used', false)
    .maybeSingle()

  if (licenseError || !license) {
    return { success: false, message: '❌ Ungültiger oder bereits verwendeter Code.' }
  }

  // Berechtigung in template_access eintragen
  const { error: insertError } = await supabase.from('template_access').insert({
    user_id: userId,
    template_id: templateId
  })

  if (insertError) {
    return { success: false, message: '❌ Fehler beim Speichern der Freischaltung.' }
  }

  // Lizenz als verwendet markieren
  await supabase
    .from('licenses')
    .update({ used: true })
    .eq('id', license.id)

  return { success: true, message: '✅ Template erfolgreich freigeschaltet!' }
}
