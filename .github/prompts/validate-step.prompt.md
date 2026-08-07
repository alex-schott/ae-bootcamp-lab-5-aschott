---
description: Validate that all success criteria for the current step are met
agent: code-reviewer
tools: ["search", "read", "execute", "web", "todo"]
---

# Validate Step

Input:

- step-number (required, for example: 5-0, 5-1)

If step-number is missing:

1. Ask the user for step-number.
2. Do not proceed until it is provided.

Workflow:

1. Use gh CLI to locate the main exercise issue (see Workflow Utilities in project instructions).
2. Fetch issue content with comments.
3. Search for the section header: # Step {step-number}:
4. Extract the Success Criteria section for that step.
5. Check each success criterion against the current workspace state.
6. Report completion status with specific guidance for incomplete items.
