# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SnapScope is a React Native mobile application for insurance adjusters and vehicle inspectors to streamline photo documentation. The project uses a **pnpm monorepo** structure with packages for mobile app and infrastructure.

- **Repository**: git@github.com:Foofykinz/snapscope.git
- **Primary branch**: `trunk`
- **Package Manager**: pnpm (required version >=8.0.0)
- **Node Version**: >=18.0.0

## Development Principles

- Always use pnpm. Never use npm, yarn etc unless told specifically to do otherwise

## Monorepo Structure

```
snapscope/
├── packages/
│   ├── mobile/          # React Native Expo app
│   └── infrastructure/  # Backend infrastructure (future)
├── tools/              # Build and development tools
└── docs/               # Project documentation
```

## pnpm Commands

### Writing Features

```bash
# Start development server
pnpm dev                 # Runs mobile app dev server
pnpm start              # Same as dev

# Platform-specific development
pnpm android            # Start on Android
pnpm ios               # Start on iOS

# Work on specific package
pnpm --filter mobile dev
pnpm --filter @snapscope/mobile test
```

### Testing

```bash
# Run all tests across workspace
pnpm test

# Run tests for specific package
pnpm --filter mobile test

# Type checking
pnpm typecheck          # Check all packages
pnpm --filter mobile typecheck

# Linting
pnpm lint              # Lint all packages
pnpm lint:fix          # Auto-fix linting issues
```

### Building & Deployment

```bash
# EAS Build commands (requires EAS CLI setup)
pnpm build:ios         # Build iOS app via EAS
pnpm build:android     # Build Android app via EAS

# Clean workspace
pnpm clean            # Clean all packages and root node_modules
```

### Pre-commit Hooks

The project uses Husky with lint-staged. On commit:

- TypeScript files are linted and formatted
- JSON/YAML/Markdown files are formatted with Prettier

## High-Level Architecture

### Mobile App (`packages/mobile/`)

The mobile app follows an **offline-first architecture** with local SQLite storage:

```
packages/mobile/src/
├── components/      # Reusable UI components
├── screens/        # Screen components (navigation endpoints)
├── services/       # Business logic and data management
├── hooks/          # Custom React hooks
├── constants/      # App-wide constants
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

Key architectural patterns:

- **Feature-based organization** within screens and services
- **Container/Presentational component pattern**
- **Service layer** for all data operations (camera, storage, export)
- **Custom hooks** for shared stateful logic

### Data Flow

1. **Local-First Storage**: All data persists in SQLite via `expo-sqlite`
2. **State Management**: React Context API for app-wide state (jobs, photos, settings)
3. **File System**: Photos stored in app's document directory with structured paths
4. **Export Pipeline**: In-memory processing → temporary files → export destination

### Camera Integration

The app uses `expo-camera` (not react-native-vision-camera as originally planned) for:

- Photo capture with overlay guides
- Real-time blur detection (planned)
- GPS metadata embedding
- Automatic file management

### Critical Implementation Notes

1. **Expo Managed Workflow**: Currently using Expo SDK 51 managed workflow
2. **Navigation**: Uses React Navigation (stack navigator)
3. **Testing**: Jest with React Native Testing Library setup
4. **Build System**: EAS Build configured for cloud builds
5. **Metro Config**: Custom configuration for monorepo support

## Technology Stack

- **Framework**: React Native with Expo SDK 51
- **Language**: TypeScript (strict mode)
- **Navigation**: React Navigation v6
- **Database**: SQLite via expo-sqlite
- **Camera**: expo-camera
- **State**: React Context API
- **Testing**: Jest + React Native Testing Library
- **Build**: EAS Build
- **Package Manager**: pnpm workspaces

## Development Workflow

1. All development happens on feature branches
2. Use pnpm for all package management
3. Run `pnpm lint` and `pnpm typecheck` before committing
4. Tests must pass before merging to trunk
5. Use conventional commit messages

## Key Architecture Decisions

- **ADR-0001**: React Native chosen for cross-platform native performance
- **ADR-0002**: Supabase selected for future backend services
- **Offline-First**: All features work without internet connectivity
- **No Analytics**: Privacy-focused, no tracking or telemetry
- **Local Storage**: Photos and metadata stored locally, optional cloud export

## Development Assumptions

- If I ask you to interact with expo, assume it is already running on localhost:8080
