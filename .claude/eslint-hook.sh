#!/bin/bash

# ESLint auto-fix hook for Claude Code
# This script runs ESLint with --fix using pnpm turbo with package filtering

if [[ "$FILE_PATH" =~ \.(ts|tsx)$ ]]; then
    PACKAGE=""
    
    if [[ "$FILE_PATH" =~ packages/client/ ]]; then
        PACKAGE="@snapscope/client"
    elif [[ "$FILE_PATH" =~ packages/ui/ ]]; then
        PACKAGE="@snapscope/ui"
    else
        # File is not in a package directory, skip
        exit 0
    fi
    
    echo "Running lint-fix on $PACKAGE for $FILE_PATH"
    cd "$CLAUDE_PROJECT_DIR"
    pnpm turbo run lint-fix --filter="$PACKAGE"
fi