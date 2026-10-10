# Asset sources

- brand/ayoubzaro-banner-v2.png: user's supplied banner, unchanged.
- brand/ayoub-speaking-cutout.png: transparent background extraction from the user's Ayoub Zarkouni.jpeg, prepared with the built-in image-generation tool.
- showcase/novaquill-demo.png: existing docs/screenshots/dashboard.png in the user's NovaQuill project. Shows the public demo with illustrative analysis data.
- showcase/siteguard-inspector.png: https://raw.githubusercontent.com/AyOuBzArO/siteguard-ai/master/docs/images/finding-inspector.png
- showcase/auto-rinta-home.png: screenshot of https://autorintacar.com/ captured on 2026-10-09.
- stack/*.svg: earlier Simple Icons assets retained for repository history; these are no longer displayed by the README.

The old editorial SVGs are no longer referenced by the README.

## October 10 revision

- brand/ayoub-phone-post.png: built-in image-generation framing edit of the user's original Ayoub Zarkouni.jpeg. Keeps the speaking scene/background inside a social-post-style phone frame; not an actual social-media screenshot. No engagement counts or verification badges. The original file is untouched. Prompt: [phone-post-prompt.md](phone-post-prompt.md).
- brand/ayoub-phone-post-v2.png: revised phone-post mockup using the user's supplied black-and-white portrait as the avatar and the original speaking photograph as the post image. The visible likes and comments are explicitly labeled sample engagement. Prompt and inputs: [phone-post-v2-prompt.md](phone-post-v2-prompt.md).
- designed/*-card*.svg: custom vector layouts embedding the existing original project logos from projects/ unchanged. These replace project screenshots in the README.
- stack-originals/*.svg: original-color Devicon artwork pinned to revision `7330accdbc47e2dc0c19789a48533c4a3c50fe58`; exact URLs are recorded in stack-originals/sources.json and the Devicon license is stored alongside them. Stripe uses the official Blurple SVG from Stripe's logo kit. Marks remain the property of their respective owners.
- stack-color/*.svg: compact local badges embedding the original artwork above without recoloring it.
- designed/github-stats*.svg: language donut and daily contribution calendar. Language bytes come from data/github-public.json and exclude forks, private work and the profile repository. The calendar uses data/github-contributions.json, collected without authentication from the public GitHub contribution page. Exact values and collection times are available in the accompanying Markdown tables. The donut uses proportional arcs; calendar colors use GitHub's published daily intensity levels.
- tools/build-profile-assets.mjs: reproducible asset builder. Pass --refresh-stats to collect a new public snapshot; no scheduled task is installed.

Earlier cutouts, screenshots, stack panels and workflow diagrams remain in the repository history/assets but are not displayed by the revised README.
