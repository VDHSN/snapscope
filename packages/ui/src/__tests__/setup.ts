/**
 * Test setup file for UI package
 * Configures the testing environment and provides global utilities
 */

import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Suppress act() warnings for flash prop tests
// These warnings occur because camera initialization is async and happens after render
// Since we're only testing prop acceptance (not camera behavior), these warnings are noise
const originalError = console.error;
beforeEach(() => {
  console.error = (...args: unknown[]) => {
    const message = typeof args[0] === 'string' ? args[0] : '';
    if (message.includes('not wrapped in act(')) {
      return;
    }
    originalError.call(console, ...args);
  };
});

// Ensure document.body exists before each test
beforeEach(() => {
  if (!document.body) {
    document.body = document.createElement('body');
  }
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  console.error = originalError;
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

// Mock URL.createObjectURL and URL.revokeObjectURL
if (!global.URL.createObjectURL) {
  global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
}

if (!global.URL.revokeObjectURL) {
  global.URL.revokeObjectURL = vi.fn();
}

// Mock requestAnimationFrame if not available
if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    callback(0);
    return 0;
  }) as unknown as typeof requestAnimationFrame;
}

// Mock cancelAnimationFrame if not available
if (!global.cancelAnimationFrame) {
  global.cancelAnimationFrame = vi.fn();
}

// Mock MediaDevices and getUserMedia
class MockMediaStream {
  private tracks: MediaStreamTrack[] = [];

  getTracks(): MediaStreamTrack[] {
    return this.tracks;
  }

  getVideoTracks(): MediaStreamTrack[] {
    return this.tracks;
  }

  addTrack(track: MediaStreamTrack): void {
    this.tracks.push(track);
  }
}

// Create a mock MediaStreamTrack with inspectable applyConstraints
class MockMediaStreamTrack {
  enabled = true;
  id = 'mock-track-id';
  kind = 'video';
  label = 'mock camera';
  muted = false;
  readyState: MediaStreamTrackState = 'live';

  private constraints: MediaTrackConstraints = {};
  private capabilities: MediaTrackCapabilities = {
    width: { min: 640, max: 1920 },
    height: { min: 480, max: 1080 },
    facingMode: ['environment'],
  };
  private settings: MediaTrackSettings = {
    width: 1920,
    height: 1080,
    facingMode: 'environment',
    deviceId: 'mock-device-id',
  };

  // Mock function that can be inspected in tests
  applyConstraints = vi.fn(async (constraints: MediaTrackConstraints): Promise<void> => {
    this.constraints = { ...this.constraints, ...constraints };
  });

  stop = vi.fn((): void => {
    this.readyState = 'ended';
  });

  getCapabilities = vi.fn((): MediaTrackCapabilities => {
    return this.capabilities;
  });

  getSettings = vi.fn((): MediaTrackSettings => {
    return this.settings;
  });

  getConstraints(): MediaTrackConstraints {
    return this.constraints;
  }

  clone(): MediaStreamTrack {
    return new MockMediaStreamTrack() as unknown as MediaStreamTrack;
  }

  addEventListener(): void {}
  removeEventListener(): void {}
  dispatchEvent(): boolean { return true; }

  // Mock methods for torch support
  setTorchSupported(supported: boolean): void {
    if (supported) {
      (this.capabilities as MediaTrackCapabilities & { torch?: boolean }).torch = true;
    } else {
      delete (this.capabilities as MediaTrackCapabilities & { torch?: boolean }).torch;
    }
  }

  setFacingMode(mode: 'user' | 'environment'): void {
    this.settings.facingMode = mode;
  }

  // Allow simulating applyConstraints failure
  setApplyConstraintsBehavior(behavior: 'success' | 'error', errorMessage?: string): void {
    if (behavior === 'error') {
      this.applyConstraints = vi.fn().mockRejectedValue(new Error(errorMessage || 'Failed to apply constraints'));
    } else {
      this.applyConstraints = vi.fn(async (constraints: MediaTrackConstraints): Promise<void> => {
        this.constraints = { ...this.constraints, ...constraints };
      });
    }
  }
}

// Setup navigator.mediaDevices mock
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  configurable: true,
  value: {
    getUserMedia: vi.fn(),
    getSupportedConstraints: vi.fn(() => ({
      width: true,
      height: true,
      facingMode: true,
      torch: false,
    })),
  },
});

// Export mock classes for test usage
export { MockMediaStream, MockMediaStreamTrack };
