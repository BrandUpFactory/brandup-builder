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
    console.error('❌ Zugriffskontrolle fehlgeschlagen:', error)
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
  const cleanedCode = code.trim().replaceAll('"', '').replaceAll(/\s/g, '')

  console.log('🔐 Unlock-Versuch gestartet:')
  console.log('➡️ Eingabe-Code:', cleanedCode)
  console.log('👤 User-ID:', userId)
  console.log('📦 Template-ID:', templateId)

  const { data: license, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('license_code', cleanedCode)
    .maybeSingle()

  console.log('🧠 Ergebnis von Supabase:', { license, error })

  // ❌ Supabase Fehler
  if (error) {
    return {
      success: false,
      message: '❌ Fehler bei der Datenbankabfrage.'
    }
  }

  // ❌ Kein Datensatz gefunden
  if (!license) {
    return {
      success: false,
      message: '❌ Dieser Code existiert nicht.'
    }
  }

  // ⚠️ Bereits verwendet
  if (license.used) {
    return {
      success: false,
      message: '⚠️ Dieser Code wurde bereits verwendet.'
    }
  }

  // ⚠️ Falsches Template
  if (license.template_id !== templateId) {
    return {
      success: false,
      message: '⚠️ Dieser Code gehört zu einem anderen Template.'
    }
  }

  // ✅ Lizenz speichern
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
  return {
    success: true,
    message: '✅ Template erfolgreich freigeschaltet!'
  }
}
