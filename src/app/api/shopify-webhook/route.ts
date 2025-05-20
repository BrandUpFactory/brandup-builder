import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Types for Shopify webhook payload
interface ShopifyOrderItem {
  id: number
  product_id: number
  variant_id: number
  quantity: number
  title: string
  price: string
  sku: string
}

interface ShopifyOrder {
  id: number
  name: string
  email: string
  total_price: string
  created_at: string
  line_items: ShopifyOrderItem[]
  customer: {
    id: number
    email: string
    first_name: string
    last_name: string
  }
}

export async function POST(request: NextRequest) {
  // Shopify Webhook Secret validation
  const shopifySecret = process.env.SHOPIFY_WEBHOOK_SECRET
  const hmacHeader = request.headers.get('x-shopify-hmac-sha256')
  
  if (!hmacHeader || !shopifySecret) {
    console.error('Missing HMAC header or webhook secret')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Get request body as text for HMAC validation
  const rawBody = await request.text()
  
  // Clone the request to get the JSON data since we already consumed the body
  const clonedRequest = request.clone()
  const payload = await clonedRequest.json() as ShopifyOrder
  
  // Validate the HMAC signature
  try {
    const calculatedHmac = crypto
      .createHmac('sha256', shopifySecret)
      .update(rawBody)
      .digest('base64')
      
    // Verify the hmac
    if (calculatedHmac !== hmacHeader) {
      console.error('HMAC validation failed')
      return NextResponse.json({ error: 'HMAC validation failed' }, { status: 401 })
    }
  } catch (error) {
    console.error('Error validating HMAC:', error)
    return NextResponse.json({ error: 'HMAC validation error' }, { status: 401 })
  }
  
  try {
    // Create Supabase client
    const supabase = createClient()
    
    // Extract order information
    const orderId = payload.id
    const orderName = payload.name // Usually in the format #1234
    const customerEmail = payload.customer?.email || payload.email
    const lineItems = payload.line_items || []
    
    console.log(`Processing Shopify order ${orderName} (ID: ${orderId})`)
    
    // Track created licenses to return in the response
    const createdLicenses = []
    
    // Create a license for each purchased product
    for (const item of lineItems) {
      const productId = item.product_id
      const variantId = item.variant_id
      const quantity = item.quantity || 1
      
      console.log(`Processing item: ${item.title} (Product ID: ${productId}, Variant ID: ${variantId})`)
      
      // Try to find a matching template based on product ID and variant ID
      let templateMapping = null
      
      // First try with both product and variant
      if (variantId) {
        const { data } = await supabase
          .from('product_template_mapping')
          .select('template_id, templates(name)')
          .eq('shopify_product_id', productId.toString())
          .eq('shopify_variant_id', variantId.toString())
          .maybeSingle()
          
        if (data) templateMapping = data
      }
      
      // If no result, try with just product ID
      if (!templateMapping) {
        const { data } = await supabase
          .from('product_template_mapping')
          .select('template_id, templates(name)')
          .eq('shopify_product_id', productId.toString())
          .is('shopify_variant_id', null)
          .maybeSingle()
          
        if (data) templateMapping = data
      }
      
      if (!templateMapping) {
        console.error(`No template mapping found for product ${productId}, variant ${variantId}`)
        continue
      }
      
      const templateId = templateMapping.template_id
      const templateName = templateMapping.templates?.name || 'Unknown Template'
      
      console.log(`Found template: ${templateName} (ID: ${templateId})`)
      
      // Generate the specified number of license codes based on quantity
      for (let i = 0; i < quantity; i++) {
        // Generate a unique license code
        const { data: licenseCode, error: codeError } = await supabase.rpc('generate_license_code')
        
        if (codeError) {
          console.error('Error generating license code:', codeError)
          continue
        }
        
        // Create the license in the database
        const licenseData = {
          license_code: licenseCode,
          template_id: templateId,
          shopify_order_id: orderId.toString(),
          used: false
        }
        
        const { data: newLicense, error: insertError } = await supabase
          .from('licenses')
          .insert(licenseData)
          .select('*')
          .single()
        
        if (insertError) {
          console.error('Error creating license:', insertError)
          continue
        }
        
        createdLicenses.push({
          license_code: licenseCode,
          template_id: templateId,
          template_name: templateName,
          ...newLicense
        })
        
        console.log(`Created license: ${licenseCode} for template ${templateName}`)
      }
    }
    
    // TODO: Here you could send an email to the customer with their license codes
    if (createdLicenses.length > 0 && customerEmail) {
      console.log(`Would send email to ${customerEmail} with ${createdLicenses.length} license codes`)
      
      // Implement email sending logic here
      // Example: sendLicenseEmail(customerEmail, createdLicenses, orderName)
    }
    
    return NextResponse.json({ 
      success: true,
      message: `Created ${createdLicenses.length} licenses for order ${orderName}`,
      licenses: createdLicenses
    })
  } catch (error) {
    console.error('Error processing Shopify webhook:', error)
    return NextResponse.json({ 
      error: 'Internal server error processing the webhook',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}