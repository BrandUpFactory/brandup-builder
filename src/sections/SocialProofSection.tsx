'use client'

import { useState, useEffect } from 'react'
import ImageManager from '@/components/ImageManager'

interface SocialProofSectionProps {
  initialData?: {
    firstName1?: string;
    firstName2?: string;
    userCount?: string;
    brandName?: string;
    backgroundColor?: string;
    avatarImage1?: string;
    avatarImage2?: string;
    verifiedImage?: string;
    avatarBorderColor?: string;
    textColor?: string;
    showBreakOnLarge?: boolean;
    avatarSize?: string;
    borderRadius?: string;
    padding?: string;
  };
  onDataChange?: (data: any) => void;
}

export default function SocialProofSection({ initialData, onDataChange }: SocialProofSectionProps) {
  // Ensure initialData is an object
  const safeInitialData = initialData || {};
  
  // Section content
  const [firstName1, setFirstName1] = useState(safeInitialData.firstName1 || 'Steffi')
  const [firstName2, setFirstName2] = useState(safeInitialData.firstName2 || 'Daniela')
  const [userCount, setUserCount] = useState(safeInitialData.userCount || '12.752')
  const [brandName, setBrandName] = useState(safeInitialData.brandName || 'Regenliebe')
  const [avatarImage1, setAvatarImage1] = useState(safeInitialData.avatarImage1 || 'https://cdn.shopify.com/s/files/1/0818/2123/7577/files/Profil-2.jpg?v=1738073619')
  const [avatarImage2, setAvatarImage2] = useState(safeInitialData.avatarImage2 || 'https://cdn.shopify.com/s/files/1/0818/2123/7577/files/Profil-4.jpg?v=1738083098')
  const [verifiedImage, setVerifiedImage] = useState(safeInitialData.verifiedImage || 'https://cdn.shopify.com/s/files/1/0818/2123/7577/files/insta-blue.png?v=1738073828')

  // Section styling
  const [backgroundColor, setBackgroundColor] = useState(safeInitialData.backgroundColor || '#f7f7f7')
  const [avatarBorderColor, setAvatarBorderColor] = useState(safeInitialData.avatarBorderColor || '#ffffff')
  const [textColor, setTextColor] = useState(safeInitialData.textColor || '#000000')
  const [showBreakOnLarge, setShowBreakOnLarge] = useState(safeInitialData.showBreakOnLarge !== undefined ? safeInitialData.showBreakOnLarge : true)
  const [avatarSize, setAvatarSize] = useState(safeInitialData.avatarSize || '32px')
  const [borderRadius, setBorderRadius] = useState(safeInitialData.borderRadius || '12px')
  const [padding, setPadding] = useState(safeInitialData.padding || '8px 12px')
  
  // Update parent component when data changes
  useEffect(() => {
    if (onDataChange) {
      const data = {
        firstName1,
        firstName2,
        userCount,
        brandName,
        backgroundColor,
        avatarImage1,
        avatarImage2,
        verifiedImage,
        avatarBorderColor,
        textColor,
        showBreakOnLarge,
        avatarSize,
        borderRadius,
        padding
      };
      
      // Always notify parent to handle the data
      onDataChange(data);
    }
  }, [
    firstName1, firstName2, userCount, brandName, 
    backgroundColor, avatarImage1, avatarImage2, verifiedImage,
    avatarBorderColor, textColor, showBreakOnLarge, 
    avatarSize, borderRadius, padding, onDataChange
  ])

  const settings = (
    <div className="space-y-6">
      {/* User Information */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold mb-3 text-[#1c2838]">Benutzerinformationen</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm text-[#1c2838]">
              Name 1:
              <input
                type="text"
                value={firstName1}
                onChange={(e) => setFirstName1(e.target.value)}
                className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm"
              />
            </label>
            
            <label className="block text-sm text-[#1c2838]">
              Name 2:
              <input
                type="text"
                value={firstName2}
                onChange={(e) => setFirstName2(e.target.value)}
                className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm"
              />
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm text-[#1c2838]">
              Benutzeranzahl:
              <input
                type="text"
                value={userCount}
                onChange={(e) => setUserCount(e.target.value)}
                className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm"
              />
            </label>
            
            <label className="block text-sm text-[#1c2838]">
              Markenname:
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm"
              />
            </label>
          </div>
        </div>
      </div>
      
      {/* Images */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold mb-3 text-[#1c2838]">Bilder</h3>
        <div className="space-y-4">
          <label className="block text-sm text-[#1c2838]">
            Avatar 1:
            <div className="mt-1 flex items-center space-x-2">
              {avatarImage1 && (
                <div className="w-10 h-10 border rounded-full overflow-hidden bg-white">
                  <img
                    src={avatarImage1}
                    alt="Avatar 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="text"
                  value={avatarImage1}
                  onChange={(e) => setAvatarImage1(e.target.value)}
                  className="w-full border px-3 py-1.5 rounded-md text-sm"
                  placeholder="URL des Avatarbildes 1"
                />
              </div>
              <ImageManager
                onSelect={setAvatarImage1}
                currentImage={avatarImage1}
                buttonText="Bild wählen"
              />
            </div>
          </label>
          
          <label className="block text-sm text-[#1c2838]">
            Avatar 2:
            <div className="mt-1 flex items-center space-x-2">
              {avatarImage2 && (
                <div className="w-10 h-10 border rounded-full overflow-hidden bg-white">
                  <img
                    src={avatarImage2}
                    alt="Avatar 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="text"
                  value={avatarImage2}
                  onChange={(e) => setAvatarImage2(e.target.value)}
                  className="w-full border px-3 py-1.5 rounded-md text-sm"
                  placeholder="URL des Avatarbildes 2"
                />
              </div>
              <ImageManager
                onSelect={setAvatarImage2}
                currentImage={avatarImage2}
                buttonText="Bild wählen"
              />
            </div>
          </label>
          
          <label className="block text-sm text-[#1c2838]">
            Verifizierungsbadge:
            <div className="mt-1 flex items-center space-x-2">
              {verifiedImage && (
                <div className="w-6 h-6 border rounded overflow-hidden bg-white">
                  <img
                    src={verifiedImage}
                    alt="Verifizierungsbadge"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="text"
                  value={verifiedImage}
                  onChange={(e) => setVerifiedImage(e.target.value)}
                  className="w-full border px-3 py-1.5 rounded-md text-sm"
                  placeholder="URL des Verifizierungsbadges"
                />
              </div>
              <ImageManager
                onSelect={setVerifiedImage}
                currentImage={verifiedImage}
                buttonText="Bild wählen"
              />
            </div>
          </label>
        </div>
      </div>
      
      {/* Style Settings */}
      <div className="border-b pb-4">
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
            Avatar-Randfarbe:
            <div className="flex items-center mt-1">
              <input
                type="color"
                value={avatarBorderColor}
                onChange={(e) => setAvatarBorderColor(e.target.value)}
                className="w-8 h-6 border rounded mr-2"
              />
              <span className="text-xs text-gray-500">{avatarBorderColor}</span>
            </div>
          </label>
          
          <label className="block text-sm text-[#1c2838]">
            Avatargröße:
            <div className="flex items-center mt-1">
              <input
                type="range"
                min="24"
                max="48"
                step="2"
                value={avatarSize.replace('px', '')}
                onChange={(e) => setAvatarSize(`${e.target.value}px`)}
                className="w-full"
              />
              <span className="ml-2 text-xs text-gray-500 w-12">{avatarSize}</span>
            </div>
          </label>
          
          <label className="block text-sm text-[#1c2838]">
            Eckenradius:
            <div className="flex items-center mt-1">
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={borderRadius.replace('px', '')}
                onChange={(e) => setBorderRadius(`${e.target.value}px`)}
                className="w-full"
              />
              <span className="ml-2 text-xs text-gray-500 w-12">{borderRadius}</span>
            </div>
          </label>
          
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showBreakOnLarge}
                onChange={(e) => setShowBreakOnLarge(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">Markenname auf großen Bildschirmen umbrechen</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Advanced Settings */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-[#1c2838]">Erweiterte Einstellungen</h3>
        <div className="space-y-3">
          <label className="block text-sm text-[#1c2838]">
            Padding:
            <input
              type="text"
              value={padding}
              onChange={(e) => setPadding(e.target.value)}
              className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm"
              placeholder="z.B. 8px 12px"
            />
            <p className="text-xs text-gray-500 mt-1">Format: vertical horizontal (z.B. 8px 12px)</p>
          </label>
        </div>
      </div>
    </div>
  )

  const preview = (
    <div className="min-h-full flex items-center justify-center p-4">
      <div 
        className="social-proof-box-proof" 
        style={{
          display: 'flex',
          alignItems: 'center',
          background: backgroundColor,
          padding: padding,
          borderRadius: borderRadius,
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '12px',
          color: textColor,
          maxWidth: '100%'
        }}
      >
        <div 
          className="user-avatars-proof" 
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <img 
            src={avatarImage1}
            alt="User 1" 
            className="avatar-proof" 
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: '50%',
              marginRight: '-8px',
              border: `2px solid ${avatarBorderColor}`,
              objectFit: 'cover'
            }}
          />
          <img 
            src={avatarImage2}
            alt="User 2" 
            className="avatar-proof" 
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: '50%',
              marginRight: '-8px',
              border: `2px solid ${avatarBorderColor}`,
              objectFit: 'cover'
            }}
          />
        </div>
        <div 
          className="user-text-proof" 
          style={{
            marginLeft: '12px',
            lineHeight: '1.2'
          }}
        >
          <strong>{firstName1}, {firstName2}</strong>
          <img 
            src={verifiedImage}
            alt="Verifiziert" 
            className="verified-badge-proof" 
            style={{
              width: '16px',
              height: '16px',
              marginLeft: '2px',
              position: 'relative',
              top: '2px'
            }}
          />
          <span> und <strong>{userCount}</strong> andere sind begeistert von 
            <span 
              className="break-on-large" 
              style={{
                display: showBreakOnLarge ? 'block' : 'inline',
              }}
            > {brandName}</span>
          </span>
        </div>
      </div>
    </div>
  )

  const code = `{% comment %}
  Social Proof Box (BrandUp Builder)
{% endcomment %}

<div class="social-proof-box-proof">
  <div class="user-avatars-proof">
    <img src="{{ section.settings.avatar_image_1 }}" alt="User 1" class="avatar-proof">
    <img src="{{ section.settings.avatar_image_2 }}" alt="User 2" class="avatar-proof">
  </div>
  <div class="user-text-proof">
    <strong>{{ section.settings.first_name_1 }}, {{ section.settings.first_name_2 }}</strong>
    <img src="{{ section.settings.verified_image }}" alt="Verifiziert" class="verified-badge-proof">
    <span> und <strong>{{ section.settings.user_count }}</strong> andere sind begeistert von 
      <span class="break-on-large">{{ section.settings.brand_name }}</span>
    </span>
  </div>
</div>

<style>
  .social-proof-box-proof {
    display: flex;
    align-items: center;
    background: ${backgroundColor};
    padding: ${padding};
    border-radius: ${borderRadius};
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
    color: ${textColor};
  }
  .user-avatars-proof {
    display: flex;
    align-items: center;
  }
  .avatar-proof {
    width: ${avatarSize};
    height: ${avatarSize};
    border-radius: 50%;
    margin-right: -8px;
    border: 2px solid ${avatarBorderColor};
    object-fit: cover;
  }
  .user-text-proof {
    margin-left: 12px;
    line-height: 1.2;
  }
  .verified-badge-proof {
    width: 16px;
    height: 16px;
    margin-left: 2px;
    position: relative;
    top: 2px;
  }
  @media (min-width: 1300px) {
    .break-on-large {
      display: ${showBreakOnLarge ? 'block' : 'inline'};
    }
  }
</style>

{% schema %}
{
  "name": "Social Proof #1",
  "settings": [
    {
      "type": "text",
      "id": "first_name_1",
      "label": "Name 1",
      "default": "${firstName1}"
    },
    {
      "type": "text",
      "id": "first_name_2",
      "label": "Name 2",
      "default": "${firstName2}"
    },
    {
      "type": "text",
      "id": "user_count",
      "label": "Benutzeranzahl",
      "default": "${userCount}"
    },
    {
      "type": "text",
      "id": "brand_name",
      "label": "Markenname",
      "default": "${brandName}"
    },
    {
      "type": "image_picker",
      "id": "avatar_image_1",
      "label": "Avatar 1"
    },
    {
      "type": "image_picker",
      "id": "avatar_image_2",
      "label": "Avatar 2"
    },
    {
      "type": "image_picker",
      "id": "verified_image",
      "label": "Verifizierungsbadge"
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
      "type": "color",
      "id": "avatar_border_color",
      "label": "Avatar-Randfarbe",
      "default": "${avatarBorderColor}"
    },
    {
      "type": "range",
      "id": "avatar_size",
      "min": 24,
      "max": 48,
      "step": 2,
      "label": "Avatargröße",
      "default": ${avatarSize.replace('px', '')}
    },
    {
      "type": "range",
      "id": "border_radius",
      "min": 0,
      "max": 20,
      "step": 1,
      "label": "Eckenradius",
      "default": ${borderRadius.replace('px', '')}
    },
    {
      "type": "checkbox",
      "id": "show_break_on_large",
      "label": "Markenname auf großen Bildschirmen umbrechen",
      "default": ${showBreakOnLarge}
    }
  ],
  "presets": [
    {
      "name": "Social Proof #1",
      "category": "BrandUp Sections"
    }
  ]
}
{% endschema %}`

  return { settings, preview, code }
}