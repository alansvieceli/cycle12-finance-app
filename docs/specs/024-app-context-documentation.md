# Spec 024 - App Context Documentation

## Objective

Create a durable app context document for AI agents and improve the README with a human-readable product overview.

## Context

The project already documents app behavior in the README and in feature specs, especially the Figma layout refresh spec. However, the information is spread across multiple files and is not optimized for quickly onboarding another AI agent or a human contributor.

The user wants:

- a dedicated context document with the app name, summary, and purpose.
- a clear description of each current tab:
  - `Resumo`
  - `Gráficos`
  - `Planejar`
  - `Contas`
  - `Ajustes`
- an agent-focused context document in English.
- a human-friendly README section.
- a standard that requires updating the context document whenever a feature, tab, or app behavior changes.

## Goals

- Add `docs/app-context.md` as the canonical app context document for AI agents.
- Keep `docs/app-context.md` in English.
- Document the app name, purpose, current behavior, core concepts, tabs, secondary views, constraints, and documentation workflow.
- Add a human-readable product overview to the README.
- Add a standard for maintaining `docs/app-context.md`.
- Reference the new standard from agent instructions.
- Keep documentation aligned with the current implemented app behavior.

## Non-goals

- Do not change app code.
- Do not change app behavior.
- Do not add dependencies.
- Do not redesign documentation structure beyond the new context document and standard.
- Do not duplicate every spec detail in the README.

## App Context Scope

`docs/app-context.md` should include:

- App name.
- One-paragraph summary.
- Target user/problem.
- Current implemented behavior.
- Core data concepts.
- Navigation tabs and the role of each tab.
- Secondary views.
- Local-only storage and backup behavior.
- Technical constraints.
- Where future agents should look before implementing changes.

## README Scope

The README should include a concise human-facing section explaining:

- what the app is.
- what problem it solves.
- what each tab is for.
- where to find deeper agent/project context.

The README should remain practical and not become a full spec.

## Standard Scope

Add `docs/standards/app-context-policy.md` requiring updates to `docs/app-context.md` when changes affect:

- app purpose or positioning.
- navigation tabs.
- user-visible features.
- core data concepts.
- local storage, backup, restore, or reset behavior.
- app constraints or project workflow.

## Acceptance Criteria

- `docs/app-context.md` exists and is written in English.
- README contains a human-readable product overview and tab summary.
- `docs/standards/app-context-policy.md` exists.
- Agent instructions reference the new standard.
- The new context document reflects current implemented app behavior.
- No app code is changed.
- Documentation formatting passes.

## Validation

Run:

```bash
npm run format:check
```
