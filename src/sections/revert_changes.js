const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'SocialProofSection.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove ColorPickerModal and showColorPicker state
content = content.replace(/\s+const \[showColorPicker, setShowColorPicker\] = useState\(false\)/g, '');

// 2. Remove the entire ColorPickerModal component
const colorPickerRegex = /\s+\/\/ Color Picker with Opacity Modal[\s\S]*?const ColorPickerModal = \(\) => \{[\s\S]*?\}\;/g;
content = content.replace(colorPickerRegex, '');

// 3. Remove ColorPickerModal from the JSX
content = content.replace(/\s+<ColorPickerModal \/>/g, '');

// 4. Restore the simple background toggle
const backgroundToggleHTML = `          <div className="flex items-center justify-between mb-3">
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
          
          <div className={\`space-y-3 \${showBackground ? '' : 'opacity-50 pointer-events-none'}\`}>`;

// Find the styling section and replace the current button with the toggle
content = content.replace(
  /<div className="space-y-3">\s+<label className="block text-sm text-\[#1c2838\]">\s+Hintergrundfarbe:[\s\S]*?<div className="mt-1">[\s\S]*?<button[\s\S]*?<\/button>\s+<\/div>[\s\S]*?<\/label>/g, 
  `<div className="space-y-3">
${backgroundToggleHTML}
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
            </label>`
);

// 5. Remove closing div that we need to add back
content = content.replace(/\s+<p className="text-xs text-gray-500 mt-1">Klicken, um Farbe und Deckkraft einzustellen<\/p>\s+<\/div>/g, '');

// 6. Add closing div for the background toggle section
content = content.replace(/(\s+<\/label>\s+)(<div className="grid grid-cols-2 gap-3 mt-3">)/g, '$1</div>\n\n          $2');

// 7. Update Style 1 template to use avatar 2 instead of 3
content = content.replace(/avatarImage2: '\/Sections\/Social_Proof\/3.jpg'/g, "avatarImage2: '/Sections/Social_Proof/2.jpg'");

// 8. Fix getBackgroundStyles function to not check opacity
content = content.replace(/if \(\!showBackground \ < /dev/null | \| backgroundOpacity <= 0\) return '';/g, 'if (\!showBackground) return \'\';');

fs.writeFileSync(filePath, content, 'utf8');
console.log('SocialProofSection.tsx reverted successfully\!');
