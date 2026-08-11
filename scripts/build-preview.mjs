/* Builds a single self-contained preview.html from src/index.html:
   inlines the compiled CSS, app.js, and the portrait images (as data URIs)
   so the file renders anywhere with no server, build step or asset folder.
   Run:  node scripts/build-preview.mjs   (after the tailwind build) */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
let html = readFileSync(root + 'src/index.html', 'utf8');
const css = readFileSync(root + 'dist/css/main.css', 'utf8');
const js  = readFileSync(root + 'src/js/app.js', 'utf8');

html = html.replace(/<link rel="stylesheet" href="\.\/css\/main\.css" \/>/, '<style>\n' + css + '\n</style>');
html = html.replace(/<script src="\.\/js\/app\.js"><\/script>/, '<script>\n' + js + '\n</script>');

// Inline all ./assets/img images (portraits + nested logos) as data URIs
html = html.replace(/src="\.\/assets\/img\/([a-z0-9/_-]+\.(webp|png|jpe?g|svg))"/gi, (m, file, ext) => {
  const p = root + 'src/assets/img/' + file;
  if (!existsSync(p)) return m;
  const e = ext.toLowerCase();
  const mime = e === 'svg' ? 'image/svg+xml' : e.startsWith('jp') ? 'image/jpeg' : 'image/' + e;
  const b64 = readFileSync(p).toString('base64');
  return 'src="data:' + mime + ';base64,' + b64 + '"';
});

// Inline favicon assets (svg + png) as data URIs so the single-file build keeps its icon.
html = html.replace(/href="\.\/assets\/favicon\/([a-z0-9._-]+\.(svg|png))"/gi, (m, file, ext) => {
  const p = root + 'src/assets/favicon/' + file;
  if (!existsSync(p)) return m;
  if (ext.toLowerCase() === 'svg')
    return 'href="data:image/svg+xml;utf8,' + encodeURIComponent(readFileSync(p, 'utf8')) + '"';
  return 'href="data:image/png;base64,' + readFileSync(p).toString('base64') + '"';
});
html = html.replace('<head>', '<head>\n<!-- SELF-CONTAINED PREVIEW · generated from src/ by scripts/build-preview.mjs · do not hand-edit -->');

writeFileSync(root + 'preview.html', html);
// Keep the GitHub Pages entry (root index.html) identical to the self-contained build.
writeFileSync(root + 'index.html', html);
console.log('preview.html + index.html built:', html.length, 'bytes');
