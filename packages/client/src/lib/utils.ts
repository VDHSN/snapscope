/**
 * Utility functions for the application
 */

/**
 * Generate a unique ID for entities using cryptographically secure random UUID
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Generate a claim number in a standard format
 */
export function generateClaimNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  
  return `SC${year}${month}${day}-${random}`;
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  
  return (...args: Parameters<T>) => {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Check if two objects are deeply equal
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  
  if (typeof a !== 'object') return a === b;
  
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  
  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(objA[key], objB[key])) return false;
  }
  
  return true;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
}

/**
 * Format a date value for display.
 *
 * Handles dates that may be deserialized from storage (localStorage/IndexedDB)
 * where Date objects are serialized as ISO strings. This function accepts
 * Date objects, string representations (ISO 8601), or Unix timestamps.
 *
 * @param date - The date value to format (Date object, ISO string, or Unix timestamp)
 * @param options - Optional Intl.DateTimeFormatOptions for customizing the output
 * @returns Formatted date string, or "Invalid Date" if the input cannot be parsed
 *
 * @example
 * // With Date object
 * formatDate(new Date()) // "1/15/2025"
 *
 * @example
 * // With ISO string (from localStorage)
 * formatDate("2025-01-15T10:30:00.000Z") // "1/15/2025"
 *
 * @example
 * // With Unix timestamp
 * formatDate(1705318200000) // "1/15/2025"
 *
 * @example
 * // With custom formatting
 * formatDate(new Date(), { dateStyle: 'full' }) // "Monday, January 15, 2025"
 */
export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  // Convert input to Date object
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  // Validate that we have a valid date
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  // Default to simple date format if no options provided
  return dateObj.toLocaleDateString(undefined, options);
}

/**
 * Format a date value for display with time.
 *
 * Similar to formatDate but includes time information. Handles dates that may be
 * deserialized from storage where Date objects are serialized as ISO strings.
 *
 * @param date - The date value to format (Date object, ISO string, or Unix timestamp)
 * @param options - Optional Intl.DateTimeFormatOptions for customizing the output
 * @returns Formatted date and time string, or "Invalid Date" if the input cannot be parsed
 *
 * @example
 * formatDateTime(new Date()) // "1/15/2025, 10:30:00 AM"
 * formatDateTime("2025-01-15T10:30:00.000Z") // "1/15/2025, 10:30:00 AM"
 */
export function formatDateTime(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  // Convert input to Date object
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  // Validate that we have a valid date
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  // Default to date and time format if no options provided
  return dateObj.toLocaleString(undefined, options);
}

/**
 * Get relative time string (e.g., "2 hours ago")
 *
 * Handles dates that may be deserialized from storage where Date objects
 * are serialized as ISO strings.
 *
 * @param date - The date value (Date object, ISO string, or Unix timestamp)
 * @returns Human-readable relative time string
 */
export function getRelativeTime(date: Date | string | number): string {
  // Convert input to Date object
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  // Validate that we have a valid date
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Sanitize user input to prevent XSS attacks
 * Strips HTML tags and dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .substring(0, 500); // Limit length to 500 chars
}

/**
 * Sanitize carrier name - more restrictive for names
 */
export function sanitizeCarrierName(name: string): string {
  if (!name) return '';

  return name
    .trim()
    .replace(/[<>'"&]/g, '') // Remove potentially dangerous chars
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 100); // Limit to 100 chars
}