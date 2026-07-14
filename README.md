# Analytics Dark Mode 🌙

A lightweight Chrome extension that adds dark mode / dark theme to **Google Analytics (GA4)**.

No JavaScript overhead, no data collection, no permissions beyond GA — just pure CSS doing the work.

## Features

- 🎨 **8 Color Schemes** — Default Dark, OLED Black, Warm Sepia, Cool Nord, Soft Dark, Dracula, High Contrast, Amber Glow
- ⚡ **Zero FOUC** — CSS injected at `document_start`, no white flash on load
- 🗺️ **Map Support** — Google Maps tiles rendered properly in dark mode
- 🔄 **SPA Ready** — Works seamlessly with GA4's single-page navigation
- 🪶 **Lightweight** — ~10KB total, no JavaScript libraries, no dependencies
- 🔒 **Privacy First** — No data collection, only runs on `analytics.google.com`

## Installation

### From Chrome Web Store
*(coming soon)*

### Manual (Developer Mode)

1. Clone this repo or [download the ZIP](https://github.com/yourusername/analytics-dark-mode/archive/refs/heads/main.zip)
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the `analytics-dark-mode` folder
6. Navigate to `https://analytics.google.com/` — dark mode applies automatically

## Usage

Click the extension icon (![icon](icons/icon16.png)) in the toolbar to open the color scheme picker:

| Scheme | Preview | Filter |
|--------|---------|--------|
| **Default Dark** | Balanced dark purple | `invert(0.92) hue-rotate(180deg)` |
| **OLED Black** | Pure blacks, max contrast | `invert(1) hue-rotate(180deg)` |
| **Warm Sepia** | Cozy, easy on eyes | `invert(0.9) hue-rotate(150deg) sepia(0.15)` |
| **Cool Nord** | Arctic blue tint | `invert(0.88) hue-rotate(195deg) saturate(0.9)` |
| **Soft Dark** | Gentle, less contrast | `invert(0.85) hue-rotate(180deg)` |
| **Dracula** | Deep purple-pink shift | `invert(0.85) hue-rotate(135deg) saturate(1.3)` |
| **High Contrast** | Punchy readability | `invert(0.95) hue-rotate(180deg) contrast(1.1)` |
| **Amber Glow** | Warm amber tones | `invert(0.9) hue-rotate(135deg) sepia(0.3)` |

Your preference is saved automatically and persists across sessions.

## How It Works

The extension uses a single CSS trick — the `filter: invert()` property:

```css
html {
  filter: invert(0.92) hue-rotate(180deg);
}
```

- **`invert(0.92)`** — inverts 92% of colors (not 100%, avoiding harsh pure black/white)
- **`hue-rotate(180deg)`** — corrects the hue shift caused by inversion
- Images are double-inverted back to their original colors
- Map tiles from Google Maps are excluded from double-inversion so they render dark

This approach is:
- **Future-proof** — works regardless of how Google changes the GA4 DOM
- **Maintenance-free** — no element selectors to update when GA changes
- **Blazing fast** — GPU-accelerated CSS filter, no JavaScript overhead

## File Structure

```
analytics-dark-mode/
├── manifest.json              # Extension manifest (MV3)
├── README.md
├── src/
│   ├── analytics.css          # Core dark mode CSS (filter invert)
│   └── content.js             # Theme loading & live switching
├── popup/
│   ├── popup.html             # Color scheme picker UI
│   ├── popup.css              # Popup styles
│   └── popup.js               # Theme selection logic
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Permissions

| Permission | Reason |
|------------|--------|
| `https://analytics.google.com/*` | Inject dark mode CSS only on GA pages |
| `storage` | Save your selected color scheme preference |

That's it. **No data collection, no tracking, no external requests.**

## Development

```bash
git clone https://github.com/yourusername/analytics-dark-mode.git
cd analytics-dark-mode
```

Then load the folder as an unpacked extension in Chrome (see [Manual Installation](#manual-developer-mode)).

### Adding a New Color Scheme

Edit `popup/popup.js` and `src/content.js`:

```js
// In popup.js — add to THEMES array
{
  id: 'my-theme',
  name: 'My Theme',
  desc: 'Description',
  filter: 'invert(0.9) hue-rotate(180deg) sepia(0.1)',
  colors: ['#color1', '#color2', '#color3', '#color4', '#color5']
}

// In content.js — add to THEMES object
'my-theme': 'invert(0.9) hue-rotate(180deg) sepia(0.1)'
```

## Credits

Inspired by the [Analytics dark mode](https://chromewebstore.google.com/detail/analytics-dark-mode/lpfbehkefagkloemkmkgmomoaoilkkln) extension by Markus Bjerre.

Built with:
- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/)
- CSS `filter` property
- Pure vanilla JavaScript

## License

MIT
