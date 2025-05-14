'use client'

import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export async function hasAccessToTemplate(userId: string, templateId: string): Promise<boolean> {
  if (!userId || !templateId) {
    console.warn('hasAccessToTemplate: Ungültige Parameter', { userId, templateId })
    return false
  }

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

export async function unlockTemplateWithCode(
  userId: string,
  templateId: string,
  code: string,
  ip?: string,
  userAgent?: string
): Promise<{ success: boolean; message: string }> {
  const cleanedCode = code.trim()

  if (!cleanedCode) return { success: false, message: '⚠️ Der Code darf nicht leer sein.' }

  const { data: license, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('license_code', cleanedCode)
    .maybeSingle()

  if (error) {
    console.error('❌ Fehler beim Lizenzabruf:', error)
    return { success: false, message: '❌ Fehler beim Abrufen des Codes.' }
  }

  if (!license) return { success: false, message: '❌ Dieser Code existiert nicht.' }

  if (license.used) return { success: false, message: '⚠️ Dieser Code wurde bereits verwendet.' }

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
