# Patterns Discovered

Use this file to capture recurring implementation and debugging patterns discovered over time.

## Pattern Template

### Pattern Name

- Name: <short-pattern-name>

### Context

- Where it applies: <area/component/workflow>

### Problem

- <problem this pattern solves>

### Solution

- <recommended solution>

### Example

```js
// Add a concise, real example from this repository.
```

### Related Files

- <path/to/file>
- <path/to/test>

---

## Example Pattern: Service Initialization (Empty Array vs Null)

### Pattern Name

- Name: Initialize collection state with empty arrays

### Context

- Where it applies: Backend service state and test setup for TODO collections

### Problem

- Null-initialized collection fields force null checks across handlers and can cause inconsistent behavior in API responses and tests.

### Solution

- Initialize collection fields as empty arrays at startup and in test fixtures. Treat `null` as invalid state for collection containers.

### Example

```js
// Prefer this:
const todos = [];

// Instead of this:
const todos = null;
```

### Related Files

- packages/backend/src/app.js
- packages/backend/__tests__/app.test.js
