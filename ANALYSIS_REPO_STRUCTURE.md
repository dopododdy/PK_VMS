# PK-VMS Repository Analysis

## 1. DIRECTORY STRUCTURE

### Top-Level Files (Root Directory)
```
/home/runner/work/PK_VMS/PK_VMS/
├── .env.example
├── .git/ (git repository)
├── .gitignore
├── README.md
├── TTB.png
├── animals.html
├── documents.html
├── index.html
├── lab.html (98.1 KB, 1243 lines) ⭐
├── mascat.html
├── master_data.html
├── medrec.html
├── migration.sql
├── patient-detail.html
├── patient.html
├── pos.html
├── rx.html
├── set-db.html
├── set-lab.html (27.3 KB, 457 lines) ⭐
├── set-printer.html
├── set-uiux.html
├── settings.html
├── supabase-config.js
├── surgery-status.html
├── tools.html
└── ui-settings.js
```

### Key JavaScript Files
- `ui-settings.js` - UI/UX settings and shared utilities
- `supabase-config.js` - Database configuration

**Note**: This is a flat-file architecture with no separate src/ or components/ directories. All HTML and JavaScript are in the root.

---

## 2. FILE: lab.html

**Size**: 98.1 KB | **Lines**: 1243 | **Purpose**: Lab & Imaging test results entry and comparison

### Critical Arrays for Test Parameter Ordering

#### PARAM_ORDER Array (Lines 279-287)
This array defines the EXACT ORDER in which parameters are displayed in lab.html:

```javascript
const PARAM_ORDER = [
    // CBC (Complete Blood Count)
    'WBC', 'Lym#', 'Mid#', 'Gran#', 'Lym%', 'Mid%', 'Gran%', 'NLR', 'PLR',
    'RBC', 'HGB', 'HCT', 'MCV', 'MCH', 'MCHC', 'RDW-CV', 'RDW-SD',
    'PLT', 'MPV', 'PDW-CV', 'PDW-SD', 'PCT', 'P-LCC', 'P-LCR',
    // Chemistry
    'Alb', 'TP', 'ALP', 'ALT', 'AST', 'GGT', 'DBIL', 'TBIL', 'Glob', 'IBIL', 'Alb/Glob',
    'Ca', 'Crea', 'CO2', 'TCH', 'Glu', 'BUN', 'Amy', 'BUN/Crea', 'TBA', 'AST/ALT', 'P', 'CK'
];
```

**Key Points**:
- **ALP Position**: 3rd item in Chemistry section (after 'Alb', 'TP')
- **Index Position**: Position 23 (0-based) in the complete array
- This array is case-INSENSITIVE when sorting (converts to uppercase for comparison)

#### How PARAM_ORDER is Used (Lines 293-314)

```javascript
async function fetchMasterParams() { 
    const { data } = await db.from('mas_lab_parameters').select('*'); 
    let fetchedData = data || [];
    
    // Convert PARAM_ORDER to uppercase for case-insensitive comparison
    const upperParamOrder = PARAM_ORDER.map(p => p.toUpperCase());
    
    // Sort database parameters according to PARAM_ORDER
    fetchedData.sort((a, b) => {
        let indexA = upperParamOrder.indexOf(a.parameter_name.toUpperCase());
        let indexB = upperParamOrder.indexOf(b.parameter_name.toUpperCase());
        
        // Parameters not in list get pushed to bottom (999)
        if (indexA === -1) indexA = 999;
        if (indexB === -1) indexB = 999;
        
        return indexA - indexB;
    });

    masterParams = fetchedData; 
}
```

### Tabs in lab.html (Line 113)
```html
<div class="lab-tab active" id="tab-input">➕ ผลเลือด (Input)</div>
<div class="lab-tab" id="tab-trends">📊 Comparative Trends</div>
```

### Comparative Trends Display (Lines 452-490)

**Function**: `renderTrendTable()` (Line 452)

This function displays blood test results in a tabular format with:
- **3 Sticky Columns** (frozen on left):
  1. Parameter (column width: 180px)
  2. Unit (column width: varies)
  3. Reference (current age-based reference range)
  
- **Data Columns**: One per test session, sorted by date (newest first)

**Key Ordering Behavior**:
```javascript
function renderTrendTable() {
    const sessions = {}; 
    // Group results by test session (created_at)
    labHistory.forEach(r => { 
        if(!sessions[r.created_at]) sessions[r.created_at] = {}; 
        sessions[r.created_at][r.parameter_name] = r; 
    });
    
    // Sort sessions by date (newest first)
    const sortedTs = Object.keys(sessions).sort((a,b) => new Date(b) - new Date(a));
    
    // Build body rows using masterParams order (which uses PARAM_ORDER)
    document.getElementById('trend-body').innerHTML = masterParams.map(p => {
        // masterParams already sorted according to PARAM_ORDER
        // Each row displays one parameter across all test sessions
        ...
    }).join('');
}
```

**Important**: The parameter ordering in Comparative Trends comes from `masterParams`, which is sorted by `PARAM_ORDER`.

---

## 3. FILE: set-lab.html

**Size**: 27.3 KB | **Lines**: 457 | **Purpose**: Master data setup for lab parameters (CBC & Chemistry)

### Critical Arrays for Test Parameter Ordering

#### LAB_TEMPLATES Object (Lines 198-222)
This defines PRE-POPULATED reference ranges for common parameters:

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
        { name: 'ALKP', unit: 'U/L', dMin: 23, dMax: 212, cMin: 14, cMax: 111 },  // Note: ALKP not ALP
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

**Key Points**:
- These are TEMPLATES (Quick Select buttons)
- Order: NOT based on PARAM_ORDER
- **Template Chemistry Order** (for 'Chem' tab):
  1. ALB, ALKP, ALT, AMYL, BUN, CA, CHOL, CREA, GLU, PHOS, TBIL, TP, GLOB, NA, K, CL
  2. **ALKP (not ALP)** is 2nd in Chemistry template

### Database Query & Ordering (Line 262-264)
```javascript
async function loadParams() {
    const { data, error } = await db.from('mas_lab_parameters')
                                  .select('*')
                                  .order('order_index', { ascending: true });
    // ...
    allParams = data || [];
    renderList();
}
```

**Key Point**: set-lab.html loads parameters ordered by `order_index` from the database, NOT by a hardcoded array.

### Drag-and-Drop Reordering (Lines 309-329)
```javascript
function initSortable() {
    const container = document.getElementById('param-list');
    if (sortableInstance) sortableInstance.destroy();
    
    sortableInstance = new Sortable(container, {
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'sortable-ghost',
        onEnd: async function () {
            await saveNewOrder();  // Saves new order_index to database
        }
    });
}

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

**Important**: Users can drag-and-drop to reorder parameters in set-lab.html, and this updates the database `order_index` field.

---

## 4. KEY DIFFERENCES: lab.html vs set-lab.html

| Aspect | lab.html | set-lab.html |
|--------|----------|-------------|
| **Purpose** | Display/enter blood test results | Configure master parameters |
| **Parameter Ordering** | Uses hardcoded `PARAM_ORDER` array | Uses database `order_index` field |
| **Ordering Method** | Fixed code-level array | Drag-and-drop reorderable via Sortable.js |
| **ALP/ALKP** | ALP (in PARAM_ORDER array) | ALKP (in LAB_TEMPLATES) |
| **Templates** | None (display templates) | LAB_TEMPLATES for quick reference setup |
| **Database Query** | `mas_lab_parameters` (sorted by PARAM_ORDER) | `mas_lab_parameters` (sorted by `order_index`) |
| **Tabs** | Input, Comparative Trends | CBC, Chemistry |

---

## 5. ALP PARAMETER DETAILS

### In lab.html
- **Parameter Name**: `ALP` (case-insensitive, matches 'ALP')
- **Position in PARAM_ORDER**: Index 23 (3rd in Chemistry section)
- **Chemistry Section Order** (lab.html):
  ```
  'Alb', 'TP', 'ALP', 'ALT', 'AST', 'GGT', ...
  ```

### In set-lab.html
- **Parameter Name**: `ALKP` (not `ALP`)
- **Position in LAB_TEMPLATES['Chem']**: Index 1 (2nd in template)
- **Chemistry Template Order**:
  ```
  'ALB', 'ALKP', 'ALT', 'AMYL', 'BUN', ...
  ```

### Critical Mismatch ⚠️
- **lab.html expects**: `ALP`
- **set-lab.html template provides**: `ALKP`

If a parameter is created in set-lab.html with name `ALKP`, it won't match the `ALP` in lab.html's PARAM_ORDER, and will be sorted to the bottom (index 999).

---

## 6. BLOOD TEST RESULTS (ผลเลือด) ORDERING

### In lab.html - Comparative Trends Tab
Parameters are displayed in **exactly** this order:

**CBC Section** (14 items):
```
WBC, Lym#, Mid#, Gran#, Lym%, Mid%, Gran%, NLR, PLR,
RBC, HGB, HCT, MCV, MCH, MCHC, RDW-CV, RDW-SD,
PLT, MPV, PDW-CV, PDW-SD, PCT, P-LCC, P-LCR
```

**Chemistry Section** (12 items):
```
Alb, TP, ALP, ALT, AST, GGT, DBIL, TBIL, Glob, IBIL, Alb/Glob,
Ca, Crea, CO2, TCH, Glu, BUN, Amy, BUN/Crea, TBA, AST/ALT, P, CK
```

### In set-lab.html - Parameter List
Parameters are ordered by dragging in UI, saved as `order_index` in database.

Initial templates show them in this order for Chemistry:
```
ALB, ALKP, ALT, AMYL, BUN, CA, CHOL, CREA, GLU, PHOS, TBIL, TP, GLOB, NA, K, CL
```

---

## 7. TECHNICAL FLOW

### When user views blood tests in lab.html:
1. Click on animal to load it
2. Click "Comparative Trends" tab
3. `fetchLabHistory()` loads all lab results from database
4. `renderTrendTable()` uses `masterParams` (already sorted by PARAM_ORDER)
5. Displays parameters in PARAM_ORDER sequence

### When admin configures parameters in set-lab.html:
1. `loadParams()` queries database ordered by `order_index`
2. Users can drag-and-drop to reorder
3. `saveNewOrder()` updates `order_index` in database
4. These changes affect display order in set-lab.html's list view
5. BUT: lab.html still uses hardcoded PARAM_ORDER

---

## 8. POTENTIAL ISSUE

**set-lab.html ordering does NOT automatically affect lab.html ordering.**

- lab.html uses a hardcoded `PARAM_ORDER` array (fixed in code)
- set-lab.html updates database `order_index` field (user-configurable)
- These two systems are DECOUPLED

To make lab.html respect set-lab.html's ordering:
1. lab.html would need to load `order_index` from database instead of using hardcoded PARAM_ORDER
2. OR set-lab.html would need to update PARAM_ORDER (but it can't - it's hardcoded)

