/* ==========================================================================
   AVIYA PATISSERIE — script.js
   Vanilla JS only. No frameworks, no build step.
   Handles: EN/HE language switch, mobile nav toggle, scroll-reveal animation,
   digital-products recipe search/filter, and the shared purchase-details
   modal system (recipe / business template / guide product modals).
   All digital-products-specific functions guard on their root element and
   simply return if it isn't present, so this file is safe to load on every
   page unchanged.
   ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "aviya-lang";

  /* ------------------------------------------------------------------
     LANGUAGE SWITCH
     Every translatable piece of content is written twice in the HTML:
     once inside an element with class "lang-en", once with "lang-he".
     This script just toggles <html lang="en|he"> and <html dir="ltr|rtl">.
     CSS (see styles.css) hides whichever language block doesn't match.
  ------------------------------------------------------------------ */
  function applyLanguage(lang) {
    var root = document.documentElement;
    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "he" ? "rtl" : "ltr");

    /* Force a synchronous reflow right after the dir/lang flip. Reading
       a layout property (offsetHeight) forces the browser to recalculate
       layout immediately instead of potentially deferring it, which is
       cheap here and guarantees the RTL/LTR layout is fully settled
       before anything else (like the scroll-reveal observer) runs. */
    void document.body.offsetHeight;

    var buttons = document.querySelectorAll("[data-lang-btn]");
    buttons.forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang-btn") === lang;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage may be unavailable (private browsing); fail silently */
    }
  }

  function getInitialLanguage() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "he") return saved;
    } catch (e) {}
    /* Default language is English, per project requirements. */
    return document.documentElement.getAttribute("lang") || "en";
  }

  function initLanguageToggle() {
    applyLanguage(getInitialLanguage());

    var buttons = document.querySelectorAll("[data-lang-btn]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLanguage(btn.getAttribute("data-lang-btn"));
      });
    });
  }

  /* ------------------------------------------------------------------
     MOBILE NAV
  ------------------------------------------------------------------ */
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------------------------
     SCROLL REVEAL — gentle fade/slide-up when elements enter the viewport
     --------------------------------------------------------------------
     Root-cause note: on some emulated/throttled/RTL-flip environments,
     IntersectionObserver's very first measurement can be taken against
     stale geometry (e.g. mid-reflow, right as dir="rtl" is applied),
     which can incorrectly conclude an element is not intersecting and
     leave it permanently at opacity:0 — this is what caused the
     "blank page" reports. The fix below is defense-in-depth: even if the
     observer's first read is wrong, everything is force-revealed shortly
     after the page finishes loading, so content can never stay stuck.
  ------------------------------------------------------------------ */
  function initScrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });

    /* Safety net: force-reveal anything still hidden a moment after the
       page has fully loaded (images, fonts, layout settled). This never
       affects normal scrolling — by then, in-viewport items are already
       revealed by the observer, so this only rescues items the observer
       missed due to a stale first measurement. */
    window.addEventListener("load", function () {
      setTimeout(function () {
        items.forEach(function (el) { el.classList.add("is-visible"); });
        observer.disconnect();
      }, 700);
    });
  }

  /* ------------------------------------------------------------------
     DIGITAL PRODUCTS — RECIPE SEARCH & FILTER
     --------------------------------------------------------------------
     Scoped entirely to #recipeGrid .recipe-product-card. No-ops on any
     page that doesn't have a #recipeGrid element (i.e. every page
     except digital-products.html), so this is safe to run everywhere.
  ------------------------------------------------------------------ */
  function initRecipeSearchAndFilter() {
    var grid = document.getElementById("recipeGrid");
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".recipe-product-card"));
    var searchInput = document.getElementById("recipeSearchInput");
    var filterBubbles = Array.prototype.slice.call(document.querySelectorAll(".filter-bubble"));
    var emptyStates = Array.prototype.slice.call(document.querySelectorAll(".recipe-empty-state"));

    var activeFilter = "all";

    function normalize(str) {
      return (str || "").toString().toLowerCase().trim();
    }

    function applyFilters() {
      var query = normalize(searchInput ? searchInput.value : "");
      var visibleCount = 0;

      cards.forEach(function (card) {
        var categories = " " + normalize(card.getAttribute("data-categories")) + " ";
        var searchText = normalize(card.getAttribute("data-search"));
        var matchesFilter = activeFilter === "all" || categories.indexOf(" " + activeFilter + " ") !== -1;
        var matchesSearch = !query || searchText.indexOf(query) !== -1;
        var show = matchesFilter && matchesSearch;
        card.style.display = show ? "" : "none";
        if (show) visibleCount++;
      });

      emptyStates.forEach(function (el) {
        el.hidden = visibleCount !== 0;
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    filterBubbles.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBubbles.forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        activeFilter = btn.getAttribute("data-filter") || "all";
        applyFilters();
      });
    });

    /* Keep the search input's placeholder/aria-label in sync with the
       language switch above, without any special-casing there. */
    function updateSearchPlaceholder() {
      if (!searchInput) return;
      var isHebrew = document.documentElement.getAttribute("lang") === "he";
      searchInput.setAttribute("placeholder", isHebrew ? "חפשי מתכון..." : "Search recipes...");
      searchInput.setAttribute("aria-label", isHebrew ? "חיפוש מתכונים" : "Search recipes");
    }

    updateSearchPlaceholder();
    if (window.MutationObserver) {
      new MutationObserver(updateSearchPlaceholder).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"]
      });
    }

    applyFilters();
  }

  /* ------------------------------------------------------------------
     DIGITAL PRODUCTS — PURCHASE DETAILS MODAL SYSTEM
     --------------------------------------------------------------------
     One generic, reusable modal handler shared by all three product
     modals on digital-products.html (recipe / business template /
     guide). Each modal is wired up by calling initPurchaseModal() with
     its own element IDs and a small "populate" callback that fills in
     that modal's fields from the clicked product card — the open/close/
     Escape/outside-click/checkbox-gating/focus-reset machinery is
     identical for all three, so it only needs to be written once here.
     Every call guards on its own overlay element, so pages without a
     given modal simply skip it.
  ------------------------------------------------------------------ */
  function textOf(card, selector) {
    var el = card.querySelector(selector);
    return el ? el.textContent.trim() : "";
  }

  function initPurchaseModal(opts) {
    var overlay = document.getElementById(opts.overlayId);
    if (!overlay) return;

    var closeBtn = document.getElementById(opts.closeId);
    var checkbox = document.getElementById(opts.checkboxId);
    var buyButtons = opts.buyButtonIds.map(function (id) { return document.getElementById(id); });
    var msgEls = opts.msgIds.map(function (id) { return document.getElementById(id); });

    var lastFocusedEl = null;

    function updateBuyButtonsState() {
      var enabled = checkbox.checked;
      buyButtons.forEach(function (btn) {
        btn.classList.toggle("is-disabled", !enabled);
        btn.setAttribute("aria-disabled", enabled ? "false" : "true");
      });
      msgEls.forEach(function (el) { el.hidden = true; });
    }

    function openModal(card) {
      lastFocusedEl = document.activeElement;

      opts.populate(card);

      checkbox.checked = false;
      updateBuyButtonsState();

      overlay.hidden = false;
      document.body.classList.add("modal-open");
      document.addEventListener("keydown", onKeydown);
      closeBtn.focus();
    }

    function closeModal() {
      overlay.hidden = true;
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKeydown);
      if (lastFocusedEl && typeof lastFocusedEl.focus === "function") lastFocusedEl.focus();
    }

    function onKeydown(e) {
      if (e.key === "Escape" || e.key === "Esc") closeModal();
    }

    document.querySelectorAll(opts.triggerSelector).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(opts.cardSelector);
        if (card) openModal(card);
      });
    });

    closeBtn.addEventListener("click", closeModal);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });

    checkbox.addEventListener("change", updateBuyButtonsState);

    buyButtons.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        if (!checkbox.checked) {
          e.preventDefault();
          msgEls.forEach(function (el) { el.hidden = false; });
        }
      });
    });
  }

  function initDigitalProductModals() {
    /* Recipe modal — two buy buttons (English/Hebrew recipe versions),
       plus an image and category tags copied straight from the card. */
    initPurchaseModal({
      overlayId: "recipeModalOverlay",
      closeId: "recipeModalClose",
      checkboxId: "recipeModalCheckbox",
      buyButtonIds: ["recipeModalBuyEn", "recipeModalBuyHe"],
      msgIds: ["recipeModalMsgEn", "recipeModalMsgHe"],
      triggerSelector: ".recipe-buy-btn",
      cardSelector: ".recipe-product-card",
      populate: function (card) {
        document.getElementById("recipeModalTitleEn").textContent = textOf(card, "h3.lang-en");
        document.getElementById("recipeModalTitleHe").textContent = textOf(card, "h3.lang-he");

        var cardTagsEn = card.querySelector(".recipe-tags.lang-en");
        var cardTagsHe = card.querySelector(".recipe-tags.lang-he");
        document.getElementById("recipeModalTagsEn").innerHTML = cardTagsEn ? cardTagsEn.innerHTML : "";
        document.getElementById("recipeModalTagsHe").innerHTML = cardTagsHe ? cardTagsHe.innerHTML : "";

        document.getElementById("recipeModalDescEn").textContent = card.getAttribute("data-desc-en") || "";
        document.getElementById("recipeModalDescHe").textContent = card.getAttribute("data-desc-he") || "";

        document.getElementById("recipeModalPrice").textContent = textOf(card, ".recipe-product-price");

        var imgEl = document.getElementById("recipeModalImg");
        var cardImg = card.querySelector(".recipe-product-img");
        imgEl.innerHTML = cardImg ? cardImg.innerHTML : "";
        var imgStyle = cardImg ? cardImg.getAttribute("style") : null;
        if (imgStyle) {
          imgEl.setAttribute("style", imgStyle);
        } else {
          imgEl.removeAttribute("style");
        }
        imgEl.setAttribute("aria-label", cardImg ? cardImg.getAttribute("aria-label") || "" : "");

        document.getElementById("recipeModalBuyEn").setAttribute("href", card.getAttribute("data-paypal-en") || "#");
        document.getElementById("recipeModalBuyHe").setAttribute("href", card.getAttribute("data-paypal-he") || "#");
      }
    });

    /* Business Template modal — single "Buy Now" button; title/
       description/price are read straight from the card since Business
       Template cards keep those fields visible (unlike recipe cards). */
    initPurchaseModal({
      overlayId: "templateModalOverlay",
      closeId: "templateModalClose",
      checkboxId: "templateModalCheckbox",
      buyButtonIds: ["templateModalBuy"],
      msgIds: ["templateModalMsgEn", "templateModalMsgHe"],
      triggerSelector: ".template-buy-btn",
      cardSelector: ".product-card",
      populate: function (card) {
        document.getElementById("templateModalTitleEn").textContent = textOf(card, "h3.lang-en");
        document.getElementById("templateModalTitleHe").textContent = textOf(card, "h3.lang-he");
        document.getElementById("templateModalDescEn").textContent = textOf(card, "p.small.muted.lang-en");
        document.getElementById("templateModalDescHe").textContent = textOf(card, "p.small.muted.lang-he");
        document.getElementById("templateModalPrice").textContent = textOf(card, ".price");
        document.getElementById("templateModalBuy").setAttribute("href", card.getAttribute("data-paypal") || "#");
      }
    });

    /* Guide modal — same single-button pattern as Business Templates. */
    initPurchaseModal({
      overlayId: "guideModalOverlay",
      closeId: "guideModalClose",
      checkboxId: "guideModalCheckbox",
      buyButtonIds: ["guideModalBuy"],
      msgIds: ["guideModalMsgEn", "guideModalMsgHe"],
      triggerSelector: ".guide-buy-btn",
      cardSelector: ".product-card",
      populate: function (card) {
        document.getElementById("guideModalTitleEn").textContent = textOf(card, "h3.lang-en");
        document.getElementById("guideModalTitleHe").textContent = textOf(card, "h3.lang-he");
        document.getElementById("guideModalDescEn").textContent = textOf(card, "p.small.muted.lang-en");
        document.getElementById("guideModalDescHe").textContent = textOf(card, "p.small.muted.lang-he");
        document.getElementById("guideModalPrice").textContent = textOf(card, ".price");
        document.getElementById("guideModalBuy").setAttribute("href", card.getAttribute("data-paypal") || "#");
      }
    });
  }

  /* ------------------------------------------------------------------
     CURRENT YEAR — for footer copyright
  ------------------------------------------------------------------ */
  function initYear() {
    var els = document.querySelectorAll("[data-year]");
    var year = new Date().getFullYear();
    els.forEach(function (el) { el.textContent = year; });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLanguageToggle();
    initMobileNav();
    initScrollReveal();
    initYear();
    initRecipeSearchAndFilter();
    initDigitalProductModals();
  });
})();
