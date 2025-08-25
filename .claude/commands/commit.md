---
description: Creates a new commit using conventional commit guidelines.
---

Review the git changes in the working directory and stage them for commit.

```bash
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

## Begin task

Below are additional instructions. Follow them carefully, but **always** use the conventional commit format.
<user_instructions>
"${ARGUMENTS}"
<user_instructions>
