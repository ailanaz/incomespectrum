# IncomeSpectrum Project

## Repo
- Always use: `/Users/macair/Documents/GitHub/incomespectrum`
- Never use: `/Users/macair/Desktop/Jeep Site/` or any other path
- Live site: incomespectrum.com and incomespectrum.app
- GitHub: ailanaz/myoldcherokee.github.io (managed via GitHub Desktop - never push from terminal)

## File Rules
- Directory page changes: `income-options.html` only (unless explicitly told otherwise)
- Business ideas: `focus.html`
- App logic: `js/app.js`
- Styles: `css/app.css`
- Do not remove featured businesses (Banker Automotive)

## Site Identity - Never Violate
- incomespectrum.com is a DIRECTORY first. It lists and indexes resources. That is its primary identity.
- The blog is infotainment only - facts and topics relevant to self-determined business owners. It does not sell, push, guide, or educate.
- The app is a self-service tool for searching and self-curating resources. It stores and organizes. It does NOT sell, guide, or educate.
- NEVER frame incomespectrum as educational, instructional, or sales-driven in any copy, captions, scripts, or content.
- NEVER use "talk" or conversational framing in trust badges or positioning copy.

## App Parser Notes
- `app.js` parses `.listing-card` elements from HTML pages
- Only reads the FIRST `.listing-card__cta` href per card
- Focus page cards use dual class `idea-card listing-card`
- Hidden `listing-card__type` and `listing-card__cta` elements required for app parser

## Affiliate Links
- Awin format: `https://www.awin1.com/cread.php?awinmid=XXXX&awinaffid=2812336&clickref=&p=[URL-encoded destination]`
- Fiverr Awin mid: 6288

## CSS Notes
- Focus tab theme is red - use rgba(220, 38, 38) values
- Focus-specific CSS rules must sit AFTER all general section-tab rules in source order
- Use `!important` on focus active state overrides
