import React from 'react';
import { toggleTheme, getCurrentTheme, type Theme } from './tokens/theme';
import { Icon } from './icon';

export interface ThemeToggleProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onThemeChange?: (theme: Theme) => void;
}

export const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className = '', style, children, onThemeChange }, ref) => {
    const [currentTheme, setCurrentTheme] = React.useState<Theme>('light');

    React.useEffect(() => {
      // Set initial theme from DOM
      setCurrentTheme(getCurrentTheme());

      // Listen for theme changes (including system theme changes handled by initializeTheme)
      const handleThemeChange = () => {
        setCurrentTheme(getCurrentTheme());
      };

      // Listen for storage changes (theme changes from other tabs/windows)
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'snapscope-theme') {
          handleThemeChange();
        }
      };

      // Listen for DOM attribute changes (theme changes from any source)
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
            handleThemeChange();
          }
        });
      });

      if (typeof window !== 'undefined') {
        window.addEventListener('storage', handleStorageChange);
        observer.observe(document.body, { attributes: true });
      }

      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('storage', handleStorageChange);
          observer.disconnect();
        }
      };
    }, []);

    const handleToggle = () => {
      const newTheme = toggleTheme();
      setCurrentTheme(newTheme);
      onThemeChange?.(newTheme);
    };

    const defaultStyle: React.CSSProperties = {
      width: '40px',
      height: '40px',
      background: 'rgba(255, 255, 255, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      color: 'var(--text-primary)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      padding: 0,
      ...style,
    };

    const hoverStyle: React.CSSProperties = {
      background: 'rgba(255, 255, 255, 0.25)',
      transform: 'scale(1.05)',
    };

    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <button
        ref={ref}
        className={className}
        style={isHovered ? { ...defaultStyle, ...hoverStyle } : defaultStyle}
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
        title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {children || (
          <Icon 
            name={currentTheme === 'dark' ? 'sun' : 'moon'} 
            size={24}
            aria-hidden
          />
        )}
      </button>
    );
  }
);

ThemeToggle.displayName = 'ThemeToggle';