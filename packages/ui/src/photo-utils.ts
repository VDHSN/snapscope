/**
 * Utility functions for photo handling and validation
 */

/**
 * Validates if a string is a valid data URL for images
 */
export function isValidImageDataUrl(dataUrl: string | null | undefined): boolean {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return false;
  }

  // Check if it starts with data:image/
  if (!dataUrl.startsWith('data:image/')) {
    return false;
  }

  // Basic format validation: data:image/type;base64,data
  const regex = /^data:image\/[a-zA-Z+-]+;base64,/;
  if (!regex.test(dataUrl)) {
    return false;
  }

  // Check if there's actual data after the header
  const base64Data = dataUrl.split(',')[1];
  if (!base64Data || base64Data.length === 0) {
    return false;
  }

  try {
    // Try to validate base64 encoding (basic check)
    atob(base64Data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a safe data URL that's validated before use
 */
export function createSafeDataUrl(dataUrl: string | null | undefined): string | null {
  return isValidImageDataUrl(dataUrl) ? dataUrl! : null;
}

/**
 * Generates a fallback placeholder image data URL
 */
export function generatePlaceholderDataUrl(
  text: string = 'Image Error', 
  color: string = '#dc2626',
  width: number = 400,
  height: number = 300
): string {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="${color}" opacity="0.1"/>
    <rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="8,4"/>
    <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="16" fill="${color}" text-anchor="middle" dominant-baseline="middle">⚠️</text>
    <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="14" fill="${color}" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
  
  try {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  } catch {
    // Fallback if btoa fails
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
}

/**
 * Safely creates a CSS background-image value from a data URL
 */
export function createSafeBackgroundImage(dataUrl: string | null | undefined): string {
  const safeUrl = createSafeDataUrl(dataUrl);
  return safeUrl ? `url(${safeUrl}) center/cover` : 'var(--bg-secondary)';
}