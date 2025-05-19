'use client'

import HeroSection from '@/sections/HeroSection'
import EditorLayout from '@/components/EditorLayout'

export default function HeroEditorPage() {
  // Create a wrapper component to handle the HeroSection format
  const HeroSectionWrapper = () => {
    const { settings, preview, code } = HeroSection({
      initialData: { title: "Hero Section", color: "#f3f4f6" }
    });
    
    return (
      <EditorLayout
        settings={settings}
        preview={preview}
        code={code}
      />
    );
  };

  return <HeroSectionWrapper />;
}
