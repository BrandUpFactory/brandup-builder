'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiLock } from 'react-icons/fi'
import { createClient } from '@/utils/supabase/clients'
import { unlockTemplateWithCode } from '@/utils/supabase/unlockTemplate'
import { hasAccessToTemplate } from '@/utils/supabase/checkTemplateAccess'

interface Template {
  id: string
  name: string
  description: string
  image_url: string
  unlock_code: string
  slug: string
}

export default function TemplatesPage() {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [unlockedIds, setUnlockedIds] = useState<string[]>([])
  const [showInput, setShowInput] = useState<{ [key: string]: boolean }>({})
  const [inputCode, setInputCode] = useState<{ [key: string]: string }>({})
  const [notification, setNotification] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUserId(data.user.id)

        // Templates aus Supabase laden
        const { data: fetchedTemplates } = await supabase
          .from('templates')
          .select('*')
          .order('created_at', { ascending: true })

        if (fetchedTemplates) {
          setTemplates(fetchedTemplates)

          // Zugriff prüfen
          fetchedTemplates.forEach(async (template) => {
            const access = await hasAccessToTemplate(data.user!.id, template.id)
            if (access) {
              setUnlockedIds((prev) => [...prev, template.id])
            }
          })
        }
      }
    })
  }, [])

  const handleUnlock = async (templateId: string) => {
    if (!userId) return

    const result = await unlockTemplateWithCode(userId, templateId, inputCode[templateId])
    setNotification(result)

    if (result.success) {
      setUnlockedIds((prev) => [...prev, templateId])
    }

    setTimeout(() => setNotification(null), 3000)
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
        {templates.map((template) => {
          const isUnlocked = unlockedIds.includes(template.id)

          return (
            <div key={template.id} className="border rounded-xl overflow-hidden shadow-sm bg-white flex flex-col">
              <div className="aspect-square w-full relative">
                <img
                  src={template.image_url}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiLock size={32} className="text-black" />
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col gap-2 flex-grow">
                <h2 className="text-sm font-medium text-[#1c2838]">{template.name}</h2>
                <p className="text-xs text-gray-500 mb-2">{template.description}</p>

                {isUnlocked ? (
                  <Link href={`/editor/${template.slug}`}>
                    <button className="bg-[#1c2838] text-white text-xs px-4 py-1.5 rounded-full hover:opacity-90 transition w-full">
                      Bearbeiten
                    </button>
                  </Link>
                ) : (
                  <>
                    {showInput[template.id] ? (
                      <>
                        <input
                          type="text"
                          placeholder="Code eingeben"
                          value={inputCode[template.id] || ''}
                          onChange={(e) => setInputCode({ ...inputCode, [template.id]: e.target.value })}
                          className="border px-3 py-1 text-sm rounded-md text-[#1c2838]"
                        />
                        <button
                          onClick={() => handleUnlock(template.id)}
                          className="bg-[#1c2838] text-white text-xs px-4 py-1.5 rounded-full hover:opacity-90 transition"
                        >
                          Code prüfen
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setShowInput({ ...showInput, [template.id]: true })}
                        className="bg-[#1c2838] text-white text-xs px-4 py-1.5 rounded-full hover:opacity-90 transition"
                      >
                        Freischalten
                      </button>
                    )}
                  </>
                )}

                <Link
                  href={`https://brandupelements.com/products/${template.slug}`}
                  target="_blank"
                  className="bg-[#1c2838] text-white text-xs px-4 py-1.5 rounded-full hover:opacity-90 transition text-center"
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
