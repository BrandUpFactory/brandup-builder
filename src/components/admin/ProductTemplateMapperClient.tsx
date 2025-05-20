'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'

interface Template {
  id: string
  name: string
}

interface Mapping {
  id: string
  shopify_product_id: string
  shopify_variant_id: string | null
  created_at: string
  templates: {
    id: string
    name: string
  }
}

interface ProductTemplateMapperClientProps {
  user: User
  templates: Template[]
  mappings: Mapping[]
}

export default function ProductTemplateMapperClient({
  user,
  templates,
  mappings: initialMappings
}: ProductTemplateMapperClientProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [productId, setProductId] = useState<string>('')
  const [variantId, setVariantId] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [mappings, setMappings] = useState<Mapping[]>(initialMappings)
  
  const handleCreateMapping = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedTemplate) {
      setError('Bitte wähle ein Template aus')
      return
    }
    
    if (!productId) {
      setError('Bitte gib eine Shopify-Produkt-ID ein')
      return
    }
    
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await fetch('/api/products/mapping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          productId: productId.trim(),
          variantId: variantId.trim() || null,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccess(data.message)
        
        // Update the mappings list with the new mapping
        if (data.mapping) {
          const templateInfo = templates.find(t => t.id === selectedTemplate)
          
          setMappings(prev => [
            {
              ...data.mapping,
              templates: {
                id: selectedTemplate,
                name: templateInfo?.name || 'Unknown Template'
              }
            },
            ...prev
          ])
          
          // Reset form
          setSelectedTemplate('')
          setProductId('')
          setVariantId('')
        }
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error('Error creating product mapping:', err)
      setError('Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDeleteMapping = async (mappingId: string) => {
    if (!confirm('Möchtest du diese Zuordnung wirklich löschen?')) {
      return
    }
    
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await fetch(`/api/products/mapping/${mappingId}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccess(data.message)
        // Remove the deleted mapping from the list
        setMappings(prev => prev.filter(mapping => mapping.id !== mappingId))
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error('Error deleting product mapping:', err)
      setError('Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
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
      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl mb-8">
        <h2 className="text-xl font-bold mb-4">Neue Zuordnung erstellen</h2>
        
        <form onSubmit={handleCreateMapping}>
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
            <label className="block text-sm font-medium mb-1">Shopify-Produkt-ID</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="z.B. 1234567890"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Die Produkt-ID aus deinem Shopify-Shop
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Shopify-Varianten-ID (optional)
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
              placeholder="z.B. 12345678901234"
            />
            <p className="text-xs text-gray-500 mt-1">
              Die Varianten-ID, falls das Produkt mehrere Varianten hat
            </p>
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
            Zuordnung erstellen
          </button>
        </form>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Aktuelle Zuordnungen</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shopify-Produkt-ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shopify-Varianten-ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Template
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Erstellt am
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mappings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                  Keine Zuordnungen gefunden
                </td>
              </tr>
            ) : (
              mappings.map((mapping) => (
                <tr key={mapping.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">
                    {mapping.shopify_product_id}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono">
                    {mapping.shopify_variant_id || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {mapping.templates?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(mapping.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleDeleteMapping(mapping.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={isLoading}
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}