import { supabase } from '@/lib/supabaseClient'

export async function unlockTemplateWithCode(
  userId: string,
  templateId: string,
  code: string
): Promise<{ success: boolean; message: string }> {
  const { data, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('template_id', templateId)
    .eq('license_code', code)
    .eq('used', false)
    .maybeSingle()

  if (error || !data) {
    return { success: false, message: '❌ Ungültiger oder bereits verwendeter Code.' }
  }

  const update = await supabase
    .from('licenses')
    .update({ used: true, user_id: userId })
    .eq('id', data.id)

  if (update.error) {
    return { success: false, message: '❌ Fehler beim Speichern der Freischaltung.' }
  }

  return { success: true, message: '✅ Template erfolgreich freigeschaltet!' }
}
