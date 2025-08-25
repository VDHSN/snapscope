# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Snapscope is a Progressive Web Application designed to help Independent Adjusters assess vehicles faster and more accurately. The app targets mobile devices, desktops, and tablets with an offline-first design using local storage.

## Architecture

This is a **pnpm monorepo** with the following structure:

- **`packages/client/`** - Next.js 15.5 web application (main PWA)
- **`packages/ui/`** - Shared UI component library with Storybook

### Key Technologies

- **Frontend**: Next.js 15.5 with React 19, TypeScript, Tailwind CSS v4
- **Build System**: Turbo (Turbopack for Next.js), pnpm workspaces
- **UI Library**: Custom components with Storybook for documentation
- **Styling**: Tailwind CSS v4 with PostCSS

## Development Commands

### Setup
```bash
pnpm install
```

### Client Application (packages/client/)
```bash
# Development server with Turbopack
cd packages/client && pnpm dev
# Production build
cd packages/client && pnpm build  
# Linting
cd packages/client && pnpm lint
# Start production server
cd packages/client && pnpm start
```

### UI Library (packages/ui/)
```bash
# Storybook development
cd packages/ui && pnpm storybook
# Build Storybook
cd packages/ui && pnpm build-storybook
```

### Root Level
```bash
# Claude Code CLI (configured)
pnpm c
```

## Package Structure

### Client Package (`@snapscope/client`)
- Uses Next.js App Router (`src/app/`)
- Styled with Tailwind CSS and custom fonts (Geist)
- PWA-ready with offline capabilities
- Targets mobile-first responsive design

### UI Package (`@snapscope/ui`)
- Shared component library
- Components exported individually (e.g., `./button`)
- Storybook documentation on port 6006
- Built with TypeScript and React 18

## Import Conventions

When working with the UI library from the client:
- Import components using the workspace name: `import { Button } from '@snapscope/ui/button'`
- The UI package uses direct file exports, not barrel exports

## Development Notes

- The client uses **Turbopack** for faster development builds
- UI components follow a consistent pattern with TypeScript interfaces
- All packages use TypeScript with strict configuration
- The project uses pnpm workspace dependencies for internal packages

## Deployment

The application is deployed on Vercel (per README). The client package is configured for Vercel deployment with Next.js.
- **ALWAYS** use the github CLI tool to access repository links.
- **ALWAYS** include --no-gpg-sign when doing `git commit`