export type Species = 'dog' | 'cat' | 'both';
export type Route =
'PO' |
'IV' |
'IM' |
'SC' |
'Topical' |
'Otic' |
'Ophthalmic' |
'Rectal' |
'IT' |
'IC' |
'Transdermal' |
'Inhalation';
export type Unit = 'mg/ml' | 'mg/tablet' | 'mg/capsule' | 'mcg/ml' | '%';

export interface Concentration {
  value: number;
  unit: Unit;
  label: string;
}

export interface DosageRange {
  min: number;
  max: number;
}

export interface Drug {
  id: string;
  name: string;
  thaiName?: string;
  drugClass: string;
  species: Species;
  dosage: {
    dog?: DosageRange;
    cat?: DosageRange;
  };
  routes: Route[];
  frequency: string;
  concentrations: Concentration[];
  administrationNotes: string;
  warnings: string;
  contraindications?: string;
  sideEffects?: string;
}

export const drugDatabase: Drug[] = [
// ===== A =====
{
  id: 'acepromazine',
  name: 'Acepromazine',
  thaiName: 'อะซีโปรมาซีน',
  drugClass: 'Sedative / Tranquilizer',
  species: 'both',
  dosage: { dog: { min: 0.025, max: 0.2 }, cat: { min: 0.05, max: 0.2 } },
  routes: ['IV', 'IM', 'SC', 'PO'],
  frequency: 'q6-8h',
  concentrations: [
  { value: 10, unit: 'mg/ml', label: 'Injectable (10 mg/ml)' },
  { value: 10, unit: 'mg/tablet', label: 'Tablet (10 mg)' },
  { value: 25, unit: 'mg/tablet', label: 'Tablet (25 mg)' }],

  administrationNotes:
  'ควรให้ยาก่อนการเดินทางหรือเหตุการณ์ที่ทำให้เครียดประมาณ 45-60 นาที ผลข้างเคียงอาจทำให้ความดันโลหิตต่ำ',
  warnings:
  'ระวังการใช้ในสัตว์ที่มีโรคหัวใจ, สัตว์แก่, หรือสัตว์ที่มีประวัติชัก',
  sideEffects: 'ง่วงซึม, ความดันต่ำ, หัวใจเต้นช้า'
},
{
  id: 'acetaminophen',
  name: 'Acetaminophen',
  thaiName: 'อะเซตามิโนเฟน (พาราเซตามอล)',
  drugClass: 'Analgesic / Antipyretic',
  species: 'dog',
  dosage: { dog: { min: 10, max: 15 } },
  routes: ['PO'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 325, unit: 'mg/tablet', label: 'Tab 325mg' },
  { value: 500, unit: 'mg/tablet', label: 'Tab 500mg' }],

  administrationNotes:
  'ใช้ในสุนัขเท่านั้น ห้ามใช้ในแมวเด็ดขาด (เป็นพิษร้ายแรง)',
  warnings:
  '⚠️ ห้ามใช้ในแมว — ทำให้เม็ดเลือดแดงแตก (Methemoglobinemia) ตับวาย และเสียชีวิตได้',
  sideEffects: 'อาเจียน, ตับอักเสบ (สุนัข)'
},
{
  id: 'acetazolamide',
  name: 'Acetazolamide',
  thaiName: 'อะเซตาโซลาไมด์',
  drugClass: 'Carbonic Anhydrase Inhibitor',
  species: 'both',
  dosage: { dog: { min: 5, max: 10 }, cat: { min: 5, max: 10 } },
  routes: ['PO', 'IV'],
  frequency: 'q8-12h',
  concentrations: [{ value: 250, unit: 'mg/tablet', label: 'Tab 250mg' }],
  administrationNotes: 'ใช้ลดความดันลูกตา (Glaucoma) หรือเป็นยาขับปัสสาวะ',
  warnings: 'ระวังภาวะเลือดเป็นกรด (Metabolic acidosis)',
  sideEffects: 'เบื่ออาหาร, อาเจียน, ท้องเสีย'
},
{
  id: 'acetylcysteine',
  name: 'Acetylcysteine',
  thaiName: 'อะเซทิลซิสเทอีน (NAC)',
  drugClass: 'Antidote / Mucolytic',
  species: 'both',
  dosage: { dog: { min: 140, max: 140 }, cat: { min: 140, max: 140 } },
  routes: ['IV', 'PO'],
  frequency: 'Loading then q4-6h',
  concentrations: [{ value: 200, unit: 'mg/ml', label: 'Injectable 20%' }],
  administrationNotes:
  'ใช้แก้พิษ Acetaminophen — Loading dose 140 mg/kg IV/PO จากนั้น 70 mg/kg ทุก 4-6 ชม. อีก 5-7 ครั้ง',
  warnings: 'อาจทำให้อาเจียนหากให้ทาง PO',
  sideEffects: 'คลื่นไส้, อาเจียน'
},
{
  id: 'albendazole',
  name: 'Albendazole',
  thaiName: 'อัลเบนดาโซล',
  drugClass: 'Anthelmintic',
  species: 'both',
  dosage: { dog: { min: 25, max: 50 }, cat: { min: 25, max: 50 } },
  routes: ['PO'],
  frequency: 'q12h (3-5 days)',
  concentrations: [
  { value: 200, unit: 'mg/tablet', label: 'Tab 200mg' },
  { value: 400, unit: 'mg/tablet', label: 'Tab 400mg' }],

  administrationNotes: 'ใช้ถ่ายพยาธิหลายชนิด ให้พร้อมอาหาร',
  warnings:
  'ระวังการกดไขกระดูก (Bone marrow suppression) หากใช้นานเกินไป ห้ามใช้ในสัตว์ท้อง',
  sideEffects: 'เบื่ออาหาร, เม็ดเลือดขาวต่ำ'
},
{
  id: 'albuterol',
  name: 'Albuterol',
  thaiName: 'อัลบิวเทอรอล (Salbutamol)',
  drugClass: 'Bronchodilator (Beta-2 agonist)',
  species: 'both',
  dosage: { dog: { min: 0.02, max: 0.05 }, cat: { min: 0.02, max: 0.05 } },
  routes: ['PO', 'Inhalation'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 2, unit: 'mg/tablet', label: 'Tab 2mg' },
  { value: 4, unit: 'mg/tablet', label: 'Tab 4mg' }],

  administrationNotes:
  'ใช้ขยายหลอดลมในสัตว์ที่เป็นหอบหืด สามารถใช้แบบพ่นสูดผ่าน Spacer ได้',
  warnings: 'ระวังหัวใจเต้นเร็ว',
  sideEffects: 'หัวใจเต้นเร็ว, ตัวสั่น, กระวนกระวาย'
},
{
  id: 'alfaxalone',
  name: 'Alfaxalone',
  thaiName: 'อัลฟาซาโลน',
  drugClass: 'Anesthetic Induction Agent',
  species: 'both',
  dosage: { dog: { min: 2, max: 3 }, cat: { min: 2, max: 5 } },
  routes: ['IV', 'IM'],
  frequency: 'Induction',
  concentrations: [{ value: 10, unit: 'mg/ml', label: 'Alfaxan 10mg/ml' }],
  administrationNotes:
  'ฉีด IV ช้าๆ titrate to effect ใช้แทน Propofol ได้ ปลอดภัยกว่าในแมว',
  warnings: 'อาจทำให้หยุดหายใจชั่วคราว เตรียมท่อช่วยหายใจ',
  sideEffects: 'หยุดหายใจ, กล้ามเนื้อกระตุก'
},
{
  id: 'allopurinol',
  name: 'Allopurinol',
  thaiName: 'อัลโลพิวรินอล',
  drugClass: 'Xanthine Oxidase Inhibitor',
  species: 'both',
  dosage: { dog: { min: 10, max: 15 }, cat: { min: 10, max: 10 } },
  routes: ['PO'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 100, unit: 'mg/tablet', label: 'Tab 100mg' },
  { value: 300, unit: 'mg/tablet', label: 'Tab 300mg' }],

  administrationNotes: 'ใช้รักษา Leishmaniasis หรือลดกรดยูริก',
  warnings: 'ระวังนิ่วแซนทีน (Xanthine uroliths)',
  sideEffects: 'อาเจียน, ค่าตับขึ้น'
},
{
  id: 'alprazolam',
  name: 'Alprazolam',
  thaiName: 'อัลปราโซแลม',
  drugClass: 'Benzodiazepine',
  species: 'both',
  dosage: { dog: { min: 0.02, max: 0.1 }, cat: { min: 0.0125, max: 0.025 } },
  routes: ['PO'],
  frequency: 'q12h / PRN',
  concentrations: [
  { value: 0.25, unit: 'mg/tablet', label: 'Tab 0.25mg' },
  { value: 0.5, unit: 'mg/tablet', label: 'Tab 0.5mg' }],

  administrationNotes:
  'ลดความวิตกกังวล ให้ก่อนเหตุการณ์ที่ทำให้เครียด 30-60 นาที',
  warnings: 'ระวังในสัตว์โรคตับ อาจทำให้ตับวายในแมว (พบน้อย)',
  sideEffects: 'ง่วงซึม, เดินเซ'
},
{
  id: 'altrenogest',
  name: 'Altrenogest',
  thaiName: 'อัลทรีโนเจสต์',
  drugClass: 'Progestogen',
  species: 'both',
  dosage: {
    dog: { min: 0.044, max: 0.088 },
    cat: { min: 0.044, max: 0.088 }
  },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [{ value: 2.2, unit: 'mg/ml', label: 'Regu-Mate 0.22%' }],
  administrationNotes:
  'ใช้ควบคุมวงจรการเป็นสัด ผู้ใช้ต้องสวมถุงมือเสมอ (ดูดซึมผ่านผิวหนังคน)',
  warnings: '⚠️ อันตรายต่อผู้หญิงที่ตั้งครรภ์ สวมถุงมือทุกครั้ง',
  sideEffects: 'มดลูกอักเสบ (Pyometra) หากใช้นาน'
},
{
  id: 'amikacin',
  name: 'Amikacin',
  thaiName: 'อะมิคาซิน',
  drugClass: 'Antibiotic (Aminoglycoside)',
  species: 'both',
  dosage: { dog: { min: 15, max: 30 }, cat: { min: 10, max: 15 } },
  routes: ['IV', 'IM', 'SC'],
  frequency: 'q24h',
  concentrations: [
  { value: 50, unit: 'mg/ml', label: 'Inj 50mg/ml' },
  { value: 250, unit: 'mg/ml', label: 'Inj 250mg/ml' }],

  administrationNotes:
  'ให้วันละครั้ง (Once daily dosing) เพื่อลดพิษต่อไต ต้องติดตามค่าไตและการได้ยิน',
  warnings:
  'เป็นพิษต่อไต (Nephrotoxic) และหู (Ototoxic) ห้ามใช้ร่วมกับ Furosemide',
  sideEffects: 'ไตวาย, หูหนวก'
},
{
  id: 'aminophylline',
  name: 'Aminophylline',
  thaiName: 'อะมิโนฟิลลีน',
  drugClass: 'Bronchodilator (Methylxanthine)',
  species: 'both',
  dosage: { dog: { min: 10, max: 10 }, cat: { min: 5, max: 5 } },
  routes: ['PO', 'IV', 'IM'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 100, unit: 'mg/tablet', label: 'Tab 100mg' },
  { value: 25, unit: 'mg/ml', label: 'Inj 25mg/ml' }],

  administrationNotes: 'ขยายหลอดลม ฉีด IV ช้าๆ (อย่างน้อย 5 นาที)',
  warnings: 'ระวังหัวใจเต้นผิดจังหวะ ห้ามใช้ร่วมกับ Cimetidine',
  sideEffects: 'คลื่นไส้, หัวใจเต้นเร็ว, กระวนกระวาย'
},
{
  id: 'amiodarone',
  name: 'Amiodarone',
  thaiName: 'อะมิโอดาโรน',
  drugClass: 'Antiarrhythmic (Class III)',
  species: 'dog',
  dosage: { dog: { min: 10, max: 15 } },
  routes: ['PO', 'IV'],
  frequency: 'q12h (PO)',
  concentrations: [
  { value: 200, unit: 'mg/tablet', label: 'Tab 200mg' },
  { value: 50, unit: 'mg/ml', label: 'Inj 50mg/ml' }],

  administrationNotes:
  'ใช้รักษาหัวใจเต้นผิดจังหวะรุนแรง IV: Loading 10 mg/kg ช้าๆ',
  warnings: 'เป็นพิษต่อตับ ปอด ไทรอยด์ ต้องติดตามค่าตับ',
  sideEffects: 'เบื่ออาหาร, ค่าตับขึ้น, ไทรอยด์ผิดปกติ'
},
{
  id: 'amlodipine',
  name: 'Amlodipine',
  thaiName: 'แอมโลดิปีน',
  drugClass: 'Calcium Channel Blocker',
  species: 'both',
  dosage: { dog: { min: 0.1, max: 0.5 }, cat: { min: 0.125, max: 0.25 } },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [
  { value: 2.5, unit: 'mg/tablet', label: 'Tab 2.5mg' },
  { value: 5, unit: 'mg/tablet', label: 'Tab 5mg' }],

  administrationNotes: 'ยาลดความดันหลักในแมว เริ่มต้นขนาดต่ำแล้วค่อยเพิ่ม',
  warnings: 'ระวังความดันต่ำเกินไป',
  sideEffects: 'เหงือกบวม, ง่วงซึม'
},
{
  id: 'amoxicillin',
  name: 'Amoxicillin',
  thaiName: 'อะมอกซิซิลลิน',
  drugClass: 'Antibiotic (Penicillin)',
  species: 'both',
  dosage: { dog: { min: 10, max: 20 }, cat: { min: 10, max: 20 } },
  routes: ['PO', 'IM', 'SC'],
  frequency: 'q12h',
  concentrations: [
  { value: 50, unit: 'mg/ml', label: 'Inj (LA) 50mg/ml' },
  { value: 250, unit: 'mg/tablet', label: 'Tab 250mg' },
  { value: 500, unit: 'mg/tablet', label: 'Tab 500mg' },
  { value: 50, unit: 'mg/ml', label: 'Syrup 50mg/ml' }],

  administrationNotes: 'เขย่าขวดก่อนใช้สำหรับยาน้ำ สามารถให้พร้อมอาหารได้',
  warnings: 'ห้ามใช้ในสัตว์ที่แพ้ Penicillin',
  sideEffects: 'ถ่ายเหลว, อาเจียน, เบื่ออาหาร'
},
{
  id: 'amoxicillin-clavulanate',
  name: 'Amoxicillin-Clavulanate',
  thaiName: 'อะมอกซิซิลลิน-คลาวูลาเนต',
  drugClass: 'Antibiotic (Potentiated Penicillin)',
  species: 'both',
  dosage: { dog: { min: 12.5, max: 25 }, cat: { min: 12.5, max: 25 } },
  routes: ['PO'],
  frequency: 'q12h',
  concentrations: [
  { value: 62.5, unit: 'mg/tablet', label: 'Clavamox 62.5mg' },
  { value: 125, unit: 'mg/tablet', label: 'Clavamox 125mg' },
  { value: 250, unit: 'mg/tablet', label: 'Clavamox 250mg' },
  { value: 375, unit: 'mg/tablet', label: 'Augmentin 375mg' },
  { value: 625, unit: 'mg/tablet', label: 'Augmentin 625mg' }],

  administrationNotes: 'ให้พร้อมอาหารเพื่อลดการระคายเคืองกระเพาะ',
  warnings: 'ระวังในสัตว์โรคตับ',
  sideEffects: 'ท้องเสีย, อาเจียน'
},
{
  id: 'amphotericin-b',
  name: 'Amphotericin B',
  thaiName: 'แอมโฟเทอริซิน บี',
  drugClass: 'Antifungal (Polyene)',
  species: 'both',
  dosage: { dog: { min: 0.25, max: 0.5 }, cat: { min: 0.25, max: 0.5 } },
  routes: ['IV'],
  frequency: 'q48h (cumulative dose)',
  concentrations: [
  { value: 50, unit: 'mg/ml', label: 'Vial 50mg (reconstitute)' }],

  administrationNotes:
  'ผสมใน D5W เท่านั้น (ห้ามผสม NSS) ให้ IV drip ช้าๆ 4-6 ชม. ให้สารน้ำก่อนและหลังเพื่อป้องกันพิษต่อไต',
  warnings: 'เป็นพิษต่อไตสูงมาก ต้องติดตาม BUN/Creatinine ทุกครั้ง',
  sideEffects: 'ไตวาย, ไข้, อาเจียน, เบื่ออาหาร'
},
{
  id: 'ampicillin',
  name: 'Ampicillin',
  thaiName: 'แอมพิซิลลิน',
  drugClass: 'Antibiotic (Penicillin)',
  species: 'both',
  dosage: { dog: { min: 10, max: 20 }, cat: { min: 10, max: 20 } },
  routes: ['IV', 'IM', 'SC', 'PO'],
  frequency: 'q6-8h',
  concentrations: [
  { value: 250, unit: 'mg/ml', label: 'Inj 250mg vial (reconstitute)' },
  { value: 250, unit: 'mg/capsule', label: 'Cap 250mg' },
  { value: 500, unit: 'mg/capsule', label: 'Cap 500mg' }],

  administrationNotes:
  'ให้ตอนท้องว่าง (ดูดซึม PO ดีกว่า) ยาฉีดต้องผสมก่อนใช้',
  warnings: 'ห้ามใช้ในสัตว์แพ้ Penicillin',
  sideEffects: 'ท้องเสีย, อาเจียน'
},
{
  id: 'atenolol',
  name: 'Atenolol',
  thaiName: 'อะทีโนลอล',
  drugClass: 'Beta-blocker',
  species: 'both',
  dosage: { dog: { min: 0.25, max: 1 }, cat: { min: 6.25, max: 12.5 } },
  routes: ['PO'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 25, unit: 'mg/tablet', label: 'Tab 25mg' },
  { value: 50, unit: 'mg/tablet', label: 'Tab 50mg' },
  { value: 100, unit: 'mg/tablet', label: 'Tab 100mg' }],

  administrationNotes:
  'แมว: มักให้ 6.25-12.5 mg/cat/day สุนัข: 0.25-1 mg/kg q12-24h',
  warnings: 'ห้ามหยุดทันที ระวังในสัตว์หัวใจวาย',
  sideEffects: 'หัวใจเต้นช้า, อ่อนเพลีย, ความดันต่ำ'
},
{
  id: 'atipamezole',
  name: 'Atipamezole',
  thaiName: 'อะทิพาเมโซล',
  drugClass: 'Alpha-2 Antagonist (Reversal)',
  species: 'both',
  dosage: { dog: { min: 0.1, max: 0.2 }, cat: { min: 0.1, max: 0.2 } },
  routes: ['IM'],
  frequency: 'Once (reversal)',
  concentrations: [{ value: 5, unit: 'mg/ml', label: 'Antisedan 5mg/ml' }],
  administrationNotes:
  'ใช้ reverse Medetomidine/Dexmedetomidine ให้ปริมาตรเท่ากับ Dexmedetomidine ที่ฉีดไป (IM)',
  warnings: 'อาจทำให้ตื่นเร็วเกินไปและกระวนกระวาย',
  sideEffects: 'หัวใจเต้นเร็ว, กระวนกระวาย'
},
{
  id: 'atracurium',
  name: 'Atracurium',
  thaiName: 'อะทราคิวเรียม',
  drugClass: 'Neuromuscular Blocker',
  species: 'both',
  dosage: { dog: { min: 0.1, max: 0.2 }, cat: { min: 0.1, max: 0.2 } },
  routes: ['IV'],
  frequency: 'PRN (during anesthesia)',
  concentrations: [{ value: 10, unit: 'mg/ml', label: 'Inj 10mg/ml' }],
  administrationNotes:
  'ใช้ระหว่างวางยาสลบเท่านั้น ต้องใส่ท่อช่วยหายใจและช่วยหายใจตลอด',
  warnings: 'ห้ามใช้โดยไม่มีเครื่องช่วยหายใจ',
  sideEffects: 'หยุดหายใจ, ความดันต่ำ'
},
{
  id: 'atropine',
  name: 'Atropine',
  thaiName: 'อะโทรปีน',
  drugClass: 'Anticholinergic',
  species: 'both',
  dosage: { dog: { min: 0.02, max: 0.04 }, cat: { min: 0.02, max: 0.04 } },
  routes: ['IV', 'IM', 'SC'],
  frequency: 'PRN',
  concentrations: [
  { value: 0.6, unit: 'mg/ml', label: 'Inj 0.6mg/ml' },
  { value: 1, unit: 'mg/ml', label: 'Inj 1mg/ml' }],

  administrationNotes: 'ใช้ลดน้ำลาย แก้พิษ Organophosphate หรือ CPR',
  warnings: 'ห้ามใช้ในสัตว์ต้อหิน (Glaucoma) หรือหัวใจเต้นเร็ว',
  sideEffects: 'ปากแห้ง, ม่านตาขยาย, หัวใจเต้นเร็ว'
},
{
  id: 'azathioprine',
  name: 'Azathioprine',
  thaiName: 'อะซาไธโอพรีน',
  drugClass: 'Immunosuppressant',
  species: 'dog',
  dosage: { dog: { min: 1, max: 2 } },
  routes: ['PO'],
  frequency: 'q24-48h',
  concentrations: [{ value: 50, unit: 'mg/tablet', label: 'Tab 50mg' }],
  administrationNotes:
  'ใช้รักษาโรคภูมิคุ้มกันทำลายตัวเอง (IMHA, ITP) ต้องตรวจ CBC ทุก 1-2 สัปดาห์',
  warnings: '⚠️ ห้ามใช้ในแมว (กดไขกระดูกรุนแรง) ระวังในสุนัข: กดไขกระดูก',
  sideEffects: 'เม็ดเลือดขาวต่ำ, ตับอักเสบ, อาเจียน'
},
{
  id: 'azithromycin',
  name: 'Azithromycin',
  thaiName: 'อะซิโธรมัยซิน',
  drugClass: 'Antibiotic (Macrolide)',
  species: 'both',
  dosage: { dog: { min: 5, max: 10 }, cat: { min: 5, max: 10 } },
  routes: ['PO'],
  frequency: 'q24h (or q48h)',
  concentrations: [
  { value: 250, unit: 'mg/tablet', label: 'Tab 250mg' },
  { value: 500, unit: 'mg/tablet', label: 'Tab 500mg' },
  { value: 40, unit: 'mg/ml', label: 'Susp 200mg/5ml' }],

  administrationNotes:
  'ออกฤทธิ์นาน สามารถให้วันเว้นวันได้ ดีต่อการติดเชื้อทางเดินหายใจ',
  warnings: 'ระวังในสัตว์โรคตับ',
  sideEffects: 'อาเจียน, ท้องเสีย'
},
// ===== B =====
{
  id: 'benazepril',
  name: 'Benazepril',
  thaiName: 'เบนาเซพริล',
  drugClass: 'ACE Inhibitor',
  species: 'both',
  dosage: { dog: { min: 0.25, max: 0.5 }, cat: { min: 0.25, max: 0.5 } },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [
  { value: 5, unit: 'mg/tablet', label: 'Fortekor 5mg' },
  { value: 20, unit: 'mg/tablet', label: 'Fortekor 20mg' }],

  administrationNotes: 'ใช้รักษาโรคหัวใจและโรคไต ลดโปรตีนรั่วในปัสสาวะ',
  warnings: 'ระวังค่าไตสูงขึ้นช่วงแรก ตรวจ BUN/Cre หลังเริ่มยา 1 สัปดาห์',
  sideEffects: 'ความดันต่ำ, เบื่ออาหาร'
},
{
  id: 'betamethasone',
  name: 'Betamethasone',
  thaiName: 'เบตาเมทาโซน',
  drugClass: 'Corticosteroid',
  species: 'both',
  dosage: { dog: { min: 0.1, max: 0.2 }, cat: { min: 0.1, max: 0.2 } },
  routes: ['IM', 'SC', 'Topical'],
  frequency: 'q24h or single dose',
  concentrations: [{ value: 4, unit: 'mg/ml', label: 'Inj 4mg/ml' }],
  administrationNotes: 'ออกฤทธิ์นาน ใช้ครั้งเดียวได้ผลหลายวัน',
  warnings: 'ห้ามใช้ในสัตว์ท้อง เบาหวาน',
  sideEffects: 'กินน้ำบ่อย, ปัสสาวะบ่อย'
},
{
  id: 'buprenorphine',
  name: 'Buprenorphine',
  thaiName: 'บิวพรีนอร์ฟีน',
  drugClass: 'Analgesic (Partial Opioid Agonist)',
  species: 'both',
  dosage: { dog: { min: 0.01, max: 0.02 }, cat: { min: 0.01, max: 0.03 } },
  routes: ['IV', 'IM', 'SC', 'PO'],
  frequency: 'q6-8h',
  concentrations: [{ value: 0.3, unit: 'mg/ml', label: 'Inj 0.3mg/ml' }],
  administrationNotes:
  'ในแมวสามารถหยดใต้ลิ้น (OTM/Buccal) ได้ผลดี ออกฤทธิ์ช้ากว่า Morphine แต่นานกว่า',
  warnings: 'ออกฤทธิ์ช้า 20-30 นาที อย่าให้ซ้ำเร็วเกินไป',
  sideEffects: 'ง่วงซึม, ม่านตาขยาย (แมว)'
},
{
  id: 'butorphanol',
  name: 'Butorphanol',
  thaiName: 'บิวทอร์ฟานอล',
  drugClass: 'Analgesic (Opioid Agonist-Antagonist)',
  species: 'both',
  dosage: { dog: { min: 0.2, max: 0.4 }, cat: { min: 0.2, max: 0.4 } },
  routes: ['IV', 'IM', 'SC'],
  frequency: 'q2-4h',
  concentrations: [{ value: 10, unit: 'mg/ml', label: 'Torbugesic 10mg/ml' }],
  administrationNotes:
  'แก้ปวดระดับเบา-ปานกลาง ออกฤทธิ์สั้น มักใช้ร่วมกับ Sedatives',
  warnings: 'แก้ปวดไม่แรงเท่า Pure agonists (Morphine)',
  sideEffects: 'ง่วงซึม, หายใจช้า'
},
// ===== C =====
{
  id: 'carprofen',
  name: 'Carprofen',
  thaiName: 'คาร์โปรเฟน',
  drugClass: 'NSAID',
  species: 'dog',
  dosage: { dog: { min: 2.2, max: 4.4 } },
  routes: ['PO', 'SC'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 25, unit: 'mg/tablet', label: 'Rimadyl 25mg' },
  { value: 75, unit: 'mg/tablet', label: 'Rimadyl 75mg' },
  { value: 100, unit: 'mg/tablet', label: 'Rimadyl 100mg' },
  { value: 50, unit: 'mg/ml', label: 'Inj 50mg/ml' }],

  administrationNotes: 'ให้พร้อมอาหาร 4.4 mg/kg q24h หรือ 2.2 mg/kg q12h',
  warnings: 'ห้ามใช้ในแมว ห้ามใช้ร่วมกับ NSAIDs อื่นหรือ Steroids',
  sideEffects: 'อาเจียน, ถ่ายดำ, ค่าตับขึ้น'
},
{
  id: 'cefazolin',
  name: 'Cefazolin',
  thaiName: 'เซฟาโซลิน',
  drugClass: 'Antibiotic (1st Gen Cephalosporin)',
  species: 'both',
  dosage: { dog: { min: 20, max: 30 }, cat: { min: 20, max: 30 } },
  routes: ['IV', 'IM'],
  frequency: 'q8h',
  concentrations: [
  { value: 100, unit: 'mg/ml', label: 'Inj 1g vial (reconstitute)' }],

  administrationNotes: 'ใช้ป้องกันการติดเชื้อก่อนผ่าตัด ให้ 30 นาทีก่อนลงมีด',
  warnings: 'ระวังในสัตว์แพ้ Penicillin (Cross-reactivity)',
  sideEffects: 'อาเจียน, ท้องเสีย'
},
{
  id: 'cefovecin',
  name: 'Cefovecin',
  thaiName: 'เซโฟวีซิน',
  drugClass: 'Antibiotic (3rd Gen Cephalosporin)',
  species: 'both',
  dosage: { dog: { min: 8, max: 8 }, cat: { min: 8, max: 8 } },
  routes: ['SC'],
  frequency: 'Once (14 days duration)',
  concentrations: [{ value: 80, unit: 'mg/ml', label: 'Convenia 80mg/ml' }],
  administrationNotes:
  'ฉีดใต้ผิวหนังครั้งเดียว ออกฤทธิ์นาน 14 วัน เหมาะกับสัตว์ที่ป้อนยายาก',
  warnings: 'ห้ามใช้ในสัตว์โรคไตรุนแรง (ขับออกทางไต)',
  sideEffects: 'อาเจียน, ท้องเสีย, เจ็บบริเวณที่ฉีด'
},
{
  id: 'cephalexin',
  name: 'Cephalexin',
  thaiName: 'เซฟาเล็กซิน',
  drugClass: 'Antibiotic (1st Gen Cephalosporin)',
  species: 'both',
  dosage: { dog: { min: 22, max: 30 }, cat: { min: 22, max: 30 } },
  routes: ['PO'],
  frequency: 'q12h',
  concentrations: [
  { value: 250, unit: 'mg/capsule', label: 'Cap 250mg' },
  { value: 500, unit: 'mg/capsule', label: 'Cap 500mg' },
  { value: 25, unit: 'mg/ml', label: 'Susp 125mg/5ml' }],

  administrationNotes:
  'ใช้รักษาการติดเชื้อที่ผิวหนังได้ดี (Pyoderma) ควรทานให้ครบโดส',
  warnings: 'ระวังในสัตว์แพ้ Cephalosporins',
  sideEffects: 'คลื่นไส้, อาเจียน, ท้องเสีย'
},
{
  id: 'chloramphenicol',
  name: 'Chloramphenicol',
  thaiName: 'คลอแรมเฟนิคอล',
  drugClass: 'Antibiotic',
  species: 'both',
  dosage: { dog: { min: 25, max: 50 }, cat: { min: 12.5, max: 25 } },
  routes: ['PO', 'IV', 'Ophthalmic'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 250, unit: 'mg/capsule', label: 'Cap 250mg' },
  { value: 5, unit: 'mg/ml', label: 'Eye drops 0.5%' }],

  administrationNotes:
  'ผู้ใช้ต้องสวมถุงมือ (อาจทำให้เกิด Aplastic anemia ในคน)',
  warnings: '⚠️ อันตรายต่อผู้ใช้ สวมถุงมือทุกครั้ง ห้ามใช้ในสัตว์ท้อง',
  sideEffects: 'กดไขกระดูก, เบื่ออาหาร, อาเจียน'
},
{
  id: 'chlorhexidine',
  name: 'Chlorhexidine',
  thaiName: 'คลอเฮกซิดีน',
  drugClass: 'Antiseptic',
  species: 'both',
  dosage: { dog: { min: 0, max: 0 }, cat: { min: 0, max: 0 } },
  routes: ['Topical'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 2, unit: '%', label: 'Solution 2%' },
  { value: 4, unit: '%', label: 'Scrub 4%' }],

  administrationNotes:
  'ใช้ทำความสะอาดแผลหรือผิวหนัง ระวังอย่าให้เข้าตาหรือหู',
  warnings: 'ห้ามใช้กับดวงตา หรือหูชั้นกลาง (อาจทำให้หูหนวก)',
  sideEffects: 'ระคายเคืองผิวหนัง'
},
{
  id: 'cimetidine',
  name: 'Cimetidine',
  thaiName: 'ไซเมทิดีน',
  drugClass: 'H2 Blocker',
  species: 'both',
  dosage: { dog: { min: 5, max: 10 }, cat: { min: 5, max: 10 } },
  routes: ['PO', 'IV', 'IM'],
  frequency: 'q6-8h',
  concentrations: [
  { value: 200, unit: 'mg/tablet', label: 'Tab 200mg' },
  { value: 400, unit: 'mg/tablet', label: 'Tab 400mg' }],

  administrationNotes:
  'ลดกรดในกระเพาะ ปัจจุบันนิยมใช้ Famotidine หรือ Omeprazole แทน',
  warnings: 'มี Drug interaction มาก (ยับยั้ง Cytochrome P450)',
  sideEffects: 'ท้องเสีย, ง่วงซึม'
},
{
  id: 'cisapride',
  name: 'Cisapride',
  thaiName: 'ซิซาไพรด์',
  drugClass: 'Prokinetic',
  species: 'cat',
  dosage: { dog: { min: 0.1, max: 0.5 }, cat: { min: 0.1, max: 0.5 } },
  routes: ['PO'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 10, unit: 'mg/tablet', label: 'Tab 10mg (compounded)' }],

  administrationNotes:
  'ใช้รักษาท้องผูกเรื้อรังในแมว (Megacolon) ให้ก่อนอาหาร 30 นาที',
  warnings: 'ถูกถอนออกจากตลาดคน แต่ยังใช้ในสัตว์ (ต้องสั่งผสม)',
  sideEffects: 'ท้องเสีย'
},
{
  id: 'clindamycin',
  name: 'Clindamycin',
  thaiName: 'คลินดามัยซิน',
  drugClass: 'Antibiotic (Lincosamide)',
  species: 'both',
  dosage: { dog: { min: 5.5, max: 11 }, cat: { min: 5.5, max: 11 } },
  routes: ['PO'],
  frequency: 'q12h',
  concentrations: [
  { value: 75, unit: 'mg/capsule', label: 'Antirobe 75mg' },
  { value: 150, unit: 'mg/capsule', label: 'Cap 150mg' },
  { value: 300, unit: 'mg/capsule', label: 'Cap 300mg' }],

  administrationNotes: 'ดีต่อการติดเชื้อในช่องปาก กระดูก และ Toxoplasmosis',
  warnings: 'ระวังในสัตว์โรคตับไต',
  sideEffects: 'ท้องเสีย, อาเจียน'
},
{
  id: 'clomipramine',
  name: 'Clomipramine',
  thaiName: 'โคลมิพรามีน',
  drugClass: 'Tricyclic Antidepressant',
  species: 'both',
  dosage: { dog: { min: 1, max: 3 }, cat: { min: 0.25, max: 0.5 } },
  routes: ['PO'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 20, unit: 'mg/tablet', label: 'Clomicalm 20mg' },
  { value: 40, unit: 'mg/tablet', label: 'Clomicalm 40mg' },
  { value: 80, unit: 'mg/tablet', label: 'Clomicalm 80mg' }],

  administrationNotes:
  'ใช้รักษาพฤติกรรมวิตกกังวล (Separation anxiety) ต้องใช้ต่อเนื่อง 4-6 สัปดาห์จึงเห็นผล',
  warnings: 'ห้ามใช้ร่วมกับ MAOIs',
  sideEffects: 'ง่วงซึม, ปากแห้ง, ท้องผูก'
},
{
  id: 'cyclosporine',
  name: 'Cyclosporine',
  thaiName: 'ไซโคลสปอริน',
  drugClass: 'Immunosuppressant',
  species: 'both',
  dosage: { dog: { min: 5, max: 5 }, cat: { min: 5, max: 7 } },
  routes: ['PO', 'Ophthalmic'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 25, unit: 'mg/capsule', label: 'Atopica 25mg' },
  { value: 50, unit: 'mg/capsule', label: 'Atopica 50mg' },
  { value: 100, unit: 'mg/capsule', label: 'Atopica 100mg' }],

  administrationNotes:
  'ให้ตอนท้องว่าง (2 ชม. ก่อนหรือหลังอาหาร) ใช้รักษา Atopic dermatitis',
  warnings: 'ระวังการติดเชื้อฉวยโอกาส',
  sideEffects: 'อาเจียน, ท้องเสีย, เหงือกบวม'
},
// ===== D =====
{
  id: 'dexamethasone',
  name: 'Dexamethasone',
  thaiName: 'เดกซาเมทาโซน',
  drugClass: 'Corticosteroid',
  species: 'both',
  dosage: { dog: { min: 0.1, max: 0.5 }, cat: { min: 0.1, max: 0.5 } },
  routes: ['IV', 'IM', 'SC', 'PO'],
  frequency: 'q24h',
  concentrations: [
  { value: 2, unit: 'mg/ml', label: 'Inj 2mg/ml' },
  { value: 4, unit: 'mg/ml', label: 'Inj 4mg/ml' },
  { value: 0.5, unit: 'mg/tablet', label: 'Tab 0.5mg' }],

  administrationNotes: 'ห้ามหยุดยาทันทีหากใช้ติดต่อกันนาน ควรค่อยๆ ลดโดส',
  warnings: 'ห้ามใช้ในสัตว์ท้อง เบาหวาน แผลกระจกตา',
  sideEffects: 'กินน้ำบ่อย, ปัสสาวะบ่อย, กินเก่ง, หอบ'
},
{
  id: 'dexmedetomidine',
  name: 'Dexmedetomidine',
  thaiName: 'เดกซ์เมเดโทมิดีน',
  drugClass: 'Alpha-2 Agonist (Sedative)',
  species: 'both',
  dosage: { dog: { min: 0.005, max: 0.02 }, cat: { min: 0.01, max: 0.04 } },
  routes: ['IV', 'IM'],
  frequency: 'Single dose / PRN',
  concentrations: [
  { value: 0.1, unit: 'mg/ml', label: 'Dexdomitor 0.1mg/ml' },
  { value: 0.5, unit: 'mg/ml', label: 'Dexdomitor 0.5mg/ml' }],

  administrationNotes: 'ใช้สงบสัตว์ก่อนทำหัตถการ Reverse ได้ด้วย Atipamezole',
  warnings: 'ทำให้หัวใจเต้นช้ามาก ห้ามใช้ในสัตว์โรคหัวใจ',
  sideEffects: 'หัวใจเต้นช้า, ความดันสูงแล้วต่ำ, อาเจียน'
},
{
  id: 'diazepam',
  name: 'Diazepam',
  thaiName: 'ไดอะซีแพม',
  drugClass: 'Benzodiazepine',
  species: 'both',
  dosage: { dog: { min: 0.25, max: 0.5 }, cat: { min: 0.25, max: 0.5 } },
  routes: ['IV', 'Rectal', 'PO'],
  frequency: 'PRN',
  concentrations: [
  { value: 5, unit: 'mg/ml', label: 'Inj 5mg/ml (Valium)' },
  { value: 2, unit: 'mg/tablet', label: 'Tab 2mg' },
  { value: 5, unit: 'mg/tablet', label: 'Tab 5mg' }],

  administrationNotes:
  'ใช้ระงับชักฉุกเฉิน (IV/Rectal) ห้ามผสมกับยาอื่นในไซริงค์',
  warnings: 'ระวังในแมว (Oral) อาจทำให้ตับวาย (Idiosyncratic)',
  sideEffects: 'ง่วงซึม, เดินเซ'
},
{
  id: 'digoxin',
  name: 'Digoxin',
  thaiName: 'ดิจอกซิน',
  drugClass: 'Cardiac Glycoside',
  species: 'both',
  dosage: { dog: { min: 0.005, max: 0.01 }, cat: { min: 0.005, max: 0.01 } },
  routes: ['PO'],
  frequency: 'q12h',
  concentrations: [
  { value: 0.0625, unit: 'mg/tablet', label: 'Tab 0.0625mg' },
  { value: 0.25, unit: 'mg/tablet', label: 'Tab 0.25mg' }],

  administrationNotes:
  'ช่วงการรักษาแคบมาก (Narrow therapeutic index) ต้องวัดระดับยาในเลือด',
  warnings: 'พิษจาก Digoxin: อาเจียน ท้องเสีย หัวใจเต้นผิดจังหวะ',
  sideEffects: 'เบื่ออาหาร, อาเจียน, หัวใจเต้นผิดจังหวะ'
},
{
  id: 'diltiazem',
  name: 'Diltiazem',
  thaiName: 'ดิลไทอะเซม',
  drugClass: 'Calcium Channel Blocker',
  species: 'cat',
  dosage: { dog: { min: 0.5, max: 1.5 }, cat: { min: 1.75, max: 2.5 } },
  routes: ['PO'],
  frequency: 'q8h (or q12h SR)',
  concentrations: [
  { value: 30, unit: 'mg/tablet', label: 'Tab 30mg' },
  { value: 60, unit: 'mg/tablet', label: 'Tab 60mg' }],

  administrationNotes: 'ใช้รักษา HCM ในแมว ลดอัตราการเต้นของหัวใจ',
  warnings: 'ระวังในสัตว์หัวใจวาย',
  sideEffects: 'หัวใจเต้นช้า, ความดันต่ำ'
},
{
  id: 'diphenhydramine',
  name: 'Diphenhydramine',
  thaiName: 'ไดเฟนไฮดรามีน',
  drugClass: 'Antihistamine',
  species: 'both',
  dosage: { dog: { min: 2, max: 4 }, cat: { min: 2, max: 4 } },
  routes: ['PO', 'IM', 'IV'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 25, unit: 'mg/capsule', label: 'Cap 25mg (Benadryl)' },
  { value: 50, unit: 'mg/ml', label: 'Inj 50mg/ml' }],

  administrationNotes: 'ใช้แก้แพ้ คัน หรือก่อนให้เลือด',
  warnings: 'ทำให้ง่วงซึม',
  sideEffects: 'ง่วงซึม, ปากแห้ง'
},
{
  id: 'dobutamine',
  name: 'Dobutamine',
  thaiName: 'โดบิวทามีน',
  drugClass: 'Inotrope (Beta-1 Agonist)',
  species: 'both',
  dosage: { dog: { min: 2, max: 15 }, cat: { min: 1, max: 5 } },
  routes: ['IV'],
  frequency: 'CRI (mcg/kg/min)',
  concentrations: [{ value: 12.5, unit: 'mg/ml', label: 'Inj 250mg/20ml' }],
  administrationNotes:
  'ให้แบบ CRI เท่านั้น (ห้าม Bolus) ใช้เพิ่มแรงบีบตัวของหัวใจ',
  warnings: 'ระวังหัวใจเต้นผิดจังหวะ แมวไวกว่าสุนัข',
  sideEffects: 'หัวใจเต้นเร็ว, หัวใจเต้นผิดจังหวะ'
},
{
  id: 'dopamine',
  name: 'Dopamine',
  thaiName: 'โดพามีน',
  drugClass: 'Vasopressor / Inotrope',
  species: 'both',
  dosage: { dog: { min: 2, max: 10 }, cat: { min: 2, max: 10 } },
  routes: ['IV'],
  frequency: 'CRI (mcg/kg/min)',
  concentrations: [{ value: 40, unit: 'mg/ml', label: 'Inj 200mg/5ml' }],
  administrationNotes:
  'ให้แบบ CRI เท่านั้น Low dose (2-5): ขยายหลอดเลือดไต High dose (5-10): เพิ่มความดัน',
  warnings: 'ห้ามฉีดนอกเส้นเลือด (ทำให้เนื้อตาย)',
  sideEffects: 'หัวใจเต้นเร็ว, หัวใจเต้นผิดจังหวะ'
},
{
  id: 'doxapram',
  name: 'Doxapram',
  thaiName: 'ด็อกซาแพรม',
  drugClass: 'Respiratory Stimulant',
  species: 'both',
  dosage: { dog: { min: 1, max: 5 }, cat: { min: 1, max: 5 } },
  routes: ['IV'],
  frequency: 'PRN',
  concentrations: [{ value: 20, unit: 'mg/ml', label: 'Inj 20mg/ml' }],
  administrationNotes: 'ใช้กระตุ้นการหายใจในลูกสัตว์แรกเกิด หยดใต้ลิ้นได้',
  warnings: 'ห้ามใช้ในสัตว์ชัก',
  sideEffects: 'หัวใจเต้นเร็ว, ชัก (หากให้มากเกิน)'
},
{
  id: 'doxycycline',
  name: 'Doxycycline',
  thaiName: 'ด็อกซีไซคลิน',
  drugClass: 'Antibiotic (Tetracycline)',
  species: 'both',
  dosage: { dog: { min: 5, max: 10 }, cat: { min: 5, max: 10 } },
  routes: ['PO', 'IV'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 100, unit: 'mg/tablet', label: 'Tab 100mg' },
  { value: 50, unit: 'mg/capsule', label: 'Cap 50mg' }],

  administrationNotes:
  'ในแมว *ต้อง* ป้อนน้ำตามทุกครั้ง (ป้องกัน Esophageal stricture) ห้ามให้พร้อมนม/แคลเซียม',
  warnings: 'ระวังในสัตว์ท้อง ฟันเหลืองในสัตว์อายุน้อย',
  sideEffects: 'คลื่นไส้, อาเจียน'
},
// ===== E =====
{
  id: 'enalapril',
  name: 'Enalapril',
  thaiName: 'เอนาลาพริล',
  drugClass: 'ACE Inhibitor',
  species: 'both',
  dosage: { dog: { min: 0.25, max: 0.5 }, cat: { min: 0.25, max: 0.5 } },
  routes: ['PO'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 5, unit: 'mg/tablet', label: 'Tab 5mg' },
  { value: 10, unit: 'mg/tablet', label: 'Tab 10mg' },
  { value: 20, unit: 'mg/tablet', label: 'Tab 20mg' }],

  administrationNotes: 'ใช้รักษาโรคหัวใจและความดันสูง ตรวจค่าไตหลังเริ่มยา',
  warnings: 'ระวังค่าไตสูงขึ้น ความดันต่ำ',
  sideEffects: 'เบื่ออาหาร, ความดันต่ำ'
},
{
  id: 'enrofloxacin',
  name: 'Enrofloxacin',
  thaiName: 'เอนโรฟลอกซาซิน',
  drugClass: 'Antibiotic (Fluoroquinolone)',
  species: 'both',
  dosage: { dog: { min: 5, max: 10 }, cat: { min: 5, max: 5 } },
  routes: ['PO', 'IM', 'SC', 'IV'],
  frequency: 'q24h',
  concentrations: [
  { value: 25, unit: 'mg/ml', label: 'Baytril 2.5%' },
  { value: 50, unit: 'mg/ml', label: 'Baytril 5%' },
  { value: 100, unit: 'mg/ml', label: 'Baytril 10%' },
  { value: 15, unit: 'mg/tablet', label: 'Tab 15mg' },
  { value: 50, unit: 'mg/tablet', label: 'Tab 50mg' },
  { value: 150, unit: 'mg/tablet', label: 'Tab 150mg' }],

  administrationNotes:
  'ห้ามใช้ในลูกสัตว์ที่กำลังเจริญเติบโต ในแมวห้ามเกิน 5 mg/kg/day',
  warnings: '⚠️ ในแมวหากเกินขนาดอาจทำให้ตาบอด (Retinal degeneration)',
  sideEffects: 'คลื่นไส้, อาเจียน, ชัก (IV เร็วเกินไป)'
},
{
  id: 'epinephrine',
  name: 'Epinephrine',
  thaiName: 'เอพิเนฟริน (Adrenaline)',
  drugClass: 'Adrenergic Agonist',
  species: 'both',
  dosage: { dog: { min: 0.01, max: 0.02 }, cat: { min: 0.01, max: 0.02 } },
  routes: ['IV', 'IT', 'IM'],
  frequency: 'CPR every 3-5 min',
  concentrations: [{ value: 1, unit: 'mg/ml', label: 'Inj 1:1000 (1mg/ml)' }],
  administrationNotes:
  'CPR: 0.01 mg/kg IV ทุก 3-5 นาที Anaphylaxis: 0.01 mg/kg IM',
  warnings: 'ระวังหัวใจเต้นผิดจังหวะ',
  sideEffects: 'หัวใจเต้นเร็วมาก, ความดันสูง'
},
{
  id: 'erythromycin',
  name: 'Erythromycin',
  thaiName: 'อีริโทรมัยซิน',
  drugClass: 'Antibiotic (Macrolide) / Prokinetic',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 1 }, cat: { min: 0.5, max: 1 } },
  routes: ['PO', 'IV'],
  frequency: 'q8h',
  concentrations: [
  { value: 250, unit: 'mg/tablet', label: 'Tab 250mg' },
  { value: 500, unit: 'mg/tablet', label: 'Tab 500mg' }],

  administrationNotes:
  'ขนาดต่ำ (0.5-1 mg/kg) ใช้เป็น Prokinetic กระตุ้นกระเพาะอาหาร',
  warnings: 'อาจทำให้อาเจียนหากให้ขนาดสูง',
  sideEffects: 'อาเจียน, ท้องเสีย'
},
{
  id: 'esmolol',
  name: 'Esmolol',
  thaiName: 'เอสโมลอล',
  drugClass: 'Beta-blocker (Ultra-short acting)',
  species: 'both',
  dosage: { dog: { min: 0.05, max: 0.1 }, cat: { min: 0.05, max: 0.1 } },
  routes: ['IV'],
  frequency: 'CRI',
  concentrations: [{ value: 10, unit: 'mg/ml', label: 'Inj 10mg/ml' }],
  administrationNotes:
  'ออกฤทธิ์สั้นมาก ใช้ลดหัวใจเต้นเร็วฉุกเฉิน Loading 0.05-0.1 mg/kg IV แล้วต่อ CRI',
  warnings: 'ระวังหัวใจเต้นช้าเกินไป',
  sideEffects: 'หัวใจเต้นช้า, ความดันต่ำ'
},
// ===== F =====
{
  id: 'famotidine',
  name: 'Famotidine',
  thaiName: 'ฟาโมทิดีน',
  drugClass: 'H2 Blocker',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 1 }, cat: { min: 0.5, max: 1 } },
  routes: ['PO', 'IV', 'SC'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 10, unit: 'mg/tablet', label: 'Tab 10mg' },
  { value: 20, unit: 'mg/tablet', label: 'Tab 20mg' },
  { value: 10, unit: 'mg/ml', label: 'Inj 10mg/ml' }],

  administrationNotes:
  'ลดกรดในกระเพาะ ดีกว่า Cimetidine (Drug interaction น้อยกว่า)',
  warnings: 'ระวังในสัตว์โรคไต',
  sideEffects: 'หัวใจเต้นช้า (IV เร็ว)'
},
{
  id: 'fenbendazole',
  name: 'Fenbendazole',
  thaiName: 'เฟนเบนดาโซล',
  drugClass: 'Anthelmintic',
  species: 'both',
  dosage: { dog: { min: 50, max: 50 }, cat: { min: 50, max: 50 } },
  routes: ['PO'],
  frequency: 'q24h (3-5 days)',
  concentrations: [
  { value: 222, unit: 'mg/ml', label: 'Panacur 10% (100mg/ml)' },
  { value: 500, unit: 'mg/tablet', label: 'Tab 500mg' }],

  administrationNotes:
  'ถ่ายพยาธิรวม (Roundworm, Hookworm, Whipworm, Giardia) ให้ 3-5 วันติดต่อกัน',
  warnings: 'ปลอดภัยสูงมาก ใช้ในสัตว์ท้องได้',
  sideEffects: 'อาเจียน (น้อยมาก)'
},
{
  id: 'fentanyl',
  name: 'Fentanyl',
  thaiName: 'เฟนทานิล',
  drugClass: 'Analgesic (Opioid)',
  species: 'both',
  dosage: {
    dog: { min: 0.002, max: 0.005 },
    cat: { min: 0.001, max: 0.003 }
  },
  routes: ['IV', 'Transdermal'],
  frequency: 'CRI or Patch (72h)',
  concentrations: [{ value: 0.05, unit: 'mg/ml', label: 'Inj 50mcg/ml' }],
  administrationNotes: 'แก้ปวดรุนแรง ให้แบบ CRI 2-5 mcg/kg/hr หรือแปะ Patch',
  warnings: 'ทำให้หายใจช้า เตรียม Naloxone ไว้',
  sideEffects: 'หายใจช้า, หัวใจเต้นช้า, ง่วงซึม'
},
{
  id: 'fluconazole',
  name: 'Fluconazole',
  thaiName: 'ฟลูโคนาโซล',
  drugClass: 'Antifungal (Azole)',
  species: 'both',
  dosage: { dog: { min: 5, max: 10 }, cat: { min: 5, max: 10 } },
  routes: ['PO', 'IV'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 50, unit: 'mg/capsule', label: 'Cap 50mg' },
  { value: 150, unit: 'mg/capsule', label: 'Cap 150mg' },
  { value: 200, unit: 'mg/capsule', label: 'Cap 200mg' },
  { value: 2, unit: 'mg/ml', label: 'Inj 2mg/ml' }],

  administrationNotes:
  'ผ่าน Blood-brain barrier ได้ดี ใช้รักษาเชื้อราในสมอง/ตา',
  warnings: 'ระวังค่าตับขึ้น',
  sideEffects: 'เบื่ออาหาร, อาเจียน, ค่าตับขึ้น'
},
{
  id: 'flumazenil',
  name: 'Flumazenil',
  thaiName: 'ฟลูมาเซนิล',
  drugClass: 'Benzodiazepine Antagonist',
  species: 'both',
  dosage: { dog: { min: 0.01, max: 0.02 }, cat: { min: 0.01, max: 0.02 } },
  routes: ['IV'],
  frequency: 'PRN',
  concentrations: [{ value: 0.1, unit: 'mg/ml', label: 'Inj 0.1mg/ml' }],
  administrationNotes: 'ใช้ reverse Diazepam/Midazolam ออกฤทธิ์เร็ว',
  warnings: 'อาจทำให้ชักกลับมาหากใช้ Benzodiazepine เพื่อหยุดชัก',
  sideEffects: 'กระวนกระวาย, ชัก (กรณี reverse anticonvulsant)'
},
{
  id: 'fluoxetine',
  name: 'Fluoxetine',
  thaiName: 'ฟลูออกซิทีน (Prozac)',
  drugClass: 'SSRI Antidepressant',
  species: 'both',
  dosage: { dog: { min: 1, max: 2 }, cat: { min: 0.5, max: 1 } },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [
  { value: 10, unit: 'mg/capsule', label: 'Cap 10mg' },
  { value: 20, unit: 'mg/capsule', label: 'Cap 20mg' }],

  administrationNotes:
  'ใช้รักษาพฤติกรรมวิตกกังวล ฉี่ไม่เป็นที่ ต้องใช้ 4-6 สัปดาห์จึงเห็นผล',
  warnings: 'ห้ามใช้ร่วมกับ MAOIs หรือ Tramadol',
  sideEffects: 'เบื่ออาหาร, ง่วงซึม'
},
{
  id: 'furosemide',
  name: 'Furosemide',
  thaiName: 'ฟูโรซีไมด์',
  drugClass: 'Diuretic (Loop)',
  species: 'both',
  dosage: { dog: { min: 2, max: 4 }, cat: { min: 1, max: 2 } },
  routes: ['IV', 'IM', 'SC', 'PO'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 10, unit: 'mg/ml', label: 'Lasix Inj 10mg/ml' },
  { value: 40, unit: 'mg/tablet', label: 'Tab 40mg' },
  { value: 500, unit: 'mg/tablet', label: 'Tab 500mg' }],

  administrationNotes: 'ใช้ขับน้ำ ลดบวมน้ำในปอด ติดตามค่าไตและอิเล็กโทรไลต์',
  warnings: 'ระวังภาวะขาดน้ำ โพแทสเซียมต่ำ',
  sideEffects: 'กินน้ำบ่อย, ปัสสาวะบ่อย, ขาดน้ำ'
},
// ===== G =====
{
  id: 'gabapentin',
  name: 'Gabapentin',
  thaiName: 'กาบาเพนติน',
  drugClass: 'Analgesic / Anticonvulsant',
  species: 'both',
  dosage: { dog: { min: 10, max: 20 }, cat: { min: 5, max: 10 } },
  routes: ['PO'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 100, unit: 'mg/capsule', label: 'Cap 100mg' },
  { value: 300, unit: 'mg/capsule', label: 'Cap 300mg' },
  { value: 400, unit: 'mg/capsule', label: 'Cap 400mg' }],

  administrationNotes:
  'ระงับปวดระบบประสาท ลดเครียดแมวก่อนมาคลินิก (ให้ 2-3 ชม. ก่อน)',
  warnings: 'ระวังยาน้ำที่มี Xylitol (เป็นพิษต่อสุนัข)',
  sideEffects: 'ง่วงซึม, เดินเซ'
},
{
  id: 'gentamicin',
  name: 'Gentamicin',
  thaiName: 'เจนตามัยซิน',
  drugClass: 'Antibiotic (Aminoglycoside)',
  species: 'both',
  dosage: { dog: { min: 9, max: 14 }, cat: { min: 5, max: 8 } },
  routes: ['IV', 'IM', 'SC'],
  frequency: 'q24h',
  concentrations: [
  { value: 40, unit: 'mg/ml', label: 'Inj 40mg/ml' },
  { value: 80, unit: 'mg/ml', label: 'Inj 80mg/ml' }],

  administrationNotes: 'ให้วันละครั้ง (Once daily) ต้องติดตามค่าไต',
  warnings: 'เป็นพิษต่อไต (Nephrotoxic) และหู (Ototoxic)',
  sideEffects: 'ไตวาย, หูหนวก'
},
{
  id: 'glipizide',
  name: 'Glipizide',
  thaiName: 'กลิพิไซด์',
  drugClass: 'Oral Hypoglycemic',
  species: 'cat',
  dosage: { cat: { min: 0.25, max: 0.5 } },
  routes: ['PO'],
  frequency: 'q12h',
  concentrations: [{ value: 5, unit: 'mg/tablet', label: 'Tab 5mg' }],
  administrationNotes:
  'ใช้รักษาเบาหวานในแมว เริ่ม 2.5 mg/cat q12h ให้พร้อมอาหาร',
  warnings: 'ระวังน้ำตาลต่ำ ไม่ได้ผลในแมวทุกตัว',
  sideEffects: 'น้ำตาลต่ำ, อาเจียน, ค่าตับขึ้น'
},
{
  id: 'glycopyrrolate',
  name: 'Glycopyrrolate',
  thaiName: 'ไกลโคไพร์โรเลต',
  drugClass: 'Anticholinergic',
  species: 'both',
  dosage: { dog: { min: 0.005, max: 0.01 }, cat: { min: 0.005, max: 0.01 } },
  routes: ['IV', 'IM', 'SC'],
  frequency: 'PRN',
  concentrations: [{ value: 0.2, unit: 'mg/ml', label: 'Inj 0.2mg/ml' }],
  administrationNotes:
  'ใช้แทน Atropine ได้ ไม่ผ่าน Blood-brain barrier (ไม่ทำให้ม่านตาขยาย)',
  warnings: 'ระวังในสัตว์หัวใจเต้นเร็ว',
  sideEffects: 'ปากแห้ง, หัวใจเต้นเร็ว'
},
{
  id: 'griseofulvin',
  name: 'Griseofulvin',
  thaiName: 'กริซีโอฟุลวิน',
  drugClass: 'Antifungal',
  species: 'both',
  dosage: { dog: { min: 25, max: 50 }, cat: { min: 25, max: 50 } },
  routes: ['PO'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 125, unit: 'mg/tablet', label: 'Tab 125mg' },
  { value: 500, unit: 'mg/tablet', label: 'Tab 500mg' }],

  administrationNotes: 'ให้พร้อมอาหารไขมันสูง ใช้รักษา Dermatophytosis',
  warnings: 'ห้ามใช้ในสัตว์ท้อง (Teratogenic) ห้ามใช้ในแมว FIV+',
  sideEffects: 'เบื่ออาหาร, อาเจียน, กดไขกระดูก'
},
// ===== H =====
{
  id: 'heparin',
  name: 'Heparin',
  thaiName: 'เฮพาริน',
  drugClass: 'Anticoagulant',
  species: 'both',
  dosage: { dog: { min: 100, max: 200 }, cat: { min: 100, max: 200 } },
  routes: ['IV', 'SC'],
  frequency: 'q6-8h',
  concentrations: [{ value: 1000, unit: 'mg/ml', label: 'Inj 1000 IU/ml' }],
  administrationNotes:
  'ใช้ป้องกันลิ่มเลือด (DIC, Thromboembolism) หน่วยเป็น IU/kg',
  warnings: 'ระวังเลือดออกง่าย ตรวจ aPTT',
  sideEffects: 'เลือดออกง่าย'
},
{
  id: 'hydralazine',
  name: 'Hydralazine',
  thaiName: 'ไฮดราลาซีน',
  drugClass: 'Vasodilator',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 2 }, cat: { min: 0.5, max: 0.8 } },
  routes: ['PO'],
  frequency: 'q12h',
  concentrations: [{ value: 25, unit: 'mg/tablet', label: 'Tab 25mg' }],
  administrationNotes: 'ใช้ลดความดันฉุกเฉินหรือลด Afterload ในโรคหัวใจ',
  warnings: 'ระวังความดันต่ำเกินไป',
  sideEffects: 'ความดันต่ำ, หัวใจเต้นเร็ว'
},
{
  id: 'hydrochlorothiazide',
  name: 'Hydrochlorothiazide',
  thaiName: 'ไฮโดรคลอโรไทอะไซด์',
  drugClass: 'Diuretic (Thiazide)',
  species: 'both',
  dosage: { dog: { min: 2, max: 4 }, cat: { min: 1, max: 2 } },
  routes: ['PO'],
  frequency: 'q12h',
  concentrations: [{ value: 25, unit: 'mg/tablet', label: 'Tab 25mg' }],
  administrationNotes: 'ใช้ร่วมกับ Furosemide ในกรณีดื้อยา',
  warnings: 'ระวังโพแทสเซียมต่ำ',
  sideEffects: 'ขาดน้ำ, อิเล็กโทรไลต์ผิดปกติ'
},
{
  id: 'hydrocortisone',
  name: 'Hydrocortisone',
  thaiName: 'ไฮโดรคอร์ติโซน',
  drugClass: 'Corticosteroid',
  species: 'both',
  dosage: { dog: { min: 1, max: 5 }, cat: { min: 1, max: 5 } },
  routes: ['IV', 'PO', 'Topical'],
  frequency: 'q6-12h',
  concentrations: [
  { value: 100, unit: 'mg/ml', label: 'Solu-Cortef 100mg vial' },
  { value: 10, unit: 'mg/tablet', label: 'Tab 10mg' }],

  administrationNotes:
  'ใช้รักษา Addisonian crisis (IV) หรือ Hypoadrenocorticism',
  warnings: 'ห้ามหยุดทันทีหากใช้นาน',
  sideEffects: 'กินน้ำบ่อย, ปัสสาวะบ่อย'
},
// ===== I =====
{
  id: 'insulin-regular',
  name: 'Insulin (Regular)',
  thaiName: 'อินซูลิน (Regular)',
  drugClass: 'Hormone',
  species: 'both',
  dosage: { dog: { min: 0.1, max: 0.25 }, cat: { min: 0.1, max: 0.25 } },
  routes: ['IV', 'IM', 'SC'],
  frequency: 'q12h (SC) or CRI (IV)',
  concentrations: [{ value: 100, unit: 'mg/ml', label: 'Inj 100 IU/ml' }],
  administrationNotes:
  'DKA: 0.1 IU/kg/hr CRI (Regular insulin) Maintenance: 0.25-0.5 IU/kg SC q12h',
  warnings: 'ระวังน้ำตาลต่ำ ต้องวัด BG ทุก 1-2 ชม.',
  sideEffects: 'น้ำตาลต่ำ (Hypoglycemia)'
},
{
  id: 'isoflurane',
  name: 'Isoflurane',
  thaiName: 'ไอโซฟลูเรน',
  drugClass: 'Inhalation Anesthetic',
  species: 'both',
  dosage: { dog: { min: 1.3, max: 1.6 }, cat: { min: 1.6, max: 2 } },
  routes: ['Inhalation'],
  frequency: 'Continuous (MAC %)',
  concentrations: [{ value: 100, unit: '%', label: 'Liquid 100%' }],
  administrationNotes:
  'MAC สุนัข ~1.3% แมว ~1.6% ใช้ผ่านเครื่อง Vaporizer เท่านั้น',
  warnings: 'ทำให้ความดันต่ำ ต้องมอนิเตอร์ตลอด',
  sideEffects: 'ความดันต่ำ, หายใจช้า'
},
{
  id: 'itraconazole',
  name: 'Itraconazole',
  thaiName: 'อิทราโคนาโซล',
  drugClass: 'Antifungal (Azole)',
  species: 'both',
  dosage: { dog: { min: 5, max: 10 }, cat: { min: 5, max: 10 } },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [{ value: 100, unit: 'mg/capsule', label: 'Cap 100mg' }],
  administrationNotes:
  'ให้พร้อมอาหารไขมันสูง ใช้รักษา Dermatophytosis, Aspergillosis',
  warnings: 'เป็นพิษต่อตับ ตรวจค่าตับทุก 2 สัปดาห์',
  sideEffects: 'เบื่ออาหาร, อาเจียน, ค่าตับขึ้น'
},
{
  id: 'ivermectin',
  name: 'Ivermectin',
  thaiName: 'ไอเวอร์เมคติน',
  drugClass: 'Antiparasitic',
  species: 'both',
  dosage: { dog: { min: 0.006, max: 0.6 }, cat: { min: 0.024, max: 0.024 } },
  routes: ['PO', 'SC'],
  frequency: 'Varies by indication',
  concentrations: [
  { value: 10, unit: 'mg/ml', label: 'Inj 1% (10mg/ml)' },
  { value: 3, unit: 'mg/tablet', label: 'Heartgard 68mcg-272mcg' }],

  administrationNotes:
  'Heartworm prevention: 6 mcg/kg q30d Demodex: 0.3-0.6 mg/kg q24h (ค่อยๆ เพิ่มโดส)',
  warnings:
  '⚠️ ห้ามใช้ในสุนัขพันธุ์ Collie, Sheltie (MDR1 mutation) อาจเสียชีวิตได้',
  sideEffects: 'เดินเซ, ม่านตาขยาย, ชัก (พิษ)'
},
// ===== K =====
{
  id: 'ketoconazole',
  name: 'Ketoconazole',
  thaiName: 'คีโตโคนาโซล',
  drugClass: 'Antifungal (Azole)',
  species: 'both',
  dosage: { dog: { min: 5, max: 10 }, cat: { min: 5, max: 10 } },
  routes: ['PO'],
  frequency: 'q12-24h',
  concentrations: [{ value: 200, unit: 'mg/tablet', label: 'Tab 200mg' }],
  administrationNotes: 'ให้พร้อมอาหาร ต้องมีกรดในกระเพาะจึงดูดซึมได้ดี',
  warnings: 'เป็นพิษต่อตับ มี Drug interaction มาก',
  sideEffects: 'เบื่ออาหาร, อาเจียน, ค่าตับขึ้น'
},
{
  id: 'ketamine',
  name: 'Ketamine',
  thaiName: 'คีตามีน',
  drugClass: 'Dissociative Anesthetic',
  species: 'both',
  dosage: { dog: { min: 5, max: 10 }, cat: { min: 5, max: 10 } },
  routes: ['IV', 'IM'],
  frequency: 'Induction',
  concentrations: [
  { value: 50, unit: 'mg/ml', label: 'Inj 50mg/ml' },
  { value: 100, unit: 'mg/ml', label: 'Inj 100mg/ml' }],

  administrationNotes: 'มักใช้ร่วมกับ Benzodiazepines เพื่อลดกล้ามเนื้อเกร็ง',
  warnings: 'ห้ามใช้ในสัตว์ความดันลูกตาสูง/ความดันในกะโหลกสูง',
  sideEffects: 'หัวใจเต้นเร็ว, ความดันสูง, กล้ามเนื้อเกร็ง, น้ำลายไหล'
},
{
  id: 'ketoprofen',
  name: 'Ketoprofen',
  thaiName: 'คีโตโปรเฟน',
  drugClass: 'NSAID',
  species: 'both',
  dosage: { dog: { min: 1, max: 2 }, cat: { min: 1, max: 1 } },
  routes: ['SC', 'PO'],
  frequency: 'q24h (max 5 days)',
  concentrations: [
  { value: 10, unit: 'mg/ml', label: 'Ketofen Inj 10mg/ml' },
  { value: 5, unit: 'mg/tablet', label: 'Ketofen Tab 5mg' }],

  administrationNotes: 'ใช้ระยะสั้นเท่านั้น (ไม่เกิน 5 วัน)',
  warnings: 'ห้ามใช้ร่วมกับ NSAIDs อื่นหรือ Steroids',
  sideEffects: 'อาเจียน, ถ่ายดำ, ไตวาย'
},
// ===== L =====
{
  id: 'lactulose',
  name: 'Lactulose',
  thaiName: 'แลคตูโลส',
  drugClass: 'Laxative / Osmotic',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 1 }, cat: { min: 0.5, max: 1 } },
  routes: ['PO'],
  frequency: 'q8-12h',
  concentrations: [{ value: 667, unit: 'mg/ml', label: 'Syrup 66.7%' }],
  administrationNotes:
  'ใช้รักษาท้องผูกหรือ Hepatic encephalopathy ปรับโดสตามอุจจาระ',
  warnings: 'ระวังท้องเสียหากให้มากเกินไป',
  sideEffects: 'ถ่ายเหลว, ท้องอืด'
},
{
  id: 'levetiracetam',
  name: 'Levetiracetam',
  thaiName: 'เลเวทิราซีแทม (Keppra)',
  drugClass: 'Anticonvulsant',
  species: 'both',
  dosage: { dog: { min: 20, max: 30 }, cat: { min: 20, max: 30 } },
  routes: ['PO', 'IV'],
  frequency: 'q8h',
  concentrations: [
  { value: 250, unit: 'mg/tablet', label: 'Tab 250mg' },
  { value: 500, unit: 'mg/tablet', label: 'Tab 500mg' },
  { value: 100, unit: 'mg/ml', label: 'Inj 100mg/ml' }],

  administrationNotes:
  'ปลอดภัยต่อตับ ใช้ร่วมกับ Phenobarbital ได้ IV: ให้ช้าๆ 5 นาที',
  warnings: 'ห้ามหยุดทันที (อาจชักกลับ)',
  sideEffects: 'ง่วงซึม, เดินเซ'
},
{
  id: 'levothyroxine',
  name: 'Levothyroxine',
  thaiName: 'เลโวไทรอกซีน',
  drugClass: 'Thyroid Hormone',
  species: 'dog',
  dosage: { dog: { min: 0.02, max: 0.04 } },
  routes: ['PO'],
  frequency: 'q12h',
  concentrations: [
  { value: 0.1, unit: 'mg/tablet', label: 'Soloxine 0.1mg' },
  { value: 0.2, unit: 'mg/tablet', label: 'Soloxine 0.2mg' },
  { value: 0.3, unit: 'mg/tablet', label: 'Soloxine 0.3mg' },
  { value: 0.5, unit: 'mg/tablet', label: 'Soloxine 0.5mg' },
  { value: 0.8, unit: 'mg/tablet', label: 'Soloxine 0.8mg' }],

  administrationNotes:
  'ให้ตอนท้องว่าง ตรวจ T4 หลังเริ่มยา 4-6 สัปดาห์ (เก็บเลือด 4-6 ชม. หลังกินยา)',
  warnings: 'เริ่มขนาดต่ำในสัตว์โรคหัวใจ',
  sideEffects: 'หัวใจเต้นเร็ว, กระวนกระวาย (หากให้มากเกิน)'
},
{
  id: 'lidocaine',
  name: 'Lidocaine',
  thaiName: 'ลิโดเคน',
  drugClass: 'Local Anesthetic / Antiarrhythmic',
  species: 'both',
  dosage: { dog: { min: 2, max: 4 }, cat: { min: 0.25, max: 0.5 } },
  routes: ['IV', 'SC', 'Topical'],
  frequency: 'PRN / CRI',
  concentrations: [
  { value: 20, unit: 'mg/ml', label: 'Inj 2% (20mg/ml)' },
  { value: 10, unit: 'mg/ml', label: 'Inj 1% (10mg/ml)' }],

  administrationNotes:
  'Antiarrhythmic: 2 mg/kg IV bolus แล้วต่อ CRI 25-80 mcg/kg/min (สุนัข) แมวไวต่อพิษมาก',
  warnings: '⚠️ แมวไวต่อ Lidocaine มาก ใช้ขนาดต่ำ',
  sideEffects: 'ชัก, หัวใจเต้นช้า, อาเจียน (แมว)'
},
{
  id: 'loperamide',
  name: 'Loperamide',
  thaiName: 'โลเพอราไมด์',
  drugClass: 'Antidiarrheal (Opioid)',
  species: 'dog',
  dosage: { dog: { min: 0.1, max: 0.2 } },
  routes: ['PO'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 2, unit: 'mg/capsule', label: 'Cap 2mg (Imodium)' }],

  administrationNotes: 'ใช้หยุดท้องเสียในสุนัข ห้ามใช้ในแมว',
  warnings: '⚠️ ห้ามใช้ในสุนัขพันธุ์ Collie (MDR1 mutation) ห้ามใช้ในแมว',
  sideEffects: 'ท้องผูก, ง่วงซึม'
},
// ===== M =====
{
  id: 'mannitol',
  name: 'Mannitol',
  thaiName: 'แมนนิทอล',
  drugClass: 'Osmotic Diuretic',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 1 }, cat: { min: 0.5, max: 1 } },
  routes: ['IV'],
  frequency: 'Over 15-20 min',
  concentrations: [{ value: 200, unit: 'mg/ml', label: '20% Solution' }],
  administrationNotes: 'ลดความดันในสมอง/ลูกตา ให้ผ่าน Filter (อาจตกผลึก)',
  warnings: 'ระวังในสัตว์ขาดน้ำ หัวใจวาย',
  sideEffects: 'ขาดน้ำ, อิเล็กโทรไลต์ผิดปกติ'
},
{
  id: 'marbofloxacin',
  name: 'Marbofloxacin',
  thaiName: 'มาร์โบฟลอกซาซิน',
  drugClass: 'Antibiotic (Fluoroquinolone)',
  species: 'both',
  dosage: { dog: { min: 2, max: 5 }, cat: { min: 2, max: 5 } },
  routes: ['PO', 'SC'],
  frequency: 'q24h',
  concentrations: [
  { value: 5, unit: 'mg/tablet', label: 'Marbocyl 5mg' },
  { value: 20, unit: 'mg/tablet', label: 'Marbocyl 20mg' },
  { value: 80, unit: 'mg/tablet', label: 'Marbocyl 80mg' },
  { value: 10, unit: 'mg/ml', label: 'Inj 10mg/ml' }],

  administrationNotes:
  'ใช้แทน Enrofloxacin ได้ ปลอดภัยกว่าในแมว (ไม่ทำให้ตาบอด)',
  warnings: 'ห้ามใช้ในลูกสัตว์ที่กำลังเจริญเติบโต',
  sideEffects: 'อาเจียน, ท้องเสีย'
},
{
  id: 'maropitant',
  name: 'Maropitant',
  thaiName: 'มาโรพิแทนท์ (Cerenia)',
  drugClass: 'Antiemetic (NK1 Antagonist)',
  species: 'both',
  dosage: { dog: { min: 1, max: 1 }, cat: { min: 1, max: 1 } },
  routes: ['SC', 'IV', 'PO'],
  frequency: 'q24h',
  concentrations: [
  { value: 10, unit: 'mg/ml', label: 'Cerenia Inj 10mg/ml' },
  { value: 16, unit: 'mg/tablet', label: 'Cerenia Tab 16mg' },
  { value: 24, unit: 'mg/tablet', label: 'Cerenia Tab 24mg' },
  { value: 60, unit: 'mg/tablet', label: 'Cerenia Tab 60mg' },
  { value: 160, unit: 'mg/tablet', label: 'Cerenia Tab 160mg' }],

  administrationNotes:
  'ฉีดเย็น (แช่ตู้เย็น) จะแสบน้อยลง ยาแก้อาเจียนที่ดีที่สุดในสัตว์',
  warnings: 'ระวังในสัตว์โรคตับ',
  sideEffects: 'เจ็บบริเวณที่ฉีด'
},
{
  id: 'medetomidine',
  name: 'Medetomidine',
  thaiName: 'เมเดโทมิดีน',
  drugClass: 'Alpha-2 Agonist (Sedative)',
  species: 'both',
  dosage: { dog: { min: 0.01, max: 0.04 }, cat: { min: 0.02, max: 0.08 } },
  routes: ['IV', 'IM'],
  frequency: 'Single dose',
  concentrations: [{ value: 1, unit: 'mg/ml', label: 'Domitor 1mg/ml' }],
  administrationNotes:
  'Reverse ด้วย Atipamezole ทำให้อาเจียนในแมว (ใช้เป็น Emetic ได้)',
  warnings: 'ทำให้หัวใจเต้นช้ามาก ห้ามใช้ในสัตว์โรคหัวใจ',
  sideEffects: 'หัวใจเต้นช้า, อาเจียน, ความดันสูงแล้วต่ำ'
},
{
  id: 'meloxicam',
  name: 'Meloxicam',
  thaiName: 'เมลอกซิแคม',
  drugClass: 'NSAID',
  species: 'both',
  dosage: { dog: { min: 0.1, max: 0.2 }, cat: { min: 0.1, max: 0.2 } },
  routes: ['SC', 'PO', 'IV'],
  frequency: 'q24h',
  concentrations: [
  { value: 5, unit: 'mg/ml', label: 'Metacam Inj 5mg/ml' },
  { value: 1.5, unit: 'mg/ml', label: 'Metacam Oral 1.5mg/ml' },
  { value: 0.5, unit: 'mg/ml', label: 'Metacam Cat 0.5mg/ml' },
  { value: 7.5, unit: 'mg/tablet', label: 'Tab 7.5mg' }],

  administrationNotes:
  'สุนัข: Loading 0.2 mg/kg วันแรก ต่อไป 0.1 mg/kg แมว: ฉีดครั้งเดียว ระวังใช้ต่อเนื่อง',
  warnings: 'ห้ามใช้ร่วมกับ NSAIDs อื่นหรือ Steroids ระวังในสัตว์โรคไต',
  sideEffects: 'อาเจียน, ถ่ายดำ, ไตวาย (แมว)'
},
{
  id: 'methadone',
  name: 'Methadone',
  thaiName: 'เมทาโดน',
  drugClass: 'Analgesic (Opioid)',
  species: 'both',
  dosage: { dog: { min: 0.1, max: 0.5 }, cat: { min: 0.1, max: 0.3 } },
  routes: ['IV', 'IM', 'SC'],
  frequency: 'q4-6h',
  concentrations: [{ value: 10, unit: 'mg/ml', label: 'Inj 10mg/ml' }],
  administrationNotes: 'แก้ปวดรุนแรง ใช้แทน Morphine ได้ ไม่ค่อยทำให้อาเจียน',
  warnings: 'ทำให้หายใจช้า',
  sideEffects: 'ง่วงซึม, หายใจช้า'
},
{
  id: 'methimazole',
  name: 'Methimazole',
  thaiName: 'เมไทมาโซล',
  drugClass: 'Antithyroid',
  species: 'cat',
  dosage: { cat: { min: 1.25, max: 5 } },
  routes: ['PO', 'Transdermal'],
  frequency: 'q12h',
  concentrations: [
  { value: 5, unit: 'mg/tablet', label: 'Tapazole 5mg' },
  { value: 2.5, unit: 'mg/tablet', label: 'Felimazole 2.5mg' }],

  administrationNotes:
  'ใช้รักษา Hyperthyroidism ในแมว เริ่ม 2.5 mg q12h ตรวจ T4 หลัง 2-4 สัปดาห์',
  warnings: 'ตรวจ CBC + ค่าไตทุก 2-4 สัปดาห์ช่วงแรก',
  sideEffects: 'เบื่ออาหาร, อาเจียน, เกาหน้า, เม็ดเลือดขาวต่ำ'
},
{
  id: 'metoclopramide',
  name: 'Metoclopramide',
  thaiName: 'เมโทโคลพราไมด์',
  drugClass: 'Antiemetic / Prokinetic',
  species: 'both',
  dosage: { dog: { min: 0.2, max: 0.5 }, cat: { min: 0.2, max: 0.4 } },
  routes: ['PO', 'IV', 'IM', 'SC'],
  frequency: 'q6-8h or CRI',
  concentrations: [
  { value: 5, unit: 'mg/ml', label: 'Inj 5mg/ml' },
  { value: 10, unit: 'mg/tablet', label: 'Tab 10mg' }],

  administrationNotes: 'แก้อาเจียนและกระตุ้นกระเพาะอาหาร CRI: 1-2 mg/kg/day',
  warnings: 'ห้ามใช้ในสัตว์ที่มีลำไส้อุดตัน ระวังอาการทางระบบประสาท',
  sideEffects: 'กระวนกระวาย, ง่วงซึม'
},
{
  id: 'metoprolol',
  name: 'Metoprolol',
  thaiName: 'เมโทโปรลอล',
  drugClass: 'Beta-blocker',
  species: 'both',
  dosage: { dog: { min: 0.2, max: 1 }, cat: { min: 2, max: 15 } },
  routes: ['PO'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 25, unit: 'mg/tablet', label: 'Tab 25mg' },
  { value: 50, unit: 'mg/tablet', label: 'Tab 50mg' }],

  administrationNotes: 'แมว: 2-15 mg/cat q8h ใช้รักษา HCM',
  warnings: 'ห้ามหยุดทันที ระวังในสัตว์หอบหืด',
  sideEffects: 'หัวใจเต้นช้า, ความดันต่ำ'
},
{
  id: 'metronidazole',
  name: 'Metronidazole',
  thaiName: 'เมโทรนิดาโซล',
  drugClass: 'Antibiotic / Antiprotozoal',
  species: 'both',
  dosage: { dog: { min: 10, max: 15 }, cat: { min: 10, max: 15 } },
  routes: ['PO', 'IV'],
  frequency: 'q12h',
  concentrations: [
  { value: 200, unit: 'mg/tablet', label: 'Tab 200mg' },
  { value: 400, unit: 'mg/tablet', label: 'Tab 400mg' },
  { value: 5, unit: 'mg/ml', label: 'Inj 5mg/ml (infusion)' }],

  administrationNotes:
  'ยาเม็ดขมมาก ห้ามบดให้แมว ใช้รักษา Giardia, IBD, การติดเชื้อ Anaerobe',
  warnings: 'ระวัง Neurotoxicity หากใช้นานหรือโดสสูง',
  sideEffects: 'คลื่นไส้, อาเจียน, เดินเซ, ตากระตุก'
},
{
  id: 'midazolam',
  name: 'Midazolam',
  thaiName: 'มิดาโซแลม',
  drugClass: 'Benzodiazepine',
  species: 'both',
  dosage: { dog: { min: 0.2, max: 0.3 }, cat: { min: 0.2, max: 0.3 } },
  routes: ['IV', 'IM'],
  frequency: 'PRN / Induction',
  concentrations: [
  { value: 1, unit: 'mg/ml', label: 'Inj 1mg/ml' },
  { value: 5, unit: 'mg/ml', label: 'Inj 5mg/ml' }],

  administrationNotes:
  'ใช้ร่วมกับ Ketamine หรือ Propofol ในการ Induction ผสมในไซริงค์เดียวกับ Ketamine ได้',
  warnings: 'ในสุนัขแข็งแรงอาจทำให้ตื่นเต้นแทนที่จะสงบ',
  sideEffects: 'ง่วงซึม, กล้ามเนื้ออ่อนแรง'
},
{
  id: 'milbemycin',
  name: 'Milbemycin Oxime',
  thaiName: 'มิลบีมัยซิน ออกไซม์',
  drugClass: 'Antiparasitic',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 1 }, cat: { min: 2, max: 2 } },
  routes: ['PO'],
  frequency: 'q30d (prevention)',
  concentrations: [
  { value: 2.3, unit: 'mg/tablet', label: 'Interceptor 2.3mg' },
  { value: 5.75, unit: 'mg/tablet', label: 'Interceptor 5.75mg' },
  { value: 11.5, unit: 'mg/tablet', label: 'Interceptor 11.5mg' }],

  administrationNotes: 'ป้องกันพยาธิหัวใจ ให้เดือนละครั้ง',
  warnings: 'ปลอดภัยในสุนัข MDR1 mutation',
  sideEffects: 'อาเจียน (น้อยมาก)'
},
{
  id: 'mirtazapine',
  name: 'Mirtazapine',
  thaiName: 'เมอร์ทาซาปีน',
  drugClass: 'Appetite Stimulant',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 1 }, cat: { min: 1.88, max: 3.75 } },
  routes: ['PO', 'Transdermal'],
  frequency: 'q24-48h',
  concentrations: [
  { value: 15, unit: 'mg/tablet', label: 'Tab 15mg' },
  { value: 30, unit: 'mg/tablet', label: 'Tab 30mg' }],

  administrationNotes:
  'กระตุ้นความอยากอาหารในแมวได้ดีมาก แมว: 1.88 mg/cat q48h หรือ Transdermal',
  warnings: 'ระวัง Serotonin syndrome หากใช้ร่วมกับ SSRIs',
  sideEffects: 'ร้องเสียงดัง, ตื่นตัว, กระวนกระวาย'
},
{
  id: 'morphine',
  name: 'Morphine',
  thaiName: 'มอร์ฟีน',
  drugClass: 'Analgesic (Opioid)',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 1 }, cat: { min: 0.1, max: 0.2 } },
  routes: ['IV', 'IM', 'SC'],
  frequency: 'q4-6h',
  concentrations: [{ value: 10, unit: 'mg/ml', label: 'Inj 10mg/ml' }],
  administrationNotes:
  'แก้ปวดรุนแรง IV ให้ช้าๆ (อาจทำให้ Histamine release) IM/SC ปลอดภัยกว่า',
  warnings: 'ทำให้อาเจียน (โดยเฉพาะครั้งแรก) ทำให้หายใจช้า',
  sideEffects: 'อาเจียน, หายใจช้า, ง่วงซึม, ท้องผูก'
},
{
  id: 'mycophenolate',
  name: 'Mycophenolate Mofetil',
  thaiName: 'ไมโคฟีโนเลต โมเฟทิล',
  drugClass: 'Immunosuppressant',
  species: 'dog',
  dosage: { dog: { min: 10, max: 20 } },
  routes: ['PO'],
  frequency: 'q12h',
  concentrations: [
  { value: 250, unit: 'mg/capsule', label: 'CellCept 250mg' },
  { value: 500, unit: 'mg/tablet', label: 'CellCept 500mg' }],

  administrationNotes: 'ใช้แทน Azathioprine ในสุนัข ปลอดภัยกว่าต่อตับ',
  warnings: 'ระวังท้องเสีย (ผลข้างเคียงหลัก)',
  sideEffects: 'ท้องเสีย, เบื่ออาหาร, เม็ดเลือดขาวต่ำ'
},
// ===== N =====
{
  id: 'naloxone',
  name: 'Naloxone',
  thaiName: 'นาลอกโซน',
  drugClass: 'Opioid Antagonist (Reversal)',
  species: 'both',
  dosage: { dog: { min: 0.01, max: 0.04 }, cat: { min: 0.01, max: 0.04 } },
  routes: ['IV', 'IM', 'SC'],
  frequency: 'PRN (may repeat)',
  concentrations: [{ value: 0.4, unit: 'mg/ml', label: 'Inj 0.4mg/ml' }],
  administrationNotes:
  'ใช้ reverse Opioids ทุกชนิด ออกฤทธิ์สั้น อาจต้องให้ซ้ำ',
  warnings: 'อาจทำให้ปวดกลับมาทันที',
  sideEffects: 'กระวนกระวาย, ปวด'
},
{
  id: 'neostigmine',
  name: 'Neostigmine',
  thaiName: 'นีโอสติกมีน',
  drugClass: 'Cholinesterase Inhibitor',
  species: 'both',
  dosage: { dog: { min: 0.01, max: 0.04 }, cat: { min: 0.01, max: 0.04 } },
  routes: ['IV', 'IM'],
  frequency: 'PRN',
  concentrations: [{ value: 0.5, unit: 'mg/ml', label: 'Inj 0.5mg/ml' }],
  administrationNotes:
  'ใช้ reverse Neuromuscular blockers ให้ร่วมกับ Atropine เสมอ',
  warnings: 'ให้ร่วมกับ Atropine เพื่อป้องกัน Bradycardia',
  sideEffects: 'หัวใจเต้นช้า, น้ำลายไหล, ท้องเสีย'
},
{
  id: 'nitroprusside',
  name: 'Nitroprusside',
  thaiName: 'ไนโตรปรัสไซด์',
  drugClass: 'Vasodilator',
  species: 'both',
  dosage: { dog: { min: 1, max: 10 }, cat: { min: 1, max: 10 } },
  routes: ['IV'],
  frequency: 'CRI (mcg/kg/min)',
  concentrations: [{ value: 25, unit: 'mg/ml', label: 'Inj 50mg/2ml' }],
  administrationNotes:
  'ให้แบบ CRI เท่านั้น ต้องห่อหุ้มขวดด้วยอลูมิเนียมฟอยล์ (ไวต่อแสง)',
  warnings: 'ระวังพิษ Cyanide หากใช้นานเกิน 48 ชม.',
  sideEffects: 'ความดันต่ำมาก'
},
{
  id: 'norepinephrine',
  name: 'Norepinephrine',
  thaiName: 'นอร์เอพิเนฟริน',
  drugClass: 'Vasopressor',
  species: 'both',
  dosage: { dog: { min: 0.1, max: 1 }, cat: { min: 0.1, max: 1 } },
  routes: ['IV'],
  frequency: 'CRI (mcg/kg/min)',
  concentrations: [{ value: 1, unit: 'mg/ml', label: 'Inj 1mg/ml' }],
  administrationNotes:
  'ให้แบบ CRI เท่านั้น ใช้เพิ่มความดันในภาวะ Septic shock',
  warnings: 'ห้ามฉีดนอกเส้นเลือด (ทำให้เนื้อตาย)',
  sideEffects: 'หัวใจเต้นผิดจังหวะ, ความดันสูงเกิน'
},
// ===== O =====
{
  id: 'omeprazole',
  name: 'Omeprazole',
  thaiName: 'โอเมพราโซล',
  drugClass: 'Proton Pump Inhibitor',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 1 }, cat: { min: 0.5, max: 1 } },
  routes: ['PO', 'IV'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 20, unit: 'mg/capsule', label: 'Cap 20mg' },
  { value: 40, unit: 'mg/capsule', label: 'Cap 40mg' }],

  administrationNotes:
  'ให้ก่อนอาหารเช้า 30 นาที ห้ามบดเม็ดยา (enteric coated)',
  warnings: 'การใช้นานอาจรบกวนการดูดซึมวิตามิน',
  sideEffects: 'ไม่ค่อยพบผลข้างเคียง'
},
{
  id: 'ondansetron',
  name: 'Ondansetron',
  thaiName: 'ออนแดนซีทรอน',
  drugClass: 'Antiemetic (5-HT3 Antagonist)',
  species: 'both',
  dosage: { dog: { min: 0.1, max: 0.5 }, cat: { min: 0.1, max: 0.22 } },
  routes: ['IV', 'PO'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 2, unit: 'mg/ml', label: 'Inj 2mg/ml' },
  { value: 4, unit: 'mg/tablet', label: 'Tab 4mg' },
  { value: 8, unit: 'mg/tablet', label: 'Tab 8mg' }],

  administrationNotes:
  'แก้อาเจียนได้ดีมาก โดยเฉพาะจากเคมีบำบัดหรือตับอ่อนอักเสบ',
  warnings: 'ระวังในสัตว์แพ้ยากลุ่มนี้',
  sideEffects: 'ท้องผูก (พบน้อย)'
},
// ===== P =====
{
  id: 'phenobarbital',
  name: 'Phenobarbital',
  thaiName: 'ฟีโนบาร์บิทอล',
  drugClass: 'Anticonvulsant (Barbiturate)',
  species: 'both',
  dosage: { dog: { min: 2, max: 5 }, cat: { min: 1, max: 2 } },
  routes: ['PO', 'IV'],
  frequency: 'q12h',
  concentrations: [
  { value: 30, unit: 'mg/tablet', label: 'Tab 30mg' },
  { value: 60, unit: 'mg/tablet', label: 'Tab 60mg' },
  { value: 100, unit: 'mg/tablet', label: 'Tab 100mg' },
  { value: 65, unit: 'mg/ml', label: 'Inj 65mg/ml' }],

  administrationNotes:
  'ยากันชักหลักในสุนัข ตรวจระดับยาในเลือดหลัง 2 สัปดาห์ (Therapeutic: 15-40 mcg/ml)',
  warnings: 'ห้ามหยุดทันที เป็นพิษต่อตับ ตรวจค่าตับทุก 6 เดือน',
  sideEffects: 'ง่วงซึม, กินเก่ง, กินน้ำบ่อย, ค่าตับขึ้น'
},
{
  id: 'phenoxybenzamine',
  name: 'Phenoxybenzamine',
  thaiName: 'ฟีนอกซีเบนซามีน',
  drugClass: 'Alpha-blocker',
  species: 'both',
  dosage: { dog: { min: 0.25, max: 0.5 }, cat: { min: 0.25, max: 0.5 } },
  routes: ['PO'],
  frequency: 'q12h',
  concentrations: [{ value: 10, unit: 'mg/capsule', label: 'Cap 10mg' }],
  administrationNotes: 'ใช้คลายกล้ามเนื้อกระเพาะปัสสาวะ (Urethral sphincter)',
  warnings: 'ระวังความดันต่ำ',
  sideEffects: 'ความดันต่ำ, หัวใจเต้นเร็ว'
},
{
  id: 'phenytoin',
  name: 'Phenytoin',
  thaiName: 'เฟนิโทอิน',
  drugClass: 'Anticonvulsant / Antiarrhythmic',
  species: 'dog',
  dosage: { dog: { min: 20, max: 35 } },
  routes: ['PO', 'IV'],
  frequency: 'q8h',
  concentrations: [
  { value: 100, unit: 'mg/capsule', label: 'Cap 100mg' },
  { value: 50, unit: 'mg/ml', label: 'Inj 50mg/ml' }],

  administrationNotes:
  'ใช้น้อยลงในปัจจุบัน (Phenobarbital ดีกว่า) ยังใช้เป็น Antiarrhythmic ได้',
  warnings: 'ห้ามใช้ในแมว (ขับออกช้ามาก)',
  sideEffects: 'เดินเซ, ง่วงซึม, เหงือกบวม'
},
{
  id: 'pimobendan',
  name: 'Pimobendan',
  thaiName: 'พิโมเบนแดน',
  drugClass: 'Inodilator',
  species: 'both',
  dosage: { dog: { min: 0.25, max: 0.3 }, cat: { min: 0.25, max: 0.3 } },
  routes: ['PO'],
  frequency: 'q12h',
  concentrations: [
  { value: 1.25, unit: 'mg/tablet', label: 'Vetmedin 1.25mg' },
  { value: 2.5, unit: 'mg/tablet', label: 'Vetmedin 2.5mg' },
  { value: 5, unit: 'mg/tablet', label: 'Vetmedin 5mg' }],

  administrationNotes:
  'ต้องให้ตอนท้องว่าง (ก่อนอาหาร 1 ชม.) ยาหลักในโรคหัวใจสุนัข',
  warnings: 'ห้ามใช้ใน HCM (Hypertrophic Cardiomyopathy)',
  sideEffects: 'เบื่ออาหาร, อาเจียน'
},
{
  id: 'potassium-bromide',
  name: 'Potassium Bromide',
  thaiName: 'โพแทสเซียม โบรไมด์',
  drugClass: 'Anticonvulsant',
  species: 'dog',
  dosage: { dog: { min: 20, max: 40 } },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [
  { value: 250, unit: 'mg/capsule', label: 'Cap 250mg (compounded)' }],

  administrationNotes:
  'ใช้ร่วมกับ Phenobarbital หรือใช้เดี่ยว ให้พร้อมอาหาร Half-life นานมาก (25 วัน)',
  warnings: '⚠️ ห้ามใช้ในแมว (ทำให้ปอดอักเสบ) ระวังพิษ Bromide',
  sideEffects: 'ง่วงซึม, เดินเซ, กินเก่ง'
},
{
  id: 'praziquantel',
  name: 'Praziquantel',
  thaiName: 'พราซิควอนเทล',
  drugClass: 'Anthelmintic (Cestocide)',
  species: 'both',
  dosage: { dog: { min: 5, max: 7.5 }, cat: { min: 5, max: 7.5 } },
  routes: ['PO', 'SC'],
  frequency: 'Single dose',
  concentrations: [
  { value: 50, unit: 'mg/tablet', label: 'Droncit 50mg' },
  { value: 56.8, unit: 'mg/ml', label: 'Inj 56.8mg/ml' }],

  administrationNotes: 'ถ่ายพยาธิตัวตืด (Tapeworm) ให้ครั้งเดียว',
  warnings: 'ปลอดภัยสูง',
  sideEffects: 'อาเจียน (น้อยมาก)'
},
{
  id: 'prednisolone',
  name: 'Prednisolone',
  thaiName: 'เพรดนิโซโลน',
  drugClass: 'Corticosteroid',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 2 }, cat: { min: 1, max: 2 } },
  routes: ['PO', 'IM', 'SC'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 5, unit: 'mg/tablet', label: 'Tab 5mg' },
  { value: 20, unit: 'mg/tablet', label: 'Tab 20mg' }],

  administrationNotes:
  'ให้พร้อมอาหาร ในแมวใช้ Prednisolone (ไม่ใช่ Prednisone)',
  warnings: 'ห้ามใช้ร่วมกับ NSAIDs ห้ามหยุดทันทีหากใช้นาน',
  sideEffects: 'กินเก่ง, กินน้ำบ่อย, ฉี่บ่อย, หอบ'
},
{
  id: 'procainamide',
  name: 'Procainamide',
  thaiName: 'โปรเคนาไมด์',
  drugClass: 'Antiarrhythmic (Class IA)',
  species: 'dog',
  dosage: { dog: { min: 10, max: 20 } },
  routes: ['PO', 'IV', 'IM'],
  frequency: 'q6-8h (PO)',
  concentrations: [
  { value: 250, unit: 'mg/capsule', label: 'Cap 250mg' },
  { value: 100, unit: 'mg/ml', label: 'Inj 100mg/ml' }],

  administrationNotes:
  'IV: Loading 2 mg/kg ช้าๆ แล้วต่อ CRI 25-50 mcg/kg/min',
  warnings: 'ระวังความดันต่ำ หัวใจเต้นผิดจังหวะ',
  sideEffects: 'ความดันต่ำ, อาเจียน'
},
{
  id: 'propofol',
  name: 'Propofol',
  thaiName: 'โปรโพฟอล',
  drugClass: 'Anesthetic Induction Agent',
  species: 'both',
  dosage: { dog: { min: 4, max: 6 }, cat: { min: 4, max: 8 } },
  routes: ['IV'],
  frequency: 'Induction',
  concentrations: [{ value: 10, unit: 'mg/ml', label: 'Inj 1% (10mg/ml)' }],
  administrationNotes:
  'ฉีด IV ช้าๆ (titrate to effect) ยาที่เปิดแล้วทิ้งภายใน 6-24 ชม.',
  warnings: 'ทำให้หยุดหายใจ เตรียมท่อช่วยหายใจ',
  sideEffects: 'หยุดหายใจ, ความดันต่ำ'
},
{
  id: 'propranolol',
  name: 'Propranolol',
  thaiName: 'โปรปราโนลอล',
  drugClass: 'Beta-blocker (Non-selective)',
  species: 'both',
  dosage: { dog: { min: 0.2, max: 1 }, cat: { min: 0.4, max: 1.2 } },
  routes: ['PO', 'IV'],
  frequency: 'q8h',
  concentrations: [
  { value: 10, unit: 'mg/tablet', label: 'Tab 10mg' },
  { value: 40, unit: 'mg/tablet', label: 'Tab 40mg' },
  { value: 1, unit: 'mg/ml', label: 'Inj 1mg/ml' }],

  administrationNotes: 'ใช้รักษาหัวใจเต้นเร็ว Hyperthyroidism IV: ให้ช้ามากๆ',
  warnings: 'ห้ามใช้ในสัตว์หอบหืด ห้ามหยุดทันที',
  sideEffects: 'หัวใจเต้นช้า, ความดันต่ำ, หลอดลมตีบ'
},
// ===== R =====
{
  id: 'ranitidine',
  name: 'Ranitidine',
  thaiName: 'รานิทิดีน',
  drugClass: 'H2 Blocker / Prokinetic',
  species: 'both',
  dosage: { dog: { min: 1, max: 2 }, cat: { min: 1, max: 2 } },
  routes: ['PO', 'IV', 'SC'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 150, unit: 'mg/tablet', label: 'Tab 150mg' },
  { value: 25, unit: 'mg/ml', label: 'Inj 25mg/ml' }],

  administrationNotes: 'ลดกรดและมีฤทธิ์ Prokinetic (กระตุ้นกระเพาะ)',
  warnings: 'ถูกถอนจากตลาดบางประเทศ (NDMA contamination)',
  sideEffects: 'หัวใจเต้นเร็ว (IV เร็ว)'
},
{
  id: 'rifampin',
  name: 'Rifampin',
  thaiName: 'ไรแฟมพิน',
  drugClass: 'Antibiotic',
  species: 'both',
  dosage: { dog: { min: 5, max: 10 }, cat: { min: 10, max: 15 } },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [
  { value: 150, unit: 'mg/capsule', label: 'Cap 150mg' },
  { value: 300, unit: 'mg/capsule', label: 'Cap 300mg' }],

  administrationNotes:
  'ใช้ร่วมกับยาอื่น (ห้ามใช้เดี่ยว — ดื้อยาเร็ว) ปัสสาวะจะเป็นสีส้ม',
  warnings: 'เป็นพิษต่อตับ มี Drug interaction มาก',
  sideEffects: 'ค่าตับขึ้น, ปัสสาวะสีส้ม'
},
{
  id: 'robenacoxib',
  name: 'Robenacoxib',
  thaiName: 'โรเบนาค็อกซิบ',
  drugClass: 'NSAID (COX-2 selective)',
  species: 'both',
  dosage: { dog: { min: 1, max: 2 }, cat: { min: 1, max: 2 } },
  routes: ['PO', 'SC'],
  frequency: 'q24h',
  concentrations: [
  { value: 6, unit: 'mg/tablet', label: 'Onsior Cat 6mg' },
  { value: 20, unit: 'mg/tablet', label: 'Onsior Dog 20mg' },
  { value: 40, unit: 'mg/tablet', label: 'Onsior Dog 40mg' },
  { value: 20, unit: 'mg/ml', label: 'Inj 20mg/ml' }],

  administrationNotes:
  'NSAID ที่ปลอดภัยที่สุดในแมว (approved สำหรับแมว) ใช้ได้ 3 วัน SC หรือ 6 วัน PO',
  warnings: 'ห้ามใช้ร่วมกับ NSAIDs อื่นหรือ Steroids',
  sideEffects: 'อาเจียน, ท้องเสีย'
},
// ===== S =====
{
  id: 'selamectin',
  name: 'Selamectin',
  thaiName: 'เซลาเมคติน',
  drugClass: 'Antiparasitic',
  species: 'both',
  dosage: { dog: { min: 6, max: 12 }, cat: { min: 6, max: 12 } },
  routes: ['Topical'],
  frequency: 'q30d',
  concentrations: [
  { value: 60, unit: 'mg/ml', label: 'Revolution (spot-on)' }],

  administrationNotes: 'หยดที่ท้ายทอย ป้องกันหมัด ไร เห็บ พยาธิหัวใจ',
  warnings: 'ปลอดภัยสูง',
  sideEffects: 'ระคายเคืองผิวหนังบริเวณที่หยด (น้อย)'
},
{
  id: 'sildenafil',
  name: 'Sildenafil',
  thaiName: 'ซิลเดนาฟิล',
  drugClass: 'PDE5 Inhibitor',
  species: 'both',
  dosage: { dog: { min: 1, max: 2 }, cat: { min: 1, max: 2 } },
  routes: ['PO'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 25, unit: 'mg/tablet', label: 'Tab 25mg' },
  { value: 50, unit: 'mg/tablet', label: 'Tab 50mg' }],

  administrationNotes: 'ใช้รักษา Pulmonary hypertension',
  warnings: 'ระวังความดันต่ำ',
  sideEffects: 'ความดันต่ำ, หน้าแดง'
},
{
  id: 'spironolactone',
  name: 'Spironolactone',
  thaiName: 'สไปโรโนแลคโทน',
  drugClass: 'Diuretic (Potassium-sparing)',
  species: 'both',
  dosage: { dog: { min: 1, max: 2 }, cat: { min: 1, max: 2 } },
  routes: ['PO'],
  frequency: 'q12h',
  concentrations: [
  { value: 25, unit: 'mg/tablet', label: 'Tab 25mg' },
  { value: 50, unit: 'mg/tablet', label: 'Prilactone 50mg' }],

  administrationNotes: 'ใช้ร่วมกับ Furosemide ช่วยรักษาโพแทสเซียม',
  warnings: 'ระวังโพแทสเซียมสูง',
  sideEffects: 'อาเจียน, ท้องเสีย'
},
{
  id: 'sucralfate',
  name: 'Sucralfate',
  thaiName: 'ซูคราเฟต',
  drugClass: 'Gastroprotectant',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 1 }, cat: { min: 0.25, max: 0.5 } },
  routes: ['PO'],
  frequency: 'q8h',
  concentrations: [
  { value: 500, unit: 'mg/tablet', label: 'Tab 500mg' },
  { value: 1000, unit: 'mg/tablet', label: 'Tab 1g' }],

  administrationNotes: 'ให้ตอนท้องว่าง ห่างจากยาอื่นอย่างน้อย 2 ชม.',
  warnings: 'ลดการดูดซึมยาอื่น',
  sideEffects: 'ท้องผูก'
},
{
  id: 'sulfamethoxazole-tmp',
  name: 'Sulfamethoxazole-Trimethoprim',
  thaiName: 'ซัลฟาเมทอกซาโซล-ไตรเมโทพริม',
  drugClass: 'Antibiotic (Sulfonamide)',
  species: 'both',
  dosage: { dog: { min: 15, max: 30 }, cat: { min: 15, max: 30 } },
  routes: ['PO', 'IV'],
  frequency: 'q12h',
  concentrations: [
  { value: 480, unit: 'mg/tablet', label: 'Tab 480mg (400+80)' },
  { value: 960, unit: 'mg/tablet', label: 'Tab 960mg (800+160)' }],

  administrationNotes: 'ให้พร้อมอาหาร ดื่มน้ำมากๆ',
  warnings: 'ระวัง KCS (ตาแห้ง) ในสุนัข โลหิตจาง ข้อต่ออักเสบ',
  sideEffects: 'เบื่ออาหาร, อาเจียน, ตาแห้ง (KCS), โลหิตจาง'
},
// ===== T =====
{
  id: 'telmisartan',
  name: 'Telmisartan',
  thaiName: 'เทลมิซาร์แทน',
  drugClass: 'ARB (Angiotensin Receptor Blocker)',
  species: 'cat',
  dosage: { cat: { min: 1, max: 2 } },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [{ value: 4, unit: 'mg/ml', label: 'Semintra 4mg/ml' }],
  administrationNotes:
  'ใช้รักษาโปรตีนรั่วในปัสสาวะแมว (CKD) ยาน้ำรสชาติดี แมวกินง่าย',
  warnings: 'ระวังค่าไตสูงขึ้น ตรวจหลังเริ่มยา',
  sideEffects: 'ความดันต่ำ, เบื่ออาหาร'
},
{
  id: 'terbinafine',
  name: 'Terbinafine',
  thaiName: 'เทอร์บินาฟีน',
  drugClass: 'Antifungal',
  species: 'both',
  dosage: { dog: { min: 30, max: 30 }, cat: { min: 30, max: 40 } },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [{ value: 250, unit: 'mg/tablet', label: 'Tab 250mg' }],
  administrationNotes: 'รักษา Dermatophytosis ดีกว่า Itraconazole ในบางกรณี',
  warnings: 'ระวังโรคตับ',
  sideEffects: 'เบื่ออาหาร, อาเจียน'
},
{
  id: 'theophylline',
  name: 'Theophylline',
  thaiName: 'ธีโอฟิลลีน',
  drugClass: 'Bronchodilator (Methylxanthine)',
  species: 'both',
  dosage: { dog: { min: 10, max: 10 }, cat: { min: 4, max: 8 } },
  routes: ['PO'],
  frequency: 'q12h (SR)',
  concentrations: [
  { value: 100, unit: 'mg/tablet', label: 'Tab 100mg' },
  { value: 200, unit: 'mg/tablet', label: 'Tab 200mg SR' },
  { value: 300, unit: 'mg/tablet', label: 'Tab 300mg SR' }],

  administrationNotes: 'ขยายหลอดลม ใช้ยา SR (Sustained Release) ห้ามบดเม็ดยา',
  warnings: 'ระวังหัวใจเต้นผิดจังหวะ ชัก',
  sideEffects: 'กระวนกระวาย, หัวใจเต้นเร็ว, อาเจียน'
},
{
  id: 'thiopental',
  name: 'Thiopental',
  thaiName: 'ไธโอเพนทอล',
  drugClass: 'Barbiturate Anesthetic',
  species: 'both',
  dosage: { dog: { min: 10, max: 15 }, cat: { min: 10, max: 15 } },
  routes: ['IV'],
  frequency: 'Induction',
  concentrations: [{ value: 25, unit: 'mg/ml', label: 'Inj 2.5% (25mg/ml)' }],
  administrationNotes: 'ฉีด IV เท่านั้น ห้ามฉีดนอกเส้นเลือด (ทำให้เนื้อตาย)',
  warnings: '⚠️ ห้ามฉีดนอกเส้นเลือด ระวังในสัตว์พันธุ์ Greyhound (ขับออกช้า)',
  sideEffects: 'หยุดหายใจ, ความดันต่ำ'
},
{
  id: 'tobramycin',
  name: 'Tobramycin',
  thaiName: 'โทบรามัยซิน',
  drugClass: 'Antibiotic (Aminoglycoside)',
  species: 'both',
  dosage: { dog: { min: 2, max: 3 }, cat: { min: 2, max: 3 } },
  routes: ['IV', 'IM', 'Ophthalmic'],
  frequency: 'q8h (systemic) / q4-6h (eye)',
  concentrations: [
  { value: 40, unit: 'mg/ml', label: 'Inj 40mg/ml' },
  { value: 3, unit: 'mg/ml', label: 'Eye drops 0.3%' }],

  administrationNotes: 'ยาหยอดตาใช้รักษาการติดเชื้อที่ตา',
  warnings: 'Systemic: เป็นพิษต่อไตและหู',
  sideEffects: 'ไตวาย (systemic), ระคายเคืองตา (topical)'
},
{
  id: 'toceranib',
  name: 'Toceranib',
  thaiName: 'โทเซรานิบ (Palladia)',
  drugClass: 'Tyrosine Kinase Inhibitor (Chemotherapy)',
  species: 'dog',
  dosage: { dog: { min: 2.5, max: 3.25 } },
  routes: ['PO'],
  frequency: 'q48h (every other day)',
  concentrations: [
  { value: 10, unit: 'mg/tablet', label: 'Palladia 10mg' },
  { value: 15, unit: 'mg/tablet', label: 'Palladia 15mg' },
  { value: 50, unit: 'mg/tablet', label: 'Palladia 50mg' }],

  administrationNotes:
  'ใช้รักษา Mast cell tumor ในสุนัข ให้วันเว้นวัน ผู้ใช้สวมถุงมือ',
  warnings: '⚠️ ยาเคมีบำบัด ผู้ใช้ต้องสวมถุงมือ ตรวจ CBC ทุก 2 สัปดาห์',
  sideEffects: 'ท้องเสีย, เบื่ออาหาร, เม็ดเลือดขาวต่ำ'
},
{
  id: 'tramadol',
  name: 'Tramadol',
  thaiName: 'ทรามาดอล',
  drugClass: 'Analgesic (Opioid)',
  species: 'both',
  dosage: { dog: { min: 2, max: 5 }, cat: { min: 1, max: 2 } },
  routes: ['PO', 'IV', 'IM'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 50, unit: 'mg/capsule', label: 'Cap 50mg' },
  { value: 50, unit: 'mg/ml', label: 'Inj 50mg/ml' }],

  administrationNotes:
  'ยาเม็ดขมมาก แมวอาจน้ำลายฟูมปาก ประสิทธิภาพในสุนัขยังเป็นที่ถกเถียง',
  warnings: 'ระวังในสัตว์ประวัติชัก ห้ามใช้ร่วมกับ SSRIs/MAOIs',
  sideEffects: 'ง่วงซึม, ท้องผูก, คลื่นไส้'
},
{
  id: 'trazodone',
  name: 'Trazodone',
  thaiName: 'ทราโซโดน',
  drugClass: 'Anxiolytic (SARI)',
  species: 'both',
  dosage: { dog: { min: 3, max: 7 }, cat: { min: 3, max: 5 } },
  routes: ['PO'],
  frequency: 'q12h / PRN',
  concentrations: [
  { value: 50, unit: 'mg/tablet', label: 'Tab 50mg' },
  { value: 100, unit: 'mg/tablet', label: 'Tab 100mg' }],

  administrationNotes:
  'ลดความเครียด ให้ก่อนเหตุการณ์ 1-2 ชม. ใช้ร่วมกับ Gabapentin ได้',
  warnings: 'ระวัง Serotonin syndrome',
  sideEffects: 'ง่วงซึม, เดินเซ'
},
// ===== U =====
{
  id: 'ursodiol',
  name: 'Ursodeoxycholic Acid',
  thaiName: 'กรดเออร์โซดีออกซีโคลิก',
  drugClass: 'Hepatoprotectant / Choleretic',
  species: 'both',
  dosage: { dog: { min: 10, max: 15 }, cat: { min: 10, max: 15 } },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [
  { value: 250, unit: 'mg/capsule', label: 'Cap 250mg' },
  { value: 300, unit: 'mg/tablet', label: 'Tab 300mg' }],

  administrationNotes: 'ใช้รักษาโรคตับ ช่วยขับน้ำดี ให้พร้อมอาหาร',
  warnings: 'ห้ามใช้ในสัตว์ที่มีท่อน้ำดีอุดตัน',
  sideEffects: 'ท้องเสีย (น้อย)'
},
// ===== V =====
{
  id: 'valproic-acid',
  name: 'Valproic Acid',
  thaiName: 'กรดวัลโปรอิก',
  drugClass: 'Anticonvulsant',
  species: 'dog',
  dosage: { dog: { min: 60, max: 200 } },
  routes: ['PO'],
  frequency: 'q8h',
  concentrations: [
  { value: 250, unit: 'mg/capsule', label: 'Cap 250mg' },
  { value: 500, unit: 'mg/tablet', label: 'Tab 500mg' }],

  administrationNotes:
  'ใช้น้อยในสัตว์ (Half-life สั้นในสุนัข) มักใช้ร่วมกับยาอื่น',
  warnings: 'เป็นพิษต่อตับ',
  sideEffects: 'ค่าตับขึ้น, เบื่ออาหาร'
},
{
  id: 'vancomycin',
  name: 'Vancomycin',
  thaiName: 'แวนโคมัยซิน',
  drugClass: 'Antibiotic (Glycopeptide)',
  species: 'both',
  dosage: { dog: { min: 12, max: 15 }, cat: { min: 12, max: 15 } },
  routes: ['IV'],
  frequency: 'q6-8h',
  concentrations: [
  { value: 50, unit: 'mg/ml', label: 'Inj 500mg vial (reconstitute)' }],

  administrationNotes:
  'ให้ IV drip ช้าๆ อย่างน้อย 60 นาที (ป้องกัน Red man syndrome)',
  warnings: 'เป็นพิษต่อไตและหู ต้องวัดระดับยาในเลือด',
  sideEffects: 'ไตวาย, หูหนวก, Red man syndrome'
},
{
  id: 'vasopressin',
  name: 'Vasopressin',
  thaiName: 'วาโซเพรสซิน',
  drugClass: 'Vasopressor / ADH',
  species: 'both',
  dosage: { dog: { min: 0.8, max: 0.8 }, cat: { min: 0.8, max: 0.8 } },
  routes: ['IV'],
  frequency: 'CPR / CRI',
  concentrations: [{ value: 20, unit: 'mg/ml', label: 'Inj 20 IU/ml' }],
  administrationNotes: 'CPR: 0.8 IU/kg IV ครั้งเดียว ใช้แทน Epinephrine ได้',
  warnings: 'ระวังหลอดเลือดหดตัวมากเกินไป',
  sideEffects: 'หลอดเลือดหดตัว, ลำไส้ขาดเลือด'
},
{
  id: 'verapamil',
  name: 'Verapamil',
  thaiName: 'เวราพามิล',
  drugClass: 'Calcium Channel Blocker',
  species: 'dog',
  dosage: { dog: { min: 1, max: 3 } },
  routes: ['PO', 'IV'],
  frequency: 'q8h',
  concentrations: [
  { value: 40, unit: 'mg/tablet', label: 'Tab 40mg' },
  { value: 80, unit: 'mg/tablet', label: 'Tab 80mg' }],

  administrationNotes: 'ใช้รักษา Supraventricular tachycardia',
  warnings: 'ห้ามใช้ร่วมกับ Beta-blockers (IV) ระวังในสัตว์หัวใจวาย',
  sideEffects: 'หัวใจเต้นช้า, ความดันต่ำ, ท้องผูก'
},
{
  id: 'vitamin-k1',
  name: 'Vitamin K1 (Phytonadione)',
  thaiName: 'วิตามิน เค1',
  drugClass: 'Antidote',
  species: 'both',
  dosage: { dog: { min: 2.5, max: 5 }, cat: { min: 2.5, max: 5 } },
  routes: ['PO', 'SC'],
  frequency: 'q12h',
  concentrations: [
  { value: 10, unit: 'mg/ml', label: 'Inj 10mg/ml' },
  { value: 25, unit: 'mg/tablet', label: 'Tab 25mg' }],

  administrationNotes:
  'แก้พิษยาเบื่อหนู (Anticoagulant rodenticide) ให้พร้อมอาหารไขมันสูง ให้นาน 4-6 สัปดาห์',
  warnings: '⚠️ ห้ามฉีด IV (อาจ Anaphylaxis) ฉีด SC เท่านั้น',
  sideEffects: 'เจ็บบริเวณที่ฉีด'
},
// ===== W =====
{
  id: 'warfarin',
  name: 'Warfarin',
  thaiName: 'วาร์ฟาริน',
  drugClass: 'Anticoagulant',
  species: 'both',
  dosage: { dog: { min: 0.1, max: 0.2 }, cat: { min: 0.06, max: 0.1 } },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [
  { value: 1, unit: 'mg/tablet', label: 'Tab 1mg' },
  { value: 2, unit: 'mg/tablet', label: 'Tab 2mg' },
  { value: 5, unit: 'mg/tablet', label: 'Tab 5mg' }],

  administrationNotes: 'ต้องตรวจ PT/INR สม่ำเสมอ มี Drug interaction มาก',
  warnings: 'ระวังเลือดออกง่าย ตรวจ PT/INR ทุก 1-2 สัปดาห์',
  sideEffects: 'เลือดออกง่าย'
},
// ===== X =====
{
  id: 'xylazine',
  name: 'Xylazine',
  thaiName: 'ไซลาซีน',
  drugClass: 'Alpha-2 Agonist (Sedative)',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 1 }, cat: { min: 0.5, max: 1 } },
  routes: ['IV', 'IM'],
  frequency: 'Single dose',
  concentrations: [{ value: 20, unit: 'mg/ml', label: 'Inj 20mg/ml' }],
  administrationNotes:
  'ใช้น้อยลงในปัจจุบัน (Dexmedetomidine ดีกว่า) ทำให้อาเจียนในแมว',
  warnings: 'ทำให้หัวใจเต้นช้ามาก ห้ามใช้ในสัตว์โรคหัวใจ',
  sideEffects: 'หัวใจเต้นช้า, อาเจียน, ความดันต่ำ'
},
// ===== Y =====
{
  id: 'yohimbine',
  name: 'Yohimbine',
  thaiName: 'โยฮิมบีน',
  drugClass: 'Alpha-2 Antagonist (Reversal)',
  species: 'both',
  dosage: { dog: { min: 0.1, max: 0.1 }, cat: { min: 0.1, max: 0.1 } },
  routes: ['IV'],
  frequency: 'Once (reversal)',
  concentrations: [{ value: 2, unit: 'mg/ml', label: 'Inj 2mg/ml' }],
  administrationNotes: 'ใช้ reverse Xylazine ให้ IV ช้าๆ',
  warnings: 'อาจทำให้ตื่นเร็วเกินไป',
  sideEffects: 'กระวนกระวาย, หัวใจเต้นเร็ว'
},
// ===== Z =====
{
  id: 'zonisamide',
  name: 'Zonisamide',
  thaiName: 'โซนิซาไมด์',
  drugClass: 'Anticonvulsant',
  species: 'both',
  dosage: { dog: { min: 5, max: 10 }, cat: { min: 5, max: 10 } },
  routes: ['PO'],
  frequency: 'q12h',
  concentrations: [
  { value: 25, unit: 'mg/capsule', label: 'Cap 25mg' },
  { value: 50, unit: 'mg/capsule', label: 'Cap 50mg' },
  { value: 100, unit: 'mg/capsule', label: 'Cap 100mg' }],

  administrationNotes: 'ใช้แทนหรือร่วมกับ Phenobarbital ปลอดภัยต่อตับกว่า',
  warnings: 'ระวัง KCS (ตาแห้ง) ในสุนัข',
  sideEffects: 'ง่วงซึม, เดินเซ, เบื่ออาหาร'
},
// ===== ADDITIONAL COMMON DRUGS =====
{
  id: 'clopidogrel',
  name: 'Clopidogrel',
  thaiName: 'โคลพิโดเกรล',
  drugClass: 'Antiplatelet',
  species: 'cat',
  dosage: { cat: { min: 18.75, max: 18.75 } },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [{ value: 75, unit: 'mg/tablet', label: 'Tab 75mg' }],
  administrationNotes:
  'ใช้ป้องกันลิ่มเลือดในแมว (ATE) ให้ 18.75 mg/cat (1/4 เม็ด)',
  warnings: 'ระวังเลือดออกง่าย',
  sideEffects: 'อาเจียน, เลือดออกง่าย'
},
{
  id: 'dantrolene',
  name: 'Dantrolene',
  thaiName: 'แดนโทรลีน',
  drugClass: 'Muscle Relaxant',
  species: 'both',
  dosage: { dog: { min: 1, max: 5 }, cat: { min: 0.5, max: 2 } },
  routes: ['PO', 'IV'],
  frequency: 'q8h',
  concentrations: [{ value: 25, unit: 'mg/capsule', label: 'Cap 25mg' }],
  administrationNotes: 'ใช้รักษา Malignant hyperthermia หรือกล้ามเนื้อเกร็ง',
  warnings: 'ระวังตับอักเสบ',
  sideEffects: 'ง่วงซึม, กล้ามเนื้ออ่อนแรง'
},
{
  id: 'desmopressin',
  name: 'Desmopressin (DDAVP)',
  thaiName: 'เดสโมเพรสซิน',
  drugClass: 'ADH Analog',
  species: 'both',
  dosage: { dog: { min: 1, max: 4 }, cat: { min: 1, max: 4 } },
  routes: ['SC', 'IV', 'Ophthalmic'],
  frequency: 'q12-24h',
  concentrations: [{ value: 4, unit: 'mcg/ml', label: 'Inj 4mcg/ml' }],
  administrationNotes:
  'ใช้รักษา Diabetes insipidus หรือ Von Willebrand disease (mcg/kg)',
  warnings: 'ระวังน้ำเกิน (Water intoxication)',
  sideEffects: 'น้ำเกิน, โซเดียมต่ำ'
},
{
  id: 'dimercaprol',
  name: 'Dimercaprol (BAL)',
  thaiName: 'ไดเมอร์แคปรอล',
  drugClass: 'Chelating Agent (Antidote)',
  species: 'both',
  dosage: { dog: { min: 2.5, max: 5 }, cat: { min: 2.5, max: 5 } },
  routes: ['IM'],
  frequency: 'q4h (first 2 days)',
  concentrations: [
  { value: 100, unit: 'mg/ml', label: 'Inj 100mg/ml (in oil)' }],

  administrationNotes: 'ใช้แก้พิษโลหะหนัก (ตะกั่ว, สารหนู) ฉีด IM ลึก',
  warnings: 'เจ็บมากบริเวณที่ฉีด ห้ามใช้ในสัตว์โรคตับ',
  sideEffects: 'เจ็บที่ฉีด, อาเจียน, ความดันสูง'
},
{
  id: 'firocoxib',
  name: 'Firocoxib',
  thaiName: 'ไฟโรค็อกซิบ',
  drugClass: 'NSAID (COX-2 selective)',
  species: 'dog',
  dosage: { dog: { min: 5, max: 5 } },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [
  { value: 57, unit: 'mg/tablet', label: 'Previcox 57mg' },
  { value: 227, unit: 'mg/tablet', label: 'Previcox 227mg' }],

  administrationNotes: 'NSAID ที่ปลอดภัยต่อ GI ในสุนัข ให้พร้อมอาหาร',
  warnings: 'ห้ามใช้ร่วมกับ NSAIDs อื่นหรือ Steroids',
  sideEffects: 'อาเจียน, ท้องเสีย'
},
{
  id: 'methocarbamol',
  name: 'Methocarbamol',
  thaiName: 'เมโทคาร์บามอล',
  drugClass: 'Muscle Relaxant',
  species: 'both',
  dosage: { dog: { min: 15, max: 44 }, cat: { min: 15, max: 44 } },
  routes: ['PO', 'IV'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 500, unit: 'mg/tablet', label: 'Robaxin 500mg' },
  { value: 100, unit: 'mg/ml', label: 'Inj 100mg/ml' }],

  administrationNotes: 'ใช้คลายกล้ามเนื้อ แก้พิษ Strychnine IV: ให้ช้าๆ',
  warnings: 'ระวังง่วงซึมมาก',
  sideEffects: 'ง่วงซึม, อ่อนแรง, น้ำลายไหล'
},
{
  id: 'methotrexate',
  name: 'Methotrexate',
  thaiName: 'เมโทเทร็กเซต',
  drugClass: 'Chemotherapy / Immunosuppressant',
  species: 'both',
  dosage: { dog: { min: 2.5, max: 5 }, cat: { min: 2.5, max: 5 } },
  routes: ['PO', 'IV'],
  frequency: 'Weekly or per protocol',
  concentrations: [
  { value: 2.5, unit: 'mg/tablet', label: 'Tab 2.5mg' },
  { value: 25, unit: 'mg/ml', label: 'Inj 25mg/ml' }],

  administrationNotes: 'ยาเคมีบำบัด ผู้ใช้สวมถุงมือ ให้สารน้ำก่อนและหลัง',
  warnings: '⚠️ ยาเคมีบำบัด กดไขกระดูก เป็นพิษต่อไต',
  sideEffects: 'เม็ดเลือดขาวต่ำ, อาเจียน, ไตวาย'
},
{
  id: 'pentobarbital',
  name: 'Pentobarbital',
  thaiName: 'เพนโทบาร์บิทอล',
  drugClass: 'Barbiturate',
  species: 'both',
  dosage: { dog: { min: 85, max: 85 }, cat: { min: 85, max: 85 } },
  routes: ['IV'],
  frequency: 'Single dose (euthanasia)',
  concentrations: [
  { value: 390, unit: 'mg/ml', label: 'Euthanasia solution' }],

  administrationNotes: 'ใช้สำหรับ Euthanasia เท่านั้น 85 mg/kg IV',
  warnings: 'ยาควบคุมพิเศษ ใช้สำหรับ Euthanasia',
  sideEffects: 'หยุดหายใจ, หัวใจหยุดเต้น'
},
{
  id: 'selegiline',
  name: 'Selegiline',
  thaiName: 'เซเลจิลีน',
  drugClass: 'MAO-B Inhibitor',
  species: 'dog',
  dosage: { dog: { min: 0.5, max: 1 } },
  routes: ['PO'],
  frequency: 'q24h (morning)',
  concentrations: [
  { value: 5, unit: 'mg/tablet', label: 'Anipryl 5mg' },
  { value: 10, unit: 'mg/tablet', label: 'Anipryl 10mg' }],

  administrationNotes:
  'ใช้รักษา Cognitive Dysfunction Syndrome (CDS) หรือ Cushing (Pituitary)',
  warnings: 'ห้ามใช้ร่วมกับ SSRIs, TCAs, Tramadol',
  sideEffects: 'กระวนกระวาย, เบื่ออาหาร'
},
{
  id: 'sevoflurane',
  name: 'Sevoflurane',
  thaiName: 'เซโวฟลูเรน',
  drugClass: 'Inhalation Anesthetic',
  species: 'both',
  dosage: { dog: { min: 2.3, max: 2.4 }, cat: { min: 2.5, max: 3.3 } },
  routes: ['Inhalation'],
  frequency: 'Continuous (MAC %)',
  concentrations: [{ value: 100, unit: '%', label: 'Liquid 100%' }],
  administrationNotes:
  'MAC สุนัข ~2.3% แมว ~2.5% Induction เร็วกว่า Isoflurane',
  warnings: 'ทำให้ความดันต่ำ ต้องมอนิเตอร์ตลอด',
  sideEffects: 'ความดันต่ำ, หายใจช้า'
},
{
  id: 'sodium-bicarbonate',
  name: 'Sodium Bicarbonate',
  thaiName: 'โซเดียมไบคาร์บอเนต',
  drugClass: 'Alkalinizing Agent',
  species: 'both',
  dosage: { dog: { min: 1, max: 2 }, cat: { min: 1, max: 2 } },
  routes: ['IV'],
  frequency: 'PRN (based on blood gas)',
  concentrations: [
  { value: 84, unit: 'mg/ml', label: '8.4% Solution (1 mEq/ml)' }],

  administrationNotes:
  'ใช้แก้ Metabolic acidosis รุนแรง คำนวณจาก Base deficit: mEq = BW × 0.3 × BD',
  warnings: 'ให้ช้าๆ ระวัง Alkalosis',
  sideEffects: 'Alkalosis, โพแทสเซียมต่ำ'
},
{
  id: 'vincristine',
  name: 'Vincristine',
  thaiName: 'วินคริสทีน',
  drugClass: 'Chemotherapy (Vinca Alkaloid)',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 0.7 }, cat: { min: 0.5, max: 0.7 } },
  routes: ['IV'],
  frequency: 'Weekly (per protocol)',
  concentrations: [{ value: 1, unit: 'mg/ml', label: 'Inj 1mg/ml' }],
  administrationNotes:
  'ยาเคมีบำบัด ฉีด IV เท่านั้น ห้ามรั่วนอกเส้นเลือด (Vesicant)',
  warnings: '⚠️ ห้ามรั่วนอกเส้นเลือด (ทำให้เนื้อตาย) ผู้ใช้สวมถุงมือ',
  sideEffects: 'เม็ดเลือดขาวต่ำ, อาเจียน, ท้องเสีย, ปลายประสาทอักเสบ'
},
{
  id: 'chlorpheniramine',
  name: 'Chlorpheniramine',
  thaiName: 'คลอร์เฟนิรามีน',
  drugClass: 'Antihistamine',
  species: 'both',
  dosage: { dog: { min: 0.2, max: 0.5 }, cat: { min: 1, max: 2 } },
  routes: ['PO'],
  frequency: 'q8-12h',
  concentrations: [
  { value: 4, unit: 'mg/tablet', label: 'Tab 4mg' },
  { value: 0.4, unit: 'mg/ml', label: 'Syrup 2mg/5ml' }],

  administrationNotes:
  'แมว: 2-4 mg/cat q12h สุนัข: 4-8 mg/dog q12h ใช้แก้แพ้ คัน',
  warnings: 'ทำให้ง่วงซึม',
  sideEffects: 'ง่วงซึม, ปากแห้ง'
},
{
  id: 'cetirizine',
  name: 'Cetirizine',
  thaiName: 'เซทิริซีน',
  drugClass: 'Antihistamine (2nd Gen)',
  species: 'both',
  dosage: { dog: { min: 1, max: 2 }, cat: { min: 5, max: 5 } },
  routes: ['PO'],
  frequency: 'q12-24h',
  concentrations: [{ value: 10, unit: 'mg/tablet', label: 'Tab 10mg' }],
  administrationNotes:
  'แมว: 5 mg/cat q24h สุนัข: 1-2 mg/kg q24h ง่วงน้อยกว่ารุ่นแรก',
  warnings: 'ปลอดภัยสูง',
  sideEffects: 'ง่วงซึม (น้อย)'
},
{
  id: 'misoprostol',
  name: 'Misoprostol',
  thaiName: 'ไมโซพรอสทอล',
  drugClass: 'Prostaglandin E1 Analog',
  species: 'both',
  dosage: { dog: { min: 2, max: 5 }, cat: { min: 2, max: 5 } },
  routes: ['PO'],
  frequency: 'q8h',
  concentrations: [{ value: 200, unit: 'mg/tablet', label: 'Tab 200mcg' }],
  administrationNotes: 'ใช้ป้องกันแผลในกระเพาะจาก NSAIDs (mcg/kg)',
  warnings: '⚠️ ห้ามใช้ในสัตว์ท้อง (ทำให้แท้ง) ผู้หญิงตั้งครรภ์ห้ามจับยา',
  sideEffects: 'ท้องเสีย, ปวดท้อง'
},
{
  id: 'oclacitinib',
  name: 'Oclacitinib',
  thaiName: 'โอคลาซิทินิบ (Apoquel)',
  drugClass: 'JAK Inhibitor (Anti-pruritic)',
  species: 'dog',
  dosage: { dog: { min: 0.4, max: 0.6 } },
  routes: ['PO'],
  frequency: 'q12h (14 days) then q24h',
  concentrations: [
  { value: 3.6, unit: 'mg/tablet', label: 'Apoquel 3.6mg' },
  { value: 5.4, unit: 'mg/tablet', label: 'Apoquel 5.4mg' },
  { value: 16, unit: 'mg/tablet', label: 'Apoquel 16mg' }],

  administrationNotes:
  'ลดอาการคันจาก Atopic dermatitis ออกฤทธิ์เร็วภายใน 4 ชม.',
  warnings: 'ห้ามใช้ในสุนัขอายุต่ำกว่า 12 เดือน ระวังการติดเชื้อ',
  sideEffects: 'อาเจียน, ท้องเสีย, เม็ดเลือดขาวต่ำ'
},
{
  id: 'lokivetmab',
  name: 'Lokivetmab',
  thaiName: 'โลคิเวทแมบ (Cytopoint)',
  drugClass: 'Monoclonal Antibody (Anti-IL31)',
  species: 'dog',
  dosage: { dog: { min: 1, max: 2 } },
  routes: ['SC'],
  frequency: 'q4-8 weeks',
  concentrations: [
  { value: 10, unit: 'mg/ml', label: 'Cytopoint 10mg vial' },
  { value: 20, unit: 'mg/ml', label: 'Cytopoint 20mg vial' },
  { value: 30, unit: 'mg/ml', label: 'Cytopoint 30mg vial' },
  { value: 40, unit: 'mg/ml', label: 'Cytopoint 40mg vial' }],

  administrationNotes:
  'ฉีดใต้ผิวหนังครั้งเดียว ออกฤทธิ์นาน 4-8 สัปดาห์ ปลอดภัยสูง',
  warnings: 'ปลอดภัยมาก ไม่มีผลข้างเคียงที่สำคัญ',
  sideEffects: 'อาเจียน (น้อยมาก)'
},
{
  id: 'maropitant-motion',
  name: 'Maropitant (Motion Sickness)',
  thaiName: 'มาโรพิแทนท์ (แก้เมารถ)',
  drugClass: 'Antiemetic (Motion Sickness)',
  species: 'dog',
  dosage: { dog: { min: 8, max: 8 } },
  routes: ['PO'],
  frequency: 'q24h (2h before travel)',
  concentrations: [
  { value: 16, unit: 'mg/tablet', label: 'Cerenia Tab 16mg' },
  { value: 24, unit: 'mg/tablet', label: 'Cerenia Tab 24mg' },
  { value: 60, unit: 'mg/tablet', label: 'Cerenia Tab 60mg' },
  { value: 160, unit: 'mg/tablet', label: 'Cerenia Tab 160mg' }],

  administrationNotes:
  'ป้องกันเมารถ: 8 mg/kg PO ให้ 2 ชม. ก่อนเดินทาง (โดสสูงกว่าแก้อาเจียน)',
  warnings: 'โดสแก้เมารถ (8 mg/kg) สูงกว่าโดสแก้อาเจียน (1 mg/kg)',
  sideEffects: 'ง่วงซึม'
},
{
  id: 'imidacloprid-moxidectin',
  name: 'Imidacloprid + Moxidectin',
  thaiName: 'อิมิดาโคลพริด + ม็อกซิเดกติน',
  drugClass: 'Antiparasitic (Spot-on)',
  species: 'both',
  dosage: { dog: { min: 10, max: 25 }, cat: { min: 10, max: 25 } },
  routes: ['Topical'],
  frequency: 'q30d',
  concentrations: [
  { value: 100, unit: 'mg/ml', label: 'Advocate (spot-on)' }],

  administrationNotes: 'หยดที่ท้ายทอย ป้องกันหมัด พยาธิหัวใจ ไรขี้เรื้อน',
  warnings: 'ห้ามให้ทาง PO',
  sideEffects: 'ระคายเคืองผิวหนัง (น้อย)'
},
{
  id: 'afoxolaner',
  name: 'Afoxolaner',
  thaiName: 'อะฟอกโซลาเนอร์ (NexGard)',
  drugClass: 'Antiparasitic (Isoxazoline)',
  species: 'dog',
  dosage: { dog: { min: 2.5, max: 2.5 } },
  routes: ['PO'],
  frequency: 'q30d',
  concentrations: [
  { value: 11.3, unit: 'mg/tablet', label: 'NexGard 11.3mg (2-4kg)' },
  { value: 28.3, unit: 'mg/tablet', label: 'NexGard 28.3mg (4-10kg)' },
  { value: 68, unit: 'mg/tablet', label: 'NexGard 68mg (10-25kg)' },
  { value: 136, unit: 'mg/tablet', label: 'NexGard 136mg (25-50kg)' }],

  administrationNotes: 'เม็ดเคี้ยวรสเนื้อ กำจัดหมัดและเห็บ ให้เดือนละครั้ง',
  warnings: 'ระวังในสุนัขที่มีประวัติชัก',
  sideEffects: 'อาเจียน, ท้องเสีย (น้อย)'
},
{
  id: 'fluralaner',
  name: 'Fluralaner',
  thaiName: 'ฟลูราลาเนอร์ (Bravecto)',
  drugClass: 'Antiparasitic (Isoxazoline)',
  species: 'both',
  dosage: { dog: { min: 25, max: 56 }, cat: { min: 40, max: 94 } },
  routes: ['PO', 'Topical'],
  frequency: 'q12 weeks',
  concentrations: [
  { value: 112.5, unit: 'mg/tablet', label: 'Bravecto 112.5mg (2-4.5kg)' },
  { value: 250, unit: 'mg/tablet', label: 'Bravecto 250mg (4.5-10kg)' },
  { value: 500, unit: 'mg/tablet', label: 'Bravecto 500mg (10-20kg)' },
  { value: 1000, unit: 'mg/tablet', label: 'Bravecto 1000mg (20-40kg)' },
  { value: 1400, unit: 'mg/tablet', label: 'Bravecto 1400mg (40-56kg)' }],

  administrationNotes: 'เม็ดเคี้ยว ออกฤทธิ์นาน 12 สัปดาห์ กำจัดหมัดและเห็บ',
  warnings: 'ระวังในสัตว์ที่มีประวัติชัก',
  sideEffects: 'อาเจียน, ท้องเสีย (น้อย)'
},
{
  id: 'sarolaner',
  name: 'Sarolaner',
  thaiName: 'ซาโรลาเนอร์ (Simparica)',
  drugClass: 'Antiparasitic (Isoxazoline)',
  species: 'dog',
  dosage: { dog: { min: 2, max: 4 } },
  routes: ['PO'],
  frequency: 'q30d',
  concentrations: [
  { value: 5, unit: 'mg/tablet', label: 'Simparica 5mg (1.3-2.5kg)' },
  { value: 10, unit: 'mg/tablet', label: 'Simparica 10mg (2.5-5kg)' },
  { value: 20, unit: 'mg/tablet', label: 'Simparica 20mg (5-10kg)' },
  { value: 40, unit: 'mg/tablet', label: 'Simparica 40mg (10-20kg)' },
  { value: 80, unit: 'mg/tablet', label: 'Simparica 80mg (20-40kg)' },
  { value: 120, unit: 'mg/tablet', label: 'Simparica 120mg (40-60kg)' }],

  administrationNotes: 'เม็ดเคี้ยว กำจัดหมัดและเห็บ ให้เดือนละครั้ง',
  warnings: 'ระวังในสุนัขที่มีประวัติชัก',
  sideEffects: 'อาเจียน (น้อย)'
},
{
  id: 'imidocarb',
  name: 'Imidocarb Dipropionate',
  thaiName: 'อิมิโดคาร์บ',
  drugClass: 'Antiprotozoal',
  species: 'both',
  dosage: { dog: { min: 5, max: 6.6 }, cat: { min: 5, max: 5 } },
  routes: ['IM', 'SC'],
  frequency: 'Once or repeat in 14 days',
  concentrations: [{ value: 120, unit: 'mg/ml', label: 'Imizol 120mg/ml' }],
  administrationNotes:
  'ใช้รักษา Babesiosis ให้ Atropine ก่อนฉีดเพื่อลดผลข้างเคียง Cholinergic',
  warnings: 'ให้ Atropine 0.04 mg/kg ก่อนฉีด 15 นาที',
  sideEffects: 'น้ำลายไหล, อาเจียน, ท้องเสีย, เจ็บที่ฉีด'
},
{
  id: 's-adenosylmethionine',
  name: 'S-Adenosylmethionine (SAMe)',
  thaiName: 'เอส-อะดีโนซิลเมไทโอนีน',
  drugClass: 'Hepatoprotectant',
  species: 'both',
  dosage: { dog: { min: 18, max: 20 }, cat: { min: 18, max: 20 } },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [
  { value: 90, unit: 'mg/tablet', label: 'Denosyl 90mg' },
  { value: 225, unit: 'mg/tablet', label: 'Denosyl 225mg' },
  { value: 425, unit: 'mg/tablet', label: 'Denosyl 425mg' }],

  administrationNotes: 'ให้ตอนท้องว่าง ห้ามบดเม็ดยา (enteric coated)',
  warnings: 'ปลอดภัยสูง',
  sideEffects: 'ไม่ค่อยพบ'
},
{
  id: 'tranexamic-acid',
  name: 'Tranexamic Acid',
  thaiName: 'กรดทราเนซามิก',
  drugClass: 'Antifibrinolytic',
  species: 'both',
  dosage: { dog: { min: 10, max: 20 }, cat: { min: 10, max: 20 } },
  routes: ['IV', 'PO'],
  frequency: 'q8h',
  concentrations: [
  { value: 250, unit: 'mg/tablet', label: 'Tab 250mg' },
  { value: 500, unit: 'mg/tablet', label: 'Tab 500mg' },
  { value: 100, unit: 'mg/ml', label: 'Inj 100mg/ml' }],

  administrationNotes: 'ใช้หยุดเลือดออก ให้ IV ช้าๆ',
  warnings: 'ระวังในสัตว์ที่มีลิ่มเลือด',
  sideEffects: 'คลื่นไส้, ท้องเสีย'
},
{
  id: 'pantoprazole',
  name: 'Pantoprazole',
  thaiName: 'แพนโทพราโซล',
  drugClass: 'Proton Pump Inhibitor',
  species: 'both',
  dosage: { dog: { min: 1, max: 1 }, cat: { min: 1, max: 1 } },
  routes: ['IV'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 4, unit: 'mg/ml', label: 'Inj 40mg vial (reconstitute)' }],

  administrationNotes: 'ใช้แทน Omeprazole IV ได้ ให้ IV drip 15 นาที',
  warnings: 'ปลอดภัยสูง',
  sideEffects: 'ไม่ค่อยพบ'
},
{
  id: 'esomeprazole',
  name: 'Esomeprazole',
  thaiName: 'เอโซเมพราโซล',
  drugClass: 'Proton Pump Inhibitor',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 1 }, cat: { min: 0.5, max: 1 } },
  routes: ['PO', 'IV'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 20, unit: 'mg/capsule', label: 'Cap 20mg' },
  { value: 40, unit: 'mg/capsule', label: 'Cap 40mg' }],

  administrationNotes: 'ใช้แทน Omeprazole ได้ อาจดีกว่าในบางกรณี',
  warnings: 'ปลอดภัยสูง',
  sideEffects: 'ไม่ค่อยพบ'
},
{
  id: 'maropitant-cerenia',
  name: 'Maropitant (Cerenia) - Visceral Pain',
  thaiName: 'มาโรพิแทนท์ (ลดปวดอวัยวะภายใน)',
  drugClass: 'NK1 Antagonist (Visceral Analgesic)',
  species: 'both',
  dosage: { dog: { min: 1, max: 1 }, cat: { min: 1, max: 1 } },
  routes: ['SC', 'IV'],
  frequency: 'q24h',
  concentrations: [
  { value: 10, unit: 'mg/ml', label: 'Cerenia Inj 10mg/ml' }],

  administrationNotes:
  'นอกจากแก้อาเจียน ยังช่วยลดปวดอวัยวะภายในได้ (Visceral pain)',
  warnings: 'ฉีดเย็นจะแสบน้อยลง',
  sideEffects: 'เจ็บที่ฉีด'
},
{
  id: 'potassium-citrate',
  name: 'Potassium Citrate',
  thaiName: 'โพแทสเซียม ซิเตรท',
  drugClass: 'Alkalinizing Agent / Supplement',
  species: 'both',
  dosage: { dog: { min: 50, max: 75 }, cat: { min: 50, max: 75 } },
  routes: ['PO'],
  frequency: 'q12h',
  concentrations: [
  { value: 540, unit: 'mg/tablet', label: 'Tab 540mg (5 mEq)' },
  { value: 1080, unit: 'mg/tablet', label: 'Tab 1080mg (10 mEq)' }],

  administrationNotes: 'ใช้ป้องกันนิ่ว Calcium oxalate ทำให้ปัสสาวะเป็นด่าง',
  warnings: 'ระวังโพแทสเซียมสูง',
  sideEffects: 'คลื่นไส้, อาเจียน'
},
{
  id: 'aluminum-hydroxide',
  name: 'Aluminum Hydroxide',
  thaiName: 'อะลูมิเนียม ไฮดรอกไซด์',
  drugClass: 'Phosphate Binder',
  species: 'both',
  dosage: { dog: { min: 30, max: 90 }, cat: { min: 30, max: 90 } },
  routes: ['PO'],
  frequency: 'With meals',
  concentrations: [{ value: 64, unit: 'mg/ml', label: 'Susp 320mg/5ml' }],
  administrationNotes: 'ใช้ลดฟอสฟอรัสในเลือด (CKD) ผสมกับอาหาร',
  warnings: 'อาจทำให้ท้องผูก',
  sideEffects: 'ท้องผูก'
},
{
  id: 'epoetin-alfa',
  name: 'Epoetin Alfa (EPO)',
  thaiName: 'อีโปอิทิน อัลฟา',
  drugClass: 'Erythropoietin',
  species: 'both',
  dosage: { dog: { min: 100, max: 100 }, cat: { min: 100, max: 100 } },
  routes: ['SC'],
  frequency: '3x/week',
  concentrations: [{ value: 2000, unit: 'mg/ml', label: 'Inj 2000 IU/ml' }],
  administrationNotes:
  'ใช้รักษาโลหิตจางจากโรคไตเรื้อรัง หน่วยเป็น IU/kg ตรวจ PCV ทุกสัปดาห์',
  warnings: 'อาจเกิดแอนติบอดีต่อ EPO (Pure red cell aplasia)',
  sideEffects: 'ความดันสูง, ชัก, แอนติบอดีต่อ EPO'
},
{
  id: 'calcitriol',
  name: 'Calcitriol',
  thaiName: 'แคลซิไตรออล',
  drugClass: 'Vitamin D (Active)',
  species: 'both',
  dosage: { dog: { min: 2.5, max: 3.5 }, cat: { min: 2.5, max: 3.5 } },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [{ value: 0.25, unit: 'mg/capsule', label: 'Cap 0.25mcg' }],
  administrationNotes:
  'ใช้รักษา Secondary hyperparathyroidism จาก CKD (ng/kg) ตรวจ Ca, P ทุก 2 สัปดาห์',
  warnings: 'ระวังแคลเซียมสูง (Hypercalcemia)',
  sideEffects: 'แคลเซียมสูง, เบื่ออาหาร'
},
{
  id: 'alendronate',
  name: 'Alendronate',
  thaiName: 'อะเลนโดรเนต',
  drugClass: 'Bisphosphonate',
  species: 'cat',
  dosage: { cat: { min: 10, max: 10 } },
  routes: ['PO'],
  frequency: 'Weekly',
  concentrations: [{ value: 10, unit: 'mg/tablet', label: 'Tab 10mg' }],
  administrationNotes:
  'ใช้รักษา Hypercalcemia ในแมว ให้ 10 mg/cat สัปดาห์ละครั้ง ป้อนน้ำตาม',
  warnings: 'ระวังหลอดอาหารอักเสบ ป้อนน้ำตามเสมอ',
  sideEffects: 'หลอดอาหารอักเสบ, เบื่ออาหาร'
},
{
  id: 'maropitant-injectable',
  name: 'Maropitant (Pre-anesthetic)',
  thaiName: 'มาโรพิแทนท์ (ก่อนวางยาสลบ)',
  drugClass: 'Antiemetic (Pre-anesthetic)',
  species: 'both',
  dosage: { dog: { min: 1, max: 1 }, cat: { min: 1, max: 1 } },
  routes: ['IV'],
  frequency: 'Once (pre-op)',
  concentrations: [
  { value: 10, unit: 'mg/ml', label: 'Cerenia Inj 10mg/ml' }],

  administrationNotes:
  'ให้ก่อนวางยาสลบเพื่อลดอาเจียนและคลื่นไส้ระหว่างและหลังผ่าตัด',
  warnings: 'ให้ IV ช้าๆ',
  sideEffects: 'ไม่ค่อยพบ'
},
// ===== MODERN ANESTHETIC & ANESTHESIA-RELATED DRUGS =====
{
  id: 'tiletamine-zolazepam',
  name: 'Tiletamine-Zolazepam',
  thaiName: 'ไทเลตามีน-โซลาซีแพม (Zoletil)',
  drugClass: 'Dissociative Anesthetic + Benzodiazepine',
  species: 'both',
  dosage: { dog: { min: 6, max: 12 }, cat: { min: 6, max: 12 } },
  routes: ['IV', 'IM'],
  frequency: 'Induction / Single dose',
  concentrations: [
  { value: 50, unit: 'mg/ml', label: 'Zoletil 50 (250mg/5ml)' },
  { value: 100, unit: 'mg/ml', label: 'Zoletil 100 (500mg/5ml)' }],

  administrationNotes:
  'ยาสลบที่นิยมมากในคลินิกสัตว์ไทย ฉีด IM ได้ (ไม่ต้องวาง IV catheter) IM: 6-12 mg/kg, IV: 2-6 mg/kg (titrate) ใช้ได้ทั้งสุนัขและแมว',
  warnings:
  'ห้ามใช้ซ้ำ (Zolazepam ขับออกช้ากว่า Tiletamine ในสุนัข ทำให้ Recovery นาน) ระวังในสัตว์โรคหัวใจ ไต ตับ',
  sideEffects: 'น้ำลายไหล, กล้ามเนื้อเกร็ง (สุนัข), Recovery นาน, ตาเปิดค้าง',
  contraindications: 'โรคตับอ่อน, โรคไตรุนแรง, ความดันในกะโหลกสูง'
},
{
  id: 'etomidate',
  name: 'Etomidate',
  thaiName: 'เอโทมิเดต',
  drugClass: 'Anesthetic Induction Agent (Non-barbiturate)',
  species: 'both',
  dosage: { dog: { min: 1, max: 2 }, cat: { min: 1, max: 3 } },
  routes: ['IV'],
  frequency: 'Induction',
  concentrations: [
  { value: 2, unit: 'mg/ml', label: 'Inj 2mg/ml (Amidate)' }],

  administrationNotes:
  'ยา Induction ที่ปลอดภัยที่สุดต่อระบบหัวใจ เหมาะสำหรับสัตว์ที่มีโรคหัวใจหรือ Hemodynamically unstable ฉีด IV ช้าๆ titrate to effect',
  warnings:
  'ทำให้ Adrenal suppression ชั่วคราว (6-12 ชม.) ห้ามใช้ซ้ำหรือ CRI อาจทำให้กล้ามเนื้อกระตุก (Myoclonus) ให้ Benzodiazepine ร่วมเพื่อลด',
  sideEffects:
  'กล้ามเนื้อกระตุก (Myoclonus), อาเจียน, Adrenal suppression, เจ็บเวลาฉีด',
  contraindications: 'Addison disease, ห้ามใช้ CRI'
},
{
  id: 'desflurane',
  name: 'Desflurane',
  thaiName: 'เดสฟลูเรน',
  drugClass: 'Inhalation Anesthetic',
  species: 'both',
  dosage: { dog: { min: 7.2, max: 7.2 }, cat: { min: 9.8, max: 9.8 } },
  routes: ['Inhalation'],
  frequency: 'Continuous (MAC %)',
  concentrations: [{ value: 100, unit: '%', label: 'Liquid 100%' }],
  administrationNotes:
  'MAC สุนัข ~7.2% แมว ~9.8% Recovery เร็วที่สุดในกลุ่มยาสลบสูด ต้องใช้ Heated vaporizer พิเศษ (Tec 6) เนื่องจากจุดเดือดต่ำ (22.8°C)',
  warnings:
  'ต้องใช้ Vaporizer เฉพาะ (Tec 6) ห้ามใช้กับ Vaporizer ธรรมดา ระคายเคืองทางเดินหายใจ ห้ามใช้ Mask induction',
  sideEffects: 'ความดันต่ำ, หายใจช้า, ระคายเคืองทางเดินหายใจ'
},
{
  id: 'nitrous-oxide',
  name: 'Nitrous Oxide (N₂O)',
  thaiName: 'ไนตรัสออกไซด์',
  drugClass: 'Inhalation Anesthetic (Adjunct)',
  species: 'both',
  dosage: { dog: { min: 50, max: 66 }, cat: { min: 50, max: 66 } },
  routes: ['Inhalation'],
  frequency: 'Continuous (%)',
  concentrations: [{ value: 100, unit: '%', label: 'Gas cylinder' }],
  administrationNotes:
  'ใช้ร่วมกับ Isoflurane/Sevoflurane เพื่อลด MAC 20-30% ให้ 50-66% N₂O ผสม O₂ (ต้องให้ O₂ อย่างน้อย 33%) ช่วยลดปวดและลดปริมาณยาสลบหลัก',
  warnings:
  'ห้ามใช้ในสัตว์ที่มี Pneumothorax, GDV, หรือลำไส้อุดตัน (N₂O จะขยายตัวในช่องอากาศ) ต้องให้ O₂ 100% อย่างน้อย 5 นาทีก่อนหยุด N₂O (ป้องกัน Diffusion hypoxia)',
  sideEffects: 'Diffusion hypoxia (หากหยุดทันที), คลื่นไส้',
  contraindications: 'Pneumothorax, GDV, ลำไส้อุดตัน, หูชั้นกลางอักเสบ'
},
{
  id: 'remifentanil',
  name: 'Remifentanil',
  thaiName: 'เรมิเฟนทานิล',
  drugClass: 'Analgesic (Ultra-short Acting Opioid)',
  species: 'both',
  dosage: { dog: { min: 5, max: 40 }, cat: { min: 5, max: 20 } },
  routes: ['IV'],
  frequency: 'CRI (mcg/kg/hr)',
  concentrations: [
  { value: 1, unit: 'mg/ml', label: 'Inj 1mg vial (reconstitute)' }],

  administrationNotes:
  'ให้แบบ CRI เท่านั้น (ห้าม Bolus เดี่ยว) สุนัข: 5-40 mcg/kg/hr แมว: 5-20 mcg/kg/hr ออกฤทธิ์เร็วมากและหมดฤทธิ์เร็วมาก (ถูกสลายโดย Esterase ในเลือด) ไม่สะสมแม้ให้นาน',
  warnings:
  'ทำให้หายใจช้ามาก ต้องช่วยหายใจ (Ventilate) หมดฤทธิ์ทันทีเมื่อหยุด CRI — ต้องให้ยาแก้ปวดตัวอื่นก่อนหยุด',
  sideEffects: 'หายใจช้า/หยุดหายใจ, หัวใจเต้นช้า, กล้ามเนื้อเกร็ง'
},
{
  id: 'sufentanil',
  name: 'Sufentanil',
  thaiName: 'ซูเฟนทานิล',
  drugClass: 'Analgesic (Potent Opioid)',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 1 }, cat: { min: 0.5, max: 1 } },
  routes: ['IV'],
  frequency: 'CRI (mcg/kg/hr)',
  concentrations: [{ value: 0.05, unit: 'mg/ml', label: 'Inj 50mcg/ml' }],
  administrationNotes:
  'แรงกว่า Fentanyl 5-10 เท่า ใช้ CRI ระหว่างผ่าตัด Loading: 0.5-1 mcg/kg IV แล้วต่อ CRI 0.5-1 mcg/kg/hr',
  warnings: 'ทำให้หายใจช้ามาก ต้องเตรียมช่วยหายใจ',
  sideEffects: 'หายใจช้า, หัวใจเต้นช้า, ง่วงซึม'
},
{
  id: 'hydromorphone',
  name: 'Hydromorphone',
  thaiName: 'ไฮโดรมอร์โฟน',
  drugClass: 'Analgesic (Opioid - Full Agonist)',
  species: 'both',
  dosage: { dog: { min: 0.05, max: 0.1 }, cat: { min: 0.025, max: 0.05 } },
  routes: ['IV', 'IM', 'SC'],
  frequency: 'q4-6h',
  concentrations: [
  { value: 2, unit: 'mg/ml', label: 'Inj 2mg/ml' },
  { value: 10, unit: 'mg/ml', label: 'Inj 10mg/ml' }],

  administrationNotes:
  'แก้ปวดรุนแรง แรงกว่า Morphine 5-7 เท่า ไม่ทำให้ Histamine release เหมือน Morphine (ฉีด IV ได้ปลอดภัยกว่า) นิยมใช้เป็น Premed ก่อนวางยาสลบ',
  warnings:
  'ทำให้หายใจช้า อาจทำให้อาเจียน (น้อยกว่า Morphine) ในแมวอาจทำให้ Hyperthermia',
  sideEffects: 'หายใจช้า, อาเจียน, ง่วงซึม, Hyperthermia (แมว)'
},
{
  id: 'oxymorphone',
  name: 'Oxymorphone',
  thaiName: 'ออกซีมอร์โฟน',
  drugClass: 'Analgesic (Opioid - Full Agonist)',
  species: 'both',
  dosage: { dog: { min: 0.05, max: 0.1 }, cat: { min: 0.02, max: 0.05 } },
  routes: ['IV', 'IM', 'SC'],
  frequency: 'q4-6h',
  concentrations: [
  { value: 1, unit: 'mg/ml', label: 'Inj 1mg/ml (Numorphan)' }],

  administrationNotes:
  'แก้ปวดรุนแรง แรงกว่า Morphine 10 เท่า ไม่ทำให้ Histamine release ใช้เป็น Premed หรือ Postoperative analgesia',
  warnings: 'ทำให้หายใจช้า ราคาแพง',
  sideEffects: 'หายใจช้า, ง่วงซึม, หัวใจเต้นช้า'
},
{
  id: 'meperidine',
  name: 'Meperidine (Pethidine)',
  thaiName: 'เมเพอริดีน (เพทิดีน)',
  drugClass: 'Analgesic (Opioid)',
  species: 'both',
  dosage: { dog: { min: 3, max: 5 }, cat: { min: 3, max: 5 } },
  routes: ['IM', 'SC'],
  frequency: 'q2-4h',
  concentrations: [{ value: 50, unit: 'mg/ml', label: 'Inj 50mg/ml' }],
  administrationNotes:
  'ออกฤทธิ์สั้น (1-2 ชม.) ฉีด IM เท่านั้น (ห้ามฉีด IV — ทำให้ Histamine release รุนแรง) มีฤทธิ์ Anticholinergic เล็กน้อย (ลดน้ำลาย)',
  warnings:
  '⚠️ ห้ามฉีด IV (Histamine release รุนแรง) ห้ามใช้ร่วมกับ MAOIs ออกฤทธิ์สั้นมาก',
  sideEffects: 'ง่วงซึม, คลื่นไส้, Histamine release (IV)'
},
{
  id: 'rocuronium',
  name: 'Rocuronium',
  thaiName: 'โรคิวโรเนียม',
  drugClass: 'Neuromuscular Blocker (Non-depolarizing)',
  species: 'both',
  dosage: { dog: { min: 0.3, max: 0.6 }, cat: { min: 0.3, max: 0.6 } },
  routes: ['IV'],
  frequency: 'PRN (during anesthesia)',
  concentrations: [{ value: 10, unit: 'mg/ml', label: 'Inj 10mg/ml' }],
  administrationNotes:
  'ออกฤทธิ์เร็วกว่า Atracurium (1-2 นาที) ใช้ระหว่างวางยาสลบเพื่อคลายกล้ามเนื้อ ต้องใส่ท่อช่วยหายใจและช่วยหายใจตลอด Reverse ด้วย Neostigmine+Atropine หรือ Sugammadex',
  warnings: 'ห้ามใช้โดยไม่มีเครื่องช่วยหายใจ สัตว์ต้องหมดสติสนิทก่อนให้ยา',
  sideEffects: 'หยุดหายใจ, หัวใจเต้นเร็ว'
},
{
  id: 'sugammadex',
  name: 'Sugammadex',
  thaiName: 'ซูกัมมาเด็กซ์',
  drugClass: 'Neuromuscular Blocker Reversal (Selective)',
  species: 'both',
  dosage: { dog: { min: 2, max: 4 }, cat: { min: 2, max: 4 } },
  routes: ['IV'],
  frequency: 'Once (reversal)',
  concentrations: [
  { value: 100, unit: 'mg/ml', label: 'Inj 100mg/ml (Bridion)' }],

  administrationNotes:
  'ใช้ reverse Rocuronium/Vecuronium โดยเฉพาะ ออกฤทธิ์เร็วมาก (1-3 นาที) Routine reversal: 2 mg/kg IV, Deep block: 4 mg/kg IV ไม่ต้องให้ Atropine ร่วม (ไม่มี Cholinergic side effects)',
  warnings:
  'ใช้ได้เฉพาะกับ Rocuronium/Vecuronium เท่านั้น (ไม่ reverse Atracurium/Cisatracurium)',
  sideEffects: 'ปวดหัว, คลื่นไส้ (พบน้อย)'
},
{
  id: 'pancuronium',
  name: 'Pancuronium',
  thaiName: 'แพนคิวโรเนียม',
  drugClass: 'Neuromuscular Blocker (Non-depolarizing)',
  species: 'both',
  dosage: { dog: { min: 0.06, max: 0.1 }, cat: { min: 0.06, max: 0.1 } },
  routes: ['IV'],
  frequency: 'PRN (during anesthesia)',
  concentrations: [{ value: 2, unit: 'mg/ml', label: 'Inj 2mg/ml' }],
  administrationNotes:
  'ออกฤทธิ์นาน (45-60 นาที) ทำให้หัวใจเต้นเร็ว (Vagolytic) Reverse ด้วย Neostigmine + Atropine',
  warnings:
  'ห้ามใช้โดยไม่มีเครื่องช่วยหายใจ ออกฤทธิ์นาน ระวังในสัตว์โรคไต (ขับออกทางไต)',
  sideEffects: 'หยุดหายใจ, หัวใจเต้นเร็ว'
},
{
  id: 'cisatracurium',
  name: 'Cisatracurium',
  thaiName: 'ซิสอะทราคิวเรียม',
  drugClass: 'Neuromuscular Blocker (Non-depolarizing)',
  species: 'both',
  dosage: { dog: { min: 0.1, max: 0.15 }, cat: { min: 0.1, max: 0.15 } },
  routes: ['IV'],
  frequency: 'PRN (during anesthesia)',
  concentrations: [{ value: 2, unit: 'mg/ml', label: 'Inj 2mg/ml (Nimbex)' }],
  administrationNotes:
  'Isomer ของ Atracurium แต่แรงกว่า 3 เท่า ไม่ทำให้ Histamine release (ต่างจาก Atracurium) สลายตัวโดย Hofmann elimination (ไม่ต้องพึ่งตับ/ไต)',
  warnings: 'ห้ามใช้โดยไม่มีเครื่องช่วยหายใจ',
  sideEffects: 'หยุดหายใจ'
},
{
  id: 'vecuronium',
  name: 'Vecuronium',
  thaiName: 'เวคิวโรเนียม',
  drugClass: 'Neuromuscular Blocker (Non-depolarizing)',
  species: 'both',
  dosage: { dog: { min: 0.05, max: 0.1 }, cat: { min: 0.05, max: 0.1 } },
  routes: ['IV'],
  frequency: 'PRN (during anesthesia)',
  concentrations: [
  { value: 4, unit: 'mg/ml', label: 'Inj 10mg vial (reconstitute)' }],

  administrationNotes:
  'ออกฤทธิ์ปานกลาง (20-35 นาที) ไม่ทำให้หัวใจเต้นเร็ว (ต่างจาก Pancuronium) Reverse ด้วย Neostigmine+Atropine หรือ Sugammadex',
  warnings: 'ห้ามใช้โดยไม่มีเครื่องช่วยหายใจ ระวังในสัตว์โรคตับ',
  sideEffects: 'หยุดหายใจ'
},
{
  id: 'succinylcholine',
  name: 'Succinylcholine',
  thaiName: 'ซักซินิลโคลีน',
  drugClass: 'Neuromuscular Blocker (Depolarizing)',
  species: 'both',
  dosage: { dog: { min: 0.3, max: 0.5 }, cat: { min: 0.3, max: 0.5 } },
  routes: ['IV'],
  frequency: 'Single dose (emergency intubation)',
  concentrations: [{ value: 20, unit: 'mg/ml', label: 'Inj 20mg/ml' }],
  administrationNotes:
  'ออกฤทธิ์เร็วที่สุด (30-60 วินาที) หมดฤทธิ์เร็ว (5-10 นาที) ใช้สำหรับ Emergency intubation เท่านั้น ไม่มียา Reverse',
  warnings:
  '⚠️ อาจทำให้ Malignant hyperthermia, Hyperkalemia ห้ามใช้ในสัตว์ที่มีโพแทสเซียมสูง, กล้ามเนื้อบาดเจ็บ, แผลไฟไหม้',
  sideEffects:
  'Hyperkalemia, Malignant hyperthermia, กล้ามเนื้อกระตุก, หัวใจเต้นช้า',
  contraindications:
  'Hyperkalemia, Malignant hyperthermia, กล้ามเนื้อบาดเจ็บ'
},
{
  id: 'bupivacaine',
  name: 'Bupivacaine',
  thaiName: 'บิวพิวาเคน',
  drugClass: 'Local Anesthetic (Long-acting)',
  species: 'both',
  dosage: { dog: { min: 1, max: 2 }, cat: { min: 1, max: 1 } },
  routes: ['SC', 'Topical'],
  frequency: 'Single dose / q6-8h',
  concentrations: [
  { value: 2.5, unit: 'mg/ml', label: 'Inj 0.25% (2.5mg/ml)' },
  { value: 5, unit: 'mg/ml', label: 'Inj 0.5% (5mg/ml)' }],

  administrationNotes:
  'ยาชาเฉพาะที่ออกฤทธิ์นาน (4-8 ชม.) ใช้ Block เส้นประสาท, Epidural, Splash block แผลผ่าตัด ออกฤทธิ์ช้ากว่า Lidocaine (20-30 นาที) แต่นานกว่ามาก',
  warnings:
  '⚠️ เป็นพิษต่อหัวใจมากกว่า Lidocaine (Cardiotoxic) ห้ามฉีด IV ห้ามเกินขนาดสูงสุด แมว: max 1 mg/kg สุนัข: max 2 mg/kg',
  sideEffects: 'หัวใจเต้นผิดจังหวะ (หากเข้าเส้นเลือด), ชัก, ชาบริเวณที่ฉีด',
  contraindications: 'ห้ามฉีด IV'
},
{
  id: 'ropivacaine',
  name: 'Ropivacaine',
  thaiName: 'โรพิวาเคน',
  drugClass: 'Local Anesthetic (Long-acting)',
  species: 'both',
  dosage: { dog: { min: 1, max: 3 }, cat: { min: 1, max: 1.5 } },
  routes: ['SC', 'Topical'],
  frequency: 'Single dose / q6-8h',
  concentrations: [
  { value: 2, unit: 'mg/ml', label: 'Inj 0.2% (2mg/ml)' },
  { value: 5, unit: 'mg/ml', label: 'Inj 0.5% (5mg/ml)' },
  { value: 7.5, unit: 'mg/ml', label: 'Inj 0.75% (7.5mg/ml)' }],

  administrationNotes:
  'คล้าย Bupivacaine แต่เป็นพิษต่อหัวใจน้อยกว่า ออกฤทธิ์นาน 4-6 ชม. ใช้ Nerve block, Epidural, Wound infiltration',
  warnings: 'ปลอดภัยกว่า Bupivacaine ต่อหัวใจ แต่ยังต้องระวังเรื่องขนาดยา',
  sideEffects: 'ชาบริเวณที่ฉีด, หัวใจเต้นผิดจังหวะ (หากเข้าเส้นเลือด)'
},
{
  id: 'mepivacaine',
  name: 'Mepivacaine',
  thaiName: 'เมพิวาเคน',
  drugClass: 'Local Anesthetic (Intermediate-acting)',
  species: 'both',
  dosage: { dog: { min: 3, max: 5 }, cat: { min: 3, max: 4 } },
  routes: ['SC', 'Topical'],
  frequency: 'Single dose',
  concentrations: [
  { value: 10, unit: 'mg/ml', label: 'Inj 1% (10mg/ml)' },
  { value: 20, unit: 'mg/ml', label: 'Inj 2% (20mg/ml)' }],

  administrationNotes:
  'ออกฤทธิ์เร็วกว่า Bupivacaine แต่สั้นกว่า (1.5-3 ชม.) ใช้ในทันตกรรมสัตว์ (Dental block) ได้ดี ไม่ทำให้หลอดเลือดขยาย (ไม่ต้องผสม Epinephrine)',
  warnings: 'ระวังเรื่องขนาดยาสูงสุด',
  sideEffects: 'ชาบริเวณที่ฉีด'
},
{
  id: 'ketamine-cri',
  name: 'Ketamine (CRI - Analgesic)',
  thaiName: 'คีตามีน (CRI แก้ปวด)',
  drugClass: 'NMDA Antagonist (Analgesic CRI)',
  species: 'both',
  dosage: { dog: { min: 2, max: 10 }, cat: { min: 2, max: 5 } },
  routes: ['IV'],
  frequency: 'CRI (mcg/kg/min)',
  concentrations: [
  { value: 50, unit: 'mg/ml', label: 'Inj 50mg/ml' },
  { value: 100, unit: 'mg/ml', label: 'Inj 100mg/ml' }],

  administrationNotes:
  'ขนาดต่ำ (Sub-anesthetic dose) ใช้แก้ปวดระหว่างผ่าตัด Loading: 0.5 mg/kg IV แล้วต่อ CRI 2-10 mcg/kg/min ช่วยลด Wind-up pain และลดปริมาณ Opioid ที่ต้องใช้ มักใช้ร่วมกับ MLK protocol (Morphine-Lidocaine-Ketamine)',
  warnings: 'ขนาด CRI ต่ำกว่าขนาด Induction มาก ระวังอย่าสับสน',
  sideEffects: 'ม่านตาขยาย, น้ำลายไหล (ขนาดสูง)'
},
{
  id: 'lidocaine-cri',
  name: 'Lidocaine (CRI - Analgesic)',
  thaiName: 'ลิโดเคน (CRI แก้ปวด)',
  drugClass: 'Local Anesthetic / Analgesic (CRI)',
  species: 'dog',
  dosage: { dog: { min: 25, max: 80 } },
  routes: ['IV'],
  frequency: 'CRI (mcg/kg/min)',
  concentrations: [{ value: 20, unit: 'mg/ml', label: 'Inj 2% (20mg/ml)' }],
  administrationNotes:
  'ใช้ในสุนัขเท่านั้น Loading: 1-2 mg/kg IV ช้าๆ (5 นาที) แล้วต่อ CRI 25-80 mcg/kg/min ช่วยลดปวด ลดปริมาณยาสลบ ลดการอักเสบ มักใช้ร่วมกับ MLK protocol',
  warnings:
  '⚠️ ห้ามใช้ CRI ในแมว (พิษสูง) ระวังอาการพิษ: ชัก, หัวใจเต้นผิดจังหวะ',
  sideEffects: 'คลื่นไส้, ชัก (หากเกินขนาด), หัวใจเต้นผิดจังหวะ',
  contraindications: 'ห้ามใช้ในแมว'
},
{
  id: 'mlk-protocol',
  name: 'MLK Protocol (Morphine-Lidocaine-Ketamine)',
  thaiName: 'โปรโตคอล MLK',
  drugClass: 'Multimodal Analgesic CRI',
  species: 'dog',
  dosage: { dog: { min: 0, max: 0 } },
  routes: ['IV'],
  frequency: 'CRI',
  concentrations: [
  { value: 10, unit: 'mg/ml', label: 'Morphine 10mg/ml' },
  { value: 20, unit: 'mg/ml', label: 'Lidocaine 2% (20mg/ml)' },
  { value: 100, unit: 'mg/ml', label: 'Ketamine 100mg/ml' }],

  administrationNotes:
  'สูตรผสม 3 ยาใน 1 ถุง IV fluid (สุนัขเท่านั้น): Morphine 0.12 mg/kg/hr + Lidocaine 3 mg/kg/hr + Ketamine 0.6 mg/kg/hr ตัวอย่าง: ผสมใน LRS 1L → Morphine 12mg + Lidocaine 300mg + Ketamine 60mg แล้วให้ Rate 10 ml/kg/hr ช่วยแก้ปวดหลายกลไก ลดปริมาณยาสลบ',
  warnings:
  '⚠️ ใช้ในสุนัขเท่านั้น (Lidocaine เป็นพิษต่อแมว) คำนวณอัตราการให้อย่างระมัดระวัง',
  sideEffects: 'ง่วงซึม, คลื่นไส้, หายใจช้า',
  contraindications: 'ห้ามใช้ในแมว'
},
{
  id: 'fentanyl-cri',
  name: 'Fentanyl (CRI)',
  thaiName: 'เฟนทานิล (CRI ระหว่างผ่าตัด)',
  drugClass: 'Analgesic (Opioid CRI)',
  species: 'both',
  dosage: { dog: { min: 2, max: 10 }, cat: { min: 1, max: 5 } },
  routes: ['IV'],
  frequency: 'CRI (mcg/kg/hr)',
  concentrations: [{ value: 0.05, unit: 'mg/ml', label: 'Inj 50mcg/ml' }],
  administrationNotes:
  'Loading: 2-5 mcg/kg IV ช้าๆ แล้วต่อ CRI สุนัข: 2-10 mcg/kg/hr แมว: 1-5 mcg/kg/hr ใช้แก้ปวดระหว่างผ่าตัด ลดปริมาณยาสลบสูดได้ 30-50%',
  warnings: 'ทำให้หายใจช้า ต้องเตรียมช่วยหายใจ Reverse ด้วย Naloxone',
  sideEffects: 'หายใจช้า, หัวใจเต้นช้า, ง่วงซึม'
},
{
  id: 'dexmedetomidine-cri',
  name: 'Dexmedetomidine (CRI)',
  thaiName: 'เดกซ์เมเดโทมิดีน (CRI ระหว่างผ่าตัด)',
  drugClass: 'Alpha-2 Agonist (CRI)',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 2 }, cat: { min: 0.5, max: 1 } },
  routes: ['IV'],
  frequency: 'CRI (mcg/kg/hr)',
  concentrations: [
  { value: 0.1, unit: 'mg/ml', label: 'Dexdomitor 0.1mg/ml' },
  { value: 0.5, unit: 'mg/ml', label: 'Dexdomitor 0.5mg/ml' }],

  administrationNotes:
  'ใช้ CRI ขนาดต่ำระหว่างผ่าตัด ช่วยลด MAC ของยาสลบสูด 30-50% ให้ทั้ง Sedation + Analgesia Loading: 1-3 mcg/kg IV แล้วต่อ CRI 0.5-2 mcg/kg/hr',
  warnings: 'ทำให้หัวใจเต้นช้า ระวังในสัตว์โรคหัวใจ Reverse ด้วย Atipamezole',
  sideEffects: 'หัวใจเต้นช้า, ความดันสูงแล้วต่ำ'
},
{
  id: 'propofol-tiva',
  name: 'Propofol (TIVA - Total IV Anesthesia)',
  thaiName: 'โปรโพฟอล (TIVA)',
  drugClass: 'Anesthetic (Total IV Anesthesia)',
  species: 'both',
  dosage: { dog: { min: 0.1, max: 0.4 }, cat: { min: 0.1, max: 0.3 } },
  routes: ['IV'],
  frequency: 'CRI (mg/kg/min)',
  concentrations: [{ value: 10, unit: 'mg/ml', label: 'Inj 1% (10mg/ml)' }],
  administrationNotes:
  'ใช้แทนยาสลบสูดได้ (TIVA) Induction: 4-6 mg/kg IV แล้วต่อ CRI 0.1-0.4 mg/kg/min ปรับตามความลึกของการสลบ Recovery เร็ว เหมาะกับหัตถการสั้นๆ หรือ MRI/CT',
  warnings:
  'ทำให้ความดันต่ำและหยุดหายใจ ต้องเตรียมช่วยหายใจ ในแมวหากใช้ซ้ำหลายวันอาจเกิด Heinz body',
  sideEffects: 'หยุดหายใจ, ความดันต่ำ, Heinz body (แมว ใช้ซ้ำ)'
},
{
  id: 'gabapentin-premed',
  name: 'Gabapentin (Pre-anesthetic)',
  thaiName: 'กาบาเพนติน (ก่อนวางยาสลบ)',
  drugClass: 'Analgesic / Anxiolytic (Pre-anesthetic)',
  species: 'both',
  dosage: { dog: { min: 5, max: 10 }, cat: { min: 50, max: 100 } },
  routes: ['PO'],
  frequency: 'Once (2-3h before)',
  concentrations: [
  { value: 100, unit: 'mg/capsule', label: 'Cap 100mg' },
  { value: 300, unit: 'mg/capsule', label: 'Cap 300mg' }],

  administrationNotes:
  'ให้ 2-3 ชม. ก่อนมาคลินิก/ก่อนวางยาสลบ แมว: 50-100 mg/cat PO สุนัข: 5-10 mg/kg PO ช่วยลดความเครียด ลดปวด และลดปริมาณยาสลบที่ต้องใช้ (MAC-sparing)',
  warnings: 'ระวังยาน้ำที่มี Xylitol (เป็นพิษต่อสุนัข)',
  sideEffects: 'ง่วงซึม, เดินเซ'
},
{
  id: 'trazodone-premed',
  name: 'Trazodone (Pre-anesthetic)',
  thaiName: 'ทราโซโดน (ก่อนวางยาสลบ)',
  drugClass: 'Anxiolytic (Pre-anesthetic)',
  species: 'dog',
  dosage: { dog: { min: 3, max: 5 } },
  routes: ['PO'],
  frequency: 'Once (1-2h before)',
  concentrations: [
  { value: 50, unit: 'mg/tablet', label: 'Tab 50mg' },
  { value: 100, unit: 'mg/tablet', label: 'Tab 100mg' }],

  administrationNotes:
  'ให้ 1-2 ชม. ก่อนมาคลินิก ช่วยลดความเครียดในสุนัข มักใช้ร่วมกับ Gabapentin (Gabapentin + Trazodone combo)',
  warnings: 'ระวัง Serotonin syndrome หากใช้ร่วมกับ SSRIs',
  sideEffects: 'ง่วงซึม, เดินเซ'
},
{
  id: 'acepromazine-premed',
  name: 'Acepromazine (Pre-anesthetic)',
  thaiName: 'อะซีโปรมาซีน (Premed)',
  drugClass: 'Sedative / Tranquilizer (Pre-anesthetic)',
  species: 'both',
  dosage: { dog: { min: 0.01, max: 0.05 }, cat: { min: 0.01, max: 0.05 } },
  routes: ['IV', 'IM'],
  frequency: 'Once (premed)',
  concentrations: [{ value: 10, unit: 'mg/ml', label: 'Inj 10mg/ml' }],
  administrationNotes:
  'ใช้ขนาดต่ำเป็น Premed (0.01-0.05 mg/kg) ร่วมกับ Opioid ให้ 15-20 นาทีก่อน Induction ช่วยลดปริมาณยา Induction ที่ต้องใช้ 20-30%',
  warnings:
  'ทำให้ความดันต่ำ ห้ามใช้ในสัตว์ที่ Hypovolemic หรือ Shock ขนาด Premed ต่ำกว่าขนาด Sedation',
  sideEffects: 'ความดันต่ำ, ง่วงซึม'
},
{
  id: 'fentanyl-patch',
  name: 'Fentanyl Transdermal Patch',
  thaiName: 'แผ่นแปะเฟนทานิล',
  drugClass: 'Analgesic (Opioid - Transdermal)',
  species: 'both',
  dosage: { dog: { min: 2, max: 4 }, cat: { min: 25, max: 25 } },
  routes: ['Transdermal'],
  frequency: 'q72h (every 3 days)',
  concentrations: [
  { value: 12, unit: 'mg/ml', label: 'Patch 12 mcg/hr' },
  { value: 25, unit: 'mg/ml', label: 'Patch 25 mcg/hr' },
  { value: 50, unit: 'mg/ml', label: 'Patch 50 mcg/hr' },
  { value: 75, unit: 'mg/ml', label: 'Patch 75 mcg/hr' },
  { value: 100, unit: 'mg/ml', label: 'Patch 100 mcg/hr' }],

  administrationNotes:
  'แปะที่ผิวหนังที่โกนขนแล้ว ออกฤทธิ์ช้า (12-24 ชม. หลังแปะ) ต้องให้ยาแก้ปวดตัวอื่นในช่วงแรก แมว: 25 mcg/hr patch สุนัข: เลือกขนาดตามน้ำหนัก (~2-4 mcg/kg/hr)',
  warnings:
  'ออกฤทธิ์ช้า ต้อง Bridge ด้วยยาแก้ปวดอื่น ระวังอย่าให้สัตว์เลียหรือกัดแผ่น ผู้ใช้สวมถุงมือ',
  sideEffects: 'ง่วงซึม, หายใจช้า, คลื่นไส้'
},
{
  id: 'local-anesthetic-splash',
  name: 'Bupivacaine/Lidocaine Splash Block',
  thaiName: 'ยาชาราดแผล (Splash Block)',
  drugClass: 'Local Anesthetic (Wound)',
  species: 'both',
  dosage: { dog: { min: 1, max: 2 }, cat: { min: 1, max: 1 } },
  routes: ['Topical'],
  frequency: 'Once (intraoperative)',
  concentrations: [
  { value: 5, unit: 'mg/ml', label: 'Bupivacaine 0.5%' },
  { value: 20, unit: 'mg/ml', label: 'Lidocaine 2%' }],

  administrationNotes:
  'ราดยาชาลงบนแผลผ่าตัดก่อนเย็บปิด (Splash block) หรือฉีดรอบแผล (Incisional block) ใช้ Bupivacaine 0.5% (ออกฤทธิ์นาน) หรือ Lidocaine 2% (ออกฤทธิ์เร็ว) ช่วยลดปวดหลังผ่าตัดได้ดี',
  warnings: 'ระวังขนาดยาสูงสุด Bupivacaine: สุนัข 2 mg/kg, แมว 1 mg/kg',
  sideEffects: 'ชาบริเวณแผล'
},
{
  id: 'epidural-morphine',
  name: 'Morphine (Epidural)',
  thaiName: 'มอร์ฟีน (ฉีดเข้า Epidural)',
  drugClass: 'Analgesic (Epidural Opioid)',
  species: 'both',
  dosage: { dog: { min: 0.1, max: 0.1 }, cat: { min: 0.1, max: 0.1 } },
  routes: ['SC'],
  frequency: 'Single dose (q12-24h)',
  concentrations: [
  { value: 10, unit: 'mg/ml', label: 'Preservative-free Morphine 10mg/ml' }],

  administrationNotes:
  'ฉีดเข้าช่อง Epidural (Lumbosacral space) 0.1 mg/kg ผสมกับ NSS ให้ได้ปริมาตร 0.2 ml/kg (max 6 ml) ออกฤทธิ์แก้ปวดนาน 12-24 ชม. ใช้ Preservative-free เท่านั้น',
  warnings:
  'ต้องมีความชำนาญในการฉีด Epidural ใช้ Preservative-free morphine เท่านั้น ระวังปัสสาวะไม่ออก (Urinary retention)',
  sideEffects: 'ปัสสาวะไม่ออก, คัน, หายใจช้า (delayed)'
},
{
  id: 'amantadine',
  name: 'Amantadine',
  thaiName: 'อะแมนตาดีน',
  drugClass: 'NMDA Receptor Antagonist (Analgesic Adjunct)',
  species: 'both',
  dosage: { dog: { min: 3, max: 5 }, cat: { min: 3, max: 3 } },
  routes: ['PO'],
  frequency: 'q24h',
  concentrations: [
  { value: 100, unit: 'mg/tablet', label: 'Tab 100mg' },
  { value: 100, unit: 'mg/capsule', label: 'Cap 100mg' }],
  administrationNotes:
  'ใช้เป็นยาเสริมแก้ปวดเรื้อรัง (Wind-up pain) ร่วมกับ NSAIDs หรือ Gabapentin ไม่ใช้เป็นยาเดี่ยว ให้พร้อมอาหาร',
  warnings: 'ระวังในสัตว์โรคไต ยาน้ำ (Syrup) บางผลิตภัณฑ์มี Xylitol เป็นพิษต่อสุนัข',
  sideEffects: 'ง่วงซึม, ท้องเสีย, เดินเซ (พบน้อย)'
},
{
  id: 'chlorpromazine',
  name: 'Chlorpromazine',
  thaiName: 'คลอร์โปรมาซีน',
  drugClass: 'Phenothiazine Antiemetic / Sedative',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 1 }, cat: { min: 0.25, max: 0.5 } },
  routes: ['IM', 'IV', 'PO'],
  frequency: 'q6-8h',
  concentrations: [
  { value: 25, unit: 'mg/ml', label: 'Injectable 25mg/ml' },
  { value: 10, unit: 'mg/tablet', label: 'Tab 10mg' },
  { value: 25, unit: 'mg/tablet', label: 'Tab 25mg' }],
  administrationNotes:
  'ใช้แก้อาเจียนรุนแรง (Vestibular disease, Motion sickness) IV ให้ช้ามาก IM ให้ลึก ขณะให้ยาต้องนอน',
  warnings: 'ทำให้ความดันโลหิตต่ำ ห้ามใช้ในสัตว์ที่ Hypovolemic หรือ Shock',
  sideEffects: 'ความดันต่ำ, ง่วงซึม, อุณหภูมิกายต่ำ'
},
{
  id: 'cefpodoxime',
  name: 'Cefpodoxime Proxetil',
  thaiName: 'เซฟโพด็อกซิม',
  drugClass: 'Antibiotic (3rd Gen Cephalosporin)',
  species: 'both',
  dosage: { dog: { min: 5, max: 10 }, cat: { min: 5, max: 5 } },
  routes: ['PO'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 100, unit: 'mg/tablet', label: 'Simplicef 100mg' },
  { value: 200, unit: 'mg/tablet', label: 'Simplicef 200mg' }],
  administrationNotes:
  'ยาปฏิชีวนะ Cephalosporin รุ่น 3 ชนิดกิน ครอบคลุมแบคทีเรียแกรมลบ ใช้รักษาโรคผิวหนัง หู และ UTI',
  warnings: 'ระวังในสัตว์ที่แพ้ Penicillin (Cross-reactivity)',
  sideEffects: 'อาเจียน, ท้องเสีย, เบื่ออาหาร'
},
{
  id: 'methylprednisolone',
  name: 'Methylprednisolone',
  thaiName: 'เมทิลเพรดนิโซโลน',
  drugClass: 'Corticosteroid',
  species: 'both',
  dosage: { dog: { min: 0.5, max: 2 }, cat: { min: 0.5, max: 2 } },
  routes: ['PO', 'IV', 'IM'],
  frequency: 'q12-24h (anti-inflam); q24-72h (Depo)',
  concentrations: [
  { value: 4, unit: 'mg/tablet', label: 'Medrol 4mg' },
  { value: 16, unit: 'mg/tablet', label: 'Medrol 16mg' },
  { value: 40, unit: 'mg/ml', label: 'Depo-Medrol 40mg/ml (IM)' },
  { value: 125, unit: 'mg/ml', label: 'Solu-Medrol 125mg/vial (IV)' }],
  administrationNotes:
  'สเตียรอยด์ฤทธิ์ปานกลาง ลดการอักเสบ กดภูมิ Depo-Medrol (IM) ออกฤทธิ์นาน 3-6 สัปดาห์ ระวังใช้ซ้ำบ่อยเกินไป',
  warnings: 'ระวัง PU/PD, GI ulcer, การติดเชื้อ, ต่อมหมวกไตฝ่อ ห้ามใช้ร่วมกับ NSAIDs',
  sideEffects: 'กินน้ำมาก, ปัสสาวะมาก, อ้วน, ติดเชื้อง่าย'
},
{
  id: 'hydroxyzine',
  name: 'Hydroxyzine',
  thaiName: 'ไฮดรอกซีซีน',
  drugClass: 'Antihistamine (H1 antagonist)',
  species: 'both',
  dosage: { dog: { min: 1, max: 2 }, cat: { min: 1, max: 2 } },
  routes: ['PO'],
  frequency: 'q8h',
  concentrations: [
  { value: 10, unit: 'mg/tablet', label: 'Tab 10mg' },
  { value: 25, unit: 'mg/tablet', label: 'Tab 25mg' },
  { value: 50, unit: 'mg/tablet', label: 'Tab 50mg' }],
  administrationNotes:
  'ยาแก้แพ้รุ่นที่ 1 มีฤทธิ์ Sedation ช่วยลดอาการคัน ใช้ร่วมกับ Steroid ได้ในกรณีแพ้รุนแรง',
  warnings: 'ทำให้ง่วงซึม ระวังในสัตว์ที่ขับรถหรือต้องตื่นตัว',
  sideEffects: 'ง่วงซึม, ปากแห้ง, เบื่ออาหาร'
},
{
  id: 'pyrantel',
  name: 'Pyrantel Pamoate',
  thaiName: 'ไพแรนเทล',
  drugClass: 'Anthelmintic',
  species: 'both',
  dosage: { dog: { min: 5, max: 10 }, cat: { min: 5, max: 10 } },
  routes: ['PO'],
  frequency: 'Once; repeat after 2 weeks',
  concentrations: [
  { value: 50, unit: 'mg/ml', label: 'Oral suspension 50mg/ml' },
  { value: 250, unit: 'mg/tablet', label: 'Tab 250mg' }],
  administrationNotes:
  'ถ่ายพยาธิตัวกลม (Roundworm, Hookworm) ปลอดภัยสูง ใช้ได้ในลูกสัตว์ตั้งแต่อายุ 2 สัปดาห์ขึ้นไป',
  warnings: 'ห้ามใช้ร่วมกับ Piperazine (ออกฤทธิ์ตรงข้าม)',
  sideEffects: 'คลื่นไส้, อาเจียน (พบน้อย)'
},
{
  id: 'tylosin',
  name: 'Tylosin',
  thaiName: 'ไทโลซิน',
  drugClass: 'Antibiotic (Macrolide)',
  species: 'both',
  dosage: { dog: { min: 5, max: 25 }, cat: { min: 10, max: 15 } },
  routes: ['PO'],
  frequency: 'q12h',
  concentrations: [
  { value: 500, unit: 'mg/capsule', label: 'Cap 500mg' }],
  administrationNotes:
  'ใช้รักษา Antibiotic-Responsive Diarrhea (ARD) / Tylosin-Responsive Diarrhea ในสุนัข ขนาดต่ำ 5-10 mg/kg มักได้ผลดี ให้พร้อมอาหาร',
  warnings: 'ระวังใช้นานเกินไป อาจทำให้ดื้อยา',
  sideEffects: 'ท้องเสีย, อาเจียน'
},
{
  id: 'cyanocobalamin',
  name: 'Cyanocobalamin (Vitamin B12)',
  thaiName: 'วิตามินบี 12 (ไซยาโนโคบาลามิน)',
  drugClass: 'Vitamin / Supplement',
  species: 'both',
  dosage: { dog: { min: 250, max: 1500 }, cat: { min: 250, max: 250 } },
  routes: ['SC', 'IM', 'IV'],
  frequency: 'Weekly x 6 weeks, then monthly',
  concentrations: [
  { value: 1000, unit: 'mcg/ml', label: 'Inj 1000 mcg/ml' }],
  administrationNotes:
  'เสริม Cobalamin ในสัตว์ที่มี Hypocobalaminemia จากโรคทางเดินอาหาร (EPI, IBD, lymphoma)',
  warnings: 'ปลอดภัยสูง ผลข้างเคียงน้อยมาก',
  sideEffects: 'ปฏิกิริยาที่ตำแหน่งฉีด (พบน้อย)'
},
{
  id: 'amitriptyline',
  name: 'Amitriptyline',
  thaiName: 'อะมิทริปทีลีน',
  drugClass: 'Tricyclic Antidepressant (TCA)',
  species: 'both',
  dosage: { dog: { min: 1, max: 2 }, cat: { min: 0.5, max: 1 } },
  routes: ['PO'],
  frequency: 'q12-24h',
  concentrations: [
  { value: 10, unit: 'mg/tablet', label: 'Tab 10mg' },
  { value: 25, unit: 'mg/tablet', label: 'Tab 25mg' }],
  administrationNotes:
  'ใช้รักษา Feline Idiopathic Cystitis (FIC), ลดความวิตกกังวล, พฤติกรรมก้าวร้าว หรืออาการ Psychogenic alopecia ในแมว',
  warnings: 'ห้ามใช้ร่วมกับ MAO inhibitors (Selegiline) อาจเกิด Serotonin syndrome',
  sideEffects: 'ง่วงซึม, ปากแห้ง, ปัสสาวะคั่ง, หัวใจเต้นผิดปกติ'
},
{
  id: 'stanozolol',
  name: 'Stanozolol',
  thaiName: 'สตาโนโซลอล',
  drugClass: 'Anabolic Steroid',
  species: 'both',
  dosage: { dog: { min: 1, max: 2 }, cat: { min: 0.5, max: 1 } },
  routes: ['PO', 'IM'],
  frequency: 'q12-24h (PO); q7days (IM)',
  concentrations: [
  { value: 2, unit: 'mg/tablet', label: 'Tab 2mg' },
  { value: 50, unit: 'mg/ml', label: 'Inj 50mg/ml (Winstrol Depot)' }],
  administrationNotes:
  'ใช้กระตุ้นความอยากอาหาร เพิ่มน้ำหนัก และเพิ่มการสร้างเม็ดเลือดแดง ในสัตว์ที่มีภาวะ Hepatic lipidosis หรือ Cachexia',
  warnings: 'ระวังตับอักเสบ ห้ามใช้ในสัตว์ตั้งท้องหรือให้นม ระวัง Prostatic hypertrophy ในสุนัขตัวผู้',
  sideEffects: 'ค่าตับขึ้น, พฤติกรรมก้าวร้าว, ตับอักเสบ (การใช้นาน)'
}];