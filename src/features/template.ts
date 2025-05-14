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
    console.error('❌ Zugriff prüfen fehlgeschlagen:', error)
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

  console.log('🔓 Unlock-Versuch gestartet:')
  console.log('👉 Eingabe-Code:', cleanedCode)
  console.log('👤 User-ID:', userId)
  console.log('📄 Template-ID:', templateId)

  const { data: license, error } = await supabase
    .from('licenses')
    .select('*')
    .ilike('license_code', cleanedCode) // <- Case-insensitive Vergleich
    .maybeSingle()

  if (error) {
    console.error('❌ Fehler beim Abrufen der Lizenz:', error)
    return {
      success: false,
      message: '❌ Fehler bei der Datenbankabfrage.'
    }
  }

  if (!license) {
    console.warn('⚠️ Keine Lizenz mit diesem Code gefunden.')
    return {
      success: false,
      message: '❌ Dieser Code existiert nicht.'
    }
  }

  if (license.used) {
    return {
      success: false,
      message: '⚠️ Dieser Code wurde bereits verwendet.'
    }
  }

  if (license.template_id !== templateId) {
    return {
      success: false,
      message: '⚠️ Dieser Code gehört zu einem anderen Template.'
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
    console.error('❌ Fehler beim Aktualisieren:', updateError)
    return {
      success: false,
      message: '❌ Fehler beim Speichern der Freischaltung.'
    }
  }

  console.log('✅ Lizenz erfolgreich aktiviert für User:', userId)

  return {
    success: true,
    message: '✅ Template erfolgreich freigeschaltet!'
  }
}