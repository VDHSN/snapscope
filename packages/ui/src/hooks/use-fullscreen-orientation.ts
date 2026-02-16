/**
 * Custom hook for managing fullscreen mode and screen orientation
 * Provides cross-browser fullscreen API support with orientation locking
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export type OrientationLockType =
  | 'portrait'
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'landscape'
  | 'landscape-primary'
  | 'landscape-secondary'
  | 'any'
  | 'natural';

export interface UseFullscreenOrientationOptions {
  /** Enable fullscreen functionality */
  enabled?: boolean;
  /** Preferred screen orientation when in fullscreen */
  orientation?: OrientationLockType;
  /** Callback when fullscreen state changes */
  onFullscreenChange?: (isFullscreen: boolean) => void;
  /** Callback when orientation lock fails */
  onOrientationLockError?: (error: Error) => void;
}

export interface UseFullscreenOrientationReturn {
  /** Whether currently in fullscreen mode */
  isFullscreen: boolean;
  /** Whether orientation is currently locked */
  isOrientationLocked: boolean;
  /** Whether browser supports fullscreen API */
  canRequestFullscreen: boolean;
  /** Whether browser supports orientation lock */
  canLockOrientation: boolean;
  /** Request fullscreen for a specific element */
  requestFullscreen: (element: HTMLElement) => Promise<void>;
  /** Exit fullscreen mode */
  exitFullscreen: () => Promise<void>;
  /** Current error message if any */
  error: string | null;
}

/**
 * Extend Document interface for vendor-prefixed fullscreen APIs
 */
interface DocumentWithFullscreen extends Document {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

/**
 * Extend HTMLElement interface for vendor-prefixed fullscreen APIs
 */
interface HTMLElementWithFullscreen extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

/**
 * Extend ScreenOrientation interface to include lock/unlock
 */
interface ScreenOrientationWithLock extends ScreenOrientation {
  lock(orientation: OrientationLockType): Promise<void>;
  unlock(): void;
}

/**
 * Check if fullscreen API is supported
 */
function isFullscreenSupported(): boolean {
  const doc = document as DocumentWithFullscreen;
  return !!(
    document.fullscreenEnabled ||
    doc.webkitFullscreenElement !== undefined ||
    doc.mozFullScreenElement !== undefined ||
    doc.msFullscreenElement !== undefined
  );
}

/**
 * Check if orientation lock is supported
 */
function isOrientationLockSupported(): boolean {
  const orientation = screen.orientation as ScreenOrientationWithLock | undefined;
  return !!(orientation && typeof orientation.lock === 'function');
}

/**
 * Get current fullscreen element across browsers
 */
function getFullscreenElement(): Element | null {
  const doc = document as DocumentWithFullscreen;
  return (
    document.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement ||
    null
  );
}

/**
 * Request fullscreen with cross-browser support
 */
async function requestFullscreenCompat(element: HTMLElement): Promise<void> {
  const el = element as HTMLElementWithFullscreen;

  if (element.requestFullscreen) {
    return element.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    return el.webkitRequestFullscreen();
  } else if (el.mozRequestFullScreen) {
    return el.mozRequestFullScreen();
  } else if (el.msRequestFullscreen) {
    return el.msRequestFullscreen();
  }

  throw new Error('Fullscreen API not supported');
}

/**
 * Exit fullscreen with cross-browser support
 */
async function exitFullscreenCompat(): Promise<void> {
  const doc = document as DocumentWithFullscreen;

  if (document.exitFullscreen) {
    return document.exitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    return doc.webkitExitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    return doc.mozCancelFullScreen();
  } else if (doc.msExitFullscreen) {
    return doc.msExitFullscreen();
  }

  throw new Error('Exit fullscreen not supported');
}

/**
 * Hook for managing fullscreen mode and screen orientation
 */
export function useFullscreenOrientation(
  options: UseFullscreenOrientationOptions = {}
): UseFullscreenOrientationReturn {
  const {
    enabled = true,
    orientation = 'landscape-primary',
    onFullscreenChange,
    onOrientationLockError,
  } = options;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOrientationLocked, setIsOrientationLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canRequestFullscreen = isFullscreenSupported();
  const canLockOrientation = isOrientationLockSupported();

  const currentElementRef = useRef<HTMLElement | null>(null);
  const orientationLockedRef = useRef(false);

  /**
   * Handle fullscreen change events
   */
  const handleFullscreenChange = useCallback(() => {
    const isNowFullscreen = !!getFullscreenElement();
    setIsFullscreen(isNowFullscreen);

    console.debug('[useFullscreenOrientation] Fullscreen changed:', isNowFullscreen);
    onFullscreenChange?.(isNowFullscreen);

    // If exiting fullscreen, unlock orientation
    if (!isNowFullscreen && orientationLockedRef.current) {
      try {
        const orientation = screen.orientation as ScreenOrientationWithLock;
        orientation.unlock();
        orientationLockedRef.current = false;
        setIsOrientationLocked(false);
        console.debug('[useFullscreenOrientation] Orientation unlocked');
      } catch (err) {
        console.warn('[useFullscreenOrientation] Failed to unlock orientation:', err);
      }
    }
  }, [onFullscreenChange]);

  /**
   * Lock screen orientation
   */
  const lockOrientation = useCallback(async (lockType: OrientationLockType) => {
    if (!canLockOrientation) {
      const error = new Error('Orientation lock not supported');
      console.warn('[useFullscreenOrientation]', error.message);
      onOrientationLockError?.(error);
      return;
    }

    // Orientation lock only works in fullscreen on most browsers
    if (!getFullscreenElement()) {
      const error = new Error('Orientation lock requires fullscreen mode');
      console.warn('[useFullscreenOrientation]', error.message);
      onOrientationLockError?.(error);
      return;
    }

    try {
      const orientation = screen.orientation as ScreenOrientationWithLock;
      await orientation.lock(lockType);
      orientationLockedRef.current = true;
      setIsOrientationLocked(true);
      console.debug('[useFullscreenOrientation] Orientation locked to:', lockType);
    } catch (err) {
      const error = err as Error;
      console.warn('[useFullscreenOrientation] Failed to lock orientation:', error);
      setError(`Orientation lock failed: ${error.message}`);
      onOrientationLockError?.(error);
    }
  }, [canLockOrientation, onOrientationLockError]);

  /**
   * Request fullscreen for an element
   */
  const requestFullscreen = useCallback(async (element: HTMLElement) => {
    if (!enabled) {
      console.debug('[useFullscreenOrientation] Fullscreen disabled');
      return;
    }

    if (!canRequestFullscreen) {
      const errorMsg = 'Fullscreen not supported';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      currentElementRef.current = element;
      await requestFullscreenCompat(element);

      // Lock orientation after entering fullscreen (with a small delay for reliability)
      if (orientation && canLockOrientation) {
        setTimeout(() => {
          lockOrientation(orientation);
        }, 100);
      }
    } catch (err) {
      const error = err as Error;
      const errorMsg = `Fullscreen request failed: ${error.message}`;
      console.warn('[useFullscreenOrientation]', errorMsg);
      setError(errorMsg);
      throw error;
    }
  }, [enabled, canRequestFullscreen, canLockOrientation, orientation, lockOrientation]);

  /**
   * Exit fullscreen mode
   */
  const exitFullscreen = useCallback(async () => {
    if (!getFullscreenElement()) {
      console.debug('[useFullscreenOrientation] Not in fullscreen');
      return;
    }

    try {
      await exitFullscreenCompat();
      currentElementRef.current = null;
    } catch (err) {
      const error = err as Error;
      const errorMsg = `Exit fullscreen failed: ${error.message}`;
      console.warn('[useFullscreenOrientation]', errorMsg);
      setError(errorMsg);
      throw error;
    }
  }, []);

  /**
   * Set up fullscreen event listeners
   */
  useEffect(() => {
    if (!enabled || !canRequestFullscreen) {
      return;
    }

    // Add all possible fullscreen change event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Check initial state
    const isNowFullscreen = !!getFullscreenElement();
    setIsFullscreen(isNowFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [enabled, canRequestFullscreen, handleFullscreenChange]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      // Exit fullscreen if still active on unmount
      if (getFullscreenElement() && currentElementRef.current) {
        exitFullscreenCompat().catch((err) => {
          console.warn('[useFullscreenOrientation] Cleanup exit fullscreen failed:', err);
        });
      }

      // Unlock orientation if still locked
      if (orientationLockedRef.current && canLockOrientation) {
        try {
          const orientation = screen.orientation as ScreenOrientationWithLock;
          orientation.unlock();
          orientationLockedRef.current = false;
        } catch (err) {
          console.warn('[useFullscreenOrientation] Cleanup unlock orientation failed:', err);
        }
      }
    };
  }, [canLockOrientation]);

  return {
    isFullscreen,
    isOrientationLocked,
    canRequestFullscreen,
    canLockOrientation,
    requestFullscreen,
    exitFullscreen,
    error,
  };
}
