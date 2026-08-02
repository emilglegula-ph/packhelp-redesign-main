// Postbuild fixes applied to dist/index.html on every `npm run build`, since
// Vite regenerates that file from scratch each time — anything needed in the
// deployed output has to be injected here, not hand-edited into dist/.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const distIndex = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'index.html')
const html = readFileSync(distIndex, 'utf8')

// 1) Vite's HTML injection always tags the entry script as type="module"
// crossorigin, regardless of vite.config.ts's rollupOptions.output.format.
// We build to a classic IIFE bundle (see vite.config.ts) specifically so
// dist/index.html works when opened via file://, since Chrome refuses
// module scripts over file:// as a cross-origin request. A module-tagged
// <script> pointing at non-module (IIFE) JS would just fail differently, so
// this strips the tag down to a plain classic <script src="...">.
let fixed = html.replace(
  /<script type="module" crossorigin src="([^"]+)"><\/script>/,
  // defer matters here: unlike a module script (deferred by default), a
  // classic script in <head> runs immediately, before <div id="root"> in
  // <body> exists, so ReactDOM.createRoot(null) throws (minified error #299).
  '<script defer src="$1"></script>'
)

if (fixed === html) {
  throw new Error('fix-dist-html: expected script-tag pattern not found in dist/index.html — did the Vite HTML output change?')
}

// 2) Same password gate as the root index.html (password: shipbox42),
// reusing its exact sessionStorage key ("phGateOk") so unlocking it there
// also unlocks this page for the rest of the browser tab's session — only
// someone opening Build_your_box/dist/ directly, without having gone
// through index.html first, actually sees the prompt. Self-contained (no
// tokens.css/components.css here), so colors/spacing are hardcoded to match
// rather than referencing shared CSS vars this bundle doesn't load.
const GATE_STYLE = `
<style>
  .password-gate {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .password-gate-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    max-width: 320px;
    width: 100%;
    padding: 32px;
    text-align: center;
    box-sizing: border-box;
  }
  .password-gate-title {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.16;
    letter-spacing: -0.02em;
    font-weight: 500;
    color: #00061A;
  }
  .password-gate-input {
    width: 100%;
    height: 48px;
    padding: 0 16px;
    border-radius: 8px;
    border: 1px solid #E7E7E7;
    font-size: 0.9375rem;
    line-height: 1;
    letter-spacing: -0.02em;
    font-family: inherit;
    box-sizing: border-box;
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  .password-gate-input:hover { border-color: #CFCFCF; }
  .password-gate-input:focus {
    outline: none;
    border-color: #2757FF;
    box-shadow: 0 0 0 3px rgba(39, 87, 255, .16);
  }
  .password-gate-submit {
    display: flex;
    width: fit-content;
    height: 48px;
    padding: 0 24px;
    justify-content: center;
    align-items: center;
    font-size: 0.9375rem;
    line-height: 1;
    letter-spacing: -0.02em;
    font-family: inherit;
    background: #2757FF;
    color: #FFFFFF;
    border: none;
    border-radius: 999px;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color .15s ease;
  }
  .password-gate-submit:hover { background: #0B38D5; }
  .password-gate-error {
    margin: 0;
    color: #8A140C;
    font-size: 0.8125rem;
    line-height: 1.32;
    letter-spacing: -0.02em;
  }
</style>`

const GATE_HTML = `
<div id="passwordGate" class="password-gate">
  <form id="passwordGateForm" class="password-gate-form">
    <p class="password-gate-title">This preview is password protected</p>
    <input type="password" id="passwordGateInput" class="password-gate-input" placeholder="Enter password" autocomplete="off">
    <button type="submit" class="password-gate-submit">Enter</button>
    <p class="password-gate-error" id="passwordGateError" style="display:none;">Incorrect password, try again.</p>
  </form>
</div>`

const GATE_SCRIPT = `
<script>
  (function () {
    var CORRECT_PASSWORD = 'shipbox42';
    var gate = document.getElementById('passwordGate');
    var content = document.getElementById('root');
    var form = document.getElementById('passwordGateForm');
    var input = document.getElementById('passwordGateInput');
    var error = document.getElementById('passwordGateError');

    function unlock() {
      gate.style.display = 'none';
      content.style.display = '';
    }

    if (sessionStorage.getItem('phGateOk') === '1') {
      unlock();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (input.value === CORRECT_PASSWORD) {
        sessionStorage.setItem('phGateOk', '1');
        unlock();
      } else {
        error.style.display = 'block';
        input.value = '';
        input.focus();
      }
    });
  })();
</script>`

const beforeGate = fixed
fixed = fixed.replace('</head>', `${GATE_STYLE}\n</head>`)
fixed = fixed.replace(
  '<div id="root"></div>',
  `${GATE_HTML}\n    <div id="root" style="display:none;"></div>${GATE_SCRIPT}`
)

if (fixed === beforeGate) {
  throw new Error('fix-dist-html: expected </head> or <div id="root"></div> not found in dist/index.html — did the Vite HTML output change?')
}

writeFileSync(distIndex, fixed)
