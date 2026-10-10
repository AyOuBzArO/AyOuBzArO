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
