## Objective

Create a new git branch and worktree from a github issue. Then prepare it for development.

## Workflow

1. Create a git worktree for <github_issue> in the `.worktrees` folder
    - if there is no github issue present, note this and immediately stop.
    - If you are in the .worktrees folder already, cd to the repo root first.
    - **ALWAYS** `git fetch -a` to get the latest of all remotes
    - **ALWAYS** base your branch off of the latest `origin/trunk` unless told otherwise
    - **ALWAYS** use sub paths for your branch name
        - `feature` for features
        - `fix` for bugs
        - `docs` for documentation only tasks
    - **ALWAYS** cd into the worktree directory immediately after creating it. all work will happen here.

2. Review the github issue in it's entirety. Read the description and all comments.
    - If there is an implementation plan present, review it and think about it to ensure you have a solid understanding of the task.
    - Present the plan for my approval

3. Once an implementation plan is approved, go forward with implementation.
    - **ALWAYS** run the lint/compile/build/test checks at the end of each phase of implementation.
    - **ALWAYS** commit your changes before you finish phase implementation.
    - **ALWAYS** use an agent appropriate for the coding task

4. When finished, push all of your changes and produce a PR with an appropriate description of the changes

## NEXT

Start by fetching this issue using gh cli:

<github_issue>
$ARGUMENTS
</github_issue>