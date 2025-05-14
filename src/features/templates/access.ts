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
    console.error('Zugriffsprüfung fehlgeschlagen:', error)
  }

  return !!data
}