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
      const target = e.target as HTMLVideoElement;
      console.warn('Video loading error:', {
        src: target.src,
        error: target.error,
        networkState: target.networkState,
        readyState: target.readyState
      });
      
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
        <div 
          ref={containerRef} 
          style={{
            ...combinedStyle,
            position: 'relative',
          }}
          className={className}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--border-radius-lg)',
              border: '2px dashed var(--border-color)',
            }}
          >
            {placeholder || defaultPlaceholder}
          </div>
        </div>
      );
    }

    // Show error fallback if video failed to load
    if (isError && fallback) {
      return (
        <div 
          style={{
            ...combinedStyle,
            position: 'relative',
          }}
          className={className}
        >
          <video
            src={fallback}
            poster={poster}
            controls={showControls}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'var(--border-radius-md)',
            }}
            {...props}
          />
        </div>
      );
    }

    // Show error placeholder if no fallback
    if (isError) {
      return (
        <div
          style={{
            ...combinedStyle,
            position: 'relative',
          }}
          className={className}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--border-radius-lg)',
              border: '2px dashed var(--border-color)',
            }}
            role="img"
            aria-label="Video failed to load"
          >
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginBottom: 'var(--space-sm)' }}
                aria-hidden="true"
              >
                <path
                  d="M8 5v14l11-7L8 5z"
                  fill="currentColor"
                  opacity="0.3"
                />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <p style={{ margin: 0, fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)' }}>
                Video unavailable
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                The video content could not be loaded
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div 
        style={{
          ...combinedStyle,
          position: 'relative',
        }}
        className={className}
      >
        {/* Loading placeholder shown until video is loaded */}
        {!isLoaded && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--border-radius-lg)',
              border: '2px dashed var(--border-color)',
              zIndex: 1,
            }}
          >
            {placeholder || (
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
            )}
          </div>
        )}
        
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
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 'var(--border-radius-md)',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          aria-label={props['aria-label'] || 'Video player'}
          aria-describedby={props['aria-describedby']}
          role="region"
          tabIndex={0}
          preload="metadata"
          // Ensure autoplay is always muted for accessibility compliance
          {...props}
          autoPlay={props.autoPlay}
          muted={props.autoPlay ? true : props.muted}
        />
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';