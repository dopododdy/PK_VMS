/**
 * ui-settings.js
 * PK-VMS Shared UI Settings Manager
 *
 * Load this script early in <head> of every page.
 * It reads font family, font size, and accent color from localStorage
 * and applies them consistently across the whole application.
 */
(function () {
    'use strict';

    var FONT_KEY   = 'ui-font-family';
    var SIZE_KEY   = 'preferred-font-size';
    var COLOR_KEY  = 'ui-accent-color';

    var DEFAULTS = {
        fontFamily:  'Sarabun',
        fontSize:    '14',
        accentColor: '#14b8b1'
    };

    var MIN_FONT_SIZE = 12;
    var MAX_FONT_SIZE = 24;

    var AVAILABLE_FONTS = {
        'Sarabun': 'Sarabun:wght@300;400;500;600;700;800',
        'Kanit':   'Kanit:wght@300;400;500;600;700',
        'Prompt':  'Prompt:wght@300;400;500;600;700'
    };

    // ── Read saved values ──────────────────────────────────────────────────────
    var fontFamily  = localStorage.getItem(FONT_KEY)  || DEFAULTS.fontFamily;
    var fontSize    = localStorage.getItem(SIZE_KEY)  || DEFAULTS.fontSize;
    var accentColor = localStorage.getItem(COLOR_KEY) || DEFAULTS.accentColor;

    // Validate font family
    if (!AVAILABLE_FONTS[fontFamily]) fontFamily = DEFAULTS.fontFamily;
    // Validate font size (allow MIN_FONT_SIZE–MAX_FONT_SIZE px)
    var sizeNum = parseInt(fontSize, 10);
    if (isNaN(sizeNum) || sizeNum < MIN_FONT_SIZE || sizeNum > MAX_FONT_SIZE) {
        sizeNum = parseInt(DEFAULTS.fontSize, 10);
    }
    fontSize = String(sizeNum);

    // ── Apply immediately (before page CSS) ───────────────────────────────────
    var root = document.documentElement;
    root.style.setProperty('--base-font-size', fontSize + 'px');
    root.style.setProperty('--teal', accentColor);
    root.style.setProperty('--teal-accent', accentColor);
    root.style.fontSize = fontSize + 'px';

    // Ensure the chosen font is loaded
    if (!document.querySelector('link[data-ui-font]')) {
        var fontParam = AVAILABLE_FONTS[fontFamily] || AVAILABLE_FONTS['Sarabun'];
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.setAttribute('data-ui-font', fontFamily);
        link.href = 'https://fonts.googleapis.com/css2?family=' + fontParam + '&display=swap';
        document.head.appendChild(link);
    }

    // ── Apply font-family override ─────────────────────────────────────────────
    // We intentionally use `*` with `!important` here so that this later-appended
    // <style> tag wins over each page's own `* { font-family: "Sarabun" !important }`
    // rule, because later rules in DOM order win among equal-specificity !important rules.
    function applyFontOverride() {
        var style = document.getElementById('ui-font-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'ui-font-style';
            document.head.appendChild(style);
        }
        style.textContent = '* { font-family: "' + fontFamily + '", sans-serif !important; }';
        // Re-apply CSS variables in case page styles reset them
        root.style.setProperty('--base-font-size', fontSize + 'px');
        root.style.setProperty('--teal', accentColor);
        root.style.setProperty('--teal-accent', accentColor);
        root.style.fontSize = fontSize + 'px';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyFontOverride);
    } else {
        applyFontOverride();
    }

    // ── Public API ─────────────────────────────────────────────────────────────
    window.UISettings = {
        getFontFamily:  function () { return fontFamily; },
        getFontSize:    function () { return parseInt(fontSize, 10); },
        getAccentColor: function () { return accentColor; },
        getAvailableFonts: function () { return Object.keys(AVAILABLE_FONTS); },

        setFontFamily: function (val) {
            if (!AVAILABLE_FONTS[val]) return;
            fontFamily = val;
            localStorage.setItem(FONT_KEY, val);
            // Update font link
            var existing = document.querySelector('link[data-ui-font]');
            var fontParam = AVAILABLE_FONTS[val];
            var newHref = 'https://fonts.googleapis.com/css2?family=' + fontParam + '&display=swap';
            if (existing) {
                existing.href = newHref;
                existing.setAttribute('data-ui-font', val);
            } else {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.setAttribute('data-ui-font', val);
                link.href = newHref;
                document.head.appendChild(link);
            }
            applyFontOverride();
        },

        setFontSize: function (val) {
            var n = parseInt(val, 10);
            if (isNaN(n) || n < MIN_FONT_SIZE || n > MAX_FONT_SIZE) return;
            fontSize = String(n);
            localStorage.setItem(SIZE_KEY, fontSize);
            root.style.fontSize = n + 'px';
            root.style.setProperty('--base-font-size', n + 'px');
        },

        setAccentColor: function (val) {
            accentColor = val;
            localStorage.setItem(COLOR_KEY, val);
            root.style.setProperty('--teal', val);
            root.style.setProperty('--teal-accent', val);
        }
    };
})();
