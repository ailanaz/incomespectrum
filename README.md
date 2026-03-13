# IncomeSpectrum

IncomeSpectrum is a directory-first website built to help users find real income destinations, training programs, and business support providers. The site is structured like a directory, not a blog or guide.

## Location

- GitHub repo: [ailanaz/incomespectrum](https://github.com/ailanaz/incomespectrum)
- Local site folder: `/Users/macair/Documents/GitHub/incomespectrum`
- Custom domain: [incomespectrum.com](https://incomespectrum.com)
- Deployment target: GitHub Pages from the repository root

## Site Structure

```text
incomespectrum/
├── CNAME
├── index.html
├── income-options.html
├── education-training.html
├── supportive-services.html
├── about.html
├── contact.html
├── advertise.html
├── list-business.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── states/
    ├── index.html
    ├── california.html
    ├── florida.html
    ├── new-york.html
    └── texas.html
```

## Main Pages

### Home
Routes users into the three main directory hubs and the state directory.

### Income Options Index
Directory of:
- work and service income options
- sell, make, and product income options
- business ownership and opportunity income options
- asset, rental, and recurring income options

### Education & Training Resources
Directory of:
- career, trade, and job-skill training
- business and ownership education
- income-skill, creative, and digital training
- certification, licensing, and exam prep resources

### Supportive Services Directory
Directory of:
- finance, funding, and credit services
- legal, compliance, and protection services
- business operations, marketing, and technology services
- advisory and transaction services

### Supporting Pages
- `about.html`
- `contact.html`
- `advertise.html`
- `list-business.html`

## State Directory

The state architecture is used where listings depend on geography, regulation, or local coverage. Current live pages:

- California
- Florida
- New York
- Texas

Each state page follows the same structure:
1. Business brokers
2. SBA / SBDC / funding resources
3. LLC formation and compliance
4. Licensing and workforce resources
5. Chambers and regional business organizations

## Listing Pattern

Each listing is presented as a directory card with:

- destination name
- short neutral description
- destination type
- coverage area
- tags
- direct outbound URL

Example structure:

```html
<div class="listing-card" data-tags="funding sba florida">
  <div class="listing-card__body">
    <div class="listing-card__header">
      <div class="listing-card__icon">SBA</div>
      <div class="listing-card__title-block">
        <h4 class="listing-card__name">Provider Name</h4>
        <span class="listing-card__type">Destination Type</span>
      </div>
    </div>
    <p class="listing-card__desc">Short neutral description.</p>
    <div class="listing-card__meta">
      <span class="listing-card__coverage">Coverage Area</span>
      <div class="listing-card__tags">
        <span class="tag">tag</span>
      </div>
    </div>
  </div>
  <div class="listing-card__footer">
    <div class="listing-card__footer-inner">
      <a href="https://example.com" class="listing-card__cta">Visit Site &rarr;</a>
    </div>
  </div>
</div>
```

## Front-End Notes

- `css/style.css` contains the visual system, card styles, tabs, filters, page layouts, and footer styles.
- `js/main.js` handles tabs, live search, filter chips, smooth scrolling, and mobile nav behavior.
- The spectrum gauge is an inline SVG mark reused across pages with page-specific IDs.

## Content Rules

- Use real destination resources.
- Keep descriptions short and factual.
- Do not add guide-style or blog-style content.
- Favor direct provider, marketplace, school, lender, directory, and service landing pages.

## Deployment Notes

GitHub Pages should publish from:

```text
Repository: ailanaz/incomespectrum
Branch: main
Directory: /
Domain: incomespectrum.com
```
