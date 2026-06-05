# Spec 017 - Google Play Readiness

## Status

Future / Not Started

## Goal

Prepare Cycle12 Finance for a future Android release on Google Play without starting publication work now.

This spec is a readiness checklist. It should guide future implementation and release tasks when publishing becomes a real goal.

## Context

Cycle12 Finance is currently a local-first Expo React Native app for personal finance projection.

The app already has:

- Expo React Native Android support.
- App icon, adaptive icon, and splash screen assets.
- Local-only persistence with AsyncStorage.
- Local `.c12f` backup, restore, and reset behavior.
- No backend.
- No authentication.
- No ads.
- No cloud sync.
- Quality tooling with lint, format check, typecheck, Jest tests, and coverage.

Publishing to Google Play requires extra release, policy, store-listing, privacy, and testing work that should not be mixed with ordinary app feature development.

## Scope

### Included For Future Work

- Prepare Android production identity.
- Generate a production Android App Bundle (`.aab`).
- Configure production signing.
- Confirm Google Play target API compliance.
- Prepare privacy policy and data safety disclosures.
- Prepare Play Console store listing assets and text.
- Validate the app in an internal or closed testing track.
- Document release steps for future maintainers.

### Not Included Now

- Do not submit the app to Google Play now.
- Do not create or configure a Play Console app now.
- Do not publish a privacy policy page now.
- Do not change app behavior now.
- Do not add backend, login, analytics, ads, subscriptions, payments, or tracking.
- Do not change business rules to satisfy hypothetical store concerns.

## Required Future Decisions

Before implementation starts, decide:

- Final public app name.
- Final Android package name, for example `com.owner.cycle12finance`.
- Developer account type: personal or organization.
- Public support email.
- Privacy policy hosting location.
- Countries where the app should be available.
- Whether the app should remain free and ad-free.
- Whether the release will use EAS Build cloud, EAS local build, or local Gradle build.

## Technical Readiness Tasks

### Android Identity

- Replace the placeholder Android package:

```json
"package": "com.anonymous.cycle12financeapp"
```

with a permanent package name.

This must be done before the first production release. After publishing, changing the package creates a different app.

### Versioning

- Keep `expo.version` aligned with the public app version.
- Ensure Android `versionCode` increments for every Play Store upload.
- Decide whether versioning will be managed through Expo config, EAS, or native Android config.

### Production Signing

- Configure a production signing key.
- Prefer EAS-managed credentials unless there is a specific reason to manage keystores manually.
- Do not commit keystores, passwords, or signing secrets.

### Build Format

- Generate an Android App Bundle (`.aab`) for Play Store upload.
- Do not use debug signing for Play Store builds.
- Test the exact build that will be submitted.

### Target API

- Confirm the generated Android build targets the current Google Play minimum target API requirement.
- As of the current planning context, Google Play requires new apps and updates to target Android 15 / API level 35 or higher, except for some form factors.
- Re-check this rule immediately before implementation because Google Play target API policy changes over time.

### Release Validation

Run and record:

- `npm run check`
- `npx expo config --type public`
- Android production build generation
- Install and smoke-test the production build on a real Android device if possible

Manual smoke test checklist:

- First launch from clean install.
- Splash screen and icon.
- Create category/account.
- Edit monthly values.
- Add/subtract monthly adjustment.
- Toggle paid status.
- Export backup.
- Restore backup.
- Reset data.
- Close and reopen app to confirm local persistence.

## Privacy And Policy Readiness

### Privacy Policy

Create a plain-language privacy policy before store submission.

The policy should state:

- Finance data is stored locally on the user's device.
- The app does not require login.
- The app does not use a backend or cloud sync.
- The app does not sell user data.
- The app does not share user finance data with the developer.
- Backup files are created, stored, restored, and shared only by user action.
- Uninstalling the app can remove local data unless the user exported a backup.

The app name and developer/legal entity shown on Google Play must match or be clearly referenced by the privacy policy.

### Data Safety Form

Fill the Google Play Data Safety form consistently with the app and privacy policy.

Expected position for the current app:

- No account creation.
- No ads.
- No analytics/tracking unless added later.
- No server-side collection of personal or financial data.
- Local finance data remains on device.
- Backup/export uses user-initiated files and system sharing.

If analytics, crash reporting, ads, or cloud sync are ever added later, this spec must be updated before release.

### Financial App Positioning

Use careful store copy:

- Describe the app as local personal finance projection/control.
- Do not imply banking, credit approval, loans, investment advice, returns, or financial guarantees.
- Do not claim integration with banks or financial institutions unless implemented and compliant.

## Store Listing Readiness

Prepare:

- App title.
- Short description.
- Full description.
- App category.
- Contact email.
- Privacy policy URL.
- Phone screenshots.
- Feature graphic.
- 512x512 high-resolution icon.
- Content rating questionnaire.
- Target countries.

Screenshots should show realistic demo data, not personal real financial data.

## Testing Track Readiness

Use Play Console testing before production.

Recommended order:

1. Internal testing for fast install checks.
2. Closed testing for broader validation.
3. Production only after policy, listing, data safety, and build validation are complete.

If using a new personal Google Play developer account created after November 13, 2023, plan for Google's closed testing requirement:

- At least 12 testers.
- Testers opted in continuously for at least 14 days.
- Production access request after the criteria are met.

Re-check the exact requirement before starting because account type and Google policy can affect it.

## Acceptance Criteria For Future Implementation

- Android package name is final and non-placeholder.
- Production `.aab` is generated and signed with production credentials.
- Target API requirement is verified against current Google Play policy.
- Privacy policy exists and matches app behavior.
- Data Safety form is complete and consistent with the privacy policy.
- Store listing assets and copy are ready.
- Internal or closed testing build installs and passes smoke tests.
- `npm run check` passes before release.
- No secrets, keystores, or local credentials are committed.

## References

- Expo Android production build: https://docs.expo.dev/tutorial/eas/android-production-build
- Expo Android submission: https://docs.expo.dev/submit/android/
- Google Play target API requirement: https://developer.android.com/google/play/requirements/target-sdk
- Google Play testing requirements: https://support.google.com/googleplay/android-developer/answer/14151465
- Google Play privacy and user data policy: https://support.google.com/googleplay/android-developer/answer/15402170
