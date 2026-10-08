/* SNS ROOFING — demo concept interactions
   - Mobile nav toggle + active link states
   - Sticky header state
   - GSAP cinematic motion (graceful if CDN fails)
   - Demo quote form (non-functional by design)
*/
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.classList.remove("is-open");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Demo quote form (does NOT send data anywhere) ---------- */
  var form = document.getElementById("quote-form");
  var notice = document.getElementById("form-notice");
  if (form && notice) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // demo only — no backend, no data collection
      notice.hidden = false;
      notice.setAttribute("tabindex", "-1");
      notice.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "nearest" });
      notice.focus({ preventScroll: true });
    });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = document.querySelectorAll(".nav__links a");
  var sections = ["services", "why", "area", "quote"].map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);

  function setActive() {
    var current = null;
    var y = window.scrollY + 140;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= y) current = sec.id;
    });
    navLinks.forEach(function (a) {
      var match = current && a.getAttribute("href") === "#" + current;
      a.classList.toggle("is-active", !!match);
    });
  }
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  /* ---------- GSAP cinematic motion ---------- */
  var hasGsap = typeof window.gsap !== "undefined";
  var root = document.documentElement;

  if (!hasGsap || prefersReduced) {
    root.classList.add("no-anim");
    return;
  }
  root.classList.add("js-anim");

  var hasTrigger = typeof window.ScrollTrigger !== "undefined";
  if (hasTrigger) gsap.registerPlugin(ScrollTrigger);

  /* Split hero H1 into word masks */
  var heroTitle = document.querySelector("[data-hero-words]");
  if (heroTitle) {
    var words = heroTitle.textContent.trim().split(/\s+/);
    heroTitle.setAttribute("aria-label", words.join(" "));
    heroTitle.innerHTML = words.map(function (w) {
      return '<span class="word-mask" aria-hidden="true"><span class="word">' + w + "</span></span>";
    }).join(" ");
    // Force the container visible; words carry the animation
    gsap.set(heroTitle, { opacity: 1 });
    gsap.fromTo(
      heroTitle.querySelectorAll(".word"),
      { yPercent: 110 },
      { yPercent: 0, duration: 1.05, ease: "power4.out", stagger: 0.09, delay: 0.25 }
    );
  }

  /* Hero intro for the rest */
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .to("[data-hero]:not([data-hero-words])", {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.12, delay: 0.55,
      startAt: { y: 34 }
    });

  /* Hero background parallax */
  if (hasTrigger) {
    gsap.to(".hero__photo", {
      yPercent: 14,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* Scroll-triggered reveals */
  if (hasTrigger) {
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 44 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true }
        }
      );
    });

    /* Card image settle zoom */
    gsap.utils.toArray(".card__media img").forEach(function (img) {
      gsap.fromTo(
        img,
        { scale: 1.12 },
        {
          scale: 1, duration: 1.2, ease: "power2.out",
          scrollTrigger: { trigger: img, start: "top 92%", once: true }
        }
      );
    });

    /* Storm band slow zoom */
    var stormImg = document.querySelector(".storm__bg img");
    if (stormImg) {
      gsap.fromTo(
        stormImg,
        { scale: 1.15 },
        {
          scale: 1, ease: "none",
          scrollTrigger: { trigger: ".storm", start: "top bottom", end: "bottom top", scrub: true }
        }
      );
    }
  } else {
    gsap.to("[data-reveal]", { opacity: 1, duration: 0.6 });
    gsap.to("[data-hero]:not([data-hero-words])", { opacity: 1, duration: 0.6 });
  }
})();
