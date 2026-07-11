# Plan 040 - Strict Biome and Knip Quality

Status: Implemented

## Objective

Turn the initial migration baseline into a strict, maintainable quality gate without carrying avoidable suppressions.

## Tasks

| Task | Purpose |
| --- | --- |
| 040-01 | Tighten Biome, apply reviewed fixes, strengthen Knip, remove real dead code/dependencies, update docs, and validate. |

## Approach

1. Enable recommended Biome rules/domains and import organization.
2. Apply formatter and safe fixes, then review every remaining diagnostic.
3. Run Knip without broad suppressions and resolve findings from files to dependencies.
4. Add strict production Knip and non-mutating Biome CI scripts.
5. Update project documentation and run the complete quality gate.
