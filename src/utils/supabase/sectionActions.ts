import { createClient } from '@/utils/supabase/clients'

const supabase = createClient()

// Typ für gespeicherte Section
export interface Section {
  id: string
  user_id: string
  template_id: string
  data: Record<string, unknown>
  name: string
  created_at: string
}

// Sections abrufen für Nutzer
export async function getUserSections(userId: string): Promise<Section[]> {
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data as Section[]
}

// Section speichern
export async function saveSection({
  userId,
  templateId,
  data,
  name
}: {
  userId: string
  templateId: string
  data: Record<string, unknown>
  name: string
}): Promise<void> {
  const { error } = await supabase.from('sections').insert({
    user_id: userId,
    template_id: templateId,
    data,
    name
  })

  if (error) throw error
}