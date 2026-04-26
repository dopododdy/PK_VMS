/**
 * PK-VMS Top Bar
 * ----------------------------------------------------------------------------
 * Top bar กลางทุกหน้า: search ฐานข้อมูลสัตว์ + เจ้าของ และแสดง pill
 * ของรายการที่เลือกอยู่ พร้อมปุ่มลัดไปทุกหน้า
 *
 * ต้องโหลดหลังจาก:
 *   - supabase-config.js  (ต้องมี window.db)
 *   - pk-context.js       (ต้องมี window.PKContext)
 *
 * Keyboard shortcut: Ctrl+K / Cmd+K = focus search
 *
 * ⚠️ ตรวจสอบชื่อคอลัมน์ในฐานข้อมูล
 *   หากตารางใช้ชื่อคอลัมน์ต่างจาก default (ดูตัวแปร SCHEMA ด้านล่าง)
 *   แก้ไขที่ตัวแปร SCHEMA ให้ตรงกับ schema จริง
 * ----------------------------------------------------------------------------
 */
(function () {
  'use strict';

  // ── Schema config — ปรับให้ตรงกับฐานข้อมูลจริงถ้าจำเป็น ────────────────
  const SCHEMA = {
    owners: {
      table: 'owners',
      fields: 'id, prefix, firstname, lastname, phone, cid',
      searchable: ['firstname', 'lastname', 'phone', 'cid'],
    },
    animals: {
      table: 'animals',
      fields: 'id, name, species, breed, sex, owner_id, owners(id, prefix, firstname, lastname, phone, cid)',
      searchable: ['name'],
    },
  };

  // ── หน้าที่ห้ามแสดง topbar (หน้าลูกค้า) ─────────────────────────────────
  const HIDE_ON = new Set([
    'index.html',
    'surgery-status.html',
    'screensaver.html',
    'self-registration.html',
    'signage.html',
    'set-display2.html',
    'pos-customer.html',
    'epassport.html',
  ]);
  const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (HIDE_ON.has(currentPage)) return;
  if (document.body && document.body.dataset.pkNav === 'hide') return;

  // ── CSS ──────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    body { padding-top: 76px !important; }
    body.pk-has-pill { padding-top: 152px !important; }

    .pk-topbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 80;
      background: rgba(2, 6, 23, 0.85);
      backdrop-filter: saturate(140%) blur(18px);
      -webkit-backdrop-filter: saturate(140%) blur(18px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding: 12px;
      view-transition-name: pk-topbar;
      font-family: "Sarabun", sans-serif;
    }
    ::view-transition-group(pk-topbar) { animation: none; }

    .pk-search-wrap { position: relative; max-width: 800px; margin: 0 auto; }
    .pk-search {
      width: 100%; padding: 12px 44px 12px 16px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      color: #e2e8f0; font-size: 15px;
      font-family: inherit; outline: none;
      transition: border-color .15s, background .15s;
      box-sizing: border-box;
    }
    .pk-search:focus { border-color: #14b8b1; background: rgba(255,255,255,0.08); }
    .pk-search::placeholder { color: #64748b; }
    .pk-kbd-hint {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      font-size: 10px; font-weight: 700; color: #64748b;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 3px 7px; border-radius: 6px;
      pointer-events: none;
    }
    .pk-search:focus + .pk-kbd-hint { display: none; }

    .pk-results {
      position: absolute; top: calc(100% + 4px); left: 0; right: 0;
      background: #0f172a;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      max-height: 60vh; overflow-y: auto;
      box-shadow: 0 20px 50px rgba(0,0,0,.5);
    }
    .pk-results[hidden] { display: none; }

    .pk-result {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; cursor: pointer;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      transition: background .1s;
    }
    .pk-result:last-child { border-bottom: none; }
    .pk-result:hover, .pk-result.kb-active { background: rgba(20,184,177,.12); }

    .pk-result-icon {
      width: 36px; height: 36px;
      background: rgba(20,184,177,.15);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
    }
    .pk-result-info { flex: 1; min-width: 0; }
    .pk-result-title {
      color: white; font-weight: 600; font-size: 14px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      display: flex; align-items: center; gap: 8px;
    }
    .pk-result-sub {
      color: #94a3b8; font-size: 12px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .pk-tag {
      font-size: 9px; font-weight: 800;
      padding: 2px 7px; border-radius: 5px;
      background: rgba(20,184,177,.2); color: #14b8b1;
      letter-spacing: .05em;
    }
    .pk-tag.owner { background: rgba(59,130,246,.2); color: #60a5fa; }
    .pk-empty { padding: 24px; text-align: center; color: #64748b; font-size: 13px; }
    .pk-loading {
      padding: 16px; text-align: center; color: #64748b; font-size: 13px;
    }
    .pk-loading::after {
      content: '...';
      display: inline-block; width: 1.5em; text-align: left;
      animation: pkDots 1.4s infinite;
    }
    @keyframes pkDots {
      0%,20%   { content: '.'; }
      40%      { content: '..'; }
      60%,100% { content: '...'; }
    }

    /* ── Selected pill ───────────────────────────────────────── */
    .pk-pill {
      max-width: 800px; margin: 8px auto 0;
      background: linear-gradient(90deg, rgba(20,184,177,.18), rgba(20,184,177,.05));
      border: 1px solid rgba(20,184,177,.3);
      border-radius: 14px; padding: 10px 14px;
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    }
    .pk-pill-info { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
    .pk-pill-icon { font-size: 24px; flex-shrink: 0; }
    .pk-pill-text { min-width: 0; flex: 1; }
    .pk-pill-name {
      color: white; font-weight: 700; font-size: 14px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .pk-pill-meta {
      color: #94a3b8; font-size: 11px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .pk-pill-actions { display: flex; gap: 4px; flex-wrap: wrap; }
    .pk-pill-btn {
      padding: 5px 10px;
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 8px;
      color: #cbd5e1;
      font-size: 11px; font-weight: 600;
      text-decoration: none; cursor: pointer; white-space: nowrap;
      transition: all .15s;
    }
    .pk-pill-btn:hover {
      background: rgba(20,184,177,.2);
      border-color: #14b8b1; color: white;
    }
    .pk-pill-btn.active {
      background: rgba(20,184,177,.25);
      border-color: #14b8b1; color: white;
    }
    .pk-pill-close {
      background: rgba(239,68,68,.15);
      border: 1px solid rgba(239,68,68,.3);
      color: #fca5a5;
      width: 28px; height: 28px; padding: 0;
      border-radius: 8px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; flex-shrink: 0;
    }
    .pk-pill-close:hover { background: rgba(239,68,68,.3); color: white; }

    @media (max-width: 640px) {
      .pk-pill { padding: 8px 10px; }
      .pk-pill-btn { font-size: 10px; padding: 4px 8px; }
      .pk-pill-meta { font-size: 10px; }
    }
  `;
  document.head.appendChild(style);

  // ── DOM ──────────────────────────────────────────────────────────────────
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  const bar = document.createElement('div');
  bar.className = 'pk-topbar';
  bar.innerHTML = `
    <div class="pk-search-wrap">
      <input class="pk-search" type="search" autocomplete="off"
             placeholder="🔍 ค้นหา: ชื่อสัตว์ / เจ้าของ / เบอร์ / CID..." />
      <span class="pk-kbd-hint">${isMac ? '⌘' : 'Ctrl'} K</span>
      <div class="pk-results" hidden></div>
    </div>
  `;
  const pillEl = document.createElement('div');
  pillEl.className = 'pk-pill';
  pillEl.hidden = true;
  bar.appendChild(pillEl);

  function mount() {
    document.body.insertBefore(bar, document.body.firstChild);
    setupSearch();
    setupShortcut();
    renderPill(window.PKContext && window.PKContext.get());
    window.addEventListener('pk-context-change', e => renderPill(e.detail));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }

  // ── Search ───────────────────────────────────────────────────────────────
  let searchTimer = null;
  let reqId = 0;
  let kbIndex = -1;
  let currentResults = [];

  function setupSearch() {
    const input = bar.querySelector('.pk-search');
    const results = bar.querySelector('.pk-results');

    input.addEventListener('input', () => {
      clearTimeout(searchTimer);
      const q = input.value.trim();
      if (q.length < 2) { results.hidden = true; currentResults = []; return; }
      results.innerHTML = '<div class="pk-loading">กำลังค้นหา</div>';
      results.hidden = false;
      searchTimer = setTimeout(() => doSearch(q, results), 200);
    });

    input.addEventListener('focus', () => {
      if (currentResults.length > 0) results.hidden = false;
    });

    document.addEventListener('click', e => {
      if (!bar.contains(e.target)) results.hidden = true;
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        kbIndex = Math.min(kbIndex + 1, currentResults.length - 1);
        updateKb(results);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        kbIndex = Math.max(kbIndex - 1, 0);
        updateKb(results);
      } else if (e.key === 'Enter') {
        if (kbIndex >= 0 && currentResults[kbIndex]) {
          e.preventDefault();
          selectResult(currentResults[kbIndex]);
        }
      } else if (e.key === 'Escape') {
        results.hidden = true; input.blur();
      }
    });
  }

  function updateKb(results) {
    results.querySelectorAll('.pk-result').forEach((el, i) => {
      el.classList.toggle('kb-active', i === kbIndex);
    });
    const active = results.querySelector('.kb-active');
    if (active) active.scrollIntoView({ block: 'nearest' });
  }

  function setupShortcut() {
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = bar.querySelector('.pk-search');
        input.focus();
        input.select();
      }
    });
  }

  async function doSearch(q, resultsEl) {
    if (typeof window.db === 'undefined') {
      resultsEl.innerHTML = '<div class="pk-empty">รอ Supabase โหลดเสร็จก่อน</div>';
      return;
    }
    const myReq = ++reqId;
    const term = '%' + q.replace(/[%_,]/g, m => '\\' + m) + '%';

    try {
      const animalsOr = SCHEMA.animals.searchable.map(f => `${f}.ilike.${term}`).join(',');
      const ownersOr  = SCHEMA.owners.searchable.map(f => `${f}.ilike.${term}`).join(',');

      const [animalsRes, ownersRes] = await Promise.all([
        window.db.from(SCHEMA.animals.table).select(SCHEMA.animals.fields).or(animalsOr).limit(8),
        window.db.from(SCHEMA.owners.table).select(SCHEMA.owners.fields).or(ownersOr).limit(8),
      ]);
      if (myReq !== reqId) return;  // มี search ใหม่กว่ามาแล้ว ทิ้งผลเก่า

      const animals = (animalsRes.data || []).map(a => ({
        type: 'animal',
        animal_id: a.id,
        animal_name: a.name,
        species: a.species,
        breed: a.breed,
        sex: a.sex,
        owner_id: a.owner_id || a.owners?.id,
        owner_name: a.owners
          ? `${a.owners.prefix||''}${a.owners.firstname||''} ${a.owners.lastname||''}`.trim()
          : '',
        owner_phone: a.owners?.phone,
        owner_cid: a.owners?.cid,
      }));
      const owners = (ownersRes.data || []).map(o => ({
        type: 'owner',
        owner_id: o.id,
        owner_name: `${o.prefix||''}${o.firstname||''} ${o.lastname||''}`.trim(),
        owner_phone: o.phone,
        owner_cid: o.cid,
      }));

      currentResults = [...animals, ...owners];
      kbIndex = -1;
      renderResults(resultsEl);
    } catch (err) {
      console.error('PK search error:', err);
      resultsEl.innerHTML = `<div class="pk-empty">
        ค้นหาไม่สำเร็จ — ตรวจสอบชื่อตาราง/คอลัมน์<br>
        <small style="opacity:.6">${esc(err.message || '')}</small>
      </div>`;
    }
  }

  function renderResults(resultsEl) {
    if (currentResults.length === 0) {
      resultsEl.innerHTML = '<div class="pk-empty">ไม่พบข้อมูลที่ตรงกับคำค้น</div>';
      return;
    }
    resultsEl.innerHTML = currentResults.map((r, i) => {
      if (r.type === 'animal') {
        return `<div class="pk-result" data-i="${i}">
          <div class="pk-result-icon">${speciesIcon(r.species)}</div>
          <div class="pk-result-info">
            <div class="pk-result-title">${esc(r.animal_name||'-')} <span class="pk-tag">สัตว์</span></div>
            <div class="pk-result-sub">${esc(r.species||'')} ${esc(r.breed||'')} · เจ้าของ: ${esc(r.owner_name||'-')}</div>
          </div>
        </div>`;
      }
      return `<div class="pk-result" data-i="${i}">
        <div class="pk-result-icon">👤</div>
        <div class="pk-result-info">
          <div class="pk-result-title">${esc(r.owner_name||'-')} <span class="pk-tag owner">เจ้าของ</span></div>
          <div class="pk-result-sub">${esc(r.owner_phone||'-')}${r.owner_cid ? ' · '+esc(r.owner_cid) : ''}</div>
        </div>
      </div>`;
    }).join('');

    resultsEl.querySelectorAll('.pk-result').forEach(el => {
      el.addEventListener('click', () => {
        selectResult(currentResults[parseInt(el.dataset.i, 10)]);
      });
    });
  }

  function selectResult(r) {
    if (!r) return;
    window.PKContext.set(r);
    bar.querySelector('.pk-search').value = '';
    bar.querySelector('.pk-results').hidden = true;
  }

  // ── Pill ─────────────────────────────────────────────────────────────────
  function renderPill(ctx) {
    if (!ctx) {
      pillEl.hidden = true;
      document.body.classList.remove('pk-has-pill');
      return;
    }

    const isAnimal = ctx.type === 'animal';
    const icon = isAnimal ? speciesIcon(ctx.species) : '👤';
    const name = isAnimal ? ctx.animal_name : ctx.owner_name;
    const meta = isAnimal
      ? `${ctx.species||''}${ctx.breed ? ' · '+ctx.breed : ''} · เจ้าของ: ${ctx.owner_name||'-'}`
      : `${ctx.owner_phone||'-'}${ctx.owner_cid ? ' · CID: '+ctx.owner_cid : ''}`;

    const params = new URLSearchParams();
    if (ctx.animal_id) params.set('animal_id', ctx.animal_id);
    if (ctx.owner_id)  params.set('owner_id',  ctx.owner_id);
    const qs = '?' + params.toString();

    const actions = [
      { href: 'medrec.html',        icon: '🐾', label: 'เวชระเบียน' },
      { href: 'lab.html',           icon: '🔬', label: 'แล็บ' },
      { href: 'pos.html',           icon: '💰', label: 'คิดเงิน' },
      { href: 'documents.html',     icon: '📄', label: 'เอกสาร' },
      { href: 'epassport-vet.html', icon: '📔', label: 'e-Passport' },
    ];

    pillEl.innerHTML = `
      <div class="pk-pill-info">
        <div class="pk-pill-icon">${icon}</div>
        <div class="pk-pill-text">
          <div class="pk-pill-name">${esc(name||'')}</div>
          <div class="pk-pill-meta">${esc(meta)}</div>
        </div>
      </div>
      <div class="pk-pill-actions">
        ${actions.map(a => {
          const active = currentPage === a.href.toLowerCase() ? ' active' : '';
          return `<a class="pk-pill-btn${active}" href="${a.href}${qs}">${a.icon} ${a.label}</a>`;
        }).join('')}
      </div>
      <button class="pk-pill-close" aria-label="ยกเลิกการเลือก" title="ยกเลิกการเลือก">×</button>
    `;
    pillEl.querySelector('.pk-pill-close').addEventListener('click', () => {
      window.PKContext.clear();
    });
    pillEl.hidden = false;
    document.body.classList.add('pk-has-pill');
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  function speciesIcon(s) {
    const t = (s||'').toLowerCase();
    if (t.includes('สุนัข') || t.includes('dog'))    return '🐶';
    if (t.includes('แมว')  || t.includes('cat'))    return '🐱';
    if (t.includes('นก')   || t.includes('bird'))   return '🐦';
    if (t.includes('กระต่าย')||t.includes('rabbit'))return '🐰';
    if (t.includes('หนู')  || t.includes('rat')||t.includes('mouse')) return '🐹';
    if (t.includes('เต่า') || t.includes('turtle')) return '🐢';
    if (t.includes('งู')   || t.includes('snake'))  return '🐍';
    return '🐾';
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[<>&"']/g, c => ({
      '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'
    }[c]));
  }
})();
