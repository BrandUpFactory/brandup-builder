'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'

// Define the type for the createExitConfirmation function
type CreateExitConfirmationFn = (targetUrl: string) => void;

// Global variables to track state
let hasUnsavedChangesGlobal = false;
let createExitConfirmationGlobal: CreateExitConfirmationFn | null = null;
let originalPushState: typeof history.pushState | null = null;
let originalReplaceState: typeof history.replaceState | null = null;
let lastAttemptedNavigation: string | null = null; // Store the last attempted navigation URL

export const registerNavigationManager = (
  hasUnsavedChanges: boolean,
  createExitConfirmation: CreateExitConfirmationFn
) => {
  hasUnsavedChangesGlobal = hasUnsavedChanges;
  createExitConfirmationGlobal = createExitConfirmation;
};

// Component that handles navigation interception
export default function NavigationManager() {
  const router = useRouter();

  // Function to intercept navigation
  const intercept = useCallback((event: MouseEvent) => {
    // Skip if no unsaved changes or no confirmation function registered
    if (!hasUnsavedChangesGlobal || !createExitConfirmationGlobal) return;

    // Only intercept clicks on anchor tags
    const target = event.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (!anchor) return;
    
    // Skip external links or anchors without href
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;
    
    // Skip if the link has a target attribute
    if (anchor.hasAttribute('target')) return;
    
    // Save the navigation target
    lastAttemptedNavigation = href;
    
    // Prevent the default navigation
    event.preventDefault();
    event.stopPropagation();
    
    // Show confirmation dialog with the target URL directly
    console.log("NavigationManager: Showing confirmation for navigation to:", href);
    createExitConfirmationGlobal(href);
  }, [router]);

  // Override history methods to intercept programmatic navigation
  useEffect(() => {
    if (!originalPushState) {
      originalPushState = history.pushState;
      originalReplaceState = history.replaceState;

      // Override pushState
      history.pushState = function(...args) {
        // Store the URL for later use
        const targetUrl = args[2] as string | null;
        
        if (hasUnsavedChangesGlobal && createExitConfirmationGlobal && targetUrl) {
          console.log("NavigationManager: Intercepting pushState to:", targetUrl);
          createExitConfirmationGlobal(targetUrl);
          return;
        }
        if (originalPushState) originalPushState.apply(this, args);
      };

      // Override replaceState
      history.replaceState = function(...args) {
        // Store the URL for later use
        const targetUrl = args[2] as string | null;
        
        if (hasUnsavedChangesGlobal && createExitConfirmationGlobal && targetUrl) {
          console.log("NavigationManager: Intercepting replaceState to:", targetUrl);
          createExitConfirmationGlobal(targetUrl);
          return;
        }
        if (originalReplaceState) originalReplaceState.apply(this, args);
      };
    }

    // Add click event listener
    document.addEventListener('click', intercept, true);

    // Cleanup
    return () => {
      document.removeEventListener('click', intercept, true);
      
      // Restore original history methods on unmount
      if (originalPushState && history.pushState !== originalPushState) {
        history.pushState = originalPushState;
      }
      if (originalReplaceState && history.replaceState !== originalReplaceState) {
        history.replaceState = originalReplaceState;
      }
    };
  }, [intercept]);

  // This component doesn't render anything
  return null;
}