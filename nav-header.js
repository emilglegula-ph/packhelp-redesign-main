// Single source of truth for the top nav — the ONLY component for site
// navigation. Never rebuild nav markup inline on a page; add a placeholder
// here instead and edit this file.
//
// This file lives at the repo root but is also loaded (via a relative
// <script src="../nav-header.js">) from pages nested in subfolders like
// Industries/ and Listing/. Every href/src below is built from ROOT_URL,
// which is resolved at runtime from this script's own tag — the browser
// always reports document.currentScript.src as this file's real absolute
// location, so stripping the filename gives the site root regardless of
// whether the page loaded it via "nav-header.js", "../nav-header.js", or an
// absolute path, and regardless of file:// vs http(s):// serving. Do not
// hardcode "/something.html" paths here — they only work when the site
// happens to be served from an HTTP root, and silently break under file://.

var ROOT_URL = (function () {
  var thisScript = document.currentScript;
  if (!thisScript) {
    var scripts = document.getElementsByTagName('script');
    thisScript = scripts[scripts.length - 1];
  }
  return thisScript.src.replace(/[^/]*$/, '');
})();

// Two variants:
// - Full nav (megamenu, search, sticky-cta) — used on marketing/catalog
//   pages. Placeholders: <div id="ph-sticky-bar"></div> and
//   <div id="ph-nav-wrapper"></div>.
// - Simplified nav (centered logo only) — used on focused/flow pages
//   (checkout-style, no distractions). Placeholder: <div id="ph-nav-simple"></div>.
// A page uses one variant or the other, never both.

var STICKY_BAR_HTML = `
<div class="sticky-bar" id="stickyBar">
  <nav class="sticky-links" id="stickyLinks">
    <a href="${ROOT_URL}Listing/packaging.html">Packaging<span class="pulse-dot"></span></a>
    <a href="${ROOT_URL}Listing/packaging.html">Merchandise<span class="nav-badge-new">New</span></a>
    <a href="${ROOT_URL}Industries/index.html">Industries<span class="pulse-dot"></span></a>
  </nav>

  <div class="search-wrap" id="searchWrap">
    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    <input type="text" placeholder="Search products by names, needs, categories...">
  </div>

  <div class="sticky-cta" id="stickyCta">
    <a href="${ROOT_URL}get-a-quote.html" class="btn-pill sm secondary">Get a quote</a>
    <button class="btn-pill sm">
      <span class="cta-avatars sm">
        <span class="cta-avatar"><img src="${ROOT_URL}expert-01.png" alt=""></span>
        <span class="cta-avatar"><img src="${ROOT_URL}expert-02.png" alt=""></span>
        <span class="cta-avatar"><img src="${ROOT_URL}expert-03.png" alt=""></span>
      </span>
      Book an expert call
    </button>
  </div>
</div>
`;

var NAV_WRAPPER_HTML = `
<div class="nav-wrapper">
    <div class="nav-row1">
      <a href="${ROOT_URL}index.html" aria-label="Packhelp" style="display:flex;">
        <img class="logo" src="${ROOT_URL}logo-packhelp.1iheyVke.svg" alt="Packhelp">
      </a>

      <div style="display:flex; align-items:center; gap:1rem;">
        <a href="#" class="signin-link">Sign In</a>
        <span class="flag-badge"><img src="${ROOT_URL}gb.svg" alt="GB"></span>
        <button class="icon-btn" aria-label="Cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></svg>
        </button>
      </div>
    </div>

    <nav class="topbar">
    <ul class="nav-links desktop-only">
      <li class="nav-item-packaging"><a href="${ROOT_URL}Listing/packaging.html">Packaging<span class="pulse-dot"></span></a></li>
      <li><a href="${ROOT_URL}Listing/packaging.html">Merchandise<span class="nav-badge-new">New</span></a></li>
      <li class="nav-item-industries">
        <a href="${ROOT_URL}Industries/index.html">Industries<span class="pulse-dot"></span></a>
        <div class="nav-industries-menu">
          <div class="nav-industries-menu-inner">
            <ul>
              <li><a href="${ROOT_URL}Industries/index.html">Apparel &amp; Fashion</a></li>
              <li><a href="${ROOT_URL}Industries/index.html">Health &amp; Beauty</a></li>
              <li><a href="${ROOT_URL}Industries/index.html">E-commerce</a></li>
              <li><a href="${ROOT_URL}Industries/index.html">Food &amp; Drinks</a></li>
              <li><a href="${ROOT_URL}Industries/index.html">Marketing &amp; Events</a></li>
              <li><a href="${ROOT_URL}Industries/index.html">Electronics</a></li>
              <li><a href="${ROOT_URL}Industries/index.html">Gifts</a></li>
              <li><a href="${ROOT_URL}Industries/index.html">Home &amp; Deco</a></li>
              <li><a href="${ROOT_URL}Industries/index.html">Logistics &amp; Fulfilment</a></li>
            </ul>
          </div>
        </div>
      </li>
      <li><a href="${ROOT_URL}sample-packs.html">Samples</a></li>
    </ul>

    <div class="nav-megamenu">
      <div class="nav-megamenu-inner">
        <div class="nav-megamenu-col">
          <div class="nav-megamenu-group">
            <p class="nav-megamenu-title">Boxes</p>
            <ul>
              <li><a href="${ROOT_URL}Listing/packaging.html">Mailer Boxes</a></li>
              <li><a href="${ROOT_URL}Listing/packaging.html">Shipping Boxes</a></li>
              <li>
                <a href="${ROOT_URL}Listing/packaging.html">Product Boxes</a>
                <ul class="nav-megamenu-sublist">
                  <li><a href="${ROOT_URL}Listing/packaging.html">Folding Cartons</a></li>
                  <li><a href="${ROOT_URL}Listing/packaging.html">Rigid Boxes</a></li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="nav-megamenu-group">
            <p class="nav-megamenu-title">Packaging Tubes</p>
            <ul>
              <li><a href="${ROOT_URL}Listing/packaging.html">Tube Boxes</a></li>
              <li><a href="${ROOT_URL}Listing/packaging.html">Mailing Tubes</a></li>
            </ul>
          </div>
          <div class="nav-megamenu-group">
            <p class="nav-megamenu-title">Mailing Bags</p>
            <ul>
              <li><a href="${ROOT_URL}Listing/packaging.html">Poly Mailers</a></li>
              <li><a href="${ROOT_URL}Listing/packaging.html">Paper Mailing Bags</a></li>
            </ul>
          </div>
        </div>

        <div class="nav-megamenu-col">
          <div class="nav-megamenu-group">
            <p class="nav-megamenu-title">Product Bags</p>
            <ul>
              <li><a href="${ROOT_URL}Listing/packaging.html">Drawstring Bags</a></li>
              <li><a href="${ROOT_URL}Listing/packaging.html">Zip Lock Bags</a></li>
            </ul>
          </div>
          <div class="nav-megamenu-group">
            <p class="nav-megamenu-title">Carrier Bags</p>
            <ul>
              <li><a href="${ROOT_URL}Listing/packaging.html">Paper Carrier Bags</a></li>
              <li><a href="${ROOT_URL}Listing/packaging.html">Cotton Carrier Bags</a></li>
            </ul>
          </div>
          <div class="nav-megamenu-group">
            <p class="nav-megamenu-title">Accessories</p>
            <ul>
              <li><a href="${ROOT_URL}Listing/packaging.html">Tissue &amp; wrapping paper</a></li>
              <li><a href="${ROOT_URL}Listing/packaging.html">Fillers</a></li>
              <li><a href="${ROOT_URL}Listing/packaging.html">Tapes</a></li>
              <li><a href="${ROOT_URL}Listing/packaging.html">Labels</a></li>
              <li><a href="${ROOT_URL}Listing/packaging.html">Stickers</a></li>
              <li><a href="${ROOT_URL}Listing/packaging.html">Other</a></li>
            </ul>
          </div>
        </div>

        <div class="nav-megamenu-col">
          <div class="nav-megamenu-group">
            <p class="nav-megamenu-title">Pouches</p>
          </div>
          <div class="nav-megamenu-group">
            <p class="nav-megamenu-title">Envelopes</p>
            <ul>
              <li><a href="${ROOT_URL}Listing/packaging.html">Cardboard</a></li>
              <li><a href="${ROOT_URL}Listing/packaging.html">Padded</a></li>
            </ul>
          </div>
          <div class="nav-megamenu-group">
            <p class="nav-megamenu-title">Food Packaging</p>
            <ul>
              <li><a href="${ROOT_URL}Listing/packaging.html">Pizza Boxes</a></li>
              <li><a href="${ROOT_URL}Listing/packaging.html">Cups and Cup Accessories</a></li>
            </ul>
          </div>
          <div class="nav-megamenu-group">
            <p class="nav-megamenu-title">Containers</p>
            <ul>
              <li><a href="${ROOT_URL}Listing/packaging.html">Bottles</a></li>
              <li><a href="${ROOT_URL}Listing/packaging.html">Jars</a></li>
            </ul>
          </div>
          <div class="nav-megamenu-group">
            <p class="nav-megamenu-title">Samples</p>
            <ul>
              <li><a href="${ROOT_URL}sample-packs.html">Sample Packs</a></li>
            </ul>
          </div>
          <div class="nav-megamenu-group">
            <p class="nav-megamenu-title">Bundles</p>
          </div>
        </div>

        <div class="nav-megamenu-divider"></div>

        <div class="nav-megamenu-col">
          <div class="nav-megamenu-group">
            <p class="nav-megamenu-title">Custom packaging</p>
            <ul>
              <li><a href="${ROOT_URL}build-your-box.html">Custom Boxes</a></li>
              <li><a href="${ROOT_URL}build-your-box.html">Custom Tubes</a></li>
              <li><a href="${ROOT_URL}build-your-box.html">Custom Mailing Bags</a></li>
              <li><a href="${ROOT_URL}build-your-box.html">Custom Accessories</a></li>
              <li><a href="${ROOT_URL}build-your-box.html">Custom Pouches</a></li>
              <li><a href="${ROOT_URL}build-your-box.html">Custom Packaging Bags</a></li>
              <li><a href="${ROOT_URL}build-your-box.html">Custom Envelopes</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <ul class="nav-links desktop-only">
      <li><a href="#">Deals</a></li>
      <li><a href="#">Solutions</a></li>
      <li><a href="#">Inspirations</a></li>
      <li><a href="#">Contact</a></li>
      <li><a href="${ROOT_URL}get-a-quote.html" class="btn-pill sm secondary">Get a quote</a></li>
      <li><button class="btn-pill sm">
        <span class="cta-avatars sm">
          <span class="cta-avatar"><img src="${ROOT_URL}expert-01.png" alt=""></span>
          <span class="cta-avatar"><img src="${ROOT_URL}expert-02.png" alt=""></span>
          <span class="cta-avatar"><img src="${ROOT_URL}expert-03.png" alt=""></span>
        </span>
        Book an expert call
      </button></li>
    </ul>
  </nav>
</div>
`;

var NAV_SIMPLE_HTML = `
<header class="quote-topbar">
  <a href="${ROOT_URL}index.html" aria-label="Packhelp" style="display:flex;">
    <img class="logo" src="${ROOT_URL}logo-packhelp.1iheyVke.svg" alt="Packhelp">
  </a>
</header>
`;

(function () {
  var stickyBarPlaceholder = document.getElementById('ph-sticky-bar');
  var navWrapperPlaceholder = document.getElementById('ph-nav-wrapper');
  var navSimplePlaceholder = document.getElementById('ph-nav-simple');
  if (stickyBarPlaceholder) {
    stickyBarPlaceholder.outerHTML = STICKY_BAR_HTML;
  }
  if (navWrapperPlaceholder) {
    navWrapperPlaceholder.outerHTML = NAV_WRAPPER_HTML;
  }
  if (navSimplePlaceholder) {
    navSimplePlaceholder.outerHTML = NAV_SIMPLE_HTML;
  }

  // Shared with index.html's "Page customization" panel (Pulsing dots
  // toggle) — this is the only page with the switch, but every page that
  // loads nav-header.js applies the same stored preference, so hiding dots
  // from index.html hides them everywhere (nav dots + Listing's Start now).
  if (localStorage.getItem('pulseDotsHidden') === '1') {
    document.body.classList.add('hide-pulse-dots');
  }
})();
