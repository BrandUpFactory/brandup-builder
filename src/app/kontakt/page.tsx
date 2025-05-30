'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1c2838] mb-4">Kontakt</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Wir freuen uns auf deine Nachricht. Unser Team steht dir bei Fragen, Anregungen oder Feedback gerne zur Verfügung.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Kontakt-Informationen */}
        <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1c2838] mb-6">Kontaktinformationen</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#8dbbda]/20 flex items-center justify-center text-[#1c2838]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-[#1c2838]">E-Mail</h3>
                <p className="mt-1 text-gray-600">info@brandupfactory.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#8dbbda]/20 flex items-center justify-center text-[#1c2838]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-[#1c2838]">Telefon</h3>
                <p className="mt-1 text-gray-600">+49 123 456789</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#8dbbda]/20 flex items-center justify-center text-[#1c2838]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-[#1c2838]">Adresse</h3>
                <p className="mt-1 text-gray-600">
                  BrandUp Factory GmbH<br />
                  Musterstraße 123<br />
                  12345 Musterstadt<br />
                  Deutschland
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            <h3 className="text-lg font-medium text-[#1c2838] mb-4">Folge uns</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-[#8dbbda]">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-[#8dbbda]">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-[#8dbbda]">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Kontaktformular */}
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-[#1c2838] mb-6">Schreib uns eine Nachricht</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#8dbbda] focus:border-[#8dbbda] outline-none transition"
                  placeholder="Dein Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#8dbbda] focus:border-[#8dbbda] outline-none transition"
                  placeholder="deine@email.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Betreff</label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#8dbbda] focus:border-[#8dbbda] outline-none transition"
                placeholder="Worum geht es?"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Nachricht</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#8dbbda] focus:border-[#8dbbda] outline-none transition"
                placeholder="Deine Nachricht an uns..."
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-[#1c2838] text-white rounded-lg hover:bg-[#1c2838]/90 transition shadow-sm"
              >
                Nachricht senden
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* FAQ Sektion */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-[#1c2838] mb-8 text-center">Häufig gestellte Fragen</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-[#1c2838] mb-2">Wie kann ich meine Lizenz aktivieren?</h3>
            <p className="text-gray-600">Um deine Lizenz zu aktivieren, melde dich einfach mit deinen Zugangsdaten an und gehe zur Lizenzseite. Dort kannst du deinen Lizenzschlüssel eingeben.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-[#1c2838] mb-2">Wie exportiere ich Sektionen zu Shopify?</h3>
            <p className="text-gray-600">Nach dem Erstellen deiner Sektion kannst du über die Export-Funktion den Code generieren und direkt in dein Shopify-Theme integrieren.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-[#1c2838] mb-2">Gibt es eine Testversion?</h3>
            <p className="text-gray-600">Ja, du kannst den BrandUp Builder kostenlos testen. Einige Funktionen sind in der kostenlosen Version eingeschränkt.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-[#1c2838] mb-2">Wie erreiche ich den Support?</h3>
            <p className="text-gray-600">Unser Support-Team ist per E-Mail unter support@brandupfactory.com erreichbar. Wir antworten in der Regel innerhalb von 24 Stunden.</p>
          </div>
        </div>
      </div>
    </div>
  )
}