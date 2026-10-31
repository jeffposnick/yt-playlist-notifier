# CLAUDE.md

## Checks

- Lint, format check and type-check: `npm run lint`
- Tests: `npm test` (Playwright; starts the staging build via `npm run stage` unless a server is already on port 3000)

## Running Playwright in the Claude Code sandbox

The sandbox's pre-installed Chromium doesn't match the build this repo's Playwright version expects, so a plain `npm test` fails with "Executable doesn't exist". Don't run `npx playwright install`. Instead, point the Chromium project at the pre-installed browser using the opt-in override in `playwright.config.ts`:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/opt/pw-browsers/chromium npx playwright test --project=chromium
```

Firefox and WebKit aren't available in the sandbox. CI runs them on pushes to `main`. Pull requests run Chromium only.
