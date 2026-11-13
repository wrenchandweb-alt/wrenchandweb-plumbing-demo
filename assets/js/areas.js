/* Calder & Vane Plumbing Co. (Demo) — service-area schematic and demo coverage checker.
   The checker is a NON-FUNCTIONAL demonstration: it checks only that five digits were typed,
   never looks anything up, and never sends or stores what was entered. */
(function () {
  "use strict";

  /* ---------- Zone highlight ---------- */
  var map = document.querySelector(".schematic");
  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-zone-btn]"));
  var pinned = null;

  function show(zone) {
    if (!map) return;
    if (zone) map.setAttribute("data-active", zone);
    else map.removeAttribute("data-active");
  }

  buttons.forEach(function (btn) {
    var zone = btn.getAttribute("data-zone-btn");
    btn.addEventListener("click", function () {
      pinned = pinned === zone ? null : zone;
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-zone-btn") === pinned));
      });
      show(pinned);
    });
    // Hover preview on devices with a mouse; the pinned zone returns afterwards
    var row = btn.closest("[data-zone-row]");
    if (row && window.matchMedia("(hover: hover)").matches) {
      row.addEventListener("mouseenter", function () { show(zone); });
      row.addEventListener("mouseleave", function () { show(pinned); });
    }
  });

  /* ---------- Coverage checker (demo) ---------- */
  var form = document.querySelector("[data-checker]");
  if (!form) return;
  var input = form.elements.zip;
  var error = form.querySelector("[data-zip-error]");
  var result = document.querySelector("[data-zip-result]");
  var field = form;

  function setError(msg) {
    error.textContent = msg;
    field.classList.toggle("has-error", !!msg);
    if (msg) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  input.addEventListener("input", function () {
    var clean = input.value.replace(/\D/g, "").slice(0, 5);
    if (clean !== input.value) input.value = clean;
    if (error.textContent) setError("");
    result.textContent = "";
    result.classList.remove("is-shown");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // never leaves the page
    var zip = input.value.trim();
    if (!/^\d{5}$/.test(zip)) {
      setError("Enter a 5-digit ZIP code, like 77008.");
      result.textContent = "";
      result.classList.remove("is-shown");
      input.focus();
      return;
    }
    setError("");
    result.textContent =
      "Demo only: this checker isn't connected to any coverage data, so it can't say whether " + zip +
      " is served. On a live site it would check the business's own approved list of ZIP codes.";
    result.classList.add("is-shown");
  });
})();
