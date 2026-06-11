import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function downloadScreens() {
    try {
        const screensData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '.gemini', 'antigravity-ide', 'brain', '0f59f10a-96de-41ca-81e1-c22517a34bed', '.system_generated', 'steps', '15', 'output.txt'), 'utf8'));
        
        for (const screen of screensData.screens) {
            if (!screen.htmlCode || !screen.htmlCode.downloadUrl || screen.htmlCode.mimeType !== 'text/html') {
                console.log(`Skipping ${screen.title} (no HTML url)`);
                continue;
            }
            
            console.log(`Downloading ${screen.title}...`);
            const response = await fetch(screen.htmlCode.downloadUrl);
            const html = await response.text();
            
            // Format filename
            const filename = screen.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '') + '.html';
            
            fs.writeFileSync(path.join(__dirname, filename), html);
            console.log(`Saved to ${filename}`);
        }
        console.log('All screens downloaded.');
    } catch (err) {
        console.error('Error downloading screens:', err);
    }
}

downloadScreens();
