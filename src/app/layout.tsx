'use client'

import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const isHomepage = pathname === '/'

  useEffect(() => {
    // Prüfen der Bildschirmgröße und Setzen des Mobile-Status
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024)
    
    // Initial Check
    checkIfMobile()
    
    // Listener für Größenänderungen
    window.addEventListener('resize', checkIfMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  return (
    <html lang="en" className="w-full min-h-full bg-white">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="flex flex-col w-full min-h-full bg-white overflow-x-hidden">
        {/* Navbar für mobile und desktop */}
        <Navbar />

        {/* Main Content - mit bedingter Klasse für Abstand */}
        <main className={`flex-1 ${isMobile ? 'mt-16' : 'ml-64'} ${isHomepage ? 'p-0' : 'p-4 md:p-8'}`}>
          {children}
          <Analytics />        {/* ✅ Analytics von Vercel */}
          <SpeedInsights />    {/* ✅ Speed Insights von Vercel */}
        </main>
        
        {/* Footer für alle Seiten */}
        <div className={`${isMobile ? 'mt-16' : 'ml-64'}`}>
          <Footer />
        </div>
      </body>
    </html>
  )
}
