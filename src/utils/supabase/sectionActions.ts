import { createClient } from '@/utils/supabase/clients'

const supabase = createClient()

export async function getUserSections(userId: string) {
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data
}

export async function saveSection({
  userId,
  templateId,
  data,
  name
}: {
  userId: string
  templateId: string
  data: any
  name: string
}) {
  const { error } = await supabase.from('sections').insert({
    user_id: userId,
    template_id: templateId,
    data,
    name
  })

  if (error) throw error
}