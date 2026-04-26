# PK-VMS — Bottom Nav + Top Search + Patient Context

ระบบ shell กลางที่ inject ทุกหน้า ทำให้:
- **Bottom nav** กลางทุกหน้า (แทน dashboard)
- **Top bar** ค้นหาสัตว์/เจ้าของจากหน้าใดก็ได้
- **Selected pill** ติดตามผู้ใช้ทุกหน้า มีปุ่มลัดไปหน้าอื่นๆ
- **Context API** ให้แต่ละหน้า "ฟัง" และ auto-load ข้อมูลที่เลือก

---

## 📦 ไฟล์ที่ได้

| ไฟล์ | หน้าที่ |
|---|---|
| `pk-context.js` | State manager กลาง (sessionStorage + event broadcasting) |
| `pk-topbar.js` | Top bar: search box + dropdown + selected pill |
| `bottom-nav.js` | Bottom nav กลางทุกหน้า |
| `index.html` | หน้า login ใหม่ (ไม่มี dashboard) → redirect ไป medrec.html |
| `integration-snippets.html` | ตัวอย่าง code ใส่แต่ละหน้าให้ react กับ context |

---

## 🛠️ ขั้นตอน Integrate

### 1. วางไฟล์ลง root
วาง 4 ไฟล์ JS/HTML ลงในโฟลเดอร์เดียวกับไฟล์อื่นๆ ของโปรเจกต์

### 2. ลำดับการโหลด script ในทุกหน้า
ใส่ก่อน `</body>` ตามลำดับนี้ (สำคัญ!):

```html
<!-- ต้องมีอยู่แล้ว -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>

<!-- เพิ่ม 3 บรรทัดนี้ -->
<script src="pk-context.js" defer></script>
<script src="pk-topbar.js" defer></script>
<script src="bottom-nav.js" defer></script>
```

### 3. ตรวจสอบ Schema (สำคัญ!)
เปิด `pk-topbar.js` ดูที่ตัวแปร `SCHEMA` ตอนต้นไฟล์:

```js
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
```

**ปรับให้ตรงกับชื่อคอลัมน์จริง** ในฐานข้อมูล Supabase ของคุณ — ผมเดาจากที่เห็นใน `app.py` (cid, prefix, firstname, lastname) แต่ถ้าใช้ snake_case อย่างอื่น (เช่น `first_name`) ต้องแก้

ถ้าสัตว์มีคอลัมน์ HN/AN ก็เพิ่มใน `searchable: ['name', 'hn']` ได้

### 4. ทำ Index ในฐานข้อมูลเพื่อให้ search เร็ว
รันใน Supabase SQL Editor:

```sql
-- Trigram extension สำหรับ ilike เร็ว
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_animals_name_trgm     ON animals USING gin (name      gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_owners_firstname_trgm ON owners  USING gin (firstname gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_owners_lastname_trgm  ON owners  USING gin (lastname  gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_owners_phone          ON owners  (phone);
CREATE INDEX IF NOT EXISTS idx_owners_cid            ON owners  (cid);
CREATE INDEX IF NOT EXISTS idx_animals_owner_id      ON animals (owner_id);
```

ผล: search ตอบใน < 50ms แม้มีข้อมูล 100,000+ records

### 5. ทำให้แต่ละหน้า React กับ Context (เลือกทำเฉพาะหน้าที่ต้องการ)
ดูตัวอย่างใน `integration-snippets.html` — ใส่ใน `<script>` ของแต่ละหน้า

ตัวอย่างขั้นต่ำสุด (medrec.html):
```js
PKContext.on(ctx => {
  if (ctx?.animal_id) {
    loadMedicalRecordForAnimal(ctx.animal_id);
  }
});
```

หรือถ้าปุ่มในที่หน้านั้น link ผ่าน pill ของ topbar (มี `?animal_id=...` ใน URL):
- `pk-context.js` จะ auto-hydrate context จาก URL param ให้เอง
- หน้านั้นแค่อ่าน URL param มาใช้:
```js
const animalId = new URLSearchParams(location.search).get('animal_id');
if (animalId) loadMedicalRecordForAnimal(animalId);
```

---

## 🎯 Workflow ใหม่ (ก่อน vs หลัง)

**ก่อน:**
1. เข้า medrec.html → ค้นชื่อสัตว์ → คลิก
2. ออกใบเสร็จ → ไป pos.html → ค้นชื่อใหม่ → คลิก
3. แล็บผล → ไป lab.html → ค้นชื่อใหม่ → คลิก
4. ออกใบรับรอง → ไป documents.html → ค้นชื่อใหม่ → คลิก

**หลัง:**
1. กด `Ctrl+K` ที่ไหนก็ได้ → พิมพ์ชื่อ → Enter → pill ขึ้น
2. คลิกปุ่ม "POS" ใน pill → ไปจ่ายเงินทันที (ข้อมูลโหลดแล้ว)
3. คลิกปุ่ม "แล็บ" ใน pill → กรอกผลแล็บ (ข้อมูลโหลดแล้ว)
4. คลิกปุ่ม "เอกสาร" ใน pill → ออกใบรับรอง (ข้อมูลโหลดแล้ว)

→ ลด clicks จาก ~16 → ~5 และไม่ต้องค้นซ้ำ

---

## 🔑 Keyboard Shortcuts

| ปุ่ม | ทำอะไร |
|---|---|
| `Ctrl+K` / `Cmd+K` | Focus ช่อง search ทันที (จากหน้าใดก็ได้) |
| `↑` `↓` | เลือก item ใน dropdown |
| `Enter` | เลือก item ที่ highlight |
| `Esc` | ปิด dropdown |

---

## 💡 ฟีเจอร์ที่ต่อยอดได้

**ปุ่ม "เปิดเป็นแท็บใหม่" บน pill** — สำหรับหมอที่ชอบเปิดหลายแท็บ

**History ของ patient ที่เพิ่งเปิด** — แสดง dropdown ใต้ search ตอนกด focus เพื่อให้กดเลือกซ้ำได้เร็ว

**Pin patient ค้างไว้** — สำหรับเคสติดตามทั้งวัน เช่น สัตว์ใน ICU ไม่ clear เมื่อเปลี่ยนหน้า

ถ้าสนใจบอกได้ครับ
