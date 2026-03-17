# PK_VMS
Online Veterinary Management System

## การตั้งค่าฐานข้อมูล (Database Setup)

หลังจากสร้าง Project ใน Supabase และตั้งค่า `supabase-config.js` แล้ว ให้รัน SQL ต่อไปนี้ใน **Supabase → SQL Editor** เพื่อให้ระบบทำงานได้ถูกต้อง:

```sql
ALTER TABLE medical_records
  ADD COLUMN IF NOT EXISTS discount        NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS net_amount      NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS receipt_no      TEXT,
  ADD COLUMN IF NOT EXISTS received_amount NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS paid_at         TIMESTAMPTZ;

UPDATE medical_records
  SET net_amount = total_cost
  WHERE net_amount IS NULL;

ALTER TABLE owners
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE animals
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE mas_lab_parameters
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE medical_records
  ADD COLUMN IF NOT EXISTS dld_categories JSONB NOT NULL DEFAULT '[]'::jsonb;
```

> SQL นี้ยังมีอยู่ในไฟล์ [`migration.sql`](./migration.sql) และในหน้า **จัดการฐานข้อมูล** (`set-db.html`) ซึ่งมีปุ่ม "คัดลอก SQL" ให้ใช้งานได้สะดวก

## แก้ไขปัญหา (Troubleshooting)

| Error | สาเหตุ | วิธีแก้ไข |
|-------|--------|-----------|
| `Could not find the 'discount' column of 'medical_records'` | ยังไม่ได้รัน Migration SQL | รัน SQL ด้านบนใน Supabase SQL Editor |
| `column medical_records.dld_categories does not exist` | ยังไม่ได้รัน Migration SQL (dld_categories) | รัน SQL ด้านบนใน Supabase SQL Editor |
