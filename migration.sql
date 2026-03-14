-- ═══════════════════════════════════════════════════════════════
-- PK-VMS : Database Migration
-- รันใน Supabase SQL Editor เพื่อเพิ่ม Column ที่ขาดหายใน medical_records
-- ═══════════════════════════════════════════════════════════════

-- เพิ่ม Column สำหรับระบบ POS ใน medical_records
ALTER TABLE medical_records
  ADD COLUMN IF NOT EXISTS discount        NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS net_amount      NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS receipt_no      TEXT,
  ADD COLUMN IF NOT EXISTS received_amount NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS paid_at         TIMESTAMPTZ;

-- ตั้งค่า net_amount ให้เท่ากับ total_cost สำหรับ Record เก่าที่ยังไม่มีค่า
UPDATE medical_records
  SET net_amount = total_cost
  WHERE net_amount IS NULL;

-- ═══════════════════════════════════════════════════════════════
-- เพิ่ม updated_at Column ที่ขาดหายในตาราง owners, animals และ mas_lab_parameters
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE owners
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE animals
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE mas_lab_parameters
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
