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
        {/* Modern Abstract Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[#1c2838]/5"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-tr from-teal-100 to-teal-200 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-40 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-20 md:py-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
              <div className="flex items-center mb-6">
                <span className="bg-[#1c2838]/10 text-[#1c2838] px-3 py-1 rounded-full text-xs font-semibold">NEU</span>
                <span className="ml-2 text-sm text-gray-600">Version 2.0 jetzt verfügbar</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-[#1c2838] leading-tight">
                BrandUp <span className="text-[#4a90e2]">Builder</span>
                <span className="inline-block ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-2 py-1 rounded-md align-top mt-4">Beta</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-700 leading-relaxed">
                Der intuitive visuelle Editor für <span className="text-blue-600 font-medium">Shopify-Sektionen</span>. 
                Erstelle professionelle Layouts für deinen Online-Shop ohne Programmierkenntnisse.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href={user ? "/mysections" : "/login"} 
                  className="inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-[#1c2838] to-[#2c384a] text-white font-medium transition hover:shadow-lg hover:translate-y-[-2px] shadow-md">
                  {user ? "Dashboard öffnen" : "Jetzt starten"} 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="/templates" 
                  className="inline-flex items-center px-8 py-4 rounded-lg bg-white border border-[#1c2838]/20 text-[#1c2838] font-medium transition hover:bg-[#1c2838]/5 shadow-sm">
                  Templates ansehen
                </Link>
              </div>
              <div className="mt-8 flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Keine Programmierkenntnisse erforderlich
              </div>
            </div>
            <div className="w-full max-w-md md:w-2/5 relative mt-10 md:mt-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-3xl rounded-full transform -translate-y-1/2 translate-x-1/4 opacity-30"></div>
              <div className="relative rounded-2xl shadow-2xl overflow-hidden bg-white border border-gray-200 transform hover:scale-[1.02] transition-transform duration-300">
                <div className="h-9 bg-gradient-to-r from-gray-100 to-gray-50 flex items-center px-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden relative shadow-inner">
                    <img 
                      src="/BG_Card_55.jpg" 
                      alt="BrandUp Builder Interface Preview" 
                      className="object-cover w-full h-full" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <div className="text-white text-sm font-medium">Visueller Editor für Shopify-Sektionen</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-70 z-0 blur-md"></div>
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-teal-200 to-green-200 rounded-full opacity-70 z-0 blur-md"></div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="py-24 bg-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 left-1/3 w-72 h-72 bg-blue-50 rounded-full mix-blend-multiply opacity-70 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-50 rounded-full mix-blend-multiply opacity-70 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-4">FUNKTIONEN</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1c2838] mb-6">Warum BrandUp Builder?</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-lg">
              Erstelle professionelle Shopify-Sektionen, die deine Markenidentität stärken und deine Konversionsrate verbessern.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`relative rounded-xl overflow-hidden group ${
                  activeFeature === index ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                
                <div className="relative z-10 p-8">
                  <div className={`w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <img src={feature.icon} alt={feature.title} className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1c2838] mb-4">{feature.title}</h3>
                  <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{feature.description}</p>
                  
                  <div className="mt-6 h-1 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:w-16 transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <Link 
              href="/templates" 
              className="inline-flex items-center px-6 py-3 rounded-lg text-[#1c2838] text-lg font-medium border-b-2 border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              Entdecke alle Funktionen
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Templates Preview */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-blue-100/50 mix-blend-multiply blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-56 h-56 rounded-full bg-purple-100/40 mix-blend-multiply blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-teal-100/50 mix-blend-multiply blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-teal-50 text-teal-600 font-medium text-sm mb-4">TEMPLATES</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1c2838] mb-4">Beliebte Designs</h2>
              <p className="mt-3 text-gray-600 text-lg max-w-2xl">
                Wähle aus einer Vielzahl von professionell gestalteten Templates für deinen Shop und passe sie ganz nach deinen Bedürfnissen an.
              </p>
            </div>
            <Link 
              href="/templates"
              className="mt-6 md:mt-0 inline-flex items-center px-6 py-3 rounded-lg bg-[#1c2838] text-white font-medium transition hover:bg-[#2c384a] shadow-md hover:shadow-lg"
            >
              Alle Templates ansehen
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center">
                <div className="animate-spin w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full"></div>
                <p className="mt-4 text-gray-600">Lade Templates...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {templates.map((template) => (
                <div 
                  key={template.id} 
                  className="group relative rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-600/80 opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                  
                  <div className="h-52 bg-gray-100 relative overflow-hidden">
                    <img 
                      src={template.image_url} 
                      alt={template.name} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                  
                  <div className="p-6 relative z-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#1c2838] text-lg">{template.name}</h3>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Beliebt</span>
                    </div>
                    <p className="mt-2 text-gray-600 line-clamp-2">{template.description || "Professionell gestaltetes Template für deinen Shopify-Shop."}</p>
                    
                    {/* Hover content */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <Link 
                        href={template.buy_url || "/templates"}
                        className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-[#1c2838] text-sm font-medium hover:bg-gray-100 transition shadow-lg"
                      >
                        Template ansehen
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Additional tags below templates */}
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            {['Hero Sections', 'Banner', 'Features', 'Testimonials', 'Cards', 'Galleries', 'Call-to-Action'].map((tag) => (
              <span key={tag} className="px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c2838] to-[#2c3e50] z-0 overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-overlay opacity-70 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-overlay opacity-70 blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full mix-blend-overlay opacity-70 blur-3xl"></div>
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1c2838]/80 via-transparent to-[#1c2838]/80 opacity-70"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 md:p-16 shadow-2xl border border-white/20">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-white font-medium text-sm mb-6">STARTE JETZT</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Revolutioniere deinen Shopify-Shop mit <span className="text-blue-300">BrandUp Builder</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-10">
                Erstelle ansprechende Sektionen für deinen Online-Shop und steigere deine Konversionsrate ohne Programmierkenntnisse.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link 
                  href={user ? "/mysections" : "/login"}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 transform shadow-md"
                >
                  {user ? "Zum Dashboard" : "Kostenlos starten"}
                </Link>
                <Link 
                  href="https://brandupelements.com"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium hover:bg-white/20 transition-colors duration-300 shadow-md"
                >
                  Mehr erfahren
                </Link>
              </div>
              
              {/* Trust badges */}
              <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center">
                  <div className="text-lg font-medium text-white mb-1">Schnelle Integration</div>
                  <div className="text-sm text-blue-200">in wenigen Minuten</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-lg font-medium text-white mb-1">Responsive Design</div>
                  <div className="text-sm text-blue-200">für alle Geräte</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-lg font-medium text-white mb-1">Keine Programmierung</div>
                  <div className="text-sm text-blue-200">visueller Editor</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-lg font-medium text-white mb-1">Support inklusive</div>
                  <div className="text-sm text-blue-200">bei allen Fragen</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Logo and info */}
            <div className="col-span-1 md:col-span-2">
              <img 
                src="/BrandUp_Elements_Logo_2000_800.png" 
                alt="BrandUp Elements Logo" 
                className="h-10 w-auto mb-4" 
              />
              <p className="text-gray-600 max-w-md mb-4">
                Erstelle professionelle Shopify-Sektionen ohne Programmierkenntnisse und steigere deine Konversionsrate.
              </p>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} BrandUp Elements. Alle Rechte vorbehalten.
              </p>
            </div>
            
            {/* Links columns */}
            <div>
              <h3 className="text-sm font-bold text-[#1c2838] uppercase tracking-wider mb-4">Produkte</h3>
              <ul className="space-y-3">
                <li><Link href="/templates" className="text-gray-600 hover:text-blue-600 transition-colors">Templates</Link></li>
                <li><Link href="/license" className="text-gray-600 hover:text-blue-600 transition-colors">Lizenz</Link></li>
                <li><Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Preise</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-[#1c2838] uppercase tracking-wider mb-4">Unternehmen</h3>
              <ul className="space-y-3">
                <li><a href="https://brandupelements.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">Über uns</a></li>
                <li><a href="https://brandupelements.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">Kontakt</a></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">Datenschutz</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-sm text-gray-500">
              Designed and developed in Germany
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}