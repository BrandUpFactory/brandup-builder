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
    imageUrl?: string;
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
  const [imageUrl, setImageUrl] = useState(safeInitialData.imageUrl || '/BG_Card_55.jpg')
  
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
        imageUrl,
        alignment,
        textColor,
        padding,
        showButton
      };
      console.log("⚡ HeroSection: Updating data with:", JSON.stringify(data, null, 2));
      onDataChange(data);
    }
  }, [
    title, subtitle, color, buttonText, buttonLink,
    imageUrl, alignment, textColor, padding, showButton, onDataChange
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
          
          <label className="block text-sm text-[#1c2838]">
            Hintergrundbild:
            <div className="mt-1">
              {imageUrl && (
                <div className="mb-2 border rounded-md overflow-hidden bg-gray-100">
                  <div className="aspect-video relative">
                    <img 
                      src={imageUrl} 
                      alt="Hintergrundbild" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button 
                        onClick={() => window.open(imageUrl, '_blank')}
                        className="bg-white bg-opacity-80 text-gray-700 p-1.5 rounded-full hover:bg-white transition"
                        title="Vorschau öffnen"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setImageUrl('')}
                        className="bg-white bg-opacity-80 text-red-600 p-1.5 rounded-full hover:bg-white transition"
                        title="Bild entfernen"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <ImageManager
                onSelect={setImageUrl}
                currentImage={imageUrl}
              />
            </div>
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
      {/* Background Image with Overlay */}
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <img 
            src={imageUrl} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        </div>
      )}
      
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
  class="bg-cover bg-center relative" 
  style="
    background-color: ${color};
    {% if section.settings.image_url %}
      background-image: url('{{ section.settings.image_url }}');
    {% endif %}
  "
>
  {% if section.settings.image_url %}
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
  {% endif %}
  
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
      "type": "image_picker",
      "id": "image_url",
      "label": "Hintergrundbild"
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
