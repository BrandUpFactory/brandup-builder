import { supabase } from '@/lib/supabaseClient'

export async function hasAccessToTemplate(userId: string, templateId: string) {
  const { data } = await supabase
    .from('licenses')
    .select('id')
    .eq('user_id', userId)
    .eq('template_id', templateId)
    .eq('used', true)
    .maybeSingle()

  return !!data
}
