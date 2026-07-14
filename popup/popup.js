/**
 * Analytics Dark Mode — Popup Script
 * Handles theme selection and communication with content script
 */

// ----- Color Scheme Definitions -----
const THEMES = [
  {
    id: 'default-dark',
    name: 'Default Dark',
    desc: 'Balanced dark purple',
    filter: 'invert(0.92) hue-rotate(180deg)',
    colors: ['#6b6bf0', '#8b8bf8', '#5a5ad0', '#7c7cf0', '#6b6bf0']
  },
  {
    id: 'oled-black',
    name: 'OLED Black',
    desc: 'Pure blacks, max contrast',
    filter: 'invert(1) hue-rotate(180deg)',
    colors: ['#ffffff', '#aaaaaa', '#dddddd', '#bbbbbb', '#999999']
  },
  {
    id: 'warm-sepia',
    name: 'Warm Sepia',
    desc: 'Cozy, easy on eyes',
    filter: 'invert(0.9) hue-rotate(150deg) sepia(0.15)',
    colors: ['#d4a76a', '#c49a5c', '#b88d4e', '#dbaa7a', '#c89a62']
  },
  {
    id: 'cool-nord',
    name: 'Cool Nord',
    desc: 'Arctic blue tint',
    filter: 'invert(0.88) hue-rotate(195deg) saturate(0.9)',
    colors: ['#81a1c1', '#88c0d0', '#5e81ac', '#8fbcbb', '#6ba0c0']
  },
  {
    id: 'soft-dark',
    name: 'Soft Dark',
    desc: 'Gentle, less contrast',
    filter: 'invert(0.85) hue-rotate(180deg)',
    colors: ['#7a7ad0', '#8a8ae0', '#6a6ac0', '#8585d8', '#7e7ed4']
  },
  {
    id: 'dracula',
    name: 'Dracula',
    desc: 'Deep purple-pink shift',
    filter: 'invert(0.85) hue-rotate(135deg) saturate(1.3)',
    colors: ['#ff79c6', '#bd93f9', '#44475a', '#f1fa8c', '#8be9fd']
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    desc: 'Punchy readability',
    filter: 'invert(0.95) hue-rotate(180deg) contrast(1.1)',
    colors: ['#ffffff', '#cccccc', '#eeeeee', '#dddddd', '#bbbbbb']
  },
  {
    id: 'amber',
    name: 'Amber Glow',
    desc: 'Warm amber tones',
    filter: 'invert(0.9) hue-rotate(135deg) sepia(0.3)',
    colors: ['#ffb74d', '#ff9800', '#ffa726', '#ffcc80', '#ff8a65']
  }
];

// ----- Render Theme Cards -----
const grid = document.getElementById('themeGrid');

THEMES.forEach(function (theme) {
  const card = document.createElement('div');
  card.className = 'theme-card';
  card.dataset.themeId = theme.id;

  // Preview box
  const preview = document.createElement('div');
  preview.className = 'preview-box';

  // Preview bars with theme colors — use the filter as a preview
  theme.colors.forEach(function (color) {
    const bar = document.createElement('div');
    bar.className = 'preview-bar';
    bar.style.backgroundColor = color;
    preview.appendChild(bar);
  });

  // Theme name
  const nameEl = document.createElement('div');
  nameEl.className = 'theme-name';
  nameEl.textContent = theme.name;

  // Theme description
  const descEl = document.createElement('div');
  descEl.className = 'theme-desc';
  descEl.textContent = theme.desc;

  card.appendChild(preview);
  card.appendChild(nameEl);
  card.appendChild(descEl);

  // Click handler
  card.addEventListener('click', function () {
    applyTheme(theme.id);
  });

  grid.appendChild(card);
});

// ----- Apply Theme -----
function applyTheme(themeId) {
  const theme = THEMES.find(function (t) { return t.id === themeId; });
  if (!theme) return;

  // Save to storage
  chrome.storage.sync.set({ analyticsDarkModeTheme: themeId }, function () {
    // Update active state in UI
    document.querySelectorAll('.theme-card').forEach(function (c) {
      c.classList.toggle('active', c.dataset.themeId === themeId);
    });

    // Send message to all active GA tabs to update live
    chrome.tabs.query({ url: 'https://analytics.google.com/*' }, function (tabs) {
      tabs.forEach(function (tab) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'UPDATE_THEME',
          themeId: themeId,
          filter: theme.filter
        }).catch(function () {
          // Tab may not have content script loaded yet — that's ok
        });
      });
    });
  });
}

// ----- Load Saved Preference -----
chrome.storage.sync.get('analyticsDarkModeTheme', function (data) {
  const savedId = data.analyticsDarkModeTheme;
  if (savedId) {
    const card = document.querySelector('[data-theme-id="' + savedId + '"]');
    if (card) card.classList.add('active');
  } else {
    // Default to first theme
    const first = document.querySelector('.theme-card');
    if (first) first.classList.add('active');
  }
});
