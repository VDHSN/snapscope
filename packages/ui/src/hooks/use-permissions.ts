/**
 * Custom hook for managing camera permissions
 * Provides proactive permission checking and better UX for camera access
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export type PermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable' | 'checking';

export interface CameraPermissionInfo {
  state: PermissionState;
  canRequest: boolean;
  hasChecked: boolean;
  error?: string;
  browserInfo?: {
    name: string;
    supportsPermissionAPI: boolean;
    requiresUserGesture: boolean;
  };
}

export interface PermissionRequestOptions {
  facingMode?: 'user' | 'environment';
  showFallback?: boolean;
  onFallback?: () => void;
}

interface BrowserInfo {
  name: string;
  supportsPermissionAPI: boolean;
  requiresUserGesture: boolean;
}

/**
 * Detect browser capabilities and requirements
 */
function getBrowserInfo(): BrowserInfo {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Basic browser detection
  let browserName = 'unknown';
  if (userAgent.includes('chrome')) browserName = 'chrome';
  else if (userAgent.includes('firefox')) browserName = 'firefox';
  else if (userAgent.includes('safari')) browserName = 'safari';
  else if (userAgent.includes('edge')) browserName = 'edge';

  // Check if Permissions API is supported
  const supportsPermissionAPI = 'permissions' in navigator;

  // Most mobile browsers require user gesture
  const requiresUserGesture = /android|iphone|ipad|mobile/i.test(userAgent);

  return {
    name: browserName,
    supportsPermissionAPI,
    requiresUserGesture,
  };
}

/**
 * Get helpful error messages based on browser and error type
 */
function getPermissionErrorMessage(error: string, browserInfo: BrowserInfo): string {
  if (error.includes('NotAllowedError') || error.includes('PermissionDeniedError')) {
    if (browserInfo.name === 'chrome') {
      return 'Camera access was blocked. Click the camera icon in the address bar to allow access, then refresh the page.';
    } else if (browserInfo.name === 'firefox') {
      return 'Camera access was blocked. Look for the camera icon in the address bar and click "Allow", then try again.';
    } else if (browserInfo.name === 'safari') {
      return 'Camera access was denied. Go to Safari > Settings for This Website > Camera and select "Allow", then refresh.';
    }
    return 'Camera access was denied. Please check your browser settings and allow camera access for this site.';
  }

  if (error.includes('NotFoundError') || error.includes('DevicesNotFoundError')) {
    return 'No camera was found on this device. Make sure a camera is connected and try again.';
  }

  if (error.includes('NotSupportedError')) {
    return `Camera access is not supported in ${browserInfo.name}. Try using Chrome, Firefox, or Safari.`;
  }

  if (error.includes('NotReadableError')) {
    return 'Camera is already in use by another application. Close other camera apps and try again.';
  }

  return 'Unable to access camera. Please check your device settings and try again.';
}

/**
 * Custom hook for camera permissions
 */
export function usePermissions(): {
  permission: CameraPermissionInfo;
  requestPermission: (options?: PermissionRequestOptions) => Promise<boolean>;
  checkPermission: () => Promise<void>;
  resetPermission: () => void;
} {
  const [permissionState, setPermissionState] = useState<CameraPermissionInfo>({
    state: 'prompt',
    canRequest: true,
    hasChecked: false,
  });

  const browserInfoRef = useRef<BrowserInfo>(getBrowserInfo());
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * Check current permission status using the Permissions API if available
   */
  const checkPermissionAPI = useCallback(async (): Promise<PermissionState> => {
    if (!browserInfoRef.current.supportsPermissionAPI) {
      return 'prompt';
    }

    try {
      // Check camera permission
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return result.state as PermissionState;
    } catch (error) {
      console.warn('Failed to check camera permission:', error);
      return 'prompt';
    }
  }, []);

  /**
   * Check if camera is supported
   */
  const isCameraSupported = useCallback((): boolean => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }, []);

  /**
   * Check permission status
   */
  const checkPermission = useCallback(async (): Promise<void> => {
    if (!isCameraSupported()) {
      setPermissionState({
        state: 'unavailable',
        canRequest: false,
        hasChecked: true,
        error: 'Camera is not supported on this device or browser.',
        browserInfo: browserInfoRef.current,
      });
      return;
    }

    setPermissionState(prev => ({ ...prev, state: 'checking' }));

    try {
      const apiState = await checkPermissionAPI();
      
      setPermissionState({
        state: apiState,
        canRequest: apiState !== 'denied',
        hasChecked: true,
        browserInfo: browserInfoRef.current,
      });
    } catch (error) {
      setPermissionState({
        state: 'prompt',
        canRequest: true,
        hasChecked: true,
        error: error instanceof Error ? error.message : 'Unknown error',
        browserInfo: browserInfoRef.current,
      });
    }
  }, [checkPermissionAPI, isCameraSupported]);

  /**
   * Request camera permission
   */
  const requestPermission = useCallback(async (options: PermissionRequestOptions = {}): Promise<boolean> => {
    if (!isCameraSupported()) {
      setPermissionState(prev => ({
        ...prev,
        state: 'unavailable',
        canRequest: false,
        error: 'Camera is not supported on this device or browser.',
      }));
      return false;
    }

    setPermissionState(prev => ({ ...prev, state: 'checking' }));

    try {
      // Clean up any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // Request access to camera
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: options.facingMode ?? 'environment',
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Permission granted
      setPermissionState({
        state: 'granted',
        canRequest: true,
        hasChecked: true,
        browserInfo: browserInfoRef.current,
      });

      // Stop the stream immediately since we only needed it for permission
      stream.getTracks().forEach(track => track.stop());
      streamRef.current = null;

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const userFriendlyMessage = getPermissionErrorMessage(errorMessage, browserInfoRef.current);
      
      // Determine the final state based on error type
      let finalState: PermissionState = 'denied';
      if (errorMessage.includes('NotSupportedError')) {
        finalState = 'unavailable';
      } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('DevicesNotFoundError')) {
        finalState = 'unavailable';
      }

      setPermissionState({
        state: finalState,
        canRequest: finalState !== 'denied',
        hasChecked: true,
        error: userFriendlyMessage,
        browserInfo: browserInfoRef.current,
      });

      // Offer fallback if permission was denied and fallback is available
      if (finalState === 'denied' && options.showFallback && options.onFallback) {
        options.onFallback();
      }

      return false;
    }
  }, [isCameraSupported]);

  /**
   * Reset permission state
   */
  const resetPermission = useCallback((): void => {
    // Clean up any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setPermissionState({
      state: 'prompt',
      canRequest: true,
      hasChecked: false,
      browserInfo: browserInfoRef.current,
    });
  }, []);

  /**
   * Listen for permission changes (if supported)
   */
  useEffect(() => {
    if (!browserInfoRef.current.supportsPermissionAPI) {
      return;
    }

    let permissionStatus: PermissionStatus | null = null;

    const setupPermissionListener = async () => {
      try {
        permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
        
        const handlePermissionChange = () => {
          if (permissionStatus) {
            setPermissionState(prev => ({
              ...prev,
              state: permissionStatus!.state as PermissionState,
              canRequest: permissionStatus!.state !== 'denied',
            }));
          }
        };

        permissionStatus.addEventListener('change', handlePermissionChange);
        
        // Set initial state
        handlePermissionChange();
      } catch (error) {
        console.warn('Failed to set up permission listener:', error);
      }
    };

    setupPermissionListener();

    return () => {
      if (permissionStatus) {
        permissionStatus.removeEventListener('change', () => {});
      }
    };
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    permission: permissionState,
    requestPermission,
    checkPermission,
    resetPermission,
  };
}