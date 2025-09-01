---
description: Creates a new commit using conventional commit guidelines.
argument-hint: <ie do not open a PR>
allowed-tools: Bash(gh:*), Bash(git diff:*), Bash(pnpm run checks), Bash(git add:*), Bash(git commit:*)
---

Review the git changes in the working directory and stage them for commit.

```bash
# **ALWAYS** run the pr checks first in the root of the project
pnpm run checks

# to review staged changes
git diff --cached

# to review unstaged changes
git diff

# to stage all changes
git reset

# to review unstaged changes
git add .
```

## Commit format

- Always conventional commit guidelines to create a new commit.
- The body should be concise, descriptive and in the imperative mood. Be complete but not verbose.
- Never mention Claude, Claude Code, or AI in the commit message.
- Use the present tense, e.g., "Add feature" instead of "Added feature".

## Behavior

- IF you are trunk, do not do a commit, because trunk should not be edited directly but only through PRs. Immediately note this and stop.

1. **ALWAYS** Run `pnpm run checks` first
    - If these checks fail, perform an RCA and report.
    - Never fix the issue, just RCA

2. If the checks pass, then perform a git commit
    - If there are no staged changes, commit all unstaged changes.
    - If there are staged changes, only commit those.
    - If there are no changes, do not create a commit. Say "No changes to commit."
    - If there was an issue with GPG signing, immediately try to commit without GPG signing.

3. Push the commit to the remote branch unless explicitly asked not to
    - if you are on trunk - you cannot push or make commits

4. Update the PR, or open a PR if it doesn't exist
    - If asked to NOT open a PR, don't
    - If no PR is open, open one and reference the github issue if one exists
    - If a PR already exists, just update it's description if necessary

## Begin task

Below are additional instructions. Follow them carefully, but **always** use the conventional commit format.

<user_instructions>
"${ARGUMENTS}"
<user_instructions>
