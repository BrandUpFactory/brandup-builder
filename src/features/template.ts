import { supabase } from '@/lib/supabaseClient'

/**
 * Prüft, ob der User Zugriff auf ein Template hat
 */
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

/**
 * Versucht eine Lizenz zu aktivieren
 */
export async function unlockTemplateWithCode(
  userId: string,
  templateId: string,
  code: string,
  ip?: string,
  userAgent?: string
): Promise<{ success: boolean; message: string }> {
  const cleanedCode = code.trim()

  // 1. Lizenz anhand des Codes suchen (unabhängig von Template!)
  const { data: license, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('license_code', cleanedCode)
    .maybeSingle()

  // 2. Fehler beim Laden
  if (error) {
    console.error('❌ Fehler beim Abrufen der Lizenz:', error)
    return {
      success: false,
      message: '❌ Fehler bei der Datenbankabfrage.'
    }
  }

  // 3. Lizenz nicht gefunden
  if (!license) {
    return {
      success: false,
      message: '❌ Dieser Code existiert nicht.'
    }
  }

  // 4. Lizenz schon verwendet
  if (license.used) {
    return {
      success: false,
      message: '⚠️ Dieser Code wurde bereits verwendet.'
    }
  }

  // 5. Code gehört nicht zu diesem Template
  if (license.template_id !== templateId) {
    return {
      success: false,
      message: '⚠️ Dieser Code gehört zu einem anderen Template.'
    }
  }

  // 6. Lizenz zuweisen und aktivieren
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

  // 7. Erfolgreich
  return {
    success: true,
    message: '✅ Template erfolgreich freigeschaltet!'
  }
}