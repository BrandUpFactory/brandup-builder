# Multilingual Implementation Plan for BrandUp Designer

## Overview

This document outlines the implementation strategy to make the BrandUp Designer website fully multilingual, supporting German (default), English, French, and Spanish.

## Technology Stack

We recommend using **next-intl** for internationalization because:

1. It's specifically designed for Next.js applications
2. It provides excellent TypeScript support
3. It supports route-based language switching
4. It integrates with Next.js App Router
5. It has a large community and active maintenance

## Implementation Steps

### 1. Install Dependencies

```bash
npm install next-intl@latest
```

### 2. Directory Structure for Translations

Create a dedicated `messages` directory in the root of the project to store translation files:

```
/messages
  /de.json     # German (default)
  /en.json     # English
  /fr.json     # French
  /es.json     # Spanish
```

### 3. Route Configuration

Next-intl uses a middleware approach to handle language routing. You'll need to create:

1. **Middleware file** at the root to handle locale detection and routing
2. **App router configuration** to set up locale-based routes

#### Middleware Configuration (middleware.ts)

```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // List of locales
  locales: ['de', 'en', 'fr', 'es'],
  
  // Default locale
  defaultLocale: 'de',
  
  // This detects the locale from the accept-language header
  localeDetection: true
});

export const config = {
  // All routes will be handled by the middleware
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)']
};
```

#### App Router Configuration

Update your Next.js configuration to support locale-based routing.

### 4. Translation Process

The multilingual implementation requires:

#### 4.1 Extract Text for Translation

1. Identify all user-facing text in the application
2. Create a base translation file in German (de.json)
3. Translate the base file to other languages

#### 4.2 Translation Structures

All translations should follow a nested structure by feature:

```json
{
  "common": {
    "buttons": {
      "save": "Speichern",
      "cancel": "Abbrechen"
    },
    "errors": {
      "notFound": "Nicht gefunden"
    }
  },
  "templates": {
    "title": "Alle Templates",
    "searchPlaceholder": "🔎 Suchen..."
  }
}
```

### 5. Component Modifications

#### 5.1 Create Translation Wrapper Components

Create a provider component that wraps the application with the translation context:

```tsx
// i18n-provider.tsx
'use client';

import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

export function I18nProvider({ children }: { children: ReactNode }) {
  return children;
}
```

#### 5.2 Update Layout Components

Modify the root layout to support locale-based routing and translation loading:

```tsx
// app/[locale]/layout.tsx
import { notFound } from 'next/navigation';
import { I18nProvider } from '@/components/i18n-provider';

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!['de', 'en', 'fr', 'es'].includes(locale)) {
    notFound();
  }

  return (
    <I18nProvider locale={locale}>
      {children}
    </I18nProvider>
  );
}
```

### 6. AI Translation Integration

For efficient translation management, we recommend:

1. Use the initial German content as the source of truth
2. Implement a translation workflow using an AI service like OpenAI or DeepL for initial translations
3. Store translations in the Supabase database for dynamic updates

#### 6.1 Translation Service

Create a translation service that integrates with an AI provider:

```typescript
// translation-service.ts
export async function translateText(text: string, sourceLanguage: string, targetLanguage: string) {
  // Integration with OpenAI/DeepL API
}
```

#### 6.2 Database Schema for Translations

Add a translations table to Supabase:

```sql
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  locale TEXT NOT NULL,
  content TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(key, locale)
);
```

### 7. Language Switcher Component

Create a language switcher component to allow users to change languages:

```tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    // Handle language switching logic
  };

  return (
    <div className="flex space-x-2">
      <button onClick={() => switchLanguage('de')}>DE</button>
      <button onClick={() => switchLanguage('en')}>EN</button>
      <button onClick={() => switchLanguage('fr')}>FR</button>
      <button onClick={() => switchLanguage('es')}>ES</button>
    </div>
  );
}
```

### 8. Implementation Timeline

1. **Week 1**: Setup infrastructure and base configuration
   - Install dependencies
   - Configure middleware and routing
   - Setup translation infrastructure

2. **Week 2**: Extract and translate core content
   - Extract text from main pages
   - Translate to English, French, and Spanish
   - Implement language switcher

3. **Week 3**: Update components and test
   - Modify components to use translations
   - Test in all supported languages
   - Fix any layout or styling issues

4. **Week 4**: Finalize and optimize
   - Final translations review
   - Performance optimization
   - Documentation

## Conclusion

This implementation plan provides a comprehensive approach to making the BrandUp Designer website multilingual. The next-intl library offers a robust solution that integrates well with Next.js App Router, and the AI-assisted translation workflow will ensure efficient generation and maintenance of translations.