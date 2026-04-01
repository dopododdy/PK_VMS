-- ==========================================================
-- PK-VMS SAFE MIGRATION / SETUP (NON-DESTRUCTIVE)
-- - รันซ้ำได้อย่างปลอดภัย
-- - ไม่มีคำสั่ง DROP หรือ TRUNCATE (ข้อมูลไม่หาย)
-- - เพิ่มเติมได้ แต่ไม่ลบออก
-- ==========================================================

BEGIN;

-- ==========================================================
-- 0) Extensions
-- ==========================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==========================================================
-- 1) Base tables (Owners / Phones / Animals)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.owners (
    hn TEXT PRIMARY KEY,
    owner_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    line_id TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.owner_phones (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_hn TEXT REFERENCES public.owners(hn) ON UPDATE CASCADE ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    label TEXT DEFAULT 'เบอร์หลัก'
);

CREATE TABLE IF NOT EXISTS public.animals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_hn TEXT REFERENCES public.owners(hn) ON UPDATE CASCADE ON DELETE CASCADE,
    pet_name TEXT NOT NULL,
    pet_type TEXT DEFAULT 'สุนัข',
    gender TEXT DEFAULT 'เมีย',
    breed TEXT,
    birth_date DATE,
    weight DECIMAL(5,2),
    microchip_number TEXT,
    congenital_disease TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==========================================================
-- 2) Master data tables
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.mas_units (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.mas_species (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.mas_breeds (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    species_id uuid REFERENCES public.mas_species(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    UNIQUE(species_id, name)
);

CREATE TABLE IF NOT EXISTS public.mas_sub_cat (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==========================================================
-- 3) Lab parameters + lab_results
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.mas_lab_parameters (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    parameter_name TEXT NOT NULL UNIQUE,
    category TEXT DEFAULT 'CBC',
    unit TEXT,

    dog_1_min DECIMAL(12,3), dog_1_max DECIMAL(12,3),
    dog_2_min DECIMAL(12,3), dog_2_max DECIMAL(12,3),
    dog_3_min DECIMAL(12,3), dog_3_max DECIMAL(12,3),

    cat_1_min DECIMAL(12,3), cat_1_max DECIMAL(12,3),
    cat_2_min DECIMAL(12,3), cat_2_max DECIMAL(12,3),
    cat_3_min DECIMAL(12,3), cat_3_max DECIMAL(12,3),

    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.lab_results (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    animal_id uuid REFERENCES public.animals(id) ON DELETE CASCADE,
    parameter_id uuid REFERENCES public.mas_lab_parameters(id),
    parameter_name TEXT,
    test_value DECIMAL(12,3),
    unit TEXT,
    is_abnormal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    note TEXT
);

-- ==========================================================
-- 4) Imaging
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.imaging_results (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    animal_id uuid REFERENCES public.animals(id) ON DELETE CASCADE,
    exam_type TEXT,
    region TEXT,
    findings JSONB DEFAULT '{}'::jsonb,
    impression TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==========================================================
-- 5) Medical records (OPD)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.medical_records (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    animal_id uuid REFERENCES public.animals(id) ON DELETE CASCADE,
    owner_hn TEXT REFERENCES public.owners(hn) ON UPDATE CASCADE,
    weight DECIMAL(5,2),

    cc TEXT, hx TEXT, pe TEXT, dx TEXT, plan TEXT,
    appointment DATE,
    appointment_note TEXT,
    appointment_2 DATE,
    appointment_note_2 TEXT,

    total_cost DECIMAL(10,2) DEFAULT 0,
    discount NUMERIC(12,2) DEFAULT 0,
    net_amount NUMERIC(12,2),
    payment_status TEXT DEFAULT 'pending',
    receipt_no TEXT,
    received_amount NUMERIC(12,2),
    paid_at TIMESTAMPTZ,

    dld_categories JSONB NOT NULL DEFAULT '[]'::jsonb,

    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==========================================================
-- 6) Medical record items
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.medical_record_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    record_id uuid REFERENCES public.medical_records(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL,
    item_name TEXT NOT NULL,

    dose_per_time TEXT,
    unit TEXT,
    frequency TEXT,
    meal_timing TEXT,
    day_timing TEXT,
    duration_days INTEGER,

    quantity DECIMAL(10,2) DEFAULT 1,
    unit_price DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==========================================================
-- 7) Pharmacy / Services
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.pharmacy (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    item_name TEXT NOT NULL,
    name_th TEXT,
    category TEXT NOT NULL,
    sub_category TEXT,
    unit TEXT,
    price_per_unit DECIMAL(10,2) DEFAULT 0,
    price_config JSONB,
    concentration_mg_unit DECIMAL(10,2) DEFAULT 1,
    side_effects TEXT,
    is_medication BOOLEAN DEFAULT true,

    dog_dose_1 DECIMAL(10,2), dog_for_1 TEXT,
    dog_dose_2 DECIMAL(10,2), dog_for_2 TEXT,
    dog_dose_3 DECIMAL(10,2), dog_for_3 TEXT,
    dog_dose_4 DECIMAL(10,2), dog_for_4 TEXT,
    dog_dose_5 DECIMAL(10,2), dog_for_5 TEXT,

    cat_dose_1 DECIMAL(10,2), cat_for_1 TEXT,
    cat_dose_2 DECIMAL(10,2), cat_for_2 TEXT,
    cat_dose_3 DECIMAL(10,2), cat_for_3 TEXT,
    cat_dose_4 DECIMAL(10,2), cat_for_4 TEXT,
    cat_dose_5 DECIMAL(10,2), cat_for_5 TEXT,

    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.services (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    service_name TEXT NOT NULL,
    name_th TEXT,
    category TEXT NOT NULL,
    unit TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    price_config JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==========================================================
-- 8) Pricelist items (แสดงราคาให้ลูกค้าผ่าน pricelist.html)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.pricelist_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    item_type TEXT NOT NULL DEFAULT 'service',  -- 'service' | 'product'
    category TEXT,
    item_name TEXT NOT NULL,
    price_min DECIMAL(10,2),
    price_max DECIMAL(10,2),
    unit TEXT DEFAULT 'บาท',
    note TEXT,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_pricelist_price_range CHECK (price_max IS NULL OR price_min IS NULL OR price_max >= price_min)
);

-- ==========================================================
-- 9) Print templates
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.print_templates (
    template_type TEXT PRIMARY KEY,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==========================================================
-- 10) Surgery tracking & Queue
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.surgery_procedures (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    medical_record_id uuid REFERENCES public.medical_records(id) ON DELETE CASCADE,
    animal_id uuid REFERENCES public.animals(id) ON DELETE CASCADE,
    owner_hn TEXT REFERENCES public.owners(hn) ON UPDATE CASCADE,
    procedure_name TEXT NOT NULL,
    procedure_date DATE,
    procedure_time TIME,
    veterinarian TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.surgery_status_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    surgery_id uuid REFERENCES public.surgery_procedures(id) ON DELETE CASCADE,
    animal_id uuid REFERENCES public.animals(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    status_description TEXT,
    changed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    changed_by TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS public.surgery_status_tracking (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    surgery_id uuid REFERENCES public.surgery_procedures(id) ON DELETE CASCADE NOT NULL,
    animal_id uuid REFERENCES public.animals(id) ON DELETE CASCADE NOT NULL,
    owner_hn TEXT REFERENCES public.owners(hn) ON UPDATE CASCADE,

    current_status TEXT DEFAULT 'รอผ่าตัด',
    status_timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    last_updated_by TEXT,

    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),

    UNIQUE (surgery_id)
);

CREATE TABLE IF NOT EXISTS public.surgery_queue (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    animal_id uuid,
    pet_name TEXT,
    owner_name TEXT,
    procedures TEXT,
    status TEXT DEFAULT 'รอผ่าตัด',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==========================================================
-- 11) POS pending additions
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.pos_pending_additions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    record_id UUID NOT NULL REFERENCES public.medical_records(id) ON DELETE CASCADE,
    item_type TEXT,
    item_name TEXT NOT NULL,
    quantity NUMERIC(10,3) NOT NULL DEFAULT 1,
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================================
-- 12) Clinic import table (ClinicDB.mdb migration)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.clinic_table_db (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    rec_id VARCHAR(255) UNIQUE,
    animal_id VARCHAR(255),
    animal_name VARCHAR(255),
    animal_spp VARCHAR(255),
    animal_sex VARCHAR(50),
    animal_tag VARCHAR(255),
    owner_name VARCHAR(255),
    animal_dob DATE,
    phone_no VARCHAR(50),
    medrec TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 13) Safe ALTER TABLE additions (idempotent)
-- ==========================================================
ALTER TABLE IF EXISTS public.clinic_table_db
    ALTER COLUMN phone_no TYPE VARCHAR(50);

ALTER TABLE IF EXISTS public.clinic_table_db
    ADD COLUMN IF NOT EXISTS animal_sex VARCHAR(50);

ALTER TABLE public.owners
    ADD COLUMN IF NOT EXISTS line_id TEXT,
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.animals
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.mas_lab_parameters
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.medical_records
    ADD COLUMN IF NOT EXISTS discount NUMERIC(12,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS net_amount NUMERIC(12,2),
    ADD COLUMN IF NOT EXISTS receipt_no TEXT,
    ADD COLUMN IF NOT EXISTS received_amount NUMERIC(12,2),
    ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS dld_categories JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE public.medical_records
    SET net_amount = total_cost
    WHERE net_amount IS NULL;

-- ==========================================================
-- 14) Trigger: auto-update updated_at
-- ==========================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  r RECORD;
  trig_name TEXT;
BEGIN
  FOR r IN
    SELECT c.table_schema, c.table_name
    FROM information_schema.columns c
    JOIN information_schema.tables t
      ON c.table_schema = t.table_schema AND c.table_name = t.table_name
    WHERE c.column_name = 'updated_at'
      AND c.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
    GROUP BY c.table_schema, c.table_name
  LOOP
    trig_name := 'trg_set_updated_at__' || r.table_name;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_trigger tr
      JOIN pg_class cl ON cl.oid = tr.tgrelid
      JOIN pg_namespace n ON n.oid = cl.relnamespace
      WHERE tr.tgname = trig_name
        AND n.nspname = r.table_schema
        AND cl.relname = r.table_name
    ) THEN
      EXECUTE format(
        'CREATE TRIGGER %I BEFORE UPDATE ON %I.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();',
        trig_name, r.table_schema, r.table_name
      );
    END IF;
  END LOOP;
END $$;

-- ==========================================================
-- 15) View
-- ==========================================================
CREATE OR REPLACE VIEW public.surgery_status AS
SELECT
  st.id AS id,
  st.animal_id,
  st.owner_hn,
  a.pet_name,
  a.pet_type,
  a.gender,
  sp.procedure_name AS surgery_name,
  st.current_status AS status,
  st.created_at,
  st.updated_at
FROM public.surgery_status_tracking st
JOIN public.surgery_procedures sp ON sp.id = st.surgery_id
LEFT JOIN public.animals a ON a.id = st.animal_id;

-- ==========================================================
-- 16) Indexes (Safe)
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_lab_history ON public.lab_results(animal_id, created_at);
CREATE INDEX IF NOT EXISTS idx_imaging_history ON public.imaging_results(animal_id, created_at);
CREATE INDEX IF NOT EXISTS idx_med_history ON public.medical_records(animal_id, created_at);
CREATE INDEX IF NOT EXISTS idx_surgery_tracking_animal_status ON public.surgery_status_tracking(animal_id, current_status);
CREATE INDEX IF NOT EXISTS idx_surgery_history_surgery_changed ON public.surgery_status_history(surgery_id, changed_at);
CREATE INDEX IF NOT EXISTS idx_animals_pet_name ON public.animals(pet_name);
CREATE INDEX IF NOT EXISTS idx_surgery_tracking_owner_hn ON public.surgery_status_tracking(owner_hn);
CREATE INDEX IF NOT EXISTS idx_pricelist_type_active ON public.pricelist_items(item_type, active);

-- Foreign Key Indexes
CREATE INDEX IF NOT EXISTS idx_owner_phones_owner_hn ON public.owner_phones(owner_hn);
CREATE INDEX IF NOT EXISTS idx_animals_owner_hn ON public.animals(owner_hn);
CREATE INDEX IF NOT EXISTS idx_medical_records_animal_id ON public.medical_records(animal_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_owner_hn ON public.medical_records(owner_hn);
CREATE INDEX IF NOT EXISTS idx_medical_record_items_record_id ON public.medical_record_items(record_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_animal_id ON public.lab_results(animal_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_parameter_id ON public.lab_results(parameter_id);

-- ==========================================================
-- 16b) Vaccine Catalog & Vaccination Records
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.vaccine_catalog (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    for_dog BOOLEAN NOT NULL DEFAULT true,
    for_cat BOOLEAN NOT NULL DEFAULT false,
    prevents_disease TEXT,
    price NUMERIC(10,2) DEFAULT 0,
    image_data TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.vaccination_records (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    animal_id uuid NOT NULL REFERENCES public.animals(id) ON DELETE CASCADE,
    vaccine_id uuid REFERENCES public.vaccine_catalog(id) ON DELETE SET NULL,
    vaccine_name TEXT NOT NULL,
    vaccinated_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vaccination_records_animal_id ON public.vaccination_records(animal_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_records_date ON public.vaccination_records(vaccinated_date DESC);

-- ==========================================================
-- 17) Permissions / RLS (Safe)
-- ==========================================================

-- Disable RLS on tables
ALTER TABLE public.owners DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_phones DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.animals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_record_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mas_units DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mas_species DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mas_breeds DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mas_sub_cat DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mas_lab_parameters DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.imaging_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricelist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.surgery_procedures DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.surgery_status_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.surgery_status_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.surgery_queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_pending_additions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_table_db DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccine_catalog DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccination_records DISABLE ROW LEVEL SECURITY;

-- Grants
GRANT ALL ON TABLE public.owners TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.owner_phones TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.animals TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.medical_records TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.medical_record_items TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.mas_units TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.mas_species TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.mas_breeds TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.mas_sub_cat TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.mas_lab_parameters TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.lab_results TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.imaging_results TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.pharmacy TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.services TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.pricelist_items TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.print_templates TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.surgery_procedures TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.surgery_status_history TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.surgery_status_tracking TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.surgery_queue TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.pos_pending_additions TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.clinic_table_db TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.vaccine_catalog TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.vaccination_records TO anon, authenticated, service_role;

-- View permissions
GRANT SELECT ON public.surgery_status TO anon, authenticated, service_role;

-- ==========================================================
-- 18) Seed data (Safe - ON CONFLICT DO NOTHING)
-- ==========================================================
INSERT INTO public.mas_units (name) VALUES
('เม็ด'), ('ขวด'), ('ซีซี (cc)'), ('หลอด'), ('แผง'), ('ก้อน'), ('มล. (ml)'), ('กรัม (g)')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.mas_species (name) VALUES
('สุนัข'), ('แมว'), ('นก'), ('กระต่าย'), ('หนูแกสบี้'), ('สัตว์พิเศษ (Exotic)')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.print_templates (template_type, config) VALUES
('doc_consent',   '{"width": 210, "height": 297, "lines": []}'),
('doc_opd',       '{"width": 210, "height": 297, "lines": []}'),
('doc_referral',  '{"width": 210, "height": 297, "lines": []}'),
('doc_lab',       '{"width": 210, "height": 297, "lines": []}'),
('doc_receipt',   '{"width": 210, "height": 297, "lines": []}'),
('doc_echo',      '{"width": 210, "height": 297, "lines": []}'),
('sticker_drug',  '{"width": 80,  "height": 50,  "lines": []}'),
('thermal_receipt','{"width": 80,  "height": 150, "lines": []}'),
('sticker_pet_id','{"width": 80,  "height": 45,  "lines": []}')
ON CONFLICT (template_type) DO NOTHING;

-- ==========================================================
-- 19) App Settings (key-value store for display/signage config)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.app_settings (
    key         TEXT PRIMARY KEY,
    value       JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.app_settings DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.app_settings TO anon, authenticated, service_role;

-- ==========================================================
-- 20) Refresh PostgREST schema cache
-- ==========================================================
NOTIFY pgrst, 'reload schema';

COMMIT;
