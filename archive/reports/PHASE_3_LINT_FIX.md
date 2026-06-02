# PHASE 3 — LINT BASELINE

## 1. Issue Identified

- Initial `pnpm lint` reported 30 problems (27 errors, 3 warnings) related to formatting and unused variables/imports.
- `ProductForm.tsx` had a React Compiler warning regarding `watch()` from `react-hook-form`.

## 2. Fix Implemented

- Executed `pnpm lint --fix` to resolve all 27 formatting/style errors automatically.
- Manually fixed unused variables and imports:
  - Removed `_locale` in `src/app/[locale]/page.tsx`.
  - Removed unused `tc` translation hook and import in `src/components/ui/AnimatedOrderButton/index.tsx`.
- The remaining warning in `ProductForm.tsx` (React Compiler + `watch()`) is an external library/compiler interaction that is not an error and does not block linting success.

## 3. Verification

- Executed `pnpm lint`.
- Lint passes with 0 errors.

## 4. Remaining Risks

- The React Compiler warning persists, but is known/accepted behavior.
