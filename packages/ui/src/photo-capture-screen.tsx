/**
 * PhotoCaptureScreen Component
 * 
 * A specialized camera capture screen for vehicle assessment workflows.
 * Built on the CameraCapture foundation with added features:
 * - Customizable header and footer text
 * - Progress indicators
 * - Semi-transparent overlays
 * - Bottom-right capture button positioning
 * - Optional blur detection
 * - Mobile-first responsive design
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from './button';
import { Typography } from './typography';
import { Icon } from './icon';
import { usePermissions, type PermissionRequestOptions } from './hooks/use-permissions';
import { detectBlur, quickBlurCheck } from './blur-detection';
import { cssVars } from './tokens';

export interface PhotoCaptureScreenProps {
  /** Whether the capture screen is open/visible */
  isOpen: boolean;
  /** Callback when screen is closed */
  onClose: () => void;
  /** Callback when photo is captured with optional blur detection result */
  onCapture: (photoBlob: Blob, isBlurry?: boolean) => void;
  /** Optional error callback */
  onError?: (error: string) => void;
  /** Header text displayed at top of screen */
  headerText?: string;
  /** Footer text displayed at bottom of screen */
  footerText?: string;
  /** Progress text (e.g., "2/10 photos complete") */
  progressText?: string;
  /** CSS color for semi-transparent overlay */
  overlayColor?: string;
  /** Whether to enable blur detection */
  enableBlurDetection?: boolean;
  /** Blur detection threshold (0-100, lower = more sensitive) */
  blurThreshold?: number;
  /** Callback when blur is detected */
  onBlurDetected?: (isBlurry: boolean) => void;
  /** Camera facing mode */
  facingMode?: 'user' | 'environment';
  /** Photo quality (0-1) */
  quality?: number;
  /** Maximum photo width */
  maxWidth?: number;
  /** Maximum photo height */
  maxHeight?: number;
  /** Allow fallback file upload */
  allowFallbackUpload?: boolean;
  /** Callback for fallback upload */
  onFallbackUpload?: () => void;
  /** Whether flash/torch is enabled */
  flashEnabled?: boolean;
  /** Callback when flash is toggled */
  onFlashToggle?: (enabled: boolean) => void;
}

interface CameraError {
  type: 'permission' | 'not_supported' | 'no_camera' | 'wrong_camera' | 'generic';
  message: string;
}

interface CameraStreamInfo {
  facingMode?: string;
  width?: number;
  height?: number;
  deviceId?: string;
}

export const PhotoCaptureScreen: React.FC<PhotoCaptureScreenProps> = ({
  isOpen,
  onClose,
  onCapture,
  onError,
  headerText = 'Take Photo',
  footerText,
  progressText,
  overlayColor,
  enableBlurDetection = false,
  blurThreshold = 30,
  onBlurDetected,
  facingMode = 'environment',
  quality = 0.8,
  maxWidth = 1920,
  maxHeight = 1080,
  allowFallbackUpload = true,
  onFallbackUpload,
  flashEnabled = false,
  onFlashToggle,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoReadyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [cameraState, setCameraState] = useState<'idle' | 'loading' | 'ready' | 'error' | 'permission_check' | 'validating'>('idle');
  const [error, setError] = useState<CameraError | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [streamInfo, setStreamInfo] = useState<CameraStreamInfo | null>(null);
  const [showCameraWarning, setShowCameraWarning] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isAnalyzingBlur, setIsAnalyzingBlur] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [shouldRequestPermission, setShouldRequestPermission] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const maxRetries = 2;

  // Use the permissions hook
  const { permission, requestPermission, checkPermission } = usePermissions();
  
  // Check if camera is supported
  const isCameraSupported = useCallback(() => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }, []);

  // Validate camera stream to ensure we got the requested camera
  const validateCameraStream = useCallback((stream: MediaStream, requestedFacingMode: string): CameraStreamInfo => {
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) {
      throw new Error('No video track found in stream');
    }

    const settings = videoTrack.getSettings();
    const streamInfo: CameraStreamInfo = {
      facingMode: settings.facingMode,
      width: settings.width,
      height: settings.height,
      deviceId: settings.deviceId,
    };

    console.debug('[PhotoCaptureScreen] Camera stream settings:', settings);
    
    // Check if we got the requested facing mode
    if (requestedFacingMode === 'environment' && settings.facingMode !== 'environment') {
      console.warn('[PhotoCaptureScreen] Requested rear camera but got:', settings.facingMode);
      // Don't throw error, just warn - we'll show a warning to the user
    }

    return streamInfo;
  }, []);

  // Handle camera errors with mobile-specific messages
  const handleCameraError = useCallback((err: Error & { name?: string }) => {
    let cameraError: CameraError;
    const isMobile = permission.browserInfo?.isMobile ?? false;
    const isIOS = permission.browserInfo?.isIOS ?? false;
    
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      let message = 'Camera permission denied. Please allow camera access and try again.';
      if (isMobile) {
        if (isIOS) {
          message = 'Camera permission denied. Check Safari > Settings for This Website > Camera and select "Allow", then refresh and try again.';
        } else {
          message = 'Camera permission denied. Look for the camera icon in your browser\'s address bar and click "Allow", then try again.';
        }
      }
      cameraError = {
        type: 'permission',
        message,
      };
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      cameraError = {
        type: 'no_camera',
        message: isMobile ? 'No camera found. Make sure your device has a camera and try again.' : 'No camera found on this device.',
      };
    } else if (err.name === 'NotSupportedError') {
      cameraError = {
        type: 'not_supported',
        message: isMobile ? 'Camera not supported in this browser. Try using Chrome, Safari, or Firefox.' : 'Camera is not supported on this device or browser.',
      };
    } else if (err.name === 'OverconstrainedError') {
      cameraError = {
        type: 'wrong_camera',
        message: isMobile ? 'Rear camera not available. The device may only have a front camera.' : 'Unable to access the requested camera. Please try with different settings.',
      };
    } else if (err.name === 'NotReadableError') {
      cameraError = {
        type: 'generic',
        message: isMobile ? 'Camera is being used by another app. Close other camera apps and try again.' : 'Camera is already in use. Close other applications using the camera and try again.',
      };
    } else {
      cameraError = {
        type: 'generic',
        message: isMobile ? 'Unable to start camera. Try closing other apps and refreshing the page.' : 'Unable to access camera. Please try again.',
      };
    }
    
    setError(cameraError);
    setCameraState('error');
    onError?.(cameraError.message);
    console.error('Camera error:', err);
  }, [onError, permission.browserInfo]);

  // Retry camera initialization with different constraints
  const retryCamera = useCallback(async () => {
    if (retryCount >= maxRetries) {
      console.error('[PhotoCaptureScreen] Max retries reached');
      return;
    }

    console.debug(`[PhotoCaptureScreen] Retrying camera initialization (attempt ${retryCount + 1}/${maxRetries})`);
    setRetryCount(prev => prev + 1);
    setError(null);
    setShowCameraWarning(false);

    // Reset state and try again
    setCameraState('idle');
  }, [retryCount, maxRetries]);

  // Handle flash toggle
  const handleFlashToggle = useCallback(async () => {
    if (!streamRef.current || !torchSupported) {
      console.warn('[PhotoCaptureScreen] Cannot toggle flash: stream or torch not available');
      return;
    }

    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) {
      console.warn('[PhotoCaptureScreen] No video track found');
      return;
    }

    const newState = !flashEnabled;

    try {
      await videoTrack.applyConstraints({
        advanced: [{ torch: newState } as MediaTrackConstraints]
      });
      onFlashToggle?.(newState);
      console.debug('[PhotoCaptureScreen] Torch toggled to:', newState);
    } catch (error) {
      console.error('[PhotoCaptureScreen] Failed to toggle torch:', error);
      onError?.('Failed to toggle flash. Your device may not support this feature.');
    }
  }, [flashEnabled, torchSupported, onFlashToggle, onError]);

  // Start camera with permission check
  const startCamera = useCallback(async () => {
    console.debug('[PhotoCaptureScreen] Starting camera initialization');
    
    if (!isCameraSupported()) {
      console.error('[PhotoCaptureScreen] Camera not supported on this device');
      handleCameraError({ name: 'NotSupportedError', message: 'Camera not supported' });
      return;
    }

    console.debug('[PhotoCaptureScreen] Setting state to permission_check');
    setCameraState('permission_check');
    setError(null);
    setShouldRequestPermission(true);
  }, [facingMode, isCameraSupported, handleCameraError]);

  // Initialize camera after permission is granted
  const initializeCamera = useCallback(async () => {
    try {
      // Permission granted, now start the camera with enhanced constraints
      console.debug('[PhotoCaptureScreen] Permission granted, starting camera stream');
      setCameraState('loading');

      // Build enhanced constraints similar to permission hook
      const isMobile = permission.browserInfo?.isMobile ?? false;
      
      const videoConstraints: MediaTrackConstraints = {
        width: { ideal: maxWidth, max: maxWidth },
        height: { ideal: maxHeight, max: maxHeight },
      };

      // Use exact constraint for rear camera on mobile for better enforcement
      if (isMobile && facingMode === 'environment') {
        videoConstraints.facingMode = { exact: facingMode };
      } else {
        videoConstraints.facingMode = { ideal: facingMode };
      }

      const constraints: MediaStreamConstraints = {
        video: videoConstraints,
        audio: false,
      };

      console.debug('[PhotoCaptureScreen] Camera constraints:', constraints);

      let stream: MediaStream;
      
      try {
        // Try with initial constraints
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (error) {
        // If exact constraint failed on mobile, try with ideal constraint
        if (isMobile && facingMode === 'environment') {
          console.warn('[PhotoCaptureScreen] Exact facingMode constraint failed, trying ideal:', error);
          
          const fallbackConstraints: MediaStreamConstraints = {
            video: {
              facingMode: { ideal: facingMode },
              width: { ideal: maxWidth, max: maxWidth },
              height: { ideal: maxHeight, max: maxHeight },
            },
            audio: false,
          };
          
          console.debug('[PhotoCaptureScreen] Fallback camera constraints:', fallbackConstraints);
          stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
        } else {
          // Re-throw the error if we can't provide fallback
          throw error;
        }
      }
      
      streamRef.current = stream;
      console.debug('[PhotoCaptureScreen] Media stream obtained, validating camera');

      // Validate the camera stream
      setCameraState('validating');
      const streamInfo = validateCameraStream(stream, facingMode);
      setStreamInfo(streamInfo);

      // Check if we got the wrong camera and show warning
      if (facingMode === 'environment' && streamInfo.facingMode !== 'environment') {
        setShowCameraWarning(true);
      } else {
        setShowCameraWarning(false);
      }

      // Check for torch support (only on rear camera)
      let isTorchSupported = false;
      if (facingMode === 'environment') {
        try {
          const videoTrack = stream.getVideoTracks()[0];
          const capabilities = videoTrack?.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
          const constraints = navigator.mediaDevices.getSupportedConstraints() as MediaTrackSupportedConstraints & { torch?: boolean };

          isTorchSupported = !!(constraints.torch && capabilities?.torch);
          console.debug('[PhotoCaptureScreen] Torch support detected:', isTorchSupported);
        } catch (error) {
          console.warn('[PhotoCaptureScreen] Failed to check torch support:', error);
        }
      }
      setTorchSupported(isTorchSupported);

      // Apply initial torch state if flash is enabled and supported
      if (isTorchSupported && flashEnabled) {
        try {
          const videoTrack = stream.getVideoTracks()[0];
          await videoTrack.applyConstraints({
            advanced: [{ torch: true } as MediaTrackConstraints]
          });
          console.debug('[PhotoCaptureScreen] Torch enabled on camera start');
        } catch (error) {
          console.warn('[PhotoCaptureScreen] Failed to enable torch on start:', error);
        }
      }
      
      console.debug('[PhotoCaptureScreen] Camera validated, setting up video element');

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;

        // Set up multiple event listeners for video readiness
        const handleVideoReady = () => {
          console.debug('[PhotoCaptureScreen] Video ready - transitioning to ready state');
          
          // Clear timeout if it exists
          if (videoReadyTimeoutRef.current) {
            clearTimeout(videoReadyTimeoutRef.current);
            videoReadyTimeoutRef.current = null;
          }
          
          // Clean up listeners once ready
          video.removeEventListener('loadedmetadata', handleVideoReady);
          video.removeEventListener('canplay', handleVideoReady);
          video.removeEventListener('loadeddata', handleVideoReady);
          video.removeEventListener('error', handleVideoError);
          
          setCameraState('ready');
          // Reset retry count on successful initialization
          setRetryCount(0);
        };

        const handleVideoError = (event: Event) => {
          console.error('[PhotoCaptureScreen] Video error event:', event);
          
          // Clear timeout if it exists
          if (videoReadyTimeoutRef.current) {
            clearTimeout(videoReadyTimeoutRef.current);
            videoReadyTimeoutRef.current = null;
          }
          
          handleCameraError(new Error('Video stream initialization failed'));
        };

        // Add multiple event listeners for better reliability
        video.addEventListener('loadedmetadata', handleVideoReady, { once: true });
        video.addEventListener('canplay', handleVideoReady, { once: true });
        video.addEventListener('loadeddata', handleVideoReady, { once: true });
        video.addEventListener('error', handleVideoError, { once: true });

        console.debug('[PhotoCaptureScreen] Video src set, waiting for ready events');

        // Timeout fallback - if no events fire within 5 seconds, force ready state
        videoReadyTimeoutRef.current = setTimeout(() => {
          console.warn('[PhotoCaptureScreen] Video ready events timeout - checking video state');
          
          // Ensure video element is still available
          if (!videoRef.current) {
            console.error('[PhotoCaptureScreen] Video element no longer available during timeout check');
            handleCameraError(new Error('Video element became unavailable'));
            return;
          }
          
          const currentVideo = videoRef.current;
          
          // Check if video has valid dimensions as a final check
          if (currentVideo.videoWidth > 0 && currentVideo.videoHeight > 0) {
            console.debug('[PhotoCaptureScreen] Video has valid dimensions, forcing ready state');
            handleVideoReady();
          } else {
            console.error('[PhotoCaptureScreen] Video dimensions invalid after timeout:', {
              videoWidth: currentVideo.videoWidth,
              videoHeight: currentVideo.videoHeight,
              readyState: currentVideo.readyState,
              networkState: currentVideo.networkState,
              srcObject: !!currentVideo.srcObject
            });
            handleCameraError(new Error('Video stream timeout - unable to initialize camera'));
          }
        }, 5000);
      }
    } catch (err) {
      handleCameraError(err as Error);
    }
  }, [facingMode, maxWidth, maxHeight, handleCameraError, permission.browserInfo, validateCameraStream]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    console.debug('[PhotoCaptureScreen] Stopping camera');
    
    // Clear any pending timeout
    if (videoReadyTimeoutRef.current) {
      clearTimeout(videoReadyTimeoutRef.current);
      videoReadyTimeoutRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    // Reset all camera-related state
    setCameraState('idle');
    setError(null);
    setRetryCount(0);
    setShowCameraWarning(false);
    setStreamInfo(null);
    setIsCapturing(false);
    setIsAnalyzingBlur(false);
  }, []);

  // Capture photo from video stream
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || cameraState !== 'ready') {
      return;
    }

    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Set canvas dimensions to video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0);

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          let isBlurry: boolean | undefined = undefined;
          
          // Perform blur detection if enabled
          if (enableBlurDetection) {
            try {
              setIsAnalyzingBlur(true);
              isBlurry = await detectBlur(blob, blurThreshold);
              onBlurDetected?.(isBlurry);
              console.debug('[PhotoCaptureScreen] Blur detection result:', { isBlurry, threshold: blurThreshold });
            } catch (error) {
              console.warn('[PhotoCaptureScreen] Blur detection failed, continuing:', error);
              // Continue with capture even if blur detection fails
            } finally {
              setIsAnalyzingBlur(false);
            }
          }
          
          onCapture(blob, isBlurry);
          stopCamera();
        } else {
          onError?.('Failed to capture photo');
        }
        setIsCapturing(false);
      }, 'image/jpeg', quality);

    } catch (err) {
      console.error('Photo capture error:', err);
      onError?.('Failed to capture photo');
      setIsCapturing(false);
      setIsAnalyzingBlur(false);
    }
  }, [cameraState, onCapture, onError, quality, stopCamera, enableBlurDetection, blurThreshold, onBlurDetected]);

  // Toggle facing mode (front/back camera)
  const toggleFacingMode = useCallback(() => {
    // const newMode = facingMode === 'user' ? 'environment' : 'user';
    stopCamera();
    // Note: In a real implementation, you'd need to restart with new facing mode
    // This would require lifting the facingMode state up to the parent component
  }, [stopCamera]);

  // Handle modal open/close - start camera when opening, stop when closing
  useEffect(() => {
    if (isOpen && !prevIsOpen) {
      // Modal just opened - always start camera
      console.debug('[PhotoCaptureScreen] Modal opened, starting camera');
      startCamera();
    } else if (!isOpen && prevIsOpen) {
      // Modal just closed - always stop camera
      console.debug('[PhotoCaptureScreen] Modal closed, stopping camera');
      stopCamera();
    }
    
    // Update previous state
    setPrevIsOpen(isOpen);
  }, [isOpen, prevIsOpen, startCamera, stopCamera]);

  // Handle retry after state change
  useEffect(() => {
    if (cameraState === 'idle' && retryCount > 0 && isOpen) {
      // Only retry if modal is still open
      const timeoutId = setTimeout(() => {
        console.debug('[PhotoCaptureScreen] Retrying camera after error');
        startCamera();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [cameraState, retryCount, startCamera, isOpen]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      console.debug('[PhotoCaptureScreen] Component unmounting, cleaning up');
      stopCamera();
    };
  }, [stopCamera]);

  // Handle permission request after permission_check state is rendered
  useEffect(() => {
    if (!shouldRequestPermission || cameraState !== 'permission_check') return;

    const requestCameraPermission = async () => {
      const permissionGranted = await requestPermission({
        facingMode,
        showFallback: allowFallbackUpload,
        onFallback: onFallbackUpload,
        preferExactConstraints: true,
      });

      if (permissionGranted) {
        await initializeCamera();
      } else {
        // Permission was denied - error details are already in the permission state
        console.error('[PhotoCaptureScreen] Permission denied:', permission.error);
        setCameraState('error');
        const permissionError: CameraError = {
          type: 'permission',
          message: permission.error ?? 'Camera permission denied',
        };
        setError(permissionError);
        onError?.(permissionError.message);
      }

      setShouldRequestPermission(false);
    };

    requestCameraPermission();
  }, [shouldRequestPermission, cameraState, facingMode, allowFallbackUpload, onFallbackUpload, requestPermission, initializeCamera, permission.error, onError]);

  // Handle modal close
  const handleClose = useCallback(() => {
    // Note: stopCamera will be called automatically by the isOpen effect
    // when onClose() causes isOpen to become false
    onClose();
  }, [onClose]);

  // Handle file upload fallback
  const handleFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onCapture(file);
      handleClose();
    } else {
      onError?.('Please select a valid image file');
    }
    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  }, [onCapture, handleClose, onError]);

  if (!isOpen) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: cssVars.spaceSm,
        padding: cssVars.spaceMd,
        background: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography variant="h3" style={{ color: 'white' }}>
            {headerText}
          </Typography>
          
          <div style={{ display: 'flex', gap: cssVars.spaceSm }}>
            {/* Flash toggle button (if torch supported) */}
            {cameraState === 'ready' && torchSupported && onFlashToggle && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleFlashToggle}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                }}
                aria-label={flashEnabled ? 'Turn flash off' : 'Turn flash on'}
                title={flashEnabled ? 'Turn flash off' : 'Turn flash on'}
              >
                <Icon name={flashEnabled ? 'flash' : 'flash-off'} size="sm" />
              </Button>
            )}

            {/* Toggle camera button (if multiple cameras available) */}
            {cameraState === 'ready' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleFacingMode}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                }}
                title="Switch camera"
              >
                🔄
              </Button>
            )}

            {/* Close button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
              }}
            >
              ✕
            </Button>
          </div>
        </div>
        
        {/* Progress text */}
        {progressText && (
          <Typography variant="small" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {progressText}
          </Typography>
        )}
      </div>

      {/* Camera Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        // Apply overlay color if provided
        ...(overlayColor && cameraState === 'ready' ? {
          background: `linear-gradient(${overlayColor}80, ${overlayColor}80), black`
        } : {})
      }}>
        {/* Permission Check State */}
        {cameraState === 'permission_check' && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: cssVars.spaceMd,
            color: 'white',
            padding: cssVars.spaceLg,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px' }}>📷</div>
            <Typography variant="h3" style={{ color: 'white' }}>
              Camera Permission
            </Typography>
            <Typography variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Checking camera access...
            </Typography>
            {permission.browserInfo && (
              <Typography variant="caption" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Detected: {permission.browserInfo.name}
              </Typography>
            )}
          </div>
        )}

        {/* Loading State */}
        {cameraState === 'loading' && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: cssVars.spaceMd,
            color: 'white',
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid rgba(255, 255, 255, 0.3)',
              borderTop: '3px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <Typography variant="body" style={{ color: 'white' }}>
              Starting camera...
            </Typography>
          </div>
        )}

        {/* Validating State */}
        {cameraState === 'validating' && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: cssVars.spaceMd,
            color: 'white',
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid rgba(255, 255, 255, 0.3)',
              borderTop: '3px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <Typography variant="body" style={{ color: 'white' }}>
              Checking camera settings...
            </Typography>
          </div>
        )}

        {/* Error State */}
        {cameraState === 'error' && error && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: cssVars.spaceMd,
            color: 'white',
            padding: cssVars.spaceLg,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', color: cssVars.error }}>⚠️</div>
            <Typography variant="h3" style={{ color: 'white' }}>
              Camera Error
            </Typography>
            <Typography variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {error.message}
            </Typography>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: cssVars.spaceSm, 
              marginTop: cssVars.spaceMd,
              width: '100%',
              maxWidth: '320px',
            }}>
              {/* Retry button for permission errors */}
              {error.type === 'permission' && permission.canRequest && (
                <Button
                  variant="primary"
                  onClick={startCamera}
                  style={{ minHeight: '48px' }} // Better mobile touch target
                >
                  Try Again
                </Button>
              )}
              
              {/* Retry button for generic errors with retry count */}
              {(error.type === 'generic' || error.type === 'wrong_camera') && retryCount < maxRetries && (
                <Button
                  variant="primary"
                  onClick={retryCamera}
                  style={{ minHeight: '48px' }} // Better mobile touch target
                >
                  Retry ({retryCount}/{maxRetries})
                </Button>
              )}
              
              {/* Reset retry count button */}
              {retryCount >= maxRetries && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setRetryCount(0);
                    setError(null);
                    startCamera();
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    minHeight: '48px',
                  }}
                >
                  Try Once More
                </Button>
              )}
              
              {/* Upload fallback */}
              {allowFallbackUpload && (
                <Button
                  variant="secondary"
                  onClick={handleFileUpload}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    minHeight: '48px', // Better mobile touch target
                  }}
                >
                  📁 Upload Photo Instead
                </Button>
              )}
            </div>

            {permission.browserInfo && (
              <Typography variant="caption" style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: cssVars.spaceSm,
                textAlign: 'center',
              }}>
                {permission.browserInfo.name}
                {permission.browserInfo.isMobile && ' (mobile)'}
                {permission.browserInfo.isIOS && ' (iOS)'}
                {permission.browserInfo.requiresUserGesture && ' • requires user interaction'}
              </Typography>
            )}
          </div>
        )}

        {/* Video Stream - render during loading, validating AND ready states */}
        {(cameraState === 'loading' || cameraState === 'validating' || cameraState === 'ready') && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                background: 'black',
                // Hide video during loading/validating, show when ready
                opacity: cameraState === 'ready' ? 1 : 0,
                zIndex: cameraState === 'ready' ? 1 : -1,
              }}
            />
            
            {/* Semi-transparent overlay */}
            {cameraState === 'ready' && overlayColor && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `${overlayColor}40`, // 25% opacity
                pointerEvents: 'none',
                zIndex: 2,
              }} />
            )}
            
            {/* Camera Warning - show if wrong camera detected */}
            {cameraState === 'ready' && showCameraWarning && (
              <div style={{
                position: 'absolute',
                top: cssVars.spaceMd,
                left: cssVars.spaceMd,
                right: cssVars.spaceMd,
                background: 'rgba(255, 193, 7, 0.9)',
                color: 'black',
                padding: cssVars.spaceSm,
                borderRadius: cssVars.borderRadiusSm,
                display: 'flex',
                alignItems: 'center',
                gap: cssVars.spaceXs,
                fontSize: '14px',
                zIndex: 10,
              }}>
                <span>⚠️</span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Front camera detected</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>
                    Trying to use rear camera but got {streamInfo?.facingMode ?? 'unknown'}. Switch camera or rotate device.
                  </div>
                </div>
              </div>
            )}

            {/* Capture Button - Bottom-right positioning as per mockup */}
            {cameraState === 'ready' && (
              <div style={{
                position: 'absolute',
                bottom: cssVars.spaceXl,
                right: cssVars.spaceXl, // Position in bottom-right corner
                display: 'flex',
                flexDirection: 'column',
                gap: cssVars.spaceMd,
                alignItems: 'center',
                zIndex: 5,
              }}>
                {/* Stream info for debugging (only in development) */}
                {process.env.NODE_ENV === 'development' && streamInfo && (
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: cssVars.spaceXs,
                    borderRadius: '4px',
                    fontSize: '12px',
                    textAlign: 'center',
                  }}>
                    {streamInfo.facingMode} • {streamInfo.width}x{streamInfo.height}
                  </div>
                )}

                {/* Blur analysis indicator */}
                {isAnalyzingBlur && (
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: cssVars.spaceXs,
                    borderRadius: '4px',
                    fontSize: '12px',
                    textAlign: 'center',
                  }}>
                    Analyzing image...
                  </div>
                )}

                {/* Capture Button - Circular, mobile-optimized */}
                <button
                  onClick={capturePhoto}
                  disabled={isCapturing || isAnalyzingBlur}
                  style={{
                    // Minimum 44px touch target recommended for mobile
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    border: '3px solid white',
                    background: (isCapturing || isAnalyzingBlur) ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)',
                    cursor: (isCapturing || isAnalyzingBlur) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    // Better touch feedback
                    WebkitTapHighlightColor: 'rgba(255, 255, 255, 0.3)',
                    // Larger touch area on mobile
                    minWidth: '64px',
                    minHeight: '64px',
                    // Shadow for better visibility
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  }}
                  title="Take photo"
                  aria-label="Take photo"
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'white',
                    opacity: (isCapturing || isAnalyzingBlur) ? 0.7 : 1,
                    transition: 'opacity 0.2s ease',
                  }} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Text */}
      {footerText && (
        <div style={{
          padding: cssVars.spaceMd,
          background: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          textAlign: 'center',
        }}>
          <Typography variant="small" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {footerText}
          </Typography>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />

      {/* Hidden file input for fallback upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      {/* CSS for loading spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};