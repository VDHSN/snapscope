#!/bin/bash

# TypeScript compilation hook for Claude Code
# This script runs tsc --noEmit to check TypeScript compilation without generating files

if [[ "$FILE_PATH" =~ \.(ts|tsx)$ ]] && [[ "$FILE_PATH" =~ packages/client/src ]]; then
    echo "Running TypeScript compilation check on project..."
    cd "$CLAUDE_PROJECT_DIR/packages/client"
    pnpm exec tsc --noEmit
fi