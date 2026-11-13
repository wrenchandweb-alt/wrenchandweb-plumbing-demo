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
  var root = document.documentElement;
  var tiles = Array.prototype.slice.call(document.querySelectorAll("[data-problem]"));
  var panels = Array.prototype.slice.call(document.querySelectorAll("[data-panel]"));
  var narrow = window.matchMedia("(max-width: 960px)");
  var gasPanel = document.getElementById("panel-gas");

  function showPanel(key) {
    panels.forEach(function (p) {
      p.classList.toggle("is-active", p.getAttribute("data-panel") === key);
    });
  }

  /* Gas safety mode: while it's on, every plumbing sales action ([data-sales]) is hidden
     and the safety controls ([data-safety-only]) are shown instead. See finder.css. */
  function setSafety(on) {
    var was = root.classList.contains("is-safety");
    root.classList.toggle("is-safety", on);
    if (was !== on) {
      document.dispatchEvent(new CustomEvent("cv:safety", { detail: { on: on } }));
    }
  }

  function scrollToEl(el) {
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function select(tile, opts) {
    opts = opts || {};
    var key = tile.getAttribute("data-problem");
    var already = tile.getAttribute("aria-pressed") === "true";

    tiles.forEach(function (t) {
      t.setAttribute("aria-pressed", "false");
    });

    if (already && !opts.force) {
      showPanel("empty");
      setSafety(false);
      return;
    }

    tile.setAttribute("aria-pressed", "true");
    showPanel(key);
    setSafety(key === "gas");

    // Let the request form pick up the chosen problem (gas is never passed on)
    if (key !== "gas") {
      document.dispatchEvent(new CustomEvent("cv:problem", { detail: { key: key, source: "finder" } }));
    }

    // On phones the guidance appears below the tiles; for gas, always bring the steps into view
    if (narrow.matches || opts.reveal) {
      var panel = document.querySelector('[data-panel="' + key + '"]');
      if (panel) {
        scrollToEl(panel);
        panel.focus({ preventScroll: true });
      }
    }
  }

  function exitSafety() {
    var gasTile = document.querySelector('[data-problem="gas"]');
    if (gasTile) gasTile.setAttribute("aria-pressed", "false");
    showPanel("empty");
    setSafety(false);
    var finder = document.getElementById("finder");
    if (finder) scrollToEl(finder);
    if (gasTile) gasTile.focus({ preventScroll: true });
  }

  if (tiles.length && panels.length) {
    showPanel("empty");
    tiles.forEach(function (tile) {
      tile.addEventListener("click", function () {
        select(tile);
      });
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-safety-exit]")) {
      e.preventDefault();
      exitSafety();
      return;
    }
    if (e.target.closest("[data-safety-enter]")) {
      e.preventDefault();
      var gasTile = document.querySelector('[data-problem="gas"]');
      if (gasTile) select(gasTile, { force: true, reveal: true });
      return;
    }
    // Links to the gas steps: switch on safety mode (if needed) and show the steps
    var gasLink = e.target.closest('a[href="#panel-gas"]');
    if (gasLink && gasPanel) {
      e.preventDefault();
      var gas = document.querySelector('[data-problem="gas"]');
      if (!root.classList.contains("is-safety") && gas) {
        select(gas, { force: true, reveal: true });
      } else {
        showPanel("gas");
        scrollToEl(gasPanel);
        gasPanel.focus({ preventScroll: true });
      }
    }
  });
})();
