// Income Spectrum - Site Statistics
// Update resourceCount when new resources are added to the directory.
// Elements with data-stat="resource-count" will auto-populate with the count below.

(function () {
  var STATS = {
    resourceCount: 336
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-stat="resource-count"]').forEach(function (el) {
      el.textContent = STATS.resourceCount;
    });
  });
})();
