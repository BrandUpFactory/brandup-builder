import { supabase } from '@/lib/supabaseClient'
import { Template } from './types'

export async function getTemplates(): Promise<Template[]> {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fehler beim Laden der Templates:', error)
    return []
  }

  return data as Template[]
}