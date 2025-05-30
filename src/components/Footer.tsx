'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and info */}
          <div className="col-span-1 md:col-span-2">
            <Image
              src="/BrandUp_Elements_Logo_2000_800.png" 
              alt="BrandUp Elements Logo" 
              width={160}
              height={64}
              className="mb-4" 
            />
            <p className="text-gray-600 max-w-md mb-4">
              Erstelle professionelle Shopify-Sektionen ohne Programmierkenntnisse und steigere deine Konversionsrate.
            </p>
            <p className="text-sm text-gray-500">
              © {currentYear} BrandUp Factory GmbH. Alle Rechte vorbehalten.
            </p>
          </div>
          
          {/* Links columns */}
          <div>
            <h3 className="text-sm font-bold text-[#1c2838] uppercase tracking-wider mb-4">Produkte</h3>
            <ul className="space-y-3">
              <li><Link href="/templates" className="text-gray-600 hover:text-[#8dbbda] transition-colors">Templates</Link></li>
              <li><Link href="/license" className="text-gray-600 hover:text-[#8dbbda] transition-colors">Lizenz</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-[#1c2838] uppercase tracking-wider mb-4">Unternehmen</h3>
            <ul className="space-y-3">
              <li><a href="https://www.brandupfactory.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#8dbbda] transition-colors">Über uns</a></li>
              <li><a href="/kontakt" className="text-gray-600 hover:text-[#8dbbda] transition-colors">Kontakt</a></li>
              <li><a href="/datenschutz" className="text-gray-600 hover:text-[#8dbbda] transition-colors">Datenschutz</a></li>
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
  )
}