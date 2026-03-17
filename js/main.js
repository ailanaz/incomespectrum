/* ============================================================
   INCOME SPECTRUM - Main JavaScript
   IncomeSpectrum.com
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initSearch();
  initMobileNav();
  initFilterChips();
  initSmoothScroll();
  setActiveNav();
  applyCardLogos();
  initListingClickTracking();
  enhanceFooter();
});

/* ---- Tab Navigation -------------------------------------- */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const target = this.dataset.tab;
      if (!target) return;
      const container = this.closest('.tab-container');
      if (!container) return;

      // Deactivate all tabs and panels
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      // Activate selected
      this.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');

      // Update URL hash without scroll jump
      if (history.replaceState) {
        history.replaceState(null, null, '#' + target);
      }
    });
  });

  // Activate from URL hash on load
  const hash = window.location.hash.slice(1);
  if (hash) {
    const btn = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
    if (btn) btn.click();
  }
}

/* ---- Search ---------------------------------------------- */
function initSearch() {
  document.querySelectorAll('.search-bar__input').forEach(input => {
    let debounceTimer;
    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      const query = this.value.toLowerCase().trim();
      debounceTimer = setTimeout(() => runSearch(query, this), 150);
    });
  });

  // Search button click
  document.querySelectorAll('.search-bar__btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const input = this.closest('.search-bar')?.querySelector('.search-bar__input');
      if (input) runSearch(input.value.toLowerCase().trim(), input);
    });
  });

  // Enter key on search
  document.querySelectorAll('.search-bar__input').forEach(input => {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        runSearch(this.value.toLowerCase().trim(), this);
      }
    });
  });
}

function runSearch(query, inputEl) {
  // Determine scope: inside a tab panel if applicable, otherwise whole page
  const scope = inputEl.closest('.tab-panel') || document;
  const cards = scope.querySelectorAll('.listing-card');
  let visibleCount = 0;

  cards.forEach(card => {
    if (!query) {
      card.style.display = '';
      visibleCount++;
      return;
    }
    const name = card.querySelector('.listing-card__name')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('.listing-card__desc')?.textContent.toLowerCase() || '';
    const tags = card.dataset.tags || '';
    const type = card.querySelector('.listing-card__type')?.textContent.toLowerCase() || '';
    const match = name.includes(query) || desc.includes(query) || tags.includes(query) || type.includes(query);
    card.style.display = match ? '' : 'none';
    if (match) visibleCount++;
  });

  // Show no-results message if needed
  updateNoResults(scope, visibleCount, query);
}

function updateNoResults(scope, count, query) {
  let msg = scope.querySelector('.no-results-msg');
  if (count === 0 && query) {
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'no-results-msg';
      msg.style.cssText = 'padding:32px;text-align:center;color:#64748B;font-size:14px;';
      const firstGrid = scope.querySelector('.cat-block__grid, .subcat__grid');
      if (firstGrid) firstGrid.after(msg);
    }
    msg.textContent = `No results found for "${query}". Try a different search term.`;
  } else if (msg) {
    msg.remove();
  }
}

/* ---- Mobile Nav ------------------------------------------ */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.classList.remove('active');
    }
  });
}

/* ---- Filter Chips ---------------------------------------- */
function initFilterChips() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', function () {
      const group = this.closest('.filter-chips');
      if (!group) return;

      // Single-select within group
      group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;
      const panel = this.closest('.tab-panel') || document;
      const cards = panel.querySelectorAll('.listing-card');

      cards.forEach(card => {
        if (!filter || filter === 'all') {
          card.style.display = '';
        } else {
          const tags = card.dataset.tags || '';
          const type = card.querySelector('.listing-card__type')?.textContent.toLowerCase() || '';
          const visible = tags.includes(filter) || type.includes(filter);
          card.style.display = visible ? '' : 'none';
        }
      });
    });
  });
}

/* ---- Smooth Scroll for anchor links ---------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ---- Active Nav Highlight -------------------------------- */
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ---- Lazy-load listing count badges ---------------------- */
(function updateCounts() {
  document.querySelectorAll('[data-count-from]').forEach(el => {
    const targetId = el.dataset.countFrom;
    const target = document.getElementById(targetId);
    if (target) {
      const count = target.querySelectorAll('.listing-card').length;
      el.textContent = count;
    }
  });
})();

function applyCardLogos() {
  const path = window.location.pathname;
  if (path.includes('/states/') || path.endsWith('state-federal-resources.html')) return;

  const domainOverrides = {
    'QuickBooks Training / ProAdvisor': 'intuit.com',
    'Shopify Partners': 'shopify.com',
    'Acquire.com Buying Guides': 'acquire.com',
    'Acquire.com Partner Program': 'acquire.com',
    'Coding Bootcamps on Teachable': 'teachable.com',
    'Route-Based Opportunities via BizBuySell': 'bizbuysell.com',
    'Laundromat Opportunities via BizBuySell': 'bizbuysell.com',
    'Car Wash Opportunities via BizBuySell': 'bizbuysell.com',
    'Vending Opportunities via Franchise Direct': 'franchisedirect.com'
  };

  document.querySelectorAll('.listing-card').forEach(card => {
    if (card.closest('.cat-block--gov')) return;

    const name = card.querySelector('.listing-card__name')?.textContent.trim();
    const icon = card.querySelector('.listing-card__icon');
    const link = card.querySelector('.listing-card__cta[href^="http"]');
    if (!name || !icon || !link) return;

    const domain = domainOverrides[name] || getLogoDomain(link.href);
    if (!domain) return;

    const img = new Image();
    img.className = 'listing-card__logo';
    img.alt = `${name} logo`;
    img.loading = 'lazy';
    img.referrerPolicy = 'no-referrer';

    img.addEventListener('load', () => {
      icon.textContent = '';
      icon.classList.add('has-logo');
      icon.appendChild(img);
    });

    img.src = `https://logo.clearbit.com/${domain}?size=80`;
  });
}

function getLogoDomain(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    if (hostname.endsWith('.gov')) return '';
    return hostname;
  } catch {
    return '';
  }
}

function initListingClickTracking() {
  document.addEventListener('click', event => {
    const link = event.target.closest('.listing-card__cta');
    if (!link || typeof window.gtag !== 'function') return;

    const card = link.closest('.listing-card');
    if (!card) return;

    const badgeText = card.querySelector('.listing-card__badge')?.textContent.toLowerCase() || '';
    const rel = (link.getAttribute('rel') || '').toLowerCase();
    const tags = (card.dataset.tags || '').trim();

    window.gtag('event', 'listing_click', {
      listing_name: card.querySelector('.listing-card__name')?.textContent.trim() || 'unknown',
      listing_category: tags ? tags.split(/\s+/)[0] : 'uncategorized',
      page_type: getPageType(),
      is_affiliate: rel.includes('sponsored'),
      is_sponsored: badgeText.includes('sponsored') || badgeText.includes('featured')
    });
  });
}

function getPageType() {
  const path = window.location.pathname;

  if (path.includes('/states/')) return 'state_page';
  if (path.endsWith('income-options.html')) return 'income_options';
  if (path.endsWith('education-training.html')) return 'education_training';
  if (path.endsWith('supportive-services.html')) return 'supportive_services';
  if (path.endsWith('state-federal-resources.html')) return 'state_federal_resources';
  if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) return 'home';
  return 'other';
}

function enhanceFooter() {
  const disclaimerHtml = 'Transparency & Disclosure: Income Spectrum is an independent directory. To maintain this information infrastructure, we may receive compensation through affiliate links or sponsored content. This does not influence our routing process; our primary focus is providing direct access to a broad spectrum of resources to help you navigate your own entrepreneurial path. <a href="/disclaimer.html">Read the disclaimer.</a>';

  document.querySelectorAll('.site-footer').forEach(footer => {
    const brandText = footer.querySelector('.footer-brand__text');
    if (brandText) brandText.textContent = 'Income Spectrum';

    footer.querySelectorAll('.footer-links a').forEach(link => {
      if ((link.getAttribute('href') || '').includes('state-federal-resources.html')) {
        link.textContent = 'State & Federal Business Information Resources';
      }
    });

    const footerBottom = footer.querySelector('.footer-bottom');
    if (!footerBottom || footer.querySelector('.site-disclosure-bar')) return;

    const disclosureBar = document.createElement('div');
    disclosureBar.className = 'site-disclosure-bar';
    disclosureBar.innerHTML = `
      <div class="container">
        <p class="site-disclosure-bar__text">${disclaimerHtml}</p>
      </div>
    `;
    footer.insertBefore(disclosureBar, footerBottom);
  });
}
