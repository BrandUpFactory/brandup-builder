'use client'

import { useState } from 'react'

export default function HeroSection() {
  const [title, setTitle] = useState('BrandUp Builder')
  const [color, setColor] = useState('#f3f4f6')

  const settings = (
    <div className="space-y-4">
      <label className="block text-sm text-[#1c2838]">
        Titel:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm"
        />
      </label>
      <label className="block text-sm text-[#1c2838]">
        Hintergrundfarbe:
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
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

  const code = `<section style=\"background-color: ${color};\">\n  <h1>${title}</h1>\n</section>`

  return { settings, preview, code }
}
