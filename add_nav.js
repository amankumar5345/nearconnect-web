import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlFiles = globSync('*.html');

const navHtml = `
<!-- DEV NAVIGATION OVERLAY -->
<div id="dev-nav" style="position: fixed; bottom: 20px; right: 20px; z-index: 99999; font-family: sans-serif;">
  <button onclick="document.getElementById('dev-menu').style.display = document.getElementById('dev-menu').style.display === 'none' ? 'block' : 'none'" style="background: #4338ca; color: white; border: none; padding: 12px 24px; border-radius: 99px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
    Dev Menu 🛠️
  </button>
  <div id="dev-menu" style="display: none; position: absolute; bottom: 60px; right: 0; background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); width: 300px; max-height: 400px; overflow-y: auto;">
    <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 16px; color: #111827;">All Pages</h3>
    <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
      ${htmlFiles.map(file => `
        <li>
          <a href="/${file}" style="color: #4338ca; text-decoration: none; font-size: 14px; display: block; padding: 4px 8px; border-radius: 4px; hover:background: #f3f4f6;">
            ${file}
          </a>
        </li>
      `).join('')}
    </ul>
  </div>
</div>
<!-- /DEV NAVIGATION OVERLAY -->
</body>
`;

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Only add if not already present
  if (!content.includes('DEV NAVIGATION OVERLAY')) {
    content = content.replace('</body>', navHtml);
    fs.writeFileSync(filePath, content);
    console.log(`Added dev nav to ${file}`);
  }
});
