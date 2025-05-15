'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiLock } from 'react-icons/fi'
import { createClient } from '@/utils/supabase/client'
import { hasAccessToTemplate, unlockTemplateWithCode } from '@/features/template'

interface Template {
  id: string
  name: string
  description: string
  image_url: string
  edit_url: string
  buy_url: string
  active: boolean
}

export default function TemplatesPage() {
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [unlockedIds, setUnlockedIds] = useState<string[]>([])
  const [inputCode, setInputCode] = useState<{ [key: string]: string }>({})
  const [showInput, setShowInput] = useState<{ [key: string]: boolean }>({})
  const [notification, setNotification] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: null }))
      const user = userData?.user ?? null

      setUserId(user?.id ?? null)

      const { data: templatesData, error } = await supabase
        .from('templates')
        .select('*')
        .eq('active', true)

      if (error) {
        console.error('❌ Fehler beim Laden der Templates:', error)
        return
      }

      setTemplates(templatesData || [])

      if (user?.id && templatesData?.length) {
        const unlocked: string[] = []
        for (const template of templatesData) {
          const access = await hasAccessToTemplate(user.id, template.id)
          if (access) unlocked.push(template.id)
        }
        setUnlockedIds(unlocked)
      }
    }

    init()
  }, [])

  const handleUnlock = async (templateId: string, code: string) => {
    if (!userId) {
      setNotification({ success: false, message: '⚠️ Du bist nicht eingeloggt.' })
      return
    }

    const trimmed = code.trim()
    if (!trimmed) {
      setNotification({ success: false, message: '⚠️ Bitte gib einen Code ein.' })
      return
    }

    const result = await unlockTemplateWithCode(userId, templateId, trimmed)
    setNotification(result)

    if (result.success) {
      setUnlockedIds(prev => [...prev, templateId])
      setShowInput(prev => ({ ...prev, [templateId]: false }))
    }

    setTimeout(() => setNotification(null), 4000)
  }

  return (
    <div className="p-6 md:p-12">
      <h1 className="text-2xl md:text-3xl font-bold text-[#1c2838] mb-6">Alle Templates</h1>

      {notification && (
        <div className={`mb-6 p-3 rounded-md text-sm text-white ${notification.success ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {templates.map(template => {
          const isUnlocked = unlockedIds.includes(template.id)
          return (
            <div key={template.id} className="border rounded-xl overflow-hidden shadow-sm bg-white flex flex-col">
              <div className="aspect-square w-full relative">
                <img src={template.image_url} alt={template.name} className="w-full h-full object-cover" />
                {!isUnlocked && userId && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <FiLock size={32} className="text-black" />
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col gap-2 flex-grow">
                <h2 className="text-sm font-medium text-[#1c2838]">{template.name}</h2>
                <p className="text-xs text-gray-500 mb-2">{template.description}</p>

                {userId && isUnlocked ? (
                  <Link href={template.edit_url || '#'}>
                    <button className="bg-[#1c2838] text-white text-xs px-4 py-1.5 rounded-full w-full">
                      Bearbeiten
                    </button>
                  </Link>
                ) : userId ? (
                  <>
                    {showInput[template.id] ? (
                      <>
                        <input
                          type="text"
                          placeholder="Code eingeben"
                          value={inputCode[template.id] || ''}
                          onChange={e => setInputCode({ ...inputCode, [template.id]: e.target.value })}
                          className="border px-3 py-1 text-sm rounded-md text-[#1c2838]"
                        />
                        <button
                          onClick={() => handleUnlock(template.id, inputCode[template.id])}
                          className="bg-[#1c2838] text-white text-xs px-4 py-1.5 rounded-full mt-1"
                        >
                          Freischalten
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setShowInput({ ...showInput, [template.id]: true })}
                        className="bg-[#1c2838] text-white text-xs px-4 py-1.5 rounded-full"
                      >
                        Freischalten
                      </button>
                    )}
                  </>
                ) : null}

                <Link
                  href={template.buy_url}
                  target="_blank"
                  className="bg-[#1c2838] text-white text-xs px-4 py-1.5 rounded-full text-center"
                >
                  Kaufen
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
