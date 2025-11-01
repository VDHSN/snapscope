import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icon } from '../icon';

describe('Icon Component', () => {
  describe('Flash Icon Rendering', () => {
    it('renders flash icon correctly', () => {
      const { container } = render(<Icon name="flash" aria-label="Flash" />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-label', 'Flash');
      expect(svg).toHaveAttribute('role', 'img');
      expect(svg).toHaveAttribute('aria-hidden', 'false');
    });

    it('renders flash-off icon correctly', () => {
      const { container } = render(<Icon name="flash-off" aria-label="Flash Off" />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-label', 'Flash Off');
      expect(svg).toHaveAttribute('role', 'img');
    });

    it('renders flash icon with correct path elements', () => {
      const { container } = render(<Icon name="flash" />);
      const paths = container.querySelectorAll('path');

      // Flash icon should have 1 path element
      expect(paths.length).toBe(1);
      expect(paths[0]).toHaveAttribute('stroke', 'currentColor');
      expect(paths[0]).toHaveAttribute('fill', 'none');
    });

    it('renders flash-off icon with correct path elements', () => {
      const { container } = render(<Icon name="flash-off" />);
      const paths = container.querySelectorAll('path');

      // Flash-off icon should have 2 path elements (flash + strike-through)
      expect(paths.length).toBe(2);
      paths.forEach(path => {
        expect(path).toHaveAttribute('stroke', 'currentColor');
      });
    });
  });

  describe('Icon Sizing', () => {
    it('renders with default md size', () => {
      const { container } = render(<Icon name="flash" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('width', '20');
      expect(svg).toHaveAttribute('height', '20');
    });

    it('renders with sm size', () => {
      const { container } = render(<Icon name="flash" size="sm" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('width', '16');
      expect(svg).toHaveAttribute('height', '16');
    });

    it('renders with lg size', () => {
      const { container } = render(<Icon name="flash" size="lg" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('renders with custom numeric size', () => {
      const { container } = render(<Icon name="flash" size={32} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');
    });
  });

  describe('Icon Styling', () => {
    it('applies custom color', () => {
      const { container } = render(<Icon name="flash" color="red" />);
      const svg = container.querySelector('svg');

      // jsdom converts color names to RGB values
      expect(svg).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });

    it('applies default currentColor', () => {
      const { container } = render(<Icon name="flash" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveStyle({ color: 'currentColor' });
    });

    it('applies custom className', () => {
      const { container } = render(<Icon name="flash" className="custom-class" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveClass('custom-class');
    });

    it('applies custom style', () => {
      const { container } = render(<Icon name="flash" style={{ opacity: 0.5 }} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveStyle({ opacity: '0.5' });
    });
  });

  describe('Accessibility', () => {
    it('sets role to img when aria-label is provided', () => {
      const { container } = render(<Icon name="flash" aria-label="Flash icon" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('role', 'img');
      expect(svg).toHaveAttribute('aria-label', 'Flash icon');
      expect(svg).toHaveAttribute('aria-hidden', 'false');
    });

    it('sets aria-hidden when no aria-label is provided', () => {
      const { container } = render(<Icon name="flash" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('role', 'presentation');
      expect(svg).not.toHaveAttribute('aria-label');
    });

    it('allows explicit aria-hidden override', () => {
      const { container } = render(<Icon name="flash" aria-hidden={false} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('Other Icon Types', () => {
    it('renders camera icon', () => {
      const { container } = render(<Icon name="camera" aria-label="Camera" />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-label', 'Camera');
    });

    it('renders sun icon', () => {
      const { container } = render(<Icon name="sun" aria-label="Sun" />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('renders moon icon', () => {
      const { container } = render(<Icon name="moon" aria-label="Moon" />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('returns null for unknown icon', () => {
      // @ts-expect-error Testing invalid icon name
      const { container } = render(<Icon name="unknown-icon" />);

      expect(container.firstChild).toBeNull();
    });

    it('logs warning for unknown icon', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // @ts-expect-error Testing invalid icon name
      render(<Icon name="unknown-icon" />);

      expect(consoleSpy).toHaveBeenCalledWith('Icon "unknown-icon" not found');
      consoleSpy.mockRestore();
    });
  });

  describe('Common Viewbox and SVG Attributes', () => {
    it('sets correct viewBox for all icons', () => {
      const { container } = render(<Icon name="flash" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('sets fill to none', () => {
      const { container } = render(<Icon name="flash" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('fill', 'none');
    });

    it('sets stroke to currentColor', () => {
      const { container } = render(<Icon name="flash" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });

    it('includes xmlns attribute', () => {
      const { container } = render(<Icon name="flash" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });
  });
});
