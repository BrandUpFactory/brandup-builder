'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Session, User } from '@supabase/supabase-js'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  const isLoggedIn = !!user
  const recentSections = isLoggedIn ? ['Hero Split', 'Product Grid', 'Newsletter Block'] : []
  const popularSections = ['Landing Hero XL', 'Icon Grid Pro', 'Sticky CTA Footer']

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('❌ Fehler beim Abrufen des Users:', error)
        return
      }
      setUser(data?.user ?? null)
    }

    init()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const toggleNotifications = () => setShowNotifications(!showNotifications)

  return (
    <div className="px-6 md:px-12 py-8 bg-white min-h-screen relative">
      {/* Notifications */}
      <div className="flex justify-end mb-6">
        <button
          onClick={toggleNotifications}
          className="relative bg-gray-100 hover:bg-gray-200 transition p-2 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#1c2838]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-5-5.917V4a1 1 0 00-2 0v1.083A6.002 6.002 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
        </button>

        {showNotifications && (
          <div
            ref={notificationRef}
            className="absolute top-14 right-6 w-64 bg-white border shadow-xl rounded-xl z-50"
          >
            <div className="p-4 text-sm font-medium text-black border-b">Notifications</div>
            <div className="p-4 text-sm text-black">Es gibt aktuell keine Neuigkeiten.</div>
          </div>
        )}
      </div>

      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#1c2838] mb-2">
        Welcome to <span className="text-[#8db5d8]">BrandUp Builder</span> 🚀
      </h1>
      <p className="text-gray-600 text-sm md:text-base mb-6 max-w-2xl">
        Effortlessly build & customize Shopify sections. Design visually, export instantly, sell confidently.
      </p>

      {/* CTA aligned right */}
      <div className="flex justify-end gap-4 mb-10 flex-wrap">
        <a
          href="/mysections"
          className="inline-flex items-center gap-2 bg-[#1c2838] hover:opacity-90 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          Start Building →
        </a>
        <a
          href="/templates"
          className="inline-flex items-center gap-2 bg-[#1c2838] hover:opacity-90 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          Explore Templates
        </a>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-10">
        {/* Zuletzt erstellt – Größte Card */}
        <div className="p-6 border rounded-xl shadow-sm bg-white md:col-span-2 flex flex-col justify-between">
          <h3 className="text-xl font-semibold text-[#1c2838] mb-4">Zuletzt erstellt</h3>
          {!isLoggedIn ? (
            <Link href="/login">
              <button className="bg-black text-white px-6 py-2 rounded-full text-sm hover:opacity-90 transition">
                Jetzt anmelden
              </button>
            </Link>
          ) : recentSections.length === 0 ? (
            <p className="text-sm text-gray-600">Du hast noch keine Sektionen erstellt. Jetzt starten!</p>
          ) : (
            <div className="space-y-2">
              {recentSections.map((section, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm text-sm text-[#1c2838]">
                  {section}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Updates & News – Hoch */}
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
                '🧭 New onboarding experience launched'
              ].map((text, index) => (
                <div key={text + index} className="bg-[#f4f4f4] text-[#1c2838] text-sm px-4 py-3 rounded-md shadow">
                  {text}
                </div>
              )))}
            </div>
          </div>
        </div>
      </div>

      {/* Beliebteste Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <div className="p-6 border rounded-xl shadow-sm bg-white md:col-span-3">
          <h3 className="text-xl font-semibold text-[#1c2838] mb-4">Beliebteste Sections</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {popularSections.map((section, idx) => (
              <div key={idx} className="bg-gray-50 rounded-md p-4 shadow-sm text-sm text-[#1c2838]">
                {section}
              </div>
            ))}
          </div>
          <a
            href="https://brandupelements.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#1c2838] text-white px-6 py-2 rounded-full text-sm hover:opacity-90 transition"
          >
            Zum Shop →
          </a>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        .scroll-track {
          display: flex;
          flex-direction: column;
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  )
}
