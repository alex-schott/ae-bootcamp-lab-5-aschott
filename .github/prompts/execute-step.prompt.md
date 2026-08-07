---
description: Execute instructions from the current GitHub Issue step
agent: tdd-developer
tools: ["search", "read", "edit", "execute", "web", "todo"]
---

# Execute Step

Input:

- issue-number (optional)

Workflow:

1. If issue-number is not provided, use gh CLI to locate the exercise issue (look for "Exercise:" in title; follow Workflow Utilities in project instructions).
2. Fetch full issue content with comments.
3. Parse the latest step instructions from the issue.
4. Execute each :keyboard: Activity: section systematically.

Scope boundary:

- Do not create or run Playwright UI tests in this prompt.

Handoff rule:

- Use /create-ui-tests and /run-ui-tests for Playwright UI work (auto-switches to test-engineer).

Constraints:

- Do not commit or push changes. Commit/push is handled by /commit-and-push.
- Follow testing scope constraints from project instructions.

Completion behavior:

1. Stop after completing the activities for the current step.
2. Provide next commands in this exact order:
   - If the current step requires UI workflow: /create-ui-tests -> /run-ui-tests -> /validate-step {step-number}
   - If UI workflow is not required: /validate-step {step-number}
3. Never recommend /validate-step before required UI prompts.
