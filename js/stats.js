// Income Spectrum - Site Statistics
// Resource count is calculated live by fetching and counting listing cards
// across all directory pages. No manual update needed when inventory changes.

(function () {

  var DIRECTORY_PAGES = [
    "income-options.html",
    "education-training.html",
    "supportive-services.html",
    "state-federal-resources.html",
    "federal-contracting-resources.html",
    "state-contracting-resources.html",
    "local-government-contracting-resources.html"
  ];

  var CARD_MARKER = "listing-card__name";
  var CACHE_KEY   = "is-resource-count-v1";
  var CACHE_TTL   = 60 * 60 * 1000; // 1 hour in ms

  function updateDisplay(count) {
    document.querySelectorAll("[data-stat=\"resource-count\"]").forEach(function (el) {
      el.textContent = count;
    });
  }

  function countInHtml(html) {
    var matches = html.match(new RegExp(CARD_MARKER, "g"));
    return matches ? matches.length : 0;
  }

  function fetchAndCount() {
    var promises = DIRECTORY_PAGES.map(function (page) {
      return fetch(page)
        .then(function (r) { return r.ok ? r.text() : ""; })
        .then(countInHtml)
        .catch(function () { return 0; });
    });

    Promise.all(promises).then(function (counts) {
      var total = counts.reduce(function (a, b) { return a + b; }, 0);
      if (total > 0) {
        updateDisplay(total);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ count: total, ts: Date.now() }));
        } catch (e) {}
      }
    });
  }

  function loadCached() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var cached = JSON.parse(raw);
      if (Date.now() - cached.ts < CACHE_TTL) return cached.count;
    } catch (e) {}
    return null;
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Show cached count immediately if available, then refresh in background
    var cached = loadCached();
    if (cached) updateDisplay(cached);
    fetchAndCount();
  });

})();
