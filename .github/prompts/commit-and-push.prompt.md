---
description: Analyze changes, generate commit message, and push to feature branch
tools: ["read", "execute", "todo"]
---

# Commit And Push

Input:

- branch-name (required)

If branch-name is not provided:

1. Ask the user for branch-name.
2. Do not proceed until branch-name is provided.

Workflow:

1. Determine whether the current step includes required UI workflow.
2. If UI workflow is required, enforce one of these before committing:
   - Run npm run test:ui
   - Or confirm successful /run-ui-tests in the current chat context
3. Analyze changes using git diff.
4. Generate a descriptive conventional commit message (feat:, fix:, chore:, docs:, etc., per project Git Workflow).
5. Create or switch branch using the user-provided branch-name only:
   - If branch does not exist: git checkout -b <branch-name>
   - If branch exists: git checkout <branch-name>
6. Stage all changes: git add .
7. Commit with generated message.
8. Push to branch: git push origin <branch-name>

Critical branch guardrail:

- Do not commit to main or any branch other than the user-provided branch-name.
