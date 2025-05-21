'use client'

import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// Helper function to fix image paths from Supabase
export const fixImagePath = (path: string | undefined | null): string => {
  console.log('Original image path:', path);
  
  if (!path) return '/BrandUp_Elements_Logo_2000_800.png'; // Default fallback image
  
  let fixedPath = path;
  
  // Fix backslash paths - replace ALL backslashes, not just the first one
  if (path.includes('\\')) {
    fixedPath = path.replace(/\\/g, '/');
    console.log('Fixed backslashes:', fixedPath);
  }
  
  // If path doesn't start with / or http, add a leading /
  if (!fixedPath.startsWith('/') && !fixedPath.startsWith('http')) {
    fixedPath = '/' + fixedPath;
    console.log('Added leading slash:', fixedPath);
  }
  
  console.log('Final image path:', fixedPath);
  return fixedPath;
}
