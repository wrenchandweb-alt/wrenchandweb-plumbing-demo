/* Calder & Vane Plumbing Co. (Demo) — request-a-visit journey.
   DEMO MODE: nothing is transmitted or stored. There is no network request, no cookie, no
   localStorage. Answers live only in the form fields and are cleared on submit.
   A live client site must replace onSubmit() with an approved, tested lead-delivery integration. */
(function () {
  "use strict";

  var form = document.querySelector("[data-quote]");
  if (!form) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var card = form.closest(".quote__card");
  var steps = Array.prototype.slice.call(form.querySelectorAll("[data-step]"));
  var progress = Array.prototype.slice.call(card.querySelectorAll("[data-progress-step]"));
  var btnBack = form.querySelector("[data-back]");
  var btnNext = form.querySelector("[data-next]");
  var btnSubmit = form.querySelector("[data-submit]");
  var summary = form.querySelector("[data-error-summary]");
  var summaryTitle = form.querySelector("[data-error-title]");
  var summaryList = form.querySelector("[data-error-list]");
  var carried = form.querySelector("[data-carried]");
  var carriedText = form.querySelector("[data-carried-text]");
  var urgentTip = form.querySelector("[data-urgent-tip]");
  var review = form.querySelector("[data-review]");
  var done = card.querySelector("[data-done]");
  var counter = form.querySelector("[data-count]");
  var description = form.elements.description;

  var TOTAL = steps.length;
  var current = 1;
  var attempted = {}; // steps where "Continue" has been pressed: errors then update live

  var PROBLEMS = {
    leak: "Leak or burst pipe",
    clog: "Clogged drain",
    hot: "No hot water",
    pressure: "Low water pressure",
    sewer: "Sewer smell or backup",
    fixture: "Fixture repair or install",
    other: "Something else"
  };
  var URGENCY = { urgent: "Urgent — causing damage now", soon: "Soon — within a few days", flexible: "Flexible — planning ahead" };
  var METHOD = { call: "Phone call", text: "Text message", email: "Email" };

  /* ---------- Helpers ---------- */
  function val(name) {
    var el = form.elements[name];
    return el ? String(el.value || "").trim() : "";
  }
  function digits(s) {
    return s.replace(/\D/g, "");
  }
  function usPhone(s) {
    var d = digits(s);
    if (d.length === 11 && d.charAt(0) === "1") d = d.slice(1);
    return d.length === 10 && /^[2-9]/.test(d) ? d : null;
  }
  function formatPhone(d) {
    return "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6);
  }
  function scrollTo(el) {
    var top = el.getBoundingClientRect().top;
    var headerH = 90;
    if (top < headerH || top > window.innerHeight * 0.6) {
      window.scrollTo({ top: window.scrollY + top - headerH, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }

  /* ---------- Validation rules per step ---------- */
  function rules(step) {
    var errors = [];
    if (step === 1) {
      if (!val("problem")) errors.push({ name: "problem", target: form.querySelector('[name="problem"]'), msg: "Choose the problem that's closest to yours." });
      if (!val("urgency")) errors.push({ name: "urgency", target: form.querySelector('[name="urgency"]'), msg: "Choose how urgent it is." });
    }
    if (step === 2) {
      if (val("description").length > 600) errors.push({ name: "description", target: description, msg: "Keep the description to 600 characters or fewer." });
    }
    if (step === 3) {
      var method = val("method");
      var phone = val("phone");
      var email = val("email");
      if (val("name").length < 2) errors.push({ name: "name", target: form.elements.name, msg: "Enter your name." });
      if (!method) errors.push({ name: "method", target: form.querySelector('[name="method"]'), msg: "Choose how you'd like to be contacted." });
      if (!phone && (method === "call" || method === "text")) {
        errors.push({ name: "phone", target: form.elements.phone, msg: "Enter a phone number so we can " + (method === "text" ? "text" : "call") + " you." });
      } else if (phone && !usPhone(phone)) {
        errors.push({ name: "phone", target: form.elements.phone, msg: "Enter a 10-digit US phone number, like (713) 555-0199." });
      }
      if (!email && method === "email") {
        errors.push({ name: "email", target: form.elements.email, msg: "Enter an email address so we can reply." });
      } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        errors.push({ name: "email", target: form.elements.email, msg: "Enter an email address in the format name@example.com." });
      }
    }
    return errors;
  }

  var FIELDS_BY_STEP = { 1: ["problem", "urgency"], 2: ["description"], 3: ["name", "method", "phone", "email"], 4: [] };

  function showErrors(step, errors, withSummary) {
    FIELDS_BY_STEP[step].forEach(function (name) {
      var err = errors.filter(function (e) { return e.name === name; })[0];
      var msgEl = form.querySelector('[data-error-for="' + name + '"]');
      var wrap = msgEl ? msgEl.closest(".field") : null;
      if (msgEl) msgEl.textContent = err ? err.msg : "";
      if (wrap) wrap.classList.toggle("has-error", !!err);
      var inputs = form.querySelectorAll('[name="' + name + '"]');
      Array.prototype.forEach.call(inputs, function (i) {
        if (err) i.setAttribute("aria-invalid", "true");
        else i.removeAttribute("aria-invalid");
      });
    });

    if (!errors.length) {
      summary.hidden = true;
      return;
    }
    if (withSummary || !summary.hidden) {
      summaryTitle.textContent =
        errors.length === 1 ? "There's 1 thing to fix before you continue:" : "There are " + errors.length + " things to fix before you continue:";
      summaryList.innerHTML = "";
      errors.forEach(function (e) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + (e.target.id || "f-" + e.name);
        a.textContent = e.msg;
        a.addEventListener("click", function (ev) {
          ev.preventDefault();
          var t = e.target;
          // For a radio group, focus the checked option or the first one
          if (t.type === "radio") t = form.querySelector('[name="' + e.name + '"]:checked') || t;
          t.focus();
        });
        li.appendChild(a);
        summaryList.appendChild(li);
      });
      summary.hidden = false;
    }
  }

  function validate(step, withSummary) {
    var errors = rules(step);
    showErrors(step, errors, withSummary);
    return errors;
  }

  /* ---------- Step navigation ---------- */
  function goTo(step, focusHeading) {
    current = step;
    steps.forEach(function (s) {
      s.hidden = Number(s.getAttribute("data-step")) !== step;
    });
    progress.forEach(function (p) {
      var n = Number(p.getAttribute("data-progress-step"));
      p.classList.toggle("is-done", n < step);
      if (n === step) p.setAttribute("aria-current", "step");
      else p.removeAttribute("aria-current");
    });
    btnBack.hidden = step === 1;
    btnNext.hidden = step === TOTAL;
    btnSubmit.hidden = step !== TOTAL;
    summary.hidden = true;
    if (step === TOTAL) buildReview();
    if (focusHeading !== false) {
      var h = steps[step - 1].querySelector(".qstep__title");
      scrollTo(card);
      h.focus({ preventScroll: true });
    }
  }

  btnNext.addEventListener("click", function () {
    attempted[current] = true;
    var errors = validate(current, true);
    if (errors.length) {
      summary.focus();
      return;
    }
    goTo(current + 1);
  });

  btnBack.addEventListener("click", function () {
    goTo(current - 1);
  });

  // Enter in a text field moves forward instead of submitting the form early
  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.tagName === "INPUT" && current < TOTAL) {
      e.preventDefault();
      btnNext.click();
    }
  });

  // Live re-validation once a step has been attempted
  function onChange(e) {
    var name = e.target.name;
    if (name === "problem" && e.isTrusted) carried.hidden = true;
    if (name === "urgency") urgentTip.hidden = val("urgency") !== "urgent";
    if (name === "method") updateNeeds();
    if (name === "description") counter.textContent = description.value.length + " of 600 characters";
    if (attempted[current]) validate(current, false);
  }
  form.addEventListener("change", onChange);
  form.addEventListener("input", onChange);

  form.elements.phone.addEventListener("blur", function () {
    var d = usPhone(this.value);
    if (d) this.value = formatPhone(d);
  });

  function updateNeeds() {
    var m = val("method");
    var phoneNeed = form.querySelector('[data-need="phone"]');
    var emailNeed = form.querySelector('[data-need="email"]');
    var phoneReq = m === "call" || m === "text";
    var emailReq = m === "email";
    phoneNeed.textContent = m ? (phoneReq ? "Required" : "Optional") : "Required for call or text";
    emailNeed.textContent = m ? (emailReq ? "Required" : "Optional") : "Required for email";
    phoneNeed.className = phoneReq || !m ? "req" : "opt";
    emailNeed.className = emailReq || !m ? "req" : "opt";
  }

  /* ---------- Review ---------- */
  function row(label, value, step) {
    var wrap = document.createElement("div");
    wrap.className = "review__row";
    var dt = document.createElement("dt");
    dt.textContent = label;
    var dd = document.createElement("dd");
    var span = document.createElement("span");
    span.className = "review__value";
    span.textContent = value || "—";
    var edit = document.createElement("button");
    edit.type = "button";
    edit.className = "link-btn";
    edit.innerHTML = 'Edit<span class="visually-hidden"> ' + label.toLowerCase() + "</span>";
    edit.addEventListener("click", function () {
      goTo(step);
    });
    dd.appendChild(span);
    dd.appendChild(edit);
    wrap.appendChild(dt);
    wrap.appendChild(dd);
    return wrap;
  }

  function buildReview() {
    review.innerHTML = "";
    review.appendChild(row("Problem", PROBLEMS[val("problem")], 1));
    review.appendChild(row("Urgency", URGENCY[val("urgency")], 1));
    review.appendChild(row("Description", val("description") || "Not provided", 2));
    review.appendChild(row("Name", val("name"), 3));
    review.appendChild(row("Contact by", METHOD[val("method")], 3));
    review.appendChild(row("Phone", val("phone") || "Not provided", 3));
    review.appendChild(row("Email", val("email") || "Not provided", 3));
  }

  /* ---------- Submit (demo) ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Demo mode: never let the browser send the form anywhere
    for (var s = 1; s < TOTAL; s++) {
      if (rules(s).length) {
        attempted[s] = true;
        goTo(s);
        validate(s, true);
        summary.focus();
        return;
      }
    }
    onSubmit();
  });

  function onSubmit() {
    // LIVE SITE: replace this with the client's approved lead-delivery integration.
    // In demo mode the answers are discarded immediately.
    resetForm();
    form.hidden = true;
    card.querySelector("[data-progress]").hidden = true;
    done.hidden = false;
    scrollTo(card);
    done.focus({ preventScroll: true });
  }

  function resetForm() {
    form.reset();
    attempted = {};
    carried.hidden = true;
    urgentTip.hidden = true;
    review.innerHTML = "";
    counter.textContent = "0 of 600 characters";
    updateNeeds();
    [1, 2, 3].forEach(function (s) {
      showErrors(s, [], false);
    });
  }

  card.querySelector("[data-restart]").addEventListener("click", function () {
    done.hidden = true;
    form.hidden = false;
    card.querySelector("[data-progress]").hidden = false;
    goTo(1);
  });

  /* ---------- Test data (fictional only) ---------- */
  form.querySelector("[data-testfill]").addEventListener("click", function () {
    form.elements.name.value = "Jordan Example";
    form.querySelector('[name="method"][value="call"]').checked = true;
    form.elements.phone.value = "(713) 555-0199";
    form.elements.email.value = "jordan@example.com";
    updateNeeds();
    if (attempted[3]) validate(3, false);
    form.elements.name.focus();
  });

  /* ---------- Problem carried in from the finder or services ---------- */
  function setProblem(key, source) {
    if (!PROBLEMS[key]) return;
    var radio = form.querySelector('[name="problem"][value="' + key + '"]');
    if (!radio) return;
    radio.checked = true;
    carriedText.textContent =
      (source === "services" ? "Filled in from Services: " : "Filled in from the problem finder: ") + PROBLEMS[key] + ". You can change it below.";
    carried.hidden = false;
    if (attempted[1]) validate(1, false);
  }

  document.addEventListener("cv:problem", function (e) {
    setProblem(e.detail.key, e.detail.source);
  });

  document.addEventListener("click", function (e) {
    var link = e.target.closest("[data-request]");
    if (!link) return;
    e.preventDefault();
    if (!done.hidden) card.querySelector("[data-restart]").click();
    setProblem(link.getAttribute("data-request"), link.closest(".services") ? "services" : "finder");
    goTo(1); // scrolls the form into view and focuses the step heading
  });

  /* ---------- Phones: hide the bottom action bar while typing ---------- */
  form.addEventListener("focusin", function (e) {
    if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName) && e.target.type !== "radio") {
      document.documentElement.classList.add("is-typing");
    }
  });
  form.addEventListener("focusout", function () {
    document.documentElement.classList.remove("is-typing");
  });

  /* ---------- Start ---------- */
  updateNeeds();
  goTo(1, false);
})();
