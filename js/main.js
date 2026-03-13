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
