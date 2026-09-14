const fs = require('fs');
const path = require('path');

const CSS_DIR = path.join(__dirname, 'css');
const BUNDLE_FILE = path.join(CSS_DIR, 'bundle.css');

// Modular files in strict load/cascade order
const CSS_FILES = [
  'base.css',
  'loader.css',
  'nav-hero.css',
  'about.css',
  'achievements.css',
  'connect.css',
  'responsive.css',
  'projects.css',
  'footer.css',
  'cursor.css',
  'terminal.css'
];

function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([\{\}\:\;\,])\s*/g, '$1')
    .replace(/\;(?=\})/g, '')
    .trim();
}

function buildBundle() {
  const startTime = Date.now();
  try {
    const parts = CSS_FILES.map(file => {
      const filePath = path.join(CSS_DIR, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`[WARN] Missing file: ${file}`);
        return '';
      }
      return fs.readFileSync(filePath, 'utf8');
    });

    const concatenated = parts.filter(Boolean).join('\n');
    const minified = minifyCSS(concatenated);
    fs.writeFileSync(BUNDLE_FILE, minified, 'utf8');
    const elapsed = Date.now() - startTime;
    const sizeKB = (Buffer.byteLength(minified, 'utf8') / 1024).toFixed(1);
    console.log(`[${new Date().toLocaleTimeString()}] \x1b[32m✔ bundle.css built (minified, ${sizeKB} KB) in ${elapsed}ms\x1b[0m`);
  } catch (err) {
    console.error(`\x1b[31m[ERROR] Failed to build bundle:\x1b[0m`, err);
  }
}

// Initial build
buildBundle();

// Watch mode
if (process.argv.includes('--watch') || process.argv.includes('-w')) {
  console.log('\x1b[36m[WATCH] Watching css/ folder for changes...\x1b[0m');
  let debounceTimeout = null;

  fs.watch(CSS_DIR, (eventType, filename) => {
    // Ignore bundle.css or non-css files to prevent infinite loop
    if (!filename || filename === 'bundle.css' || !filename.endsWith('.css')) return;

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      console.log(`\x1b[33m[CHANGE] Detected edit in css/${filename}\x1b[0m`);
      buildBundle();
    }, 100);
  });
}
