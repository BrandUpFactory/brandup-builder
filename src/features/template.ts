// src/features/template.ts

import { supabase } from '@/lib/supabaseClient'

/**
 * Prüft, ob der Benutzer bereits Zugriff auf ein Template hat
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
    console.error('❌ Fehler bei Zugriffskontrolle (hasAccessToTemplate):', error)
    return false
  }

  return !!data
}

/**
 * Aktiviert eine Lizenz anhand eines Codes für ein bestimmtes Template
 */
export async function unlockTemplateWithCode(
  userId: string,
  templateId: string,
  code: string,
  ip?: string,
  userAgent?: string
): Promise<{ success: boolean; message: string }> {
  const cleanedCode = code.trim()

  console.log('🔍 Unlock-Versuch gestartet:')
  console.log('➡️ Eingabe-Code:', cleanedCode)
  console.log('➡️ User-ID:', userId)
  console.log('➡️ Template-ID:', templateId)

  // 1. Lizenz anhand des Codes suchen
  const { data: license, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('license_code', cleanedCode)
    .maybeSingle()

  // 2. Fehler bei der Abfrage
  if (error) {
    console.error('❌ Fehler bei der Datenbankabfrage (unlockTemplateWithCode):', error)
    return {
      success: false,
      message: '❌ Fehler bei der Datenbankabfrage.'
    }
  }

  // 3. Lizenz nicht vorhanden
  if (!license) {
    console.warn('❌ Lizenz mit diesem Code wurde nicht gefunden.')
    return {
      success: false,
      message: '❌ Dieser Code existiert nicht.'
    }
  }

  // 4. Lizenz wurde bereits verwendet
  if (license.used) {
    console.warn('⚠️ Lizenz wurde bereits verwendet.')
    return {
      success: false,
      message: '⚠️ Dieser Code wurde bereits verwendet.'
    }
  }

  // 5. Lizenz gehört nicht zum angefragten Template
  if (license.template_id !== templateId) {
    console.warn('⚠️ Lizenz gehört zu einem anderen Template:', license.template_id)
    return {
      success: false,
      message: '⚠️ Dieser Code gehört zu einem anderen Template.'
    }
  }

  // 6. Lizenz aktualisieren und Benutzer zuweisen
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
    console.error('❌ Fehler beim Speichern der Freischaltung:', updateError)
    return {
      success: false,
      message: '❌ Fehler beim Speichern der Freischaltung.'
    }
  }

  // 7. Erfolg
  console.log('✅ Lizenz erfolgreich zugewiesen.')
  return {
    success: true,
    message: '✅ Template erfolgreich freigeschaltet!'
  }
}
