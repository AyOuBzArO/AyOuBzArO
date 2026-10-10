# README visual checks

Requirements: Node.js 22+, Playwright, Google Chrome, and network access.
Run from the repository root:

```sh
node tools/verify-readme.cjs
```

Install Playwright in your development environment, or set
`README_PLAYWRIGHT_PATH` to an existing Playwright package directory.

The script renders the README through GitHub's Markdown API, uses GitHub's
public stylesheets, and writes an ignored preview into `preview/`. It checks
images, internal anchors, overflow at 320–1440px, light and dark themes,
mobile diagram selection, animation label stability, and reduced motion.
Animation samples cover two full loops. Review the screenshots as well as
`preview/verification.json`; automated checks do not replace visual review.

The local wrapper approximates the README content panel, not the entire
GitHub profile. Final live rendering must be checked after publishing.

## Rebuild the designed assets

```sh
node tools/build-profile-assets.mjs
```

This uses the saved public-data snapshot. To deliberately refresh it:

```sh
node tools/build-profile-assets.mjs --refresh-stats
```

No credentials are used. The script reads public GitHub REST endpoints and
updates the dated JSON, accessible Markdown data table, and SVG charts.
Keep the generated files together in the same commit. No scheduled updater
is installed. Project logos are embedded unchanged in responsive SVG covers;
the existing icon paths are reused in the new stack panels.
