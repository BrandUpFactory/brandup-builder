const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'SocialProofSection.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove ColorPickerModal and showColorPicker state
content = content.replace(/\s+const \[showColorPicker, setShowColorPicker\] = useState\(false\)/g, '');

// 2. Remove the ColorPickerModal component
content = content.replace(/\/\/ Color Picker with Opacity Modal[\s\S]*?const ColorPickerModal = \(\) => \{[\s\S]*?return \([\s\S]*?\);\s+\};/g, '');

// 3. Remove ColorPickerModal from the JSX
content = content.replace(/<ColorPickerModal \/>/g, '');

// 4. Fix Style 1 to use avatars 1 and 2
content = content.replace(/avatarImage2: '\/Sections\/Social_Proof\/3.jpg'/g, "avatarImage2: '/Sections/Social_Proof/2.jpg'");

// 5. Fix the initial avatarImage2 state
content = content.replace(
  /\/\/ Style 1 by default uses avatar 1 and 3[\s\S]*?const \[avatarImage1, setAvatarImage1\] = useState\(safeInitialData.avatarImage1 \ < /dev/null | \| '\/Sections\/Social_Proof\/1.jpg'\)[\s\S]*?const \[avatarImage2, setAvatarImage2\] = useState\(safeInitialData.avatarImage2 \|\| '\/Sections\/Social_Proof\/3.jpg'\)/g,
  "// Style 1 by default uses avatar 1 and 2\n  const [avatarImage1, setAvatarImage1] = useState(safeInitialData.avatarImage1 || '/Sections/Social_Proof/1.jpg')\n  const [avatarImage2, setAvatarImage2] = useState(safeInitialData.avatarImage2 || '/Sections/Social_Proof/2.jpg')"
);

// 6. Fix getBackgroundStyles function to not check opacity
content = content.replace(/\/\/ Return empty string if showBackground is false or backgroundOpacity is 0\s+if \(\!showBackground \|\| backgroundOpacity <= 0\) return '';/g, '// Return empty string if showBackground is false\n    if (\!showBackground) return \'\';');

// 7. Replace color picker button with background toggle
content = content.replace(
  /<div className="space-y-3">\s+<label className="block text-sm text-\[#1c2838\]">\s+Hintergrundfarbe:[\s\S]*?<div className="mt-1">[\s\S]*?<button[\s\S]*?<\/button>[\s\S]*?<\/p>\s+<\/label>\s+<\/div>/g,
  `<div className="space-y-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowBackground(\!showBackground); }}
                className="flex items-center cursor-pointer bg-transparent border-none p-0 m-0 focus:outline-none"
              >
                <div className={\`relative w-9 h-5 \${showBackground ? 'bg-[#1c2838]' : 'bg-gray-200'} rounded-full transition-colors\`}>
                  <div className={\`absolute top-[2px] \${showBackground ? 'right-[2px] translate-x-0' : 'left-[2px] translate-x-0'} bg-white border rounded-full h-4 w-4 transition-all\`}></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">Hintergrund anzeigen</span>
              </button>
              <HelpTooltip text="Schaltet den Hintergrund der Social Proof Box ein oder aus." />
            </div>
          </div>
          
          <div className={\`space-y-3 \${showBackground ? '' : 'opacity-50 pointer-events-none'}\`}>
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
        </div>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('SocialProofSection.tsx cleaned up successfully\!');
