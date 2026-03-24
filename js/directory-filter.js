// Income Spectrum - Directory Search Filter
// Adds a keyword search input above the jump nav on directory pages.
// Filters .listing-card elements live as the user types.
// Hides .cat-block sections automatically when all their cards are hidden.

(function () {

  function init() {
    var jumpNav = document.querySelector(".page-jumpnav");
    if (!jumpNav) return;

    var wrapper = document.createElement("div");
    wrapper.className = "dir-search-bar";
    wrapper.innerHTML =
      '<input type="search" id="dirSearch" class="dir-search-input" placeholder="Search by keyword, industry, or interest..." autocomplete="off" spellcheck="false" aria-label="Search directory">' +
      '<span class="dir-search-icon" aria-hidden="true">' +
        '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" stroke-width="1.75"/>' +
          '<line x1="12.9" y1="12.9" x2="17" y2="17" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>' +
        '</svg>' +
      '</span>';

    jumpNav.parentNode.insertBefore(wrapper, jumpNav);

    var input = document.getElementById("dirSearch");
    input.addEventListener("input", function () {
      runFilter(this.value.trim().toLowerCase());
    });

    // If arriving from homepage search, pre-fill and filter automatically
    try {
      var params = new URLSearchParams(window.location.search);
      var incoming = params.get("q");
      if (incoming && incoming.trim()) {
        input.value = incoming.trim();
        runFilter(incoming.trim().toLowerCase());
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (e) {}
  }

  function runFilter(query) {
    var blocks = document.querySelectorAll(".cat-block");
    var totalVisible = 0;

    blocks.forEach(function (block) {
      var cards = block.querySelectorAll(".listing-card");
      var visibleInBlock = 0;

      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        var show = !query || text.indexOf(query) !== -1;
        card.style.display = show ? "" : "none";
        if (show) visibleInBlock++;
      });

      totalVisible += visibleInBlock;
      block.style.display = !query || visibleInBlock > 0 ? "" : "none";
    });

    // Show a no-results message if nothing matched
    var existing = document.getElementById("dirNoResults");
    if (!query || totalVisible > 0) {
      if (existing) existing.remove();
    } else {
      if (!existing) {
        var msg = document.createElement("p");
        msg.id = "dirNoResults";
        msg.className = "dir-no-results";
        msg.textContent = "No resources matched that search.";
        var body = document.querySelector(".page-body .container");
        if (body) body.prepend(msg);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
