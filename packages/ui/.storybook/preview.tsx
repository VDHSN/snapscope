import React from 'react';
import type { Preview } from '@storybook/react';
import '../src/tokens/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F5E6D3' },
        { name: 'dark', value: '#1A1A1A' },
        { name: 'white', value: '#FFFFFF' },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme;
      
      // Apply theme to body
      if (typeof document !== 'undefined') {
        if (theme === 'dark') {
          document.body.setAttribute('data-theme', 'dark');
        } else {
          document.body.removeAttribute('data-theme');
        }
      }

      return (
        <div 
          style={{ 
            padding: '16px',
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            transition: 'var(--transition-default)'
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;