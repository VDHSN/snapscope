---
description: Makes commits
model: anthropic/claude-3-5-sonnet-20241022
---

Review the git changes in the working directory and stage them for commit.

```bash
# run pr checks first in the root of the project
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

- If there are no staged changes, commit all unstaged changes.
- If there are staged changes, only commit those.
- If there are no changes, do not create a commit. Say "No changes to commit."
- If there was an issue with GPG signing, immediately try to commit without GPG signing.

## Extra steps

If you are on a branch that has an open PR, go ahead and push it and update the PR description to include the changes.

## Begin task

Below are additional instructions. Follow them carefully, but **always** use the conventional commit format.
<user_instructions>
$ARGUMENTS
<user_instructions>
