/**
 * Blur Detection Utility
 * 
 * This module provides blur detection functionality for images captured
 * during vehicle assessment workflows.
 */

/**
 * Analyzes an image blob for blur using variance of Laplacian
 * @param blob - The image blob to analyze
 * @param threshold - Blur threshold (0-100, lower = more sensitive, default 30)
 * @returns Promise<boolean> - true if image is considered blurry
 */
export async function detectBlur(blob: Blob, threshold: number = 30): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      try {
        // Set canvas size - use smaller dimensions for performance
        const maxSize = 400;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Convert to grayscale and apply Laplacian filter
        const variance = calculateLaplacianVariance(data, canvas.width, canvas.height);
        
        // Convert normalized threshold (0-100) to actual variance threshold
        // Higher variance = sharper image, lower variance = blurrier image
        const actualThreshold = threshold * 10; // Scale factor for variance range
        
        const isBlurry = variance < actualThreshold;
        
        console.debug('[BlurDetection]', {
          variance: variance.toFixed(2),
          threshold: actualThreshold,
          isBlurry,
          dimensions: `${canvas.width}x${canvas.height}`,
        });
        
        resolve(isBlurry);
      } catch (error) {
        reject(error);
      } finally {
        // Clean up object URL
        URL.revokeObjectURL(img.src);
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for blur detection'));
    };
    
    // Create object URL for the blob
    img.src = URL.createObjectURL(blob);
  });
}

/**
 * Calculates the variance of Laplacian for blur detection
 * Uses a simplified Laplacian kernel for edge detection
 */
function calculateLaplacianVariance(data: Uint8ClampedArray, width: number, height: number): number {
  const grayscale = new Float32Array(width * height);
  
  // Convert RGBA to grayscale
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Standard grayscale conversion
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    grayscale[i / 4] = gray;
  }
  
  // Apply Laplacian filter
  const laplacian = new Float32Array(width * height);
  
  // Laplacian kernel (3x3)
  // [ 0, -1,  0]
  // [-1,  4, -1]
  // [ 0, -1,  0]
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      
      const center = grayscale[idx];
      const top = grayscale[(y - 1) * width + x];
      const bottom = grayscale[(y + 1) * width + x];
      const left = grayscale[y * width + (x - 1)];
      const right = grayscale[y * width + (x + 1)];
      
      // Apply Laplacian kernel
      laplacian[idx] = Math.abs(4 * center - top - bottom - left - right);
    }
  }
  
  // Calculate variance of Laplacian values
  let sum = 0;
  let count = 0;
  
  // Calculate mean (exclude border pixels)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      sum += laplacian[y * width + x];
      count++;
    }
  }
  
  if (count === 0) return 0;
  
  const mean = sum / count;
  
  // Calculate variance
  let variance = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const diff = laplacian[y * width + x] - mean;
      variance += diff * diff;
    }
  }
  
  return variance / count;
}

/**
 * Quick blur check that returns a promise resolving immediately
 * Useful for testing or when blur detection is disabled
 */
export async function quickBlurCheck(_blob: Blob, _threshold: number = 30): Promise<boolean> {
  // Always return false (not blurry) for quick mode
  return Promise.resolve(false);
}