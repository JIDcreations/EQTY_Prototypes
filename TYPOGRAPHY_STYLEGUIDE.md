# EQTY Typography Style Guide (current)

Single source of truth: `theme/typography.ts`.

## Fonts
- Display/structural: Filson Pro Bold (`FilsonPro-Bold`)
- UI/content: Inter Regular (`Inter-Regular`), Inter Medium (`Inter-Medium`), Inter SemiBold (`Inter-SemiBold`)

Loaded in `App.js` via `useFonts`.

## Type scale tokens
Defined in `theme/typography.ts`:
- `display`: 32 / 40 (Filson Pro Bold)
- `h1`: 26 / 32 (Filson Pro Bold)
- `h2`: 22 / 28 (Inter SemiBold)
- `h3`: 20 / 28 (Inter SemiBold)
- `body`: 16 / 24 (Inter Regular)
- `small`: 14 / 20 (Inter Medium)
- `meta`: 14 / 20 (Inter Regular)
- `stepLabel`: 14 / 20 (Filson Pro Bold, uppercase, letterSpacing 1.2)

## Global rules
- Use `AppText` for all text. It defaults to `typography.styles.body` and applies user text scaling.
- Text scaling is derived from preferences (`Normal = 1.0`, `Comfort = 1.1`, `Large = 1.2`) via `getTextScale` and applied to both `fontSize` and `lineHeight`.
