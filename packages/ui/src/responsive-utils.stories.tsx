import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BREAKPOINTS, MEDIA_QUERIES, RESPONSIVE_SPACING, RESPONSIVE_GRIDS, TOUCH_TARGET_SIZE } from './responsive-utils';

const meta: Meta = {
  title: 'Foundation/Responsive Utils',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Responsive utility constants and functions for consistent breakpoint handling across components. Provides standardized breakpoints, spacing, and grid configurations.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const BreakpointsDemo: Story = {
  render: () => (
    <div style={{ fontFamily: 'monospace' }}>
      <h3>Breakpoints</h3>
      <pre style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--border-radius-md)' }}>
        {JSON.stringify(BREAKPOINTS, null, 2)}
      </pre>
      
      <h3 style={{ marginTop: 'var(--space-lg)' }}>Media Queries</h3>
      <pre style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--border-radius-md)' }}>
        {JSON.stringify(MEDIA_QUERIES, null, 2)}
      </pre>
      
      <h3 style={{ marginTop: 'var(--space-lg)' }}>Responsive Spacing</h3>
      <pre style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--border-radius-md)' }}>
        {JSON.stringify(RESPONSIVE_SPACING, null, 2)}
      </pre>
      
      <h3 style={{ marginTop: 'var(--space-lg)' }}>Responsive Grids</h3>
      <pre style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--border-radius-md)' }}>
        {JSON.stringify(RESPONSIVE_GRIDS, null, 2)}
      </pre>
      
      <h3 style={{ marginTop: 'var(--space-lg)' }}>Touch Target Size</h3>
      <pre style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--border-radius-md)' }}>
        {JSON.stringify(TOUCH_TARGET_SIZE, null, 2)}
      </pre>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows all the responsive utility constants used throughout the photo guide components.',
      },
    },
  },
};

export const ResponsiveDemo: Story = {
  render: () => {
    React.useEffect(() => {
      const demoStyles = `
        .responsive-demo-box {
          background: var(--primary-start);
          color: white;
          padding: var(--space-md);
          border-radius: var(--border-radius-md);
          text-align: center;
          font-weight: var(--font-weight-medium);
          margin: var(--space-md) 0;
        }
        
        .responsive-demo-grid {
          display: grid;
          gap: var(--space-sm);
          grid-template-columns: repeat(4, 1fr);
          margin: var(--space-md) 0;
        }
        
        .responsive-demo-item {
          aspect-ratio: 1;
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-small);
          color: var(--text-secondary);
        }
        
        @media (max-width: 639px) {
          .responsive-demo-box {
            padding: var(--space-sm);
            font-size: var(--font-size-small);
          }
          
          .responsive-demo-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .responsive-demo-box::after {
            content: " (Mobile View)";
          }
        }
        
        @media (min-width: 640px) {
          .responsive-demo-box::after {
            content: " (Tablet+ View)";
          }
        }
      `;
      
      if (!document.head.querySelector('#responsive-demo-styles')) {
        const style = document.createElement('style');
        style.id = 'responsive-demo-styles';
        style.textContent = demoStyles;
        document.head.appendChild(style);
      }
    }, []);
    
    return (
      <div>
        <div className="responsive-demo-box">
          Responsive Behavior Demo
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-small)' }}>
          This demonstrates the responsive breakpoints in action:
        </p>
        <ul style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-small)', marginBottom: 'var(--space-lg)' }}>
          <li><strong>Mobile (≤ 639px):</strong> 3-column grid, smaller padding</li>
          <li><strong>Tablet+ (≥ 640px):</strong> 4-column grid, standard padding</li>
        </ul>
        
        <div className="responsive-demo-grid">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="responsive-demo-item">
              {i + 1}
            </div>
          ))}
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', fontStyle: 'italic' }}>
          Resize your browser window or use Storybook's viewport controls to see the responsive behavior in action.
        </p>
      </div>
    );
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
      },
    },
    docs: {
      description: {
        story: 'Interactive demonstration of the responsive breakpoints. Try changing the viewport size using the toolbar controls.',
      },
    },
  },
};