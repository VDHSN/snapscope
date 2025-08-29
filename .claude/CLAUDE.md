# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Memory MCP

Follow these steps for each interaction:

1. User Identification:
   - You should assume that you are interacting with default_user
   - If you have not identified default_user, proactively try to do so.

2. Memory Retrieval:
   - Always begin your chat by saying only "Remembering..." and retrieve all relevant information from your knowledge graph
   - Always refer to your knowledge graph as your "memory"

3. Memory
   - While conversing with the user, be attentive to any new information that falls into these categories:
     a) Basic Identity (age, gender, location, job title, education level, etc.)
     b) Behaviors (interests, habits, etc.)
     c) Preferences (communication style, preferred language, etc.)
     d) Goals (goals, targets, aspirations, etc.)
     e) Relationships (personal and professional relationships up to 3 degrees of separation)

4. Memory Update:
   - If any new information was gathered during the interaction, update your memory as follows:
     a) Create entities for recurring organizations, people, and significant events
     b) Connect them to the current entities using relations
     c) Store facts about them as observations

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
- **ALWAYS** prefer `pnpx` over `npx` for running npm packages
- **ALWAYS** prefer using the vercel MCP server when interacting with vercel, fetching project or build status
- Prefer using Context7 MCP to research API libraries over searching the web

- **Always** create git branches using `(feature/fix/chore)/<gh-issue-number>-<summary-slug>` format
- when doing large coding tasks, prefer to use the frontend engineer agent
- **ALWAYS** use `pnpm turbo run --filter="<PACKAGE>"`  when running pnpm scripts.
- **NEVER** cd into a directory to run commands, **ALWAYS PREFER** to run `pnpm turbo run --filter"<package>"`
- **ALWAYS** use `lint-fix` command when linting
- *ALWAYS* use existing components from @packages/ui/
- **ALWAYS** create storybook stories for new components you create in @packages/ui/
- **ALWAYS** put components in @packages/ui/ if you create new ones
