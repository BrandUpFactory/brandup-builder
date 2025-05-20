import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LicenseManagementClient from '@/components/admin/LicenseManagementClient'
import isAdmin from '@/utils/isAdmin'

export default async function AdminLicensesPage() {
  const supabase = createClient()
  
  // Check if user is logged in and authorized
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?from=/admin/licenses')
  }
  
  // Überprüfen, ob der Benutzer Admin-Rechte hat
  if (!isAdmin(user)) {
    // Kein Zugriff - zurück zur Startseite
    redirect('/')
  }
  
  // Fetch all templates for the dropdown
  const { data: templates } = await supabase
    .from('templates')
    .select('id, name')
    .eq('active', true)
    .order('name')
  
  // Fetch recent licenses
  const { data: recentLicenses } = await supabase
    .from('licenses')
    .select(`
      id, 
      license_code, 
      created_at, 
      used, 
      shopify_order_id,
      templates(id, name),
      user_id,
      activation_date
    `)
    .order('created_at', { ascending: false })
    .limit(100)
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Lizenzverwaltung</h1>
      
      <LicenseManagementClient 
        user={user}
        templates={templates || []} 
        recentLicenses={recentLicenses || []} 
      />
    </div>
  )
}