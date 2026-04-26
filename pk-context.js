/**
 * PK-VMS Global Context
 * ----------------------------------------------------------------------------
 * เก็บข้อมูลสัตว์/เจ้าของที่เลือก (selected patient) ไว้ใน sessionStorage
 * และส่ง event 'pk-context-change' เมื่อมีการเปลี่ยนแปลง
 *
 * โหลดก่อน pk-topbar.js และก่อน script ของแต่ละหน้า
 *
 * API:
 *   PKContext.set({ type, animal_id, owner_id, ... })
 *   PKContext.get()
 *   PKContext.clear()
 *   PKContext.on(callback)  -> callback ถูกเรียกทันที (ถ้ามี ctx) และทุกครั้งที่เปลี่ยน
 *
 * ตัวอย่าง object ที่เก็บ:
 *   {
 *     type: 'animal',         // หรือ 'owner'
 *     animal_id: 123,
 *     animal_name: 'ทอง',
 *     species: 'สุนัข',
 *     breed: 'ไทยหลังอาน',
 *     sex: 'M',
 *     owner_id: 456,
 *     owner_name: 'นายสมชาย ใจดี',
 *     owner_phone: '0812345678',
 *     owner_cid: '1100800123456',
 *     set_at: 1735000000000
 *   }
 * ----------------------------------------------------------------------------
 */
(function () {
  'use strict';

  const KEY = 'pk-context';
  let _current = null;

  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) _current = JSON.parse(raw);
  } catch (_) { /* ignore */ }

  function set(ctx) {
    if (!ctx) return clear();
    _current = Object.assign({}, ctx, { set_at: Date.now() });
    try { sessionStorage.setItem(KEY, JSON.stringify(_current)); } catch (_) {}
    fire();
  }

  function clear() {
    _current = null;
    try { sessionStorage.removeItem(KEY); } catch (_) {}
    fire();
  }

  function get() { return _current; }

  function on(cb) {
    window.addEventListener('pk-context-change', e => cb(e.detail));
    if (_current) {
      // เรียก callback ครั้งแรกทันทีถ้ามี context อยู่แล้ว
      // ใช้ setTimeout เพื่อไม่ให้บล็อก script flow
      setTimeout(() => cb(_current), 0);
    }
  }

  function fire() {
    window.dispatchEvent(new CustomEvent('pk-context-change', { detail: _current }));
  }

  // ── Sync ระหว่างแท็บ (ถ้าเปิดหลายแท็บ) ──────────────────────────────────
  window.addEventListener('storage', e => {
    if (e.key !== KEY) return;
    try {
      _current = e.newValue ? JSON.parse(e.newValue) : null;
    } catch (_) { _current = null; }
    fire();
  });

  // ── Auto-load จาก URL param (เช่น ?animal_id=123) ──────────────────────
  // ทำให้ปุ่มลัดใน pill ที่ link ไปหน้าอื่นทำงาน (carry context ผ่าน URL)
  const params = new URLSearchParams(location.search);
  const urlAnimalId = params.get('animal_id');
  const urlOwnerId  = params.get('owner_id');
  if (urlAnimalId && (!_current || String(_current.animal_id) !== urlAnimalId)) {
    // ตั้ง context เบื้องต้นจาก URL — รายละเอียดจะอัปเดตต่อเมื่อ search ใหม่
    if (typeof window.db !== 'undefined') {
      hydrateFromAnimalId(parseInt(urlAnimalId, 10));
    }
  } else if (urlOwnerId && (!_current || String(_current.owner_id) !== urlOwnerId)) {
    if (typeof window.db !== 'undefined') {
      hydrateFromOwnerId(parseInt(urlOwnerId, 10));
    }
  }

  async function hydrateFromAnimalId(id) {
    try {
      const { data } = await window.db
        .from('animals')
        .select('id, name, species, breed, sex, owner_id, owners(id, prefix, firstname, lastname, phone, cid)')
        .eq('id', id)
        .maybeSingle();
      if (!data) return;
      set({
        type: 'animal',
        animal_id: data.id,
        animal_name: data.name,
        species: data.species,
        breed: data.breed,
        sex: data.sex,
        owner_id: data.owner_id || data.owners?.id,
        owner_name: data.owners
          ? `${data.owners.prefix||''}${data.owners.firstname||''} ${data.owners.lastname||''}`.trim()
          : '',
        owner_phone: data.owners?.phone,
        owner_cid: data.owners?.cid,
      });
    } catch (_) { /* ignore */ }
  }

  async function hydrateFromOwnerId(id) {
    try {
      const { data } = await window.db
        .from('owners')
        .select('id, prefix, firstname, lastname, phone, cid')
        .eq('id', id)
        .maybeSingle();
      if (!data) return;
      set({
        type: 'owner',
        owner_id: data.id,
        owner_name: `${data.prefix||''}${data.firstname||''} ${data.lastname||''}`.trim(),
        owner_phone: data.phone,
        owner_cid: data.cid,
      });
    } catch (_) { /* ignore */ }
  }

  window.PKContext = { set, get, clear, on };
})();
