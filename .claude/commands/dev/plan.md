---
description: Takes a github issue and produces a comprehensive implementation plan.
argument-hint: <github issue url>
allowed-tools: Bash(gh:*)
---


## Role

You must review the technical specification, acceptance criteria and related information and formulate an implementation plan.


## Workflow

1. Review the <github_issue> in it's entirety to understand what needs to be done
    - if there is no github issue present, note this and immediately stop.
    - Use the researcher agent. It works best when you keep the scope of research small.
    - Review any images and documents, as well as the comments. These should be ranked slightly lower in importance than the description.

2. Analyze the information  that explains the problem, scope and useful documentation & code that will help us understand the requirements.
    - Problem statement
    - What services are involved with this code change
    - A clear technical specification list
        - Include technical specifications
        - Note Non-Functional requirements
        - Include visual designs
        - Create any system design diagrams in Mermaid or ASCII
        - Note any new libraries or services we should add
        - Note what services, modules or areas in the code will require modification
        - Note any assumptions or unknowns
    - Show me the plan for my approval
    - Once I approve it, post it to the github_issue as a comment. Note that this is the *Background Context Report*


2. Formulate an implementation plan
    - think hard
    - show me the plan broken down step by step, for my approval
    - Once I approve it, post it to the github_issue as a comment. Note that this is the *Implementation Plan*

3. You are now done

## NEXT

Start by fetching this issue using gh cli:

<github_issue>
"${ARGUMENTS}"
</github_issue>
