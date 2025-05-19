'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Version {
  id: number
  title: string
  created_at: string
  data: any
  section_id: number
}

interface VersionHistoryProps {
  sectionId: number
  currentVersionId: number | null
  onVersionSelect: (version: Version) => void
  onVersionCreate: () => void
  onVersionDelete: (versionId: number) => void
}

export default function VersionHistory({
  sectionId,
  currentVersionId,
  onVersionSelect,
  onVersionCreate,
  onVersionDelete
}: VersionHistoryProps) {
  const supabase = createClient()
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null)

  // Fetch versions for this section
  useEffect(() => {
    const fetchVersions = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('section_versions')
        .select('*')
        .eq('section_id', sectionId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading versions:', error)
      } else {
        setVersions(data || [])
      }
      setLoading(false)
    }

    if (sectionId && showHistory) {
      fetchVersions()
    }
  }, [sectionId, supabase, showHistory])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // Toggle version details
  const toggleVersionDetails = (versionId: number) => {
    setExpandedVersion(expandedVersion === versionId ? null : versionId)
  }

  // Create snapshot button component
  const CreateSnapshotButton = () => (
    <button
      onClick={onVersionCreate}
      className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition flex items-center justify-center gap-1.5 shadow-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Snapshot erstellen
    </button>
  )

  if (!showHistory) {
    return (
      <div className="flex flex-col">
        <button
          onClick={() => setShowHistory(true)}
          className="flex items-center justify-between text-sm font-medium text-gray-700 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-50"
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Versionsgeschichte anzeigen
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <CreateSnapshotButton />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="font-medium text-gray-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Versionsgeschichte
        </h3>
        <button
          onClick={() => setShowHistory(false)}
          className="text-gray-400 hover:text-gray-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-3">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center p-4 text-gray-500 text-sm">
            <p>Keine Versionen gefunden.</p>
            <p className="mt-1">Erstelle einen Snapshot, um deine Änderungen zu speichern.</p>
          </div>
        ) : (
          <ul className="divide-y">
            {versions.map((version) => (
              <li key={version.id} className="py-2">
                <div className={`flex justify-between items-start rounded-lg p-2 ${currentVersionId === version.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${currentVersionId === version.id ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
                      <h4 className="font-medium text-sm">{version.title || `Snapshot #${version.id}`}</h4>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 ml-4">
                      {formatDate(version.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleVersionDetails(version.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 transition rounded"
                      title="Details anzeigen"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {expandedVersion === version.id ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        )}
                      </svg>
                    </button>
                    <button
                      onClick={() => onVersionSelect(version)}
                      className={`p-1.5 text-gray-400 hover:text-blue-600 transition rounded ${currentVersionId === version.id ? 'text-blue-600' : ''}`}
                      title="Diese Version laden"
                      disabled={currentVersionId === version.id}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onVersionDelete(version.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition rounded"
                      title="Version löschen"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {expandedVersion === version.id && (
                  <div className="mt-2 ml-4 p-3 bg-gray-50 rounded-lg text-xs">
                    <div className="mb-2">
                      <span className="font-medium">Änderungen:</span>
                      <ul className="mt-1 ml-4 list-disc">
                        {Object.entries(JSON.parse(version.data || '{}')).map(([key, value]) => (
                          <li key={key}>{key}: {String(value)}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-gray-500 italic">
                      Version-ID: {version.id}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <CreateSnapshotButton />
      </div>
    </div>
  )
}