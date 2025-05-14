import { supabase } from '@/lib/supabaseClient'

export async function unlockTemplateWithCode(
  userId: string,
  templateId: string,
  code: string,
  ip?: string,
  userAgent?: string
): Promise<{ success: boolean; message: string }> {
  // 🛡️ Vorprüfung & Logging
  const trimmedCode = code.trim()
  console.log('🔓 Unlock-Versuch:', { userId, templateId, code: trimmedCode })

  // 🔍 Lizenz suchen
  const { data: license, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('template_id', templateId)
    .eq('license_code', trimmedCode)
    .eq('used', false)
    .maybeSingle()

  if (error) {
    console.error('❌ Fehler bei Lizenzabfrage:', error)
    return {
      success: false,
      message: '❌ Ein technischer Fehler ist aufgetreten.'
    }
  }

  if (!license) {
    console.warn('⚠️ Keine gültige Lizenz gefunden für:', {
      templateId,
      code: trimmedCode
    })
    return {
      success: false,
      message: '❌ Ungültiger oder bereits verwendeter Code.'
    }
  }

  // 📝 Lizenz updaten
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
    console.error('❌ Fehler beim Aktualisieren der Lizenz:', updateError)
    return {
      success: false,
      message: '❌ Fehler beim Speichern der Freischaltung.'
    }
  }

  // ✅ Erfolg
  console.log('✅ Lizenz erfolgreich aktiviert:', {
    licenseId: license.id,
    userId,
    templateId
  })

  return {
    success: true,
    message: '✅ Template erfolgreich freigeschaltet!'
  }
}
