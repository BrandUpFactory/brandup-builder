'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { FiLock, FiMenu, FiX } from 'react-icons/fi'
import { FaChevronDown } from 'react-icons/fa'
import { createClient } from '@/utils/supabase/client'
import { Session, User } from '@supabase/supabase-js'

export default function Navbar() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [shakeSection, setShakeSection] = useState(false)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const showInfo = (msg: string) => {
    setInfoMessage(msg)
    setTimeout(() => setInfoMessage(null), 3000)
  }

  const handleLockClick = () => {
    showInfo('🔒 Bitte melde dich an, um die weiteren Zugriffe zu erhalten.')
    setShakeSection(true)
    setTimeout(() => setShakeSection(false), 500)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setDropdownOpen(false)
    setMobileMenuOpen(false)
  }

  const toggleDropdown = () => setDropdownOpen((prev) => !prev)
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleClickOutsideMobile = (event: MouseEvent) => {
      // Wenn das Menü offen ist und der Klick außerhalb des Menüs erfolgt
      // und nicht auf den Toggle-Button
      if (
        mobileMenuOpen &&
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.mobile-menu-toggle')
      ) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutsideMobile)
    return () => document.removeEventListener('mousedown', handleClickOutsideMobile)
  }, [mobileMenuOpen])

  useEffect(() => {
    // Verhindern des Scrollens, wenn das mobile Menü geöffnet ist
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Fehler beim Abrufen des Benutzers:', error)
        return
      }
      setUser(data?.user ?? null)
    }

    fetchUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isLoggedIn = !!user

  return (
    <>
      {infoMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-white text-orange-600 border border-orange-300 px-8 py-4 rounded-lg shadow-lg z-50 max-w-[500px] w-[90%] text-center">
          {infoMessage}
        </div>
      )}

      {/* Mobile Menu Button - Immer sichtbar auf kleinen Bildschirmen */}
      <div className="fixed top-4 left-4 lg:hidden z-50">
        <button 
          onClick={toggleMobileMenu} 
          className="mobile-menu-toggle bg-white p-2 rounded-md shadow-md text-[#1c2838] focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Logo - Zentriert auf kleinen Bildschirmen */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 lg:hidden z-40">
        <Link href="/">
          <Image
            src="/BrandUp_Elements_Logo_2000_800.png"
            alt="BrandUp Logo"
            width={120}
            height={48}
            priority
            className="cursor-pointer"
          />
        </Link>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Mobile Menu - Slide-in from left */}
      <div 
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 h-screen w-64 bg-white text-[#1c2838] flex flex-col justify-between p-6 shadow-lg z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo for Mobile Menu */}
        <div>
          <div className="mb-10 mt-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src="/BrandUp_Elements_Logo_2000_800.png"
                alt="BrandUp Logo"
                width={160}
                height={64}
                priority
                className="cursor-pointer"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-4 text-sm font-medium">
            <div className="flex justify-between items-center pr-1">
              {isLoggedIn ? (
                <Link 
                  href="/mysections" 
                  className="hover:text-[#8db5d8] transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Sections
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleLockClick();
                    setMobileMenuOpen(false);
                  }}
                  className="flex justify-between items-center w-full text-left hover:text-[#8db5d8] transition"
                >
                  My Sections
                  <FiLock size={16} className={`text-gray-400 ${shakeSection ? 'animate-shake' : ''}`} />
                </button>
              )}
            </div>

            <div className="pr-1">
              <Link 
                href="/templates" 
                className="hover:text-[#8db5d8] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Templates
              </Link>
            </div>

            <a
              href="https://brandupelements.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8db5d8] transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </a>
          </nav>
        </div>

        {/* Account / Login for Mobile */}
        <nav className="flex flex-col gap-3 border-t border-gray-200 pt-4 text-sm text-[#1c2838] font-normal">
          {!isLoggedIn ? (
            <Link 
              href="/login" 
              className="text-left hover:text-[#8db5d8] transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          ) : (
            <div>
              <button
                onClick={handleLogout}
                className="w-full text-left hover:text-[#8db5d8] transition"
              >
                Abmelden
              </button>
            </div>
          )}

          <Link 
            href="/license" 
            className="hover:text-[#8db5d8] transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            License
          </Link>
          <Link 
            href="/settings" 
            className="hover:text-[#8db5d8] transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Settings
          </Link>
        </nav>
      </div>

      {/* Desktop Sidebar - Unverändert, aber nur auf großen Bildschirmen sichtbar */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-white text-[#1c2838] flex-col justify-between p-6 border-r border-gray-200 z-40 hidden lg:flex">
        {/* Logo */}
        <div>
          <div className="mb-10">
            <Link href="/">
              <Image
                src="/BrandUp_Elements_Logo_2000_800.png"
                alt="BrandUp Logo"
                width={160}
                height={64}
                priority
                className="cursor-pointer"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-4 text-sm font-medium">
            <div className="flex justify-between items-center pr-1">
              {isLoggedIn ? (
                <Link href="/mysections" className="hover:text-[#8db5d8] transition">
                  My Sections
                </Link>
              ) : (
                <button
                  onClick={handleLockClick}
                  className="flex justify-between items-center w-full text-left hover:text-[#8db5d8] transition"
                >
                  My Sections
                  <FiLock size={16} className={`text-gray-400 ${shakeSection ? 'animate-shake' : ''}`} />
                </button>
              )}
            </div>

            <div className="pr-1">
              <Link href="/templates" className="hover:text-[#8db5d8] transition">
                Templates
              </Link>
            </div>

            <a
              href="https://brandupelements.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8db5d8] transition"
            >
              Shop
            </a>
          </nav>
        </div>

        {/* Account / Login */}
        <nav
          className="flex flex-col gap-3 border-t border-gray-200 pt-4 text-sm text-[#1c2838] font-normal"
          ref={dropdownRef}
        >
          {!isLoggedIn ? (
            <Link href="/login" className="text-left hover:text-[#8db5d8] transition">
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex justify-between items-center w-full hover:text-[#8db5d8] transition"
              >
                Account
                <FaChevronDown size={12} className="ml-1" />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 mt-2 bg-white shadow border rounded w-full z-10">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    Abmelden
                  </button>
                </div>
              )}
            </div>
          )}

          <Link href="/license" className="hover:text-[#8db5d8] transition">
            License
          </Link>
          <Link href="/settings" className="hover:text-[#8db5d8] transition">
            Settings
          </Link>
        </nav>
      </div>
    </>
  )
}