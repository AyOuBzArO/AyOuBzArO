<p align="center">
  <img src="assets/brand/ayoubzaro-banner-v2.png" width="100%" alt="AyOuBzArO — Ayoub Zarkouni, full-stack developer">
</p>

<p align="center">
  <a href="#selected-work">Selected work</a> &nbsp; / &nbsp;
  <a href="#inside-siteguard">Inside SiteGuard</a> &nbsp; / &nbsp;
  <a href="#toolkit">Toolkit</a> &nbsp; / &nbsp;
  <a href="#lets-talk">Contact</a>
</p>

<img align="right" src="assets/brand/ayoub-speaking-cutout.png" width="27%" alt="Ayoub speaking into a microphone at a technology event">

### Hi, I'm Ayoub.

I'm a full-stack developer based in **Morocco**. I build Python-backed products: SaaS platforms, business applications, and tools that turn complex workflows into something people can use.

My work connects **interfaces, APIs, databases, payments, and AI**. I care about the details between them—clear user flows, dependable data, and software that holds up after launch.

Currently building **[NovaQuill](https://novaquill.org/)** and available for selected freelance projects.

**[Work with me ↗](https://www.fiverr.com/ayoub_zarkouni)** &nbsp; · &nbsp; [LinkedIn](https://www.linkedin.com/in/ayoub-zarkouni-2207373b7) &nbsp; · &nbsp; [Email](mailto:ayoubzarkouni30@gmail.com)

<br clear="all">

<a id="selected-work"></a>

## Selected work

### NovaQuill
**From a niche to an export-ready ebook.** &nbsp; <sub>SAAS · PRIVATE SOURCE</sub>

<a href="https://novaquill.org/">
  <img src="assets/showcase/novaquill-demo.png" width="100%" alt="NovaQuill public demo showing topic analysis, an opportunity score, and market dimensions">
</a>
<sub>Public product demo · illustrative analysis data</sub>

A publishing workflow that brings topic analysis, structured generation, quality review, and PDF, DOCX, and EPUB exports into one product. Authentication, Stripe subscriptions, and plan-aware generation support the SaaS around it.

**Built with** Python · FastAPI · PostgreSQL · SQLAlchemy · Stripe · Groq

**[Explore NovaQuill ↗](https://novaquill.org/)**

---

### SiteGuard AI
**Website findings you can trace back to evidence.** &nbsp; <sub>PUBLIC REPOSITORY</sub>

<a href="https://github.com/AyOuBzArO/siteguard-ai">
  <img src="assets/showcase/siteguard-inspector.png" width="100%" alt="SiteGuard's Finding Inspector showing a broken-link finding, its captured HTTP 404 evidence, and a remediation entry point">
</a>
<sub>Finding Inspector · screenshot from the project repository</sub>

A website audit workspace for SEO, accessibility, security, and performance checks. Deterministic scanners produce findings and scores; the AI assistant explains selected findings and suggests remediation. Includes scan history and PDF reports.

**Built with** Python · Flask · MySQL · JavaScript · PageSpeed Insights · Groq · pytest

**[Explore the code ↗](https://github.com/AyOuBzArO/siteguard-ai)** &nbsp; · &nbsp; [See the architecture ↓](#inside-siteguard)

---

### Auto Rinta Car
**A bilingual storefront backed by a fleet-management system.** &nbsp; <sub>BUSINESS APPLICATION</sub>

<a href="https://autorintacar.com">
  <img src="assets/showcase/auto-rinta-home.png" width="100%" alt="Auto Rinta Car's French homepage with its vehicle catalogue, availability, and WhatsApp contact">
</a>
<sub>Public website · French and Arabic experience</sub>

Customers browse vehicles, pricing, availability, and galleries, then contact the agency through WhatsApp. Staff manage fleet details and photos in a protected administration area. The Arabic experience includes right-to-left layouts.

**Built with** Python · Flask · SQLAlchemy · SQLite · JavaScript

**[Visit Auto Rinta Car ↗](https://autorintacar.com)**

### Also built

- **[CSAI Days 2026](https://csaidays.medi-asd.org/hackathon.html)** — Frontend implementation for a technology event, with four languages, Arabic RTL support, and application flows. Deployment by collaborator Issam. [Code ↗](https://github.com/issama17/csaidays-2026)
- **[DevScope](https://github.com/AyOuBzArO/Developer-Portfolio-Analytics-Platform_Devscope)** — GitHub portfolio analysis with transparent heuristics and AI-assisted recommendations. Guidance, not a measure of developer quality.
- **[IMS](https://github.com/AyOuBzArO/Inventory-management-system)** — Inventory and sales management with interactive dashboards and a data-aware assistant.

<a id="inside-siteguard"></a>

## Inside SiteGuard

A design choice I'm proud of: **keep detection separate from AI guidance.**

<picture>
  <source media="(max-width: 600px)" srcset="assets/visuals/siteguard-flow-mobile.svg">
  <img src="assets/visuals/siteguard-flow.svg" width="100%" alt="SiteGuard data flow: a public URL is validated and crawled; deterministic checks produce evidence, findings, and scores; the results feed the analysis workspace, PDF reports, and optional AI guidance. AI does not determine scores.">
</picture>

The crawler is bounded. Findings retain their evidence. AI receives the selected finding as context, while scan results remain available independently of the AI provider.

<details>
<summary>Read the flow as text</summary>

1. Validate a public website URL and crawl within defined limits.
2. Run deterministic checks; use PageSpeed Insights for performance data.
3. Store evidence, findings, and category scores.
4. Present the analysis workspace and downloadable PDF report.
5. Optionally send a selected finding to Groq for explanation and remediation guidance.

</details>

<a id="toolkit"></a>

## Toolkit

**Backend & data**

<p>
  <img src="assets/stack/python.svg" width="76" alt="Python">
  <img src="assets/stack/fastapi.svg" width="76" alt="FastAPI">
  <img src="assets/stack/flask.svg" width="76" alt="Flask">
  <img src="assets/stack/postgresql.svg" width="76" alt="PostgreSQL">
  <img src="assets/stack/sqlite.svg" width="76" alt="SQLite">
</p>

**Interfaces**

<p>
  <img src="assets/stack/javascript.svg" width="76" alt="JavaScript">
  <img src="assets/stack/typescript.svg" width="76" alt="TypeScript">
  <img src="assets/stack/react.svg" width="76" alt="React">
  <img src="assets/stack/nextdotjs.svg" width="76" alt="Next.js">
  <img src="assets/stack/tailwindcss.svg" width="76" alt="Tailwind CSS">
</p>

**Delivery & integrations**

<p>
  <img src="assets/stack/docker.svg" width="76" alt="Docker">
  <img src="assets/stack/git.svg" width="76" alt="Git">
  <img src="assets/stack/linux.svg" width="76" alt="Linux">
  <img src="assets/stack/stripe.svg" width="76" alt="Stripe">
</p>

Also used across these projects: SQLAlchemy, MySQL, Prisma, Groq, OpenRouter, GitHub API, and pytest.

<a id="lets-talk"></a>

## Let's talk

Building a product, improving an existing application, or replacing a manual business workflow? Tell me what you're trying to solve.

**[Start a project on Fiverr ↗](https://www.fiverr.com/ayoub_zarkouni)** &nbsp; · &nbsp; [Connect on LinkedIn](https://www.linkedin.com/in/ayoub-zarkouni-2207373b7) &nbsp; · &nbsp; [Send an email](mailto:ayoubzarkouni30@gmail.com)

---

<sub>Ayoub Zarkouni · AyOuBzArO · Morocco</sub>
