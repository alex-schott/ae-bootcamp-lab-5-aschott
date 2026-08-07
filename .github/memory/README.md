# Development Memory System

This folder provides a lightweight memory system for tracking development discoveries while building and stabilizing the TODO application.

## Purpose

Use this memory system to capture patterns, decisions, and lessons learned during daily development work so future sessions can start faster and avoid repeated mistakes.

## Two Types of Memory

### 1. Persistent Memory (Foundational)

- Location: `../copilot-instructions.md`
- Purpose: Long-lived principles, workflows, and standards that should always guide implementation.
- Examples: TDD expectations, testing scope, agent usage, and git workflow.

### 2. Working Memory (Session and Pattern Tracking)

- Location: `./`
- Purpose: Capture what is being learned while implementing, testing, and debugging.
- Examples: session summaries, recurring code patterns, and active-session notes.

## Directory Structure

- `session-notes.md`: Historical summaries of completed sessions (committed).
- `patterns-discovered.md`: Accumulated reusable patterns and decisions (committed).
- `scratch/working-notes.md`: Active session notes and temporary context (not committed).

## When to Use Each File

### During TDD Workflows

- Use `scratch/working-notes.md` while cycling through Red-Green-Refactor to track:
  - Current failing test intent
  - Chosen implementation direction
  - Refactor opportunities and follow-ups
- After tests pass and refactor is complete, summarize key takeaways in `session-notes.md`.
- If a reusable implementation/testing pattern emerges, add it to `patterns-discovered.md`.

### During Linting and Code Quality Workflows

- Use `scratch/working-notes.md` to track issue categories and fixes in progress.
- Record recurring lint or style remediation strategies in `patterns-discovered.md`.
- Store the completed quality-improvement summary in `session-notes.md`.

### During Debugging and Integration Workflows

- Use `scratch/working-notes.md` for hypotheses, experiments, and failure observations.
- Capture root cause and final decision in `session-notes.md` once resolved.
- If the fix represents a repeated architecture/debugging pattern, document it in `patterns-discovered.md`.

## How AI Uses This Memory

When assisting in future work, AI should:

1. Read `../copilot-instructions.md` for stable project principles and workflow constraints.
2. Review `patterns-discovered.md` for prior solutions and implementation conventions.
3. Check recent entries in `session-notes.md` for historical context and recent decisions.
4. Use `scratch/working-notes.md` only for active-session context and in-progress reasoning.

This sequence helps produce context-aware suggestions that are aligned with past decisions and current project direction.

## Historical vs Active Notes (Important Difference)

- `session-notes.md` is for completed session summaries and is committed to git as a durable historical record.
- `scratch/working-notes.md` is for active, temporary work and should not be committed.

## End-of-Session Practice

At the end of each development session:

1. Summarize completed outcomes in `session-notes.md`.
2. Add new reusable patterns to `patterns-discovered.md`.
3. Leave `scratch/working-notes.md` ready for the next session, retaining only useful active context.
