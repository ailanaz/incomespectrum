// Income Spectrum - Site Statistics
// Counts are calculated live by fetching and counting listing cards.
// Focus page counted separately from the main resource directory.
// No manual update needed when inventory changes.

(function () {

  var IDEA_PAGES = [
    "focus.html"
  ];

  var RESOURCE_PAGES = [
    "income-options.html",
    "education-training.html",
    "supportive-services.html",
    "state-federal-resources.html",
    "federal-contracting-resources.html",
    "state-contracting-resources.html",
    "local-government-contracting-resources.html"
  ];

  var CARD_MARKER    = "listing-card__name";
  var CACHE_KEY_IDEAS = "is-idea-count-v1";
  var CACHE_KEY_RES   = "is-resource-count-v2";
  var CACHE_TTL       = 60 * 60 * 1000; // 1 hour in ms

  function updateStat(attr, count) {
    document.querySelectorAll("[data-stat=\"" + attr + "\"]").forEach(function (el) {
      el.textContent = count;
    });
  }

  function countInHtml(html) {
    var matches = html.match(new RegExp(CARD_MARKER, "g"));
    return matches ? matches.length : 0;
  }

  function fetchPages(pages) {
    return Promise.all(pages.map(function (page) {
      return fetch(page)
        .then(function (r) { return r.ok ? r.text() : ""; })
        .then(countInHtml)
        .catch(function () { return 0; });
    })).then(function (counts) {
      return counts.reduce(function (a, b) { return a + b; }, 0);
    });
  }

  function loadCached(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var cached = JSON.parse(raw);
      if (Date.now() - cached.ts < CACHE_TTL) return cached.count;
    } catch (e) {}
    return null;
  }

  function saveCache(key, count) {
    try {
      localStorage.setItem(key, JSON.stringify({ count: count, ts: Date.now() }));
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Show cached counts immediately, then refresh both in background
    var cachedIdeas = loadCached(CACHE_KEY_IDEAS);
    var cachedRes   = loadCached(CACHE_KEY_RES);
    if (cachedIdeas) updateStat("idea-count", cachedIdeas);
    if (cachedRes)   updateStat("resource-count", cachedRes);

    fetchPages(IDEA_PAGES).then(function (count) {
      if (count > 0) {
        updateStat("idea-count", count);
        saveCache(CACHE_KEY_IDEAS, count);
      }
    });

    fetchPages(RESOURCE_PAGES).then(function (count) {
      if (count > 0) {
        updateStat("resource-count", count);
        saveCache(CACHE_KEY_RES, count);
      }
    });
  });

})();
