# DETAILED FINDINGS: lab.html vs set-lab.html Content Analysis

## COMPLETE CODE SECTIONS

### 1. lab.html - PARAM_ORDER Array (Lines 276-287)

```javascript
const THAI_MONTHS_LONG = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];

// ✅ อัปเดตลำดับที่ถูกต้องตามตารางอ้างอิงใหม่
const PARAM_ORDER = [
    // CBC
    'WBC', 'Lym#', 'Mid#', 'Gran#', 'Lym%', 'Mid%', 'Gran%', 'NLR', 'PLR',
    'RBC', 'HGB', 'HCT', 'MCV', 'MCH', 'MCHC', 'RDW-CV', 'RDW-SD',
    'PLT', 'MPV', 'PDW-CV', 'PDW-SD', 'PCT', 'P-LCC', 'P-LCR',
    // Chemistry
    'Alb', 'TP', 'ALP', 'ALT', 'AST', 'GGT', 'DBIL', 'TBIL', 'Glob', 'IBIL', 'Alb/Glob',
    'Ca', 'Crea', 'CO2', 'TCH', 'Glu', 'BUN', 'Amy', 'BUN/Crea', 'TBA', 'AST/ALT', 'P', 'CK'
];
```

**Total Parameters**: 42 items
- CBC: 23 items (indices 0-22)
- Chemistry: 19 items (indices 23-41)

---

### 2. lab.html - fetchMasterParams() Function (Lines 293-314)

```javascript
async function fetchMasterParams() { 
    const { data } = await db.from('mas_lab_parameters').select('*'); 
    
    let fetchedData = data || [];
    
    // ทำให้ Array ต้นแบบเป็นตัวพิมพ์ใหญ่ทั้งหมดเพื่อใช้เทียบง่ายๆ
    const upperParamOrder = PARAM_ORDER.map(p => p.toUpperCase());
    
    // ✅ จัดเรียงตามลำดับใน Array ด้านบน โดยไม่สนใจตัวพิมพ์เล็ก-ใหญ่
    fetchedData.sort((a, b) => {
        let indexA = upperParamOrder.indexOf(a.parameter_name.toUpperCase());
        let indexB = upperParamOrder.indexOf(b.parameter_name.toUpperCase());
        
        // ถ้าพารามิเตอร์ไหนในฐานข้อมูลไม่มีใน List จะถูกเด้งไปอยู่ล่างสุด (999)
        if (indexA === -1) indexA = 999;
        if (indexB === -1) indexB = 999;
        
        return indexA - indexB;
    });

    masterParams = fetchedData; 
}
```

**Logic**:
1. Converts PARAM_ORDER to uppercase: `['WBC', 'LYM#', ..., 'ALP', ...]`
2. For each parameter from database:
   - Find its position in the uppercase PARAM_ORDER array
   - If NOT found (index -1), assign index 999 (pushes to bottom)
3. Sort database parameters by these indices
4. Store in `masterParams` variable

---

### 3. lab.html - renderTrendTable() Function (Lines 452-490)

```javascript
function renderTrendTable() {
    const sessions = {}; 
    labHistory.forEach(r => { 
        if(!sessions[r.created_at]) sessions[r.created_at] = {}; 
        sessions[r.created_at][r.parameter_name] = r; 
    });
    const sortedTs = Object.keys(sessions).sort((a,b) => new Date(b) - new Date(a));
    
    // 1. สร้าง Header: เพิ่มหัวข้อ Unit และ Reference
    document.getElementById('trend-head').innerHTML = `<tr>
        <th class="col-sticky-param">Parameter</th>
        <th class="col-sticky-unit">Unit</th>
        <th class="col-sticky-ref">Reference</th>
        ${sortedTs.map(ts => `
        <th class="text-center">
            <div class="flex justify-center gap-3 mb-1">
                <button onclick="printBloodReport('${ts}')" class="text-purple-400 hover:text-purple-300 text-xs">🖨️ Print</button>
                <button onclick="editSession('${ts}')" class="text-blue-500 hover:text-blue-400 text-xs">✏️ Edit</button>
                <button onclick="deleteSession('${ts}')" class="text-red-500 hover:text-red-400 text-xs">✕ Del</button>
            </div>
            <span class="text-white">${formatThaiDate(new Date(ts))}</span>
        </th>`).join('')}
    </tr>`;
    
    // 2. สร้าง Body: แยกข้อมูลเป็นคอลัมน์ตาม Style ใหม่
    document.getElementById('trend-body').innerHTML = masterParams.map(p => {
        // คำนวณหาค่า Reference ปัจจุบันเพื่อโชว์ในคอลัมน์ที่ 3 (เป็นเกณฑ์อ้างอิงหลัก)
        const currentRefInfo = getAgeReferenceMode(currentAnimal.birth_date);
        const cRef = getRefRange(p, currentRefInfo.mode, currentRefInfo.isDog);
        const refRangeStr = (cRef.min !== null && cRef.max !== null) ? `${cRef.min} - ${cRef.max}` : '-';

        // สร้าง 3 คอลัมน์แรกที่ถูกตรึง (Sticky)
        let html = `
            <td class="col-sticky-param">${p.parameter_name}</td>
            <td class="col-sticky-unit">${p.unit || '-'}</td>
            <td class="col-sticky-ref">${refRangeStr}</td>
        `;
        
        // สร้างคอลัมน์ข้อมูลตามวันที่ (Data Columns)
        sortedTs.forEach(ts => { 
            const res = sessions[ts][p.parameter_name]; 
            const val = res ? res.test_value : '-'; 
            
            // คำนวณสีไฮไลท์ (getScaleClass) โดยอิงตามอายุ ณ วันที่เจาะเลือดจริง
            const histRefInfo = getAgeReferenceMode(currentAnimal.birth_date, ts);
            const { min, max } = getRefRange(p, histRefInfo.mode, histRefInfo.isDog);

            html += `<td class="${res ? getScaleClass(val, min, max) : ''}">${val}</td>`; 
        });

        return `<tr class="border-b border-white/5 hover:bg-white/5">${html}</tr>`;
    }).join('');
}
```

**Key Points**:
- Uses `masterParams.map()` - iterates in PARAM_ORDER sequence
- Each row = one parameter, columns = test sessions (newest first)
- For ALP: Would be 3rd Chemistry parameter in the display

---

### 4. set-lab.html - LAB_TEMPLATES Object (Lines 198-222)

```javascript
const LAB_TEMPLATES = {
    'CBC': [
        { name: 'WBC', unit: '10^9/L', dMin: 5.05, dMax: 16.76, cMin: 2.87, cMax: 17.02 },
        { name: 'RBC', unit: '10^12/L', dMin: 5.65, dMax: 8.87, cMin: 6.54, cMax: 12.20 },
        { name: 'HGB', unit: 'g/dL', dMin: 13.1, dMax: 20.5, cMin: 9.8, cMax: 15.4 },
        { name: 'HCT', unit: '%', dMin: 37.3, dMax: 61.7, cMin: 30.3, cMax: 52.3 },
        { name: 'MCV', unit: 'fL', dMin: 61.6, dMax: 73.5, cMin: 35.9, cMax: 53.1 },
        { name: 'MCH', unit: 'pg', dMin: 21.2, dMax: 25.9, cMin: 11.8, cMax: 17.3 },
        { name: 'MCHC', unit: 'g/dL', dMin: 32.0, dMax: 37.9, cMin: 28.1, cMax: 35.8 },
        { name: 'PLT', unit: '10^9/L', dMin: 148, dMax: 484, cMin: 151, cMax: 600 }
    ],
    'Chem': [
        { name: 'ALB', unit: 'g/dL', dMin: 2.3, dMax: 4.0, cMin: 2.3, cMax: 3.9 },
        { name: 'ALKP', unit: 'U/L', dMin: 23, dMax: 212, cMin: 14, cMax: 111 },
        { name: 'ALT', unit: 'U/L', dMin: 10, dMax: 125, cMin: 12, cMax: 130 },
        { name: 'AMYL', unit: 'U/L', dMin: 500, dMax: 1500, cMin: 500, cMax: 1500 },
        { name: 'BUN', unit: 'mg/dL', dMin: 7, dMax: 27, cMin: 16, cMax: 36 },
        { name: 'CA', unit: 'mg/dL', dMin: 7.9, dMax: 12.0, cMin: 7.1, cMax: 11.5 },
        { name: 'CHOL', unit: 'mg/dL', dMin: 110, dMax: 321, cMin: 65, cMax: 225 },
        { name: 'CREA', unit: 'mg/dL', dMin: 0.5, dMax: 1.8, cMin: 0.8, cMax: 2.4 },
        { name: 'GLU', unit: 'mg/dL', dMin: 77, dMax: 125, cMin: 71, cMax: 159 },
        { name: 'PHOS', unit: 'mg/dL', dMin: 2.5, dMax: 6.8, cMin: 3.1, cMax: 7.5 },
        { name: 'TBIL', unit: 'mg/dL', dMin: 0.0, dMax: 0.9, cMin: 0.0, cMax: 0.9 },
        { name: 'TP', unit: 'g/dL', dMin: 5.2, dMax: 8.2, cMin: 5.7, cMax: 8.9 },
        { name: 'GLOB', unit: 'g/dL', dMin: 2.5, dMax: 4.5, cMin: 2.8, cMax: 5.1 },
        { name: 'NA', unit: 'mmol/L', dMin: 144, dMax: 160, cMin: 150, cMax: 165 },
        { name: 'K', unit: 'mmol/L', dMin: 3.5, dMax: 5.8, cMin: 3.5, cMax: 5.8 },
        { name: 'CL', unit: 'mmol/L', dMin: 109, dMax: 122, cMin: 112, cMax: 129 }
    ]
};
```

**Chemistry Section Analysis**:
- Template count: 16 items (different from lab.html's count!)
- **Missing from template**: ALP, AST, GGT, DBIL, IBIL, Alb/Glob, Ca, Crea, CO2, TCH, Glu, Amy, BUN/Crea, TBA, AST/ALT, P, CK
- **Extra in template**: AMYL (duplicate of Amy), PHOS (Phosphorus - like P?), NA, K, CL (electrolytes)

---

### 5. set-lab.html - loadParams() Function (Lines 260-275)

```javascript
// โหลดข้อมูลและเรียงตาม order_index จาก Database
async function loadParams() {
    const { data, error } = await db.from('mas_lab_parameters')
                                  .select('*')
                                  .order('order_index', { ascending: true });
    if (error) {
        console.error("Error loading params:", error);
        return;
    }
    allParams = data || [];
    renderList();
}
```

**Key**: Loads from database, ordered by `order_index` (ascending)

---

### 6. set-lab.html - Drag-and-Drop Reordering (Lines 307-340)

```javascript
// ฟังก์ชันเปิดใช้งานระบบ Drag & Drop
function initSortable() {
    const container = document.getElementById('param-list');
    if (sortableInstance) {
        sortableInstance.destroy();
    }
    sortableInstance = new Sortable(container, {
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'sortable-ghost',
        onEnd: async function () {
            await saveNewOrder();
        }
    });
}

// ฟังก์ชันบันทึกลำดับใหม่ลง Database เมื่อปล่อยเมาส์
async function saveNewOrder() {
    const items = document.querySelectorAll('.param-card');
    const updatePromises = [];

    items.forEach((item, index) => {
        const id = item.getAttribute('data-id');
        const paramIndex = allParams.findIndex(p => p.id == id);
        if (paramIndex !== -1) {
            allParams[paramIndex].order_index = index;
        }
        updatePromises.push(
            db.from('mas_lab_parameters').update({ order_index: index }).eq('id', id)
        );
    });

    try {
        await Promise.all(updatePromises);
        console.log("✅ บันทึกลำดับใหม่สำเร็จ");
    } catch (err) {
        console.error("❌ เกิดข้อผิดพลาดในการบันทึกลำดับ:", err);
    }
}
```

**Mechanism**:
1. Uses Sortable.js library
2. Drag handle CSS class: `.drag-handle` (☰ icon)
3. On drag end: calls `saveNewOrder()`
4. Updates database `order_index` for each parameter

---

## COMPARISON TABLE: Parameter Names

| Set-Lab Template | Lab.html PARAM_ORDER | Status |
|------------------|----------------------|--------|
| ALB | Alb | ✅ Match (case-insensitive) |
| ALKP | ALP | ❌ MISMATCH! |
| ALT | ALT | ✅ Match |
| AMYL | Amy | ❌ Different |
| BUN | BUN | ✅ Match |
| CA | Ca | ✅ Match (case-insensitive) |
| CHOL | TCH | ❌ Different names |
| CREA | Crea | ✅ Match (case-insensitive) |
| GLU | Glu | ✅ Match (case-insensitive) |
| PHOS | P | ❌ Different (PHOS vs P) |
| TBIL | TBIL | ✅ Match |
| TP | TP | ✅ Match |
| GLOB | Glob | ✅ Match (case-insensitive) |
| NA | - | ❌ Not in lab.html |
| K | - | ❌ Not in lab.html |
| CL | - | ❌ Not in lab.html |

---

## CHEMISTRY PARAMETER COMPARISON

### lab.html PARAM_ORDER - Chemistry Section (11 items)
```
Position 0:  'Alb'        (Albumin)
Position 1:  'TP'         (Total Protein)
Position 2:  'ALP'        (Alkaline Phosphatase) ⭐
Position 3:  'ALT'        (Alanine Aminotransferase)
Position 4:  'AST'        (Aspartate Aminotransferase)
Position 5:  'GGT'        (Gamma Glutamyl Transferase)
Position 6:  'DBIL'       (Direct Bilirubin)
Position 7:  'TBIL'       (Total Bilirubin)
Position 8:  'Glob'       (Globulin)
Position 9:  'IBIL'       (Indirect Bilirubin)
Position 10: 'Alb/Glob'   (Albumin/Globulin Ratio)
Position 11: 'Ca'         (Calcium)
Position 12: 'Crea'       (Creatinine)
Position 13: 'CO2'        (Carbon Dioxide)
Position 14: 'TCH'        (Total Cholesterol)
Position 15: 'Glu'        (Glucose)
Position 16: 'BUN'        (Blood Urea Nitrogen)
Position 17: 'Amy'        (Amylase)
Position 18: 'BUN/Crea'   (BUN/Creatinine Ratio)
Position 19: 'TBA'        (Total Bile Acid)
Position 20: 'AST/ALT'    (AST/ALT Ratio)
Position 21: 'P'          (Phosphorus)
Position 22: 'CK'         (Creatine Kinase)
```

### set-lab.html LAB_TEMPLATES['Chem'] - Chemistry Section (16 items)
```
Position 0:  'ALB'   (Albumin)
Position 1:  'ALKP'  (Alkaline Phosphatase) ⭐ DIFFERENT NAME!
Position 2:  'ALT'   (Alanine Aminotransferase)
Position 3:  'AMYL'  (Amylase) - different from Amy
Position 4:  'BUN'   (Blood Urea Nitrogen)
Position 5:  'CA'    (Calcium)
Position 6:  'CHOL'  (Cholesterol)
Position 7:  'CREA'  (Creatinine)
Position 8:  'GLU'   (Glucose)
Position 9:  'PHOS'  (Phosphorus) - different from P
Position 10: 'TBIL'  (Total Bilirubin)
Position 11: 'TP'    (Total Protein)
Position 12: 'GLOB'  (Globulin)
Position 13: 'NA'    (Sodium)
Position 14: 'K'     (Potassium)
Position 15: 'CL'    (Chloride)
```

---

## ORDERING ISSUE SUMMARY

### Problem 1: Different Parameter Names
- lab.html uses: `ALP`
- set-lab.html template provides: `ALKP`

When a user creates a parameter named `ALKP` in set-lab.html:
1. In set-lab.html: appears in position based on `order_index`
2. In lab.html: `ALKP` doesn't match `ALP` → gets sorted to index 999 (bottom)

### Problem 2: Decoupled Ordering Systems
- **lab.html**: Uses hardcoded PARAM_ORDER array (lines 279-287)
- **set-lab.html**: Uses database order_index field

If admin reorders parameters via set-lab.html drag-and-drop:
- ✅ Changes apply to set-lab.html parameter list
- ❌ lab.html still uses original PARAM_ORDER - NO CHANGE

### Problem 3: Missing Parameters
Set-lab.html template doesn't include:
- AST, GGT, DBIL, IBIL, Alb/Glob, CO2, Amy, BUN/Crea, TBA, AST/ALT, CK

These would need to be manually added and ordered in database.

---

## CURRENT BEHAVIOR

### When displaying Comparative Trends in lab.html:
1. Parameters displayed in EXACT PARAM_ORDER sequence
2. ALP appears as 3rd Chemistry parameter (after Alb, TP)
3. Parameters not in PARAM_ORDER appear at bottom

### When managing parameters in set-lab.html:
1. Parameters displayed in database order_index sequence
2. Can be reordered via drag-and-drop
3. Changes saved to `mas_lab_parameters.order_index` field
4. But lab.html ignores this - uses PARAM_ORDER

---

## RECOMMENDED FIXES

**Option 1**: Update lab.html to use database order_index
- Replace PARAM_ORDER sorting with database query sorted by order_index
- Align with set-lab.html's drag-and-drop changes

**Option 2**: Standardize parameter names
- Change set-lab.html ALKP → ALP
- Ensure case consistency (ALP or Alp)

**Option 3**: Sync the two systems
- Update PARAM_ORDER to match actual database parameters
- OR ensure all parameters in templates appear in PARAM_ORDER

