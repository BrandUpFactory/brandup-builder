import { createClient } from '@/utils/supabase/clients'

const supabase = createClient()

export async function hasAccessToTemplate(userId: string, templateId: string) {
  const { data } = await supabase
    .from('template_access')
    .select('id')
    .eq('user_id', userId)
    .eq('template_id', templateId)
    .maybeSingle()

  return !!data
}
