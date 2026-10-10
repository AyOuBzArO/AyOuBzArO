# Asset sources

- brand/ayoubzaro-banner-v2.png: user's supplied banner, unchanged.
- brand/ayoub-speaking-cutout.png: transparent background extraction from the user's Ayoub Zarkouni.jpeg, prepared with the built-in image-generation tool.
- showcase/novaquill-demo.png: existing docs/screenshots/dashboard.png in the user's NovaQuill project. Shows the public demo with illustrative analysis data.
- showcase/siteguard-inspector.png: https://raw.githubusercontent.com/AyOuBzArO/siteguard-ai/master/docs/images/finding-inspector.png
- showcase/auto-rinta-home.png: screenshot of https://autorintacar.com/ captured on 2026-10-09.
- stack/*.svg: brand paths from https://cdn.simpleicons.org, embedded in locally generated monochrome labeled tiles. Simple Icons is distributed under CC0-1.0; individual brand names and marks remain their owners' property. See https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md.
- visuals/siteguard-flow*.svg: original diagrams based on the public SiteGuard README. Animated connectors illustrate data flow, not live traffic.

The old editorial SVGs are no longer referenced by the README.

## October 10 revision

- brand/ayoub-phone-post.png: built-in image-generation framing edit of the user's original Ayoub Zarkouni.jpeg. Keeps the speaking scene/background inside a social-post-style phone frame; not an actual social-media screenshot. No engagement counts or verification badges. The original file is untouched. Prompt: [phone-post-prompt.md](phone-post-prompt.md).
- designed/*-card*.svg: custom vector layouts embedding the existing original project logos from projects/ unchanged. These replace project screenshots in the README.
- designed/stack-*.svg: grouped vector panels using the existing Simple Icons paths, with brand-colored marks and neutral surrounding design.
- designed/novaquill-flow*.svg: original explanatory diagrams of the existing NovaQuill workflow; moving lines illustrate sequence, not live activity.
- designed/github-stats*.svg: charts generated from data/github-public.json, with the collection date and exclusions printed on the charts. Only public GitHub metadata is collected. Language bytes exclude forks and the profile repository. Values are not proficiency scores.
- tools/build-profile-assets.mjs: reproducible asset builder. Pass --refresh-stats to collect a new public snapshot; no scheduled task is installed.

Earlier cutouts and screenshots remain in the repository history/assets but are not displayed by the revised README.
