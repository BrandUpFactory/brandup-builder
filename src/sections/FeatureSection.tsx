'use client'

import { useState, useEffect } from 'react'
import ImageManager from '@/components/ImageManager'

interface FeatureSectionProps {
  initialData?: {
    title?: string;
    subtitle?: string;
    backgroundColor?: string;
    textColor?: string;
    features?: {
      icon?: string;
      title?: string;
      description?: string;
    }[];
    columnCount?: 2 | 3 | 4;
    padding?: string;
  };
  onDataChange?: (data: any) => void;
}

export default function FeatureSection({ initialData, onDataChange }: FeatureSectionProps) {
  // Ensure initialData is an object
  const safeInitialData = initialData || {};
  
  // Default features
  const defaultFeatures = [
    {
      icon: '/icons8-graph-96.png',
      title: 'Intuitive Bedienung',
      description: 'Einfache Nutzung ohne Programmierkenntnisse'
    },
    {
      icon: '/window.svg',
      title: 'Responsive Design',
      description: 'Perfekt auf allen Geräten'
    },
    {
      icon: '/globe.svg',
      title: 'Schnelle Integration',
      description: 'Einfach in deinen Shop einbinden'
    }
  ];
  
  // Section content
  const [title, setTitle] = useState(safeInitialData.title || 'Unsere Features')
  const [subtitle, setSubtitle] = useState(safeInitialData.subtitle || 'Entdecke die Vorteile unserer Produkte')
  const [features, setFeatures] = useState(safeInitialData.features || defaultFeatures)
  
  // Section styling
  const [backgroundColor, setBackgroundColor] = useState(safeInitialData.backgroundColor || '#ffffff')
  const [textColor, setTextColor] = useState(safeInitialData.textColor || '#1c2838')
  const [columnCount, setColumnCount] = useState<2 | 3 | 4>(safeInitialData.columnCount || 3)
  const [padding, setPadding] = useState(safeInitialData.padding || '60px')
  
  // Update parent component when data changes
  useEffect(() => {
    if (onDataChange) {
      const data = {
        title,
        subtitle,
        backgroundColor,
        textColor,
        features,
        columnCount,
        padding
      };
      
      // Always notify parent to handle the data
      onDataChange(data);
    }
  }, [
    title, subtitle, backgroundColor, textColor,
    features, columnCount, padding, onDataChange
  ])

  // Update a feature
  const updateFeature = (index: number, field: string, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setFeatures(updatedFeatures);
  };

  // Add a feature
  const addFeature = () => {
    if (features.length < 8) {
      setFeatures([...features, { icon: '', title: 'Neues Feature', description: 'Feature-Beschreibung' }]);
    }
  };

  // Remove a feature
  const removeFeature = (index: number) => {
    if (features.length > 1) {
      const updatedFeatures = [...features];
      updatedFeatures.splice(index, 1);
      setFeatures(updatedFeatures);
    }
  };

  const settings = (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold mb-3 text-[#1c2838]">Allgemein</h3>
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
      
      {/* Features */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-[#1c2838]">Features</h3>
          <button
            onClick={addFeature}
            disabled={features.length >= 8}
            className={`px-2 py-1 text-xs rounded-md ${features.length >= 8 ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white'}`}
          >
            + Feature hinzufügen
          </button>
        </div>
        
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {features.map((feature, index) => (
            <div key={index} className="border rounded-md p-3 bg-gray-50 relative">
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => removeFeature(index)}
                  disabled={features.length <= 1}
                  className={`p-1 rounded-full ${features.length <= 1 ? 'text-gray-400' : 'text-red-500 hover:bg-red-50'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <label className="block text-xs text-[#1c2838] mb-2">
                Icon:
                <div className="mt-1 flex items-center space-x-2">
                  {feature.icon && (
                    <div className="w-8 h-8 border rounded-md flex items-center justify-center bg-white overflow-hidden">
                      <img
                        src={feature.icon}
                        alt="Icon"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                  <ImageManager
                    onSelect={(url) => updateFeature(index, 'icon', url)}
                    currentImage={feature.icon || ''}
                    buttonText="Icon wählen"
                    buttonClassName="text-xs py-1 px-2"
                  />
                </div>
              </label>
              
              <label className="block text-xs text-[#1c2838] mt-2">
                Titel:
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) => updateFeature(index, 'title', e.target.value)}
                  className="mt-1 w-full border px-2 py-1 rounded-md text-xs"
                />
              </label>
              
              <label className="block text-xs text-[#1c2838] mt-2">
                Beschreibung:
                <textarea
                  value={feature.description}
                  onChange={(e) => updateFeature(index, 'description', e.target.value)}
                  className="mt-1 w-full border px-2 py-1 rounded-md text-xs"
                  rows={2}
                />
              </label>
            </div>
          ))}
        </div>
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
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-8 h-6 border rounded mr-2"
                />
                <span className="text-xs text-gray-500">{backgroundColor}</span>
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
            Spalten:
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setColumnCount(2)}
                className={`px-3 py-1.5 rounded text-xs flex-1 ${columnCount === 2 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
              >
                2 Spalten
              </button>
              <button
                onClick={() => setColumnCount(3)}
                className={`px-3 py-1.5 rounded text-xs flex-1 ${columnCount === 3 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
              >
                3 Spalten
              </button>
              <button
                onClick={() => setColumnCount(4)}
                className={`px-3 py-1.5 rounded text-xs flex-1 ${columnCount === 4 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
              >
                4 Spalten
              </button>
            </div>
          </label>
          
          <label className="block text-sm text-[#1c2838]">
            Innenabstand:
            <div className="flex items-center mt-1">
              <input
                type="range"
                min="20"
                max="120"
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
      className="min-h-full relative w-full overflow-y-auto"
      style={{ backgroundColor, color: textColor, padding }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
          <p className="text-sm md:text-base opacity-80 max-w-3xl mx-auto">{subtitle}</p>
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-${columnCount} gap-6 md:gap-8`}>
          {features.map((feature, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-100 hover:shadow-md transition bg-white">
              <div className="mb-4">
                {feature.icon ? (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img 
                      src={feature.icon} 
                      alt={feature.title || `Feature ${index + 1}`}
                      className="w-6 h-6 object-contain" 
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xl">?</span>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm opacity-80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const code = `{% comment %}
  Features-Section (BrandUp Builder)
{% endcomment %}

<section 
  class="feature-section w-full" 
  style="
    background-color: ${backgroundColor};
    color: ${textColor};
    padding: ${padding} 1rem;
  "
>
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-10">
      <h2 class="text-2xl md:text-3xl font-bold mb-4">{{ section.settings.title }}</h2>
      <p class="text-sm md:text-base opacity-80 max-w-3xl mx-auto">{{ section.settings.subtitle }}</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-{{ section.settings.column_count }} gap-6 md:gap-8">
      {% for block in section.blocks %}
        <div class="p-4 rounded-lg border border-gray-100 hover:shadow-md transition bg-white">
          <div class="mb-4">
            {% if block.settings.icon != blank %}
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <img 
                  src="{{ block.settings.icon | img_url: 'small' }}" 
                  alt="{{ block.settings.title }}"
                  class="w-6 h-6 object-contain" 
                />
              </div>
            {% else %}
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span class="text-gray-400 text-xl">?</span>
              </div>
            {% endif %}
          </div>
          <h3 class="text-lg font-semibold mb-2">{{ block.settings.title }}</h3>
          <p class="text-sm opacity-80">{{ block.settings.description }}</p>
        </div>
      {% endfor %}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Feature Section",
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
      "type": "select",
      "id": "column_count",
      "label": "Spaltenanzahl",
      "options": [
        { "value": "2", "label": "2 Spalten" },
        { "value": "3", "label": "3 Spalten" },
        { "value": "4", "label": "4 Spalten" }
      ],
      "default": "${columnCount}"
    },
    {
      "type": "color",
      "id": "background_color",
      "label": "Hintergrundfarbe",
      "default": "${backgroundColor}"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Textfarbe",
      "default": "${textColor}"
    },
    {
      "type": "range",
      "id": "padding",
      "label": "Innenabstand",
      "min": 20,
      "max": 120,
      "step": 10,
      "default": ${padding.replace('px', '')}
    }
  ],
  "blocks": [
    {
      "type": "feature",
      "name": "Feature",
      "settings": [
        {
          "type": "image_picker",
          "id": "icon",
          "label": "Icon"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Titel",
          "default": "Feature Titel"
        },
        {
          "type": "textarea",
          "id": "description",
          "label": "Beschreibung",
          "default": "Feature Beschreibung"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Feature Section",
      "category": "BrandUp Sections",
      "blocks": [
        {
          "type": "feature"
        },
        {
          "type": "feature"
        },
        {
          "type": "feature"
        }
      ]
    }
  ]
}
{% endschema %}`

  return { settings, preview, code }
}