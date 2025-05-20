import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProductTemplateMapperClient from '@/components/admin/ProductTemplateMapperClient'

export default async function ProductMappingPage() {
  const supabase = createClient()
  
  // Check if user is logged in and authorized
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?from=/admin/products')
  }
  
  // In a real app, you'd check if the user has admin privileges
  // For now, we'll just use authorization based on login

  // Fetch templates for dropdown
  const { data: templates } = await supabase
    .from('templates')
    .select('id, name')
    .eq('active', true)
    .order('name')
  
  // Fetch product mappings
  const { data: mappings } = await supabase
    .from('product_template_mapping')
    .select(`
      id, 
      shopify_product_id, 
      shopify_variant_id,
      created_at,
      templates(id, name)
    `)
    .order('created_at', { ascending: false })
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Produkt-Template Zuordnung</h1>
      
      <ProductTemplateMapperClient 
        user={user}
        templates={templates || []}
        mappings={mappings || []}
      />
    </div>
  )
}