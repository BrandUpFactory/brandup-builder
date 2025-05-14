export interface Template {
  id: string
  name: string
  description: string
  image_url: string
  edit_url: string
  buy_url: string
  active: boolean
  created_at: string
}

export interface License {
  id: string
  template_id: string
  user_id: string | null
  license_code: string
  used: boolean
  created_at: string
  source?: string
  notes?: string
  activation_ip?: string | null
  activation_device?: string | null
}