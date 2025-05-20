'use client'

import { useState, useEffect } from 'react'
import ImageManager from '@/components/ImageManager'

interface HeroSectionProps {
  initialData?: {
    title?: string;
    subtitle?: string;
    color?: string;
    buttonText?: string;
    buttonLink?: string;
    alignment?: 'left' | 'center' | 'right';
    textColor?: string;
    padding?: string;
    showButton?: boolean;
  };
  onDataChange?: (data: any) => void;
}

export default function HeroSection({ initialData, onDataChange }: HeroSectionProps) {
  // Ensure initialData is an object
  const safeInitialData = initialData || {};
  
  // Section content
  const [title, setTitle] = useState(safeInitialData.title || 'Willkommen bei BrandUp')
  const [subtitle, setSubtitle] = useState(safeInitialData.subtitle || 'Erstelle professionelle Shopify-Sektionen mit unserem intuitiven Builder.')
  const [buttonText, setButtonText] = useState(safeInitialData.buttonText || 'Jetzt entdecken')
  const [buttonLink, setButtonLink] = useState(safeInitialData.buttonLink || '#')
  
  // Section styling
  const [color, setColor] = useState(safeInitialData.color || '#f5f7fa')
  const [textColor, setTextColor] = useState(safeInitialData.textColor || '#1c2838')
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>(safeInitialData.alignment || 'center')
  const [padding, setPadding] = useState(safeInitialData.padding || '80px')
  const [showButton, setShowButton] = useState(safeInitialData.showButton !== undefined ? safeInitialData.showButton : true)
  
  // Update parent component when data changes
  useEffect(() => {
    if (onDataChange) {
      const data = {
        title,
        subtitle,
        color,
        buttonText,
        buttonLink,
        alignment,
        textColor,
        padding,
        showButton
      };
      
      // Check if this is actually a change compared to initial data
      if (JSON.stringify(data) !== JSON.stringify(safeInitialData)) {
        console.log("⚡ HeroSection: Changes detected, updating data with:", JSON.stringify(data, null, 2));
      } else {
        console.log("⚡ HeroSection: No changes detected compared to initial data");
      }
      
      // Always notify parent to handle the data
      onDataChange(data);
    }
  }, [
    title, subtitle, color, buttonText, buttonLink,
    alignment, textColor, padding, showButton, onDataChange, safeInitialData
  ])

  // Text alignment classes based on the alignment setting
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }

  const settings = (
    <div className="space-y-6">
      {/* Content Settings */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold mb-3 text-[#1c2838]">Inhalte</h3>
        <div className="space-y-3">
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
            Untertitel:
            <textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm"
              rows={2}
            />
          </label>
        </div>
      </div>
      
      {/* Button Settings */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-[#1c2838]">Button</h3>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showButton}
              onChange={(e) => setShowButton(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-2 text-xs text-gray-600">Anzeigen</span>
          </label>
        </div>
        
        {showButton && (
          <div className="space-y-3">
            <label className="block text-sm text-[#1c2838]">
              Button-Text:
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm"
              />
            </label>
            
            <label className="block text-sm text-[#1c2838]">
              Button-Link:
              <input
                type="text"
                value={buttonLink}
                onChange={(e) => setButtonLink(e.target.value)}
                className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm"
                placeholder="#"
              />
            </label>
          </div>
        )}
      </div>
      
      {/* Style Settings */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-[#1c2838]">Styling</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm text-[#1c2838]">
              Hintergrundfarbe:
              <div className="flex items-center mt-1">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-6 border rounded mr-2"
                />
                <span className="text-xs text-gray-500">{color}</span>
              </div>
            </label>
            
            <label className="block text-sm text-[#1c2838]">
              Textfarbe:
              <div className="flex items-center mt-1">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-6 border rounded mr-2"
                />
                <span className="text-xs text-gray-500">{textColor}</span>
              </div>
            </label>
          </div>
          
          <label className="block text-sm text-[#1c2838]">
            Ausrichtung:
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setAlignment('left')}
                className={`px-3 py-1.5 rounded text-xs flex-1 ${alignment === 'left' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
              >
                Links
              </button>
              <button
                onClick={() => setAlignment('center')}
                className={`px-3 py-1.5 rounded text-xs flex-1 ${alignment === 'center' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
              >
                Zentriert
              </button>
              <button
                onClick={() => setAlignment('right')}
                className={`px-3 py-1.5 rounded text-xs flex-1 ${alignment === 'right' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
              >
                Rechts
              </button>
            </div>
          </label>
          
          <label className="block text-sm text-[#1c2838]">
            Innenabstand:
            <div className="flex items-center mt-1">
              <input
                type="range"
                min="20"
                max="200"
                step="10"
                value={padding.replace('px', '')}
                onChange={(e) => setPadding(`${e.target.value}px`)}
                className="w-full"
              />
              <span className="ml-2 text-xs text-gray-500 w-12">{padding}</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  )

  const preview = (
    <div 
      className="min-h-full relative overflow-hidden"
      style={{ backgroundColor: color }}
    >
      {/* Content */}
      <div 
        className={`relative z-10 flex flex-col ${alignmentClasses[alignment]} justify-center`}
        style={{ padding, color: textColor }}
      >
        <div className={`max-w-3xl ${alignment === 'center' ? 'mx-auto px-4' : alignment === 'left' ? 'ml-4 mr-auto' : 'mr-4 ml-auto'}`}>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          
          <p className="text-base md:text-lg opacity-90 mb-6">{subtitle}</p>
          
          {showButton && (
            <a 
              href={buttonLink}
              className="inline-block bg-[#1c2838] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </div>
  )

  const code = `{% comment %}
  Hero-Section (BrandUp Builder)
{% endcomment %}

<section 
  class="relative" 
  style="
    background-color: ${color};
  "
>
  <div 
    class="relative z-10 container mx-auto text-${alignment} flex flex-col items-${alignment === 'center' ? 'center' : alignment === 'left' ? 'start' : 'end'}"
    style="padding: ${padding} 1rem; color: ${textColor};"
  >
    <div class="max-w-3xl {% if text_alignment == 'center' %}mx-auto{% elsif text_alignment == 'right' %}ml-auto{% else %}mr-auto{% endif %}">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ section.settings.title }}</h1>
      
      <p class="text-base md:text-lg opacity-90 mb-6">{{ section.settings.subtitle }}</p>
      
      {% if section.settings.show_button %}
        <a 
          href="{{ section.settings.button_link }}"
          class="inline-block bg-[#1c2838] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
        >
          {{ section.settings.button_text }}
        </a>
      {% endif %}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Hero Section",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Titel",
      "default": "${title}"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Untertitel",
      "default": "${subtitle}"
    },
    {
      "type": "checkbox",
      "id": "show_button",
      "label": "Button anzeigen",
      "default": ${showButton}
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "Button-Text",
      "default": "${buttonText}"
    },
    {
      "type": "url",
      "id": "button_link",
      "label": "Button-Link",
      "default": "${buttonLink}"
    },
    {
      "type": "color",
      "id": "background_color",
      "label": "Hintergrundfarbe",
      "default": "${color}"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Textfarbe",
      "default": "${textColor}"
    },
    {
      "type": "select",
      "id": "text_alignment",
      "label": "Text-Ausrichtung",
      "options": [
        { "value": "left", "label": "Links" },
        { "value": "center", "label": "Zentriert" },
        { "value": "right", "label": "Rechts" }
      ],
      "default": "${alignment}"
    },
    {
      "type": "range",
      "id": "padding",
      "label": "Innenabstand",
      "min": 20,
      "max": 200,
      "step": 10,
      "default": ${padding.replace('px', '')}
    }
  ],
  "presets": [
    {
      "name": "Hero Section",
      "category": "BrandUp Sections"
    }
  ]
}
{% endschema %}`

  return { settings, preview, code }
}
