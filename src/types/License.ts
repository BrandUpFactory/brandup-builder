export interface License {
  id: string
  template_id: string
  user_id: string | null
  license_code: string
  used: boolean
  created_at: string
  source?: string
  notes?: string
}
