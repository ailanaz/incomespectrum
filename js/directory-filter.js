// Income Spectrum - Directory Search Filter
// Adds a keyword search input at the top of directory page content.
// Filters .listing-card elements live as the user types.
// Hides .cat-block sections automatically when all their cards are hidden.
// On no-results: shows a smart message with suggestions based on the query.

(function () {

  // Page routing map - query keywords that best match each directory section
  var routeMap = [
    {
      page: "income-options.html",
      label: "Income Options",
      keys: ["service","auto","car","vehicle","repair","mechanic","body shop","detailing","cleaning","maid","janitorial","beauty","salon","spa","massage","esthetics","nail","barbershop","hair","coaching","counselor","therapist","mental health","social work","freelance","delivery","driver","handyman","painting","plumbing","electrical","lawn","landscaping","photography","video","music","art","craft","resale","retail","franchise","vending","real estate","laundry","childcare","daycare","tutoring","pet","grooming","fitness","personal trainer","bookkeeping","accounting","notary","interpreter","translator","staffing","recruiting"]
    },
    {
      page: "education-training.html",
      label: "Education & Training",
      keys: ["course","training","certification","certificate","degree","school","class","learn","study","program","bootcamp","trade school","apprentice","exam","prep","skill","workshop","online learning","ged","workforce development","continuing education"]
    },
    {
      page: "supportive-services.html",
      label: "Supportive Services",
      keys: ["legal","attorney","lawyer","compliance","insurance","banking","bank","loan","funding","grant","payroll","hr","human resources","marketing","branding","website","software","operations","advisory","bookkeeping","cpa","accountant","finance","capital","credit","invoice","payment","merchant","pos","point of sale"]
    },
    {
      page: "state-federal-resources.html",
      label: "Official Resources",
      keys: ["license","permit","registration","government","federal","state","regulation","compliance","tax","irs","sba","food","restaurant","food service","catering","liquor","health code","zoning","business license","ein","llc","incorporate","incorporation","contract","contracting","government contract","8a","minority","veteran","disability","ada","workers comp","unemployment"]
    }
  ];

  function getBestRoute(query) {
    if (!query) return null;
    var q = query.toLowerCase();
    var scores = routeMap.map(function (r) {
      var score = 0;
      r.keys.forEach(function (k) {
        if (q.indexOf(k) !== -1 || k.indexOf(q) !== -1) score++;
      });
      return { page: r.page, label: r.label, score: score };
    });
    scores.sort(function (a, b) { return b.score - a.score; });
    // Only suggest if there's a meaningful match
    return scores[0].score > 0 ? scores[0] : null;
  }

  function getCurrentPage() {
    var path = window.location.pathname;
    return path.substring(path.lastIndexOf("/") + 1) || "index.html";
  }

  function init() {
    // Anchor to the first .container inside .page-body
    var body = document.querySelector(".page-body .container");
    if (!body) return;

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

    body.prepend(wrapper);

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

    var existing = document.getElementById("dirNoResults");
    if (!query || totalVisible > 0) {
      if (existing) existing.remove();
    } else {
      if (!existing) {
        var currentPage = getCurrentPage();
        var route = getBestRoute(query);
        var msg = document.createElement("div");
        msg.id = "dirNoResults";
        msg.className = "dir-no-results";

        if (route && route.page !== currentPage) {
          msg.innerHTML =
            "<strong>Nothing matching &ldquo;" + escapeHtml(query) + "&rdquo; is in this section yet.</strong>" +
            "<p>You may find what you're looking for in <a href=\"" + route.page + "?q=" + encodeURIComponent(query) + "\">" + route.label + "</a>.</p>";
        } else {
          msg.innerHTML =
            "<strong>Nothing matching &ldquo;" + escapeHtml(query) + "&rdquo; is in the directory yet.</strong>" +
            "<p>Check <a href=\"state-federal-resources.html\">Official Resources</a> for licensing and regulatory guidance, or <a href=\"index.html\">browse the full directory</a>.</p>";
        }

        var body = document.querySelector(".page-body .container");
        if (body) {
          var searchBar = document.getElementById("dirSearch");
          if (searchBar) {
            searchBar.parentNode.after(msg);
          } else {
            body.prepend(msg);
          }
        }
      }
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
