# Plan 039 - Biome and Knip Tooling

Status: Implemented

## Objective

Use one formatter/linter (Biome) and one unused-code auditor (Knip), removing the replaced ESLint/Prettier stack.

## Tasks

| Task | Purpose |
| --- | --- |
| 039-01 | Replace dependencies and configuration, wire scripts/hooks, resolve only adoption-blocking findings, update docs, and validate. |

## Approach

1. Install Biome and Knip and remove replaced packages.
2. Add a small `biome.json`; try Knip zero-config first and add configuration only if needed.
3. Preserve existing script names and update lint-staged.
4. Remove obsolete configuration files.
5. Update README and the spec completion policy.
6. Run the full quality gate.
