import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlFiles = globSync('*.html');

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // We will match <a> tags and replace their href based on their inner text
  // Using a regex that captures the whole <a> tag up to </a>
  const aTagRegex = /<a\s+([^>]*href="[^"]*"[^>]*)>([\s\S]*?)<\/a>/gi;

  content = content.replace(aTagRegex, (match, attrs, innerHTML) => {
    let newHref = null;
    const text = innerHTML.toLowerCase();
    
    if (text.includes('chat') || text.includes('messages')) {
      newHref = '/nearconnect-chat-interface.html';
    } else if (text.includes('community') || text.includes('activities')) {
      newHref = '/nearconnect-activity-hub.html';
    } else if (text.includes('help') || text.includes('sos')) {
      newHref = '/nearconnect-community-help-sos.html';
    } else if (text.includes('home') || text.includes('feed')) {
      newHref = '/nearconnect-home-feed.html';
    } else if (text.includes('map') || text.includes('discover')) {
      newHref = '/nearconnect-map-discovery.html';
    } else if (text.includes('profile')) {
      newHref = '/nearconnect-user-profile.html';
    } else if (text.includes('games hub') || text.includes('tournament')) {
      newHref = '/nearconnect-games-hub-tournament-brackets.html';
    }

    if (newHref) {
      // replace the href attribute
      const updatedAttrs = attrs.replace(/href="[^"]*"/, `href="${newHref}"`);
      return `<a ${updatedAttrs}>${innerHTML}</a>`;
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed nav in ${file}`);
  }
});
