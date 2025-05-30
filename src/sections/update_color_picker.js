const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'SocialProofSection.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add ColorPickerModal component
const colorPickerComponent = `
  // Color Picker with Opacity Modal
  const ColorPickerModal = () => {
    if (\!showColorPicker) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={() => setShowColorPicker(false)}>
        <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setShowColorPicker(false)}></div>
        <div className="bg-white rounded-lg shadow-xl w-72 overflow-hidden border border-gray-200 relative" onClick={(e) => e.stopPropagation()}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-[#1c2838]">Farbe mit Deckkraft</h3>
              <button
                onClick={() => setShowColorPicker(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#1c2838] mb-1">
                  Farbe:
                </label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-10 border rounded cursor-pointer"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-[#1c2838]">
                    Deckkraft:
                  </label>
                  <span className="text-xs text-gray-500">{backgroundOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={backgroundOpacity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setBackgroundOpacity(value);
                    if (value > 0 && \!showBackground) {
                      setShowBackground(true);
                    } else if (value === 0 && showBackground) {
                      setShowBackground(false);
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  onMouseDown={handleRangeInput}
                />
              </div>
              
              <div className="flex items-center mt-2">
                <div className="w-full h-12 border rounded-md flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-white" style={{ 
                    backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                    backgroundSize: '10px 10px',
                    backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                  }}>
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: backgroundOpacity > 0 ? \`rgba(\${parseInt(backgroundColor.slice(1, 3), 16)}, \${parseInt(backgroundColor.slice(3, 5), 16)}, \${parseInt(backgroundColor.slice(5, 7), 16)}, \${backgroundOpacity / 100})\` : 'transparent'
                      }}
                    >
                      <span className="text-xs" style={{ color: textColor }}>Vorschau</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">
                0% = Transparent (kein Hintergrund)
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowColorPicker(false)}
                className="px-4 py-1.5 bg-[#1c2838] text-white rounded-md text-sm hover:bg-[#2a3749] transition-colors"
              >
                Übernehmen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
`;

// 2. Add ColorPicker button to replace the existing color input
const colorPickerButton = `              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(true)}
                  className="flex items-center justify-between w-full border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-1 focus:ring-[#1c2838]"
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded border border-gray-300 flex-shrink-0" 
                      style={{ 
                        backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                        backgroundSize: '6px 6px',
                        backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0px'
                      }}
                    >
                      <div className="w-full h-full" style={{ backgroundColor: backgroundOpacity > 0 ? \`rgba(\${parseInt(backgroundColor.slice(1, 3), 16)}, \${parseInt(backgroundColor.slice(3, 5), 16)}, \${parseInt(backgroundColor.slice(5, 7), 16)}, \${backgroundOpacity / 100})\` : 'transparent' }}></div>
                    </div>
                    <span className="text-sm text-gray-700">{backgroundColor} ({backgroundOpacity}%)</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                    <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Klicken, um Farbe und Deckkraft einzustellen</p>`;

// Insert the ColorPickerModal component before the ImageHelpModal
content = content.replace(
  '  // Image Upload Help Modal',
  `${colorPickerComponent}\n\n  // Image Upload Help Modal`
);

// Update the state to include showColorPicker
content = content.replace(
  '  const [showTutorial, setShowTutorial] = useState(false)',
  '  const [showTutorial, setShowTutorial] = useState(false)\n  const [showColorPicker, setShowColorPicker] = useState(false)'
);

// Add ColorPickerModal to the rendered components
content = content.replace(
  '        <TutorialModal />',
  '        <TutorialModal />\n        <ColorPickerModal />'
);

// Replace the existing color and opacity controls with the new button
const oldColorControls = /              <div className="space-y-2 mt-1">[\s\S]*?<p className="text-xs text-gray-500 mt-1">0% = Transparent \(kein Hintergrund\)<\/p>/;
content = content.replace(oldColorControls, colorPickerButton);

// Update the getBackgroundStyles function to properly handle 0 opacity
content = content.replace(
  '    if (\!showBackground) return \'\';',
  '    if (\!showBackground || backgroundOpacity <= 0) return \'\';'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('SocialProofSection.tsx updated successfully\!');
