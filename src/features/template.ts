'use client'

import { createClient } from '@/utils/supabase/clients'

const supabase = createClient()

/**
 * Prüft, ob ein Benutzer bereits Zugriff auf ein Template hat.
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
    console.error('❌ Fehler bei der Zugriffskontrolle:', error)
    return false
  }

  return !!data
}

/**
 * Aktiviert eine Lizenz über einen Code für einen Benutzer.
 */
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
    .maybeSingle()

  if (error) {
    console.error('❌ Fehler beim Lizenzabruf:', error)
    return { success: false, message: '❌ Fehler beim Abrufen des Codes.' }
  }

  if (!license) {
    return { success: false, message: '❌ Dieser Code existiert nicht.' }
  }

  if (license.used) {
    return { success: false, message: '⚠️ Dieser Code wurde bereits verwendet.' }
  }

  if (license.template_id !== templateId) {
    return { success: false, message: '⚠️ Dieser Code gehört zu einem anderen Template.' }
  }

  const { error: updateError } = await supabase
    .from('licenses')
    .update({
      used: true,
      user_id: userId,
      activation_ip: ip ?? null,
      activation_device: userAgent ?? null,
    })
    .eq('id', license.id)

  if (updateError) {
    console.error('❌ Fehler beim Aktualisieren der Lizenz:', updateError)
    return { success: false, message: '❌ Fehler beim Speichern der Freischaltung.' }
  }

  return { success: true, message: '✅ Template erfolgreich freigeschaltet!' }
}
