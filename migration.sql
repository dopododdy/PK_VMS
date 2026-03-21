-- ═══════════════════════════════════════════════════════════════
-- PK-VMS : Database Migration
-- รันใน Supabase SQL Editor เพื่อเพิ่ม Column ที่ขาดหายใน medical_records
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- สร้างตาราง pos_pending_additions
-- บันทึกรายการสินค้าที่ถูกเพิ่มขณะรายการขายอยู่ในสถานะ 'รอจ่ายเงิน'
-- เพื่อให้สามารถติดตามได้ว่าสินค้าใดถูกเพิ่มช่วงรอจ่ายเงิน
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS pos_pending_additions (
  id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  record_id   UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
  item_type   TEXT,
  item_name   TEXT NOT NULL,
  quantity    NUMERIC(10,3) NOT NULL DEFAULT 1,
  unit_price  NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

-- ═══════════════════════════════════════════════════════════════
-- เพิ่ม line_id และ email ในตาราง owners สำหรับข้อมูลเจ้าของสัตว์
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE owners
  ADD COLUMN IF NOT EXISTS line_id TEXT,
  ADD COLUMN IF NOT EXISTS email   TEXT;

ALTER TABLE animals
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE mas_lab_parameters
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ═══════════════════════════════════════════════════════════════
-- เพิ่ม dld_categories สำหรับรายงานกรมปศุสัตว์ (DLD Annual Report)
-- เก็บเป็น JSON array เช่น ["vaccine:Rabies","medical:ผิวหนัง"]
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE medical_records
  ADD COLUMN IF NOT EXISTS dld_categories JSONB NOT NULL DEFAULT '[]'::jsonb;

-- ═══════════════════════════════════════════════════════════════
-- เพิ่ม Template สำหรับ doc_echo (Echocardiography)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO public.print_templates (template_type, config)
VALUES ('doc_echo', '{"width": 210, "height": 297, "lines": []}')
ON CONFLICT (template_type) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- เพิ่มข้อมูลยาเริ่มต้น (Initial Drug List) ลงในตาราง pharmacy
-- จะ INSERT เฉพาะเมื่อตารางว่างเท่านั้น เพื่อป้องกันข้อมูลซ้ำ
-- ═══════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.pharmacy LIMIT 1) THEN
    INSERT INTO public.pharmacy (
      item_name, name_th, category, concentration_mg_unit, unit, price_per_unit, side_effects,
      dog_dose_1, dog_for_1, dog_dose_2, dog_for_2, dog_dose_3, dog_for_3,
      cat_dose_1, cat_for_1, cat_dose_2, cat_for_2, cat_dose_3, cat_for_3,
      is_medication
    ) VALUES

    -- ─── Antibiotics ─────────────────────────────────────────────────────────────
    (
      'Amoxicillin', 'อะม็อกซิซิลลิน', 'Antibiotic', 250, 'tablet', 15,
      'แจ้งสัตวแพทย์หากสัตว์มีประวัติแพ้ยากลุ่ม Penicillin',
      11.0, 'General / Soft tissue infections (q12h)',
      22.0, 'Severe infections (q12h)',
      NULL, NULL,
      11.0, 'General / Soft tissue infections (q12h)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Amoxicillin-Clavulanate', 'อะม็อกซิซิลลิน+กรดคลาวิวลานิก', 'Antibiotic', 250, 'tablet', 25,
      'ควรให้พร้อมอาหารเพื่อลดอาการคลื่นไส้ แจ้งสัตวแพทย์หากสัตว์มีประวัติแพ้ยากลุ่ม Penicillin',
      12.5, 'General / Resistant infections (q12h)',
      25.0, 'Severe infections (q12h)',
      NULL, NULL,
      12.5, 'General / Resistant infections (q12h)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Enrofloxacin', 'เอนโรฟลอกซาซิน', 'Antibiotic', 50, 'tablet', 20,
      'ห้ามใช้ในแมวเกิน 5 mg/kg/day เสี่ยงต่อภาวะตาบอด (Retinal Degeneration) ห้ามใช้ในสัตว์ที่กระดูกยังไม่โต',
      5.0, 'General infections (q24h)',
      10.0, 'Severe / Pseudomonas infections (q24h)',
      NULL, NULL,
      5.0, 'General infections — MAX DOSE ห้ามเกิน (q24h)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Doxycycline', 'ด็อกซีไซคลิน', 'Antibiotic', 100, 'capsule', 15,
      'ให้ตามด้วยน้ำมากๆ หรืออาหาร ห้ามให้แล้วนอนทันที อาจทำให้หลอดอาหารอักเสบในแมว',
      5.0, 'General / Tick-borne (q12h)',
      10.0, 'Rickettsia / Ehrlichia (q24h)',
      NULL, NULL,
      5.0, 'General / Tick-borne (q12h)',
      10.0, 'Ehrlichia / Haemobartonella (q24h)',
      NULL, NULL,
      true
    ),
    (
      'Cephalexin', 'เซฟาเล็กซิน', 'Antibiotic', 250, 'capsule', 15,
      'ควรให้พร้อมอาหารเพื่อลดอาการคลื่นไส้',
      10.0, 'General infections (q12h)',
      22.0, 'Pyoderma / Skin infections (q12h)',
      30.0, 'Deep pyoderma (q12h)',
      10.0, 'General infections (q12h)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Clindamycin', 'คลินดามัยซิน', 'Antibiotic', 150, 'capsule', 20,
      'อาจทำให้เบื่ออาหารและท้องเสีย ควรให้พร้อมอาหาร',
      5.5, 'Skin / Soft tissue (q12h)',
      11.0, 'Dental / Bone / Deep tissue (q24h)',
      NULL, NULL,
      5.5, 'Toxoplasma / Soft tissue (q12h)',
      11.0, 'Dental / Deep tissue (q24h)',
      NULL, NULL,
      true
    ),
    (
      'Metronidazole', 'เมโทรนิดาโซล', 'Antibiotic', 200, 'tablet', 10,
      'ห้ามใช้ขนาดสูงเป็นเวลานาน อาจเกิดพิษต่อระบบประสาท (Neurotoxicity) อาจทำให้คลื่นไส้อาเจียน',
      10.0, 'GI / Anaerobic infections (q12h)',
      25.0, 'Severe anaerobic / Hepatic encephalopathy (q12h)',
      15.0, 'Giardia (q12h x 5-7 days)',
      10.0, 'GI / Anaerobic infections (q12h)',
      25.0, 'Giardia (q24h x 5-7 days)',
      NULL, NULL,
      true
    ),
    (
      'Trimethoprim-Sulfamethoxazole', 'ไตรเมโทพริม+ซัลฟาเมทอกซาโซล', 'Antibiotic', 480, 'tablet', 10,
      'อาจทำให้เกิด Keratoconjunctivitis Sicca (ตาแห้ง) ในสุนัขที่ใช้ระยะยาว ควรตรวจ Schirmer Tear Test',
      15.0, 'General / UTI (q12h)',
      30.0, 'Pneumocystis / Severe (q12h)',
      NULL, NULL,
      15.0, 'General / UTI (q12h)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Marbofloxacin', 'มาร์โบฟลอกซาซิน', 'Antibiotic', 20, 'tablet', 30,
      'ห้ามใช้ในสัตว์ที่กระดูกยังไม่โต อาจเกิด Cartilage damage',
      2.0, 'General infections (q24h)',
      5.0, 'Severe / Deep infections (q24h)',
      NULL, NULL,
      2.0, 'General infections (q24h)',
      NULL, NULL, NULL, NULL,
      true
    ),

    -- ─── NSAIDs / Anti-inflammatory ──────────────────────────────────────────────
    (
      'Meloxicam', 'เมล็อกซิแคม', 'NSAIDs', 1, 'tablet', 25,
      'ระวังในสัตว์ที่มีปัญหาไต ตับ หรือระบบทางเดินอาหาร ห้ามใช้ร่วมกับ NSAID อื่นหรือ Steroid ควรตรวจเลือดก่อนใช้ระยะยาว',
      0.2, 'Day 1 Loading dose (q24h)',
      0.1, 'Maintenance — pain / inflammation (q24h)',
      NULL, NULL,
      0.1, 'Day 1 Loading dose (q24h)',
      0.05, 'Maintenance — ระวังใช้ในแมว (q24h)',
      NULL, NULL,
      true
    ),
    (
      'Carprofen', 'คาร์โปรเฟน', 'NSAIDs', 50, 'tablet', 40,
      'ระวังในสัตว์ที่มีปัญหาตับ ไต หรือระบบทางเดินอาหาร อาจเกิด Hepatotoxicity ในบางกรณี ไม่แนะนำในแมว',
      2.2, 'Musculoskeletal pain / Post-op (q12h)',
      4.4, 'Musculoskeletal pain / Post-op (q24h)',
      NULL, NULL,
      NULL, 'ไม่แนะนำในแมว — ใช้ Meloxicam แทน',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Prednisolone', 'เพรดนิโซโลน', 'NSAIDs', 5, 'tablet', 8,
      'ห้ามใช้ร่วมกับ NSAID ใช้ระยะยาวอาจเกิด Cushing syndrome, PU/PD, น้ำหนักเพิ่ม ระวังในสัตว์ที่มีเบาหวาน',
      0.5, 'Anti-inflammatory (q12-24h)',
      2.0, 'Immunosuppressive (q12h)',
      NULL, NULL,
      1.0, 'Anti-inflammatory (q12-24h)',
      2.0, 'Immunosuppressive (q12h)',
      NULL, NULL,
      true
    ),

    -- ─── Antiprotozoal / Antiparasitic ───────────────────────────────────────────
    (
      'Fenbendazole', 'เฟนเบนดาโซล', 'Antiprotozoal', 150, 'tablet', 15,
      'ปลอดภัย ไม่ค่อยพบผลข้างเคียง',
      50.0, 'Roundworm / Hookworm (q24h x 3-5 days)',
      50.0, 'Giardia (q12h x 5 days)',
      NULL, NULL,
      50.0, 'Roundworm / Hookworm (q24h x 3-5 days)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Pyrantel', 'ไพแรนเทล', 'Antiprotozoal', 250, 'tablet', 12,
      'อาจทำให้คลื่นไส้เล็กน้อย ปลอดภัยในลูกสัตว์',
      5.0, 'Roundworm (single dose)',
      14.5, 'Hookworm (single dose)',
      NULL, NULL,
      5.0, 'Roundworm (single dose)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Praziquantel', 'พราซิควอนเทล', 'Antiprotozoal', 50, 'tablet', 20,
      'ปลอดภัย ไม่ค่อยพบผลข้างเคียงในขนาดที่แนะนำ',
      5.0, 'Tapeworm (single dose)',
      NULL, NULL, NULL, NULL,
      5.0, 'Tapeworm (single dose)',
      NULL, NULL, NULL, NULL,
      true
    ),

    -- ─── Heart ───────────────────────────────────────────────────────────────────
    (
      'Furosemide', 'ฟูโรซีไมด์', 'Heart', 40, 'tablet', 10,
      'ติดตาม Electrolytes (K+, Na+) และ BUN/Creatinine อาจทำให้ขาด K+ ควรตรวจเลือดเป็นประจำ',
      1.0, 'Chronic CHF maintenance (q12-24h)',
      4.0, 'Acute pulmonary edema (q4-6h, ภายใต้การดูแล)',
      NULL, NULL,
      1.0, 'Chronic CHF maintenance (q12-24h)',
      2.0, 'Acute pulmonary edema (q4-6h)',
      NULL, NULL,
      true
    ),
    (
      'Enalapril', 'อีนาลาพริล', 'Heart', 5, 'tablet', 15,
      'อาจทำให้ความดันโลหิตต่ำ ติดตาม BUN/Creatinine และ Electrolytes ระวังในสัตว์ที่ขาดน้ำ',
      0.5, 'CHF / Proteinuria (q12-24h)',
      NULL, NULL, NULL, NULL,
      0.25, 'CHF / CKD Proteinuria (q24h)',
      0.5, 'CHF (q24h)',
      NULL, NULL,
      true
    ),
    (
      'Pimobendan', 'พิโมเบนแดน', 'Heart', 2, 'capsule', 60,
      'ควรให้ก่อนอาหาร 1 ชั่วโมงเพื่อการดูดซึมที่ดีที่สุด เพิ่มอัตราการเต้นของหัวใจ ระวังในสัตว์ที่หัวใจเต้นเร็วมากอยู่แล้ว',
      0.25, 'Dilated cardiomyopathy / MVD (q12h, ก่อนอาหาร 1 ชม.)',
      NULL, NULL, NULL, NULL,
      NULL, 'Off-label — 1.25 mg/cat q12h (ขนาดคงที่ ไม่ใช่ mg/kg — ปรึกษาสัตวแพทย์)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Atenolol', 'อะเทโนโลล', 'Heart', 25, 'tablet', 15,
      'ห้ามหยุดยาทันทีโดยไม่ค่อยๆ ลดขนาด อาจทำให้หัวใจเต้นช้าและความดันโลหิตต่ำ',
      0.5, 'Hypertrophic cardiomyopathy / Arrhythmia (q12-24h)',
      NULL, NULL, NULL, NULL,
      6.25, 'HCM — 6.25-12.5 mg/cat (q12h)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Benazepril', 'เบนาซีพริล', 'Heart', 5, 'tablet', 20,
      'ติดตาม BUN/Creatinine และ Electrolytes ระวังในสัตว์ที่ขาดน้ำหรือความดันต่ำ',
      0.5, 'CHF / CKD Proteinuria (q24h)',
      NULL, NULL, NULL, NULL,
      0.5, 'CKD Proteinuria / CHF (q24h)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Spironolactone', 'สไปโรโนแลคโตน', 'Heart', 25, 'tablet', 12,
      'ติดตาม Electrolytes (K+ อาจสูง) ระวังการใช้ร่วมกับ ACE Inhibitors อาจทำให้ K+ สูงเกิน',
      2.0, 'CHF / Ascites (q12-24h)',
      NULL, NULL, NULL, NULL,
      1.0, 'CHF / Fluid management (q24h)',
      NULL, NULL, NULL, NULL,
      true
    ),

    -- ─── Supplements ─────────────────────────────────────────────────────────────
    (
      'Omega-3 Fish Oil', 'โอเมก้า-3 น้ำมันปลา', 'Supplements', 1000, 'capsule', 15,
      'อาจทำให้ท้องเสียในขนาดสูง ควรใช้ผลิตภัณฑ์ที่ผ่านการทดสอบคุณภาพ',
      50.0, 'EPA — Skin / Kidney / Heart support (q24h)',
      NULL, NULL, NULL, NULL,
      30.0, 'EPA — Skin / Kidney support (q24h)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'SAMe', 'เอส-อะดีโนซิลเมไทโอนีน (SAMe)', 'Supplements', 90, 'tablet', 80,
      'ให้ขณะท้องว่าง (ก่อนอาหาร 2 ชั่วโมง) เพื่อการดูดซึมที่ดีที่สุด',
      17.0, 'Hepatoprotective / Cognitive support (q24h, ก่อนอาหาร)',
      NULL, NULL, NULL, NULL,
      17.0, 'Hepatoprotective (90 mg/cat q24h, ก่อนอาหาร)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Vitamin B12', 'วิตามิน บี 12 (ไซยาโนโคบาลามิน)', 'Supplements', 1, 'mL', 30,
      'ปลอดภัย ไม่ค่อยพบผลข้างเคียง แนะนำให้ SC/IM มากกว่ากินสำหรับ Cobalamin deficiency',
      0.025, 'Cobalamin deficiency / EPI (q7 days SC/IM)',
      NULL, NULL, NULL, NULL,
      0.25, 'Cobalamin deficiency / IBD (q7 days SC)',
      NULL, NULL, NULL, NULL,
      true
    ),

    -- ─── Other ───────────────────────────────────────────────────────────────────
    (
      'Omeprazole', 'โอเมพราโซล', 'Other', 20, 'capsule', 20,
      'ควรให้ก่อนอาหาร 30 นาทีเพื่อประสิทธิภาพสูงสุด การใช้ระยะยาวอาจลดการดูดซึม Vitamin B12',
      0.7, 'GI ulcer / GERD (q24h, ก่อนอาหาร)',
      1.0, 'Severe GI ulcer / Mast cell tumor (q12h)',
      NULL, NULL,
      0.7, 'GI ulcer / GERD (q24h)',
      1.0, 'Severe GI ulcer (q12h)',
      NULL, NULL,
      true
    ),
    (
      'Maropitant', 'มาโรพิแทนท์', 'Other', 16, 'tablet', 50,
      'ห้ามใช้ในลูกสัตว์อายุน้อยกว่า 16 สัปดาห์ อาจทำให้ง่วงซึมเล็กน้อย',
      2.0, 'Vomiting / Motion sickness (q24h)',
      NULL, NULL, NULL, NULL,
      1.0, 'Vomiting / Motion sickness (q24h)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Metoclopramide', 'เมโทโคลพราไมด์', 'Other', 10, 'tablet', 8,
      'อาจทำให้กระสับกระส่าย (Extrapyramidal signs) ในขนาดสูง ห้ามใช้หากสงสัย GI obstruction',
      0.25, 'Vomiting / Gastroparesis (q8h, ก่อนอาหาร 30 นาที)',
      0.5, 'Vomiting refractory (q8h)',
      NULL, NULL,
      0.25, 'Vomiting (q8h)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Sucralfate', 'ซูคราลเฟต', 'Other', 1000, 'tablet', 20,
      'ควรให้ขณะท้องว่างเพื่อประสิทธิภาพสูงสุด ห้ามให้พร้อมยาอื่น (ดูดซับยาอื่น) อาจทำให้ท้องผูก',
      50.0, 'GI ulcer — 50-100 mg/kg (q8h, ขณะท้องว่าง)',
      NULL, NULL, NULL, NULL,
      NULL, 'GI ulcer — 125-250 mg/cat ขนาดคงที่ (q8h, ขณะท้องว่าง)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Chlorpheniramine', 'คลอร์เฟนิรามีน', 'Other', 4, 'tablet', 5,
      'อาจทำให้ง่วงซึม ปากแห้ง และปัสสาวะคั่ง ระวังในสัตว์ที่มีปัญหาต่อมลูกหมากหรือต้อหิน',
      0.2, 'Allergy / Urticaria / Pruritus (q8-12h)',
      0.5, 'Severe allergy (q8h)',
      NULL, NULL,
      1.0, 'Allergy / Pruritus — 1-2 mg/cat (q8-12h)',
      NULL, NULL, NULL, NULL,
      true
    ),
    (
      'Lactulose', 'แล็กทูโลส', 'Other', 667, 'bottle', 120,
      'อาจทำให้ท้องเสียและมีลมในท้อง ปรับขนาดยาตามการตอบสนอง (เป้าหมาย: อุจจาระนิ่ม 2-3 ครั้ง/วัน)',
      0.5, 'Constipation / Hepatic encephalopathy — 0.5 mL/kg (q8h)',
      NULL, NULL, NULL, NULL,
      0.25, 'Constipation — 0.25-0.5 mL/kg (q8h)',
      NULL, NULL, NULL, NULL,
      true
    );

  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- เพิ่มยา TakeHome (General) รายการใหม่ — 100 รายการ
-- category=TakeHome, sub_category=General
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.pharmacy (
  item_name, name_th, category, sub_category, concentration_mg_unit,
  unit, price_per_unit, side_effects,
  dog_dose_1, dog_for_1, dog_dose_2, dog_for_2,
  cat_dose_1, cat_for_1, cat_dose_2, cat_for_2,
  is_medication
)
SELECT
  t.item_name, t.name_th, t.category, t.sub_category, t.conc,
  t.unit, t.price, t.side_effects,
  t.dd1, t.df1, t.dd2, t.df2,
  t.cd1, t.cf1, t.cd2, t.cf2,
  true
FROM (VALUES
  ( 'Acepromazine', 'อะซีโพรมาซีน', 'TakeHome', 'General', 10,
    'เม็ด', 5, 'อาจทำให้ความดันโลหิตต่ำ ระวังในสัตว์ที่ตกเลือดหรือช็อก เพศผู้อาจเกิดภาวะ Paraphimosis',
    1.0, 'Sedation / Pre-anesthetic (q8-12h PO)', 2.5, 'Sedation ขนาดสูง (q8-12h)',
    0.5, 'Sedation / Pre-anesthetic (q8-12h PO)', NULL, NULL ),
  ( 'Acetaminophen', 'อะเซตามิโนเฟน (พาราเซตามอล)', 'TakeHome', 'General', 500,
    'เม็ด', 5, 'ห้ามใช้ในแมวโดยเด็ดขาด เป็นพิษถึงชีวิต ทำให้เกิด Methemoglobinemia และ Hepatic necrosis ในสุนัขระวังตับเสียหาย ไม่ใช่ยาแก้ปวดตัวเลือกแรก',
    10.0, 'Pain / Fever — ใช้ด้วยความระมัดระวัง (q8-12h)', 15.0, 'Pain / Fever ขนาดสูงสุด (q8h)',
    NULL, 'ห้ามใช้ในแมวโดยเด็ดขาด — เป็นพิษถึงชีวิต', NULL, NULL ),
  ( 'Acetazolamide', 'อะซีตาโซลาไมด์', 'TakeHome', 'General', 250,
    'เม็ด', 5, 'อาจทำให้ Metabolic acidosis ไม่อยากอาหาร อ่อนแรง ตรวจ Electrolytes ระหว่างการรักษา',
    5.0, 'Glaucoma / Metabolic alkalosis (q6-8h)', 10.0, 'Glaucoma รุนแรง (q6-8h)',
    7.0, 'Glaucoma (q8-12h)', NULL, NULL ),
  ( 'Acetylcysteine', 'อะเซทิลซิสทีน', 'TakeHome', 'General', 600,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ อาเจียน มีกลิ่นเหม็น ใช้เป็น Antidote สำหรับ Acetaminophen toxicity และ Hepatoprotectant',
    70.0, 'Acetaminophen toxicity — Loading dose (q6h)', 35.0, 'Acetaminophen toxicity — Maintenance (q6h)',
    70.0, 'Antioxidant / Respiratory support (q6h)', 35.0, 'Antioxidant maintenance (q6h)' ),
  ( 'Acitretin', 'อะซิทรีติน', 'TakeHome', 'General', 25,
    'เม็ด', 5, 'ห้ามใช้ในสัตว์ตั้งท้อง (Teratogenic อย่างรุนแรง) ตรวจ Liver enzymes และ CBC เป็นระยะ อาจทำให้ผิวแห้งและผมร่วง',
    0.5, 'Keratinization disorder / Sebaceous adenitis (q24h)', 2.0, 'Keratinization disorder ขนาดสูง (q24h)',
    2.0, 'Keratinization disorder (q24h)', NULL, NULL ),
  ( 'Acyclovir', 'อะไซโคลเวียร์', 'TakeHome', 'General', 200,
    'เม็ด', 5, 'อาจทำให้ไตเสียหาย ให้น้ำเพียงพอระหว่างการรักษา ในแมวขนาดสูงอาจเป็นพิษ ต้องตรวจไตก่อนและระหว่างใช้',
    15.0, 'Herpesvirus infections (q8h)', 30.0, 'Severe herpesvirus (q8h)',
    30.0, 'FHV-1 Ocular herpesvirus (q8h) — ตรวจไตก่อนใช้', NULL, NULL ),
  ( 'Afoxolaner', 'อะฟอกโซลาเนอร์', 'TakeHome', 'General', 1,
    'เม็ด', 5, 'ไม่ได้รับการอนุมัติสำหรับแมว ในสุนัขอาจทำให้อาเจียน ท้องเสีย เบื่ออาหาร ระวังในสุนัขที่มีประวัติชัก',
    2.5, 'Flea / Tick prevention (q30 days PO)', NULL, NULL,
    NULL, 'ไม่ได้รับการอนุมัติสำหรับแมว — ไม่แนะนำ', NULL, NULL ),
  ( 'Albendazole', 'อัลเบนดาโซล', 'TakeHome', 'General', 200,
    'เม็ด', 5, 'ห้ามใช้ในสัตว์ตั้งท้อง (Teratogenic) ในแมวอาจทำให้กดไขกระดูก ตรวจ CBC ระหว่างการรักษา',
    25.0, 'Giardia / Parasitic infections (q12h x 5 days)', 50.0, 'Lungworm / Strongyloides (q12h x 3 days)',
    25.0, 'Giardia — ระมัดระวัง ตรวจ CBC ระหว่างรักษา (q12h x 2-5 days)', NULL, NULL ),
  ( 'Albuterol', 'อัลบิวทีรอล (ซัลบิวทามอล)', 'TakeHome', 'General', 2,
    'เม็ด', 5, 'อาจทำให้หัวใจเต้นเร็ว กระสับกระส่าย ตัวสั่น Hypokalemia แนะนำ Inhaler มากกว่า PO',
    0.02, 'Bronchospasm / Asthma (q4-8h PO)', 0.05, 'Bronchospasm รุนแรง (q4-8h)',
    0.02, 'Bronchospasm / Asthma (q8h) — แนะนำ Inhaler มากกว่า PO', NULL, NULL ),
  ( 'Alendronate', 'อะเลนโดรเนต', 'TakeHome', 'General', 10,
    'เม็ด', 5, 'ให้ขณะท้องว่างด้วยน้ำปริมาณมาก ห้ามนอนทันทีหลังให้ยาอย่างน้อย 30 นาที อาจทำให้หลอดอาหารอักเสบ',
    1.0, 'Hypercalcemia / Osteosarcoma (q7 days PO ขณะท้องว่าง)', NULL, NULL,
    NULL, 'Hypercalcemia — ขนาดคงที่ 10 mg/cat q7 days ขณะท้องว่าง', NULL, NULL ),
  ( 'Allopurinol', 'อัลโลพูรินอล', 'TakeHome', 'General', 100,
    'เม็ด', 5, 'อาจทำให้เกิด Xanthine urolithiasis ลดขนาดในสัตว์ที่มีปัญหาไต ระวังร่วมกับอาหารโปรตีนต่ำ',
    10.0, 'Urate urolithiasis / Leishmaniasis (q8h)', 30.0, 'Urate urolithiasis ขนาดสูง (q24h รวม)',
    15.0, 'Urate urolithiasis (q24h) — ใช้ด้วยความระมัดระวัง', NULL, NULL ),
  ( 'Alprazolam', 'อัลพราโซแลม', 'TakeHome', 'General', 0.25,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม ขาดการยับยั้งพฤติกรรม ห้ามหยุดยาทันที ต้องลดขนาดยาทีละน้อย',
    0.02, 'Anxiety / Phobias (q12h)', 0.1, 'Severe anxiety / Noise phobia (q12h)',
    0.02, 'Anxiety (q12h)', NULL, NULL ),
  ( 'Altrenogest', 'อัลทรีโนเจสต์', 'TakeHome', 'General', 1,
    'เม็ด', 5, 'ระวังการสัมผัสผ่านผิวหนัง สวมถุงมือเมื่อจัดการ เป็นอันตรายต่อหญิงตั้งครรภ์ ห้ามใช้ในสัตว์ที่มีปัญหาตับ',
    0.088, 'Progesterone supplementation / Abortion prevention (q24h)', NULL, NULL,
    0.088, 'Progesterone supplementation (q24h) — ใช้ด้วยความระมัดระวัง', NULL, NULL ),
  ( 'Aluminum hydroxide', 'อะลูมิเนียมไฮดรอกไซด์', 'TakeHome', 'General', 500,
    'เม็ด', 5, 'อาจทำให้ท้องผูก ลด Phosphorus ในเลือด ให้ร่วมอาหารเพื่อจับ Phosphate ระวังขนาดสูง',
    30.0, 'Phosphate binder / Antacid / CKD (q8-12h ให้ร่วมอาหาร)', 90.0, 'Hyperphosphatemia รุนแรง (q8h)',
    30.0, 'Phosphate binder / CKD (q8-12h ให้ร่วมอาหาร)', 60.0, 'Hyperphosphatemia (q8h)' ),
  ( 'Amantadine', 'อะแมนทาดีน', 'TakeHome', 'General', 100,
    'เม็ด', 5, 'อาจทำให้กระสับกระส่าย ท้องเสีย เบื่ออาหาร ใช้เสริม NSAIDs สำหรับ Chronic pain / Neuropathic pain',
    3.0, 'Chronic pain (adjunct) / Neuropathic pain (q24h)', 5.0, 'Chronic pain ขนาดสูง (q24h)',
    3.0, 'Chronic pain (adjunct) (q24h)', NULL, NULL ),
  ( 'Aminocaproic acid', 'อะมิโนคาโพรอิก แอซิด', 'TakeHome', 'General', 500,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ อาเจียน ท้องเสีย ระวังในสัตว์ที่มีประวัติ Thromboembolism',
    50.0, 'Hemostasis / Degenerative myelopathy (q6-8h)', 100.0, 'Hemostasis รุนแรง (q6-8h)',
    50.0, 'Hemostasis (q6-8h)', NULL, NULL ),
  ( 'Aminophylline', 'อะมิโนฟิลลีน', 'TakeHome', 'General', 100,
    'เม็ด', 5, 'อาจทำให้หัวใจเต้นเร็ว คลื่นไส้ อาเจียน กระสับกระส่าย ตรวจ Theophylline level ระหว่างใช้',
    10.0, 'Bronchospasm / COPD (q8h)', NULL, NULL,
    5.0, 'Bronchospasm / Asthma (q12h)', NULL, NULL ),
  ( 'Amiodarone', 'อะมิโอดาโรน', 'TakeHome', 'General', 200,
    'เม็ด', 5, 'อาจทำให้ตับเสียหาย ต่อมไทรอยด์ผิดปกติ ปอดอักเสบ ผิวหนังไวต่อแสง ตรวจ CBC Biochem และ Thyroid ก่อนและระหว่างใช้',
    10.0, 'Ventricular arrhythmia — Loading 10-15 mg/kg q12h x 7d', 5.0, 'Ventricular arrhythmia — Maintenance 5-10 mg/kg q24h',
    10.0, 'Arrhythmia — ใช้ด้วยความระมัดระวัง (q12h)', NULL, NULL ),
  ( 'Amitriptyline', 'อะมิทริปทิลีน', 'TakeHome', 'General', 25,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม ปากแห้ง ปัสสาวะคั่ง หัวใจเต้นผิดจังหวะ ระวังร่วมกับ MAOIs หรือยากดประสาทอื่นๆ',
    1.0, 'Behavioral / Chronic pain (q12h)', 2.0, 'OCD / Anxiety รุนแรง (q12h)',
    0.5, 'Idiopathic cystitis / Anxiety (q24h)', 1.0, 'Chronic pain (q12h)' ),
  ( 'Amlodipine', 'แอมโลดิพีน', 'TakeHome', 'General', 5,
    'เม็ด', 5, 'อาจทำให้ความดันโลหิตต่ำ อาการบวมที่แขนขา เฝ้าระวังความดันโลหิตระหว่างการรักษา',
    0.1, 'Hypertension / DCM (q24h)', 0.25, 'Hypertension รุนแรง (q24h)',
    0.63, 'Hypertension — 0.625 mg/cat ขนาดคงที่ (q24h)', NULL, NULL ),
  ( 'Amoxicillin', 'อะม็อกซิซิลลิน', 'TakeHome', 'General', 250,
    'เม็ด', 5, 'แจ้งสัตวแพทย์หากสัตว์มีประวัติแพ้ยากลุ่ม Penicillin อาจทำให้คลื่นไส้และท้องเสีย',
    11.0, 'General / Soft tissue infections (q12h)', 22.0, 'Severe infections (q12h)',
    11.0, 'General / Soft tissue infections (q12h)', NULL, NULL ),
  ( 'Amoxicillin/Clavulanate', 'อะม็อกซิซิลลิน/คลาวิวลาเนต', 'TakeHome', 'General', 250,
    'เม็ด', 5, 'ควรให้พร้อมอาหารเพื่อลดคลื่นไส้ แจ้งสัตวแพทย์หากสัตว์มีประวัติแพ้ Penicillin',
    12.5, 'General / Resistant infections (q12h)', 25.0, 'Severe infections (q12h)',
    12.5, 'General / Resistant infections (q12h)', NULL, NULL ),
  ( 'Ampicillin', 'แอมพิซิลลิน', 'TakeHome', 'General', 250,
    'เม็ด', 5, 'แจ้งสัตวแพทย์หากสัตว์มีประวัติแพ้ Penicillin การดูดซึมทางปากต่ำกว่า Amoxicillin',
    22.0, 'UTI / Respiratory infections (q8h)', 33.0, 'Severe infections (q8h)',
    22.0, 'Infections (q8h)', NULL, NULL ),
  ( 'Amprolium', 'แอมโพรเลียม', 'TakeHome', 'General', 10,
    'เม็ด', 5, 'อาจทำให้ขาด Thiamine (Vitamin B1) หากใช้นานเกินไป อาการแสดงทางระบบประสาท ให้ Thiamine เสริมหากจำเป็น',
    150.0, 'Coccidiosis (q24h x 5-10 days)', 200.0, 'Coccidiosis รุนแรง (q24h x 5-7 days)',
    60.0, 'Coccidiosis (q24h x 5-7 days)', 100.0, 'Coccidiosis รุนแรง (q24h x 7 days)' ),
  ( 'Ascorbic acid', 'วิตามิน ซี (กรดแอสคอร์บิก)', 'TakeHome', 'General', 500,
    'เม็ด', 5, 'ขนาดสูงอาจทำให้ท้องเสียและ Oxalate urolithiasis ระวังในสัตว์ที่มีประวัตินิ่วในไต',
    10.0, 'Antioxidant / Urinary acidifier (q12h)', 30.0, 'Antioxidant ขนาดสูง (q12h)',
    10.0, 'Antioxidant (q24h)', NULL, NULL ),
  ( 'Aspirin', 'แอสไพริน', 'TakeHome', 'General', 325,
    'เม็ด', 5, 'ห้ามใช้ความถี่เดียวกับสุนัขในแมว — แมวเมแทบอลิซึมช้ากว่ามาก ต้องให้ q48-72h เท่านั้น อาจทำให้ GI ulcer, GI bleeding และพิษซาลิไซเลตในแมว',
    10.0, 'Antiplatelet / Mild pain (q12h ให้ร่วมอาหาร)', 25.0, 'Fever / Inflammation (q12h)',
    10.0, 'Antiplatelet — ระมัดระวัง ใช้เฉพาะ q48-72h เท่านั้น (ห้ามให้ถี่เท่าสุนัข)', NULL, NULL ),
  ( 'Atenolol', 'อาทีโนลอล', 'TakeHome', 'General', 25,
    'เม็ด', 5, 'อาจทำให้หัวใจเต้นช้าและความดันโลหิตต่ำ ระวังในสัตว์ที่มีหัวใจล้มเหลวรุนแรง ห้ามหยุดยาทันที',
    0.25, 'Hypertension / Arrhythmia (q12-24h)', 1.0, 'Tachyarrhythmia รุนแรง (q12h)',
    2.0, 'HCM / Hypertension / Tachyarrhythmia (q12h)', NULL, NULL ),
  ( 'Avermectin', 'อะเวอร์เมกติน (ไอเวอร์เมกติน)', 'TakeHome', 'General', 1,
    'เม็ด', 5, 'ห้ามใช้ในพันธุ์สุนัขที่มียีน MDR1 mutation (Collie, Sheltie, Border Collie, Shetland Sheepdog) อาจทำให้ชัก อัมพาต และตายได้',
    0.006, 'Heartworm prevention — 6-12 mcg/kg (q30 days)', 0.2, 'Sarcoptic mange / Demodicosis — 200-400 mcg/kg (q7-14 days ระวัง MDR1)',
    0.024, 'Heartworm prevention — 24 mcg/kg (q30 days)', NULL, NULL ),
  ( 'Azathioprine', 'อาซาไธโอพรีน', 'TakeHome', 'General', 50,
    'เม็ด', 5, 'ห้ามใช้ในแมวโดยเด็ดขาด ทำให้กดไขกระดูกรุนแรงและเป็นอันตรายถึงชีวิต ในสุนัขตรวจ CBC ทุก 1-2 สัปดาห์ อาจทำให้ตับเสียหาย',
    2.0, 'Immune-mediated disease / IMHA (q24h x 14 days)', 1.0, 'Immune-mediated — Maintenance (q48h)',
    NULL, 'ห้ามใช้ในแมวโดยเด็ดขาด — กดไขกระดูกรุนแรง เป็นอันตรายถึงชีวิต', NULL, NULL ),
  ( 'Azithromycin', 'อะซิโทรมัยซิน', 'TakeHome', 'General', 250,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ อาเจียน ท้องเสีย ให้ร่วมหรือก่อนอาหารเพื่อลดผลข้างเคียง GI ระวัง QT prolongation',
    5.0, 'Respiratory / Soft tissue infections (q24h x 5-7 days)', 10.0, 'Severe infections / Toxoplasma (q24h)',
    5.0, 'Respiratory / Chlamydia (q24h x 5-7 days)', 15.0, 'Toxoplasma (q72h)' ),
  ( 'Baclofen', 'แบคโลเฟน', 'TakeHome', 'General', 10,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม อาเจียน กล้ามเนื้ออ่อนแรง ในแมวอาจเป็นพิษในขนาดสูง ระวังในสัตว์ที่มีปัญหาไต',
    1.0, 'Muscle spasm / Urethral spasm (q8h)', 2.0, 'Muscle spasm รุนแรง (q8h)',
    0.5, 'Muscle spasm — ใช้ขนาดต่ำ ระวังพิษ (q8h)', NULL, NULL ),
  ( 'Barium sulfate', 'แบเรียมซัลเฟต', 'TakeHome', 'General', 100,
    'เม็ด', 5, 'ห้ามใช้หากสงสัย GI perforation หรือ Obstruction อาจทำให้ท้องผูกและสำลักได้ ใช้เพื่อ Radiographic contrast เท่านั้น',
    5.0, 'GI contrast study — 5-10 mL/kg (ครั้งเดียว)', NULL, NULL,
    5.0, 'GI contrast study — 5 mL/kg (ครั้งเดียว)', NULL, NULL ),
  ( 'Benazepril', 'เบนาซีพริล', 'TakeHome', 'General', 5,
    'เม็ด', 5, 'อาจทำให้ความดันโลหิตต่ำ Hyperkalemia ตรวจ Renal function และ Electrolytes เป็นระยะ',
    0.25, 'CKD / Hypertension / Heart failure (q24h)', 0.5, 'CKD / Proteinuria รุนแรง (q24h)',
    0.5, 'CKD / Hypertension (q24h)', 1.0, 'CKD รุนแรง (q24h)' ),
  ( 'Betamethasone', 'เบตาเมทาโซน', 'TakeHome', 'General', 0.5,
    'เม็ด', 5, 'การใช้ระยะยาวทำให้ภูมิคุ้มกันต่ำ กล้ามเนื้ออ่อนแรง Diabetes mellitus Cushing syndrome ห้ามหยุดยาทันที',
    0.05, 'Anti-inflammatory / Allergy (q24h)', 0.1, 'Anti-inflammatory รุนแรง (q24h)',
    0.05, 'Anti-inflammatory / Allergy (q24h)', 0.1, 'Anti-inflammatory รุนแรง (q24h)' ),
  ( 'Bethanechol', 'เบทาเนโคล', 'TakeHome', 'General', 5,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ น้ำลายไหลมาก ท้องเสีย ปัสสาวะบ่อย ห้ามใช้หาก GI หรือ Urinary obstruction',
    0.5, 'Urinary retention / Atonic bladder (q8h)', 2.0, 'Urinary retention รุนแรง (q8h)',
    NULL, 'Urinary retention — ขนาดคงที่ 1.25-5 mg/cat (q8h)', NULL, NULL ),
  ( 'Bisacodyl', 'บิซาโคดิล', 'TakeHome', 'General', 5,
    'เม็ด', 5, 'อาจทำให้ปวดท้อง ท้องเสีย สูญเสีย Electrolytes ไม่ควรใช้ยาวนาน ห้ามให้พร้อมยาลดกรด',
    NULL, 'Constipation — ขนาดคงที่ 5-20 mg/dog (q24h PO)', NULL, NULL,
    NULL, 'Constipation — ขนาดคงที่ 5 mg/cat (q24h PO)', NULL, NULL ),
  ( 'Bismuth subsalicylate', 'บิสมัทซับซาลิไซเลต', 'TakeHome', 'General', 262,
    'เม็ด', 5, 'ระวังในแมวอย่างมาก มีซาลิไซเลตซึ่งเป็นพิษต่อแมว อาจทำให้อุจจาระและลิ้นดำชั่วคราว ระวังร่วมกับ Aspirin',
    2.2, 'Diarrhea / Gastroenteritis (q4-6h)', 4.4, 'Diarrhea รุนแรง (q4-6h)',
    NULL, 'ระวังอย่างมาก — มีซาลิไซเลตเป็นพิษต่อแมว ใช้เฉพาะเมื่อจำเป็นและขนาดต่ำมาก', NULL, NULL ),
  ( 'Buspirone', 'บัสไพโรน', 'TakeHome', 'General', 10,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม กระสับกระส่าย ระวังร่วมกับ MAOIs หรือ Serotonin-affecting drugs ใช้เวลาหลายสัปดาห์เพื่อเห็นผล',
    0.5, 'Anxiety / Noise phobia (q8-12h)', 1.0, 'Separation anxiety (q8h)',
    0.5, 'Anxiety / Inappropriate elimination (q12h)', NULL, NULL ),
  ( 'Busulfan', 'บัสซัลแฟน', 'TakeHome', 'General', 2,
    'เม็ด', 5, 'ยาเคมีบำบัด อาจทำให้กดไขกระดูกรุนแรง ต้องตรวจ CBC อย่างน้อยทุกสัปดาห์ สวมถุงมือเมื่อจัดการยา',
    0.1, 'Chronic myelogenous leukemia — ขึ้นอยู่กับพื้นที่ผิวร่างกาย (q24h)', NULL, NULL,
    0.1, 'Myeloproliferative disease — ขึ้นอยู่กับพื้นที่ผิวร่างกาย (q24h)', NULL, NULL ),
  ( 'Butorphanol', 'บิวทอร์ฟานอล', 'TakeHome', 'General', 1,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม คลื่นไส้ ระวังในสัตว์ที่มีปัญหาทางเดินหายใจ ประสิทธิภาพต่ำเมื่อให้ทางปาก',
    0.2, 'Cough suppressant / Mild pain (q6-8h PO)', 0.4, 'Cough / Pain (q6-8h)',
    0.2, 'Cough suppressant (q6-8h)', 0.4, 'Pain management (q6-8h)' ),
  ( 'Cabergoline', 'คาเบอร์โกลีน', 'TakeHome', 'General', 0.5,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ อาเจียน เบื่ออาหาร ระวังในสัตว์ที่มีปัญหาตับหรือไต ห้ามใช้ในสัตว์ตั้งท้องที่ต้องการคงการตั้งท้อง',
    0.005, 'False pregnancy / Lactation suppression (q24h x 5 days)', NULL, NULL,
    0.005, 'False pregnancy / Prolactin-related disorders (q24h)', NULL, NULL ),
  ( 'Calcitriol', 'แคลซิไทรออล', 'TakeHome', 'General', 0.00025,
    'เม็ด', 5, 'ระวัง Hypercalcemia ต้องตรวจ Ca2+ ในเลือดเป็นระยะ ขนาดสูงอาจทำให้ไตเสียหายจาก Calcium deposit ขนาดยาเป็น ng/kg ไม่ใช่ mg/kg',
    0.003, 'CKD Secondary hyperparathyroidism — 2.5-3.5 ng/kg (q24h) ตรวจ Ca2+ สม่ำเสมอ', NULL, NULL,
    0.003, 'Hypoparathyroidism / CKD — 2.5 ng/kg (q24h) ตรวจ Ca2+ สม่ำเสมอ', NULL, NULL ),
  ( 'Calcium carbonate', 'แคลเซียมคาร์บอเนต', 'TakeHome', 'General', 500,
    'เม็ด', 5, 'อาจทำให้ท้องผูก ท้องอืด ให้ร่วมอาหารเพื่อจับ Phosphate ระวัง Hypercalcemia',
    45.0, 'Phosphate binder / Ca supplement / CKD (q8h ให้ร่วมอาหาร)', 90.0, 'Hyperphosphatemia (q8h)',
    45.0, 'Phosphate binder / CKD (q8-12h)', NULL, NULL ),
  ( 'Capromorelin', 'คาโปรโมเรลิน', 'TakeHome', 'General', 30,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ อาเจียน เซื่องซึม ระวังใน Diabetes mellitus เพราะเพิ่ม GH/IGF-1',
    3.0, 'Appetite stimulation / Cancer cachexia (q24h PO)', NULL, NULL,
    NULL, 'ยังไม่มีข้อมูลเพียงพอสำหรับแมว — ใช้ด้วยความระมัดระวัง', NULL, NULL ),
  ( 'Captopril', 'แคปโตพริล', 'TakeHome', 'General', 12.5,
    'เม็ด', 5, 'อาจทำให้ความดันโลหิตต่ำ Hyperkalemia ไตเสียหาย ตรวจ BUN/Creatinine และ Electrolytes เป็นระยะ',
    0.5, 'Hypertension / Heart failure / CKD (q8-12h)', 2.0, 'Heart failure (q8h)',
    NULL, 'Hypertension / CKD — ขนาดคงที่ 3.12-6.25 mg/cat (q8h)', NULL, NULL ),
  ( 'Carprofen', 'คาร์โพรเฟน', 'TakeHome', 'General', 25,
    'เม็ด', 5, 'ระวัง GI ulcer ตับเสียหาย ไตเสียหาย ตรวจ CBC และ Biochemistry ก่อนและระหว่างการรักษา',
    2.2, 'Pain / OA / Post-op (q12h)', 4.4, 'Pain / Inflammation (q24h)',
    NULL, 'ไม่แนะนำในแมว — ขาดข้อมูลความปลอดภัย ใช้เฉพาะเมื่อจำเป็น', NULL, NULL ),
  ( 'Cefaclor', 'เซฟาคลอร์', 'TakeHome', 'General', 250,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ อาเจียน ท้องเสีย แจ้งสัตวแพทย์หากสัตว์มีประวัติแพ้ Cephalosporin หรือ Penicillin',
    20.0, 'Bacterial infections (q8h)', NULL, NULL,
    20.0, 'Bacterial infections (q8h)', NULL, NULL ),
  ( 'Cefadroxil', 'เซฟาโดรซิล', 'TakeHome', 'General', 500,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ อาเจียน ท้องเสีย แจ้งสัตวแพทย์หากสัตว์มีประวัติแพ้ Cephalosporin',
    22.0, 'Skin / UTI infections (q12h)', NULL, NULL,
    22.0, 'Skin / UTI infections (q12h)', NULL, NULL ),
  ( 'Cefdinir', 'เซฟดินีร์', 'TakeHome', 'General', 300,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ ท้องเสีย สีแดงในอุจจาระ (ไม่ใช่เลือด) แจ้งสัตวแพทย์หากแพ้ Cephalosporin',
    10.0, 'Respiratory / Skin infections (q12h)', 20.0, 'Severe infections (q12h)',
    10.0, 'Respiratory / Skin infections (q12h)', NULL, NULL ),
  ( 'Cefixime', 'เซฟิกซีม', 'TakeHome', 'General', 100,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ ท้องเสีย ปวดท้อง แจ้งสัตวแพทย์หากแพ้ Cephalosporin',
    5.0, 'UTI / Respiratory infections (q12h)', 10.0, 'Systemic infections (q24h)',
    10.0, 'Infections (q24h)', NULL, NULL ),
  ( 'Cefpodoxime', 'เซฟโปดอกซีม', 'TakeHome', 'General', 100,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ ท้องเสีย ให้ร่วมอาหาร แจ้งสัตวแพทย์หากแพ้ Cephalosporin',
    10.0, 'Skin / UTI / Respiratory infections (q24h)', NULL, NULL,
    10.0, 'Skin / UTI infections (q24h)', NULL, NULL ),
  ( 'Cephalexin', 'เซฟาเล็กซิน', 'TakeHome', 'General', 500,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ ท้องเสีย แจ้งสัตวแพทย์หากแพ้ Cephalosporin',
    22.0, 'Skin / Soft tissue / UTI infections (q8-12h)', 33.0, 'Severe pyoderma (q8h)',
    22.0, 'Skin / UTI infections (q12h)', NULL, NULL ),
  ( 'Cetirizine', 'เซทิริซีน', 'TakeHome', 'General', 10,
    'เม็ด', 5, 'อาจทำให้ง่วงซึมเล็กน้อย ปากแห้ง น้อยกว่า 1st-gen antihistamine ระวังในสัตว์ที่มีปัญหาไต',
    0.5, 'Allergy / Pruritus / Urticaria (q24h)', 1.0, 'Allergy รุนแรง (q24h)',
    0.5, 'Allergy / Pruritus (q24h)', NULL, NULL ),
  ( 'Charcoal (Activated)', 'ถ่านกัมมันต์ (Activated Charcoal)', 'TakeHome', 'General', 500,
    'เม็ด', 5, 'ระวังการสำลัก อาจทำให้อุจจาระดำ ไม่มีประสิทธิภาพสำหรับ Heavy metals, Ethanol, Xylitol ควรให้โดยสัตวแพทย์',
    1.0, 'Toxin adsorption — 1-4 g/kg (ครั้งเดียวหรือตาม Protocol)', 4.0, 'Toxin adsorption ขนาดสูงสุด (ครั้งเดียว)',
    1.0, 'Toxin adsorption — 1-2 g/kg (ระวังสำลัก)', 2.0, 'Toxin adsorption ขนาดสูง (ครั้งเดียว)' ),
  ( 'Chlorambucil', 'คลอแรมบิวซิล', 'TakeHome', 'General', 2,
    'เม็ด', 5, 'ยาเคมีบำบัด อาจทำให้กดไขกระดูก คลื่นไส้ ชักในขนาดสูง ตรวจ CBC ทุก 1-2 สัปดาห์ สวมถุงมือเมื่อจัดการยา',
    0.1, 'Lymphoma / CLL / Immune-mediated disease (q24h)', 0.2, 'Lymphoma ขนาดสูง (q24h)',
    0.1, 'Lymphoma / IBD / Immune-mediated (q24h หรือ q48h)', NULL, NULL ),
  ( 'Chloramphenicol', 'คลอแรมเฟนิคอล', 'TakeHome', 'General', 250,
    'เม็ด', 5, 'ห้ามสัมผัสโดยหญิงตั้งครรภ์ อาจทำให้กดไขกระดูก (โดยเฉพาะในแมว) ตรวจ CBC เป็นระยะ',
    40.0, 'Broad-spectrum bacterial infections (q8h)', 50.0, 'Severe infections (q8h)',
    12.5, 'Bacterial infections — ขนาดต่ำในแมว ระวัง Bone marrow suppression (q12h)', 20.0, 'Severe infections (q12h)' ),
  ( 'Chlorpheniramine', 'คลอร์เฟนิรามีน', 'TakeHome', 'General', 4,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม ปากแห้ง ปัสสาวะคั่ง ระวังในสัตว์ที่มีปัญหาต่อมลูกหมากหรือต้อหิน',
    0.2, 'Allergy / Pruritus / Urticaria (q8-12h)', 0.5, 'Allergy รุนแรง (q8h)',
    1.0, 'Allergy / Pruritus — 1-2 mg/cat (q8-12h)', NULL, NULL ),
  ( 'Chlortetracycline', 'คลอร์เตตราไซคลีน', 'TakeHome', 'General', 250,
    'เม็ด', 5, 'ห้ามใช้ในสัตว์อายุน้อย (ทำให้ฟันและกระดูกเปลี่ยนสี) อาจทำให้ GI upset ให้ร่วมอาหาร',
    25.0, 'Bacterial / Rickettsial infections (q8h)', NULL, NULL,
    25.0, 'Bacterial infections (q8-12h)', NULL, NULL ),
  ( 'Cimetidine', 'ไซเมทิดีน', 'TakeHome', 'General', 400,
    'เม็ด', 5, 'มีปฏิกิริยากับยาหลายชนิด ยับยั้ง Cytochrome P450 อาจทำให้ปวดหัว วิงเวียน',
    5.0, 'GI ulcer / Acid reflux (q6-8h)', 10.0, 'GI ulcer / Mast cell disease (q6-8h)',
    2.5, 'GI ulcer / Acid reflux (q6-8h)', 5.0, 'GI ulcer รุนแรง (q6-8h)' ),
  ( 'Ciprofloxacin', 'ไซโพรฟลอกซาซิน', 'TakeHome', 'General', 500,
    'เม็ด', 5, 'ห้ามใช้ในสัตว์ที่กระดูกยังไม่โต อาจทำให้ Cartilage เสียหาย ในแมวระวังขนาดสูงอาจทำให้ Retinal degeneration',
    10.0, 'Bacterial infections / UTI (q12h)', 20.0, 'Severe infections (q12h)',
    10.0, 'Bacterial infections — ไม่เกิน 15 mg/kg ระวัง Retinal toxicity (q12h)', NULL, NULL ),
  ( 'Cisapride', 'ซิซาไพรด์', 'TakeHome', 'General', 5,
    'เม็ด', 5, 'อาจทำให้ท้องเสีย ปวดท้อง QT prolongation ระวังร่วมกับยาที่ยับยั้ง CYP3A4',
    0.1, 'GI motility disorder / Gastroparesis (q8-12h)', 0.5, 'Constipation / Megacolon (q8h)',
    NULL, 'Megacolon / GI motility — ขนาดคงที่ 1.25-2.5 mg/cat (q8-12h)', NULL, NULL ),
  ( 'Clarithromycin', 'คลาริโทรมัยซิน', 'TakeHome', 'General', 250,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ อาเจียน ท้องเสีย ปวดท้อง ระวัง Drug interactions (inhibits CYP3A4)',
    7.5, 'Bacterial infections / Helicobacter (q12h)', NULL, NULL,
    7.5, 'Bacterial infections (q12h)', NULL, NULL ),
  ( 'Clemastine', 'คลีมาสตีน', 'TakeHome', 'General', 1,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม ปากแห้ง ปัสสาวะคั่ง เป็น H1 antihistamine สำหรับ Allergy',
    0.05, 'Allergy / Pruritus / Urticaria (q12h)', 0.1, 'Allergy รุนแรง (q12h)',
    NULL, 'Allergy — ขนาดคงที่ 0.67 mg/cat (q12h)', NULL, NULL ),
  ( 'Clindamycin', 'คลินดาไมซิน', 'TakeHome', 'General', 75,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ อาเจียน ท้องเสีย ให้น้ำมากพร้อมยา อาจทำให้ Antibiotic-associated colitis',
    5.5, 'Soft tissue / Dental / Toxoplasma (q12h)', 11.0, 'Anaerobic infections / Severe bone infections (q12h)',
    11.0, 'Toxoplasma / Soft tissue (q12h)', NULL, NULL ),
  ( 'Clomipramine', 'โคลมิพรามีน', 'TakeHome', 'General', 25,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม ปากแห้ง ปัสสาวะคั่ง หัวใจเต้นผิดจังหวะ ระวังร่วมกับ MAOIs',
    1.0, 'OCD / Separation anxiety (q12h)', 3.0, 'OCD รุนแรง (q12h)',
    0.5, 'Behavioral / Anxiety (q24h)', NULL, NULL ),
  ( 'Clonazepam', 'โคลนาเซแพม', 'TakeHome', 'General', 0.5,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม ง่วงนอน ขาดการยับยั้งพฤติกรรม ห้ามหยุดยาทันที ต้องลดขนาดยาทีละน้อย',
    0.02, 'Seizures / Anxiety (q8-12h)', 0.1, 'Seizure cluster (q8h)',
    0.017, 'Seizures / Anxiety (q12h)', NULL, NULL ),
  ( 'Clonidine', 'โคลนิดีน', 'TakeHome', 'General', 0.1,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม ความดันโลหิตต่ำ หัวใจเต้นช้า ห้ามหยุดยาทันที',
    0.01, 'Anxiety / Hypertension (q8-12h)', 0.02, 'Anxiety รุนแรง (q8-12h)',
    0.01, 'Anxiety / Hypertension (q12h)', NULL, NULL ),
  ( 'Clopidogrel', 'โคลพิโดเกรล', 'TakeHome', 'General', 75,
    'เม็ด', 5, 'อาจทำให้เลือดออกได้ง่าย ห้ามร่วมกับ NSAIDs หรือ Aspirin โดยไม่ระวัง ระวังในสัตว์ที่ต้องผ่าตัด',
    1.0, 'Antiplatelet / Aortic thromboembolism prevention (q24h)', 3.0, 'Antiplatelet ขนาดสูง (q24h)',
    NULL, 'Antiplatelet / ATE prevention — ขนาดคงที่ 18.75 mg/cat (q24h)', NULL, NULL ),
  ( 'Clorazepate', 'โคลราเซเพต', 'TakeHome', 'General', 3.75,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม ง่วงนอน ขาดการยับยั้งพฤติกรรม ห้ามหยุดยาทันที',
    0.5, 'Anxiety / Seizures (q12h)', 2.2, 'Anxiety รุนแรง / Seizures (q12h)',
    0.5, 'Anxiety / Seizures (q12h)', NULL, NULL ),
  ( 'Cloxacillin', 'โคลซาซิลลิน', 'TakeHome', 'General', 250,
    'เม็ด', 5, 'แจ้งสัตวแพทย์หากสัตว์มีประวัติแพ้ Penicillin ใช้สำหรับ Staphylococcal infections โดยเฉพาะ',
    20.0, 'Staphylococcal skin / Bone infections (q8h)', 40.0, 'Severe Staphylococcal infections (q8h)',
    20.0, 'Staphylococcal infections (q8h)', NULL, NULL ),
  ( 'Codeine', 'โคดีน', 'TakeHome', 'General', 30,
    'เม็ด', 5, 'ไม่แนะนำในแมวเนื่องจากเมแทบอลิซึมที่แตกต่าง มีความเสี่ยงต่อพิษ อาจทำให้ง่วงซึม ท้องผูก หายใจช้าในสุนัข',
    0.5, 'Cough suppressant / Mild pain (q6-8h)', 1.0, 'Pain / Cough รุนแรง (q6-8h)',
    NULL, 'ไม่แนะนำในแมว — เมแทบอลิซึมต่างจากสุนัข มีความเสี่ยงต่อพิษ CNS', NULL, NULL ),
  ( 'Colchicine', 'โคลชิซีน', 'TakeHome', 'General', 0.5,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ อาเจียน ท้องเสีย อาจยับยั้งการทำงานของไขกระดูกในขนาดสูง ตรวจ CBC เป็นระยะ',
    0.025, 'Hepatic fibrosis / Amyloidosis (q24h)', 0.03, 'Hepatic fibrosis ขนาดสูง (q24h)',
    NULL, 'ยังไม่มีข้อมูลเพียงพอในแมว — ใช้ด้วยความระมัดระวัง', NULL, NULL ),
  ( 'Cyclophosphamide', 'ไซโคลฟอสฟาไมด์', 'TakeHome', 'General', 50,
    'เม็ด', 5, 'ยาเคมีบำบัด อาจทำให้กดไขกระดูก Hemorrhagic cystitis ต้องดื่มน้ำมาก ตรวจ CBC บ่อยๆ สวมถุงมือเมื่อจัดการ',
    2.0, 'Lymphoma / Immune-mediated disease — ขึ้นอยู่กับพื้นที่ผิวร่างกาย (q24h x 4 days)', NULL, NULL,
    NULL, 'Lymphoma — ขึ้นอยู่กับพื้นที่ผิวร่างกาย ตรวจ CBC เป็นระยะ', NULL, NULL ),
  ( 'Cyclosporine', 'ไซโคลสปอริน', 'TakeHome', 'General', 25,
    'เม็ด', 5, 'ควรให้ขณะท้องว่างเพื่อดูดซึมที่ดี อาจทำให้คลื่นไส้ อาเจียน เหงือกงอก (Gingival hyperplasia) ระวัง Drug interactions',
    5.0, 'Atopy / Immune-mediated disease (q24h)', NULL, NULL,
    7.0, 'Atopy / Immune-mediated disease (q24h)', NULL, NULL ),
  ( 'Cyproheptadine', 'ไซโปรเฮปทาดีน', 'TakeHome', 'General', 4,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม เพิ่มความอยากอาหาร ระวังน้ำหนักเพิ่มขึ้น Serotonin antagonist',
    1.1, 'Appetite stimulant / Serotonin antagonist (q8-12h)', NULL, NULL,
    1.0, 'Appetite stimulant / Idiopathic hypersalivation — 1-2 mg/cat (q8-12h)', NULL, NULL ),
  ( 'Danazol', 'ดาโนโซล', 'TakeHome', 'General', 100,
    'เม็ด', 5, 'อาจทำให้ตับเสียหาย น้ำหนักเพิ่ม Virilization ในเพศเมีย ตรวจ Liver enzymes เป็นระยะ',
    5.0, 'Immune-mediated hemolytic anemia / ITP (q12h)', NULL, NULL,
    5.0, 'Immune-mediated hemolytic anemia (q12h)', NULL, NULL ),
  ( 'Dantrolene', 'แดนโทรลีน', 'TakeHome', 'General', 25,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม กล้ามเนื้ออ่อนแรง ตับเสียหายในขนาดสูง ตรวจ Liver enzymes ระหว่างใช้',
    1.0, 'Muscle spasm / Malignant hyperthermia (q8h)', 5.0, 'Malignant hyperthermia รุนแรง (q8h)',
    0.5, 'Muscle spasm / Urethral spasm (q8h)', 2.0, 'Malignant hyperthermia (q8h)' ),
  ( 'Dapsone', 'แดปโซน', 'TakeHome', 'General', 50,
    'เม็ด', 5, 'ห้ามใช้ในแมวโดยเด็ดขาด เป็นพิษอย่างรุนแรง ทำให้ Methemoglobinemia ในสุนัขตรวจ CBC เป็นระยะ ระวัง Hemolytic anemia',
    1.0, 'Immune-mediated skin disease / Pemphigus (q8h)', NULL, NULL,
    NULL, 'ห้ามใช้ในแมวโดยเด็ดขาด — เป็นพิษรุนแรง Methemoglobinemia ถึงชีวิต', NULL, NULL ),
  ( 'Deracoxib', 'เดราโคซีบ', 'TakeHome', 'General', 25,
    'เม็ด', 5, 'ระวัง GI ulcer ตับเสียหาย ไตเสียหาย ตรวจ Biochemistry ก่อนและระหว่างการรักษา ไม่แนะนำในแมว',
    1.0, 'OA Pain / Inflammation (q24h)', 3.0, 'Perioperative pain (q24h)',
    NULL, 'ไม่ได้รับการอนุมัติและไม่แนะนำในแมว', NULL, NULL ),
  ( 'Dexamethasone', 'เดกซาเมทาโซน', 'TakeHome', 'General', 0.5,
    'เม็ด', 5, 'การใช้ระยะยาวทำให้ภูมิคุ้มกันต่ำ Cushing syndrome กล้ามเนื้ออ่อนแรง Diabetes mellitus ห้ามหยุดยาทันที',
    0.1, 'Anti-inflammatory / Allergy (q24h)', 0.2, 'Immune-mediated disease รุนแรง (q24h)',
    0.1, 'Anti-inflammatory / Allergy (q24h)', 0.2, 'Immune-mediated disease (q24h)' ),
  ( 'Dextromethorphan', 'เดกซ์โตรเมทอร์แฟน', 'TakeHome', 'General', 15,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม กระสับกระส่าย ระวังผลิตภัณฑ์ที่มีส่วนผสม Xylitol หรือ Acetaminophen ซึ่งเป็นพิษต่อสัตว์',
    1.0, 'Cough suppressant (q6-8h)', 2.0, 'Cough รุนแรง (q6-8h)',
    0.5, 'Cough suppressant — ข้อมูลจำกัดในแมว (q8h)', NULL, NULL ),
  ( 'Diazepam', 'ไดอาเซแพม', 'TakeHome', 'General', 2,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม ระวัง Hepatotoxicity ในแมวเมื่อให้ PO (ไม่แนะนำ PO ในแมว) ห้ามหยุดยาทันที',
    0.2, 'Anxiety / Seizures (q8h)', 0.5, 'Seizure cluster / Muscle spasm (q8h)',
    NULL, 'ไม่แนะนำให้ PO ในแมว เสี่ยง Idiosyncratic hepatotoxicity — ใช้ทางอื่น', NULL, NULL ),
  ( 'Diazoxide', 'ไดอาโซกไซด์', 'TakeHome', 'General', 50,
    'เม็ด', 5, 'อาจทำให้ Hyperglycemia Sodium/Water retention เบื่ออาหาร ตรวจน้ำตาลเลือดระหว่างการรักษา',
    5.0, 'Insulinoma / Hypoglycemia (q12h)', 30.0, 'Insulinoma รุนแรง (q12h)',
    5.0, 'Insulinoma / Hypoglycemia (q12h)', NULL, NULL ),
  ( 'Diclofenac', 'ไดโคลฟีแนค', 'TakeHome', 'General', 25,
    'เม็ด', 5, 'ระวัง GI ulcer ไตเสียหาย ไม่แนะนำในแมว ตรวจ Biochemistry ก่อนและระหว่างการรักษา',
    1.0, 'Pain / Inflammation (q12-24h)', 2.0, 'OA Pain (q12h)',
    NULL, 'ไม่แนะนำในแมว — เป็นพิษต่อระบบ GI และไต', NULL, NULL ),
  ( 'Dicloxacillin', 'ไดโคลซาซิลลิน', 'TakeHome', 'General', 250,
    'เม็ด', 5, 'แจ้งสัตวแพทย์หากสัตว์มีประวัติแพ้ Penicillin ใช้สำหรับ Penicillinase-producing Staphylococci',
    10.0, 'Staphylococcal infections (q8h)', 25.0, 'Severe Staphylococcal infections (q8h)',
    10.0, 'Staphylococcal infections (q8h)', NULL, NULL ),
  ( 'Diethylstilbestrol', 'ไดเอทิลสทิลเบสทรอล (DES)', 'TakeHome', 'General', 1,
    'เม็ด', 5, 'ขนาดยาเป็นแบบ Fixed dose ไม่ใช่ mg/kg อาจทำให้กดไขกระดูก Pyometra ในเพศเมีย ระวังการใช้ระยะยาว ตรวจ CBC เป็นระยะ',
    0.1, 'Urinary incontinence — ขนาดคงที่ 0.1-1 mg/dog q24h (สุนัขเพศเมีย) เริ่มที่ขนาดต่ำ', NULL, NULL,
    NULL, 'ไม่ค่อยใช้ในแมว — ปรึกษาสัตวแพทย์', NULL, NULL ),
  ( 'Digoxin', 'ไดจอกซิน', 'TakeHome', 'General', 0.125,
    'เม็ด', 5, 'ยาดัชนีการรักษาแคบมาก ต้องตรวจ Digoxin level เป็นระยะ อาการพิษ: คลื่นไส้ อาเจียน หัวใจเต้นผิดจังหวะ',
    0.005, 'CHF / Atrial fibrillation (q12h) — ตรวจ Digoxin level', 0.011, 'Atrial fibrillation ขนาดสูง (q12h) — ตรวจ Level อย่างใกล้ชิด',
    0.005, 'CHF — ขนาดต่ำมาก 0.005 mg/kg q24h ระวังพิษ ตรวจ Level', NULL, NULL ),
  ( 'Dihydrotachysterol', 'ไดไฮโดรทาคิสเทอรอล', 'TakeHome', 'General', 0.125,
    'เม็ด', 5, 'ระวัง Hypercalcemia ต้องตรวจ Ca2+ ในเลือดเป็นระยะ ขนาดสูงทำให้ไตเสียหายจาก Calcium deposit',
    0.02, 'Hypoparathyroidism — Loading (q24h จากนั้นลดลง q7d)', NULL, NULL,
    0.01, 'Hypoparathyroidism (q24h) ตรวจ Ca2+ สม่ำเสมอ', NULL, NULL ),
  ( 'Diltiazem', 'ดิลไทอาเซม', 'TakeHome', 'General', 30,
    'เม็ด', 5, 'อาจทำให้หัวใจเต้นช้าและความดันโลหิตต่ำ ระวังในสัตว์ที่มีหัวใจล้มเหลว AV block',
    0.5, 'Arrhythmia / Hypertension (q8h)', 1.5, 'Tachyarrhythmia รุนแรง (q8h)',
    1.75, 'HCM / Tachyarrhythmia (q8h)', 2.5, 'HCM รุนแรง (q8h)' ),
  ( 'Dimenhydrinate', 'ไดเมนไฮดริเนต', 'TakeHome', 'General', 50,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม ปากแห้ง ปัสสาวะคั่ง ระวังในสัตว์ที่มีปัญหาต่อมลูกหมากหรือต้อหิน',
    4.0, 'Motion sickness / Vestibular disease (q8h)', 8.0, 'Severe motion sickness (q8h)',
    NULL, 'Motion sickness — ขนาดคงที่ 12.5 mg/cat (q8h)', NULL, NULL ),
  ( 'Diphenhydramine', 'ไดเฟนไฮดรามีน', 'TakeHome', 'General', 25,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม ปากแห้ง ปัสสาวะคั่ง หัวใจเต้นเร็ว ระวังในสัตว์ที่มีปัญหาต่อมลูกหมากหรือต้อหิน',
    1.0, 'Allergy / Motion sickness / Sedation (q8h)', 2.0, 'Allergy รุนแรง / Anaphylaxis (q8h)',
    2.0, 'Allergy / Motion sickness (q8-12h)', 4.0, 'Allergy รุนแรง (q8h)' ),
  ( 'Diphenoxylate', 'ไดเฟนอกซีเลต', 'TakeHome', 'General', 2.5,
    'เม็ด', 5, 'ห้ามใช้หาก Infectious diarrhea สงสัย อาจทำให้ท้องผูก ไม่แนะนำในแมว อาจทำให้ CNS depression',
    0.1, 'Diarrhea / Antidiarrheal (q8-12h)', 0.2, 'Diarrhea รุนแรง (q8h)',
    NULL, 'ไม่แนะนำในแมว — อาจทำให้ CNS depression ระวังอย่างมาก', NULL, NULL ),
  ( 'Docusate sodium', 'โดคิวเสต โซเดียม', 'TakeHome', 'General', 100,
    'เม็ด', 5, 'อาจทำให้ท้องเสียหากใช้มากเกิน ห้ามให้ร่วมกับ Mineral oil เพราะเพิ่มการดูดซึมของน้ำมัน',
    50.0, 'Constipation / Stool softener (q12-24h)', NULL, NULL,
    50.0, 'Constipation / Stool softener — ขนาดคงที่ 50 mg/cat (q12-24h)', NULL, NULL ),
  ( 'Domperidone', 'โดมเพอริโดน', 'TakeHome', 'General', 10,
    'เม็ด', 5, 'อาจทำให้ท้องเสีย ปวดท้อง ง่วงซึม ระวัง QT prolongation',
    0.1, 'Prokinetic / Vomiting (q8-12h)', 0.2, 'Gastroparesis (q8h)',
    0.05, 'Prokinetic / Vomiting (q12h)', 0.1, 'Gastroparesis (q12h)' ),
  ( 'Doxepin', 'ดอกซีพิน', 'TakeHome', 'General', 10,
    'เม็ด', 5, 'อาจทำให้ง่วงซึม ปากแห้ง ปัสสาวะคั่ง หัวใจเต้นผิดจังหวะ ระวังร่วมกับ MAOIs',
    3.0, 'Pruritus / Behavioral (q12h)', 5.0, 'Chronic pruritus / OCD (q12h)',
    0.5, 'Pruritus / Anxiety (q12-24h)', 1.0, 'Chronic pruritus (q12h)' ),
  ( 'Doxycycline', 'ด็อกซีไซคลีน', 'TakeHome', 'General', 100,
    'เม็ด', 5, 'ให้พร้อมอาหารและน้ำเสมอเพื่อป้องกัน Esophageal stricture โดยเฉพาะในแมว ห้ามใช้ในสัตว์ตั้งท้องและสัตว์อายุน้อย',
    5.0, 'Bacterial / Rickettsial / Ehrlichia (q12h)', 10.0, 'Severe infections / Leptospirosis (q24h)',
    5.0, 'Bacterial / Chlamydia / Mycoplasma (q12h) — ให้น้ำตามเสมอ', NULL, NULL ),
  ( 'Enalapril', 'อีนาลาพริล', 'TakeHome', 'General', 5,
    'เม็ด', 5, 'อาจทำให้ความดันโลหิตต่ำ Hyperkalemia ตรวจ Renal function และ Electrolytes เป็นระยะ',
    0.5, 'Heart failure / Hypertension / CKD (q12-24h)', NULL, NULL,
    0.25, 'Heart failure / Hypertension / CKD (q12-24h)', 0.5, 'Heart failure รุนแรง (q12h)' ),
  ( 'Enrofloxacin', 'เอนโรฟลอกซาซิน', 'TakeHome', 'General', 50,
    'เม็ด', 5, 'ห้ามใช้ในแมวเกิน 5 mg/kg/day เสี่ยงต่อ Retinal degeneration (ตาบอด) ห้ามใช้ในสัตว์ที่กระดูกยังไม่โต',
    5.0, 'Bacterial infections / UTI / Gram-negative (q24h)', 20.0, 'Severe systemic infections (q24h)',
    5.0, 'Bacterial infections — ห้ามเกิน 5 mg/kg/day ระวัง Retinal toxicity (q24h)', NULL, NULL ),
  ( 'Ephedrine', 'อีเฟดรีน', 'TakeHome', 'General', 25,
    'เม็ด', 5, 'อาจทำให้หัวใจเต้นเร็ว ความดันโลหิตสูง กระสับกระส่าย ระวังในสัตว์ที่มีโรคหัวใจหรือความดันสูง',
    0.75, 'Urinary incontinence / Hypotension (q8-12h)', NULL, NULL,
    0.5, 'Urinary incontinence (q8-12h)', 1.0, 'Hypotension (q8h)' ),
  ( 'Erythromycin', 'อีริโทรมัยซิน', 'TakeHome', 'General', 250,
    'เม็ด', 5, 'อาจทำให้คลื่นไส้ อาเจียน ท้องเสีย ปวดท้อง ให้ร่วมอาหาร ขนาดต่ำใช้เป็น Prokinetic',
    10.0, 'Bacterial infections (q8h)', 20.0, 'Severe infections (q8h)',
    10.0, 'Bacterial infections / Chlamydia (q8h)', NULL, NULL )
) AS t(item_name, name_th, category, sub_category, conc, unit, price, side_effects, dd1, df1, dd2, df2, cd1, cf1, cd2, cf2)
WHERE NOT EXISTS (
  SELECT 1 FROM public.pharmacy p WHERE p.item_name = t.item_name
);



-- ═══════════════════════════════════════════════════════════════
-- เพิ่ม bottle_volume_ml สำหรับยาน้ำ (unit = 'mL') ที่จ่ายเป็นขวด
-- ค่าใน field นี้คือปริมาตรต่อขวด เช่น 60 หมายถึง 60 mL/ขวด
-- ราคาใน price_per_unit สำหรับยาน้ำ = ราคาต่อขวด (ไม่ใช่ต่อ mL)
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE pharmacy
  ADD COLUMN IF NOT EXISTS bottle_volume_ml NUMERIC(10,2) DEFAULT 0;
