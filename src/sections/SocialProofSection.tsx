'use client'

import { useState, useEffect } from 'react'
import RichTextEditor from '../components/RichTextEditor'

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
    showBadge?: boolean;
    badgePosition?: string;
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
    fontSizeDesktop?: string;
    fontSizeMobile?: string;
    brandNameBold?: boolean;
    useFullWidth?: boolean;
  };
  onDataChange?: (data: any) => void;
  previewDevice?: 'desktop' | 'tablet' | 'mobile';
  previewMode?: 'builder' | 'product';
  productUrl?: string;
  onPreviewModeChange?: (mode: 'builder' | 'product') => void;
  onProductUrlChange?: (url: string) => void;
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

export default function SocialProofSection({ 
  initialData, 
  onDataChange, 
  previewDevice: externalPreviewDevice,
  previewMode,
  productUrl,
  onPreviewModeChange,
  onProductUrlChange
}: SocialProofSectionProps) {
  // Ensure initialData is an object
  const safeInitialData = initialData || {};
  
  // Helper for range sliders - we don't prevent default to allow slider functionality
  const handleRangeInput = (e: React.MouseEvent) => {
    e.stopPropagation();  // Only stop propagation, not preventDefault
  };
  
  // Style template selection - force style 0 as default
  const [selectedStyle, setSelectedStyle] = useState<number>(0);
  
  // Section content
  const [firstName1, setFirstName1] = useState(safeInitialData.firstName1 || 'Steffi')
  const [firstName2, setFirstName2] = useState(safeInitialData.firstName2 || 'Daniela')
  const [firstName3, setFirstName3] = useState(safeInitialData.firstName3 || 'Maria')
  const [userCount, setUserCount] = useState(safeInitialData.userCount || '12.752')
  const [brandName, setBrandName] = useState(safeInitialData.brandName || 'Regenliebe')
  const [customText, setCustomText] = useState(safeInitialData.customText || 'und <strong>12.752</strong> andere sind begeistert von Regenliebe')
  const [avatarImage1, setAvatarImage1] = useState(safeInitialData.avatarImage1 || 'https://cdn.shopify.com/s/files/1/0818/2123/7577/files/Profil-2.jpg?v=1738073619')
  const [avatarImage2, setAvatarImage2] = useState(safeInitialData.avatarImage2 || 'https://cdn.shopify.com/s/files/1/0818/2123/7577/files/Profil-4.jpg?v=1738083098')
  const [avatarImage3, setAvatarImage3] = useState(safeInitialData.avatarImage3 || 'https://cdn.shopify.com/s/files/1/0818/2123/7577/files/Profil-1.jpg?v=1738073619')
  const [verifiedImage, setVerifiedImage] = useState(safeInitialData.verifiedImage || 'https://cdn.shopify.com/s/files/1/0818/2123/7577/files/insta-blue.png?v=1738073828')
  const [showBadge, setShowBadge] = useState(safeInitialData.showBadge !== undefined ? safeInitialData.showBadge : true)
  const [badgePosition, setBadgePosition] = useState(safeInitialData.badgePosition || 'standard')
  const [avatarCount, setAvatarCount] = useState(safeInitialData.avatarCount || 2)

  // Section styling - ensure defaults from style template 0
  const [backgroundColor, setBackgroundColor] = useState(styleTemplates[0].backgroundColor)
  const [avatarBorderColor, setAvatarBorderColor] = useState(styleTemplates[0].avatarBorderColor)
  const [textColor, setTextColor] = useState('#000000') // Force black as default
  const [showBreakOnLarge, setShowBreakOnLarge] = useState(safeInitialData.showBreakOnLarge !== undefined ? safeInitialData.showBreakOnLarge : true)
  const [avatarSize, setAvatarSize] = useState(safeInitialData.avatarSize || '32px')
  const [borderRadius, setBorderRadius] = useState(safeInitialData.borderRadius || styleTemplates[0].borderRadius)
  const [fontSizeDesktop, setFontSizeDesktop] = useState(safeInitialData.fontSizeDesktop || '12px')
  const [fontSizeMobile, setFontSizeMobile] = useState(safeInitialData.fontSizeMobile || '9px')
  const [brandNameBold, setBrandNameBold] = useState(safeInitialData.brandNameBold !== undefined ? safeInitialData.brandNameBold : true)
  const [useFullWidth, setUseFullWidth] = useState(safeInitialData.useFullWidth !== undefined ? safeInitialData.useFullWidth : true)
  
  // Padding settings
  const [useSinglePadding, setUseSinglePadding] = useState(true)
  const [padding, setPadding] = useState(safeInitialData.padding || styleTemplates[0].padding)
  const [paddingTop, setPaddingTop] = useState(safeInitialData.paddingTop || '15')
  const [paddingRight, setPaddingRight] = useState(safeInitialData.paddingRight || '15')
  const [paddingBottom, setPaddingBottom] = useState(safeInitialData.paddingBottom || '15')
  const [paddingLeft, setPaddingLeft] = useState(safeInitialData.paddingLeft || '15')
  
  // Preview device state - use external device if provided, otherwise internal state
  const [internalPreviewDevice, setInternalPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const previewDevice = externalPreviewDevice || internalPreviewDevice
  
  // Help popup state
  const [showImageHelp, setShowImageHelp] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  
  // Use external preview mode and product URL if provided
  const currentPreviewMode = previewMode || 'builder'
  const currentProductUrl = productUrl || ''
  
  
  // Helper function to get effective padding
  const getEffectivePadding = () => {
    if (useSinglePadding) {
      // Handle numeric padding without 'px'
      return padding.toString().includes('px') ? padding : `${padding}px`;
    } else {
      return `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`;
    }
  };
  
  // Helper function to get current font size based on selected device
  const getCurrentFontSize = () => {
    return previewDevice === 'mobile' ? fontSizeMobile : fontSizeDesktop;
  };
  
  // Apply style template
  const applyStyleTemplate = (e: React.MouseEvent, index: number) => {
    // Prevent default to avoid scrolling
    e.preventDefault();
    
    // Always update the style index
    setSelectedStyle(index);
    
    // Always apply the template styles when a style is selected
    const template = styleTemplates[index];
    setBackgroundColor(template.backgroundColor);
    setTextColor(index === 1 ? '#ffffff' : index === 2 ? '#0c4a6e' : '#000000');
    setAvatarBorderColor(template.avatarBorderColor);
    setBorderRadius(template.borderRadius);
    setPadding(template.padding);
    
    // Always update both single padding and individual padding values
    // This ensures consistent state across all padding-related variables
    const paddingValue = template.padding.replace('px', '');
    setPaddingTop(paddingValue);
    setPaddingRight(paddingValue);
    setPaddingBottom(paddingValue);
    setPaddingLeft(paddingValue);
    
    // Set single padding mode to ensure UI is consistent with selection
    setUseSinglePadding(true);
  };
  
  // Define sectionData object for reuse
  const sectionData = {
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
    showBadge,
    badgePosition,
    avatarBorderColor,
    textColor,
    showBreakOnLarge,
    avatarSize,
    borderRadius,
    padding: getEffectivePadding(),
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    avatarCount,
    customText,
    selectedStyle,
    fontSizeDesktop,
    fontSizeMobile,
    brandNameBold,
    useFullWidth
  };

  // Update parent component when data changes
  useEffect(() => {
    if (onDataChange) {
      // Always notify parent to handle the data
      onDataChange(sectionData);
    }
  }, [
    firstName1, firstName2, firstName3, userCount, brandName, customText,
    backgroundColor, avatarImage1, avatarImage2, avatarImage3, verifiedImage, showBadge, badgePosition,
    avatarBorderColor, textColor, showBreakOnLarge,
    avatarSize, borderRadius, padding, paddingTop, paddingRight,
    paddingBottom, paddingLeft, avatarCount, selectedStyle, 
    fontSizeDesktop, fontSizeMobile, brandNameBold, useFullWidth, onDataChange,
    previewDevice, internalPreviewDevice
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

  // Get names with badge based on position
  const getNamesWithBadge = (position: string, isMobile: boolean = false) => {
    const badgeSize = isMobile ? '13px' : '14px';
    const badgeElement = showBadge ? 
      `<img src="${verifiedImage}" alt="Verifiziert" style="height: ${badgeSize}; max-width: none; margin: 0 4px; vertical-align: baseline; transform: translateY(-1px); object-fit: contain; display: inline;" onerror="this.style.display='none'">` : 
      '<span style="margin: 0 1px;"> </span>';

    switch(avatarCount) {
      case 1:
        if (position === 'afterFirst') {
          return `${firstName1}${badgeElement}`;
        }
        return firstName1;
      case 2:
        if (position === 'afterFirst') {
          return `${firstName1}${badgeElement}, ${firstName2}`;
        }
        return `${firstName1}, ${firstName2}`;
      case 3:
        if (position === 'afterFirst') {
          return `${firstName1}${badgeElement}, ${firstName2}, ${firstName3}`;
        }
        return `${firstName1}, ${firstName2}, ${firstName3}`;
      default:
        if (position === 'afterFirst') {
          return `${firstName1}${badgeElement}, ${firstName2}`;
        }
        return `${firstName1}, ${firstName2}`;
    }
  };
  
  // Format the custom text for the preview
  const getFormattedText = () => {
    // Return HTML directly since we're now using contentEditable that produces HTML
    return customText;
  };
  
  // Einfache aber robuste Funktion für HTML-Text-Splitting
  const getTextSplit = (htmlText: string, wordsForSecondLine: number) => {
    try {
      // Extrahiere den reinen Text für Word-Counting
      const plainText = htmlText.replace(/<[^>]*>/g, '');
      const words = plainText.replace(/\s+/g, ' ').trim().split(/\s+/).filter(word => word.length > 0);
      
      if (words.length <= wordsForSecondLine) {
        return { firstPart: htmlText, lastPart: '' };
      }
      
      // Bestimme Split-Point
      const splitIndex = words.length - wordsForSecondLine;
      const firstPartWords = words.slice(0, splitIndex);
      const lastPartWords = words.slice(splitIndex);
      
      // Einfacher Ansatz: Suche nach den letzten Wörtern im HTML-String
      const lastWordsText = lastPartWords.join(' ');
      
      // Finde letztes Vorkommen der letzten Wörter
      let searchText = lastWordsText;
      let splitPosition = htmlText.lastIndexOf(searchText);
      
      // Falls nicht gefunden, versuche es mit dem letzten Wort
      if (splitPosition === -1 && lastPartWords.length > 0) {
        searchText = lastPartWords[lastPartWords.length - 1];
        splitPosition = htmlText.lastIndexOf(searchText);
      }
      
      if (splitPosition !== -1) {
        const firstPart = htmlText.substring(0, splitPosition).trim();
        const lastPart = htmlText.substring(splitPosition).trim();
        
        return {
          firstPart: firstPart,
          lastPart: lastPart
        };
      }
      
      // Fallback: Split nach Plain-Text
      const firstPartText = firstPartWords.join(' ');
      const lastPartText = lastPartWords.join(' ');
      
      return {
        firstPart: firstPartText,
        lastPart: lastPartText
      };
      
    } catch (error) {
      console.error('Error in getTextSplit:', error);
      return { firstPart: htmlText, lastPart: '' };
    }
  };
  
  // Format the text for Shopify Liquid (used in code export)
  const getLiquidFormattedText = () => {
    return customText;
  };
  
  // Different code output types
  const [codeOutputType, setCodeOutputType] = useState<'standalone'>('standalone');

  // Help tooltip component
  const HelpTooltip = ({ text }: { text: string }) => {
    return (
      <div className="relative inline-block">
        <div className="text-gray-400 cursor-help ml-1 group">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.06-1.06 2.5 2.5 0 0 1 3.536 0A.75.75 0 0 1 10.354 6.94 1 1 0 0 0 9.75 6.75a1 1 0 0 0-.81.31Zm-3.24 7.9a.75.75 0 1 0 1.06 1.06l4.25-4.25a.75.75 0 1 0-1.06-1.06L6.33 14.44 5.56 13.7a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l1.2 1.2a.75.75 0 0 0 1.06 0Z" clipRule="evenodd" />
          </svg>
          <div className="absolute -top-1 left-6 w-48 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-10">
            {text}
          </div>
        </div>
      </div>
    );
  };

  // Image Upload Help Modal
  const ImageHelpModal = () => {
    if (!showImageHelp) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-200">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Wie lade ich Bilder in Shopify hoch?
              </h3>
              <button
                onClick={() => setShowImageHelp(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 text-sm text-gray-700">
              <p className="text-base">
                So lädst du deine eigenen Bilder in Shopify hoch und erhältst die Links:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="font-medium">Gehe zu "Inhalte" → "Dateien"</p>
                    <p className="text-gray-600">Logge dich in dein Shopify Admin ein und navigiere im Hauptmenü zu "Inhalte" und dann zu "Dateien".</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="font-medium">Lade dein Bild hoch</p>
                    <p className="text-gray-600">Klicke auf "Dateien hochladen" und wähle dein Bild aus. Warte bis der Upload abgeschlossen ist.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="font-medium">Kopiere den Link</p>
                    <p className="text-gray-600">Klicke auf dein hochgeladenes Bild und kopiere die URL aus der Adressleiste oder verwende den "Link kopieren" Button.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">4</div>
                  <div>
                    <p className="font-medium">Füge den Link hier ein</p>
                    <p className="text-gray-600">Füge die kopierte URL in das entsprechende Eingabefeld hier im Builder ein.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-blue-800 font-medium mb-2">💡 Tipp:</p>
                <p className="text-blue-700 text-sm">
                  Die URL sollte etwa so aussehen: <code className="bg-blue-100 px-1 rounded text-xs">https://cdn.shopify.com/s/files/1/.../dein-bild.jpg</code>
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium mb-2">⚠️ Wichtig:</p>
                <p className="text-yellow-700 text-sm">
                  Verwende für Avatar-Bilder am besten quadratische Bilder (1:1 Seitenverhältnis) für die beste Darstellung.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowImageHelp(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Verstanden
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tutorial Modal
  const TutorialModal = () => {
    if (!showTutorial) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowTutorial(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header mit Gradient */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 rounded-t-2xl">
              <div className="absolute inset-0 bg-black/10 rounded-t-2xl"></div>
              <div className="relative flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    Social Proof Builder
                  </h3>
                  <p className="text-indigo-100 text-lg">Schritt-für-Schritt zur perfekten Conversion</p>
                </div>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-full p-2 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">+34%</div>
                  <div className="text-sm text-gray-600">Höhere Conversion</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">5 Min</div>
                  <div className="text-sm text-gray-600">Setup Zeit</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-1">100%</div>
                  <div className="text-sm text-gray-600">Mobile Ready</div>
                </div>
              </div>

              {/* Quick Start */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 mb-8 border border-emerald-200">
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 rounded-full p-3">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-emerald-900 mb-3">Quick Start - In 3 Schritten fertig</h4>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-xl p-4 border border-emerald-200">
                        <div className="bg-emerald-100 text-emerald-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mb-3">1</div>
                        <h5 className="font-semibold text-emerald-900 mb-2">Stil wählen</h5>
                        <p className="text-sm text-emerald-700">Wähle einen der 3 vordefinierten Designs aus</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-emerald-200">
                        <div className="bg-emerald-100 text-emerald-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mb-3">2</div>
                        <h5 className="font-semibold text-emerald-900 mb-2">Inhalte anpassen</h5>
                        <p className="text-sm text-emerald-700">Namen, Zahlen und Text personalisieren</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-emerald-200">
                        <div className="bg-emerald-100 text-emerald-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mb-3">3</div>
                        <h5 className="font-semibold text-emerald-900 mb-2">Code kopieren</h5>
                        <p className="text-sm text-emerald-700">Fertigen Code in Shopify einfügen - Done!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-blue-900">Smart Responsive</h4>
                  </div>
                  <p className="text-blue-700 mb-4">Automatische Anpassung für Desktop und Mobile mit unterschiedlichen Layouts und Schriftgrößen.</p>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-blue-600 font-medium mb-2">Live Preview:</div>
                    <div className="space-y-2">
                      <div className="bg-blue-100 rounded p-2 text-xs">Desktop: Elegante 2-Zeilen Aufteilung</div>
                      <div className="bg-blue-100 rounded p-2 text-xs">Mobile: Kompakte 3-Wörter Struktur</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 rounded-full p-2 mr-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-purple-900">Flexibles Badge System</h4>
                  </div>
                  <p className="text-purple-700 mb-4">Verifizierungsbadge an 3 verschiedenen Positionen - für maximale Wirkung und Design-Flexibilität.</p>
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg p-2 border border-purple-200 text-xs">
                      <span className="font-medium">Standard:</span> Nach allen Namen
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-purple-200 text-xs">
                      <span className="font-medium">Prominent:</span> Nach erstem Namen
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-purple-200 text-xs">
                      <span className="font-medium">Elegant:</span> Über dem Avatar
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Tips */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
                <h4 className="text-2xl font-bold text-amber-900 mb-6 flex items-center">
                  <svg className="w-8 h-8 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Pro-Tipps für maximale Conversion
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl p-4 border border-amber-200">
                    <div className="text-2xl mb-3">🎯</div>
                    <h5 className="font-semibold text-amber-900 mb-2">Echte Zahlen</h5>
                    <p className="text-sm text-amber-700">Verwende echte Analytics-Daten für authentische Zahlen</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-amber-200">
                    <div className="text-2xl mb-3">📍</div>
                    <h5 className="font-semibold text-amber-900 mb-2">Beste Position</h5>
                    <p className="text-sm text-amber-700">Direkt über dem "In den Warenkorb" Button platzieren</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-amber-200">
                    <div className="text-2xl mb-3">🔄</div>
                    <h5 className="font-semibold text-amber-900 mb-2">A/B Testing</h5>
                    <p className="text-sm text-amber-700">Teste verschiedene Texte und Avatar-Anzahlen</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-amber-200">
                    <div className="text-2xl mb-3">⚡</div>
                    <h5 className="font-semibold text-amber-900 mb-2">Performance</h5>
                    <p className="text-sm text-amber-700">Optimiert für beste Ladezeiten und SEO</p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8 text-center bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Bereit für mehr Conversions? 🚀</h4>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Starte jetzt mit der Erstellung deiner Social Proof Box und sieh zu, wie deine Verkäufe durch die Decke gehen!
                </p>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-lg transform hover:scale-105"
                >
                  ✨ Jetzt Social Proof erstellen
                </button>
              </div>
            </div>
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
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); applyStyleTemplate(e, index); }}
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
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAvatarCount(1); }}
              className={`px-3 py-1.5 rounded text-xs flex-1 ${avatarCount === 1 ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              1 Avatar
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAvatarCount(2); }}
              className={`px-3 py-1.5 rounded text-xs flex-1 ${avatarCount === 2 ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              2 Avatare
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAvatarCount(3); }}
              className={`px-3 py-1.5 rounded text-xs flex-1 ${avatarCount === 3 ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              3 Avatare
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAvatarCount(0); }}
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
          {avatarCount > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm text-[#1c2838]">
                Name 1:
                <input
                  type="text"
                  value={firstName1}
                  onChange={(e) => setFirstName1(e.target.value)}
                  className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                />
              </label>
              
              {avatarCount >= 2 && (
                <label className="block text-sm text-[#1c2838]">
                  Name 2:
                  <input
                    type="text"
                    value={firstName2}
                    onChange={(e) => setFirstName2(e.target.value)}
                    className="mt-1 w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                  />
                </label>
              )}
            </div>
          )}
          
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
          
          <div className="grid grid-cols-1 gap-3">
            <label className="block text-sm text-[#1c2838]">
              <div className="flex items-center">
                <span>Text:</span>
              </div>
              
              {/* Rich Text Editor */}
              <div className="mt-1">
                <RichTextEditor
                  content={customText}
                  onChange={setCustomText}
                  placeholder="z.B. und 12.752 andere sind begeistert von Regenliebe"
                  className="w-full"
                />
                
                <p className="text-xs text-gray-500 mt-2">
                  💡 <strong>Tipp:</strong> Wähle Text aus und nutze die Toolbar für <strong>fett</strong>, <em>kursiv</em> oder <u>unterstrichen</u>.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
      
      {/* Images */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#1c2838]">Bilder</h3>
          <button
            onClick={() => setShowImageHelp(true)}
            className="text-blue-600 hover:text-blue-800 text-xs flex items-center space-x-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Wie lade ich Bilder hoch?</span>
          </button>
        </div>
        <div className="space-y-4">
          {avatarCount >= 1 && (
            <label className="block text-sm text-[#1c2838]">
              Avatar 1:
              <div className="mt-1 flex items-center space-x-2">
                {avatarImage1 && (
                  <div className="w-10 h-10 border rounded-full overflow-hidden bg-white flex-shrink-0">
                    <img
                      src={avatarImage1}
                      alt="Avatar 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="text"
                  value={avatarImage1}
                  onChange={(e) => setAvatarImage1(e.target.value)}
                  className="flex-1 border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                  placeholder="https://cdn.shopify.com/s/files/1/.../avatar1.jpg"
                />
              </div>
            </label>
          )}
          
          {avatarCount >= 2 && (
            <label className="block text-sm text-[#1c2838]">
              Avatar 2:
              <div className="mt-1 flex items-center space-x-2">
                {avatarImage2 && (
                  <div className="w-10 h-10 border rounded-full overflow-hidden bg-white flex-shrink-0">
                    <img
                      src={avatarImage2}
                      alt="Avatar 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="text"
                  value={avatarImage2}
                  onChange={(e) => setAvatarImage2(e.target.value)}
                  className="flex-1 border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                  placeholder="https://cdn.shopify.com/s/files/1/.../avatar2.jpg"
                />
              </div>
            </label>
          )}
          
          {avatarCount >= 3 && (
            <label className="block text-sm text-[#1c2838]">
              Avatar 3:
              <div className="mt-1 flex items-center space-x-2">
                {avatarImage3 && (
                  <div className="w-10 h-10 border rounded-full overflow-hidden bg-white flex-shrink-0">
                    <img
                      src={avatarImage3}
                      alt="Avatar 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="text"
                  value={avatarImage3}
                  onChange={(e) => setAvatarImage3(e.target.value)}
                  className="flex-1 border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                  placeholder="https://cdn.shopify.com/s/files/1/.../avatar3.jpg"
                />
              </div>
            </label>
          )}
          
        </div>
      </div>
      
      {/* Badge Settings */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold mb-3 text-[#1c2838]">Verifizierungsbadge</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowBadge(!showBadge); }}
                className="flex items-center cursor-pointer bg-transparent border-none p-0 m-0 focus:outline-none"
              >
                <div className={`relative w-9 h-5 ${showBadge ? 'bg-[#1c2838]' : 'bg-gray-200'} rounded-full transition-colors`}>
                  <div className={`absolute top-[2px] ${showBadge ? 'right-[2px] translate-x-0' : 'left-[2px] translate-x-0'} bg-white border rounded-full h-4 w-4 transition-all`}></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">Badge anzeigen</span>
              </button>
              <HelpTooltip text="Zeigt oder verbirgt das Verifizierungsbadge." />
            </div>
          </div>
          
          {showBadge && (
            <div className="space-y-3">
              <label className="block text-sm text-[#1c2838]">
                Badge-Position:
                <div className="mt-1 grid grid-cols-1 gap-2">
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBadgePosition('standard'); }}
                    className={`px-3 py-2 rounded text-xs text-left ${badgePosition === 'standard' ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <div className="font-medium">Standard</div>
                    <div className="text-xs opacity-75">Nach allen Namen</div>
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBadgePosition('afterFirst'); }}
                    className={`px-3 py-2 rounded text-xs text-left ${badgePosition === 'afterFirst' ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <div className="font-medium">Nach erstem Namen</div>
                    <div className="text-xs opacity-75">Direkt nach dem ersten Namen</div>
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBadgePosition('overAvatar'); }}
                    className={`px-3 py-2 rounded text-xs text-left ${badgePosition === 'overAvatar' ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <div className="font-medium">Über Avatar</div>
                    <div className="text-xs opacity-75">Rechts oben über dem 2. Avatar</div>
                  </button>
                </div>
              </label>
              
              <label className="block text-sm text-[#1c2838]">
                Badge-Bild:
                <div className="mt-1 flex items-center space-x-2">
                  {verifiedImage && (
                    <div className="w-6 h-6 border rounded overflow-hidden bg-white flex-shrink-0">
                      <img
                        src={verifiedImage}
                        alt="Verifizierungsbadge"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    value={verifiedImage}
                    onChange={(e) => setVerifiedImage(e.target.value)}
                    className="flex-1 border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                    placeholder="https://cdn.shopify.com/s/files/1/.../badge.png"
                  />
                </div>
              </label>
            </div>
          )}
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
                onClick={handleRangeInput}
                onMouseMove={handleRangeInput}
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
                onClick={handleRangeInput}
                onMouseMove={handleRangeInput}
                className="w-full accent-[#1c2838]"
              />
              <span className="ml-2 text-xs text-gray-500 w-12">{borderRadius}</span>
            </div>
          </label>
          
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBrandNameBold(!brandNameBold); }}
                  className="flex items-center cursor-pointer bg-transparent border-none p-0 m-0 focus:outline-none"
                >
                  <div className={`relative w-9 h-5 ${brandNameBold ? 'bg-[#1c2838]' : 'bg-gray-200'} rounded-full transition-colors`}>
                    <div className={`absolute top-[2px] ${brandNameBold ? 'right-[2px] translate-x-0' : 'left-[2px] translate-x-0'} bg-white border rounded-full h-4 w-4 transition-all`}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">Markenname fett</span>
                </button>
                <HelpTooltip text="Stellt den Markennamen fett dar." />
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setUseFullWidth(!useFullWidth); }}
                  className="flex items-center cursor-pointer bg-transparent border-none p-0 m-0 focus:outline-none"
                >
                  <div className={`relative w-9 h-5 ${useFullWidth ? 'bg-[#1c2838]' : 'bg-gray-200'} rounded-full transition-colors`}>
                    <div className={`absolute top-[2px] ${useFullWidth ? 'right-[2px] translate-x-0' : 'left-[2px] translate-x-0'} bg-white border rounded-full h-4 w-4 transition-all`}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">Volle Breite</span>
                </button>
                <HelpTooltip text="Nutzt die komplette verfügbare Breite oder passt die Größe an den Inhalt an." />
              </div>
            </div>
          </div>
          
          {/* Font Size Controls */}
          <div className="space-y-3 mt-4">
            <label className="block text-sm text-[#1c2838]">
              Schriftgröße (Desktop):
              <div className="flex items-center mt-1">
                <input
                  type="range"
                  min="10"
                  max="20"
                  step="1"
                  value={fontSizeDesktop.replace('px', '')}
                  onChange={(e) => setFontSizeDesktop(`${e.target.value}px`)}
                  onClick={handleRangeInput}
                  onMouseMove={handleRangeInput}
                  className="w-full accent-[#1c2838]"
                />
                <span className="ml-2 text-xs text-gray-500 w-12">{fontSizeDesktop}</span>
              </div>
            </label>
            
            <label className="block text-sm text-[#1c2838]">
              Schriftgröße (Mobil):
              <div className="flex items-center mt-1">
                <input
                  type="range"
                  min="8"
                  max="18"
                  step="1"
                  value={fontSizeMobile.replace('px', '')}
                  onChange={(e) => setFontSizeMobile(`${e.target.value}px`)}
                  onClick={handleRangeInput}
                  onMouseMove={handleRangeInput}
                  className="w-full accent-[#1c2838]"
                />
                <span className="ml-2 text-xs text-gray-500 w-12">{fontSizeMobile}</span>
              </div>
            </label>
          </div>
        </div>
      </div>
      
      {/* Advanced Settings - Padding with visual UI */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-[#1c2838]">Innenabstand (Padding)</h3>
        
        <div className="flex gap-3 mb-3">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setUseSinglePadding(true); }}
            className={`px-3 py-1.5 rounded text-xs flex-1 ${useSinglePadding ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Einfach
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setUseSinglePadding(false); }}
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

  // Remove all formatting functions since we're not using them anymore
  
  // Update preview on device change (only used when no external device is provided)
  const handleDeviceChange = (device: 'desktop' | 'tablet' | 'mobile') => {
    setInternalPreviewDevice(device);
  };
  
  // Generate HTML for preview with forced refresh key
  const generatePreviewHTML = () => {
    const currentFontSize = previewDevice === 'mobile' ? fontSizeMobile : fontSizeDesktop;
    const currentBadgeSize = previewDevice === 'mobile' ? '13px' : '14px';
    
    // Helper für Mobile (3 Wörter)
    const getMobileSplit = () => getTextSplit(customText, 3);
    
    // Helper für Desktop (2 Wörter)  
    const getDesktopSplit = () => getTextSplit(customText, 2);
    
    return `
      <div style="display: flex; align-items: center; background-color: ${backgroundColor}; padding: ${getEffectivePadding()}; border-radius: ${borderRadius}; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 12px; color: ${textColor}; font-weight: 500; width: ${useFullWidth ? '100%' : 'fit-content'}; max-width: 100%; box-sizing: border-box; font-size: ${currentFontSize};">
        ${avatarCount > 0 ? `
        <div style="display: flex; align-items: center; flex-shrink: 0;">
          ${avatarCount >= 1 ? `<img src="${avatarImage1}" alt="User 1" style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; border: 2px solid ${avatarBorderColor}; object-fit: cover; flex-shrink: 0; z-index: 3; margin-right: ${avatarCount > 1 ? '-8px' : '0'};" onerror="this.style.display='none'">` : ''}
          ${avatarCount >= 2 ? `<img src="${avatarImage2}" alt="User 2" style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; border: 2px solid ${avatarBorderColor}; object-fit: cover; flex-shrink: 0; z-index: 2; margin-right: ${avatarCount >= 3 ? '-8px' : '0'};" onerror="this.style.display='none'">` : ''}
          ${avatarCount >= 3 ? `<img src="${avatarImage3}" alt="User 3" style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; border: 2px solid ${avatarBorderColor}; object-fit: cover; flex-shrink: 0; z-index: 1;" onerror="this.style.display='none'">` : ''}
        </div>` : ''}
        
        <!-- Mobile layout: 3 words on second line -->
        <div style="margin-left: ${avatarCount > 0 ? '12px' : '0'}; line-height: 1.4; display: ${previewDevice === 'mobile' ? 'block' : 'none'}; width: 100%;">
          <div style="display: block; width: 100%; margin-bottom: 2px;">
            <strong style="display: inline; font-weight: 600;">${getDisplayNames()}</strong>
${showBadge ? `<img src="${verifiedImage}" alt="Verifiziert" style="height: ${currentBadgeSize}; max-width: none; margin: 0 4px; vertical-align: baseline; transform: translateY(-1px); object-fit: contain; display: inline;" onerror="this.style.display='none'">` : '<span style="margin: 0 1px;"> </span>'}
            <span style="font-weight: 400; word-spacing: 0.1em; letter-spacing: 0.01em; display: inline;">${getMobileSplit().firstPart}</span>
          </div>
          <div style="display: block; width: 100%;">
            <span style="font-weight: 400; word-spacing: 0.1em; letter-spacing: 0.01em;">${getMobileSplit().lastPart}</span>
          </div>
        </div>
        
        <!-- Desktop layout: 2 words on second line -->
        <div style="margin-left: ${avatarCount > 0 ? '12px' : '0'}; line-height: 1.4; display: ${previewDevice === 'desktop' ? 'block' : 'none'}; width: 100%;">
          <div style="display: block; width: 100%; margin-bottom: 2px;">
            <strong style="display: inline; font-weight: 600;">${getDisplayNames()}</strong>
${showBadge ? `<img src="${verifiedImage}" alt="Verifiziert" style="height: ${currentBadgeSize}; max-width: none; margin: 0 4px; vertical-align: baseline; transform: translateY(-1px); object-fit: contain; display: inline;" onerror="this.style.display='none'">` : '<span style="margin: 0 1px;"> </span>'}
            <span style="font-weight: 400; word-spacing: 0.1em; letter-spacing: 0.01em; display: inline;">${getDesktopSplit().firstPart}</span>
          </div>
          <div style="display: block; width: 100%;">
            <span style="font-weight: 400; word-spacing: 0.1em; letter-spacing: 0.01em;">${getDesktopSplit().lastPart}</span>
          </div>
        </div>
      </div>
    `;
  };

  // Enhanced Preview with Product Integration and Simple Mobile Simulation
  const preview = (
    <div className="w-full h-full flex flex-col p-4" style={{ backgroundColor: 'white', minHeight: '200px' }}>
      {currentPreviewMode === 'product' && (
        <div className="mb-4">
          <input
            type="text"
            value={currentProductUrl}
            onChange={(e) => onProductUrlChange && onProductUrlChange(e.target.value)}
            placeholder="https://dein-shop.myshopify.com/products/produkt-name"
            className="w-full border px-3 py-2 rounded-md text-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Gib deine Shopify Produktseiten-URL ein um zu sehen, wie die Section dort aussieht</p>
        </div>
      )}

      {currentPreviewMode === 'builder' ? (
        // Simple Builder Preview with Working Mobile Simulation
        <div className="flex-1">
          <div 
            className="social-proof-preview-container"
            style={{
              width: '100%',
              transition: 'all 0.3s ease',
              maxWidth: previewDevice === 'mobile' ? '375px' : '100%',
              margin: previewDevice === 'mobile' ? '0 auto' : '0',
            }}
          >
            <div 
              className="social-proof-preview"
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor,
                padding: getEffectivePadding(),
                borderRadius,
                fontFamily: 'Arial, sans-serif',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                marginBottom: '12px',
                color: textColor,
                fontWeight: 500,
                width: useFullWidth ? '100%' : 'fit-content',
                maxWidth: '100%',
                boxSizing: 'border-box',
                fontSize: previewDevice === 'mobile' ? fontSizeMobile : fontSizeDesktop,
              }}
            >
              {avatarCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, position: 'relative' }}>
                  {avatarCount >= 1 && (
                    <img 
                      src={avatarImage1} 
                      alt="User 1" 
                      style={{
                        width: avatarSize,
                        height: avatarSize,
                        borderRadius: '50%',
                        border: `2px solid ${avatarBorderColor}`,
                        objectFit: 'cover',
                        flexShrink: 0,
                        zIndex: 3,
                        marginRight: avatarCount > 1 ? '-8px' : '0'
                      }}
                    />
                  )}
                  {avatarCount >= 2 && (
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={avatarImage2} 
                        alt="User 2" 
                        style={{
                          width: avatarSize,
                          height: avatarSize,
                          borderRadius: '50%',
                          border: `2px solid ${avatarBorderColor}`,
                          objectFit: 'cover',
                          flexShrink: 0,
                          zIndex: 2,
                          marginRight: avatarCount >= 3 ? '-8px' : '0'
                        }}
                      />
                      {badgePosition === 'overAvatar' && showBadge && (
                        <img 
                          src={verifiedImage} 
                          alt="Verifiziert" 
                          style={{
                            position: 'absolute',
                            top: '-4px',
                            right: avatarCount >= 3 ? '4px' : '8px',
                            height: previewDevice === 'mobile' ? '16px' : '18px',
                            width: 'auto',
                            zIndex: 10,
                            objectFit: 'contain'
                          }}
                        />
                      )}
                    </div>
                  )}
                  {avatarCount >= 3 && (
                    <img 
                      src={avatarImage3} 
                      alt="User 3" 
                      style={{
                        width: avatarSize,
                        height: avatarSize,
                        borderRadius: '50%',
                        border: `2px solid ${avatarBorderColor}`,
                        objectFit: 'cover',
                        flexShrink: 0,
                        zIndex: 1
                      }}
                    />
                  )}
                </div>
              )}
              
              <div style={{ marginLeft: avatarCount > 0 ? '12px' : '0', lineHeight: 1.4, width: '100%', flexShrink: 0 }}>
                {/* Dynamische Anzeige basierend auf customText */}
                <div>
                  <div style={{ display: 'block', width: '100%', marginBottom: '2px' }}>
                    {badgePosition === 'afterFirst' ? (
                      <span 
                        style={{ fontWeight: '600' }}
                        dangerouslySetInnerHTML={{ 
                          __html: getNamesWithBadge('afterFirst', previewDevice === 'mobile')
                        }}
                      />
                    ) : (
                      <>
                        <strong style={{ fontWeight: '600' }}>{getDisplayNames()}</strong>
                        {badgePosition === 'standard' && (showBadge ? (
                          <img 
                            src={verifiedImage} 
                            alt="Verifiziert" 
                            style={{
                              height: previewDevice === 'mobile' ? '13px' : '14px',
                              maxWidth: 'none',
                              margin: '0 4px',
                              verticalAlign: 'baseline',
                              transform: 'translateY(-1px)',
                              objectFit: 'contain',
                              display: 'inline'
                            }}
                          />
                        ) : (
                          <span style={{ margin: '0 1px' }}> </span>
                        ))}
                      </>
                    )}
                    <span 
                      style={{ fontWeight: '400', wordSpacing: '0.1em', letterSpacing: '0.01em' }}
                      dangerouslySetInnerHTML={{ 
                        __html: (() => {
                          const wordsForSecondLine = previewDevice === 'mobile' ? 3 : 2;
                          const { firstPart } = getTextSplit(customText, wordsForSecondLine);
                          return firstPart;
                        })()
                      }}
                    />
                  </div>
                  <div style={{ display: 'block', width: '100%' }}>
                    <span 
                      style={{ fontWeight: '400', wordSpacing: '0.1em', letterSpacing: '0.01em' }}
                      dangerouslySetInnerHTML={{ 
                        __html: (() => {
                          const wordsForSecondLine = previewDevice === 'mobile' ? 3 : 2;
                          const { lastPart } = getTextSplit(customText, wordsForSecondLine);
                          return lastPart;
                        })()
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Product Page Integration Preview - CORS-friendly approach
        <div className="flex-1">
          {currentProductUrl ? (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-blue-50 px-3 py-2 text-xs text-blue-800 border-b">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Produktseite Integration - Anleitung</span>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">URL eingegeben:</h4>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded text-blue-600">{currentProductUrl}</code>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">🔒 Warum kann die Seite nicht geladen werden?</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Aus Sicherheitsgründen blockieren moderne Browser das Laden externer Websites in iframes (CORS-Policy). 
                    Dies verhindert eine direkte Vorschau der Integration.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-3">📋 So integrierst du die Section:</h4>
                  <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                    <li>Kopiere den generierten HTML/Liquid Code (rechts im Editor)</li>
                    <li>Gehe zu deinem Shopify Admin → Online Store → Themes</li>
                    <li>Klicke auf "Aktionen" → "Code bearbeiten" bei deinem aktiven Theme</li>
                    <li>Öffne die entsprechende Template-Datei (z.B. product.liquid)</li>
                    <li>Füge den Code an der gewünschten Stelle ein</li>
                    <li>Speichere die Änderungen</li>
                  </ol>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">✅ Alternative Vorschau:</h4>
                  <p className="text-sm text-green-700 mb-2">
                    Öffne die Produktseite in einem neuen Tab und nutze die Entwicklertools (F12), 
                    um eine mobile Ansicht zu simulieren und zu testen, wie die Section aussehen würde.
                  </p>
                  <a 
                    href={currentProductUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-green-600 hover:text-green-800 underline"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Produktseite in neuem Tab öffnen
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 border border-gray-300 rounded-lg bg-gray-50">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Produktseiten-Integration</h3>
                <p className="text-sm mb-1">Gib eine Shopify Produktseiten-URL ein,</p>
                <p className="text-sm">um Integrationshilfe zu erhalten</p>
                <div className="mt-4 text-xs text-gray-400">
                  Beispiel: https://dein-shop.myshopify.com/products/produkt-name
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  // Code display without switcher
  const CodeSwitcher = () => {
    return null;
  };

  // Self-contained HTML code that works standalone without Shopify
  const standaloneCode = (() => {
    const desktopSplit = getTextSplit(customText, 2);
    const mobileSplit = getTextSplit(customText, 3);
    
    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Social Proof Box</title>
  <style>
    /* Responsive font sizes */
    .social-proof-standalone {
      font-size: ${fontSizeDesktop};
    }
    
    @media (max-width: 767px) {
      .social-proof-standalone {
        font-size: ${fontSizeMobile};
      }
    }
    
    /* Mobile responsive text layout - hide desktop layout */
    @media (max-width: 767px) {
      .desktop-layout {
        display: none !important;
      }
      .mobile-layout {
        display: block !important;
      }
    }
    
    /* Desktop layout - hide mobile layout */
    @media (min-width: 768px) {
      .mobile-layout {
        display: none !important;
      }
      .desktop-layout {
        display: block !important;
      }
    }
  </style>
</head>
<body>
  <div class="social-proof-standalone" style="display: flex; align-items: center; background-color: ${backgroundColor}; padding: ${getEffectivePadding()}; border-radius: ${borderRadius}; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 12px; color: ${textColor}; font-weight: 500; width: ${useFullWidth ? '100%' : 'fit-content'}; max-width: 100%; box-sizing: border-box;">
    ${avatarCount > 0 ? `
    <div style="display: flex; align-items: center; flex-shrink: 0;">
      ${avatarCount >= 1 ? `<img src="${avatarImage1}" alt="User 1" style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; border: 2px solid ${avatarBorderColor}; object-fit: cover; flex-shrink: 0; z-index: 3; margin-right: ${avatarCount > 1 ? '-8px' : '0'};" onerror="this.style.display='none'">` : ''}
      ${avatarCount >= 2 ? `<img src="${avatarImage2}" alt="User 2" style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; border: 2px solid ${avatarBorderColor}; object-fit: cover; flex-shrink: 0; z-index: 2; margin-right: ${avatarCount >= 3 ? '-8px' : '0'};" onerror="this.style.display='none'">` : ''}
      ${avatarCount >= 3 ? `<img src="${avatarImage3}" alt="User 3" style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; border: 2px solid ${avatarBorderColor}; object-fit: cover; flex-shrink: 0; z-index: 1;" onerror="this.style.display='none'">` : ''}
    </div>` : ''}
    <div style="margin-left: ${avatarCount > 0 ? '12px' : '0'}; line-height: 1.4; display: block; width: 100%;">
      <!-- Desktop layout: 2 words on second line -->
      <div class="desktop-layout">
        <div style="display: block; width: 100%; margin-bottom: 2px;">
          <strong style="display: inline; font-weight: 600;">${getDisplayNames()}</strong>
${showBadge ? `<img src="${verifiedImage}" alt="Verifiziert" style="height: 14px; max-width: none; margin: 0 4px; vertical-align: baseline; transform: translateY(-1px); object-fit: contain; display: inline;" onerror="this.style.display='none'">` : '<span style="margin: 0 1px;"> </span>'}
          <span style="font-weight: 400; word-spacing: 0.1em; letter-spacing: 0.01em; display: inline;">${desktopSplit.firstPart}</span>
        </div>
        <div style="display: block; width: 100%;">
          <span style="font-weight: 400; word-spacing: 0.1em; letter-spacing: 0.01em;">${desktopSplit.lastPart}</span>
        </div>
      </div>
      
      <!-- Mobile layout: 3 words on second line -->
      <div class="mobile-layout">
        <div style="display: block; width: 100%; margin-bottom: 2px;">
          <strong style="display: inline; font-weight: 600;">${getDisplayNames()}</strong>
${showBadge ? `<img src="${verifiedImage}" alt="Verifiziert" style="height: 13px; max-width: none; margin: 0 4px; vertical-align: baseline; transform: translateY(-1px); object-fit: contain; display: inline;" onerror="this.style.display='none'">` : '<span style="margin: 0 1px;"> </span>'}
          <span style="font-weight: 400; word-spacing: 0.1em; letter-spacing: 0.01em; display: inline;">${mobileSplit.firstPart}</span>
        </div>
        <div style="display: block; width: 100%;">
          <span style="font-weight: 400; word-spacing: 0.1em; letter-spacing: 0.01em;">${mobileSplit.lastPart}</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
  })();


  // Select the code to display - only standalone now
  const code = standaloneCode;
  
  // Complete code display with the switcher
  const codeDisplay = (
    <>
      <CodeSwitcher />
      <pre className="whitespace-pre-wrap text-xs font-mono bg-gray-50 p-4 rounded-md overflow-x-auto">
        {code}
      </pre>
    </>
  )

  return { 
    settings: (
      <>
        {settings}
        <ImageHelpModal />
        <TutorialModal />
      </>
    ), 
    preview, 
    code: codeDisplay 
  }
}