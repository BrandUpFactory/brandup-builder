'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

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
  const [isLoading, setIsLoading] = useState(true)
  const [activeFeature, setActiveFeature] = useState(0)
  const featuresRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // Auth check
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
  }, [supabase])

  // Load templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('active', true)
        .limit(6)
      
      if (!error) setTemplates(data || [])
      setIsLoading(false)
    }
    fetchTemplates()
  }, [supabase])

  // Handle notification clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications])

  // Rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Features data
  const features = [
    {
      title: "Visueller Editor",
      description: "Erstelle und bearbeite Sektionen mit unserem intuitiven visuellen Editor - keine Programmierkenntnisse erforderlich.",
      icon: "/window.svg",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Shopify Export",
      description: "Exportiere deine Designs direkt in deinen Shopify-Store mit nur einem Klick.",
      icon: "/file.svg",
      color: "from-teal-500 to-emerald-600"
    },
    {
      title: "Globale Markenidentität",
      description: "Erstelle ein konsistentes Markenerlebnis über alle Sektionen deines Shops hinweg.",
      icon: "/globe.svg", 
      color: "from-purple-500 to-pink-600"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div ref={heroRef} className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-gray-500/10 h-full"></div>
            ))}
          </div>
          <div className="grid grid-rows-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-b border-gray-500/10 w-full"></div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-20 md:py-28 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1c2838] leading-tight">
                BrandUp <span className="text-[#8db5d8]">Builder</span>
                <span className="inline-block ml-2 rounded-md bg-blue-600 text-white text-xs px-2 py-1 align-top mt-2">Beta</span>
              </h1>
              <p className="mt-6 text-lg text-gray-700 leading-relaxed">
                Der intuitive visuelle Editor für Shopify-Sektionen. Gestalte ansprechende Layouts für deinen Online-Shop ohne Programmierung und mit professionellen Ergebnissen.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={user ? "/mysections" : "/login"} className="inline-flex items-center px-6 py-3 rounded-full bg-[#1c2838] text-white font-medium transition hover:bg-opacity-90 shadow-sm">
                  {user ? "Dashboard öffnen" : "Jetzt starten"} →
                </Link>
                <Link href="/templates" className="inline-flex items-center px-6 py-3 rounded-full bg-gray-200 text-gray-700 font-medium transition hover:bg-gray-300">
                  Templates ansehen
                </Link>
              </div>
            </div>
            <div className="w-full max-w-md md:w-2/5 relative">
              <div className="relative rounded-2xl shadow-2xl overflow-hidden bg-white border border-gray-200">
                <div className="h-9 bg-gray-100 flex items-center px-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden relative">
                    <img 
                      src="/BG_Card_55.jpg" 
                      alt="BrandUp Builder Interface Preview" 
                      className="object-cover w-full h-full" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                      <div className="text-white text-sm font-medium">Visueller Editor für Shopify-Sektionen</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-100 rounded-full opacity-70 z-0"></div>
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-teal-100 rounded-full opacity-70 z-0"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1c2838]">Warum BrandUp Builder?</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              Erstelle professionelle Shopify-Sektionen, die deine Markenidentität stärken und deine Konversionsrate verbessern.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                  activeFeature === index ? 'ring-2 ring-blue-500/20' : ''
                }`}
              >
                <div className={`w-12 h-12 mb-5 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  <img src={feature.icon} alt={feature.title} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#1c2838] mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Preview */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#1c2838]">Beliebte Templates</h2>
              <p className="mt-3 text-gray-600">
                Wähle aus einer Vielzahl von professionell gestalteten Templates für deinen Shop.
              </p>
            </div>
            <Link 
              href="/templates"
              className="mt-4 md:mt-0 inline-flex items-center px-5 py-2 rounded-lg bg-[#1c2838] text-white text-sm font-medium transition hover:bg-opacity-90"
            >
              Alle Templates ansehen →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template) => (
                <div key={template.id} className="rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    <img 
                      src={template.image_url} 
                      alt={template.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                      <div className="p-4 w-full">
                        <Link 
                          href={template.buy_url || "/templates"}
                          className="w-full inline-flex justify-center items-center px-4 py-2 rounded-full bg-white text-[#1c2838] text-sm font-medium hover:bg-gray-100 transition"
                        >
                          Template ansehen
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-[#1c2838] mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{template.description || "Professionell gestaltetes Template für deinen Shopify-Shop."}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-[#1c2838] to-[#2c384a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Starte noch heute mit BrandUp Builder</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Erstelle ansprechende Sektionen für deinen Shopify-Shop und steigere deine Konversionsrate.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href={user ? "/mysections" : "/login"}
              className="px-6 py-3 rounded-full bg-white text-[#1c2838] font-medium hover:bg-gray-100 transition"
            >
              {user ? "Zum Dashboard" : "Kostenlos testen"}
            </Link>
            <Link 
              href="https://brandupelements.com"
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-transparent border border-white text-white font-medium hover:bg-white/10 transition"
            >
              Mehr erfahren
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img 
                src="/BrandUp_Elements_Logo_2000_800.png" 
                alt="BrandUp Elements Logo" 
                className="h-8 w-auto" 
              />
              <p className="text-sm text-gray-600 mt-2">
                © {new Date().getFullYear()} BrandUp Elements. Alle Rechte vorbehalten.
              </p>
            </div>
            <div className="flex gap-6">
              <Link href="/license" className="text-gray-600 hover:text-gray-900">Lizenz</Link>
              <Link href="/templates" className="text-gray-600 hover:text-gray-900">Templates</Link>
              <a href="https://brandupelements.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">Kontakt</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}