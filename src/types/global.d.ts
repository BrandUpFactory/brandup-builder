// Global type definitions
interface Window {
  hasUnsavedChangesGlobal: boolean;
  createExitConfirmationGlobal: ((targetUrl: string) => void) | null;
}