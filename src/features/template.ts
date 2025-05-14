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
    console.error('❌ Fehler bei Zugriffskontrolle:', error)
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
  const cleanedCode = code.trim()

  const { data: license, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('license_code', cleanedCode)
    .eq('template_id', templateId)
    .eq('used', false) // 🔥 Wichtig, sonst blockt die Policy!
    .maybeSingle()

  if (error) {
    console.error('❌ Fehler beim Abrufen der Lizenz:', error)
    return {
      success: false,
      message: '❌ Fehler bei der Datenbankabfrage.'
    }
  }

  if (!license) {
    return {
      success: false,
      message: '❌ Dieser Code existiert nicht.'
    }
  }

  const { error: updateError } = await supabase
    .from('licenses')
    .update({
      used: true,
      user_id: userId,
      activation_ip: ip || null,
      activation_device: userAgent || null
    })
    .eq('id', license.id)

  if (updateError) {
    console.error('❌ Fehler beim Speichern:', updateError)
    return {
      success: false,
      message: '❌ Fehler beim Speichern der Freischaltung.'
    }
  }

  return {
    success: true,
    message: '✅ Template erfolgreich freigeschaltet!'
  }
}
