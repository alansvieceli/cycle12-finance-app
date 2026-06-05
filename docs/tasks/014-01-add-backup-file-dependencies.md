# Task 014-01 - Add Backup File Dependencies

Status: Completed

## Spec

`docs/specs/014-data-backup-restore-reset.md`

## Plan

`docs/plans/014-data-backup-restore-reset-plan.md`

## Goal

Add the minimum Expo-compatible dependencies needed for local backup export, restore import, and SHA-256 hashing.

## Steps

1. Install Expo-compatible file system, document picker, sharing, and crypto packages.
2. Do not add backend, cloud, authentication, or storage services.
3. Verify dependencies appear in `package.json`.

## Acceptance Criteria

- Required Expo packages are listed in `package.json`.
- No unrelated dependency is added.
