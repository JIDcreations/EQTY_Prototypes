# EQTY Typography Style Guide (temporary)

Generated on 2026-01-29 from the current codebase.

## Fonts
- Primary UI text: Inter Regular (`Inter-Regular`)
- Emphasis/UI labels: Inter Medium (`Inter-Medium`)
- Display/heads: Filson Pro Bold (`FilsonPro-Bold`)

Loaded in `App.js` via `useFonts`.

## Type scale tokens
Defined in `theme/typography.js`:
- `title`: 26
- `h1`: 22
- `h2`: 18
- `body`: 16
- `small`: 13

Families:
- `fontFamilyBase`: `Inter-Regular`
- `fontFamilyMedium`: `Inter-Medium`
- `fontFamilyDemi`: `FilsonPro-Bold`

Note: `typography.tiny` is referenced in `screens/LessonStepScreen.js` but is not defined in `theme/typography.js`.

## Global rules
- Use `AppText` for all text. It defaults to `fontFamilyBase` (Inter Regular) and applies user text scaling.
- Text scaling is derived from preferences (`Normal = 1.0`, `Comfort = 1.1`, `Large = 1.2`) via `getTextScale` and applied to both `fontSize` and `lineHeight`.

## Size ladder and common usage
These are the concrete sizes in use (both tokenized and hard-coded), with common placements:

- 64: Logo mark on onboarding welcome (`screens/onboarding/OnboardingWelcomeScreen.js`), Filson Pro Bold, letterSpacing 8.
- 38: Home greeting name (`typography.title + 12`), Filson Pro Bold, lineHeight 40 (`screens/HomeScreen.js`).
- 34: Onboarding entry logo (`screens/onboarding/OnboardingEntryScreen.js`), Filson Pro Bold, letterSpacing 6.
- 32: Onboarding logos (`screens/onboarding/OnboardingBasicInfoScreen.js`, `OnboardingLoginScreen.js`, etc.), Filson Pro Bold, letterSpacing 6.
- 30: Home hero title (`screens/HomeScreen.js`), Filson Pro Bold.
- 28: Onboarding intro/positioning titles (`screens/onboarding/OnboardingQuestionsIntroScreen.js`, `OnboardingPositioningScreen.js`), Filson Pro Bold.
- 26 (`title`): Primary screen titles and onboarding welcome title, often with lineHeight 32.
- 24: Onboarding question titles (`screens/onboarding/OnboardingQuestionScreen.js`).
- 22 (`h1`): Lesson headers and section titles.
- 18 (`h2`): Card titles and smaller section headers.
- 16 (`body`): Paragraphs, buttons, input text.
- 13 (`small`): Labels, metadata, captions.
- 12 (`small - 1`): Progress inline text (`components/StepHeader.js`).
- 11: Tab labels (`App.js`) and onboarding badge labels.

## Line-height guidance (actual values in use)
Line-heights are set per screen. Values currently used: 18, 20, 22, 24, 30, 32, 34, 36, 40.
Common pairings:
- 26 / 32 (Onboarding welcome title)
- 28 / 34 (Onboarding entry title)
- 16 / 22 (Most body copy)
- 16 / 24 (Home hero subtitle)
- 13 / 18 or 13 / 20 (Small text)

## Letter-spacing and casing patterns
- Logo/brand: 6-8 letterSpacing with Filson Pro Bold.
- Uppercase labels: letterSpacing 1.0-1.4, often with `textTransform: 'uppercase'` (module labels, badges, step labels).
- Buttons: light tracking (0.3) on primary labels.

## Known inconsistencies / TODOs
- `typography.tiny` is used but missing from the token set.
- `Inter-SemiBold` is loaded in `App.js` but not used anywhere in styles.

