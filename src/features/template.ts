// src/features/template.ts

import { supabase } from '@/lib/supabaseClient'

/**
 * Prüft, ob ein Benutzer Zugriff auf ein bestimmtes Template hat.
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
    console.error('Zugriffsprüfung fehlgeschlagen:', error)
    return false
  }

  return !!data
}

/**
 * Aktiviert eine Lizenz mit Code, IP und Gerät.
 */
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
    console.error('❌ Lizenz nicht gefunden oder schon verwendet:', error)
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

  return {
    success: true,
    message: '✅ Template erfolgreich freigeschaltet!'
  }
}