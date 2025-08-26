/**
 * Optimized lazy loading video player component
 */

'use client';

import * as React from 'react';

export interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  fallback?: string;
  placeholder?: React.ReactNode;
  observerOptions?: IntersectionObserverInit;
  showControls?: boolean;
  aspectRatio?: 'video' | 'square' | 'widescreen' | 'ultrawide';
  lazyLoad?: boolean;
}

const aspectRatios = {
  video: '16 / 9',
  square: '1 / 1',
  widescreen: '21 / 9',
  ultrawide: '32 / 9',
};

const baseStyle: React.CSSProperties = {
  width: '100%',
  height: 'auto',
  borderRadius: 'var(--border-radius-md)',
  backgroundColor: 'var(--bg-surface)',
};

export const VideoPlayer = React.forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({
    src,
    poster,
    fallback,
    placeholder,
    observerOptions,
    showControls = true,
    aspectRatio = 'video',
    lazyLoad = true,
    className = '',
    style,
    onLoadStart,
    onError,
    ...props
  }, ref) => {
    const [videoSrc, setVideoSrc] = React.useState<string | null>(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [isIntersecting, setIsIntersecting] = React.useState(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Intersection observer for lazy loading (when enabled)
    React.useEffect(() => {
      if (!lazyLoad) {
        // If lazy loading is disabled, immediately set video source
        setIsIntersecting(true);
        setVideoSrc(src);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            setVideoSrc(src);
            observer.disconnect();
          }
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
          ...observerOptions,
        }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, [src, observerOptions, lazyLoad]);

    // Handle video load events
    const handleLoadStart = React.useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
      setIsLoaded(true);
      setIsError(false);
      onLoadStart?.(e);
    }, [onLoadStart]);

    const handleError = React.useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
      setIsError(true);
      setIsLoaded(false);
      onError?.(e);
    }, [onError]);

    const combinedStyle: React.CSSProperties = {
      ...baseStyle,
      aspectRatio: aspectRatios[aspectRatio],
      ...style,
    };

    // Default placeholder
    const defaultPlaceholder = (
      <div
        style={{
          ...combinedStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-surface)',
          border: '2px dashed var(--border-color)',
        }}
        className={className}
      >
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginBottom: 'var(--space-sm)' }}
          >
            <path
              d="M8 5v14l11-7L8 5z"
              fill="currentColor"
            />
          </svg>
          <p style={{ margin: 0, fontSize: 'var(--font-size-small)' }}>
            {lazyLoad ? 'Video will load when visible' : 'Loading video...'}
          </p>
        </div>
      </div>
    );

    // Show placeholder while video is not in viewport
    if (!isIntersecting || !videoSrc) {
      return (
        <div ref={containerRef} className={className}>
          {placeholder || defaultPlaceholder}
        </div>
      );
    }

    // Show error fallback if video failed to load
    if (isError && fallback) {
      return (
        <video
          src={fallback}
          poster={poster}
          controls={showControls}
          style={combinedStyle}
          className={className}
          {...props}
        />
      );
    }

    // Show error placeholder if no fallback
    if (isError) {
      return (
        <div
          style={{
            ...combinedStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--error-bg)',
            border: '2px solid var(--error)',
          }}
          className={className}
        >
          <div style={{ textAlign: 'center', color: 'var(--error)' }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginBottom: 'var(--space-sm)' }}
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <p style={{ margin: 0, fontSize: 'var(--font-size-small)' }}>
              Error loading video
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        {/* Loading placeholder shown until video is loaded */}
        {!isLoaded && (placeholder || defaultPlaceholder)}
        
        {/* Actual video */}
        <video
          ref={(node) => {
            videoRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          src={videoSrc}
          poster={poster}
          controls={showControls}
          onLoadStart={handleLoadStart}
          onError={handleError}
          style={{
            ...combinedStyle,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            position: isLoaded ? 'relative' : 'absolute',
            top: isLoaded ? 'auto' : 0,
            left: isLoaded ? 'auto' : 0,
          }}
          className={className}
          {...props}
        />
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';