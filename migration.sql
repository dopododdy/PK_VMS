-- ═══════════════════════════════════════════════════════════════
-- PK-VMS : Database Migration
-- รันใน Supabase SQL Editor เพื่อเพิ่ม Column ที่ขาดหายใน medical_records
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- สร้างตาราง clinic_table_db สำหรับนำเข้าข้อมูลจาก ClinicDB.mdb
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS clinic_table_db (
  id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  rec_id      VARCHAR(255) UNIQUE,
  animal_id   VARCHAR(255),
  animal_name VARCHAR(255),
  animal_spp  VARCHAR(255),
  animal_tag  VARCHAR(255),
  owner_name  VARCHAR(255),
  animal_dob  DATE,
  phone_no    VARCHAR(50),
  medrec      TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- แก้ไข phone_no ให้รองรับหมายเลขโทรศัพท์ที่ยาวกว่า 20 ตัวอักษร (สำหรับฐานข้อมูลเดิม)
ALTER TABLE IF EXISTS clinic_table_db
  ALTER COLUMN phone_no TYPE VARCHAR(50);

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

-- ═══════════════════════════════════════════════════════════════
-- เพิ่ม Template สำหรับ doc_echo (Echocardiography)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO public.print_templates (template_type, config)
VALUES ('doc_echo', '{"width": 210, "height": 297, "lines": []}')
ON CONFLICT (template_type) DO NOTHING;
