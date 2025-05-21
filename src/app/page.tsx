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
      color: "#1c2838"
    },
    {
      title: "Shopify Export",
      description: "Exportiere deine Designs direkt in deinen Shopify-Store mit nur einem Klick.",
      icon: "/file.svg",
      color: "#1c2838"
    },
    {
      title: "Globale Markenidentität",
      description: "Erstelle ein konsistentes Markenerlebnis über alle Sektionen deines Shops hinweg.",
      icon: "/globe.svg", 
      color: "#1c2838"
    }
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section - Full Width */}
      <div ref={heroRef} className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Modern Abstract Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[#1c2838]/5"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#8dbbda]/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#1c2838]/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-[#8dbbda]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 xl:py-28 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
              <div className="flex items-center mb-6">
                <span className="bg-[#8dbbda]/20 text-[#1c2838] px-3 py-1 rounded-full text-xs font-semibold tracking-wider">NEU</span>
                <span className="ml-2 text-sm text-gray-600">Version 2.0 jetzt verfügbar</span>
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-[#1c2838] leading-tight">
                BrandUp <span className="text-[#8dbbda]">Builder</span>
                <span className="inline-block ml-2 bg-[#1c2838] text-white text-xs px-2 py-1 rounded-md align-top mt-4">Beta</span>
              </h1>
              <p className="mt-5 text-lg md:text-xl text-gray-700 leading-relaxed">
                Der intuitive visuelle Editor für <span className="text-[#8dbbda] font-medium">Shopify-Sektionen</span>. 
                Erstelle professionelle Layouts für deinen Online-Shop ohne Programmierkenntnisse.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={user ? "/mysections" : "/login"} 
                  className="inline-flex items-center px-8 py-4 rounded-lg bg-[#1c2838] text-white font-medium transition hover:shadow-lg hover:translate-y-[-2px] shadow-md">
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
              <div className="mt-8 flex items-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8dbbda] mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Shopify × BrandUp Factory GmbH</span>
              </div>
            </div>
            
            {/* Smartphone Display Group */}
            <div className="w-full max-w-md md:max-w-sm relative mt-10 md:mt-0">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#8dbbda]/20 to-[#8dbbda]/10 blur-3xl rounded-full transform -translate-y-1/2 translate-x-1/4 opacity-30"></div>
              
              {/* Main Phone (Homepage) */}
              <div className="relative perspective-1000 transform-gpu z-10">
                <div className="relative rounded-[40px] shadow-2xl bg-[#1c2838] border-8 border-[#1c2838] transform hover:rotate-y-3 hover:rotate-z-2 transition-transform duration-500 mx-auto w-[260px] xl:w-[280px]">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-[#1c2838] z-20 rounded-t-[32px] flex justify-center items-center">
                    <div className="w-32 h-5 bg-[#1c2838] rounded-b-xl flex justify-center items-center">
                      <div className="w-16 h-3 bg-black/20 rounded-full backdrop-blur-sm"></div>
                    </div>
                  </div>
                  
                  {/* Phone Screen Content */}
                  <div className="relative overflow-hidden rounded-[32px] aspect-[9/19.5] bg-white">
                    {/* Mobile Shop Interface */}
                    <div className="w-full h-full flex flex-col">
                      {/* Mobile Header */}
                      <div className="h-14 bg-[#1c2838] px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-md bg-[#8dbbda] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                            </svg>
                          </div>
                          <span className="ml-2 text-white text-sm font-bold">Shop</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile Content */}
                      <div className="flex-1 overflow-hidden relative">
                        {/* Hero Section */}
                        <img 
                          src="/BG_Card_55.jpg" 
                          alt="Shop Mobile Preview" 
                          className="w-full h-48 object-cover" 
                        />
                        
                        {/* Overlay Text */}
                        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/40 to-black/0 p-4 flex flex-col justify-center">
                          <h3 className="text-white text-lg font-bold mb-1">Summer Sale</h3>
                          <p className="text-white text-xs">Bis zu 50% Rabatt auf ausgewählte Artikel</p>
                          <button className="mt-2 bg-white text-[#1c2838] text-xs py-1 px-3 rounded-md shadow-lg w-24">
                            Entdecken
                          </button>
                        </div>
                        
                        {/* Products Grid */}
                        <div className="p-3">
                          <h3 className="text-xs font-medium text-gray-700 mb-2">Neue Produkte</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {/* Product 1 */}
                            <div className="bg-gray-50 rounded-lg overflow-hidden animate-pulse-slow">
                              <div className="aspect-square bg-gray-200"></div>
                              <div className="p-2">
                                <div className="h-2 bg-gray-300 rounded-full w-3/4 mb-1"></div>
                                <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                              </div>
                            </div>
                            
                            {/* Product 2 */}
                            <div className="bg-gray-50 rounded-lg overflow-hidden animate-pulse-slow delay-100">
                              <div className="aspect-square bg-gray-200"></div>
                              <div className="p-2">
                                <div className="h-2 bg-gray-300 rounded-full w-2/3 mb-1"></div>
                                <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Builder Preview Hint */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1c2838] to-transparent p-4 flex flex-col items-center">
                          <div className="text-xs text-white font-medium mb-1">Erstellt mit BrandUp Builder</div>
                          <div className="flex space-x-1">
                            <div className="h-1 w-2 bg-white/50 rounded-full"></div>
                            <div className="h-1 w-2 bg-[#8dbbda] rounded-full"></div>
                            <div className="h-1 w-2 bg-white/50 rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Animated Scroll Indicator */}
                        <div className="absolute top-48 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center opacity-80 animate-bounce">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#1c2838]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Mobile Navigation Bar */}
                      <div className="h-14 bg-white border-t border-gray-200 flex justify-around items-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1c2838]" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                          <span className="text-[7px] mt-0.5 text-[#1c2838]">Home</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[7px] mt-0.5 text-gray-400">Inbox</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[7px] mt-0.5 text-gray-400">Filter</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[7px] mt-0.5 text-gray-400">Profile</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Phone Shadow */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-[70%] h-8 bg-black/10 blur-md rounded-full"></div>
              </div>
              
              {/* Second Phone (Product Page) - Positioned behind and to the right */}
              <div className="absolute top-6 -right-4 perspective-1000 transform-gpu z-0 scale-90 rotate-6">
                <div className="relative rounded-[40px] shadow-xl bg-[#1c2838] border-8 border-[#1c2838] transform rotate-y-12 mx-auto w-[220px] xl:w-[240px]">
                  {/* Phone Screen Content */}
                  <div className="relative overflow-hidden rounded-[32px] aspect-[9/19.5] bg-white">
                    {/* Product Page Interface */}
                    <div className="w-full h-full flex flex-col">
                      {/* Mobile Header */}
                      <div className="h-14 bg-[#1c2838] px-4 py-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white text-sm font-medium">Produktdetails</span>
                      </div>
                      
                      {/* Product Content */}
                      <div className="flex-1 overflow-hidden relative">
                        {/* Product Images Slider */}
                        <div className="w-full h-72 bg-gray-100 flex items-center justify-center">
                          <img 
                            src="/BG_Card_55.jpg" 
                            alt="Product image" 
                            className="h-full w-full object-cover" 
                          />
                          {/* Dots indicator */}
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            <div className="w-2 h-2 rounded-full bg-white/40"></div>
                            <div className="w-2 h-2 rounded-full bg-white/40"></div>
                          </div>
                        </div>
                        
                        {/* Product Info */}
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h2 className="text-base font-bold text-[#1c2838]">Premium T-Shirt</h2>
                            <div className="text-sm font-bold text-[#8dbbda]">€39,90</div>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">100% Organic Cotton</div>
                          
                          {/* Rating */}
                          <div className="mt-2 flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-500 ml-1">4.0 (128)</span>
                          </div>
                          
                          {/* Size Selection */}
                          <div className="mt-4">
                            <div className="text-xs font-medium text-gray-700 mb-2">Größe</div>
                            <div className="flex space-x-2">
                              {['S', 'M', 'L', 'XL'].map((size, i) => (
                                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${i === 1 ? 'bg-[#1c2838] text-white ring-2 ring-[#1c2838]' : 'bg-gray-100 text-gray-700'}`}>
                                  {size}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Add to cart button */}
                          <div className="mt-4">
                            <button className="w-full py-2 bg-[#1c2838] text-white text-sm font-medium rounded-lg">
                              In den Warenkorb
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-10 w-20 h-20 rounded-full bg-[#8dbbda]/10 backdrop-blur-md flex items-center justify-center z-20">
                <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#1c2838]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                  </svg>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-[#1c2838]/10 backdrop-blur-md flex items-center justify-center z-20">
                <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#8dbbda]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Completely Reimagined */}
      <div ref={featuresRef} className="py-24 bg-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 left-1/3 w-72 h-72 bg-[#8dbbda]/5 rounded-full mix-blend-multiply opacity-70 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-50 rounded-full mix-blend-multiply opacity-70 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1 rounded-full bg-[#8dbbda]/10 text-[#1c2838] font-medium text-sm mb-4 tracking-wider">FUNKTIONEN</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1c2838] mb-6">Warum BrandUp Builder?</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-lg">
              Erstelle professionelle Shopify-Sektionen, die deine Markenidentität stärken und deine Konversionsrate verbessern.
            </p>
          </div>

          {/* Interactive Features Showcase */}
          <div className="relative">
            {/* Large Feature Display */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl overflow-hidden mb-16">
              <div className="flex flex-col lg:flex-row">
                {/* Feature Visual */}
                <div className="lg:w-1/2 relative overflow-hidden bg-[#1c2838]/5 min-h-[300px] lg:min-h-[400px]">
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    {activeFeature === 0 && (
                      <div className="animate-fadeIn w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50">
                          <div className="h-8 bg-[#1c2838] flex items-center px-4">
                            <div className="flex space-x-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                            </div>
                            <div className="ml-4 text-xs text-white">Visual Editor</div>
                          </div>
                          <div className="p-4 bg-gray-50">
                            <div className="grid grid-cols-4 gap-2">
                              <div className="col-span-1 bg-white p-2 rounded border border-gray-200 shadow-sm flex flex-col items-center">
                                <div className="w-8 h-8 bg-[#8dbbda]/20 rounded flex items-center justify-center mb-1">
                                  <div className="w-4 h-4 bg-[#8dbbda] rounded-sm"></div>
                                </div>
                                <div className="h-1.5 w-10 bg-gray-200 rounded-full"></div>
                              </div>
                              <div className="col-span-3 bg-white p-2 rounded border border-gray-200 shadow-sm">
                                <div className="h-1.5 w-3/4 bg-gray-200 rounded-full mb-2"></div>
                                <div className="h-1.5 w-1/2 bg-gray-200 rounded-full mb-2"></div>
                                <div className="h-1.5 w-2/3 bg-gray-200 rounded-full"></div>
                              </div>
                            </div>
                            <div className="mt-3 bg-white p-3 rounded border border-gray-200 shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                <div className="h-2 w-24 bg-gray-200 rounded-full"></div>
                                <div className="h-4 w-8 bg-[#8dbbda]/30 rounded"></div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="h-16 bg-gray-100 rounded"></div>
                                <div className="h-16 bg-gray-100 rounded"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeFeature === 1 && (
                      <div className="animate-fadeIn w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50">
                          <div className="h-8 bg-[#1c2838] flex items-center px-4">
                            <div className="flex space-x-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                            </div>
                            <div className="ml-4 text-xs text-white">Shopify Export</div>
                          </div>
                          <div className="p-4 bg-gray-50">
                            <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-200 shadow-sm mb-3">
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-[#8dbbda]/20 rounded flex items-center justify-center mr-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#8dbbda]" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="h-1.5 w-20 bg-gray-200 rounded-full"></div>
                              </div>
                              <div className="h-1.5 w-10 bg-[#8dbbda]/30 rounded-full"></div>
                            </div>
                            
                            <div className="relative p-2 bg-white rounded border border-gray-200 shadow-sm mb-3">
                              <div className="h-1.5 w-1/2 bg-gray-200 rounded-full mb-2"></div>
                              <div className="h-1.5 w-full bg-gray-200 rounded-full mb-2"></div>
                              <div className="h-1.5 w-2/3 bg-gray-200 rounded-full"></div>
                              
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center transform rotate-12">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <div className="h-6 w-20 bg-[#1c2838] rounded text-xs text-white flex items-center justify-center text-[9px]">
                                Exportieren
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeFeature === 2 && (
                      <div className="animate-fadeIn w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50">
                          <div className="h-8 bg-[#1c2838] flex items-center px-4">
                            <div className="flex space-x-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                            </div>
                            <div className="ml-4 text-xs text-white">Brand Manager</div>
                          </div>
                          <div className="p-4 bg-gray-50">
                            <div className="flex items-center mb-3">
                              <div className="w-10 h-10 rounded-full bg-[#8dbbda] flex items-center justify-center text-white font-bold text-xs mr-2">B</div>
                              <div>
                                <div className="h-1.5 w-24 bg-gray-800 rounded-full mb-1"></div>
                                <div className="h-1.5 w-16 bg-gray-300 rounded-full"></div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              <div className="h-5 rounded bg-[#1c2838]"></div>
                              <div className="h-5 rounded bg-[#8dbbda]"></div>
                              <div className="h-5 rounded bg-gray-200"></div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <div className="h-1.5 w-full bg-gray-200 rounded-full mb-1"></div>
                                <div className="h-4 w-full bg-gray-100 rounded mb-1"></div>
                              </div>
                              <div>
                                <div className="h-1.5 w-full bg-gray-200 rounded-full mb-1"></div>
                                <div className="h-4 w-full bg-gray-100 rounded mb-1"></div>
                              </div>
                              <div>
                                <div className="h-1.5 w-full bg-gray-200 rounded-full mb-1"></div>
                                <div className="h-4 w-full bg-gray-100 rounded mb-1"></div>
                              </div>
                              <div>
                                <div className="h-1.5 w-full bg-gray-200 rounded-full mb-1"></div>
                                <div className="h-4 w-full bg-gray-100 rounded mb-1"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Feature Description */}
                <div className="lg:w-1/2 p-8 lg:p-12 flex items-center">
                  <div>
                    <div className="w-14 h-14 mb-6 rounded-full bg-[#1c2838]/5 flex items-center justify-center border border-[#8dbbda]/20 shadow-sm">
                      <img src={features[activeFeature].icon} alt={features[activeFeature].title} className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-[#1c2838] mb-4">{features[activeFeature].title}</h3>
                    <p className="text-gray-600 mb-6 text-lg">{features[activeFeature].description}</p>
                    
                    <div className="h-1 w-16 bg-[#8dbbda] rounded-full mb-6"></div>
                    
                    <div className="flex space-x-2">
                      {features.map((_, index) => (
                        <button 
                          key={index}
                          onClick={() => setActiveFeature(index)}
                          className={`w-3 h-3 rounded-full transition-colors duration-300 ${activeFeature === index ? 'bg-[#8dbbda]' : 'bg-gray-300'}`}
                          aria-label={`Wechsle zu Feature ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-2xl shadow transition-transform hover:translate-y-[-5px] duration-300 border border-gray-100">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#8dbbda]/10 flex items-center justify-center text-[#1c2838] mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#1c2838]">Schnell & Effizient</h4>
                    <p className="text-gray-600 mt-1">Erstelle professionelle Sektionen in wenigen Minuten ohne technisches Know-how.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white rounded-2xl shadow transition-transform hover:translate-y-[-5px] duration-300 border border-gray-100">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#8dbbda]/10 flex items-center justify-center text-[#1c2838] mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#1c2838]">Markenkonform</h4>
                    <p className="text-gray-600 mt-1">Halte deine Brand-Identität konsistent über alle Sektionen deines Shops.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white rounded-2xl shadow transition-transform hover:translate-y-[-5px] duration-300 border border-gray-100">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#8dbbda]/10 flex items-center justify-center text-[#1c2838] mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#1c2838]">Voll Responsiv</h4>
                    <p className="text-gray-600 mt-1">Perfekte Darstellung auf allen Geräten - vom Smartphone bis zum Desktop.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-20 text-center">
            <Link 
              href="/templates" 
              className="inline-flex items-center px-6 py-3 rounded-lg text-[#1c2838] text-lg font-medium border-b-2 border-[#8dbbda] hover:bg-[#8dbbda]/10 transition-colors group"
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
          <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-[#8dbbda]/10 mix-blend-multiply blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-56 h-56 rounded-full bg-gray-100/30 mix-blend-multiply blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gray-100/40 mix-blend-multiply blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-[#8dbbda]/10 text-[#1c2838] font-medium text-sm mb-4 tracking-wider">TEMPLATES</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1c2838] mb-4">Beliebte Designs</h2>
              <p className="mt-3 text-gray-600 text-lg max-w-2xl">
                Wähle aus einer Vielzahl von professionell gestalteten Templates für deinen Shop und passe sie ganz nach deinen Bedürfnissen an.
              </p>
            </div>
            <Link 
              href="/templates"
              className="mt-6 md:mt-0 inline-flex items-center px-6 py-3 rounded-lg bg-[#1c2838] text-white font-medium transition hover:bg-[#1c2838]/90 shadow-md hover:shadow-lg"
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
                <div className="animate-spin w-12 h-12 border-3 border-[#8dbbda] border-t-transparent rounded-full"></div>
                <p className="mt-4 text-gray-600">Lade Templates...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {templates.map((template) => (
                <a 
                  key={template.id} 
                  href={template.buy_url || "/templates"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200/70 transform hover:translate-y-[-5px] group"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img 
                      src={template.image_url ? 
                        (template.image_url.startsWith('\\') ? 
                          '/' + template.image_url.substring(1) : 
                          template.image_url) 
                        : '/BrandUp_Elements_Logo_2000_800.png'}
                      alt={template.name} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/BrandUp_Elements_Logo_2000_800.png';
                      }}
                    />
                    
                    {/* Overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c2838]/80 via-[#1c2838]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                      <div className="text-white text-base font-medium">Details ansehen</div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#1c2838] text-lg">{template.name}</h3>
                    </div>
                    <p className="mt-2 text-gray-600 line-clamp-2">{template.description || "Professionell gestaltetes Template für deinen Shopify-Shop."}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
          
          {/* Categories Tags */}
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            {['Hero Sections', 'Banner', 'Features', 'Testimonials', 'Cards', 'Galleries', 'Call-to-Action'].map((tag) => (
              <span key={tag} className="px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200/70 text-sm text-gray-700 hover:border-[#8dbbda] hover:text-[#1c2838] cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c2838] to-[#263545] z-0 overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#8dbbda]/10 rounded-full mix-blend-overlay opacity-70 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#8dbbda]/10 rounded-full mix-blend-overlay opacity-70 blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#8dbbda]/15 rounded-full mix-blend-overlay opacity-70 blur-3xl"></div>
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1c2838]/80 via-transparent to-[#1c2838]/80 opacity-70"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEgMSAyLjEgMi4yczEgMi4xIDIuMSAyLjFjMS4yIDAgMi4xLTEgMi4xLTIuMXMtMS0yLjEtMi4xLTIuMWMtMS4yIDAtMi4xIDEtMi4xIDIuMXMtMSAyLjEtMi4xIDIuMWMtMS4yIDAtMi4xLTEtMi4xLTIuMXMxLTIuMSAyLjEtMi4xeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjwvZz48L3N2Zz4=')] opacity-5"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 md:p-16 shadow-2xl border border-white/20 overflow-hidden">
            {/* Glassmorphism card with subtle reflections */}
            <div className="relative">
              {/* Light reflections */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full opacity-50 blur-lg transform rotate-45"></div>
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#8dbbda]/10 rounded-full opacity-40 blur-lg"></div>
              
              <div className="max-w-3xl mx-auto text-center relative">
                <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-white font-medium text-sm mb-6 tracking-wider">STARTE JETZT</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Revolutioniere deinen Shopify-Shop mit <span className="text-[#8dbbda]">BrandUp Builder</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-10">
                  Erstelle ansprechende Sektionen für deinen Online-Shop und steigere deine Konversionsrate ohne Programmierkenntnisse.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <Link 
                    href={user ? "/mysections" : "/login"}
                    className="px-8 py-4 rounded-xl bg-[#8dbbda] text-[#1c2838] font-medium hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 transform shadow-md"
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
                
                {/* Trust badges with improved styling */}
                <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="flex flex-col items-center group">
                    <div className="text-lg font-medium text-white mb-1 group-hover:text-[#8dbbda] transition-colors">Schnelle Integration</div>
                    <div className="text-sm text-[#8dbbda]/80 group-hover:text-[#8dbbda] transition-colors">in wenigen Minuten</div>
                  </div>
                  <div className="flex flex-col items-center group">
                    <div className="text-lg font-medium text-white mb-1 group-hover:text-[#8dbbda] transition-colors">Responsive Design</div>
                    <div className="text-sm text-[#8dbbda]/80 group-hover:text-[#8dbbda] transition-colors">für alle Geräte</div>
                  </div>
                  <div className="flex flex-col items-center group">
                    <div className="text-lg font-medium text-white mb-1 group-hover:text-[#8dbbda] transition-colors">Keine Programmierung</div>
                    <div className="text-sm text-[#8dbbda]/80 group-hover:text-[#8dbbda] transition-colors">visueller Editor</div>
                  </div>
                  <div className="flex flex-col items-center group">
                    <div className="text-lg font-medium text-white mb-1 group-hover:text-[#8dbbda] transition-colors">Support inklusive</div>
                    <div className="text-sm text-[#8dbbda]/80 group-hover:text-[#8dbbda] transition-colors">bei allen Fragen</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                © {new Date().getFullYear()} BrandUp Factory GmbH. Alle Rechte vorbehalten.
              </p>
            </div>
            
            {/* Links columns */}
            <div>
              <h3 className="text-sm font-bold text-[#1c2838] uppercase tracking-wider mb-4">Produkte</h3>
              <ul className="space-y-3">
                <li><Link href="/templates" className="text-gray-600 hover:text-[#8dbbda] transition-colors">Templates</Link></li>
                <li><Link href="/license" className="text-gray-600 hover:text-[#8dbbda] transition-colors">Lizenz</Link></li>
                <li><Link href="/pricing" className="text-gray-600 hover:text-[#8dbbda] transition-colors">Preise</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-[#1c2838] uppercase tracking-wider mb-4">Unternehmen</h3>
              <ul className="space-y-3">
                <li><a href="https://brandupelements.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#8dbbda] transition-colors">Über uns</a></li>
                <li><a href="https://brandupelements.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#8dbbda] transition-colors">Kontakt</a></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-[#8dbbda] transition-colors">Datenschutz</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center items-center">
            <div className="text-sm text-gray-500">
              Shopify × BrandUp Factory GmbH
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}