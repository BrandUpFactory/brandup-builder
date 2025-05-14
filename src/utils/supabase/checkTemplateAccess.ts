import { createClient } from '@/utils/supabase/clients'

const supabase = createClient()

export async function hasAccessToTemplate(userId: string, templateId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('template_access')
    .select('id')
    .eq('user_id', userId)
    .eq('template_id', templateId)
    .maybeSingle()

  if (error) {
    console.error('Fehler beim Prüfen des Zugriffs:', error)
    return false
  }

  return !!data
}
