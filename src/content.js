/**
 * Analytics Dark Mode — Content Script
 * 
 * Applies user's chosen color scheme on page load and handles
 * live theme updates from the popup.
 * 
 * Runs at document_idle alongside the static analytics.css.
 */

(function () {
  'use strict';

  // ----- Theme Definitions (mirrors popup.js) -----
  var THEMES = {
    'default-dark':  'invert(0.92) hue-rotate(180deg)',
    'oled-black':    'invert(1) hue-rotate(180deg)',
    'warm-sepia':    'invert(0.9) hue-rotate(150deg) sepia(0.15)',
    'cool-nord':     'invert(0.88) hue-rotate(195deg) saturate(0.9)',
    'soft-dark':     'invert(0.85) hue-rotate(180deg)',
    'dracula':       'invert(0.85) hue-rotate(135deg) saturate(1.3)',
    'high-contrast': 'invert(0.95) hue-rotate(180deg) contrast(1.1)',
    'amber':         'invert(0.9) hue-rotate(135deg) sepia(0.3)'
  };

  // Default fallback
  var DEFAULT_FILTER = 'invert(0.92) hue-rotate(180deg)';

  /**
   * Apply a theme filter to the page
   */
  function setThemeFilter(filterValue) {
    var html = document.documentElement;
    // Remove any previous dynamic style override
    var existing = document.getElementById('adm-theme-style');
    if (existing) {
      existing.remove();
    }

    // Create a style tag that overrides the CSS filter with !important
    var style = document.createElement('style');
    style.id = 'adm-theme-style';
    style.textContent = 'html {' +
      '  filter: ' + filterValue + ' !important;' +
      '  background-color: #111 !important;' +
      '}';
    document.head.appendChild(style);
  }

  /**
   * Apply a saved theme from chrome.storage
   */
  function applySavedTheme() {
    try {
      chrome.storage.sync.get('analyticsDarkModeTheme', function (data) {
        var themeId = data.analyticsDarkModeTheme;
        var filter = THEMES[themeId] || DEFAULT_FILTER;
        setThemeFilter(filter);
      });
    } catch (e) {
      // chrome.storage not available (shouldn't happen, but be safe)
      setThemeFilter(DEFAULT_FILTER);
    }
  }

  // ----- Apply on page load -----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySavedTheme);
  } else {
    applySavedTheme();
  }

  // Also re-apply after full load in case of race conditions
  window.addEventListener('load', function () {
    applySavedTheme();
  });

  // ----- Listen for live theme updates from popup -----
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === 'UPDATE_THEME') {
      var filter = THEMES[message.themeId] || message.filter || DEFAULT_FILTER;
      setThemeFilter(filter);
      sendResponse({ success: true });
    }
  });

})();
