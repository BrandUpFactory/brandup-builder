'use client'

import { useState } from 'react'

interface ExportImportPanelProps {
  data: object
  onImport: (data: any) => void
  title?: string
}

export default function ExportImportPanel({ 
  data, 
  onImport, 
  title = 'Section Konfiguration'
}: ExportImportPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [importData, setImportData] = useState('')
  const [importError, setImportError] = useState('')
  const [copied, setCopied] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)

  // Format data for export
  const exportData = JSON.stringify(data, null, 2)
  
  // Handle export copy to clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportData)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  // Handle export download
  const handleDownload = () => {
    const blob = new Blob([exportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-export.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  // Handle import from text
  const handleImport = () => {
    setImportError('')
    setImportSuccess(false)
    
    try {
      const parsedData = JSON.parse(importData)
      onImport(parsedData)
      setImportSuccess(true)
      setImportData('')
      setTimeout(() => setImportSuccess(false), 2000)
    } catch (error) {
      setImportError('Ungültiges JSON-Format. Bitte überprüfe deine Eingabe.')
    }
  }
  
  // Handle import from file
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('')
    setImportSuccess(false)
    
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsedData = JSON.parse(content)
        onImport(parsedData)
        setImportSuccess(true)
        setTimeout(() => setImportSuccess(false), 2000)
      } catch (error) {
        setImportError('Die Datei enthält kein gültiges JSON-Format.')
      }
    }
    reader.readAsText(file)
    
    // Reset file input
    event.target.value = ''
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between text-sm font-medium text-gray-700 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-50 w-full"
      >
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Import / Export
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    )
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="font-medium text-gray-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Import / Export
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4">
        {/* Export Section */}
        <div className="mb-6">
          <h4 className="font-medium text-sm mb-2">Export {title}</h4>
          <div className="border rounded-md overflow-hidden bg-gray-50">
            <div className="p-2 max-h-40 overflow-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">{exportData}</pre>
            </div>
            <div className="p-2 border-t bg-white flex justify-between">
              <button
                onClick={handleCopyToClipboard}
                className="text-xs text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Kopiert!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    In Zwischenablage kopieren
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="text-xs text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Als Datei speichern
              </button>
            </div>
          </div>
        </div>

        {/* Import Section */}
        <div>
          <h4 className="font-medium text-sm mb-2">Import {title}</h4>
          
          {/* File Import */}
          <div className="mb-4">
            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-1 text-xs text-gray-500"><span className="font-semibold">Datei hochladen</span> oder hier ablegen</p>
                <p className="text-xs text-gray-500">.json Datei</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".json,application/json"
                onChange={handleFileImport}
              />
            </label>
          </div>
          
          {/* Text Import */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Oder JSON einfügen:</label>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="w-full border rounded-md text-xs p-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='{ "title": "Meine Konfiguration", ... }'
            />
            {importError && (
              <p className="text-xs text-red-600 mt-1">{importError}</p>
            )}
            {importSuccess && (
              <p className="text-xs text-green-600 mt-1">Import erfolgreich!</p>
            )}
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleImport}
                disabled={!importData.trim()}
                className={`px-3 py-1.5 rounded text-xs font-medium ${
                  importData.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                } transition`}
              >
                Importieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}