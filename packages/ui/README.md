# @snapscope/ui

A comprehensive React UI component library built for the SnapScope Progressive Web Application.

## Installation

This package is part of the SnapScope monorepo and is used internally by the client application.

```bash
# Install dependencies
pnpm install

# Start Storybook
pnpm storybook

# Build Storybook
pnpm build-storybook
```

## Usage

Import components from their individual exports:

```tsx
import { Button } from '@snapscope/ui/button'
import { Badge } from '@snapscope/ui/badge'
import { Card } from '@snapscope/ui/card'
```

## Design System

SnapScope Design System

## 🎨 Color System

### Brand Colors
| Type | Light Mode | Dark Mode |
|------|------------|-----------|
| Primary Gradient | `#8B5CF6` → `#6366F1` | `#7C3AED` → `#4F46E5` |

### Semantic Colors
| Purpose | Color | Hex |
|---------|-------|-----|
| Success | Emerald | `#10B981` |
| Warning | Amber | `#F59E0B` |
| Error | Rose | `#F43F5E` |
| Info | Indigo | `#6366F1` |

### Theme Colors
| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `#F5E6D3` | `#1A1A1A` |
| Surface/Card | `#FFFFFF` | `#2A2A2A` |
| Text Primary | `#1F2937` | `#F5F5F5` |
| Text Secondary | `#6B7280` | `#9CA3AF` |
| Border | `#E5E7EB` | `#374151` |

## 📝 Typography

**Font:** Inter (optimized for mobile)

| Style | Size | Weight | Line Height |
|-------|------|--------|-------------|
| H1 | 24px | 600 | 1.2 |
| H2 | 20px | 600 | 1.2 |
| H3 | 18px | 600 | 1.2 |
| Body | 16px | 400 | 1.5 |
| Small | 14px | 400 | 1.5 |
| Caption | 12px | 400 | 1.6 |

**Letter Spacing:** Default (0), Uppercase (+0.02em), Large headings (-0.02em)

## 📐 Spacing

**Base Unit:** 8px

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Minimal gaps |
| sm | 8px | Tight spacing |
| md | 16px | Default spacing |
| lg | 24px | Section breaks |
| xl | 32px | Major divisions |
| 2xl | 48px | Large sections |
| 3xl | 64px | Page padding |

## 🎯 Components

### Border Radius
- **Small:** 8px (badges, chips)
- **Medium:** 12-16px (buttons, inputs)
- **Large:** 20px (cards, modals)
- **Round:** 50% (avatars)
- **Device:** 40px (mockups)

### Shadows
| Level | Light Mode | Dark Mode |
|-------|------------|-----------|
| 1 | `0 2px 4px rgba(0,0,0,0.1)` | `0 2px 4px rgba(0,0,0,0.3)` |
| 2 | `0 4px 8px rgba(0,0,0,0.15)` | `0 4px 8px rgba(0,0,0,0.4)` |
| 3 | `0 6px 12px rgba(0,0,0,0.2)` | `0 6px 12px rgba(0,0,0,0.5)` |

### Interactive States
- **Hover:** +10% brightness
- **Active:** Scale 98%
- **Focus:** 2px outline (primary @ 50%)
- **Disabled:** 50% opacity

### Component Padding
- **Buttons:** 16px × 12px
- **Cards:** 20px
- **Inputs:** 12px × 8px

## ⚡ Animation

| Type | Duration | Easing | Use Case |
|------|----------|---------|----------|
| Default | 300ms | ease-in-out | Most transitions |
| Quick | 150ms | ease-out | Micro-interactions |
| Complex | 400ms | ease-in-out | Page transitions |

**Transition Types:** Fade (content), Slide (navigation), Scale (emphasis)

## ♿ Accessibility

### Minimum Requirements
- **Contrast:** WCAG AA (AAA for primary text)
- **Touch Targets:** 44×44px (56×56px for critical actions)
- **Color:** Never sole indicator of information
- **States:** All interactive elements have visible focus states

## 📱 Platform Notes

### Adaptations
- Follow platform navigation patterns
- Use native components for performance
- Allow system font fallbacks

### Responsive
- Scale spacing proportionally on tablets
- Adjust typography for reading distance
- Expand grids without breaking layouts

## ⚡ Quick Reference

### Do's
✅ Use primary gradient sparingly (CTAs, headers)
✅ Test colors in bright sunlight
✅ Maintain 16px minimum margins
✅ Animate with purpose
✅ Group related elements with closer spacing

### Don'ts
❌ Use more than 2 font weights per screen
❌ Apply semantic colors incorrectly
❌ Create custom spacing values
❌ Animate without user benefit
❌ Ignore platform conventions

## Components

### Available Components
- `Button` - Primary and secondary button variants
- `Badge` - Semantic color badges for status indicators
- `Card` - Content containers with elevation levels
- `Input` - Form input fields with focus states
- `Progress` - Progress indicators
- `Typography` - Heading and text components (H1-H6, Body, Small, Caption)
- `ThemeToggle` - Light/dark theme switcher

### Design Token Usage
The design system uses CSS custom properties for consistent theming. All components automatically support light and dark themes through the token system.

## Development

### Running Storybook
```bash
cd packages/ui
pnpm storybook
```

### Building Components
```bash
cd packages/ui
pnpm build
```

The Storybook instance provides comprehensive documentation and examples for all components, following the design system specifications exactly.
