# Step-by-Step Multilingual Implementation Guide for BrandUp Designer

This guide provides detailed, practical steps to implement multilingual support in your BrandUp Designer application, supporting German (default), English, French, and Spanish.

## 1. Install Required Packages

Start by installing the next-intl package:

```bash
npm install next-intl@latest
```

## 2. Create Translation Files

### Create Messages Directory

Create a `messages` directory in the project root to store translations:

```bash
mkdir -p messages
```

### Create Base Translation File (German)

Create the `de.json` file in the messages directory with all texts currently in the application:

```bash
touch messages/de.json
```

Edit `messages/de.json` with your German texts:

```json
{
  "common": {
    "buttons": {
      "save": "Speichern",
      "cancel": "Abbrechen",
      "back": "Zurück",
      "unlock": "Freischalten",
      "buy": "Kaufen",
      "edit": "Bearbeiten"
    },
    "errors": {
      "general": "Ein unerwarteter Fehler ist aufgetreten",
      "notFound": "Nicht gefunden",
      "authRequired": "Sie müssen angemeldet sein, um auf diesen Bereich zuzugreifen"
    },
    "loading": "Laden..."
  },
  "navigation": {
    "home": "Startseite",
    "templates": "Templates",
    "mySections": "Meine Sektionen",
    "settings": "Einstellungen",
    "logout": "Abmelden",
    "login": "Anmelden"
  },
  "templates": {
    "title": "Alle Templates",
    "searchPlaceholder": "🔎 Suchen...",
    "noResults": "Keine passenden Templates gefunden.",
    "loading": "⏳ Lade Templates..."
  },
  "editor": {
    "sectionBuilder": "Section Builder",
    "editorLabel": "Editor",
    "templateLabel": "Template",
    "unsavedChanges": {
      "title": "Ungespeicherte Änderungen",
      "message": "Es gibt ungespeicherte Änderungen. Möchten Sie wirklich zurückgehen? Alle nicht gespeicherten Änderungen gehen verloren.",
      "buttons": {
        "cancel": "Abbrechen",
        "leaveWithoutSaving": "Ohne Speichern verlassen"
      }
    }
  },
  "accessCode": {
    "title": "Template freischalten",
    "subtitle": "Gib deinen Access-Code ein, um \"{templateName}\" zu aktivieren",
    "placeholder": "XXX-XXXX-XXXX",
    "successMessage": "✅ Template erfolgreich freigeschaltet!",
    "errorMessage": "❌ Dieser Code existiert nicht.",
    "alreadyUsedMessage": "⚠️ Dieser Code wurde bereits verwendet.",
    "wrongTemplateMessage": "⚠️ Dieser Code gehört zu einem anderen Template.",
    "helpText": "Du findest deinen Access-Code in der E-Mail-Bestätigung nach dem Kauf des Templates."
  }
}
```

### Create Other Language Files

Create empty files for other languages:

```bash
touch messages/en.json
touch messages/fr.json
touch messages/es.json
```

## 3. Configure Middleware

Create a middleware file in the project root to handle locale detection and routing:

```bash
touch middleware.ts
```

Add the following code to `middleware.ts`:

```typescript
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

// Step 1: Create the internationalization middleware
const intlMiddleware = createMiddleware({
  // Define all supported locales
  locales: ['de', 'en', 'fr', 'es'],
  
  // Set default locale
  defaultLocale: 'de',
  
  // Detect locale from browser settings
  localeDetection: true
});

// Step 2: Create main middleware to handle all requests
export default function middleware(request: NextRequest) {
  // For API routes, don't apply locale handling
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // For static assets, don't apply locale handling
  const publicFiles = /\.(.*)$/;
  if (publicFiles.test(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Apply internationalization middleware for all other routes
  return intlMiddleware(request);
}

// Step 3: Define matcher for which routes the middleware applies
export const config = {
  // This regex excludes api routes, static files, images, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)']
};
```

## 4. Update Next.js Configuration

Modify your `next.config.ts` file to support internationalization:

```typescript
import { withNextIntl } from 'next-intl/plugin';

const nextConfig = {
  // Your existing config
};

export default withNextIntl('./i18n.ts')(nextConfig);
```

## 5. Create i18n Configuration

Create an `i18n.ts` file in the project root:

```bash
touch i18n.ts
```

Add the following code to `i18n.ts`:

```typescript
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Load messages for the current locale
  const messages = (await import(`./messages/${locale}.json`)).default;
  
  return {
    messages,
    timeZone: 'Europe/Berlin',
    now: new Date(),
  };
});
```

## 6. Create Provider Components

### Create a Translations Directory

```bash
mkdir -p src/components/i18n
```

### Create Translations Provider

Create a file at `src/components/i18n/TranslationsProvider.tsx`:

```typescript
'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

type Props = {
  locale: string;
  messages: any;
  children: ReactNode;
};

export function TranslationsProvider({ locale, messages, children }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

## 7. Update App Structure for Internationalization

### Create Locale-Based Layout

Create a locale-based layout file:

```bash
mkdir -p src/app/[locale]
touch src/app/[locale]/layout.tsx
```

Add the following to `src/app/[locale]/layout.tsx`:

```typescript
import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { TranslationsProvider } from '@/components/i18n/TranslationsProvider';

// Get translations for the current locale
async function getMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // List of supported locales
  const locales = ['de', 'en', 'fr', 'es'];
  
  // Check if the locale is supported
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return (
    <TranslationsProvider locale={locale} messages={messages}>
      {children}
    </TranslationsProvider>
  );
}
```

## 8. Move Your Existing App Structure

### Move Files to Locale Directory

Move your existing app structure to be under the [locale] dynamic route:

1. Move all files from `src/app/*` to `src/app/[locale]/*`
2. Update any imports that might be affected

## 9. Create a Language Switcher Component

Create a file at `src/components/LanguageSwitcher.tsx`:

```tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // Map of locales to their display names
  const locales = {
    de: { name: 'Deutsch', flag: '🇩🇪' },
    en: { name: 'English', flag: '🇬🇧' },
    fr: { name: 'Français', flag: '🇫🇷' },
    es: { name: 'Español', flag: '🇪🇸' }
  };
  
  // Get the current locale's display info
  const currentLocale = locales[locale as keyof typeof locales];
  
  // Function to switch locale
  const changeLocale = (newLocale: string) => {
    // Get the path without the locale prefix
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    
    // Navigate to the same page but with new locale
    router.push(newPath);
    router.refresh();
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        className="flex items-center gap-1 px-2 py-1 text-sm rounded-md hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentLocale.flag}</span>
        <span className="hidden md:inline">{currentLocale.name}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            {Object.entries(locales).map(([code, { name, flag }]) => (
              <button
                key={code}
                className={`
                  w-full text-left px-4 py-2 text-sm flex items-center gap-2
                  ${code === locale ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}
                `}
                onClick={() => changeLocale(code)}
              >
                <span>{flag}</span>
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## 10. Add Language Switcher to Navbar

Update your Navbar component to include the language switcher:

```tsx
// Add this import
import LanguageSwitcher from './LanguageSwitcher';

// In your Navbar component, add the language switcher
<div className="flex items-center gap-4">
  {/* Your existing navbar items */}
  <LanguageSwitcher />
</div>
```

## 11. Update Components to Use Translations

### Update a Component Example

Before:
```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  Speichern
</button>
```

After:
```tsx
import { useTranslations } from 'next-intl';

// Inside your component
const t = useTranslations('common.buttons');

// In your JSX
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  {t('save')}
</button>
```

### Example: Update Templates Page

Update `src/app/[locale]/templates/page.tsx` to use translations:

```tsx
'use client';

import { useTranslations } from 'next-intl';
// other imports...

export default function TemplatesPage() {
  const t = useTranslations();
  const tTemplates = useTranslations('templates');
  const tCommon = useTranslations('common');
  
  // Rest of your component logic...
  
  return (
    <div className="p-6 md:p-12">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1c2838]">
          {tTemplates('title')}
        </h1>

        <input
          type="text"
          placeholder={tTemplates('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-full text-sm w-full sm:w-64 md:w-72 bg-[#f4f7fa] text-[#1c2838] focus:outline-none focus:ring-2 focus:ring-[#1c2838]"
        />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">{tTemplates('loading')}</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : filteredTemplates.length === 0 ? (
        <p className="text-sm text-gray-500">{tTemplates('noResults')}</p>
      ) : (
        // Rest of your template listing...
      )}
    </div>
  );
}
```

## 12. AI-Assisted Translation

To efficiently translate your content:

### Step 1: Extract All Text to Translate

Create a script to extract all translatable strings from the German translation file:

```bash
touch scripts/translate.js
```

Add this code to `scripts/translate.js`:

```javascript
const fs = require('fs');
const path = require('path');

// Load the base German language file
const germanFile = path.join(__dirname, '../messages/de.json');
const germanTranslations = JSON.parse(fs.readFileSync(germanFile, 'utf8'));

// Function to flatten nested objects for translation
function flattenTranslations(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      return { ...acc, ...flattenTranslations(obj[key], prefixedKey) };
    }
    
    return { ...acc, [prefixedKey]: obj[key] };
  }, {});
}

// Convert to flat key-value pairs for easier translation
const flattenedTranslations = flattenTranslations(germanTranslations);

// Create a file with keys and German values for translation
const translationSource = Object.entries(flattenedTranslations)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

fs.writeFileSync(path.join(__dirname, '../translation-source.txt'), translationSource);

console.log('Translation source file created: translation-source.txt');
console.log(`Contains ${Object.keys(flattenedTranslations).length} translatable strings`);
```

### Step 2: Prepare for AI Translation

This creates a translation source file that you can send to an AI service. For example, you can use OpenAI's API to translate:

1. Create a script that uses OpenAI's API to translate (requires OpenAI API key):

```bash
touch scripts/ai-translate.js
```

Add this code to `scripts/ai-translate.js` (you'll need to install the OpenAI package):

```javascript
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load the translation source
const sourceFile = path.join(__dirname, '../translation-source.txt');
const sourceText = fs.readFileSync(sourceFile, 'utf8');

async function translateText(text, targetLanguage) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate each line from German to ${targetLanguage}. 
          Keep the format 'key=translated_value' and maintain any placeholders like {name} or {count}.
          Do not translate the keys, only the values after the '=' sign.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.2,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error during translation:', error);
    throw error;
  }
}

async function processTranslations() {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' }
  ];

  for (const language of languages) {
    console.log(`Translating to ${language.name}...`);
    
    try {
      const translatedText = await translateText(sourceText, language.name);
      
      // Create a map of translated values
      const translationMap = {};
      translatedText.split('\n').forEach(line => {
        if (!line.trim()) return;
        
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('='); // Rejoin in case value contains '='
        translationMap[key.trim()] = value.trim();
      });
      
      // Load the German structure as a template
      const germanFile = path.join(__dirname, '../messages/de.json');
      const germanStructure = JSON.parse(fs.readFileSync(germanFile, 'utf8'));
      
      // Function to rebuild the nested structure with translated values
      function rebuildNestedStructure(obj, flatMap, prefix = '') {
        const result = {};
        
        for (const key of Object.keys(obj)) {
          const prefixedKey = prefix ? `${prefix}.${key}` : key;
          
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            result[key] = rebuildNestedStructure(obj[key], flatMap, prefixedKey);
          } else {
            result[key] = flatMap[prefixedKey] || obj[key]; // Fallback to original if not translated
          }
        }
        
        return result;
      }
      
      // Rebuild the nested structure with translated values
      const translatedStructure = rebuildNestedStructure(germanStructure, translationMap);
      
      // Write the translated file
      const targetFile = path.join(__dirname, `../messages/${language.code}.json`);
      fs.writeFileSync(targetFile, JSON.stringify(translatedStructure, null, 2));
      
      console.log(`✅ Translated file created: messages/${language.code}.json`);
    } catch (error) {
      console.error(`❌ Failed to translate to ${language.name}:`, error);
    }
  }
}

processTranslations().catch(console.error);
```

### Step 3: Set up Environment Variable

Create a `.env.local` file with your OpenAI API key:

```
OPENAI_API_KEY=your-api-key-here
```

### Step 4: Run the Translation Scripts

First extract the text:

```bash
node scripts/translate.js
```

Then run the AI translation:

```bash
node scripts/ai-translate.js
```

## 13. Testing and Verification

After implementing translations, test your website by:

1. Visiting the site with different locale prefixes (e.g., `/de`, `/en`)
2. Using the language switcher to change between languages
3. Checking that all UI elements are properly translated
4. Verifying that the correct language persists between page navigations

## 14. Deployment Considerations

When deploying your multilingual site:

1. Ensure your deployment platform supports Next.js middleware
2. Update any hardcoded URLs in your code to respect the current locale
3. Consider adding hreflang tags for SEO purposes
4. If using a CDN, ensure it doesn't cache locale-specific content incorrectly

## Next Steps

After implementing the basic multilingual infrastructure, consider these enhancements:

1. **Implement Locale-Aware URLs**: For any dynamic content, ensure URLs maintain the locale information
2. **SEO Optimization**: Add language meta tags and locale-specific metadata
3. **Translation Memory**: Implement a system to track which translations need updating when the source text changes
4. **User Preferences**: Store the user's language preference in localStorage or their account settings
5. **RTL Support**: If you plan to add languages like Arabic or Hebrew in the future, add RTL layout support

This guide provides a comprehensive approach to implementing multilingual support in your BrandUp Designer application. With these steps, you'll have a fully functional multilingual website that supports German, English, French, and Spanish.