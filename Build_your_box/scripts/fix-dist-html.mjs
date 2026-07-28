// Vite's HTML injection always tags the entry script as type="module"
// crossorigin, regardless of vite.config.ts's rollupOptions.output.format.
// We build to a classic IIFE bundle (see vite.config.ts) specifically so
// dist/index.html works when opened via file://, since Chrome refuses
// module scripts over file:// as a cross-origin request. A module-tagged
// <script> pointing at non-module (IIFE) JS would just fail differently, so
// this strips the tag down to a plain classic <script src="...">.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const distIndex = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'index.html')
const html = readFileSync(distIndex, 'utf8')
const fixed = html.replace(
  /<script type="module" crossorigin src="([^"]+)"><\/script>/,
  // defer matters here: unlike a module script (deferred by default), a
  // classic script in <head> runs immediately, before <div id="root"> in
  // <body> exists, so ReactDOM.createRoot(null) throws (minified error #299).
  '<script defer src="$1"></script>'
)

if (fixed === html) {
  throw new Error('fix-dist-html: expected pattern not found in dist/index.html — did the Vite HTML output change?')
}

writeFileSync(distIndex, fixed)
