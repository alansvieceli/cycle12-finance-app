# Plan 024 - App Context Documentation

## Objective

Add a canonical app context document for agents, improve human-facing README context, and create a maintenance standard.

## Implementation Plan

1. Add spec, plan, and task files for this documentation work.
2. Add `docs/standards/app-context-policy.md`.
3. Update `AGENTS.md` and `CLAUDE.md` to reference the new standard.
4. Add `docs/app-context.md` in English with current app context.
5. Update README with a concise product overview and tab summary for humans.
6. Validate documentation formatting.

## Assumptions

- `docs/app-context.md` is the canonical AI-agent context file.
- README remains the main human entry point.
- The project keeps English documentation for technical and agent-facing docs.
- No unit tests or TypeScript checks are required because this is documentation-only.

## Validation

Run:

- `npm run format:check`
