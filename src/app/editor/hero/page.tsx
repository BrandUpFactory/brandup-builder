'use client'

import HeroSection from '@/sections/HeroSection'
import EditorLayout from '@/components/EditorLayout'

export default function HeroEditorPage() {
  const { settings, preview, code } = HeroSection()

  return (
    <EditorLayout
      settings={settings}
      preview={preview}
      code={code}
    />
  )
}
