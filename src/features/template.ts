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
): Promise<{ success: boolean; message: string; sectionId?: number }> {
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

  // Prüfen ob bereits eine Sektion mit diesem Template existiert
  const { data: existingSection } = await supabase
    .from('sections')
    .select('id')
    .eq('user_id', userId)
    .eq('template_id', templateId)
    .maybeSingle()
  
  // Transaktion starten - wir wollen sicherstellen, dass sowohl die Lizenz als auch
  // die neue Sektion korrekt gespeichert werden
  
  // 1. Lizenz aktualisieren
  const { error: updateError } = await supabase
    .from('licenses')
    .update({
      used: true,
      user_id: userId,
      activation_ip: ip ?? null,
      activation_device: userAgent ?? null,
      activation_date: new Date().toISOString()
    })
    .eq('id', license.id)

  if (updateError) {
    console.error('❌ Fehler beim Aktualisieren der Lizenz:', updateError)
    return { success: false, message: '❌ Fehler beim Speichern der Freischaltung.' }
  }
  
  // 2. Neue Section erstellen, wenn keine existiert
  let sectionId = existingSection?.id
  
  if (!existingSection) {
    // Template-Details abrufen für den Titel
    const { data: templateData } = await supabase
      .from('templates')
      .select('name')
      .eq('id', templateId)
      .single()
    
    const templateName = templateData?.name || 'Unnamed Template';
    
    // Neue Section erstellen
    const { data: newSection, error: sectionError } = await supabase
      .from('sections')
      .insert({
        user_id: userId,
        template_id: templateId,
        title: templateName,
        data: {}, // Leere Daten, die im Editor gefüllt werden
        license_id: license.id,
      })
      .select('id')
      .single()
    
    if (sectionError) {
      console.error('❌ Fehler beim Erstellen der Section:', sectionError)
      // Wir geben trotzdem Erfolg zurück, da die Lizenz aktiviert wurde
      return { 
        success: true, 
        message: '✅ Template freigeschaltet, aber es konnte keine Section erstellt werden.'
      }
    }
    
    sectionId = newSection.id
  }

  return { 
    success: true, 
    message: '✅ Template erfolgreich freigeschaltet!',
    sectionId
  }
}
