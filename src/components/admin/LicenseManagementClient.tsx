'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'

interface Template {
  id: string
  name: string
}

interface License {
  id: string
  license_code: string
  created_at: string
  used: boolean
  shopify_order_id: string | null
  templates: {
    id: string
    name: string
  }
  user_id: string | null
  activation_date: string | null
}

interface LicenseManagementClientProps {
  user: User
  templates: Template[]
  recentLicenses: License[]
}

export default function LicenseManagementClient({
  user,
  templates,
  recentLicenses: initialLicenses
}: LicenseManagementClientProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [customPrefix, setCustomPrefix] = useState<string>('')
  const [shopifyOrderId, setShopifyOrderId] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [generatedLicenses, setGeneratedLicenses] = useState<any[]>([])
  const [recentLicenses, setRecentLicenses] = useState<License[]>(initialLicenses)
  const [activeTab, setActiveTab] = useState<'create' | 'recent'>('create')
  
  const handleGenerateLicenses = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedTemplate) {
      setError('Bitte wähle ein Template aus')
      return
    }
    
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setGeneratedLicenses([])
    
    try {
      const response = await fetch('/api/licenses/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          quantity,
          customPrefix: customPrefix.trim(),
          shopifyOrderId: shopifyOrderId.trim() || null,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccess(data.message)
        setGeneratedLicenses(data.licenses)
        
        // Update the recent licenses list
        if (data.licenses && data.licenses.length) {
          setRecentLicenses(prev => [
            ...data.licenses.map((license: any) => ({
              ...license,
              templates: {
                id: license.template_id,
                name: license.template_name
              }
            })),
            ...prev
          ].slice(0, 100))
        }
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error('Error generating licenses:', err)
      setError('Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Flash a small success indicator
        const el = document.getElementById(`license-${text}`)
        if (el) {
          el.classList.add('bg-green-50')
          setTimeout(() => {
            el.classList.remove('bg-green-50')
          }, 300)
        }
      })
      .catch(err => {
        console.error('Failed to copy text: ', err)
      })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return (
    <div>
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'create'
              ? 'border-b-2 border-[#1c2838] text-[#1c2838]'
              : 'text-gray-500'
          }`}
        >
          Lizenzen erstellen
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'recent'
              ? 'border-b-2 border-[#1c2838] text-[#1c2838]'
              : 'text-gray-500'
          }`}
        >
          Letzte Lizenzen
        </button>
      </div>
      
      {activeTab === 'create' ? (
        <div>
          <div className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Neue Lizenzen generieren</h2>
            
            <form onSubmit={handleGenerateLicenses}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Template</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  required
                >
                  <option value="">-- Template auswählen --</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Anzahl</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Benutzerdefinierter Präfix (optional)
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={customPrefix}
                  onChange={(e) => setCustomPrefix(e.target.value)}
                  placeholder="z.B. LIC-2025"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Der Präfix wird dem generierten Code vorangestellt (Format: PREFIX-XXX-XXXX-XXXX)
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Shopify-Bestellnummer (optional)
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={shopifyOrderId}
                  onChange={(e) => setShopifyOrderId(e.target.value)}
                  placeholder="z.B. order_12345678"
                />
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg text-green-600 text-sm">
                  {success}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#1c2838] text-white rounded-lg hover:opacity-90 transition flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : null}
                Lizenzen generieren
              </button>
            </form>
            
            {generatedLicenses.length > 0 && (
              <div className="mt-8">
                <h3 className="font-bold mb-3">Generierte Lizenzen:</h3>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                  {generatedLicenses.map((license) => (
                    <div
                      key={license.id}
                      id={`license-${license.license_code}`}
                      className="flex justify-between items-center p-2 border-b border-gray-200 last:border-0 hover:bg-gray-100 transition cursor-pointer group"
                      onClick={() => copyToClipboard(license.license_code)}
                    >
                      <div className="font-mono text-sm">{license.license_code}</div>
                      <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100">
                        Klicken zum Kopieren
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Letzte Lizenzen</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Erstellt am
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bestellung
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktiviert am
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentLicenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                      Keine Lizenzen gefunden
                    </td>
                  </tr>
                ) : (
                  recentLicenses.map((license) => (
                    <tr key={license.id} className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => copyToClipboard(license.license_code)}>
                      <td className="px-4 py-3 font-mono text-sm">
                        {license.license_code}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {license.templates?.name || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(license.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {license.used ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Aktiviert
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Nicht aktiviert
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {license.shopify_order_id || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {license.activation_date ? formatDate(license.activation_date) : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}