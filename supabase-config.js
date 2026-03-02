/* ═══════════════════════════════════════════
   PK-VMS : SUPABASE CONFIGURATION
   ไฟล์เชื่อมต่อฐานข้อมูล Cloud
   ═══════════════════════════════════════════ */

// 1. กำหนดค่าการเชื่อมต่อ (โปรเจกต์ของคุณ)
const supabaseUrl = 'https://yikofsvxtzvzhzuxyqvm.supabase.co'; 
const supabaseKey = 'sb_publishable_ElfQ09_Ldo0HsGdVSEhmow_vOJEZ8_X';

// 2. ตรวจสอบว่ามี Library ของ Supabase โหลดมาหรือยัง
if (typeof supabase === 'undefined') {
    console.error('Error: ไม่พบ Supabase Library! กรุณาใส่ <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> ในหน้า HTML');
}

// 3. สร้างตัวแปร Client สำหรับติดต่อฐานข้อมูล
const db = supabase.createClient(supabaseUrl, supabaseKey);

// 4. ส่งออกตัวแปร db ให้ไฟล์อื่นใช้งานได้ผ่านคำว่า window.db
window.db = db;

console.log('✅ PK-VMS: เชื่อมต่อ Supabase Cloud สำเร็จ');
