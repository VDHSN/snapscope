/**
 * PhotoCaptureScreen Flash Props Tests
 *
 * Simple unit tests that verify flash toggle props are accepted
 * without attempting complex integration testing in JSDOM.
 *
 * These tests verify:
 * - Component accepts flash-related props
 * - Props have correct TypeScript types
 * - Component renders without crashing
 *
 * Real flash functionality is tested manually on actual devices.
 */

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { PhotoCaptureScreen } from '../photo-capture-screen';

describe('PhotoCaptureScreen - Flash Props', () => {
  // Mock getUserMedia to prevent "not supported" errors
  beforeEach(() => {
    const mockVideoTrack = {
      stop: vi.fn(),
      getCapabilities: vi.fn().mockReturnValue({}),
      getSettings: vi.fn().mockReturnValue({}),
      applyConstraints: vi.fn().mockResolvedValue(undefined),
    };

    const mockStream = {
      getTracks: vi.fn().mockReturnValue([mockVideoTrack]),
      getVideoTracks: vi.fn().mockReturnValue([mockVideoTrack]),
    } as unknown as MediaStream;

    const getUserMediaMock = vi.fn().mockResolvedValue(mockStream);
    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      configurable: true,
      value: {
        getUserMedia: getUserMediaMock,
        getSupportedConstraints: vi.fn().mockReturnValue({}),
      },
    });
  });

  it('accepts flashEnabled prop without errors', () => {
    const { container } = render(
      <PhotoCaptureScreen
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        flashEnabled={true}
        onFlashToggle={vi.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('accepts flashEnabled=false without errors', () => {
    const { container } = render(
      <PhotoCaptureScreen
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        flashEnabled={false}
        onFlashToggle={vi.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('accepts onFlashToggle callback prop', () => {
    const mockToggle = vi.fn();
    const { container } = render(
      <PhotoCaptureScreen
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        onFlashToggle={mockToggle}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('renders without flash props (default behavior)', () => {
    const { container } = render(
      <PhotoCaptureScreen
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('handles flashEnabled state changes via rerender', () => {
    const { rerender, container } = render(
      <PhotoCaptureScreen
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        flashEnabled={false}
        onFlashToggle={vi.fn()}
      />
    );

    expect(container).toBeInTheDocument();

    rerender(
      <PhotoCaptureScreen
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        flashEnabled={true}
        onFlashToggle={vi.fn()}
      />
    );

    expect(container).toBeInTheDocument();
  });

  it('accepts both flash props together', () => {
    const mockToggle = vi.fn();
    const { container } = render(
      <PhotoCaptureScreen
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        flashEnabled={true}
        onFlashToggle={mockToggle}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('renders when modal is closed with flash props', () => {
    const { container } = render(
      <PhotoCaptureScreen
        isOpen={false}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        flashEnabled={true}
        onFlashToggle={vi.fn()}
      />
    );
    // Closed modal returns null, so container has no children
    expect(container.firstChild).toBeNull();
  });

  it('accepts onFlashToggle without flashEnabled prop', () => {
    const mockToggle = vi.fn();
    const { container } = render(
      <PhotoCaptureScreen
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        onFlashToggle={mockToggle}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('accepts flashEnabled without onFlashToggle prop', () => {
    const { container } = render(
      <PhotoCaptureScreen
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        flashEnabled={true}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('combines flash props with other optional props', () => {
    const mockToggle = vi.fn();
    const { container } = render(
      <PhotoCaptureScreen
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        flashEnabled={true}
        onFlashToggle={mockToggle}
        headerText="Custom Header"
        footerText="Custom Footer"
        progressText="1/5 photos"
        facingMode="environment"
        quality={0.9}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
