---
description: Create UI tests for required critical user journeys
agent: test-engineer
tools: ["search", "read", "edit", "execute", "todo"]
---

# Create UI Tests

Input:

- journeys (optional)

Defaults:

- If journeys are not provided, use: create, edit, toggle, delete, and core error-state handling.

Hard limits:

- Create a maximum of 5 Playwright tests for this run.
- Target total authored count in this run: 3 to 5 tests.
- Include at least 1 error-path test within the 3 to 5 total.

Prioritization rule:

- If more than 5 candidate scenarios exist, select the highest-risk 5.
- List deferred scenarios explicitly instead of creating more tests.

Workflow:

1. Generate or update UI tests using the project UI test framework.
2. Prefer stable selectors and state-based waits.
3. Apply Playwright Page Object Model:
   - Put reusable interactions/selectors in page objects.
   - Keep test files focused on scenario intent and assertions.
   - Avoid duplicating selectors and interaction flows across tests.
4. Before finishing, count created/updated Playwright test cases (test(...) / it(...)).
5. If count is greater than 5, reduce to 5 or fewer before completion.
6. Do not claim small scope if authored count is greater than 5.
7. Report files changed and scenarios covered.
