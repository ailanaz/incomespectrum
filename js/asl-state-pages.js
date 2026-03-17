(function () {
  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
    "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  const root = document.getElementById("asl-state-directory-root");
  const config = window.aslStatePageConfig;

  if (!root || !config) {
    return;
  }

  function fillTemplate(value, state) {
    return String(value || "").replace(/\{state\}/g, state);
  }

  function renderTags(tags) {
    if (!Array.isArray(tags) || !tags.length) {
      return "";
    }
    return tags.map(function (tag, index) {
      const tagClass = index === 0 ? config.tagClass : "";
      return '<span class="tag ' + tagClass + '">' + tag + "</span>";
    }).join("");
  }

  states.forEach(function (state) {
    const block = document.createElement("section");
    block.className = "cat-block " + config.blockClass;

    const header = document.createElement("div");
    header.className = "cat-block__header";
    header.innerHTML =
      "<div>" +
      '<h2 class="cat-block__title">' + state + "</h2>" +
      '<p class="cat-block__desc">' + fillTemplate(config.stateDescriptionTemplate, state) + "</p>" +
      "</div>";

    const grid = document.createElement("div");
    grid.className = "cat-block__grid";

    config.resources.forEach(function (resource) {
      const card = document.createElement("div");
      card.className = "listing-card";
      card.innerHTML =
        '<div class="listing-card__body">' +
          '<div class="listing-card__header">' +
            '<div class="listing-card__icon">' + resource.icon + "</div>" +
            '<div class="listing-card__title-block">' +
              '<h4 class="listing-card__name">' + resource.title + "</h4>" +
              '<span class="listing-card__type">' + fillTemplate(resource.type, state) + "</span>" +
            "</div>" +
          "</div>" +
          '<p class="listing-card__desc">' + fillTemplate(resource.desc, state) + "</p>" +
          '<div class="listing-card__meta">' +
            '<span class="listing-card__coverage">' + fillTemplate(resource.coverage, state) + "</span>" +
            '<div class="listing-card__tags">' + renderTags(resource.tags) + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="listing-card__footer">' +
          '<div class="listing-card__footer-inner">' +
            '<a href="' + resource.url + '" target="_blank" rel="noopener noreferrer" class="listing-card__cta">Visit Site &rarr;</a>' +
          "</div>" +
        "</div>";
      grid.appendChild(card);
    });

    block.appendChild(header);
    block.appendChild(grid);
    root.appendChild(block);
  });
})();
