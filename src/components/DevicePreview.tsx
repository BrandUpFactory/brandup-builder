'use client'

import { useState } from 'react'

interface DevicePreviewProps {
  children: React.ReactNode
}

export default function DevicePreview({ children }: DevicePreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Device dimensions mapping
  const deviceStyles = {
    desktop: {
      width: '100%',
      height: '100%',
      maxWidth: '100%'
    },
    tablet: {
      width: '768px',
      height: '1024px',
      maxWidth: '100%'
    },
    mobile: {
      width: '375px',
      height: '667px',
      maxWidth: '100%'
    }
  }

  // Theme styles
  const themeStyles = {
    light: {
      background: 'white',
      color: '#1c2838'
    },
    dark: {
      background: '#1c2838',
      color: 'white'
    }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Device Control Bar */}
      <div className="flex justify-between items-center p-2 bg-gray-100 rounded-t border-b mb-2">
        <div className="flex space-x-1">
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded ${device === 'mobile' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
            title="Mobile Ansicht"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded ${device === 'tablet' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
            title="Tablet Ansicht"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded ${device === 'desktop' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
            title="Desktop Ansicht"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <div>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded hover:bg-gray-200"
            title={theme === 'light' ? 'Zum dunklen Modus wechseln' : 'Zum hellen Modus wechseln'}
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Device Preview Frame */}
      <div className="flex-1 overflow-auto flex justify-center">
        <div
          className={`transition-all duration-300 overflow-auto ${device !== 'desktop' ? 'border-2 rounded-lg shadow-lg' : ''}`}
          style={{
            ...deviceStyles[device],
            ...themeStyles[theme]
          }}
        >
          {/* If theme is dark, we need to wrap the children to apply theme styles */}
          <div className={`h-full ${theme === 'dark' ? 'theme-dark' : ''}`}>
            {children}
          </div>
        </div>
      </div>

      {/* Device Info */}
      <div className="text-xs text-gray-500 mt-2 text-center">
        {device === 'desktop' ? 'Desktop' : device === 'tablet' ? 'Tablet (768px)' : 'Mobile (375px)'} - {theme === 'light' ? 'Heller Modus' : 'Dunkler Modus'}
      </div>
    </div>
  )
}
