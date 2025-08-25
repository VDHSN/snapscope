#!/bin/bash

# ESLint auto-fix hook for Claude Code
# This script runs ESLint with --fix on TypeScript files in the client package

if [[ "$FILE_PATH" =~ \.(ts|tsx)$ ]] && [[ "$FILE_PATH" =~ packages/client/src ]]; then
    echo "Running ESLint auto-fix on $FILE_PATH"
    cd "$PWD/packages/client"
    RELATIVE_FILE=$(echo "$FILE_PATH" | sed 's|.*/packages/client/||')
    pnpm run lint --fix "$RELATIVE_FILE"
fi