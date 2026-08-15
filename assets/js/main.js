/* =========================================================
   GOLDEN CROWN landing page — vanilla JS
   Lenis smooth scroll + GSAP ScrollTrigger reveals/counters.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Lenis smooth scroll ---------------- */
  var lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    document.documentElement.classList.add("has-lenis");

    if (window.gsap && window.gsap.ticker) {
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------------- GSAP setup ---------------- */
  var hasGsap = !!window.gsap;
  if (hasGsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
    }
  }
  if (reduceMotion) {
    document.documentElement.classList.add("js-no-scroll-anim");
  }

  /* ---------------- Header scroll state ---------------- */
  var header = document.querySelector(".header");
  function updateHeader() {
    if (window.scrollY > 40) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------------- Mobile nav ---------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
      var open = mobileNav.classList.contains("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { mobileNav.classList.remove("is-open"); });
    });
  }

  /* ---------------- Mega menu (tap support) ---------------- */
  document.querySelectorAll(".nav__item--has-mega > .nav__link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (window.innerWidth < 940) {
        e.preventDefault();
        link.closest(".nav__item").classList.toggle("is-open");
      }
    });
  });

  /* ---------------- Smooth-scroll anchor links ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -70 });
      } else {
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    });
  });

  /* ---------------- Hero rotating slides ---------------- */
  var slides = document.querySelectorAll(".hero__slide");
  var dots = document.querySelectorAll(".hero__dot");
  var slideIndex = 0;
  var slideTimer = null;

  function showSlide(i) {
    slideIndex = i;
    slides.forEach(function (s, idx) { s.classList.toggle("is-active", idx === i); });
    dots.forEach(function (d, idx) { d.classList.toggle("is-active", idx === i); });
  }

  function nextSlide() { showSlide((slideIndex + 1) % slides.length); }

  function startRotation() {
    stopRotation();
    if (!reduceMotion) slideTimer = setInterval(nextSlide, 6000);
  }
  function stopRotation() { if (slideTimer) clearInterval(slideTimer); }

  if (slides.length) {
    showSlide(0);
    startRotation();
    dots.forEach(function (d, idx) {
      d.addEventListener("click", function () { showSlide(idx); startRotation(); });
    });
  }

  /* ---------------- Hero entrance timeline ---------------- */
  if (hasGsap) {
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(".hero__eyebrow", { opacity: 1, y: 0, duration: 0.5 })
      .to(".hero__headline .line span", { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.2")
      .to(".hero__sub", { opacity: 1, y: 0, duration: 0.5 }, "-=0.25")
      .to(".hero__actions", { opacity: 1, y: 0, duration: 0.5 }, "-=0.25")
      .to(".hero__stage", { opacity: 1, duration: 0.7 }, "-=0.6");
  } else {
    document.querySelectorAll(".hero__eyebrow, .hero__headline .line span, .hero__sub, .hero__actions, .hero__stage")
      .forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
  }

  /* ---------------- Scroll reveals ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (hasGsap && window.ScrollTrigger && !reduceMotion) {
    revealEls.forEach(function (el) {
      el.classList.add("is-ready");
      gsap.fromTo(el,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" }
        }
      );
    });

    gsap.utils.toArray(".feature-grid").forEach(function (grid) {
      gsap.fromTo(grid.querySelectorAll(".feature-card"),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: grid, start: "top 80%" }
        }
      );
    });

    /* subtle hero background parallax */
    gsap.to(".hero__grid", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  } else {
    revealEls.forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
  }

  /* ---------------- Stat counters ---------------- */
  function animateCounters(root) {
    var counters = root.querySelectorAll(".stat-chip__value[data-count-to]");
    counters.forEach(function (el) {
      if (el.dataset.counted === "true") return;
      var to = parseFloat(el.getAttribute("data-count-to"));
      var unit = el.querySelector(".stat-chip__unit");
      var unitHTML = unit ? unit.outerHTML : "";
      if (reduceMotion || !hasGsap) {
        el.dataset.counted = "true";
        el.innerHTML = to + unitHTML;
        return;
      }
      var obj = { val: 0 };
      gsap.to(obj, {
        val: to,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: function () { el.innerHTML = Math.round(obj.val) + unitHTML; },
        onComplete: function () { el.dataset.counted = "true"; }
      });
    });
  }

  var copyPanels = document.querySelectorAll(".showcase-copy");
  if (hasGsap && window.ScrollTrigger) {
    copyPanels.forEach(function (panel) {
      ScrollTrigger.create({
        trigger: panel,
        start: "top 75%",
        onEnter: function () { if (panel.classList.contains("is-active")) animateCounters(panel); }
      });
    });
  }

  /* ---------------- Typing effect for tagline/name ---------------- */
  function typeText(el, speed) {
    if (el.dataset.fullText === undefined) el.dataset.fullText = el.textContent;
    var full = el.dataset.fullText;
    if (reduceMotion) { el.textContent = full; return; }
    el.textContent = "";
    var cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    el.appendChild(cursor);
    var i = 0;
    var timer = setInterval(function () {
      cursor.insertAdjacentText("beforebegin", full[i]);
      i++;
      if (i >= full.length) {
        clearInterval(timer);
        setTimeout(function () { cursor.remove(); }, 500);
      }
    }, speed);
  }

  /* ---------------- Model showcase tabs ---------------- */
  var tabs = document.querySelectorAll(".showcase-tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      if (tab.classList.contains("is-active")) return;
      var slug = tab.getAttribute("data-target");
      var nextArt = document.getElementById("art-" + slug);
      var nextCopy = document.getElementById("copy-" + slug);
      var currentArt = document.querySelector(".showcase-art.is-active");
      var currentCopy = document.querySelector(".showcase-copy.is-active");
      if (!nextArt || !nextCopy || nextCopy === currentCopy) return;

      tabs.forEach(function (t) { t.classList.toggle("is-active", t === tab); });

      /* image: crossfade */
      if (currentArt) currentArt.classList.remove("is-active");
      nextArt.classList.add("is-active");

      /* copy: instant swap, text fields type in, stats count up */
      if (currentCopy) currentCopy.classList.remove("is-active");
      nextCopy.classList.add("is-active");
      typeText(nextCopy.querySelector(".showcase-panel__tagline"), 28);
      typeText(nextCopy.querySelector(".showcase-panel__name"), 35);
      nextCopy.querySelectorAll(".stat-chip__value[data-count-to]").forEach(function (el) {
        delete el.dataset.counted;
      });
      animateCounters(nextCopy);
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });
  if (copyPanels.length) animateCounters(copyPanels[0]);

  /* ---------------- Cost-savings calculator ---------------- */
  // PLACEHOLDER ASSUMPTIONS — replace with real Bangladesh fuel/electricity figures before launch.
  var PETROL_PRICE_PER_LITRE_BDT = 125;   // BDT per litre, placeholder (approx market rate)
  var PETROL_KM_PER_LITRE = 40;           // avg petrol bike mileage, placeholder
  var ELECTRICITY_COST_PER_FULL_CHARGE_BDT = 18; // BDT per full charge, placeholder
  var RANGE_PER_CHARGE_KM = 90;           // GOLDEN CROWN avg range per charge, placeholder
  var DAYS_PER_MONTH = 30;

  var distanceSlider = document.getElementById("calc-distance");
  var distanceOutput = document.getElementById("calc-distance-output");
  var petrolValueEl = document.getElementById("calc-petrol-value");
  var electricValueEl = document.getElementById("calc-electric-value");
  var savingsValueEl = document.getElementById("calc-savings-value");

  function updateCalculator() {
    if (!distanceSlider) return;
    var dailyKm = parseFloat(distanceSlider.value);
    distanceOutput.textContent = dailyKm + " km";

    var monthlyKm = dailyKm * DAYS_PER_MONTH;
    var petrolCost = (monthlyKm / PETROL_KM_PER_LITRE) * PETROL_PRICE_PER_LITRE_BDT;
    var chargesNeeded = monthlyKm / RANGE_PER_CHARGE_KM;
    var electricCost = chargesNeeded * ELECTRICITY_COST_PER_FULL_CHARGE_BDT;
    var savings = Math.max(0, petrolCost - electricCost);

    petrolValueEl.textContent = "৳" + Math.round(petrolCost).toLocaleString();
    electricValueEl.textContent = "৳" + Math.round(electricCost).toLocaleString();
    savingsValueEl.textContent = "৳" + Math.round(savings).toLocaleString() + " / month";
  }
  if (distanceSlider) {
    distanceSlider.addEventListener("input", updateCalculator);
    updateCalculator();
  }

  /* ---------------- Enquiry form ---------------- */
  var form = document.getElementById("enquiry-form");
  var formSuccess = document.getElementById("form-success");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // TODO: replace this block with a POST to the GOLDEN CROWN CRM API endpoint.
      // e.g. fetch("https://api.goldencrown.com/leads", { method: "POST", body: new FormData(form) })
      form.classList.add("is-hidden");
      formSuccess.classList.add("is-visible");
    });
  }

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
