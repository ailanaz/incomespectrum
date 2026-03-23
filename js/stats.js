// Income Spectrum - Site Statistics
// Update these values when new resources are added to the directory.
// Elements with data-stat="resource-count" will auto-populate with the count below.
// Elements with data-stat="last-updated" will auto-populate with the date below.

(function () {
  var STATS = {
    resourceCount: 225,
    lastUpdated: 'March 2026'
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-stat="resource-count"]').forEach(function (el) {
      el.textContent = STATS.resourceCount;
    });
    document.querySelectorAll('[data-stat="last-updated"]').forEach(function (el) {
      el.textContent = STATS.lastUpdated;
    });
  });
})();
