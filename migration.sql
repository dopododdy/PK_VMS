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
