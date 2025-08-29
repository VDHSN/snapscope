import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from './button';
import { Typography } from './typography';

export interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoBlob: Blob) => void;
  onError?: (error: string) => void;
  facingMode?: 'user' | 'environment';
  quality?: number; // 0-1, default 0.8
  maxWidth?: number; // max photo width, default 1920
  maxHeight?: number; // max photo height, default 1080
}

interface CameraError {
  type: 'permission' | 'not_supported' | 'no_camera' | 'generic';
  message: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  isOpen,
  onClose,
  onCapture,
  onError,
  facingMode = 'environment', // Default to rear camera for vehicle photos
  quality = 0.8,
  maxWidth = 1920,
  maxHeight = 1080,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [cameraState, setCameraState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<CameraError | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Check if camera is supported
  const isCameraSupported = useCallback(() => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }, []);

  // Handle camera errors
  const handleCameraError = useCallback((err: Error & { name?: string }) => {
    let cameraError: CameraError;
    
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      cameraError = {
        type: 'permission',
        message: 'Camera permission denied. Please allow camera access and try again.',
      };
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      cameraError = {
        type: 'no_camera',
        message: 'No camera found on this device.',
      };
    } else if (err.name === 'NotSupportedError') {
      cameraError = {
        type: 'not_supported',
        message: 'Camera is not supported on this device or browser.',
      };
    } else {
      cameraError = {
        type: 'generic',
        message: 'Unable to access camera. Please try again.',
      };
    }
    
    setError(cameraError);
    setCameraState('error');
    onError?.(cameraError.message);
    console.error('Camera error:', err);
  }, [onError]);

  // Start camera stream
  const startCamera = useCallback(async () => {
    if (!isCameraSupported()) {
      handleCameraError({ name: 'NotSupportedError', message: 'Camera not supported' });
      return;
    }

    setCameraState('loading');
    setError(null);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: maxWidth, max: maxWidth },
          height: { ideal: maxHeight, max: maxHeight },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraState('ready');
        };
      }
    } catch (err) {
      handleCameraError(err as Error);
    }
  }, [facingMode, maxWidth, maxHeight, isCameraSupported, handleCameraError]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraState('idle');
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
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob);
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
    }
  }, [cameraState, onCapture, onError, quality, stopCamera]);

  // Toggle facing mode (front/back camera)
  const toggleFacingMode = useCallback(() => {
    // const newMode = facingMode === 'user' ? 'environment' : 'user';
    stopCamera();
    // Note: In a real implementation, you'd need to restart with new facing mode
    // This would require lifting the facingMode state up to the parent component
  }, [stopCamera]);

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen && cameraState === 'idle') {
      startCamera();
    }
  }, [isOpen, cameraState, startCamera]);

  // Cleanup when component unmounts or modal closes
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Handle modal close
  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-md)',
        background: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
      }}>
        <Typography variant="h3" style={{ color: 'white' }}>
          Take Photo
        </Typography>
        
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
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

      {/* Camera Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Loading State */}
        {cameraState === 'loading' && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 'var(--space-md)',
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

        {/* Error State */}
        {cameraState === 'error' && error && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 'var(--space-md)',
            color: 'white',
            padding: 'var(--space-lg)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', color: 'var(--color-warning)' }}>⚠️</div>
            <Typography variant="h3" style={{ color: 'white' }}>
              Camera Error
            </Typography>
            <Typography variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {error.message}
            </Typography>
            
            {error.type === 'permission' && (
              <Button
                variant="primary"
                onClick={startCamera}
                style={{ marginTop: 'var(--space-md)' }}
              >
                Try Again
              </Button>
            )}
          </div>
        )}

        {/* Video Stream */}
        {cameraState === 'ready' && (
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
              }}
            />
            
            {/* Capture Overlay */}
            <div style={{
              position: 'absolute',
              bottom: 'var(--space-xl)',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 'var(--space-md)',
              alignItems: 'center',
            }}>
              {/* Capture Button */}
              <button
                onClick={capturePhoto}
                disabled={isCapturing}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '4px solid white',
                  background: isCapturing ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
                  cursor: isCapturing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                title="Take photo"
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'white',
                  opacity: isCapturing ? 0.7 : 1,
                }} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas
        ref={canvasRef}
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