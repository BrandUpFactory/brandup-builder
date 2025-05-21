'use client'

import { useState } from 'react'

interface DevicePreviewProps {
  children: React.ReactNode
  onDeviceChange?: (device: 'desktop' | 'tablet' | 'mobile') => void
}

export default function DevicePreview({ children, onDeviceChange }: DevicePreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  
  // Update device state and call parent callback if provided
  const handleDeviceChange = (newDevice: 'desktop' | 'tablet' | 'mobile') => {
    setDevice(newDevice)
    if (onDeviceChange) {
      onDeviceChange(newDevice)
    }
  }
  // Dark mode removed as per requirements

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

  // Theme styles (light only as per requirements)
  const themeStyles = {
    background: 'white',
    color: '#1c2838'
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Device Control Bar */}
      <div className="flex justify-between items-center p-2 bg-gray-100 rounded-t border-b mb-2">
        <div className="flex space-x-1">
          <button
            onClick={() => handleDeviceChange('mobile')}
            className={`p-1.5 rounded ${device === 'mobile' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
            title="Mobile Ansicht"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
          {/* Tablet button removed as requested */}
          <button
            onClick={() => handleDeviceChange('desktop')}
            className={`p-1.5 rounded ${device === 'desktop' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
            title="Desktop Ansicht"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        {/* Dark mode button removed as per requirements */}
      </div>

      {/* Device Preview Frame */}
      <div className="flex-1 overflow-auto flex justify-center">
        <div
          className={`transition-all duration-300 overflow-auto ${device !== 'desktop' ? 'border-2 rounded-lg shadow-lg' : ''}`}
          style={{
            ...deviceStyles[device],
            ...themeStyles
          }}
        >
          {/* Container for content */}
          <div className="h-full">
            {children}
          </div>
        </div>
      </div>

      {/* Device Info */}
      <div className="text-xs text-gray-500 mt-2 text-center">
        {device === 'desktop' ? 'Desktop' : device === 'tablet' ? 'Tablet (768px)' : 'Mobile (375px)'}
      </div>
    </div>
  )
}
