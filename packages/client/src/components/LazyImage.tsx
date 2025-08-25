/**
 * Optimized lazy loading image component
 */

'use client';

import React, { memo } from 'react';
import { useLazyImage } from '@/lib/performance';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  placeholder?: React.ReactNode;
  observerOptions?: IntersectionObserverInit;
}

export const LazyImage = memo<LazyImageProps>(({ 
  src, 
  alt, 
  fallback,
  placeholder,
  observerOptions,
  className = '',
  ...props 
}) => {
  const { imageSrc, isLoaded, isError, imgRef, onLoad, onError } = useLazyImage(src, observerOptions);

  // Default placeholder
  const defaultPlaceholder = (
    <div className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
      <svg 
        className="w-8 h-8 text-gray-400" 
        fill="currentColor" 
        viewBox="0 0 20 20" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          fillRule="evenodd" 
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
          clipRule="evenodd" 
        />
      </svg>
    </div>
  );

  // Show placeholder while image is not in viewport
  if (!imageSrc) {
    return (
      <div ref={imgRef} className={className}>
        {placeholder || defaultPlaceholder}
      </div>
    );
  }

  // Show error fallback if image failed to load
  if (isError && fallback) {
    return (
      <img
        src={fallback}
        alt={alt}
        className={className}
        {...props}
      />
    );
  }

  // Show error placeholder if no fallback
  if (isError) {
    return (
      <div className={`bg-red-100 flex items-center justify-center ${className}`}>
        <svg 
          className="w-8 h-8 text-red-400" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fillRule="evenodd" 
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading placeholder shown until image is loaded */}
      {!isLoaded && (placeholder || defaultPlaceholder)}
      
      {/* Actual image */}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        onLoad={onLoad}
        onError={onError}
        className={`${className} ${!isLoaded ? 'opacity-0 absolute inset-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;