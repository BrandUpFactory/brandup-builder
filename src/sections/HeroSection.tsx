'use client'

import { useState, useEffect } from 'react'

interface HeroSectionProps {
  initialData?: {
    title?: string;
    color?: string;
  };
  onDataChange?: (data: any) => void;
}

export default function HeroSection({ initialData, onDataChange }: HeroSectionProps) {
  // Ensure initialData is an object
  const safeInitialData = initialData || {};
  const [title, setTitle] = useState(safeInitialData.title || 'BrandUp Builder')
  const [color, setColor] = useState(safeInitialData.color || '#f3f4f6')
  
  // Update parent component when data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({ title, color })
    }
  }, [title, color, onDataChange])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setColor(newColor)
  }

  const settings = (
    <div className="space-y-4">
      <label className="block text-sm text-[#1c2838]">
        Titel:
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm"
        />
      </label>
      <label className="block text-sm text-[#1c2838]">
        Hintergrundfarbe:
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="mt-1 w-10 h-6 border rounded"
        />
      </label>
    </div>
  )

  const preview = (
    <div className="h-full flex items-center justify-center" style={{ backgroundColor: color }}>
      <h1 className="text-xl font-bold text-[#1c2838]">{title}</h1>
    </div>
  )

  const code = `<section style="background-color: ${color};">\n  <h1>${title}</h1>\n</section>`

  return { settings, preview, code }
}
