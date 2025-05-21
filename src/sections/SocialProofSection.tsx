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
  const [customText, setCustomText] = useState(safeInitialData.customText || 'und 12.752 andere sind begeistert von Regenliebe')
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
  const [fontSizeDesktop, setFontSizeDesktop] = useState(safeInitialData.fontSizeDesktop || '14px')
  const [fontSizeMobile, setFontSizeMobile] = useState(safeInitialData.fontSizeMobile || '10px')
  const [brandNameBold, setBrandNameBold] = useState(safeInitialData.brandNameBold !== undefined ? safeInitialData.brandNameBold : true)
  
  // Padding settings
  const [useSinglePadding, setUseSinglePadding] = useState(true)
  const [padding, setPadding] = useState(safeInitialData.padding || styleTemplates[0].padding)
  const [paddingTop, setPaddingTop] = useState(safeInitialData.paddingTop || '15')
  const [paddingRight, setPaddingRight] = useState(safeInitialData.paddingRight || '15')
  const [paddingBottom, setPaddingBottom] = useState(safeInitialData.paddingBottom || '15')
  const [paddingLeft, setPaddingLeft] = useState(safeInitialData.paddingLeft || '15')
  
  // Preview device state - to handle responsive font sizing
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  
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
    brandNameBold
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
    fontSizeDesktop, fontSizeMobile, brandNameBold, onDataChange
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
  
  // Function to get the last two words for line breaking
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
        
      if (words.length <= 2) {
        return { firstPart: processedText, lastTwoPart: '' };
      }
      
      // Get the last two words - specifically the LAST two words for line breaking
      const lastTwo = words.slice(-2).join(' ');
      
      // Find the position of the last two words in the original text
      const lastIndex = normalizedText.lastIndexOf(lastTwo);
      
      if (lastIndex === -1) {
        // If we can't find the last two words, just return the formatted text
        return { firstPart: processedText, lastTwoPart: '' };
      }
      
      // Find the approximate position in the HTML text
      // We need to search in the processed text for the last occurrence of lastTwo
      const lastOccurrence = processedText.lastIndexOf(lastTwo);
      
      if (lastOccurrence === -1) {
        // Try searching for individual words if exact match not found
        const lastWord = words[words.length - 1];
        const secondLastWord = words[words.length - 2];
        
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
      
      // If found, return parts split at the last two words
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
  const [codeOutputType, setCodeOutputType] = useState<'liquid-block' | 'section'>('liquid-block');

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
                    placeholder="und 12.752 andere sind begeistert von Regenliebe"
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
                            // Get selection range - must come from the element directly
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            
                            // Don't check equality - sometimes browsers have selection but don't show it correctly
                            if (end <= start) {
                              // Try to select all text if nothing is selected
                              textarea.select();
                              
                              // Try again after selection
                              const newStart = textarea.selectionStart;
                              const newEnd = textarea.selectionEnd;
                              
                              // If still no selection, notify user
                              if (newEnd <= newStart) {
                                alert("Bitte wähle zuerst den Text aus, den du formatieren möchtest.");
                                return;
                              }
                            }
                            
                            // Now get the latest selection positions
                            const finalStart = textarea.selectionStart;
                            const finalEnd = textarea.selectionEnd;
                            
                            // Get selected text
                            const selectedText = customText.substring(finalStart, finalEnd);
                            
                            // Apply bold formatting
                            const newText = 
                              customText.substring(0, finalStart) + 
                              `<strong>${selectedText}</strong>` + 
                              customText.substring(finalEnd);
                            
                            // Update state
                            setCustomText(newText);
                            
                            // Force refresh for immediate preview update
                            onDataChange && onDataChange({
                              ...sectionData,
                              customText: newText
                            });
                            
                            // Focus back on textarea and set cursor position
                            setTimeout(() => {
                              textarea.focus();
                              const newPosition = finalStart + `<strong>${selectedText}</strong>`.length;
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
                            // Get selection range - must come from the element directly
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            
                            // Don't check equality - sometimes browsers have selection but don't show it correctly
                            if (end <= start) {
                              // Try to select all text if nothing is selected
                              textarea.select();
                              
                              // Try again after selection
                              const newStart = textarea.selectionStart;
                              const newEnd = textarea.selectionEnd;
                              
                              // If still no selection, notify user
                              if (newEnd <= newStart) {
                                alert("Bitte wähle zuerst den Text aus, den du formatieren möchtest.");
                                return;
                              }
                            }
                            
                            // Now get the latest selection positions
                            const finalStart = textarea.selectionStart;
                            const finalEnd = textarea.selectionEnd;
                            
                            // Get selected text
                            const selectedText = customText.substring(finalStart, finalEnd);
                            
                            // Apply italic formatting
                            const newText = 
                              customText.substring(0, finalStart) + 
                              `<em>${selectedText}</em>` + 
                              customText.substring(finalEnd);
                            
                            // Update state
                            setCustomText(newText);
                            
                            // Force refresh for immediate preview update
                            onDataChange && onDataChange({
                              ...sectionData,
                              customText: newText
                            });
                            
                            // Focus back on textarea and set cursor position
                            setTimeout(() => {
                              textarea.focus();
                              const newPosition = finalStart + `<em>${selectedText}</em>`.length;
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
                            // Get selection range - must come from the element directly
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            
                            // Don't check equality - sometimes browsers have selection but don't show it correctly
                            if (end <= start) {
                              // Try to select all text if nothing is selected
                              textarea.select();
                              
                              // Try again after selection
                              const newStart = textarea.selectionStart;
                              const newEnd = textarea.selectionEnd;
                              
                              // If still no selection, notify user
                              if (newEnd <= newStart) {
                                alert("Bitte wähle zuerst den Text aus, den du formatieren möchtest.");
                                return;
                              }
                            }
                            
                            // Now get the latest selection positions
                            const finalStart = textarea.selectionStart;
                            const finalEnd = textarea.selectionEnd;
                            
                            // Get selected text
                            const selectedText = customText.substring(finalStart, finalEnd);
                            
                            // Apply underline formatting
                            const newText = 
                              customText.substring(0, finalStart) + 
                              `<u>${selectedText}</u>` + 
                              customText.substring(finalEnd);
                            
                            // Update state
                            setCustomText(newText);
                            
                            // Force refresh for immediate preview update
                            onDataChange && onDataChange({
                              ...sectionData,
                              customText: newText
                            });
                            
                            // Focus back on textarea and set cursor position
                            setTimeout(() => {
                              textarea.focus();
                              const newPosition = finalStart + `<u>${selectedText}</u>`.length;
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
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowBreakOnLarge(!showBreakOnLarge); }}
                  className="flex items-center cursor-pointer bg-transparent border-none p-0 m-0 focus:outline-none"
                >
                  <div className={`relative w-9 h-5 ${showBreakOnLarge ? 'bg-[#1c2838]' : 'bg-gray-200'} rounded-full transition-colors`}>
                    <div className={`absolute top-[2px] ${showBreakOnLarge ? 'right-[2px] translate-x-0' : 'left-[2px] translate-x-0'} bg-white border rounded-full h-4 w-4 transition-all`}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">Umbrechen</span>
                </button>
                <HelpTooltip text="Bricht auf großen Bildschirmen die letzten zwei Wörter in eine neue Zeile um." />
              </div>
            </div>
            
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
            
            
          </div>
          
          {/* Font Size Controls */}
          <div className="space-y-3 mt-4">
            <label className="block text-sm text-[#1c2838]">
              Schriftgröße (Desktop):
              <div className="flex items-center mt-1">
                <input
                  type="range"
                  min="12"
                  max="24"
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
                  min="5"
                  max="25"
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
  
  // Update preview on device change
  const handleDeviceChange = (device: 'desktop' | 'tablet' | 'mobile') => {
    setPreviewDevice(device);
  };
  
  const preview = (
    <div className="w-full h-full flex items-center justify-center">
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
          width: 'fit-content',
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
            lineHeight: '1.3',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {/* Layout container to keep names and text in a row */}
          <div 
            style={{ 
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              width: '100%'
            }}
          >
            {/* Names with verified badge - stays on the same line with text */}
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              marginRight: '4px', 
              flexShrink: 0,
              whiteSpace: 'nowrap' // Prevent names from wrapping
            }}>
              <strong style={{ fontWeight: '600', flexShrink: 0 }}>{getDisplayNames()}</strong>
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
            </span>
            
            {showBreakOnLarge ? (
              // When line break is enabled, split text to move the last two words to next line
              (() => {
                // Get parts with last two words separated
                const { firstPart, lastTwoPart } = getLastTwoWords();
                
                return (
                  <>
                    {/* Main part of text - stays on same line with names */}
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center',
                      fontWeight: '400',
                      flexShrink: 1
                    }} dangerouslySetInnerHTML={{ 
                      __html: firstPart
                    }} />
                    
                    {/* Last two words with line break */}
                    {lastTwoPart && (
                      <div style={{ width: '100%', display: 'block', marginTop: '2px' }}>
                        <span style={{ fontWeight: '400' }} dangerouslySetInnerHTML={{ 
                          __html: lastTwoPart.replace(
                            brandName, 
                            `<span style="font-weight: ${brandNameBold ? '600' : '400'}">${brandName}</span>`
                          )
                        }} />
                      </div>
                    )}
                  </>
                );
              })()
            ) : (
              // Regular view without line break - stays on same line with names
              <span 
                style={{ 
                  fontWeight: '400',
                  display: 'inline-flex',
                  alignItems: 'center',
                  flexShrink: 1,
                  whiteSpace: 'normal',
                  overflow: 'visible',
                  textOverflow: 'clip'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: getFormattedText().replace(
                    brandName, 
                    `<span style="font-weight: ${brandNameBold ? '600' : '400'}">${brandName}</span>`
                  )
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // Code Switcher Component
  const CodeSwitcher = () => {
    return (
      <div className="flex border-b mb-4 pb-2">
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCodeOutputType('liquid-block'); }}
          className={`flex items-center px-3 py-1.5 text-xs rounded-l-md ${codeOutputType === 'liquid-block' ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
        >
          <span>Liquid Block</span>
          <div className="relative ml-1 group">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.06-1.06 2.5 2.5 0 0 1 3.536 0A.75.75 0 0 1 10.354 6.94 1 1 0 0 0 9.75 6.75a1 1 0 0 0-.81.31Zm-3.24 7.9a.75.75 0 1 0 1.06 1.06l4.25-4.25a.75.75 0 1 0-1.06-1.06L6.33 14.44 5.56 13.7a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l1.2 1.2a.75.75 0 0 0 1.06 0Z" clipRule="evenodd" />
            </svg>
            <div className="absolute left-0 bottom-full mb-2 p-2 bg-gray-800 text-white text-xs rounded w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
              Optimierter Code für Shopify Liquid Blocks - ohne Syntax-Fehler, ideal für Theme Code Editoren.
            </div>
          </div>
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCodeOutputType('section'); }}
          className={`flex items-center px-3 py-1.5 text-xs rounded-r-md ${codeOutputType === 'section' ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
        >
          <span>Shopify Theme Code</span>
          <div className="relative ml-1 group">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.06-1.06 2.5 2.5 0 0 1 3.536 0A.75.75 0 0 1 10.354 6.94 1 1 0 0 0 9.75 6.75a1 1 0 0 0-.81.31Zm-3.24 7.9a.75.75 0 1 0 1.06 1.06l4.25-4.25a.75.75 0 1 0-1.06-1.06L6.33 14.44 5.56 13.7a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l1.2 1.2a.75.75 0 0 0 1.06 0Z" clipRule="evenodd" />
            </svg>
            <div className="absolute right-0 bottom-full mb-2 p-2 bg-gray-800 text-white text-xs rounded w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
              Kompletter Shopify Theme Code zum Kopieren & Einfügen über die Shopify-Oberfläche.
            </div>
          </div>
        </button>
      </div>
    );
  };

  // Ultra simple Liquid code that works without any syntax errors
  const liquidBlockCode = `{% comment %}Social Proof Box (BrandUp Builder){% endcomment %}

{% comment %}Build the names based on settings{% endcomment %}
{% capture names %}
  {% if section.settings.avatar_count == 1 and section.settings.first_name_1 != blank %}
    {{ section.settings.first_name_1 }}
  {% elsif section.settings.avatar_count == 2 and section.settings.first_name_1 != blank and section.settings.first_name_2 != blank %}
    {{ section.settings.first_name_1 }}, {{ section.settings.first_name_2 }}
  {% elsif section.settings.avatar_count == 3 and section.settings.first_name_1 != blank and section.settings.first_name_2 != blank and section.settings.first_name_3 != blank %}
    {{ section.settings.first_name_1 }}, {{ section.settings.first_name_2 }}, {{ section.settings.first_name_3 }}
  {% else %}
    Steffi, Daniela
  {% endif %}
{% endcapture %}

<div class="social-proof-box">
  {% if section.settings.avatar_count > 0 %}
  <div class="avatars">
    {% if section.settings.avatar_count >= 1 and section.settings.avatar_image_1 != blank %}
    <img src="{{ section.settings.avatar_image_1 | img_url: 'master' }}" alt="User 1" class="avatar avatar-1">
    {% endif %}
    {% if section.settings.avatar_count >= 2 and section.settings.avatar_image_2 != blank %}
    <img src="{{ section.settings.avatar_image_2 | img_url: 'master' }}" alt="User 2" class="avatar avatar-2">
    {% endif %}
    {% if section.settings.avatar_count >= 3 and section.settings.avatar_image_3 != blank %}
    <img src="{{ section.settings.avatar_image_3 | img_url: 'master' }}" alt="User 3" class="avatar avatar-3">
    {% endif %}
  </div>
  {% endif %}
  <div class="content">
    <span class="names">
      <strong>{{ names | strip }}</strong>
      <img src="{{ section.settings.verified_image | img_url: 'master' }}" alt="Verifiziert" class="badge">
    </span>
    <span class="text">
      {{ section.settings.custom_text }}
    </span>
  </div>
</div>

<style>
  .social-proof-box {
    display: flex;
    align-items: center;
    background-color: {{ section.settings.background_color }};
    padding: {{ section.settings.padding }};
    border-radius: {{ section.settings.border_radius }}px;
    font-family: Arial, sans-serif;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
    color: {{ section.settings.text_color }};
    font-weight: 500;
    max-width: 100%;
  }
  
  /* Font sizes */
  @media (min-width: 768px) {
    .social-proof-box {
      font-size: {{ section.settings.font_size_desktop }}px;
    }
  }
  
  @media (max-width: 767px) {
    .social-proof-box {
      font-size: {{ section.settings.font_size_mobile }}px;
    }
  }
  
  /* Avatars */
  .avatars {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  
  .avatar {
    width: {{ section.settings.avatar_size }}px;
    height: {{ section.settings.avatar_size }}px;
    border-radius: 50%;
    border: 2px solid {{ section.settings.avatar_border_color }};
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
  
  /* Text content */
  .content {
    margin-left: {% if section.settings.avatar_count > 0 %}12px{% else %}0{% endif %};
    line-height: 1.3;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
  }
  
  .names {
    display: inline-flex;
    align-items: center;
    margin-right: 4px;
    font-weight: 600;
  }
  
  .text {
    font-weight: 400;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .badge {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    position: relative;
    top: -1px;
    flex-shrink: 0;
  }
  
  /* Line break for large screens */
  @media (min-width: 1300px) {
    {% if section.settings.show_break_on_large %}
    .text {
      display: block;
      width: 100%;
    }
    {% endif %}
  }
</style>`;
    
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
      <div class="user-text-proof">
        <span class="names-container">
          <strong class="user-names">{{ user_display_names }}</strong>
          <img src="{{ section.settings.verified_image | img_url: 'master' }}" alt="Verifiziert" class="verified-badge-proof">
        </span>
        <span class="user-count-text">
          {{ formatted_text }}
          <span class="line-break-desktop"></span>
        </span>
      </div>
    </div>
  {% else %}
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
      <div class="user-text-proof">
        <span class="names-container">
          <strong class="user-names">{{ user_display_names }}</strong>
          <img src="{{ section.settings.verified_image | img_url: 'master' }}" alt="Verifiziert" class="verified-badge-proof">
        </span>
        <span class="user-count-text">{{ section.settings.custom_text }}</span>
      </div>
    </div>
  {% endif %}
{% else %}
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
    <div class="user-text-proof">
      <span class="names-container">
        <strong class="user-names">{{ user_display_names }}</strong>
        <img src="{{ section.settings.verified_image | img_url: 'master' }}" alt="Verifiziert" class="verified-badge-proof">
      </span>
      <span class="user-count-text">{{ section.settings.custom_text }}</span>
    </div>
  </div>
{% endif %}

<style>
  .social-proof-box-proof {
    display: flex;
    align-items: center;
    background-color: {{ section.settings.background_color }};
    padding: {{ section.settings.padding }};
    border-radius: {{ section.settings.border_radius }}px;
    font-family: Arial, sans-serif;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
    color: {{ section.settings.text_color }};
    font-weight: 500;
  }
  
  /* Font size responsive settings */
  @media (min-width: 768px) {
    .social-proof-box-proof {
      font-size: {{ section.settings.font_size_desktop }}px;
    }
  }
  
  @media (max-width: 767px) {
    .social-proof-box-proof {
      font-size: {{ section.settings.font_size_mobile }}px;
    }
  }
  .user-avatars-proof {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .avatar-proof {
    width: {{ section.settings.avatar_size }}px;
    height: {{ section.settings.avatar_size }}px;
    border-radius: 50%;
    border: 2px solid {{ section.settings.avatar_border_color }};
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
    width: 100%;
  }
  .names-container {
    display: inline-flex;
    align-items: center;
    margin-right: 4px;
  }
  .user-names {
    font-weight: 600;
  }
  .user-count-text {
    font-weight: 400;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .user-count-text strong {
    font-weight: 600;
    margin: 0 2px;
    padding: 0 1px;
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
    .line-break-desktop {
      display: block !important;
      content: '';
      height: 4px;
      width: 100%;
    }
    {% else %}
    .line-break-desktop {
      display: inline !important;
      content: '';
      height: 0;
      width: 0;
    }
    {% endif %}
  }
</style>`;

  // Section Code - using the exact same structure as the liquid-block for consistency
  const sectionCode = `{% comment %}
  Social Proof Box (BrandUp Builder)
{% endcomment %}

{% comment %}Build the names based on settings{% endcomment %}
{% capture names %}
  {% if section.settings.avatar_count == 1 and section.settings.first_name_1 != blank %}
    {{ section.settings.first_name_1 }}
  {% elsif section.settings.avatar_count == 2 and section.settings.first_name_1 != blank and section.settings.first_name_2 != blank %}
    {{ section.settings.first_name_1 }}, {{ section.settings.first_name_2 }}
  {% elsif section.settings.avatar_count == 3 and section.settings.first_name_1 != blank and section.settings.first_name_2 != blank and section.settings.first_name_3 != blank %}
    {{ section.settings.first_name_1 }}, {{ section.settings.first_name_2 }}, {{ section.settings.first_name_3 }}
  {% else %}
    Steffi, Daniela
  {% endif %}
{% endcapture %}

<div class="social-proof-box">
  {% if section.settings.avatar_count > 0 %}
  <div class="avatars">
    {% if section.settings.avatar_count >= 1 and section.settings.avatar_image_1 != blank %}
    <img src="{{ section.settings.avatar_image_1 | img_url: 'master' }}" alt="User 1" class="avatar avatar-1">
    {% endif %}
    {% if section.settings.avatar_count >= 2 and section.settings.avatar_image_2 != blank %}
    <img src="{{ section.settings.avatar_image_2 | img_url: 'master' }}" alt="User 2" class="avatar avatar-2">
    {% endif %}
    {% if section.settings.avatar_count >= 3 and section.settings.avatar_image_3 != blank %}
    <img src="{{ section.settings.avatar_image_3 | img_url: 'master' }}" alt="User 3" class="avatar avatar-3">
    {% endif %}
  </div>
  {% endif %}
  <div class="content">
    <span class="names">
      <strong>{{ names | strip }}</strong>
      <img src="{{ section.settings.verified_image | img_url: 'master' }}" alt="Verifiziert" class="badge">
    </span>
    <span class="text">
      {{ section.settings.custom_text }}
    </span>
  </div>
</div>

<style>
  .social-proof-box {
    display: flex;
    align-items: center;
    background-color: {{ section.settings.background_color }};
    padding: {{ section.settings.padding }};
    border-radius: {{ section.settings.border_radius }}px;
    font-family: Arial, sans-serif;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
    color: {{ section.settings.text_color }};
    font-weight: 500;
    max-width: 100%;
  }
  
  /* Font sizes */
  @media (min-width: 768px) {
    .social-proof-box {
      font-size: {{ section.settings.font_size_desktop }}px;
    }
  }
  
  @media (max-width: 767px) {
    .social-proof-box {
      font-size: {{ section.settings.font_size_mobile }}px;
    }
  }
  
  /* Avatars */
  .avatars {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  
  .avatar {
    width: {{ section.settings.avatar_size }}px;
    height: {{ section.settings.avatar_size }}px;
    border-radius: 50%;
    border: 2px solid {{ section.settings.avatar_border_color }};
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
  
  /* Text content */
  .content {
    margin-left: {% if section.settings.avatar_count > 0 %}12px{% else %}0{% endif %};
    line-height: 1.3;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
  }
  
  .names {
    display: inline-flex;
    align-items: center;
    margin-right: 4px;
    font-weight: 600;
  }
  
  .text {
    font-weight: 400;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .badge {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    position: relative;
    top: -1px;
    flex-shrink: 0;
  }
  
  /* Line break for large screens */
  @media (min-width: 1300px) {
    {% if section.settings.show_break_on_large %}
    .text {
      display: block;
      width: 100%;
    }
    {% endif %}
  }
</style>`;

<style>
  .social-proof-box-proof {
    display: flex;
    align-items: center;
    background-color: {{ section.settings.background_color }};
    padding: {{ section.settings.padding }};
    border-radius: {{ section.settings.border_radius }}px;
    font-family: Arial, sans-serif;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
    color: {{ section.settings.text_color }};
    font-weight: 500;
  }
  
  /* Font size responsive settings */
  @media (min-width: 768px) {
    .social-proof-box-proof {
      font-size: {{ section.settings.font_size_desktop }}px;
    }
  }
  
  @media (max-width: 767px) {
    .social-proof-box-proof {
      font-size: {{ section.settings.font_size_mobile }}px;
    }
  }
  .user-avatars-proof {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .avatar-proof {
    width: {{ section.settings.avatar_size }}px;
    height: {{ section.settings.avatar_size }}px;
    border-radius: 50%;
    border: 2px solid {{ section.settings.avatar_border_color }};
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
    width: 100%;
  }
  .names-container {
    display: inline-flex;
    align-items: center;
    margin-right: 4px;
  }
  .user-names {
    font-weight: 600;
  }
  .user-count-text {
    font-weight: 400;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .user-count-text strong {
    font-weight: 600;
    margin: 0 2px;
    padding: 0 1px;
  }
  .brand-name {
    font-weight: {% if section.settings.brand_name_bold %}600{% else %}400{% endif %};
    margin: 0 2px;
    padding: 0 1px;
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
      "info": "Verwende (Zahl) und (Marke) als Platzhalter",
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
      "id": "brand_name_bold",
      "label": "Markenname fett",
      "default": ${brandNameBold}
    },
    {
      "type": "range",
      "id": "font_size_desktop",
      "min": 12,
      "max": 24,
      "step": 1,
      "label": "Schriftgröße (Desktop)",
      "default": ${fontSizeDesktop.replace('px', '')}
    },
    {
      "type": "range",
      "id": "font_size_mobile",
      "min": 5,
      "max": 25,
      "step": 1,
      "label": "Schriftgröße (Mobil)",
      "default": ${fontSizeMobile.replace('px', '')}
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

  // Select the code to display based on selected type
  const code = codeOutputType === 'liquid-block' ? liquidBlockCode : sectionCode;
  
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