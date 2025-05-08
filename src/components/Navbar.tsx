'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { FiLock } from 'react-icons/fi'
import { FaChevronDown } from 'react-icons/fa'
import { supabase } from '@/lib/supabaseClient'
import { Session, User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLockClick = () => {
    alert('🔒 Bitte melde dich an, um die weiteren Zugriffe zu erhalten.')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setDropdownOpen(false)
  }

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev)
  }

  // Klick außerhalb schließt Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Session check
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="h-screen w-64 bg-white text-[#1c2838] flex flex-col justify-between p-6 border-r border-gray-200">
      {/* Logo + Navigation */}
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

        <nav className="flex flex-col gap-4 text-sm font-medium">
          <div className="flex justify-between items-center pr-1">
            <Link href="/" className="hover:text-[#8db5d8] transition">
              My Sections
            </Link>
            <button onClick={handleLockClick} className="text-gray-400 hover:text-[#8db5d8]">
              <FiLock size={16} />
            </button>
          </div>
          <div className="flex justify-between items-center pr-1">
            <Link href="/templates" className="hover:text-[#8db5d8] transition">
              Templates
            </Link>
            <button onClick={handleLockClick} className="text-gray-400 hover:text-[#8db5d8]">
              <FiLock size={16} />
            </button>
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

      {/* Login / Account */}
      <nav
        className="flex flex-col gap-3 border-t border-gray-200 pt-4 text-sm text-[#1c2838] font-normal"
        ref={dropdownRef}
      >
        {!user ? (
          <button
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
            className="text-left hover:text-[#8db5d8] transition"
          >
            Login
          </button>
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
  )
}