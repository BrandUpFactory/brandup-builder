import { supabase } from '@/lib/supabaseClient'

export async function hasAccessToTemplate(userId: string, templateId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('licenses')
    .select('id')
    .eq('user_id', userId)
    .eq('template_id', templateId)
    .eq('used', true)
    .maybeSingle()

  if (error) {
    console.error('Zugriffsprüfung fehlgeschlagen:', error)
    return false
  }

  return !!data
}

export async function unlockTemplateWithCode(
  userId: string,
  templateId: string,
  code: string,
  ip?: string,
  userAgent?: string
): Promise<{ success: boolean; message: string }> {
  const { data: license, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('license_code', code.trim())
    .maybeSingle()

  if (error) {
    console.error('Lizenzabruf fehlgeschlagen:', error)
    return { success: false, message: 'Fehler bei der Code-Prüfung.' }
  }

  if (!license) {
    return { success: false, message: '❌ Dieser Code existiert nicht.' }
  }

  if (license.used) {
    return { success: false, message: '⚠️ Dieser Code wurde bereits verwendet.' }
  }

  if (license.template_id !== templateId) {
    return { success: false, message: '⚠️ Code gehört zu einem anderen Template.' }
  }

  const { error: updateError } = await supabase
    .from('licenses')
    .update({
      used: true,
      user_id: userId,
      activation_ip: ip || null,
      activation_device: userAgent || null,
    })
    .eq('id', license.id)

  if (updateError) {
    console.error('Fehler beim Speichern:', updateError)
    return { success: false, message: '❌ Fehler beim Speichern der Freischaltung.' }
  }

  return { success: true, message: '✅ Template erfolgreich freigeschaltet!' }
}