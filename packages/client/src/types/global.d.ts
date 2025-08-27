// Global type declarations

declare global {
  interface Window {
    /**
     * Vercel Analytics tracking function
     * @param eventName - Name of the event to track
     * @param eventData - Optional event data to send with the event
     */
    va?: (eventName: string, eventData?: Record<string, string | number>) => void;
  }
}

// This file needs to be treated as a module to augment the global scope
export {};