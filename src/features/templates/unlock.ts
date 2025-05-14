import { supabase } from '@/lib/supabaseClient'

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
    .eq('template_id', templateId)
    .eq('license_code', code.trim())
    .eq('used', false)
    .maybeSingle()

  if (error || !license) {
    console.error('Lizenzfehler:', error)
    return {
      success: false,
      message: '❌ Ungültiger oder bereits verwendeter Code.'
    }
  }

  const { error: updateError } = await supabase
    .from('licenses')
    .update({
      used: true,
      user_id: userId,
      activation_ip: ip || null,
      activation_device: userAgent || null,
      activated_at: new Date().toISOString()
    })
    .eq('id', license.id)

  if (updateError) {
    console.error('❌ Fehler beim Aktualisieren der Lizenz:', updateError)
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