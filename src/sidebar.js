/**
 * NearConnect - Shared Sidebar Navigation
 * Injects a full left sidebar with all navigation items into every page.
 * Include this script in every HTML file.
 */

const NAV_ITEMS = [
  { label: 'Home',        icon: 'home',                href: '/nearconnect-home-feed.html' },
  { label: 'Community',   icon: 'groups',              href: '/nearconnect-activity-hub.html' },
  { label: 'Help / SOS',  icon: 'emergency',           href: '/nearconnect-community-help-sos.html' },
  { label: 'Chat',        icon: 'chat_bubble',         href: '/nearconnect-chat-interface.html' },
  { label: 'Events',      icon: 'event',               href: '/event-registration-step-1.html' },
  { label: 'Map',         icon: 'map',                 href: '/nearconnect-map-discovery.html' },
  { label: 'Notices',     icon: 'campaign',            href: '/nearconnect-notice-board.html' },
  { label: 'Trips',       icon: 'directions_bus',      href: '/nearconnect-trips-picnics.html' },
  { label: 'Local News',  icon: 'newspaper',           href: '/nearconnect-notice-board.html' },
  { label: 'Pinned Info', icon: 'push_pin',            href: '/nearconnect-notice-board.html' },
  {
    label: 'Game Hub',
    icon: 'sports_esports',
    href: '/nearconnect-games-hub-tournament-brackets.html',
    children: [
      { label: 'Host a Game',     icon: 'emoji_events',   href: '/host-tournament-basic-details.html' },
      { label: 'Format & Rules',  icon: 'rule',           href: '/host-tournament-format-rules.html' },
      { label: 'Entry Fee',       icon: 'payments',       href: '/host-tournament-format-rules-with-entry-fee.html' },
      { label: 'Schedule & Launch', icon: 'rocket_launch', href: '/host-tournament-schedule-launch.html' },
    ]
  },
  { label: 'Settings',    icon: 'settings',            href: '/nearconnect-settings-privacy.html' },
];

const BOTTOM_ITEMS = [
  { label: 'Profile',     icon: 'account_circle',      href: '/nearconnect-user-profile.html' },
  { label: 'Settings',    icon: 'settings',            href: '/nearconnect-settings-privacy.html' },
];

function buildSidebar() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Build sidebar nav items HTML
  function renderItems(items, isNested = false) {
    return items.map(item => {
      const isActive = currentPath === item.href.replace('/', '');
      const baseClasses = isNested
        ? `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 group ${isActive ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface ml-2'}`
        : `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium group ${isActive ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`;

      if (item.children) {
        const hasActiveChild = item.children.some(c => currentPath === c.href.replace('/', ''));
        const isParentActive = isActive || hasActiveChild;
        const showChildren = isParentActive;
        const parentClasses = `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium group ${isParentActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`;
        return `
          <li>
            <div class="${parentClasses}">
              <a href="${item.href}" style="display:flex; align-items:center; gap:12px; flex:1; text-decoration:none; color:inherit;">
                <span class="material-symbols-outlined text-xl shrink-0" style="font-variation-settings:'FILL' ${isParentActive ? 1 : 0};">${item.icon}</span>
                <span class="flex-1 text-sm font-semibold">${item.label}</span>
              </a>
              <span class="material-symbols-outlined text-base opacity-60 cursor-pointer" id="gamehub-chevron" onclick="event.stopPropagation(); document.getElementById('gamehub-children').classList.toggle('hidden')" style="padding:4px; border-radius:6px;" onmouseover="this.style.background='rgba(0,0,0,0.06)'" onmouseout="this.style.background='none'">expand_more</span>
            </div>
            <ul id="gamehub-children" class="mt-1 space-y-0.5 ${showChildren ? '' : 'hidden'}">
              ${renderItems(item.children, true)}
            </ul>
          </li>`;
      }

      return `
        <li>
          <a href="${item.href}" class="${baseClasses}">
            <span class="material-symbols-outlined ${isNested ? 'text-base' : 'text-xl'} shrink-0" style="font-variation-settings:'FILL' ${isActive ? 1 : 0};">${item.icon}</span>
            <span class="${isNested ? '' : 'text-sm font-semibold'}">${item.label}</span>
          </a>
        </li>`;
    }).join('');
  }

  const sidebarHTML = `
    <aside id="nc-sidebar" style="
      position: fixed; top: 0; left: 0; bottom: 0; width: 256px; z-index: 40;
      background: #f8f9ff; border-right: 1px solid #c7c4d7;
      display: flex; flex-direction: column; overflow: hidden;
      font-family: 'Plus Jakarta Sans', sans-serif;
      transition: transform 0.3s ease;
    ">
      <!-- Brand header -->
      <div style="padding: 20px 16px 12px; border-bottom: 1px solid #c7c4d7;">
        <a href="/nearconnect-home-feed.html" style="display:flex; align-items:center; gap:10px; text-decoration:none;">
          <span class="material-symbols-outlined" style="font-size:28px; color:#2a14b4; font-variation-settings:'FILL' 1;">hub</span>
          <span style="font-size:18px; font-weight:800; color:#2a14b4; letter-spacing:-0.02em;">NearConnect</span>
        </a>
      </div>

      <!-- Navigation links -->
      <nav style="flex:1; overflow-y:auto; padding: 12px 8px; scrollbar-width: thin; scrollbar-color: #c7c4d7 transparent;">
        <ul class="space-y-0.5" style="list-style:none; margin:0; padding:0;">
          ${renderItems(NAV_ITEMS)}
        </ul>
      </nav>

      <!-- Bottom user area -->
      <div style="padding: 12px 8px; border-top: 1px solid #c7c4d7;">
        <a href="/nearconnect-user-profile.html" style="
          display:flex; align-items:center; gap:10px; padding: 10px 12px;
          border-radius: 12px; text-decoration:none; color: #0b1c30;
          background: #eff4ff; cursor: pointer;
        " onmouseover="this.style.background='#e5eeff'" onmouseout="this.style.background='#eff4ff'">
          <span class="material-symbols-outlined" style="font-size:20px; color:#2a14b4; font-variation-settings:'FILL' 1;">account_circle</span>
          <span style="font-size:13px; font-weight:600; flex:1;">My Profile</span>
          <span class="material-symbols-outlined" style="font-size:16px; color:#777586;">chevron_right</span>
        </a>
      </div>

      <!-- Mobile close button (shown only on mobile) -->
      <button id="nc-sidebar-close" onclick="toggleMobileSidebar()" style="
        display:none; position:absolute; top:12px; right:12px;
        background: none; border:none; cursor:pointer; color:#777586;
      ">
        <span class="material-symbols-outlined">close</span>
      </button>
    </aside>

    <!-- Mobile overlay -->
    <div id="nc-sidebar-overlay" onclick="toggleMobileSidebar()" style="
      display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:39;
    "></div>

    <!-- Mobile hamburger button -->
    <button id="nc-hamburger" onclick="toggleMobileSidebar()" style="
      position:fixed; top:14px; left:14px; z-index:50; 
      background:#2a14b4; color:white; border:none; border-radius:10px;
      width:40px; height:40px; cursor:pointer;
      display:none; align-items:center; justify-content:center;
      box-shadow: 0 2px 8px rgba(42,20,180,0.3);
    ">
      <span class="material-symbols-outlined" style="font-size:20px;">menu</span>
    </button>
  `;

  // Inject sidebar into body
  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

  // Add content offset so main content doesn't hide behind sidebar
  // Find the main tag and push it
  const mainEl = document.querySelector('main, #main, .main-content, [role="main"]');
  if (mainEl) {
    mainEl.style.marginLeft = '256px';
  }

  // Also offset any fixed top header
  const headerEl = document.querySelector('header');
  if (headerEl) {
    headerEl.style.left = '256px';
    headerEl.style.width = 'calc(100% - 256px)';
  }

  // Responsive: hide sidebar on small screens
  const mobileCSS = `
    @media (max-width: 768px) {
      #nc-sidebar { transform: translateX(-100%); }
      #nc-sidebar.open { transform: translateX(0); }
      #nc-hamburger { display: flex !important; }
      #nc-sidebar-close { display: block !important; }
      main, #main, .main-content, [role="main"] { margin-left: 0 !important; }
      header { left: 0 !important; width: 100% !important; }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = mobileCSS;
  document.head.appendChild(styleEl);

  // Toggle function for mobile
  window.toggleMobileSidebar = function () {
    const sidebar = document.getElementById('nc-sidebar');
    const overlay = document.getElementById('nc-sidebar-overlay');
    sidebar.classList.toggle('open');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
  };

  // Chevron animation for Game Hub
  const gameHubChildren = document.getElementById('gamehub-children');
  const chevron = document.getElementById('gamehub-chevron');
  if (gameHubChildren && chevron) {
    new MutationObserver(() => {
      chevron.textContent = gameHubChildren.classList.contains('hidden') ? 'expand_more' : 'expand_less';
    }).observe(gameHubChildren, { attributes: true, attributeFilter: ['class'] });
  }
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildSidebar);
} else {
  buildSidebar();
}
