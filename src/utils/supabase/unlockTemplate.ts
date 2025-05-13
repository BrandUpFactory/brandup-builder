import { createClient } from '@/utils/supabase/clients'

const supabase = createClient()

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
    .single()

  if (error || !data) {
    return { success: false, message: '❌ Ungültiger oder bereits verwendeter Code.' }
  }

  const insertResult = await supabase.from('template_access').insert({
    user_id: userId,
    template_id: templateId,
    code
  })

  if (insertResult.error) {
    return { success: false, message: '❌ Fehler beim Speichern in der Datenbank.' }
  }

  await supabase
    .from('licenses')
    .update({ used: true })
    .eq('id', data.id)

  return { success: true, message: '✅ Template erfolgreich freigeschaltet!' }
}
