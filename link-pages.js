import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlFiles = globSync('*.html');

// Helper to replace links/buttons based on innerText or nearby text
function updateLinks(content, filename) {
  let newContent = content;

  const mapping = [
    { regex: /href="[^"]*"(?=[^>]*>[\s\S]*?(?:Home|Feed)<\/)/gi, replacement: 'href="nearconnect-home-feed.html"' },
    { regex: /href="[^"]*"(?=[^>]*>[\s\S]*?(?:Map|Discover|Explore)<\/)/gi, replacement: 'href="nearconnect-map-discovery.html"' },
    { regex: /href="[^"]*"(?=[^>]*>[\s\S]*?(?:Activity|Hub|Activities)<\/)/gi, replacement: 'href="nearconnect-activity-hub.html"' },
    { regex: /href="[^"]*"(?=[^>]*>[\s\S]*?(?:Chat|Messages)<\/)/gi, replacement: 'href="nearconnect-chat-interface.html"' },
    { regex: /href="[^"]*"(?=[^>]*>[\s\S]*?(?:Profile|Account)<\/)/gi, replacement: 'href="nearconnect-user-profile.html"' },
    { regex: /href="[^"]*"(?=[^>]*>[\s\S]*?(?:Settings|Privacy)<\/)/gi, replacement: 'href="nearconnect-settings-privacy.html"' },
    { regex: /href="[^"]*"(?=[^>]*>[\s\S]*?(?:Notice|Board|Notices)<\/)/gi, replacement: 'href="nearconnect-notice-board.html"' },
    { regex: /href="[^"]*"(?=[^>]*>[\s\S]*?(?:Trips|Picnics)<\/)/gi, replacement: 'href="nearconnect-trips-picnics.html"' },
    { regex: /href="[^"]*"(?=[^>]*>[\s\S]*?(?:Games|Tournament)<\/)/gi, replacement: 'href="nearconnect-games-hub-tournament-brackets.html"' },
    { regex: /href="[^"]*"(?=[^>]*>[\s\S]*?(?:SOS|Help)<\/)/gi, replacement: 'href="nearconnect-community-help-sos.html"' }
  ];

  // Specific flows
  if (filename === 'index.html') {
    newContent = newContent.replace(/href="[^"]*"(?=[^>]*>[\s\S]*?(?:Sign In|Join|Get Started)<\/a>)/gi, 'href="nearconnect-onboarding-flow.html"');
    newContent = newContent.replace(/<button([^>]*)>([\s\S]*?(?:Sign In|Join|Get Started)[\s\S]*?)<\/button>/gi, '<button$1 onclick="window.location.href=\'/nearconnect-onboarding-flow.html\'">$2</button>');
  }

  if (filename === 'nearconnect-onboarding-flow.html') {
    newContent = newContent.replace(/<button([^>]*)>([\s\S]*?(?:Complete|Finish|Get Started)[\s\S]*?)<\/button>/gi, '<button$1 onclick="window.location.href=\'/nearconnect-home-feed.html\'">$2</button>');
  }

  if (filename === 'event-registration-step-1.html') {
    newContent = newContent.replace(/<button([^>]*)>([\s\S]*?(?:Next|Continue)[\s\S]*?)<\/button>/gi, '<button$1 onclick="window.location.href=\'/event-registration-step-2.html\'">$2</button>');
  }
  
  if (filename === 'event-registration-step-2.html') {
    newContent = newContent.replace(/<button([^>]*)>([\s\S]*?(?:Confirm|Register|Submit)[\s\S]*?)<\/button>/gi, '<button$1 onclick="window.location.href=\'/event-registration-confirmation.html\'">$2</button>');
  }

  if (filename === 'event-registration-confirmation.html') {
    newContent = newContent.replace(/<button([^>]*)>([\s\S]*?(?:Done|Back to Home|Home)[\s\S]*?)<\/button>/gi, '<button$1 onclick="window.location.href=\'/nearconnect-home-feed.html\'">$2</button>');
  }

  if (filename === 'host-tournament-basic-details.html') {
    newContent = newContent.replace(/<button([^>]*)>([\s\S]*?(?:Next|Continue)[\s\S]*?)<\/button>/gi, '<button$1 onclick="window.location.href=\'/host-tournament-format-rules.html\'">$2</button>');
  }

  if (filename === 'host-tournament-format-rules.html') {
    newContent = newContent.replace(/<button([^>]*)>([\s\S]*?(?:Next|Continue)[\s\S]*?)<\/button>/gi, '<button$1 onclick="window.location.href=\'/host-tournament-format-rules-with-entry-fee.html\'">$2</button>');
  }

  if (filename === 'host-tournament-format-rules-with-entry-fee.html') {
    newContent = newContent.replace(/<button([^>]*)>([\s\S]*?(?:Next|Continue)[\s\S]*?)<\/button>/gi, '<button$1 onclick="window.location.href=\'/host-tournament-schedule-launch.html\'">$2</button>');
  }
  
  if (filename === 'host-tournament-schedule-launch.html') {
    newContent = newContent.replace(/<button([^>]*)>([\s\S]*?(?:Launch|Publish|Create)[\s\S]*?)<\/button>/gi, '<button$1 onclick="window.location.href=\'/nearconnect-games-hub-tournament-brackets.html\'">$2</button>');
  }

  // Global mapping for typical anchor tags
  mapping.forEach(m => {
    newContent = newContent.replace(m.regex, (match) => {
        // Only replace if it currently points to "#" or is empty to avoid overwriting valid links if run multiple times
        if (match.includes('href="#"') || match.includes('href=""')) {
            return m.replacement;
        }
        return match;
    });
  });

  // Action Buttons globally
  // Enroll / Join / Register -> event-registration-step-1.html
  newContent = newContent.replace(/<button([^>]*(?!onclick)[^>]*)>([\s\S]*?(?:Enroll|Join|Register)[\s\S]*?)<\/button>/gi, '<button$1 onclick="window.location.href=\'/event-registration-step-1.html\'">$2</button>');
  
  // Host a Game / Create Event / Create Squad / Create Activity -> host-tournament-basic-details.html
  newContent = newContent.replace(/<button([^>]*(?!onclick)[^>]*)>([\s\S]*?(?:Host a Game|Create Event|Create Squad|Create Activity)[\s\S]*?)<\/button>/gi, '<button$1 onclick="window.location.href=\'/host-tournament-basic-details.html\'">$2</button>');

  // Profile Picture Link (Top right profile picture)
  // We'll wrap the user profile img tag with a clickable wrapper if it isn't already inside an anchor.
  // Many are inside a div, so we'll add onclick to the img itself.
  newContent = newContent.replace(/<img([^>]*alt="User profile[^"]*"[^>]*)>/gi, '<img$1 onclick="window.location.href=\'/nearconnect-user-profile.html\'" style="cursor: pointer;">');

  return newContent;
}

let modifiedCount = 0;
htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const original = content;
  content = updateLinks(content, file);
  
  if (original !== content) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated links in ${file}`);
    modifiedCount++;
  }
});

console.log(`Finished updating. Modified ${modifiedCount} files.`);
