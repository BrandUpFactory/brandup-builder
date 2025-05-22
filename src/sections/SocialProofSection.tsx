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
    fontSizeDesktop?: string;
    fontSizeMobile?: string;
    brandNameBold?: boolean;
  };
  onDataChange?: (data: any) => void;
  previewDevice?: 'desktop' | 'tablet' | 'mobile';
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

export default function SocialProofSection({ initialData, onDataChange, previewDevice: externalPreviewDevice }: SocialProofSectionProps) {
  // Ensure initialData is an object
  const safeInitialData = initialData || {};
  
  // Helper for range sliders - we don't prevent default to allow slider functionality
  const handleRangeInput = (e: React.MouseEvent) => {
    e.stopPropagation();  // Only stop propagation, not preventDefault
  };
  
  // Style template selection
  const [selectedStyle, setSelectedStyle] = useState<number>(safeInitialData.selectedStyle !== undefined ? safeInitialData.selectedStyle : 0);
  
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
  const [avatarCount, setAvatarCount] = useState(safeInitialData.avatarCount || 2)

  // Section styling
  const [backgroundColor, setBackgroundColor] = useState(safeInitialData.backgroundColor || styleTemplates[0].backgroundColor)
  const [avatarBorderColor, setAvatarBorderColor] = useState(safeInitialData.avatarBorderColor || styleTemplates[0].avatarBorderColor)
  const [textColor, setTextColor] = useState(safeInitialData.textColor || '#000000')
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
    backgroundColor, avatarImage1, avatarImage2, avatarImage3, verifiedImage,
    avatarBorderColor, textColor, showBreakOnLarge,
    avatarSize, borderRadius, padding, paddingTop, paddingRight,
    paddingBottom, paddingLeft, avatarCount, selectedStyle, 
    fontSizeDesktop, fontSizeMobile, brandNameBold, useFullWidth, onDataChange,
    previewDevice
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
  
  // Format the custom text for the preview
  const getFormattedText = () => {
    // Return HTML directly since we're now using contentEditable that produces HTML
    return customText;
  };
  
  // Function to get the last words for line breaking (2 for desktop, 3 for mobile)
  const getLastTwoWords = () => {
    try {
      // Process the HTML text with proper variable replacement
      const processedText = getFormattedText();
      
      // First strip HTML tags for word counting
      const plainText = processedText.replace(/<[^>]*>|<\/[^>]*>/g, '');
      
      // Normalize spaces (remove duplicates)
      const normalizedText = plainText.replace(/\s+/g, ' ').trim();
      
      // Split into words
      const words = normalizedText.split(/\s+/).filter(word => word.length > 0);
      
      // Determine how many words to put on second line based on device
      const wordsForSecondLine = previewDevice === 'mobile' ? 3 : 2;
        
      if (words.length <= wordsForSecondLine) {
        return { firstPart: processedText, lastTwoPart: '' };
      }
      
      // Get the last words for second line
      const lastWords = words.slice(-wordsForSecondLine).join(' ');
      
      // Find the position of the last words in the original text
      const lastIndex = normalizedText.lastIndexOf(lastWords);
      
      if (lastIndex === -1) {
        // If we can't find the last words, just return the formatted text
        return { firstPart: processedText, lastTwoPart: '' };
      }
      
      // Find the approximate position in the HTML text
      // We need to search in the processed text for the last occurrence of lastWords
      const lastOccurrence = processedText.lastIndexOf(lastWords);
      
      if (lastOccurrence === -1) {
        // Try searching for individual words if exact match not found
        const lastWord = words[words.length - 1];
        
        // Find the last word position
        const lastWordPos = processedText.lastIndexOf(lastWord);
        
        if (lastWordPos > 0) {
          // If found, split there
          return {
            firstPart: processedText.substring(0, lastWordPos).trim(),
            lastTwoPart: processedText.substring(lastWordPos).trim()
          };
        }
        
        return { firstPart: processedText, lastTwoPart: '' };
      }
      
      // If found, return parts split at the last words
      return {
        firstPart: processedText.substring(0, lastOccurrence).trim(),
        lastTwoPart: processedText.substring(lastOccurrence).trim()
      };
    } catch (error) {
      console.error('Error in getLastTwoWords:', error);
      return { firstPart: getFormattedText(), lastTwoPart: '' };
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
              
              {/* Simpler text editor with more reliable formatting controls */}
              <div className="mt-1 space-y-3">
                {/* Simple textarea for editing */}
                <div className="relative">
                  <textarea
                    id="text-editor"
                    value={customText}
                    onChange={(e) => {
                      setCustomText(e.target.value);
                      // Force refresh for immediate preview update
                      onDataChange && onDataChange({
                        ...sectionData,
                        customText: e.target.value
                      });
                    }}
                    className="w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                    placeholder="und <strong>12.752</strong> andere sind begeistert von Regenliebe"
                    rows={3}
                  />
                  
                  {/* More reliable text formatting toolbar */}
                  <div className="flex mt-2 border-t pt-2">
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          // Get textarea and safely check selection - this was failing before
                          const textarea = document.getElementById('text-editor') as HTMLTextAreaElement;
                          if (!textarea) return;
                          
                          try {
                            // Get current selection range
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            
                            // Check if anything is selected
                            if (start === end) {
                              alert("Bitte wähle zuerst den Text aus, den du formatieren möchtest.");
                              return;
                            }
                            
                            // Get selected text
                            const selectedText = customText.substring(start, end);
                            
                            // Check if selected text is already bold
                            if (selectedText.includes('<strong>') || selectedText.includes('</strong>')) {
                              alert("Der ausgewählte Text enthält bereits Formatierung. Bitte wähle unformatierten Text aus.");
                              return;
                            }
                            
                            // Apply bold formatting
                            const newText = 
                              customText.substring(0, start) + 
                              `<strong>${selectedText}</strong>` + 
                              customText.substring(end);
                            
                            // Update state
                            setCustomText(newText);
                            
                            // Force refresh for immediate preview update
                            onDataChange && onDataChange({
                              ...sectionData,
                              customText: newText
                            });
                            
                            // Focus back on textarea and set cursor position after the inserted tags
                            setTimeout(() => {
                              textarea.focus();
                              const newPosition = start + `<strong>${selectedText}</strong>`.length;
                              textarea.setSelectionRange(newPosition, newPosition);
                            }, 10);
                          } catch (error) {
                            console.error("Error applying formatting:", error);
                            alert("Fehler beim Formatieren des Textes. Bitte erneut versuchen.");
                          }
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded font-semibold"
                        title="Fett machen"
                      >
                        <strong>B</strong>
                      </button>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          // Get textarea and safely check selection - this was failing before
                          const textarea = document.getElementById('text-editor') as HTMLTextAreaElement;
                          if (!textarea) return;
                          
                          try {
                            // Get current selection range
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            
                            // Check if anything is selected
                            if (start === end) {
                              alert("Bitte wähle zuerst den Text aus, den du formatieren möchtest.");
                              return;
                            }
                            
                            // Get selected text
                            const selectedText = customText.substring(start, end);
                            
                            // Check if selected text is already italic
                            if (selectedText.includes('<em>') || selectedText.includes('</em>')) {
                              alert("Der ausgewählte Text enthält bereits Formatierung. Bitte wähle unformatierten Text aus.");
                              return;
                            }
                            
                            // Apply italic formatting
                            const newText = 
                              customText.substring(0, start) + 
                              `<em>${selectedText}</em>` + 
                              customText.substring(end);
                            
                            // Update state
                            setCustomText(newText);
                            
                            // Force refresh for immediate preview update
                            onDataChange && onDataChange({
                              ...sectionData,
                              customText: newText
                            });
                            
                            // Focus back on textarea and set cursor position after the inserted tags
                            setTimeout(() => {
                              textarea.focus();
                              const newPosition = start + `<em>${selectedText}</em>`.length;
                              textarea.setSelectionRange(newPosition, newPosition);
                            }, 10);
                          } catch (error) {
                            console.error("Error applying formatting:", error);
                            alert("Fehler beim Formatieren des Textes. Bitte erneut versuchen.");
                          }
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded font-semibold"
                        title="Kursiv machen"
                      >
                        <em>I</em>
                      </button>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          // Get textarea and safely check selection - this was failing before
                          const textarea = document.getElementById('text-editor') as HTMLTextAreaElement;
                          if (!textarea) return;
                          
                          try {
                            // Get current selection range
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            
                            // Check if anything is selected
                            if (start === end) {
                              alert("Bitte wähle zuerst den Text aus, den du formatieren möchtest.");
                              return;
                            }
                            
                            // Get selected text
                            const selectedText = customText.substring(start, end);
                            
                            // Check if selected text is already underlined
                            if (selectedText.includes('<u>') || selectedText.includes('</u>')) {
                              alert("Der ausgewählte Text enthält bereits Formatierung. Bitte wähle unformatierten Text aus.");
                              return;
                            }
                            
                            // Apply underline formatting
                            const newText = 
                              customText.substring(0, start) + 
                              `<u>${selectedText}</u>` + 
                              customText.substring(end);
                            
                            // Update state
                            setCustomText(newText);
                            
                            // Force refresh for immediate preview update
                            onDataChange && onDataChange({
                              ...sectionData,
                              customText: newText
                            });
                            
                            // Focus back on textarea and set cursor position after the inserted tags
                            setTimeout(() => {
                              textarea.focus();
                              const newPosition = start + `<u>${selectedText}</u>`.length;
                              textarea.setSelectionRange(newPosition, newPosition);
                            }, 10);
                          } catch (error) {
                            console.error("Error applying formatting:", error);
                            alert("Fehler beim Formatieren des Textes. Bitte erneut versuchen.");
                          }
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded font-semibold"
                        title="Unterstreichen"
                      >
                        <u>U</u>
                      </button>
                    </div>
                    
                    <div className="ml-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          // Remove all HTML tags but keep text
                          const plainText = customText.replace(/<[^>]*>|<\/[^>]*>/g, '');
                          setCustomText(plainText);
                          
                          // Force refresh
                          onDataChange && onDataChange({
                            ...sectionData,
                            customText: plainText
                          });
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded"
                        title="Formatierung entfernen"
                      >
                        Formatierung löschen
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Live preview */}
                <div className="border border-gray-200 bg-gray-50 rounded-md p-3">
                  <h3 className="text-xs font-medium text-gray-500 mb-2">Live-Vorschau:</h3>
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: customText }}></div>
                </div>
              </div>
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
  
  const preview = (
    <div className="w-full h-full flex items-start justify-start p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '200px' }}>
      <div 
        id="social-proof-component"
        className="social-proof-box-proof" 
        style={{
          display: 'flex',
          alignItems: 'center',
          background: backgroundColor,
          padding: getEffectivePadding(),
          borderRadius: borderRadius,
          fontFamily: 'Arial, sans-serif',
          fontSize: previewDevice === 'mobile' ? fontSizeMobile : fontSizeDesktop,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '12px',
          color: textColor,
          width: useFullWidth ? '100%' : 'fit-content',
          maxWidth: '100%',
          fontWeight: '500',
          transition: 'font-size 0.3s ease'
        }}
            >
        {avatarCount > 0 && (
          <div 
            className="user-avatars-proof" 
            style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0 // Ensure this doesn't shrink when brand name breaks
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
            lineHeight: '1.4',
            display: 'block',
            width: '100%'
          }}
        >
          {/* Two-line layout: Line 1 = Names + Badge + Text start, Line 2 = Last words */}
          {(() => {
            const { firstPart, lastTwoPart } = getLastTwoWords();
            
            return (
              <>
                {/* First line: Names + Badge + First part of text */}
                <div style={{ 
                  display: 'block',
                  width: '100%',
                  marginBottom: '2px'
                }}>
                  <strong style={{ 
                    fontWeight: '600',
                    display: 'inline'
                  }}>{getDisplayNames()}</strong>
                  <img 
                    src={verifiedImage}
                    alt="Verifiziert" 
                    className="verified-badge-proof" 
                    style={{
                      height: previewDevice === 'mobile' ? '13px' : '14px',
                      maxWidth: 'none',
                      marginLeft: '4px',
                      marginRight: '4px',
                      verticalAlign: 'baseline',
                      transform: 'translateY(-1px)',
                      objectFit: 'contain',
                      display: 'inline'
                    }}
                  />
                  <span style={{ 
                    fontWeight: '400',
                    wordSpacing: '0.1em',
                    letterSpacing: '0.01em',
                    display: 'inline'
                  }} dangerouslySetInnerHTML={{ 
                    __html: firstPart
                  }} />
                </div>
                
                {/* Second line: Last words only */}
                <div style={{ 
                  display: 'block',
                  width: '100%'
                }}>
                  <span style={{ 
                    fontWeight: '400',
                    wordSpacing: '0.1em',
                    letterSpacing: '0.01em'
                  }} dangerouslySetInnerHTML={{ 
                    __html: lastTwoPart.replace(
                      brandName, 
                      `<span style="font-weight: ${brandNameBold ? '600' : '400'}">${brandName}</span>`
                    )
                  }} />
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  )

  // Code Switcher Component - simplified to only show standalone
  const CodeSwitcher = () => {
    return (
      <div className="flex border-b mb-4 pb-2">
        <div className="flex items-center px-3 py-1.5 text-xs rounded-md bg-[#1c2838] text-white">
          <span>Standalone HTML</span>
          <div className="relative ml-1 group">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.06-1.06 2.5 2.5 0 0 1 3.536 0A.75.75 0 0 1 10.354 6.94 1 1 0 0 0 9.75 6.75a1 1 0 0 0-.81.31Zm-3.24 7.9a.75.75 0 1 0 1.06 1.06l4.25-4.25a.75.75 0 1 0-1.06-1.06L6.33 14.44 5.56 13.7a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l1.2 1.2a.75.75 0 0 0 1.06 0Z" clipRule="evenodd" />
            </svg>
            <div className="absolute left-0 bottom-full mb-2 p-2 bg-gray-800 text-white text-xs rounded w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
              Kompletter HTML-Code mit CSS - funktioniert überall ohne externe Abhängigkeiten. Desktop: 2 Wörter in zweiter Zeile, Mobil: 3 Wörter in zweiter Zeile.
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Self-contained HTML code that works standalone without Shopify
  const standaloneCode = `<!DOCTYPE html>
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
          <img src="${verifiedImage}" alt="Verifiziert" style="height: 14px; max-width: none; margin: 0 4px; vertical-align: baseline; transform: translateY(-1px); object-fit: contain; display: inline;" onerror="this.style.display='none'">
          <span style="font-weight: 400; word-spacing: 0.1em; letter-spacing: 0.01em; display: inline;">${(() => {
            // Desktop: 2 words on second line
            const text = customText;
            const plainText = text.replace(/<[^>]*>|<\/[^>]*>/g, '');
            const words = plainText.replace(/\s+/g, ' ').trim().split(/\s+/);
            if (words.length <= 2) return text;
            const lastTwo = words.slice(-2).join(' ');
            const lastOccurrence = text.lastIndexOf(lastTwo);
            if (lastOccurrence === -1) return text;
            return text.substring(0, lastOccurrence).trim();
          })()}</span>
        </div>
        <div style="display: block; width: 100%;">
          <span style="font-weight: 400; word-spacing: 0.1em; letter-spacing: 0.01em;">${(() => {
            const text = customText;
            const plainText = text.replace(/<[^>]*>|<\/[^>]*>/g, '');
            const words = plainText.replace(/\s+/g, ' ').trim().split(/\s+/);
            if (words.length <= 2) return '';
            const lastTwo = words.slice(-2).join(' ');
            const lastOccurrence = text.lastIndexOf(lastTwo);
            if (lastOccurrence === -1) return '';
            const result = text.substring(lastOccurrence).trim();
            return result.replace(brandName, `<span style="font-weight: ${brandNameBold ? '600' : '400'}">${brandName}</span>`);
          })()}</span>
        </div>
      </div>
      
      <!-- Mobile layout: 3 words on second line -->
      <div class="mobile-layout">
        <div style="display: block; width: 100%; margin-bottom: 2px;">
          <strong style="display: inline; font-weight: 600;">${getDisplayNames()}</strong>
          <img src="${verifiedImage}" alt="Verifiziert" style="height: 13px; max-width: none; margin: 0 4px; vertical-align: baseline; transform: translateY(-1px); object-fit: contain; display: inline;" onerror="this.style.display='none'">
          <span style="font-weight: 400; word-spacing: 0.1em; letter-spacing: 0.01em; display: inline;">${(() => {
            // Mobile: 3 words on second line
            const text = customText;
            const plainText = text.replace(/<[^>]*>|<\/[^>]*>/g, '');
            const words = plainText.replace(/\s+/g, ' ').trim().split(/\s+/);
            if (words.length <= 3) return text;
            const lastThree = words.slice(-3).join(' ');
            const lastOccurrence = text.lastIndexOf(lastThree);
            if (lastOccurrence === -1) return text;
            return text.substring(0, lastOccurrence).trim();
          })()}</span>
        </div>
        <div style="display: block; width: 100%;">
          <span style="font-weight: 400; word-spacing: 0.1em; letter-spacing: 0.01em;">${(() => {
            const text = customText;
            const plainText = text.replace(/<[^>]*>|<\/[^>]*>/g, '');
            const words = plainText.replace(/\s+/g, ' ').trim().split(/\s+/);
            if (words.length <= 3) return '';
            const lastThree = words.slice(-3).join(' ');
            const lastOccurrence = text.lastIndexOf(lastThree);
            if (lastOccurrence === -1) return '';
            const result = text.substring(lastOccurrence).trim();
            return result.replace(brandName, `<span style="font-weight: ${brandNameBold ? '600' : '400'}">${brandName}</span>`);
          })()}</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;


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

  return { settings, preview, code: codeDisplay }
}