/* Calder & Vane Plumbing Co. (Demo) — navigation and problem finder.
   No dependencies. Everything works without this file; it only adds the interactive layer. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: add a border once the page scrolls ---------- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-menu]");

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      var first = menu.querySelector("a, button");
      if (first) first.focus();
    } else {
      toggle.focus();
    }
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("[data-menu-link]")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) setMenu(false);
    });
    // Close if the screen grows past the mobile breakpoint
    window.matchMedia("(min-width: 961px)").addEventListener("change", function (mq) {
      if (mq.matches && menu.classList.contains("is-open")) setMenu(false);
    });
  }

  /* ---------- Problem finder ---------- */
  var tiles = Array.prototype.slice.call(document.querySelectorAll("[data-problem]"));
  var panels = Array.prototype.slice.call(document.querySelectorAll("[data-panel]"));
  var narrow = window.matchMedia("(max-width: 960px)");

  function showPanel(key) {
    panels.forEach(function (p) {
      p.classList.toggle("is-active", p.getAttribute("data-panel") === key);
    });
  }

  function select(tile) {
    var key = tile.getAttribute("data-problem");
    var already = tile.getAttribute("aria-pressed") === "true";

    tiles.forEach(function (t) {
      t.setAttribute("aria-pressed", "false");
    });

    if (already) {
      showPanel("empty");
      return;
    }

    tile.setAttribute("aria-pressed", "true");
    showPanel(key);

    // On phones the guidance appears below the tiles: bring it into view
    if (narrow.matches) {
      var panel = document.querySelector('[data-panel="' + key + '"]');
      if (panel) {
        panel.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        panel.focus({ preventScroll: true });
      }
    }
  }

  if (tiles.length && panels.length) {
    showPanel("empty");
    tiles.forEach(function (tile) {
      tile.addEventListener("click", function () {
        select(tile);
      });
    });
  }
})();
