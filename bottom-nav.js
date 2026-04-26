/**
 * PK-VMS Bottom Navigation
 * ----------------------------------------------------------------------------
 * ไฟล์เดียว inject bottom nav + prefetch + view transitions ทุกหน้า
 *
 * วิธีใช้:
 *   เพิ่ม <script src="bottom-nav.js" defer></script> ก่อน </body> ของทุกหน้า
 *   ที่ต้องการให้มี nav (ยกเว้น surgery-status.html, screensaver.html,
 *   self-registration.html, signage.html, set-display2.html ฯลฯ ที่ให้ลูกค้าดู)
 *
 * เพิ่ม attribute data-pk-nav="hide" บน <body> เพื่อ override (ซ่อน nav)
 * ----------------------------------------------------------------------------
 */
(function () {
  'use strict';

  // ── ตั้งค่ารายการเมนู ────────────────────────────────────────────────────
  const NAV_ITEMS = [
    { href: 'medrec.html',   icon: '🐾', label: 'เวชระเบียน' },
    { href: 'mascat.html',   icon: '🗂️', label: 'รายการกลาง' },
    { href: 'lab.html',      icon: '🔬', label: 'แล็บ' },
    { href: 'pos.html',      icon: '💰', label: 'POS' },
    { href: 'documents.html',icon: '📄', label: 'เอกสาร' },
    { href: 'tools.html',    icon: '🧮', label: 'เครื่องมือ' },
    { href: 'settings.html', icon: '⚙️', label: 'ตั้งค่า' },
  ];

  // ── Page filter: ห้ามแสดง nav บนหน้าที่ลูกค้าใช้ ────────────────────────
  const HIDE_ON = new Set([
    'surgery-status.html',
    'screensaver.html',
    'self-registration.html',
    'signage.html',
    'set-display2.html',
    'pos-customer.html',
    'epassport.html',          // ฉบับลูกค้าดู — ถ้าใช้เป็นหน้า admin ลบออก
  ]);

  const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (HIDE_ON.has(currentPage)) return;
  if (document.body && document.body.dataset.pkNav === 'hide') return;

  // ── CSS (inject ครั้งเดียว) ──────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    body { padding-bottom: calc(72px + env(safe-area-inset-bottom)) !important; }

    .pk-bnav {
      position: fixed; left: 0; right: 0; bottom: 0;
      z-index: 90;
      background: rgba(2, 6, 23, 0.85);
      backdrop-filter: saturate(140%) blur(18px);
      -webkit-backdrop-filter: saturate(140%) blur(18px);
      border-top: 1px solid rgba(255,255,255,0.08);
      display: grid;
      grid-template-columns: repeat(${NAV_ITEMS.length}, 1fr);
      padding: 6px 4px calc(6px + env(safe-area-inset-bottom));
      view-transition-name: pk-bnav;   /* ให้ nav ไม่กระพริบตอนเปลี่ยนหน้า */
    }

    .pk-bnav a {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 2px; padding: 6px 2px;
      color: #94a3b8; text-decoration: none;
      font-family: "Sarabun", sans-serif;
      font-size: 11px; font-weight: 600;
      border-radius: 12px;
      transition: background-color .15s, color .15s;
      position: relative; min-height: 56px;
      -webkit-tap-highlight-color: transparent;
    }
    .pk-bnav a:hover { color:#e2e8f0; background: rgba(255,255,255,0.04); }
    .pk-bnav a.active { color:#14b8b1; }
    .pk-bnav a.active::before {
      content:''; position:absolute; top:2px; left:30%; right:30%;
      height:3px; border-radius:3px; background:#14b8b1;
    }
    .pk-bnav .ic { font-size: 20px; line-height: 1; }
    .pk-bnav .lb { white-space: nowrap; }
    .pk-bnav .badge {
      position:absolute; top:4px; right:calc(50% - 22px);
      min-width:18px; height:18px; padding:0 5px;
      background:#ef4444; color:#fff;
      font-size:10px; font-weight:800;
      border-radius:9px;
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,.3);
    }

    @media (min-width: 640px) {
      .pk-bnav a { font-size:12px; min-height:60px; }
      .pk-bnav .ic { font-size:22px; }
    }

    /* View Transitions: เปลี่ยนหน้าแบบ fade อ่อนๆ + nav ค้างนิ่ง */
    @view-transition { navigation: auto; }
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation-duration: 140ms;
    }
    ::view-transition-group(pk-bnav) { animation: none; }  /* nav ไม่ animate */
  `;
  document.head.appendChild(style);

  // ── Build nav DOM ────────────────────────────────────────────────────────
  const nav = document.createElement('nav');
  nav.className = 'pk-bnav';
  nav.setAttribute('aria-label', 'เมนูหลัก');
  nav.innerHTML = NAV_ITEMS.map(it => {
    const active = currentPage === it.href.toLowerCase() ? ' active' : '';
    return `<a href="${it.href}" data-pk="${it.href}" class="${active}">
      <span class="ic">${it.icon}</span><span class="lb">${it.label}</span>
    </a>`;
  }).join('');

  function mount() {
    document.body.appendChild(nav);
    enablePrefetch();
    enableSpeculation();
    refreshBadges();
    // refresh badges ทุก 30 วินาที (ไม่ทำให้ช้าเพราะ Supabase query เล็ก)
    setInterval(refreshBadges, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }

  // ── 1) Prefetch on hover/touch (works on all browsers) ──────────────────
  function enablePrefetch() {
    const seen = new Set();
    nav.querySelectorAll('a').forEach(a => {
      const fire = () => {
        if (seen.has(a.href)) return;
        seen.add(a.href);
        const l = document.createElement('link');
        l.rel = 'prefetch';
        l.href = a.href;
        l.as = 'document';
        document.head.appendChild(l);
      };
      a.addEventListener('pointerenter', fire, { once: true });
      a.addEventListener('touchstart',   fire, { once: true, passive: true });
      a.addEventListener('focus',        fire, { once: true });
    });
  }

  // ── 2) Speculation Rules (Chromium): prerender ทุกหน้าใน nav ───────────
  //     ทำให้กดแล้วโหลดแทบทันทีเพราะ render ไว้แล้ว
  function enableSpeculation() {
    if (!HTMLScriptElement.supports || !HTMLScriptElement.supports('speculationrules')) return;
    const urls = NAV_ITEMS.map(i => i.href);
    const s = document.createElement('script');
    s.type = 'speculationrules';
    s.textContent = JSON.stringify({
      prerender: [{ urls, eagerness: 'moderate' }]
    });
    document.head.appendChild(s);
  }

  // ── 3) Notification badges (POS / รายการค้างชำระ) ──────────────────────
  async function refreshBadges() {
    if (typeof window.db === 'undefined') return;   // ยังไม่ load supabase
    try {
      const { data, error } = await window.db
        .from('medical_records')
        .select('total_cost, net_amount')
        .eq('payment_status', 'pending');
      if (error) return;
      const n = (data || [])
        .filter(r => parseFloat(r.net_amount || r.total_cost || 0) > 0).length;
      setBadge('pos.html', n);
    } catch (e) { /* silent */ }
  }

  function setBadge(href, count) {
    const link = nav.querySelector(`a[data-pk="${href}"]`);
    if (!link) return;
    let b = link.querySelector('.badge');
    if (count > 0) {
      if (!b) {
        b = document.createElement('span');
        b.className = 'badge';
        link.appendChild(b);
      }
      b.textContent = count > 99 ? '99+' : count;
    } else if (b) {
      b.remove();
    }
  }

  // expose สำหรับเรียกจากหน้าอื่นได้
  window.PKNav = { refreshBadges, setBadge };
})();
