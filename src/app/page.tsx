'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

interface Template {
  id: string
  name: string
  image_url: string
  buy_url: string | null
  active: boolean
  description?: string
}

export default function Home() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const sliderRef = useRef<HTMLDivElement>(null)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const transitionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (!error) setUser(data.user ?? null)
    }
    fetchUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase.from('templates').select('*').eq('active', true)
      if (!error) setTemplates(data || [])
    }
    fetchTemplates()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications])

  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return
    const scrollAmount = sliderRef.current.offsetWidth * 0.75
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const highlightTemplate = templates.slice(0, 3)[highlightIndex]
  const conversionSet = [
    [
      { title: 'Optimierte Struktur', desc: 'Steigere deine Conversions mit strukturierten Abschnitten', icon: '\icons8-graph-96.png' },
      { title: 'Höhere Scrolltiefe', desc: 'Halte Nutzer durch visuelle Abschnitte länger auf der Seite', icon: '\icons8-graph-96.png' },
      { title: 'Exportbereit', desc: 'Direkt einsatzfähige Vorlagen mit einem Klick', icon: '\icons8-graph-96.png' },
      { title: 'Starkes Branding', desc: 'Vertrauen schaffen mit klaren Markenelementen', icon: '\icons8-graph-96.png' }
    ],
    [
      { title: 'Schnellere Ladezeiten', desc: 'Optimierte Assets für blitzschnelles Rendering', icon: '\icons8-graph-96.png' },
      { title: 'Intuitive Navigation', desc: 'Klar strukturierte Abschnitte steigern die Usability', icon: '\icons8-graph-96.png' },
      { title: 'Direkte CTA-Platzierung', desc: 'Mehr Conversions durch smarte Call-to-Actions', icon: '\icons8-graph-96.png' },
      { title: 'Responsive Layouts', desc: 'Passt sich perfekt an alle Geräte an', icon: '\icons8-graph-96.png' }
    ],
    [
      { title: 'Weniger Absprünge', desc: 'Binde deine Besucher mit relevanten Inhalten', icon: '\icons8-graph-96.png' },
      { title: 'Automatisierter Export', desc: 'Spare Zeit mit direkter Shopify-Anbindung', icon: '\icons8-graph-96.png' },
      { title: 'Klares Design', desc: 'Modernes UI für ein starkes Nutzererlebnis', icon: '\icons8-graph-96.png' },
      { title: 'Vertrauenssymbole', desc: 'Nutze Trust-Elements gezielt zur Steigerung', icon: '\icons8-graph-96.png' }
    ]
  ]
  const conversionStats = conversionSet[highlightIndex % conversionSet.length]

  useEffect(() => {
    const interval = setInterval(() => {
      if (transitionRef.current) {
        transitionRef.current.classList.add('fade-out')
        setTimeout(() => {
          setHighlightIndex((prev) => (prev + 1) % Math.min(templates.length, 3))
          if (transitionRef.current) {
            transitionRef.current.classList.remove('fade-out')
          }
        }, 300)
      }
    }, 6000)
    return () => clearInterval(interval)
  }, [templates.length])

  return (
    <div className="px-2 md:px-4 xl:px-10 2xl:px-14 py-8 bg-white min-h-screen relative">
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowNotifications(!showNotifications)} className="relative bg-gray-100 hover:bg-gray-200 transition p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1c2838]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405M18 14.158V11a6.002 6.002 0 00-5-5.917V4a1 1 0 00-2 0v1.083A6.002 6.002 0 006 11v3.159L4 17h5m6 0v1a3 3 0 11-6 0v-1h6z" />
          </svg>
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
        </button>
        {showNotifications && (
          <div ref={notificationRef} className="absolute top-14 right-6 w-64 bg-white border shadow-xl rounded-xl z-50">
            <div className="p-4 text-sm font-medium text-black border-b">Notifications</div>
            <div className="p-4 text-sm text-black">Es gibt aktuell keine Neuigkeiten.</div>
          </div>
        )}
      </div>

      <h1 className="text-2xl md:text-3xl font-extrabold text-[#1c2838] mb-2">
        Welcome to <span className="text-[#8db5d8]">BrandUp Builder</span> 🚀
      </h1>
      <p className="text-gray-600 text-sm md:text-base mb-6 max-w-2xl">
        Effortlessly build & customize Shopify sections. Design visually, export instantly, sell confidently.
      </p>

      <div className="flex justify-end gap-4 mb-10 flex-wrap">
        <a href="/mysections" className="inline-flex items-center gap-2 bg-[#1c2838] hover:opacity-90 text-white font-medium py-2 px-6 rounded-lg transition">
          Start Building →
        </a>
        <a href="/templates" className="inline-flex items-center gap-2 bg-[#1c2838] hover:opacity-90 text-white font-medium py-2 px-6 rounded-lg transition">
          Explore Templates
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-10">
        {!user && highlightTemplate ? (
          <div ref={transitionRef} className="p-6 border rounded-xl shadow-sm bg-white md:col-span-2 flex flex-col lg:flex-row gap-6 fade-transition h-[500px]">
            <div className="w-full lg:w-[45%] flex items-center justify-center">
              <img src={highlightTemplate.image_url} alt={highlightTemplate.name} className="max-h-[90%] w-full object-contain rounded-xl" />
            </div>
            <div className="w-full lg:w-[55%] flex flex-col justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#1c2838] mb-1 mt-6">{highlightTemplate.name}</h2>
                {highlightTemplate.description && (
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{highlightTemplate.description}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {conversionStats.map((stat, i) => (
                  <div key={i} className="bg-[#f4f4f4] p-5 rounded-lg shadow-inner flex items-start gap-3">
                    <img src={stat.icon} alt={stat.title} className="w-6 h-6 mt-1" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#1c2838]">{stat.title}</span>
                      <span className="text-xs text-gray-500 leading-snug">{stat.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Link href={highlightTemplate.buy_url || '#'}>
                  <button className="mt-2 bg-[#1c2838] text-white px-6 py-2 rounded-full hover:opacity-90 transition text-sm">
                    Jetzt kaufen →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 border rounded-xl shadow-sm bg-white md:col-span-2 flex flex-col justify-between">
            <h3 className="text-xl font-semibold text-[#1c2838] mb-4">Zuletzt erstellt</h3>
            <Link href="/login">
              <button className="bg-black text-white px-6 py-2 rounded-full text-sm hover:opacity-90 transition">
                Jetzt anmelden
              </button>
            </Link>
          </div>
        )}

        <div className="p-6 border rounded-xl shadow-sm bg-white h-[500px] relative overflow-hidden w-full flex flex-col">
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-[#1c2838]">Version 6.7.1</span>
          </div>
          <h3 className="text-lg font-semibold text-[#1c2838] mb-4">Updates & News</h3>
          <div className="overflow-hidden h-[420px] relative">
            <div className="scroll-track animate-marquee space-y-3 pr-2">
              {Array(2).fill([
                '✨ Dark mode now available for exports',
                '🛠 Improved template rendering speed',
                '🧱 New: Premium section pack "Spark"',
                '📦 Export history dashboard added',
                '💡 Metafield editor integration beta',
                '🧭 New onboarding experience launched',
              ]).flat().map((text, index) => (
                <div key={`${text}-${index}`} className="bg-[#f4f4f4] text-[#1c2838] text-sm px-4 py-3 rounded-md shadow">
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border rounded-xl shadow-sm bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#1c2838]">Beliebteste Templates</h3>
          <div className="flex gap-2">
            <button onClick={() => scrollSlider('left')} className="px-3 py-2 border rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={() => scrollSlider('right')} className="px-3 py-2 border rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div ref={sliderRef} className="overflow-x-auto whitespace-nowrap flex gap-6 pb-2 scroll-smooth">
          {templates.map((template) => (
            <div key={template.id} className="inline-block w-72 aspect-square shrink-0 border rounded-xl overflow-hidden bg-white shadow-sm relative">
              <img src={template.image_url} alt={template.name} className="w-full h-full object-contain" />
              {template.buy_url && (
                <Link href={template.buy_url} target="_blank">
                  <button className="absolute bottom-2 left-2 right-2 bg-[#000] text-white text-sm py-2 rounded-xl shadow-md hover:opacity-90 transition">
                    Kaufen
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        .scroll-track { display: flex; flex-direction: column; }
        .animate-marquee { animation: marquee 25s linear infinite; }
        .fade-transition { transition: opacity 0.3s ease-in-out; }
        .fade-out { opacity: 0; }
      `}</style>
    </div>
  )
}