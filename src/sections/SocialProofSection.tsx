'use client'

import { useState, useEffect, useCallback } from 'react'
import RichTextEditor from '../components/RichTextEditor'

interface SocialProofSectionProps {
  initialData?: {
    firstName1?: string;
    firstName2?: string;
    firstName3?: string;
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
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    avatarCount?: number;
    customText?: string;
    selectedStyle?: number;
    fontSizeDesktop?: string;
    fontSizeTablet?: string;
    fontSizeMobile?: string;
    brandNameBold?: boolean;
    useFullWidth?: boolean;
    textWrapDesktop?: number;
    textWrapTablet?: number;
    textWrapMobile?: number;
    showBackground?: boolean;
    backgroundOpacity?: number;
    namesFormatBold?: boolean;
    styleSettings?: {
      [key: number]: any
    };
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
    name: 'Style 1',
    backgroundColor: '#f7f7f7',
    textColor: '#000000',
    avatarBorderColor: '#1EA1F3',
    borderRadius: '12px',
    padding: '15px',
    avatarCount: 2,
    badgePosition: 'overAvatar', // Badge is positioned over avatar by default
    customText: 'und <strong>12.400+</strong> weitere Kunden nutzen unser <strong>Tool erfolgreich</strong>',
    avatarImage1: '/Sections/Social_Proof/1.jpg',
    avatarImage2: '/Sections/Social_Proof/2.jpg',
  },
  {
    name: 'Style 2',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    avatarBorderColor: '#655C55',
    borderRadius: '12px',
    padding: '15px',
    avatarCount: 3,
    badgePosition: 'standard',
    customText: 'und <strong>22.910+</strong> weitere Kunden nutzen unsere <strong>Sections</strong>',
    avatarImage1: '/Sections/Social_Proof/1.jpg',
    avatarImage2: '/Sections/Social_Proof/2.jpg',
    avatarImage3: '/Sections/Social_Proof/3.jpg',
    showBackground: false,
  },
  {
    name: 'Style 3',
    backgroundColor: '#655C55',
    textColor: '#ffffff',
    avatarBorderColor: '#ffffff',
    borderRadius: '12px',
    padding: '15px',
    avatarCount: 1,
    badgePosition: 'overAvatar',
    customText: 'und <strong>1.100+</strong> Kunden nutzen unsere <strong>Sections</strong>',
    avatarImage1: '/Sections/Social_Proof/1.jpg',
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
  
  // State to store style-specific settings
  const [styleSettings, setStyleSettings] = useState<{
    [key: number]: any
  }>(safeInitialData.styleSettings || {})
  
  // Stable tutorial opener using useCallback
  const handleShowTutorial = useCallback(() => {
    setShowTutorial(true);
  }, []);

  // Make showTutorial globally accessible for the EditorLayout button
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).showTutorial = handleShowTutorial;
      
      return () => {
        // Cleanup on unmount to prevent memory leaks
        if ((window as any).showTutorial === handleShowTutorial) {
          delete (window as any).showTutorial;
        }
      };
    }
  }, [handleShowTutorial]);
  
  // Load saved style settings if available
  useEffect(() => {
    console.log('🔄 SocialProof: Initial load with data', safeInitialData);
    
    if (safeInitialData.styleSettings) {
      setStyleSettings(safeInitialData.styleSettings);
    }
    
    // Mark component as loaded after a short delay to prevent premature saving
    setTimeout(() => {
      setIsLoaded(true);
      console.log('🔄 SocialProof: Component marked as loaded');
    }, 500);
  }, []);
  
  // Helper for range sliders - we don't prevent default to allow slider functionality
  const handleRangeInput = (e: React.MouseEvent) => {
    e.stopPropagation();  // Only stop propagation, not preventDefault
  };
  
  // Style template selection - force style 0 as default
  const [selectedStyle, setSelectedStyle] = useState<number>(safeInitialData.selectedStyle !== undefined ? safeInitialData.selectedStyle : 0);
  
  // Section content
  const [firstName1, setFirstName1] = useState(safeInitialData.firstName1 || 'Tim')
  const [firstName2, setFirstName2] = useState(safeInitialData.firstName2 || 'Stephan')
  const [firstName3, setFirstName3] = useState(safeInitialData.firstName3 || 'Ben')
  const [customText, setCustomText] = useState(safeInitialData.customText || 'und <strong>12.400+</strong> weitere Kunden nutzen unser <strong>Tool erfolgreich</strong>')
  // Style 1 by default uses avatar 1 and 2
  const [avatarImage1, setAvatarImage1] = useState(safeInitialData.avatarImage1 || '/Sections/Social_Proof/1.jpg')
  const [avatarImage2, setAvatarImage2] = useState(safeInitialData.avatarImage2 || '/Sections/Social_Proof/2.jpg')
  const [avatarImage3, setAvatarImage3] = useState(safeInitialData.avatarImage3 || '/Sections/Social_Proof/3.jpg')
  const [verifiedImage, setVerifiedImage] = useState(safeInitialData.verifiedImage || 'https://cdn.shopify.com/s/files/1/0818/2123/7577/files/insta-blue.png?v=1738073828')
  const [showBadge, setShowBadge] = useState(safeInitialData.showBadge !== undefined ? safeInitialData.showBadge : true)
  const [badgePosition, setBadgePosition] = useState(safeInitialData.badgePosition || 'standard')
  const [avatarCount, setAvatarCount] = useState(safeInitialData.avatarCount || 2)

  // Section styling - ensure defaults from style template 0
  const [backgroundColor, setBackgroundColor] = useState(styleTemplates[0].backgroundColor)
  const [backgroundOpacity, setBackgroundOpacity] = useState(safeInitialData.backgroundOpacity || 100)
  const [avatarBorderColor, setAvatarBorderColor] = useState(styleTemplates[0].avatarBorderColor)
  const [textColor, setTextColor] = useState('#000000') // Force black as default
  const [showBackground, setShowBackground] = useState(safeInitialData.showBackground !== undefined ? safeInitialData.showBackground : true)
  const [showBreakOnLarge, setShowBreakOnLarge] = useState(safeInitialData.showBreakOnLarge !== undefined ? safeInitialData.showBreakOnLarge : true)
  const [avatarSize, setAvatarSize] = useState(safeInitialData.avatarSize || '32px')
  const [borderRadius, setBorderRadius] = useState(safeInitialData.borderRadius || styleTemplates[0].borderRadius)
  const [fontSizeDesktop, setFontSizeDesktop] = useState(safeInitialData.fontSizeDesktop || '12px')
  const [fontSizeTablet, setFontSizeTablet] = useState(safeInitialData.fontSizeTablet || '11px')
  const [fontSizeMobile, setFontSizeMobile] = useState(safeInitialData.fontSizeMobile || '9px')
  const [brandNameBold, setBrandNameBold] = useState(safeInitialData.brandNameBold !== undefined ? safeInitialData.brandNameBold : true)
  const [namesFormatBold, setNamesFormatBold] = useState(safeInitialData.namesFormatBold !== undefined ? safeInitialData.namesFormatBold : true)
  const [useFullWidth, setUseFullWidth] = useState(safeInitialData.useFullWidth !== undefined ? safeInitialData.useFullWidth : true)
  
  // Text wrapping settings
  const [textWrapDesktop, setTextWrapDesktop] = useState(safeInitialData.textWrapDesktop || 40)
  const [textWrapTablet, setTextWrapTablet] = useState(safeInitialData.textWrapTablet || 55)
  const [textWrapMobile, setTextWrapMobile] = useState(safeInitialData.textWrapMobile || 70)
  
  // Padding settings
  const [useSinglePadding, setUseSinglePadding] = useState(true)
  const [padding, setPadding] = useState(safeInitialData.padding || styleTemplates[0].padding)
  const [paddingTop, setPaddingTop] = useState(safeInitialData.paddingTop || '15')
  const [paddingRight, setPaddingRight] = useState(safeInitialData.paddingRight || '15')
  const [paddingBottom, setPaddingBottom] = useState(safeInitialData.paddingBottom || '15')
  const [paddingLeft, setPaddingLeft] = useState(safeInitialData.paddingLeft || '15')
  
  // Margin settings
  const [marginTop, setMarginTop] = useState(safeInitialData.marginTop || '0')
  const [marginRight, setMarginRight] = useState(safeInitialData.marginRight || '0')
  const [marginBottom, setMarginBottom] = useState(safeInitialData.marginBottom || '12')
  const [marginLeft, setMarginLeft] = useState(safeInitialData.marginLeft || '0')
  
  // Initialize component and apply correct template based on selected style
  useEffect(() => {
    console.log('🔄 SocialProof: Initial style application', { selectedStyle, initialData: safeInitialData });
    
    // Apply the template with a short delay to ensure all state is initialized
    const timer = setTimeout(() => {
      // Only apply the template if we actually have initialData
      if (safeInitialData.selectedStyle !== undefined) {
        console.log('🔄 SocialProof: Using saved style:', safeInitialData.selectedStyle);
        applyStyleTemplate(null, selectedStyle);
      } else {
        // Default to style 0 if no saved style
        console.log('🔄 SocialProof: No saved style found, using default style 0');
        applyStyleTemplate(null, 0);
      }
      
      // Mark component as fully loaded after style is applied
      setTimeout(() => {
        setIsLoaded(true);
        console.log('🔄 SocialProof: Component marked as fully loaded');
      }, 200);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
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
  
  // Function to save current settings for a specific style
  const saveStyleSettings = (styleIndex: number) => {
    // Skip saving if we're in initial loading
    if (!isLoaded) return;
    
    // Create a copy of the current settings for the style
    const styleData = {
      backgroundColor,
      backgroundOpacity,
      textColor,
      avatarBorderColor,
      borderRadius,
      padding,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      showBackground,
      showBreakOnLarge,
      avatarSize,
      avatarCount,
      badgePosition,
      showBadge,
      fontSizeDesktop,
      fontSizeTablet,
      fontSizeMobile,
      textWrapDesktop,
      textWrapTablet,
      textWrapMobile,
      customText,
      firstName1,
      firstName2,
      firstName3,
      avatarImage1,
      avatarImage2,
      avatarImage3,
      brandNameBold,
      namesFormatBold,
      useFullWidth,
    };
    
    // Update the style settings
    setStyleSettings(prev => {
      const newSettings = {...prev};
      newSettings[styleIndex] = styleData;
      return newSettings;
    });
    
    // Trigger data update to parent immediately if not triggered by effect
    if (!isEffectTriggered) {
      setTimeout(() => {
        if (onDataChange) {
          // Create a new settings object with the updated data
          const newStyleSettings = {...styleSettings};
          newStyleSettings[styleIndex] = styleData;
          
          const updatedSectionData = {
            ...sectionData,
            styleSettings: newStyleSettings
          };
          onDataChange(updatedSectionData);
          console.log('🔄 SocialProof: Immediate save triggered for style', styleIndex + 1);
        }
      }, 50);
    }
  };
  
  // Reset a style to its default settings
  const resetStyleToDefault = (styleIndex: number, e?: React.MouseEvent) => {
    // Prevent default propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Get the template defaults
    const template = styleTemplates[styleIndex];
    
    // Remove custom settings for this style
    setStyleSettings(prev => {
      const newSettings = {...prev};
      delete newSettings[styleIndex];
      return newSettings;
    });
    
    // Apply the default template
    applyStyleTemplate(null, styleIndex, true);
    
    // Notify user
    alert('Die Einstellungen für Stil ' + (styleIndex + 1) + ' wurden auf Standard zurückgesetzt.');
    
    // Trigger immediate save with new styleSettings
    setTimeout(() => {
      if (onDataChange) {
        // Get the latest styleSettings state
        const newStyleSettings = {...styleSettings};
        // The reset already removed this style's custom settings
        
        const updatedData = {
          ...sectionData,
          styleSettings: newStyleSettings
        };
        onDataChange(updatedData);
        console.log('🔄 SocialProof: Reset to defaults triggered for style', styleIndex + 1);
      }
    }, 100);
  };

  // Apply style template
  const applyStyleTemplate = (e: React.MouseEvent | null, index: number, isReset = false) => {
    // Prevent default to avoid scrolling if event exists
    if (e) e.preventDefault();
    
    console.log('🔄 SocialProof: Applying template', { index: index + 1, isReset, hasSettings: !!styleSettings[index] });
    
    // Save current style settings before switching
    if (!isReset && selectedStyle !== index && isLoaded) {
      saveStyleSettings(selectedStyle);
      console.log('💾 SocialProof: Saved settings for previous style', selectedStyle + 1);
      
      // Ensure the selectedStyle change is saved to parent
      if (onDataChange) {
        // Create a fresh copy of current style settings including the newly saved style
        const currentStyleData = {
          backgroundColor, backgroundOpacity, textColor, avatarBorderColor,
          borderRadius, padding, paddingTop, paddingRight, paddingBottom, paddingLeft,
          marginTop, marginRight, marginBottom, marginLeft, showBackground,
          showBreakOnLarge, avatarSize, avatarCount, badgePosition, showBadge,
          fontSizeDesktop, fontSizeTablet, fontSizeMobile,
          textWrapDesktop, textWrapTablet, textWrapMobile,
          customText, firstName1, firstName2, firstName3,
          avatarImage1, avatarImage2, avatarImage3,
          brandNameBold, namesFormatBold, useFullWidth
        };
        
        // Update style settings with current style
        const updatedStyleSettings = {...styleSettings};
        updatedStyleSettings[selectedStyle] = currentStyleData;
        
        // Create a complete data update with the new selectedStyle
        const completeData = {
          firstName1,
          firstName2,
          firstName3,
          backgroundColor,
          backgroundOpacity,
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
          marginTop,
          marginRight,
          marginBottom,
          marginLeft,
          avatarCount,
          customText,
          selectedStyle: index, // Set the new style index
          fontSizeDesktop,
          fontSizeTablet,
          fontSizeMobile,
          brandNameBold,
          namesFormatBold,
          useFullWidth,
          textWrapDesktop,
          textWrapTablet,
          textWrapMobile,
          showBackground,
          styleSettings: updatedStyleSettings
        };
        
        onDataChange(completeData);
      }
    }
    
    // Check if we have saved settings for this style
    const savedSettings = styleSettings[index];
    
    if (savedSettings && !isReset) {
      // Apply saved settings with fallbacks to prevent errors
      setBackgroundColor(savedSettings.backgroundColor || styleTemplates[index].backgroundColor);
      setBackgroundOpacity(savedSettings.backgroundOpacity || 100);
      setTextColor(savedSettings.textColor || (index === 2 ? '#ffffff' : '#000000'));
      setAvatarBorderColor(savedSettings.avatarBorderColor || styleTemplates[index].avatarBorderColor);
      setBorderRadius(savedSettings.borderRadius || styleTemplates[index].borderRadius);
      setPadding(savedSettings.padding || styleTemplates[index].padding);
      setPaddingTop(savedSettings.paddingTop || '15');
      setPaddingRight(savedSettings.paddingRight || '15');
      setPaddingBottom(savedSettings.paddingBottom || '15');
      setPaddingLeft(savedSettings.paddingLeft || '15');
      setMarginTop(savedSettings.marginTop || '0');
      setMarginRight(savedSettings.marginRight || '0');
      setMarginBottom(savedSettings.marginBottom || '12');
      setMarginLeft(savedSettings.marginLeft || '0');
      setShowBackground(savedSettings.showBackground !== undefined ? savedSettings.showBackground : (index !== 1));
      setShowBreakOnLarge(savedSettings.showBreakOnLarge !== undefined ? savedSettings.showBreakOnLarge : true);
      setAvatarSize(savedSettings.avatarSize || '32px');
      setAvatarCount(savedSettings.avatarCount || styleTemplates[index].avatarCount || 2);
      setBadgePosition(savedSettings.badgePosition || styleTemplates[index].badgePosition || 'standard');
      setShowBadge(savedSettings.showBadge !== undefined ? savedSettings.showBadge : true);
      setFontSizeDesktop(savedSettings.fontSizeDesktop || '12px');
      setFontSizeTablet(savedSettings.fontSizeTablet || '11px');
      setFontSizeMobile(savedSettings.fontSizeMobile || '9px');
      setTextWrapDesktop(savedSettings.textWrapDesktop || (index === 2 ? 75 : 40));
      setTextWrapTablet(savedSettings.textWrapTablet || 55);
      setTextWrapMobile(savedSettings.textWrapMobile || 70);
      setCustomText(savedSettings.customText || styleTemplates[index].customText || 'und <strong>12.400+</strong> weitere Kunden nutzen unser <strong>Tool erfolgreich</strong>');
      setFirstName1(savedSettings.firstName1 || 'Tim');
      setFirstName2(savedSettings.firstName2 || (index === 1 ? 'Anna' : 'Stephan'));
      setFirstName3(savedSettings.firstName3 || 'Ben');
      setAvatarImage1(savedSettings.avatarImage1 || styleTemplates[index].avatarImage1 || '/Sections/Social_Proof/1.jpg');
      setAvatarImage2(savedSettings.avatarImage2 || styleTemplates[index].avatarImage2 || '/Sections/Social_Proof/2.jpg');
      setAvatarImage3(savedSettings.avatarImage3 || styleTemplates[index].avatarImage3 || '/Sections/Social_Proof/3.jpg');
      setBrandNameBold(savedSettings.brandNameBold !== undefined ? savedSettings.brandNameBold : true);
      setNamesFormatBold(savedSettings.namesFormatBold !== undefined ? savedSettings.namesFormatBold : true);
      setUseFullWidth(savedSettings.useFullWidth !== undefined ? savedSettings.useFullWidth : true);
      
      console.log('🔄 SocialProof: Loaded saved settings for style', index + 1);
    } else {
      // Apply default template
      const template = styleTemplates[index];
      
      // Apply all the properties from the template
      setBackgroundColor(template.backgroundColor);
      setTextColor(index === 2 ? '#ffffff' : '#000000');
      setAvatarBorderColor(template.avatarBorderColor);
      setBorderRadius(template.borderRadius);
      setPadding(template.padding);
      
      // Set showBackground based on template or style
      if (template.showBackground !== undefined) {
        setShowBackground(template.showBackground);
      } else {
        setShowBackground(index !== 1); // All styles except Style 2 have backgrounds
      }
      
      // Set custom text if provided in the template
      if (template.customText) {
        setCustomText(template.customText);
      }
      
      // Set avatar count if specified in the template
      if (template.avatarCount !== undefined) {
        setAvatarCount(template.avatarCount);
      }
      
      // Set badge position from template or based on style
      if (template.badgePosition) {
        setBadgePosition(template.badgePosition);
      } else {
        switch(index) {
          case 0: // Style 1
            setBadgePosition('overAvatar');
            break;
          case 1: // Style 2
            setBadgePosition('standard');
            break;
          case 2: // Style 3
            setBadgePosition('overAvatar');
            break;
          default:
            setBadgePosition('standard');
        }
      }
      
      // Set specific names based on style
      switch(index) {
        case 0: // Style 1
          setFirstName1('Tim');
          setFirstName2('Stephan');
          break;
        case 1: // Style 2
          setFirstName1('Tim');
          setFirstName2('Anna');
          setFirstName3('Ben');
          break;
        case 2: // Style 3
          setFirstName1('Tim');
          break;
      }
      
      // Set avatar images if provided in the template
      if (template.avatarImage1) {
        setAvatarImage1(template.avatarImage1);
      }
      if (template.avatarImage2) {
        setAvatarImage2(template.avatarImage2);
      }
      if (template.avatarImage3) {
        setAvatarImage3(template.avatarImage3);
      }
      
      // Always update both single padding and individual padding values
      // This ensures consistent state across all padding-related variables
      const paddingValue = template.padding.replace('px', '');
      setPaddingTop(paddingValue);
      setPaddingRight(paddingValue);
      setPaddingBottom(paddingValue);
      setPaddingLeft(paddingValue);
      
      // Reset margin values
      setMarginTop('0');
      setMarginRight('0');
      setMarginBottom('12');
      setMarginLeft('0');
      
      // Set single padding mode to ensure UI is consistent with selection
      setUseSinglePadding(true);
      
      // Set text wrap for desktop based on style
      if (index === 2) { // Style 3
        setTextWrapDesktop(75); // Set desktop text wrap to 75% for Style 3
      } else {
        setTextWrapDesktop(40); // Default for other styles
      }
    }
    
    // Always update the style index
    setSelectedStyle(index);
    
    // After applying a new style template, trigger a save
    // to ensure that the style selection is persisted
    if (isLoaded && onDataChange) {
      setTimeout(() => {
        // Create a complete data update including the current selected style
        const completeData = {
          ...sectionData,
          selectedStyle: index // Ensure the selected style is saved
        };
        
        onDataChange(completeData);
        console.log('🔄 SocialProof: Saved style selection', index + 1);
      }, 300);
    }
  };
  
  // Define sectionData object for reuse
  const sectionData = {
    firstName1,
    firstName2,
    firstName3,
    backgroundColor,
    backgroundOpacity,
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
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    avatarCount,
    customText,
    selectedStyle,
    fontSizeDesktop,
    fontSizeTablet,
    fontSizeMobile,
    brandNameBold,
    namesFormatBold,
    useFullWidth,
    textWrapDesktop,
    textWrapTablet,
    textWrapMobile,
    showBackground,
    styleSettings // Include styleSettings in sectionData
  };
  
  // This function conditionally applies background styles and classes based on showBackground setting
  const getBackgroundStyles = (isImportant = false) => {
    // Return empty string if showBackground is false
    if (!showBackground) return '';
    
    // Convert hex color to rgba with opacity
    const hexToRgba = (hex: string, opacity: number) => {
      hex = hex.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
    };
    
    const important = isImportant ? ' !important' : '';
    const bgColor = hexToRgba(backgroundColor, backgroundOpacity);
    
    return `
      background-color: ${bgColor}${important};
      box-shadow: ${backgroundOpacity > 50 ? `0 2px 4px rgba(0, 0, 0, 0.1)${important}` : ''};
    `;
  };
  
  // Function to get the social-proof-preview class based on showBackground
  const getSocialProofClass = () => {
    return showBackground ? 'social-proof-preview' : 'social-proof-preview-no-bg';
  };
  
  // NOTE: This function should be used in all HTML generation for consistent styling
  // Usage example in preview:
  // <div style="... ${getBackgroundStyles(true)} ...">
  //
  // Usage example in output HTML:
  // <div style="... ${getBackgroundStyles(false)} ...">
  //
  // This ensures that the background is only shown when showBackground is true

  // Flag to track if data change is triggered by effect
  const [isEffectTriggered, setIsEffectTriggered] = useState(false);
  
  // Flag to track if component is fully loaded
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Function to manually trigger data update to parent
  const triggerDataUpdate = useCallback(() => {
    // Get current settings for the selected style
    if (isLoaded) {
      // Create a settings object for current style
      const currentStyleData = {
        backgroundColor,
        backgroundOpacity,
        textColor,
        avatarBorderColor,
        borderRadius,
        padding,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        showBackground,
        showBreakOnLarge,
        avatarSize,
        avatarCount,
        badgePosition,
        showBadge,
        fontSizeDesktop,
        fontSizeTablet,
        fontSizeMobile,
        textWrapDesktop,
        textWrapTablet,
        textWrapMobile,
        customText,
        firstName1,
        firstName2,
        firstName3,
        avatarImage1,
        avatarImage2,
        avatarImage3,
        brandNameBold,
        namesFormatBold,
        useFullWidth,
      };
      
      // Create a fresh copy of style settings
      const newStyleSettings = {...styleSettings};
      newStyleSettings[selectedStyle] = currentStyleData;
      
      // Save the updated settings in the component state
      setStyleSettings(newStyleSettings);
      
      if (onDataChange) {
        // Create a separate object for data update to avoid reference issues
        const updatedData = {
          firstName1,
          firstName2,
          firstName3,
          backgroundColor,
          backgroundOpacity,
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
          marginTop,
          marginRight,
          marginBottom,
          marginLeft,
          avatarCount,
          customText,
          selectedStyle,
          fontSizeDesktop,
          fontSizeTablet,
          fontSizeMobile,
          brandNameBold,
          namesFormatBold,
          useFullWidth,
          textWrapDesktop,
          textWrapTablet,
          textWrapMobile,
          showBackground,
          styleSettings: newStyleSettings
        };
        
        onDataChange(updatedData);
        console.log('🔄 SocialProof: Data update triggered', { selectedStyle: selectedStyle + 1 });
      }
    }
  }, [onDataChange, sectionData, selectedStyle,
    backgroundColor, textColor, avatarBorderColor, borderRadius, padding, 
    paddingTop, paddingRight, paddingBottom, paddingLeft,
    marginTop, marginRight, marginBottom, marginLeft,
    showBackground, avatarSize, badgePosition, showBadge, 
    fontSizeDesktop, fontSizeTablet, fontSizeMobile,
    textWrapDesktop, textWrapTablet, textWrapMobile,
    customText, firstName1, firstName2, firstName3,
    avatarImage1, avatarImage2, avatarImage3,
    brandNameBold, namesFormatBold, useFullWidth, isLoaded]);

  // Expose the update function globally so the save button can call it
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).triggerSocialProofUpdate = triggerDataUpdate;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).triggerSocialProofUpdate;
      }
    };
  }, [triggerDataUpdate]);
  
  // Save current style settings whenever any style-related state changes
  useEffect(() => {
    if (!isLoaded) return;
    
    // Set effect flag to prevent duplicate updates
    setIsEffectTriggered(true);
    
    // Small delay to avoid too many updates
    const timer = setTimeout(() => {
      saveStyleSettings(selectedStyle);
      
      if (onDataChange) {
        // Create a fresh copy of current settings to ensure proper serialization
        const currentStyleData = {
          backgroundColor,
          backgroundOpacity,
          textColor,
          avatarBorderColor,
          borderRadius,
          padding,
          paddingTop,
          paddingRight,
          paddingBottom,
          paddingLeft,
          marginTop,
          marginRight,
          marginBottom,
          marginLeft,
          showBackground,
          showBreakOnLarge,
          avatarSize,
          avatarCount,
          badgePosition,
          showBadge,
          fontSizeDesktop,
          fontSizeTablet,
          fontSizeMobile,
          textWrapDesktop,
          textWrapTablet,
          textWrapMobile,
          customText,
          firstName1,
          firstName2,
          firstName3,
          avatarImage1,
          avatarImage2,
          avatarImage3,
          brandNameBold,
          namesFormatBold,
          useFullWidth,
        };
        
        // Create a fresh copy of styleSettings
        const newStyleSettings = {...styleSettings};
        newStyleSettings[selectedStyle] = currentStyleData;
        
        // Update the data with fresh objects
        const updatedData = {
          ...sectionData,
          styleSettings: newStyleSettings,
          selectedStyle // Ensure selectedStyle is saved
        };
        
        onDataChange(updatedData);
        console.log('⚡ SocialProof: Auto-save triggered for style', selectedStyle + 1);
      }
      
      // Reset effect flag
      setIsEffectTriggered(false);
    }, 500);
    
    return () => {
      clearTimeout(timer);
      setIsEffectTriggered(false);
    };
  }, [
    backgroundColor, textColor, avatarBorderColor, borderRadius, padding, 
    paddingTop, paddingRight, paddingBottom, paddingLeft,
    marginTop, marginRight, marginBottom, marginLeft,
    showBackground, avatarSize, badgePosition, showBadge, 
    fontSizeDesktop, fontSizeTablet, fontSizeMobile,
    textWrapDesktop, textWrapTablet, textWrapMobile,
    customText, firstName1, firstName2, firstName3,
    avatarImage1, avatarImage2, avatarImage3,
    brandNameBold, namesFormatBold, useFullWidth
  ]);

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
      `<img src="${verifiedImage}" alt="Verifiziert" style="height: ${badgeSize}; max-width: none; margin: 0 1px; vertical-align: baseline; transform: translateY(-1px); object-fit: contain; display: inline;" onerror="this.style.display='none'">` : 
      '<span style="margin: 0 1px;"> </span>';

    switch(avatarCount) {
      case 1:
        if (position === 'afterFirst') {
          return `${firstName1}${badgeElement}`;
        }
        return firstName1;
      case 2:
        if (position === 'afterFirst') {
          return `${firstName1}${badgeElement}, ${firstName2} `;
        }
        return `${firstName1}, ${firstName2}`;
      case 3:
        if (position === 'afterFirst') {
          return `${firstName1}${badgeElement}, ${firstName2}, ${firstName3} `;
        }
        return `${firstName1}, ${firstName2}, ${firstName3}`;
      default:
        if (position === 'afterFirst') {
          return `${firstName1}${badgeElement}, ${firstName2} `;
        }
        return `${firstName1}, ${firstName2}`;
    }
  };

  // Get badge or spacing for non-afterFirst positions
  const getBadgeOrSpacing = (position: string, isMobile: boolean = false) => {
    const badgeSize = isMobile ? '13px' : '14px';
    
    if (position === 'standard') {
      return showBadge ? (
        <img 
          src={verifiedImage} 
          alt="Verifiziert" 
          style={{
            height: badgeSize,
            maxWidth: 'none',
            margin: '0 1px',
            verticalAlign: 'baseline',
            transform: 'translateY(-1px)',
            objectFit: 'contain',
            display: 'inline'
          }}
        />
      ) : (
        <span style={{ margin: '0 1px' }}> </span>
      );
    }
    
    // For afterFirst and overAvatar positions, always add spacing between names and text
    if (position === 'afterFirst' || position === 'overAvatar') {
      return <span style={{ margin: '0 1px' }}> </span>;
    }
    
    return null;
  };
  
  // Format the custom text for the preview
  const getFormattedText = () => {
    // Return HTML directly since we're now using contentEditable that produces HTML
    return customText;
  };
  
  // Verbesserte HTML-Text-Splitting Funktion die Formatierung erhält
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
      
      // Wenn der Text komplett formatiert ist (z.B. <em>ganzer text</em>), 
      // dann soll die Formatierung auf beide Teile angewendet werden
      const isCompletelyWrapped = htmlText.match(/^<(\w+)[^>]*>.*<\/\1>$/);
      
      if (isCompletelyWrapped) {
        const tagName = isCompletelyWrapped[1];
        const tagStart = htmlText.match(/^<[^>]+>/)?.[0] || '';
        const tagEnd = `</${tagName}>`;
        const innerText = htmlText.replace(/^<[^>]+>|<\/[^>]+>$/g, '');
        
        // Teile den inneren Text auf
        const innerWords = innerText.split(/\s+/);
        const innerFirstPart = innerWords.slice(0, splitIndex).join(' ');
        const innerLastPart = innerWords.slice(splitIndex).join(' ');
        
        return {
          firstPart: `${tagStart}${innerFirstPart}${tagEnd}`,
          lastPart: `${tagStart}${innerLastPart}${tagEnd}`
        };
      }
      
      // Standard-Approach für gemischten Content
      const lastWordsText = lastPartWords.join(' ');
      let splitPosition = htmlText.lastIndexOf(lastWordsText);
      
      // Falls nicht gefunden, versuche es mit dem letzten Wort
      if (splitPosition === -1 && lastPartWords.length > 0) {
        splitPosition = htmlText.lastIndexOf(lastPartWords[lastPartWords.length - 1]);
      }
      
      if (splitPosition !== -1) {
        const firstPart = htmlText.substring(0, splitPosition).trim();
        const lastPart = htmlText.substring(splitPosition).trim();
        
        return {
          firstPart: firstPart,
          lastPart: lastPart
        };
      }
      
      // Fallback: Split nach Plain-Text (ohne Formatierung)
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
  
  // Different code output types and platforms
  const [codeOutputType, setCodeOutputType] = useState<'standalone'>('standalone');
  const [platform, setPlatform] = useState<'shopify' | 'shopware' | 'wordpress'>('shopify');

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

  // Stable tutorial handlers using useCallback
  const handleTutorialClose = useCallback(() => {
    setShowTutorial(false);
  }, []);

  const handleTutorialOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      setShowTutorial(false);
    }
  }, []);

  const handleTutorialButtonClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTutorial(false);
  }, []);

  // Tutorial Modal
  const TutorialModal = useCallback(() => {
    if (!showTutorial) return null;

    return (
      <div 
        className="fixed inset-0 overflow-y-auto"
        style={{ 
          zIndex: 2147483647, // Maximum z-index value
          isolation: 'isolate',
          pointerEvents: 'auto'
        }}
      >
        <div 
          className="flex min-h-full items-center justify-center p-4"
          onMouseDown={handleTutorialOverlayClick}
        >
          <div className="fixed inset-0 bg-black/50" onMouseDown={handleTutorialOverlayClick}></div>
          <div 
            className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            style={{ zIndex: 1 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-[#1c2838]">
                    Social Proof Builder - Anleitung
                  </h3>
                  <p className="text-gray-600 mt-1">In 3 Schritten zu mehr Conversions</p>
                </div>
                <button
                  type="button"
                  onMouseDown={handleTutorialButtonClick}
                  className="text-gray-400 hover:text-gray-600 rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {/* Quick Start Steps */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="bg-[#1c2838] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mb-3">1</div>
                  <h4 className="font-semibold text-[#1c2838] mb-2">Stil wählen</h4>
                  <p className="text-sm text-gray-600">Wähle einen der 3 vordefinierten Designs als Basis</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="bg-[#1c2838] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mb-3">2</div>
                  <h4 className="font-semibold text-[#1c2838] mb-2">Anpassen</h4>
                  <p className="text-sm text-gray-600">Namen, Avatare, Text und Badge-Position konfigurieren</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="bg-[#1c2838] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mb-3">3</div>
                  <h4 className="font-semibold text-[#1c2838] mb-2">Code kopieren</h4>
                  <p className="text-sm text-gray-600">Fertigen Code in deine Website einfügen</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-[#1c2838] mb-3">Wichtige Features:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-[#1c2838] mb-2">📱 Responsive Design</h5>
                      <p className="text-sm text-gray-600">Optimiert für Desktop und Mobile</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-[#1c2838] mb-2">🏷️ Flexible Badges</h5>
                      <p className="text-sm text-gray-600">3 Positionen: Standard, Nach erstem Namen, Über Avatar</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-[#1c2838] mb-2">🎨 Vollständig anpassbar</h5>
                      <p className="text-sm text-gray-600">Farben, Größen, Abstände und mehr</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-[#1c2838] mb-2">⚡ Schnell & SEO-optimiert</h5>
                      <p className="text-sm text-gray-600">Minimaler Code für beste Performance</p>
                    </div>
                  </div>
                </div>

                {/* Pro Tips */}
                <div>
                  <h4 className="font-semibold text-[#1c2838] mb-3">Pro-Tipps:</h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Verwende echte Namen und Zahlen für mehr Glaubwürdigkeit</li>
                      <li>• Platziere die Social Proof Box über dem "In den Warenkorb" Button</li>
                      <li>• Teste verschiedene Badge-Positionen für optimale Conversion</li>
                      <li>• Nutze 2-3 Avatare für den besten visuellen Effekt</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-center">
                <button
                  type="button"
                  onMouseDown={handleTutorialButtonClick}
                  className="bg-[#1c2838] text-white px-6 py-2 rounded-lg hover:bg-[#1c2838]/90 transition-colors"
                >
                  Verstanden, loslegen!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [showTutorial, handleTutorialOverlayClick, handleTutorialButtonClick]);

  const settings = (
    <div className="space-y-6">
      {/* Style Templates */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold mb-3 text-[#1c2838]">Vordefinierter Stil</h3>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {styleTemplates.map((template, index) => (
            <button
              key={index}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); applyStyleTemplate(e, index); }}
              className={`border rounded p-3 h-16 flex items-center justify-center text-xs transition
                ${selectedStyle === index ? 'border-[#1c2838] shadow-sm bg-[#1c2838]/5' : 'border-gray-200 hover:bg-gray-50'}`}
              style={{ 
                backgroundColor: selectedStyle === index ? backgroundColor : template.backgroundColor,
                color: selectedStyle === index ? textColor : (index === 2 ? '#fff' : '#000'),
                borderRadius: selectedStyle === index ? borderRadius : template.borderRadius
              }}
            >
              Style {index + 1}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">Wähle einen vordefinierten Stil als Ausgangspunkt.</p>
          <button
            onClick={(e) => resetStyleToDefault(selectedStyle, e)}
            className="text-xs bg-[#1c2838] text-white rounded px-3 py-1.5 hover:bg-[#364860] transition-colors flex items-center"
            aria-label="Reset zu Standard"
            title="Auf Standardeinstellungen zurücksetzen"
          >
            <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 3.11 16.44 3.11 16.44M3.11 16.44H7.63M3.11 16.44V21.44M2 12C2 6.48 6.44 2 12 2C18.67 2 22 7.56 22 7.56M22 7.56V2.56M22 7.56H17.56" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Auf Standard zurücksetzen
          </button>
        </div>
      </div>
      
      {/* Avatar Count Selection */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold mb-3 text-[#1c2838]">Avatar-Anzahl</h3>
        <div className="space-y-2">
          <div className="flex gap-2 mt-1">
            <button
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                setAvatarCount(1);
                // Reset badge position to standard if it was afterFirst (since it's not available with 1 avatar)
                if (badgePosition === 'afterFirst') {
                  setBadgePosition('standard');
                }
              }}
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
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                setAvatarCount(0);
                // Reset badge position to standard if it was afterFirst or overAvatar (since they're not available without avatars)
                if (badgePosition === 'afterFirst' || badgePosition === 'overAvatar') {
                  setBadgePosition('standard');
                }
              }}
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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setNamesFormatBold(!namesFormatBold); }}
              className="flex items-center cursor-pointer bg-transparent border-none p-0 m-0 focus:outline-none"
            >
              <div className={`relative w-9 h-5 ${namesFormatBold ? 'bg-[#1c2838]' : 'bg-gray-200'} rounded-full transition-colors`}>
                <div className={`absolute top-[2px] ${namesFormatBold ? 'right-[2px] translate-x-0' : 'left-[2px] translate-x-0'} bg-white border rounded-full h-4 w-4 transition-all`}></div>
              </div>
              <span className="ml-2 text-sm text-gray-600">Namen fett formatieren</span>
            </button>
            <HelpTooltip text="Steuert, ob die Namen der Nutzer in Fettschrift angezeigt werden." />
          </div>
        </div>
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
                  placeholder="z.B. und 12.400+ Kunden nutzen unser Tool erfolgreich"
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
                  value={avatarImage1.startsWith('/Sections/') ? '' : avatarImage1}
                  onChange={(e) => setAvatarImage1(e.target.value)}
                  className="flex-1 border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                  placeholder="https://cdn.shopify.com/s/files/1/.../dein-bild.jpg"
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
                  value={avatarImage2.startsWith('/Sections/') ? '' : avatarImage2}
                  onChange={(e) => setAvatarImage2(e.target.value)}
                  className="flex-1 border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                  placeholder="https://cdn.shopify.com/s/files/1/.../dein-bild.jpg"
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
                  value={avatarImage3.startsWith('/Sections/') ? '' : avatarImage3}
                  onChange={(e) => setAvatarImage3(e.target.value)}
                  className="flex-1 border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                  placeholder="https://cdn.shopify.com/s/files/1/.../dein-bild.jpg"
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
                  {avatarCount > 1 && (
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBadgePosition('afterFirst'); }}
                      className={`px-3 py-2 rounded text-xs text-left ${badgePosition === 'afterFirst' ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <div className="font-medium">Nach erstem Namen</div>
                      <div className="text-xs opacity-75">Direkt nach dem ersten Namen</div>
                    </button>
                  )}
                  {avatarCount > 0 && (
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBadgePosition('overAvatar'); }}
                      className={`px-3 py-2 rounded text-xs text-left ${badgePosition === 'overAvatar' ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <div className="font-medium">Über Avatar</div>
                      <div className="text-xs opacity-75">Rechts oben über dem letzten Avatar</div>
                    </button>
                  )}
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowBackground(!showBackground); }}
                className="flex items-center cursor-pointer bg-transparent border-none p-0 m-0 focus:outline-none"
              >
                <div className={`relative w-9 h-5 ${showBackground ? 'bg-[#1c2838]' : 'bg-gray-200'} rounded-full transition-colors`}>
                  <div className={`absolute top-[2px] ${showBackground ? 'right-[2px] translate-x-0' : 'left-[2px] translate-x-0'} bg-white border rounded-full h-4 w-4 transition-all`}></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">Hintergrund anzeigen</span>
              </button>
              <HelpTooltip text="Schaltet den Hintergrund der Social Proof Box ein oder aus." />
            </div>
          </div>
          
          <div className={`space-y-3 ${showBackground ? '' : 'opacity-50 pointer-events-none'}`}>
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
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            
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
              <div className="text-xs text-gray-400">ab 1300px</div>
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
              Schriftgröße (Tablet):
              <div className="text-xs text-gray-400">768px - 1299px</div>
              <div className="flex items-center mt-1">
                <input
                  type="range"
                  min="9"
                  max="19"
                  step="1"
                  value={fontSizeTablet.replace('px', '')}
                  onChange={(e) => setFontSizeTablet(`${e.target.value}px`)}
                  onClick={handleRangeInput}
                  onMouseMove={handleRangeInput}
                  className="w-full accent-[#1c2838]"
                />
                <span className="ml-2 text-xs text-gray-500 w-12">{fontSizeTablet}</span>
              </div>
            </label>
            
            <label className="block text-sm text-[#1c2838]">
              Schriftgröße (Mobil):
              <div className="text-xs text-gray-400">bis 767px</div>
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
          
          {/* Text Wrapping Controls */}
          <div className="space-y-3 mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-sm text-[#1c2838]">Textumbruch-Einstellungen</h4>
            
            <label className="block text-sm text-[#1c2838]">
              Umbruch Desktop:
              <div className="text-xs text-gray-400">ab 1300px</div>
              <div className="flex items-center mt-1">
                <input
                  type="range"
                  min="20"
                  max="85"
                  step="5"
                  value={textWrapDesktop}
                  onChange={(e) => setTextWrapDesktop(parseInt(e.target.value))}
                  onClick={handleRangeInput}
                  onMouseMove={handleRangeInput}
                  className="w-full accent-[#1c2838]"
                />
                <span className="ml-2 text-xs text-gray-500 w-12">{textWrapDesktop}%</span>
              </div>
            </label>
            
            <label className="block text-sm text-[#1c2838]">
              Umbruch Tablet:
              <div className="text-xs text-gray-400">768px - 1299px</div>
              <div className="flex items-center mt-1">
                <input
                  type="range"
                  min="20"
                  max="82"
                  step="5"
                  value={textWrapTablet}
                  onChange={(e) => setTextWrapTablet(parseInt(e.target.value))}
                  onClick={handleRangeInput}
                  onMouseMove={handleRangeInput}
                  className="w-full accent-[#1c2838]"
                />
                <span className="ml-2 text-xs text-gray-500 w-12">{textWrapTablet}%</span>
              </div>
            </label>
            
            <label className="block text-sm text-[#1c2838]">
              Umbruch Mobil:
              <div className="text-xs text-gray-400">bis 767px</div>
              <div className="flex items-center mt-1">
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={textWrapMobile}
                  onChange={(e) => setTextWrapMobile(parseInt(e.target.value))}
                  onClick={handleRangeInput}
                  onMouseMove={handleRangeInput}
                  className="w-full accent-[#1c2838]"
                />
                <span className="ml-2 text-xs text-gray-500 w-12">{textWrapMobile}%</span>
              </div>
            </label>
            
            <p className="text-xs text-gray-500 mt-2">Bestimmt ab welcher Breite der Text in die nächste Zeile umbricht. Niedrigere Werte = früher Umbruch.</p>
          </div>
        </div>
      </div>
      
      {/* Advanced Settings - Padding with visual UI */}
      <div className="border-b pb-4">
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
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-1">
                <label className="block text-sm text-[#1c2838] mb-1">Oben:</label>
                <input
                  type="text"
                  value={paddingTop}
                  onChange={(e) => setPaddingTop(e.target.value)}
                  className="w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm text-[#1c2838] mb-1">Rechts:</label>
                <input
                  type="text"
                  value={paddingRight}
                  onChange={(e) => setPaddingRight(e.target.value)}
                  className="w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm text-[#1c2838] mb-1">Unten:</label>
                <input
                  type="text"
                  value={paddingBottom}
                  onChange={(e) => setPaddingBottom(e.target.value)}
                  className="w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm text-[#1c2838] mb-1">Links:</label>
                <input
                  type="text"
                  value={paddingLeft}
                  onChange={(e) => setPaddingLeft(e.target.value)}
                  className="w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Margin Settings */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-[#1c2838]">Außenabstand (Margin)</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-1">
            <label className="block text-sm text-[#1c2838] mb-1">Oben:</label>
            <input
              type="text"
              value={marginTop}
              onChange={(e) => setMarginTop(e.target.value)}
              className="w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm text-[#1c2838] mb-1">Rechts:</label>
            <input
              type="text"
              value={marginRight}
              onChange={(e) => setMarginRight(e.target.value)}
              className="w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm text-[#1c2838] mb-1">Unten:</label>
            <input
              type="text"
              value={marginBottom}
              onChange={(e) => setMarginBottom(e.target.value)}
              className="w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm text-[#1c2838] mb-1">Links:</label>
            <input
              type="text"
              value={marginLeft}
              onChange={(e) => setMarginLeft(e.target.value)}
              className="w-full border px-3 py-1.5 rounded-md text-sm border-gray-300 focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Gib für jeden Außenabstand einen Wert ein (z.B. 0, 10, 15)</p>
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
      <div style="display: flex; align-items: center; background-color: ${backgroundColor}; padding: ${getEffectivePadding()}; border-radius: ${borderRadius}; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin: ${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px; color: ${textColor}; font-weight: 500; width: ${useFullWidth ? '100%' : 'fit-content'}; max-width: 100%; box-sizing: border-box; font-size: ${currentFontSize};">
        ${avatarCount > 0 ? `
        <div style="display: flex; align-items: center; flex-shrink: 0;">
          ${avatarCount >= 1 ? `<img src="${avatarImage1}" alt="User 1" style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; border: 2px solid ${avatarBorderColor}; object-fit: cover; flex-shrink: 0; z-index: 3; margin-right: ${avatarCount > 1 ? '-8px' : '0'};" onerror="this.style.display='none'">` : ''}
          ${avatarCount >= 2 ? `<img src="${avatarImage2}" alt="User 2" style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; border: 2px solid ${avatarBorderColor}; object-fit: cover; flex-shrink: 0; z-index: 2; margin-right: ${avatarCount >= 3 ? '-8px' : '0'};" onerror="this.style.display='none'">` : ''}
          ${avatarCount >= 3 ? `<img src="${avatarImage3}" alt="User 3" style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; border: 2px solid ${avatarBorderColor}; object-fit: cover; flex-shrink: 0; z-index: 1;" onerror="this.style.display='none'">` : ''}
        </div>` : ''}
        
        <!-- Mobile layout: 3 words on second line -->
        <div style="margin-left: ${avatarCount > 0 ? '12px' : '0'}; line-height: 1.4; display: ${previewDevice === 'mobile' ? 'block' : 'none'}; width: 100%;">
          <div style="display: block; width: 100%; margin-bottom: 2px;">
            <strong style="display: inline; font-weight: 700;">${getDisplayNames()}</strong>
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
            <strong style="display: inline; font-weight: 700;">${getDisplayNames()}</strong>
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
              className={getSocialProofClass()}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: showBackground ? backgroundColor : 'transparent',
                padding: getEffectivePadding(),
                borderRadius,
                fontFamily: 'Arial, sans-serif',
                boxShadow: showBackground ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                margin: `${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px`,
                color: textColor,
                fontWeight: 500,
                width: useFullWidth ? '100%' : 'fit-content',
                maxWidth: '100%',
                boxSizing: 'border-box',
                fontSize: previewDevice === 'mobile' ? fontSizeMobile : 
                          previewDevice === 'tablet' ? fontSizeTablet : fontSizeDesktop,
              }}
            >
              {avatarCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  {avatarCount >= 1 && (
                    <div style={{ 
                      position: badgePosition === 'overAvatar' && showBadge && avatarCount === 1 ? 'relative' : 'static',
                      marginRight: avatarCount > 1 ? '-8px' : '0',
                      zIndex: 3
                    }}>
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
                          display: 'block'
                        }}
                      />
                      {badgePosition === 'overAvatar' && showBadge && avatarCount === 1 && (
                        <img 
                          src={verifiedImage} 
                          alt="Verifiziert" 
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '2px',
                            height: previewDevice === 'mobile' ? '16px' : '18px',
                            width: 'auto',
                            zIndex: 10,
                            objectFit: 'contain',
                            transform: 'translateX(30%)'
                          }}
                        />
                      )}
                    </div>
                  )}
                  {avatarCount >= 2 && (
                    <div style={{ 
                      position: badgePosition === 'overAvatar' && showBadge && avatarCount === 2 ? 'relative' : 'static',
                      marginRight: avatarCount >= 3 ? '-8px' : '0',
                      zIndex: 2
                    }}>
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
                          display: 'block'
                        }}
                      />
                      {badgePosition === 'overAvatar' && showBadge && avatarCount === 2 && (
                        <img 
                          src={verifiedImage} 
                          alt="Verifiziert" 
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '2px',
                            height: previewDevice === 'mobile' ? '16px' : '18px',
                            width: 'auto',
                            zIndex: 10,
                            objectFit: 'contain',
                            transform: 'translateX(30%)'
                          }}
                        />
                      )}
                    </div>
                  )}
                  {avatarCount >= 3 && (
                    <div style={{ 
                      position: badgePosition === 'overAvatar' && showBadge && avatarCount === 3 ? 'relative' : 'static',
                      zIndex: 1
                    }}>
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
                          display: 'block'
                        }}
                      />
                      {badgePosition === 'overAvatar' && showBadge && avatarCount === 3 && (
                        <img 
                          src={verifiedImage} 
                          alt="Verifiziert" 
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '2px',
                            height: previewDevice === 'mobile' ? '16px' : '18px',
                            width: 'auto',
                            zIndex: 10,
                            objectFit: 'contain',
                            transform: 'translateX(30%)'
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div 
                style={{ 
                  marginLeft: avatarCount > 0 ? '12px' : '0', 
                  lineHeight: 1.4, 
                  width: previewDevice === 'mobile' ? `${textWrapMobile}%` : 
                        previewDevice === 'tablet' ? `${textWrapTablet}%` : `${textWrapDesktop}%`,
                  flexShrink: 0,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {/* Einzeiliger Text mit automatischem Umbruch */}
                <span style={{ display: 'inline' }}>
                  {badgePosition === 'afterFirst' ? (
                    <span 
                      style={{ fontWeight: namesFormatBold ? '700' : 'normal' }}
                      dangerouslySetInnerHTML={{ 
                        __html: getNamesWithBadge('afterFirst', previewDevice === 'mobile')
                      }}
                    />
                  ) : (
                    <>
                      {namesFormatBold ? (
                        <strong style={{ fontWeight: '700' }}>{getDisplayNames()}</strong>
                      ) : (
                        <span style={{ fontWeight: 'normal' }}>{getDisplayNames()}</span>
                      )}
                      {getBadgeOrSpacing(badgePosition, previewDevice === 'mobile')}
                    </>
                  )}
                  <span 
                    style={{ fontWeight: '400', wordSpacing: '0.1em', letterSpacing: '0.01em' }}
                    dangerouslySetInnerHTML={{ __html: customText }}
                  />
                </span>
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
                  {platform === 'shopify' && (
                    <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                      <li>Kopiere den generierten Code (rechts im Editor)</li>
                      <li>Gehe zu deinem Shopify Admin → Online Store → Themes</li>
                      <li>Klicke auf "Aktionen" → "Code bearbeiten" bei deinem aktiven Theme</li>
                      <li>Öffne die entsprechende Template-Datei (z.B. product.liquid)</li>
                      <li>Füge den Code an der gewünschten Stelle ein</li>
                      <li>Speichere die Änderungen</li>
                    </ol>
                  )}
                  {platform === 'shopware' && (
                    <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                      <li>Kopiere den generierten Code (rechts im Editor)</li>
                      <li>Gehe zur Administration deiner Shopware 6 Installation</li>
                      <li>Navigiere zu "Content" → "Shopping Experiences"</li>
                      <li>Bearbeite das Layout der gewünschten Seite</li>
                      <li>Füge ein HTML-Element hinzu und platziere den Code darin</li>
                      <li>Speichere die Änderungen</li>
                    </ol>
                  )}
                  {platform === 'wordpress' && (
                    <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                      <li>Kopiere den generierten Code (rechts im Editor)</li>
                      <li>Logge dich in dein WordPress-Dashboard ein</li>
                      <li>Bearbeite die gewünschte Seite oder den Beitrag</li>
                      <li>Füge einen HTML/Custom-Code Block hinzu</li>
                      <li>Füge den Code in diesen Block ein</li>
                      <li>Aktualisiere oder veröffentliche die Seite</li>
                    </ol>
                  )}
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

  // Platform code switcher
  const CodeSwitcher = () => {
    return (
      <div className="flex border rounded-md overflow-hidden">
        <button 
          className={`px-3 py-1.5 text-xs ${platform === 'shopify' ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
          onClick={() => setPlatform('shopify')}
        >
          <div className="flex items-center">
            <img src="/Company/shopify.png" alt="Shopify" className="w-3 h-3 mr-1" />
            <span>Shopify</span>
          </div>
        </button>
        <button 
          className={`px-3 py-1.5 text-xs border-l ${platform === 'shopware' ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
          onClick={() => setPlatform('shopware')}
        >
          <div className="flex items-center">
            <img src="/Company/shopware.png" alt="Shopware" className="w-3 h-3 mr-1" />
            <span>Shopware</span>
          </div>
        </button>
        <button 
          className={`px-3 py-1.5 text-xs border-l ${platform === 'wordpress' ? 'bg-[#1c2838] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
          onClick={() => setPlatform('wordpress')}
        >
          <div className="flex items-center">
            <img src="/Company/wordpress.png" alt="WordPress" className="w-3 h-3 mr-1" />
            <span>WordPress</span>
          </div>
        </button>
      </div>
    );
  };

  // Self-contained HTML code that works on multiple platforms
  const standaloneCode = (() => {
    return `<style>
    /* Clean CSS reset for social proof section */
    .social-proof-isolated {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    .social-proof-isolated *,
    .social-proof-isolated *::before,
    .social-proof-isolated *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    .social-proof-isolated img {
      border: none;
      vertical-align: middle;
      max-width: 100%;
    }

    /* Responsive text container with automatic line breaking */
    .social-proof-text {
      margin-left: ${avatarCount > 0 ? '12px' : '0'};
      line-height: 1.4;
      flex-shrink: 0;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    
    @media (max-width: 767px) {
      .social-proof-text {
        width: ${textWrapMobile}%;
      }
      .social-proof-responsive {
        font-size: ${fontSizeMobile} !important;
      }
    }
    
    @media (min-width: 768px) and (max-width: 1299px) {
      .social-proof-text {
        width: ${textWrapTablet}%;
      }
      .social-proof-responsive {
        font-size: ${fontSizeTablet} !important;
      }
    }
    
    @media (min-width: 1300px) {
      .social-proof-text {
        width: ${textWrapDesktop}%;
      }
    }
  </style>
  <div class="social-proof-isolated social-proof-responsive ${getSocialProofClass()}" style="display: flex !important; align-items: center !important; ${showBackground ? `background-color: ${backgroundColor} !important;` : ''} padding: ${getEffectivePadding()} !important; border-radius: ${borderRadius} !important; font-family: Arial, sans-serif !important; ${showBackground ? 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;' : ''} margin: ${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px !important; color: ${textColor} !important; font-weight: 500 !important; width: ${useFullWidth ? '100%' : 'fit-content'} !important; max-width: 100% !important; box-sizing: border-box !important; font-size: ${fontSizeDesktop} !important; line-height: 1.4 !important;">
    ${avatarCount > 0 ? `
    <div style="display: flex !important; align-items: center !important; flex-shrink: 0 !important;">
      ${avatarCount >= 1 ? `
        <div style="${badgePosition === 'overAvatar' && showBadge && avatarCount === 1 ? 'position: relative !important; ' : ''}margin: 0 ${avatarCount > 1 ? '-8px' : '0'} 0 0 !important; z-index: 3 !important;">
          <img src="${avatarImage1}" alt="User 1" style="width: ${avatarSize} !important; height: ${avatarSize} !important; border-radius: 50% !important; border: 2px solid ${avatarBorderColor} !important; object-fit: cover !important; flex-shrink: 0 !important; display: block !important; margin: 0 !important; padding: 0 !important;" onerror="this.style.display='none'">
          ${badgePosition === 'overAvatar' && showBadge && avatarCount === 1 ? `<img src="${verifiedImage}" alt="Verifiziert" style="position: absolute !important; top: -6px !important; right: 2px !important; transform: translateX(30%) !important; z-index: 10 !important; height: ${fontSizeDesktop === fontSizeMobile ? '16px' : '18px'} !important; width: auto !important; object-fit: contain !important; margin: 0 !important; padding: 0 !important; border: none !important;" onerror="this.style.display='none'">` : ''}
        </div>` : ''}
      ${avatarCount >= 2 ? `
        <div style="${badgePosition === 'overAvatar' && showBadge && avatarCount === 2 ? 'position: relative !important; ' : ''}margin: 0 ${avatarCount >= 3 ? '-8px' : '0'} 0 0 !important; z-index: 2 !important;">
          <img src="${avatarImage2}" alt="User 2" style="width: ${avatarSize} !important; height: ${avatarSize} !important; border-radius: 50% !important; border: 2px solid ${avatarBorderColor} !important; object-fit: cover !important; flex-shrink: 0 !important; display: block !important; margin: 0 !important; padding: 0 !important;" onerror="this.style.display='none'">
          ${badgePosition === 'overAvatar' && showBadge && avatarCount === 2 ? `<img src="${verifiedImage}" alt="Verifiziert" style="position: absolute !important; top: -6px !important; right: 2px !important; transform: translateX(30%) !important; z-index: 10 !important; height: ${fontSizeDesktop === fontSizeMobile ? '16px' : '18px'} !important; width: auto !important; object-fit: contain !important; margin: 0 !important; padding: 0 !important; border: none !important;" onerror="this.style.display='none'">` : ''}
        </div>` : ''}
      ${avatarCount >= 3 ? `
        <div style="${badgePosition === 'overAvatar' && showBadge && avatarCount === 3 ? 'position: relative !important; ' : ''}margin: 0 !important; z-index: 1 !important;">
          <img src="${avatarImage3}" alt="User 3" style="width: ${avatarSize} !important; height: ${avatarSize} !important; border-radius: 50% !important; border: 2px solid ${avatarBorderColor} !important; object-fit: cover !important; flex-shrink: 0 !important; display: block !important; margin: 0 !important; padding: 0 !important;" onerror="this.style.display='none'">
          ${badgePosition === 'overAvatar' && showBadge && avatarCount === 3 ? `<img src="${verifiedImage}" alt="Verifiziert" style="position: absolute !important; top: -6px !important; right: 2px !important; transform: translateX(30%) !important; z-index: 10 !important; height: ${fontSizeDesktop === fontSizeMobile ? '16px' : '18px'} !important; width: auto !important; object-fit: contain !important; margin: 0 !important; padding: 0 !important; border: none !important;" onerror="this.style.display='none'">` : ''}
        </div>` : ''}
    </div>` : ''}
    <div class="social-proof-text" style="padding: 0 !important;">
      <span style="display: inline !important;">
        ${badgePosition === 'afterFirst' ? 
          (namesFormatBold ? 
            `<strong style="display: inline !important; font-weight: 700 !important; margin: 0 !important; padding: 0 !important;">${getNamesWithBadge('afterFirst', false)}</strong>` : 
            `<span style="display: inline !important; margin: 0 !important; padding: 0 !important;">${getNamesWithBadge('afterFirst', false)}</span>`
          ) : 
          (namesFormatBold ? 
            `<strong style="display: inline !important; font-weight: 700 !important; margin: 0 !important; padding: 0 !important;">${getDisplayNames()}</strong>` : 
            `<span style="display: inline !important; margin: 0 !important; padding: 0 !important;">${getDisplayNames()}</span>`
          )
        }
        ${showBadge && badgePosition === 'standard' ? 
          `<img src="${verifiedImage}" alt="Verifiziert" style="height: 14px !important; max-width: none !important; margin: 0 1px !important; vertical-align: baseline !important; transform: translateY(-1px) !important; object-fit: contain !important; display: inline !important; padding: 0 !important; border: none !important;" onerror="this.style.display='none'">` : 
          (badgePosition === 'overAvatar' ? 
            '<span style="margin: 0 1px !important; display: inline !important; padding: 0 !important;"> </span>' : 
            '<span style="margin: 0 1px !important; display: inline !important; padding: 0 !important;"> </span>'
          )
        }
        <span style="font-weight: 400 !important; word-spacing: 0.1em !important; letter-spacing: 0.01em !important; display: inline !important; margin: 0 !important; padding: 0 !important;">${customText}</span>
      </span>
    </div>
  </div>`;
  })();


  // Select the code to display based on platform
  const getPlatformCode = () => {
    switch (platform) {
      case 'shopify':
        return standaloneCode;
      case 'shopware':
        // For Shopware, we use the same code but with some adaptations if needed
        return standaloneCode.replace('{% if customer %}', '{% if context.customer %}')
                           .replace('{{ shop.name }}', '{{ shopware.shop.name }}');
      case 'wordpress':
        // For WordPress, remove Liquid tags and adapt as needed
        return standaloneCode.replace(/\{\%.*?\%\}/g, '')
                           .replace(/\{\{.*?\}\}/g, '');
      default:
        return standaloneCode;
    }
  };
  
  const code = getPlatformCode();
  
  // Complete code display with the switcher
  const codeDisplay = (
    <>
      <div className="flex justify-between items-center mb-2">
        <div></div>
        <CodeSwitcher />
      </div>
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