import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pages that should NOT have the sidebar (login, landing, onboarding)
const EXCLUDE = ['index.html', 'login.html', 'nearconnect-onboarding-flow.html'];

const sidebarTag = `  <!-- SHARED SIDEBAR -->\n  <script type="module" src="src/sidebar.js"></script>\n`;

const htmlFiles = globSync('*.html').filter(f => !EXCLUDE.includes(f));
let count = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already injected
  if (content.includes('src/sidebar.js')) {
    console.log(`⏭  Already has sidebar: ${file}`);
    return;
  }

  // Remove existing sidebar nav if present (the inline ones from stitch)
  // Remove the old narrow side nav (only the SideNavBar comment-marked one)
  content = content.replace(/<!-- SideNavBar -->[\s\S]*?<\/nav>/g, '<!-- sidebar injected by sidebar.js -->');

  // Inject sidebar script just before </body>
  content = content.replace('</body>', `${sidebarTag}</body>`);

  // Fix the main content padding so it offsets the 256px sidebar
  // Replace md:pl-64 class if present (old sidebar width)
  content = content.replace(/\bmd:pl-64\b/g, 'pl-0');

  fs.writeFileSync(filePath, content);
  console.log(`✅ Injected sidebar into: ${file}`);
  count++;
});

console.log(`\nDone. Updated ${count} files.`);
