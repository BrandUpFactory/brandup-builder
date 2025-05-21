'use client'

import { useState, useEffect } from 'react'
import ImageManager from '@/components/ImageManager'

interface SocialProofSectionProps {
  initialData?: {
    firstName1?: string;
    firstName2?: string;
    firstName3?: string;
    userCount?: string;
    brandName?: string;
    backgroundColor?: string;
    avatarImage1?: string;
    avatarImage2?: string;
    avatarImage3?: string;
    verifiedImage?: string;
    avatarBorderColor?: string;
    textColor?: string;
    showBreakOnLarge?: boolean;
    avatarSize?: string;
    borderRadius?: string;
    padding?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    avatarCount?: number;
    customText?: string;
    selectedStyle?: number;
    singleLine?: boolean;
  };
  onDataChange?: (data: any) => void;
}

// Predefined style templates
const styleTemplates = [
  {
    name: 'Modern Light',
    backgroundColor: '#f7f7f7',
    textColor: '#000000',
    avatarBorderColor: '#ffffff',
    borderRadius: '12px',
    padding: '15px',
  },
  {
    name: 'Bold Dark',
    backgroundColor: '#1c2838',
    textColor: '#ffffff',
    avatarBorderColor: '#3b82f6',
    borderRadius: '8px',
    padding: '12px',
  },
  {
    name: 'Soft Gradient',
    backgroundColor: '#f0f9ff',
    textColor: '#0c4a6e',
    avatarBorderColor: '#bae6fd',
    borderRadius: '16px',
    padding: '18px',
  }
];

export default function SocialProofSection({ initialData, onDataChange }: SocialProofSectionProps) {
  // Ensure initialData is an object
  const safeInitialData = initialData || {};
  
  // Style template selection
  const [selectedStyle, setSelectedStyle] = useState<number>(safeInitialData.selectedStyle !== undefined ? safeInitialData.selectedStyle : 0);
  
  // Section content
  const [firstName1, setFirstName1] = useState(safeInitialData.firstName1 || 'Steffi')
  const [firstName2, setFirstName2] = useState(safeInitialData.firstName2 || 'Daniela')
  const [firstName3, setFirstName3] = useState(safeInitialData.firstName3 || 'Maria')
  const [userCount, setUserCount] = useState(safeInitialData.userCount || '12.752')
  const [brandName, setBrandName] = useState(safeInitialData.brandName || 'Regenliebe')
  const [customText, setCustomText] = useState(safeInitialData.customText || ' und {userCount} andere sind begeistert von {brandName}')
  const [avatarImage1, setAvatarImage1] = useState(safeInitialData.avatarImage1 || 'https://cdn.shopify.com/s/files/1/0818/2123/7577/files/Profil-2.jpg?v=1738073619')
  const [avatarImage2, setAvatarImage2] = useState(safeInitialData.avatarImage2 || 'https://cdn.shopify.com/s/files/1/0818/2123/7577/files/Profil-4.jpg?v=1738083098')
  const [avatarImage3, setAvatarImage3] = useState(safeInitialData.avatarImage3 || 'https://cdn.shopify.com/s/files/1/0818/2123/7577/files/Profil-1.jpg?v=1738073619')
  const [verifiedImage, setVerifiedImage] = useState(safeInitialData.verifiedImage || 'https://cdn.shopify.com/s/files/1/0818/2123/7577/files/insta-blue.png?v=1738073828')
  const [avatarCount, setAvatarCount] = useState(safeInitialData.avatarCount || 2)

  // Section styling
  const [backgroundColor, setBackgroundColor] = useState(safeInitialData.backgroundColor || styleTemplates[0].backgroundColor)
  const [avatarBorderColor, setAvatarBorderColor] = useState(safeInitialData.avatarBorderColor || styleTemplates[0].avatarBorderColor)
  const [textColor, setTextColor] = useState(safeInitialData.textColor || '#000000')
  const [showBreakOnLarge, setShowBreakOnLarge] = useState(safeInitialData.showBreakOnLarge !== undefined ? safeInitialData.showBreakOnLarge : true)
  const [singleLine, setSingleLine] = useState(safeInitialData.singleLine !== undefined ? safeInitialData.singleLine : false)
  const [avatarSize, setAvatarSize] = useState(safeInitialData.avatarSize || '32px')
  const [borderRadius, setBorderRadius] = useState(safeInitialData.borderRadius || styleTemplates[0].borderRadius)
  
  // Padding settings
  const [useSinglePadding, setUseSinglePadding] = useState(true)
  const [padding, setPadding] = useState(safeInitialData.padding || styleTemplates[0].padding)
  const [paddingTop, setPaddingTop] = useState(safeInitialData.paddingTop || '15')
  const [paddingRight, setPaddingRight] = useState(safeInitialData.paddingRight || '15')
  const [paddingBottom, setPaddingBottom] = useState(safeInitialData.paddingBottom || '15')
  const [paddingLeft, setPaddingLeft] = useState(safeInitialData.paddingLeft || '15')
  
  // Helper function to get effective padding
  const getEffectivePadding = () => {
    if (useSinglePadding) {
      // Handle numeric padding without 'px'
      return padding.toString().includes('px') ? padding : `${padding}px`;
    } else {
      return `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`;
    }
  };
  
  // Apply style template
  const applyStyleTemplate = (index: number) => {
    // Always update the style index
    setSelectedStyle(index);
    
    // Always apply the template styles when a style is selected
    const template = styleTemplates[index];
    setBackgroundColor(template.backgroundColor);
    setTextColor(index === 1 ? '#ffffff' : index === 2 ? '#0c4a6e' : '#000000');
    setAvatarBorderColor(template.avatarBorderColor);
    setBorderRadius(template.borderRadius);
    setPadding(template.padding);
    
    // If single padding is active, update the individual padding values too
    // This ensures consistent state across all padding-related variables
    setPaddingTop(template.padding.replace('px', ''));
    setPaddingRight(template.padding.replace('px', ''));
    setPaddingBottom(template.padding.replace('px', ''));
    setPaddingLeft(template.padding.replace('px', ''));
  };
  
  // Update parent component when data changes
  useEffect(() => {
    if (onDataChange) {
      const data = {
        firstName1,
        firstName2,
        firstName3,
        userCount,
        brandName,
        backgroundColor,
        avatarImage1,
        avatarImage2,
        avatarImage3,
        verifiedImage,
        avatarBorderColor,
        textColor,
        showBreakOnLarge,
        singleLine,
        avatarSize,
        borderRadius,
        padding: getEffectivePadding(),
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        avatarCount,
        customText,
        selectedStyle
      };
      
      // Always notify parent to handle the data
      onDataChange(data);
    }
  }, [
    firstName1, firstName2, firstName3, userCount, brandName, customText,
    backgroundColor, avatarImage1, avatarImage2, avatarImage3, verifiedImage,
    avatarBorderColor, textColor, showBreakOnLarge, singleLine,
    avatarSize, borderRadius, padding, paddingTop, paddingRight,
    paddingBottom, paddingLeft, avatarCount, selectedStyle, onDataChange
  ])

  // Handle avatar display names based on avatar count
  const getDisplayNames = () => {
    switch(avatarCount) {
      case 1:
        return firstName1;
      case 2:
        return `${firstName1}, ${firstName2}`;
      case 3:
        return `${firstName1}, ${firstName2}, ${firstName3}`;
      default:
        return `${firstName1}, ${firstName2}`;
    }
  };
  
  // Format the custom text with variables
  const getFormattedText = () => {
    // First, ensure there's a space before the variable replacement if needed
    const ensureSpacedText = customText
      .replace(/([^\s])\{userCount\}/g, '$1 {userCount}')  // Add space before {userCount} if no space exists
      .replace(/\{userCount\}([^\s])/g, '{userCount} $1')  // Add space after {userCount} if no space exists
      .replace(/([^\s])\{brandName\}/g, '$1 {brandName}')  // Add space before {brandName} if no space exists
      .replace(/\{brandName\}([^\s])/g, '{brandName} $1');  // Add space after {brandName} if no space exists
      
    // Then, replace variables with properly formatted values
    let formattedText = ensureSpacedText
      .replace(/\{userCount\}/g, `<strong>${userCount}</strong>`)
      .replace(/\{brandName\}/g, brandName);
    
    return formattedText;
  };
  
  // Format the text for Shopify Liquid (used in code export)
  const getLiquidFormattedText = () => {
    // First, ensure there's a space before the variable replacement if needed
    const ensureSpacedText = customText
      .replace(/([^\s])\{userCount\}/g, '$1 {userCount}')  // Add space before {userCount} if no space exists
      .replace(/\{userCount\}([^\s])/g, '{userCount} $1')  // Add space after {userCount} if no space exists
      .replace(/([^\s])\{brandName\}/g, '$1 {brandName}')  // Add space before {brandName} if no space exists
      .replace(/\{brandName\}([^\s])/g, '{brandName} $1');  // Add space after {brandName} if no space exists
    
    // For Liquid output, we need to use proper Liquid variable syntax
    return ensureSpacedText
      .replace(/\{userCount\}/g, "{{ section.settings.user_count }}")
      .replace(/\{brandName\}/g, "{{ section.settings.brand_name }}");
  };

  // Help tooltip component
  const HelpTooltip = ({ text }: { text: string }) => {
    return (
      <div className="relative inline-block">
        <div className="text-gray-400 cursor-help ml-1 group">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-3a1 1 0 0 0-.867.5 1 1 0 1 1-1.731-1A3 3 0 0 1 13 8a3.001 3.001 0 0 1-2 2.83V11a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1 1 1 0 1 0 0-2Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          <div className="absolute -top-1 left-6 w-48 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-10">
            {text}
          </div>
        </div>
      </div>
    );
  };

  const settings = (
    <div className="space-y-6">
      {/* Style Templates */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold mb-3 text-[#1c2838]">Vordefinierter Stil</h3>
        <div className="grid grid-cols-3 gap-2">
          {styleTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => applyStyleTemplate(index)}
              className={`border rounded p-3 h-16 flex items-center justify-center text-xs transition
                ${selectedStyle === index ? 'border-[#1c2838] shadow-sm bg-[#1c2838]/5' : 'border-gray-200 hover:bg-gray-50'}`}
              style={{ 
                backgroundColor: selectedStyle === index ? backgroundColor : template.backgroundColor,
                color: selectedStyle === index ? textColor : (index === 1 ? '#fff' : '#000'),
                borderRadius: selectedStyle === index ? borderRadius : template.borderRadius
              }}
            >
              Style {index + 1}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Wähle einen vordefinierten Stil als Ausgangspunkt für deine Anpassungen.</p>
      </div>
      
      {/* Avatar Count Selection */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold mb-3 text-[#1c2838]">Avatar-Anzahl</h3>
        <div className="space-y-2">
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setAvatarCount(1)}
              className={`px-3 py-1.5 rounded text-xs flex-1 ${avatarCount === 1 ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              1 Avatar
            </button>
            <button
              onClick={() => setAvatarCount(2)}
              className={`px-3 py-1.5 rounded text-xs flex-1 ${avatarCount === 2 ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              2 Avatare
            </button>
            <button
              onClick={() => setAvatarCount(3)}
              className={`px-3 py-1.5 rounded text-xs flex-1 ${avatarCount === 3 ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              3 Avatare
            </button>
            <button
              onClick={() => setAvatarCount(0)}
              className={`px-3 py-1.5 rounded text-xs flex-1 ${avatarCount === 0 ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Keine
            </button>
          </div>
          <p className="text-xs text-gray-500">Wähle, wie viele Avatare angezeigt werden sollen.</p>
        </div>
      </div>
      
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
                className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                disabled={avatarCount === 0}
              />
            </label>
            
            <label className="block text-sm text-[#1c2838]">
              Name 2:
              <input
                type="text"
                value={firstName2}
                onChange={(e) => setFirstName2(e.target.value)}
                className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                disabled={avatarCount < 2}
              />
            </label>
          </div>
          
          {avatarCount > 2 && (
            <div className="grid grid-cols-1 gap-3">
              <label className="block text-sm text-[#1c2838]">
                Name 3:
                <input
                  type="text"
                  value={firstName3}
                  onChange={(e) => setFirstName3(e.target.value)}
                  className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                />
              </label>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm text-[#1c2838]">
              Benutzeranzahl:
              <input
                type="text"
                value={userCount}
                onChange={(e) => setUserCount(e.target.value)}
                className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
              />
            </label>
            
            <label className="block text-sm text-[#1c2838]">
              Markenname:
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
              />
            </label>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <label className="block text-sm text-[#1c2838]">
              <div className="flex items-center">
                Benutzerdefinierter Text:
                <HelpTooltip text="Verwende {userCount} und {brandName} als Platzhalter für die entsprechenden Werte." />
              </div>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                placeholder=" und {userCount} andere sind begeistert von {brandName}"
              />
            </label>
          </div>
        </div>
      </div>
      
      {/* Images */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold mb-3 text-[#1c2838]">Bilder</h3>
        <div className="space-y-4">
          {avatarCount >= 1 && (
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
                    className="w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
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
          )}
          
          {avatarCount >= 2 && (
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
                    className="w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
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
          )}
          
          {avatarCount >= 3 && (
            <label className="block text-sm text-[#1c2838]">
              Avatar 3:
              <div className="mt-1 flex items-center space-x-2">
                {avatarImage3 && (
                  <div className="w-10 h-10 border rounded-full overflow-hidden bg-white">
                    <img
                      src={avatarImage3}
                      alt="Avatar 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="text"
                    value={avatarImage3}
                    onChange={(e) => setAvatarImage3(e.target.value)}
                    className="w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                    placeholder="URL des Avatarbildes 3"
                  />
                </div>
                <ImageManager
                  onSelect={setAvatarImage3}
                  currentImage={avatarImage3}
                  buttonText="Bild wählen"
                />
              </div>
            </label>
          )}
          
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
                  className="w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
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
                className="w-full accent-[#1c2838]"
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
                className="w-full accent-[#1c2838]"
              />
              <span className="ml-2 text-xs text-gray-500 w-12">{borderRadius}</span>
            </div>
          </label>
          
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBreakOnLarge}
                    onChange={(e) => setShowBreakOnLarge(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1c2838]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1c2838]"></div>
                  <span className="ml-2 text-sm text-gray-600">Markenname umbrechen</span>
                </label>
                <HelpTooltip text="Bricht den Markennamen auf großen Bildschirmen in eine neue Zeile um." />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={singleLine}
                    onChange={(e) => setSingleLine(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1c2838]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1c2838]"></div>
                  <span className="ml-2 text-sm text-gray-600">Einzeilig anzeigen</span>
                </label>
                <HelpTooltip text="Zeigt den gesamten Text in einer Zeile an, statt umzubrechen." />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced Settings - Padding with visual UI */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-[#1c2838]">Innenabstand (Padding)</h3>
        
        <div className="flex gap-3 mb-3">
          <button
            onClick={() => setUseSinglePadding(true)}
            className={`px-3 py-1.5 rounded text-xs flex-1 ${useSinglePadding ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Einfach
          </button>
          <button
            onClick={() => setUseSinglePadding(false)}
            className={`px-3 py-1.5 rounded text-xs flex-1 ${!useSinglePadding ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Individuell
          </button>
        </div>
        
        {useSinglePadding ? (
          <div className="space-y-2">
            <label className="block text-sm text-[#1c2838]">
              Einheitlicher Abstand:
              <input
                type="text"
                value={padding.toString().replace('px', '')}
                onChange={(e) => {
                  const value = e.target.value;
                  setPadding(value);
                }}
                className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                placeholder="15"
              />
              <p className="text-xs text-gray-500 mt-1">Gib einen Wert ein (z.B. 15)</p>
            </label>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 relative hover:border-[#1c2838]/30 transition">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-2/3 h-2/3 border-2 border-dashed border-[#1c2838]/20 rounded flex items-center justify-center bg-white/80">
                  <span className="text-xs text-[#1c2838]/70 font-medium">Inhalt</span>
                </div>
              </div>
              
              {/* Top padding input */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                <div className="text-[10px] text-gray-500 mb-1">oben</div>
                <input
                  type="text"
                  value={paddingTop}
                  onChange={(e) => setPaddingTop(e.target.value)}
                  className="w-12 h-6 text-xs border border-gray-300 text-center rounded focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                />
              </div>
              
              {/* Right padding input */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                <div className="text-[10px] text-gray-500 mr-1">rechts</div>
                <input
                  type="text"
                  value={paddingRight}
                  onChange={(e) => setPaddingRight(e.target.value)}
                  className="w-12 h-6 text-xs border border-gray-300 text-center rounded focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                />
              </div>
              
              {/* Bottom padding input */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                <input
                  type="text"
                  value={paddingBottom}
                  onChange={(e) => setPaddingBottom(e.target.value)}
                  className="w-12 h-6 text-xs border border-gray-300 text-center rounded focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                />
                <div className="text-[10px] text-gray-500 mt-1">unten</div>
              </div>
              
              {/* Left padding input */}
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center">
                <input
                  type="text"
                  value={paddingLeft}
                  onChange={(e) => setPaddingLeft(e.target.value)}
                  className="w-12 h-6 text-xs border border-gray-300 text-center rounded focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                />
                <div className="text-[10px] text-gray-500 ml-1">links</div>
              </div>
              
              <div className="h-40"></div>
            </div>
            <p className="text-xs text-gray-500">Gib für jede Seite den gewünschten Abstand ein.</p>
          </div>
        )}
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
          padding: getEffectivePadding(),
          borderRadius: borderRadius,
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '12px',
          color: textColor,
          maxWidth: '100%',
          fontWeight: '500'
        }}
      >
        {avatarCount > 0 && (
          <div 
            className="user-avatars-proof" 
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {avatarCount >= 1 && (
              <img 
                src={avatarImage1}
                alt="User 1" 
                className="avatar-proof" 
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: '50%',
                  marginRight: avatarCount > 1 ? '-8px' : '0',
                  border: `2px solid ${avatarBorderColor}`,
                  objectFit: 'cover',
                  zIndex: 3,
                  flexShrink: 0
                }}
              />
            )}
            {avatarCount >= 2 && (
              <img 
                src={avatarImage2}
                alt="User 2" 
                className="avatar-proof" 
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: '50%',
                  marginRight: avatarCount >= 3 ? '-8px' : '0',
                  border: `2px solid ${avatarBorderColor}`,
                  objectFit: 'cover',
                  zIndex: 2,
                  flexShrink: 0
                }}
              />
            )}
            {avatarCount >= 3 && (
              <img 
                src={avatarImage3}
                alt="User 3" 
                className="avatar-proof" 
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: '50%',
                  marginRight: '0',
                  border: `2px solid ${avatarBorderColor}`,
                  objectFit: 'cover',
                  zIndex: 1,
                  flexShrink: 0
                }}
              />
            )}
          </div>
        )}
        <div 
          className="user-text-proof" 
          style={{
            marginLeft: avatarCount > 0 ? '12px' : '0',
            lineHeight: '1.3',
            display: 'flex',
            flexWrap: singleLine ? 'nowrap' : 'wrap',
            alignItems: 'center',
            whiteSpace: singleLine ? 'nowrap' : 'normal'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '4px', flexShrink: 0 }}>
            <strong style={{ fontWeight: '600' }}>{getDisplayNames()}</strong>
            <img 
              src={verifiedImage}
              alt="Verifiziert" 
              className="verified-badge-proof" 
              style={{
                width: '16px',
                height: '16px',
                marginLeft: '4px',
                position: 'relative',
                top: '-1px',
                flexShrink: 0
              }}
            />
          </div>
          {showBreakOnLarge ? (
            // When line break is enabled, we need to split the text at the brand name
            <div
              style={{ 
                fontWeight: '400',
                display: 'flex',
                flexWrap: singleLine ? 'nowrap' : 'wrap',
                alignItems: 'center',
                width: '100%'
              }}
            >
              {/* First part of text before brand name */}
              <div dangerouslySetInnerHTML={{ 
                __html: getFormattedText().split(brandName)[0]
              }} />
              
              {/* Brand name with break before it */}
              <div style={{ width: '100%', display: 'block' }}>
                <div style={{ display: 'block', width: '100%', height: '4px' }}></div>
                <strong style={{ fontWeight: '600' }}>{brandName}</strong>
                {/* Second part of text after brand name */}
                <span dangerouslySetInnerHTML={{ 
                  __html: getFormattedText().split(brandName)[1] || ''
                }} />
              </div>
            </div>
          ) : (
            // Regular view without line break
            <span 
              style={{ 
                fontWeight: '400',
                display: 'flex',
                flexWrap: singleLine ? 'nowrap' : 'wrap',
                alignItems: 'center'
              }}
              dangerouslySetInnerHTML={{ 
                __html: getFormattedText()
              }}
            />
          )}
        </div>
      </div>
    </div>
  )

  const code = `{% comment %}
  Social Proof Box (BrandUp Builder)
{% endcomment %}

<div class="social-proof-box-proof">
  {% if section.settings.avatar_count > 0 %}
  <div class="user-avatars-proof">
    {% if section.settings.avatar_count >= 1 and section.settings.avatar_image_1 != blank %}
    <img src="{{ section.settings.avatar_image_1 | img_url: 'master' }}" alt="User 1" class="avatar-proof avatar-1">
    {% endif %}
    {% if section.settings.avatar_count >= 2 and section.settings.avatar_image_2 != blank %}
    <img src="{{ section.settings.avatar_image_2 | img_url: 'master' }}" alt="User 2" class="avatar-proof avatar-2">
    {% endif %}
    {% if section.settings.avatar_count >= 3 and section.settings.avatar_image_3 != blank %}
    <img src="{{ section.settings.avatar_image_3 | img_url: 'master' }}" alt="User 3" class="avatar-proof avatar-3">
    {% endif %}
  </div>
  {% endif %}
  <div class="user-text-proof{% if section.settings.single_line %} single-line{% endif %}">
    <div class="names-container">
      <strong class="user-names">
        {% if section.settings.avatar_count == 1 %}
          {{ section.settings.first_name_1 }}
        {% elsif section.settings.avatar_count == 2 %}
          {{ section.settings.first_name_1 }}, {{ section.settings.first_name_2 }}
        {% elsif section.settings.avatar_count == 3 %}
          {{ section.settings.first_name_1 }}, {{ section.settings.first_name_2 }}, {{ section.settings.first_name_3 }}
        {% else %}
          Nutzer
        {% endif %}
      </strong>
      <img src="{{ section.settings.verified_image | img_url: 'master' }}" alt="Verifiziert" class="verified-badge-proof">
    </div>
    <span class="user-count-text">
      {% assign text_parts = section.settings.custom_text | split: '{brandName}' %}
      {% if text_parts.size > 1 %}
        {% assign first_part = text_parts[0] | replace: '{userCount}', '<strong>' | append: section.settings.user_count | append: '</strong>' | replace: '  ', ' ' %}
        {% assign second_part = text_parts[1] | replace: '{userCount}', '<strong>' | append: section.settings.user_count | append: '</strong>' | replace: '  ', ' ' %}
        
        {{ first_part }}
        {% if section.settings.show_break_on_large %}
          <span class="line-break-desktop"></span>
          <span class="brand-name">{{ section.settings.brand_name }}</span>{{ second_part }}
        {% else %}
          <span class="brand-name">{{ section.settings.brand_name }}</span>{{ second_part }}
        {% endif %}
      {% else %}
        {{ section.settings.custom_text | replace: '{userCount}', '<strong>' | append: section.settings.user_count | append: '</strong>' | replace: '  ', ' ' }}
      {% endif %}
    </span>
  </div>
</div>

<style>
  .social-proof-box-proof {
    display: flex;
    align-items: center;
    background: ${backgroundColor};
    padding: ${getEffectivePadding()};
    border-radius: ${borderRadius};
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
    color: ${textColor};
  }
  .user-avatars-proof {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .avatar-proof {
    width: ${avatarSize};
    height: ${avatarSize};
    border-radius: 50%;
    border: 2px solid ${avatarBorderColor};
    object-fit: cover;
    flex-shrink: 0;
  }
  .avatar-1 {
    z-index: 3;
    margin-right: {% if section.settings.avatar_count > 1 %}-8px{% else %}0{% endif %};
  }
  .avatar-2 {
    z-index: 2;
    margin-right: {% if section.settings.avatar_count >= 3 %}-8px{% else %}0{% endif %};
  }
  .avatar-3 {
    z-index: 1;
  }
  .user-text-proof {
    margin-left: {% if section.settings.avatar_count > 0 %}12px{% else %}0{% endif %};
    line-height: 1.3;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .user-text-proof.single-line {
    flex-wrap: nowrap;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .names-container {
    display: flex;
    align-items: center;
    margin-right: 4px;
    flex-shrink: 0;
  }
  .user-names {
    font-weight: 600;
  }
  .user-count-text {
    font-weight: 400;
  }
  .user-count-text strong {
    font-weight: 600;
  }
  .verified-badge-proof {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    position: relative;
    top: -1px;
    flex-shrink: 0;
  }
  @media (min-width: 1300px) {
    {% if section.settings.show_break_on_large %}
    .user-count-text {
      display: block;
      width: 100%;
    }
    .line-break-desktop {
      display: block !important;
      content: '';
      height: 4px;
      width: 100%;
    }
    .brand-name {
      font-weight: 600;
      display: block;
    }
    {% else %}
    .line-break-desktop {
      display: inline-block !important;
      content: '';
      height: 0;
      width: 0;
    }
    .brand-name {
      font-weight: 600;
      display: inline;
    }
    {% endif %}
  }
</style>

{% schema %}
{
  "name": "Social Proof #1",
  "settings": [
    {
      "type": "select",
      "id": "style_template",
      "label": "Vordefinierter Stil",
      "options": [
        { "value": "0", "label": "Style 1 - Modern Light" },
        { "value": "1", "label": "Style 2 - Bold Dark" },
        { "value": "2", "label": "Style 3 - Soft Gradient" }
      ],
      "default": "${selectedStyle}"
    },
    {
      "type": "select",
      "id": "avatar_count",
      "label": "Anzahl Avatare",
      "options": [
        { "value": "0", "label": "Keine" },
        { "value": "1", "label": "1 Avatar" },
        { "value": "2", "label": "2 Avatare" },
        { "value": "3", "label": "3 Avatare" }
      ],
      "default": "${avatarCount}"
    },
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
      "id": "first_name_3",
      "label": "Name 3",
      "default": "${firstName3}"
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
      "type": "textarea",
      "id": "custom_text",
      "label": "Benutzerdefinierter Text",
      "info": "Verwende {userCount} und {brandName} als Platzhalter",
      "default": "${customText}"
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
      "id": "avatar_image_3",
      "label": "Avatar 3"
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
      "label": "Markenname umbrechen",
      "default": ${showBreakOnLarge}
    },
    {
      "type": "checkbox",
      "id": "single_line",
      "label": "Einzeilig anzeigen",
      "default": ${singleLine}
    },
    {
      "type": "text",
      "id": "padding",
      "label": "Padding",
      "info": "z.B. 15px oder 15px 20px 15px 20px",
      "default": "${getEffectivePadding()}"
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