# VOSENBON Landing Page — Client Demo

Single-page, static, no-build-step marketing site for **VOSENBON**, a placeholder
electric-bike brand for Bangladesh, styled after revoo-ev.com.bd. Plain
HTML/CSS/vanilla JS + GSAP/ScrollTrigger + Lenis smooth scroll, all loaded from
CDN. No npm install, no bundler — open `index.html` or serve the folder and it
just works. Deploys to GitHub Pages with zero configuration.

## This is a demo. Nothing below is real.

Everything in this repo is placeholder content built to show structure, motion
and visual direction to the client. Before this goes anywhere near production,
replace:

| What | Where | Notes |
|---|---|---|
| **Product photography** | `assets/images/svg/bikes/*.svg` | Currently hand-drawn SVG line-art placeholders (marked with a comment at the top of each file). No real photo of any bike was used — swap these `<img>` sources in `index.html` for real VOSENBON product photography once available. |
| **Model line-up & specs** | `index.html`, model showcase + hero sections | X1 / X5 / X9 / C3 names, taglines, and all Top Speed / Range / Battery numbers are invented. Marked with an HTML comment above the showcase section. |
| **Showroom locations** | `index.html`, `#dealers` section | Names, areas and phone numbers are sample data. |
| **WhatsApp number** | `index.html`, floating WhatsApp button (`wa.me/8801700000000`) | Placeholder number — replace with the real VOSENBON WhatsApp Business number. |
| **Testimonials** | `index.html`, `#testimonials` section | Sample quotes, not real customers. |
| **Cost calculator assumptions** | `assets/js/main.js`, top of the "Cost-savings calculator" block | Petrol price/km, petrol mileage, electricity cost/charge, and VOSENBON range/charge are all placeholder constants with inline comments — confirm real Bangladesh fuel and electricity figures before launch. |
| **Enquiry form backend** | `assets/js/main.js`, `enquiry-form` submit handler | Currently shows a client-side "Thank you" state only and sends nothing anywhere. A `TODO` comment marks exactly where to add a `fetch(...)` POST to the VOSENBON CRM API once that endpoint exists. |
| **Social links** | Footer | Facebook/Instagram/YouTube icons link to `#` — add real profile URLs. |

## Design decisions worth knowing about

- **No stock photography used.** The spec allowed sourcing Unsplash/Pexels
  atmosphere photos if internet access was available. It was, but the site is
  built entirely on typography, gradients, and hand-coded SVG instead — this
  keeps the page lighter, avoids any photo-licensing review, and matches the
  "expensive, fast-loading" brief without needing a client-approved photo set.
  If real lifestyle photography becomes available later, the Features section
  (`#features`) is the natural place to add it as a background/side image.
- **Lenis is loaded from jsdelivr, not cdnjs.** Lenis isn't published on
  cdnjs at all (checked directly against the cdnjs API); jsdelivr is used
  instead for that one script. GSAP and ScrollTrigger are still loaded from
  cdnjs as specified.
- Colour system, type pairing, and section rhythm are documented at the top
  of `assets/css/style.css` under the "Voltage Night" design system comment.

## Running locally

No build step. Either:

```bash
open index.html
```

or serve it (recommended, avoids `file://` CORS quirks with `fetch`/modules):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

See the push + Pages-enabling steps provided separately in-conversation —
this repo is committed and ready to push as-is; `index.html` at the repo root
is exactly what GitHub Pages needs with zero extra configuration.
