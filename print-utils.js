/**
 * print-utils.js – PK-VMS Silent Print Utility
 *
 * Provides automatic, dialog-free printing to configured printers via QZ Tray.
 * Falls back to standard browser print() if QZ Tray is unavailable or
 * no printer is configured for the template type.
 *
 * Usage (in any page that includes this script after supabase-config.js):
 *   await PrintUtils.executePrint(htmlContent, pageWidthMm, pageHeightMm, templateType);
 *   await PrintUtils.executeWindowPrint(htmlContent, pageWidthMm, pageHeightMm, templateType);
 */
(function () {
    'use strict';

    var CACHE_KEY          = 'pk_printer_settings_cache';
    var CACHE_TTL          = 5 * 60 * 1000; // 5 minutes
    var QZ_CDN             = 'https://cdn.qz.io/qz-tray/qz-tray.js';
    var QZ_RETRY_DELAY_SEC = 0.5; // seconds to wait between QZ Tray reconnect retries
    var AGENT_URL          = 'http://127.0.0.1:8080'; // local VASD agent (no QZ Tray needed)

    var _settingsCache = null;
    var _qzConnected   = false;
    var _qzConnecting  = false;

    // ── QZ Tray ──────────────────────────────────────────────────────────────

    function _loadQZScript() {
        return new Promise(function (resolve) {
            if (typeof qz !== 'undefined') { resolve(true); return; }
            var s = document.createElement('script');
            s.src     = QZ_CDN;
            s.onload  = function () { resolve(true); };
            s.onerror = function () { resolve(false); };
            document.head.appendChild(s);
        });
    }

    async function _connectQZ() {
        if (_qzConnected) return true;
        if (_qzConnecting) {
            return new Promise(function (resolve) {
                var t = setInterval(function () {
                    if (!_qzConnecting) { clearInterval(t); resolve(_qzConnected); }
                }, 100);
            });
        }
        _qzConnecting = true;
        try {
            if (!await _loadQZScript()) { _qzConnecting = false; return false; }
            if (typeof qz === 'undefined') { _qzConnecting = false; return false; }
            if (!qz.websocket.isActive()) {
                await qz.websocket.connect({ retries: 1, delay: QZ_RETRY_DELAY_SEC });
            }
            _qzConnected = true;
            qz.websocket.setClosedCallbacks(function () {
                _qzConnected  = false;
                _qzConnecting = false;
            });
        } catch (e) {
            console.warn('PK-VMS PrintUtils: QZ Tray unavailable –', e.message || e);
            _qzConnected = false;
        }
        _qzConnecting = false;
        return _qzConnected;
    }

    async function _qzPrint(printerName, htmlContent, pageWidthMm, pageHeightMm) {
        if (!await _connectQZ()) return false;
        try {
            var cfg = qz.configs.create(printerName, {
                size:    { width: pageWidthMm + 'mm', height: pageHeightMm + 'mm' },
                margins: { top: 0, right: 0, bottom: 0, left: 0 },
                units:   'mm'
            });
            await qz.print(cfg, [{
                type:   'pixel',
                format: 'html',
                flavor: 'plain',
                data:   htmlContent
            }]);
            return true;
        } catch (e) {
            console.warn('PK-VMS PrintUtils: QZ print error –', e.message || e);
            return false;
        }
    }

    // ── Printer Settings ─────────────────────────────────────────────────────

    async function loadSettings() {
        if (_settingsCache !== null) return _settingsCache;

        // Try localStorage cache first
        try {
            var raw = localStorage.getItem(CACHE_KEY);
            if (raw) {
                var obj = JSON.parse(raw);
                if (Date.now() - obj.ts < CACHE_TTL) {
                    _settingsCache = obj.data;
                    return _settingsCache;
                }
            }
        } catch (e) {}

        // Load from Supabase
        _settingsCache = {};
        try {
            if (window.db) {
                var res = await window.db
                    .from('app_settings')
                    .select('value')
                    .eq('key', 'printer_settings')
                    .maybeSingle();
                if (res && res.data && res.data.value) {
                    _settingsCache = res.data.value;
                }
            }
        } catch (e) {
            console.warn('PK-VMS PrintUtils: could not load printer settings –', e.message || e);
        }

        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: _settingsCache }));
        } catch (e) {}

        return _settingsCache;
    }

    function invalidateCache() {
        _settingsCache = null;
        try { localStorage.removeItem(CACHE_KEY); } catch (e) {}
    }

    // ── Local Agent (VASD) Print – no QZ Tray required ───────────────────────

    /**
     * Try to print via the local VASD agent (app.py) running on 127.0.0.1:8080.
     * Returns true on success, false if the agent is unreachable or returns an error.
     */
    async function _agentPrint(printerName, htmlContent, pageWidthMm, pageHeightMm) {
        try {
            var res = await fetch(AGENT_URL + '/print', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    html:    htmlContent,
                    printer: printerName || '',
                    width:   pageWidthMm,
                    height:  pageHeightMm
                }),
                signal: (function () {
                    var ctrl = new AbortController();
                    setTimeout(function () { ctrl.abort(); }, 10000);
                    return ctrl.signal;
                }())
            });
            if (!res.ok) return false;
            var json = await res.json();
            return json && json.status === 'success';
        } catch (e) {
            console.warn('PK-VMS PrintUtils: local agent unavailable –', e.message || e);
            return false;
        }
    }

    // ── Public Print Functions ───────────────────────────────────────────────

    /**
     * Print HTML content using a hidden iframe.
     * Priority: (1) QZ Tray, (2) local VASD agent, (3) hidden-iframe browser print.
     *
     * @param {string}  htmlContent    Complete HTML document string.
     * @param {number}  pageWidthMm    Page width in mm (used for @page and QZ Tray).
     * @param {number}  pageHeightMm   Page height in mm.
     * @param {string}  [templateType] Key into the printer_settings map (e.g. 'thermal_receipt').
     */
    async function executePrint(htmlContent, pageWidthMm, pageHeightMm, templateType) {
        var settings    = await loadSettings();
        var printerName = (templateType && settings[templateType]) || null;

        if (printerName) {
            // 1. Try QZ Tray
            var ok = await _qzPrint(printerName, htmlContent, pageWidthMm, pageHeightMm);
            if (ok) return;

            // 2. Try local VASD agent (no QZ Tray required)
            ok = await _agentPrint(printerName, htmlContent, pageWidthMm, pageHeightMm);
            if (ok) return;
        }

        // 3. Fallback: hidden iframe using srcdoc (avoids document.write)
        // htmlContent is a fully-constructed HTML document built by the caller;
        // callers are responsible for sanitizing any user-supplied values they embed in it.
        var iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;border:0;visibility:hidden;';
        document.body.appendChild(iframe);
        iframe.addEventListener('load', function () {
            var printFn = function () {
                iframe.contentWindow.addEventListener('afterprint', function () {
                    try { document.body.removeChild(iframe); } catch (e) {}
                }, { once: true });
                iframe.contentWindow.print();
            };
            if (iframe.contentWindow.document.fonts) {
                iframe.contentWindow.document.fonts.ready
                    .then(printFn)
                    .catch(function () { setTimeout(printFn, 600); });
            } else {
                setTimeout(printFn, 600);
            }
        });
        iframe.srcdoc = htmlContent;
    }

    /**
     * Print HTML content by opening a new window.
     * Priority: (1) QZ Tray, (2) local VASD agent, (3) window.print().
     *
     * @param {string}  htmlContent      Complete HTML document string.
     * @param {number}  pageWidthMm      Page width in mm.
     * @param {number}  pageHeightMm     Page height in mm.
     * @param {string}  [templateType]   Key into the printer_settings map.
     * @param {boolean} [closeAfterPrint=true]  Whether to close the popup after printing.
     */
    async function executeWindowPrint(htmlContent, pageWidthMm, pageHeightMm, templateType, closeAfterPrint) {
        var settings    = await loadSettings();
        var printerName = (templateType && settings[templateType]) || null;

        if (printerName) {
            // 1. Try QZ Tray
            var ok = await _qzPrint(printerName, htmlContent, pageWidthMm, pageHeightMm);
            if (ok) return;

            // 2. Try local VASD agent (no QZ Tray required)
            ok = await _agentPrint(printerName, htmlContent, pageWidthMm, pageHeightMm);
            if (ok) return;
        }

        // 3. Fallback: window.open + print
        var win = window.open('', '_blank');
        if (!win) { alert('❌ กรุณาอนุญาตการเปิด popup ใน browser'); return; }
        win.document.write(htmlContent);
        win.document.close();
        var doClose = (closeAfterPrint !== false);
        var printFn = function () {
            win.print();
            if (doClose) { try { win.close(); } catch (e) {} }
        };
        if (win.document.fonts) {
            win.document.fonts.ready
                .then(printFn)
                .catch(function () { setTimeout(printFn, 800); });
        } else {
            setTimeout(printFn, 800);
        }
    }

    // ── Exports ──────────────────────────────────────────────────────────────

    window.PrintUtils = {
        loadSettings:       loadSettings,
        invalidateCache:    invalidateCache,
        executePrint:       executePrint,
        executeWindowPrint: executeWindowPrint
    };

}());
