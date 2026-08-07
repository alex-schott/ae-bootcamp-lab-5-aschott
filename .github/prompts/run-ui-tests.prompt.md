---
description: Run UI tests and summarize failures
agent: test-engineer
tools: ["read", "execute", "todo"]
---

# Run UI Tests

Input:

- none

Required first step:

1. Run npm run test:ui:install --workspace=frontend before /run-ui-tests execution.
2. In Ubuntu/Linux, this install step is mandatory and must perform playwright install --with-deps chromium before running UI tests.

Install remediation policy:

- test:ui:install includes bounded automatic Ubuntu repository remediation for the common Yarn key issue, with one retry.
- Do not perform ad-hoc package hunting or broad OS troubleshooting beyond that bounded remediation.
- If install still fails, stop immediately and report an environment blocker.
- Include the failing command and key error lines.
- Do not run Playwright tests after failed dependency install.

Execution workflow:

1. Ensure backend and frontend are both running before UI tests.
2. Start from repo root with npm start if services are not already running.
3. Run UI tests using the project command.
4. Summarize pass/fail results clearly.
5. For failures, classify likely root cause:
   - Application code
   - Test code
   - Environment
