import { supabase } from '@/lib/supabaseClient'

/**
 * Holt alle aktiven Templates aus der Datenbank.
 */
export async function getTemplates() {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Fehler beim Laden der Templates:', error)
    return []
  }

  return data
}
