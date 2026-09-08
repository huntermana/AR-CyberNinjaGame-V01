# 🎨 Cyber Ninja: AI Asset Generation & Prompt Catalog
คู่มือการสร้างและอัปเดตไฟล์ภาพและเสียงด้วย AI (Prompt Catalog & Asset Sync Guide)

เอกสารนี้รวบรวม Prompt มาตรฐานในสไตล์ธีม **Cyberpunk Neon Sci-Fi** สำหรับนำไปใช้กับ AI เช่น **Nano Banana (Google Gemini Image)**, Midjourney, DALL-E, Suno AI, หรือ Udio เพื่อให้คุณครูและผู้ดูแลสามารถสร้างภาพหรือเสียงใหม่ๆ เข้ามาแทนที่ในเกมได้อย่างกลมกลืน

---

## 📁 โครงสร้างโฟลเดอร์สำหรับใส่ไฟล์ (Asset Folder Structure)

```
ICT Game 2/
├── assets/
│   ├── images/              <-- โฟลเดอร์รูปภาพ (JPG, PNG, WebP, SVG)
│   │   ├── tutorial_gesture_slash.jpg   [ภาพคู่มือ: ชี้ 1 นิ้วฟัน พร้อมจุดแทร็คสีแดง]
│   │   ├── tutorial_gesture_catch.jpg   [ภาพคู่มือ: กาง 5 นิ้วรับ พร้อมโล่สนามพลัง]
│   │   ├── cyber_boss_monster.jpg       [ภาพบอสมอนสเตอร์ในโหมด 3]
│   │   ├── ultimate_attack_icon.png     [ภาพไอคอนท่าไม้ตาย (หรือ .svg)]
│   │   ├── malware_trojan.jpg           [ภาพม้าโทรจัน]
│   │   └── malware_ransomware.jpg       [ภาพแรนซัมแวร์]
│   ├── audio/               <-- โฟลเดอร์ไฟล์เสียงเพลงและเอฟเฟกต์ (MP3, OGG, WAV)
│   │   ├── bgm_mode1.mp3                [เพลงโหมด 1: Team Score Attack]
│   │   ├── bgm_mode2.mp3                [เพลงโหมด 2: 1v1 Split Duel]
│   │   ├── bgm_mode3.mp3                [เพลงโหมด 3: Co-op Boss Fight]
│   │   └── sfx_ultimate.mp3             [เสียงระเบิดท่าไม้ตายสุดกระหึ่ม]
│   └── prompts/
│       └── README_PROMPTS.md            [เอกสารนี้]
```

> **🛡️ ระบบ Asset Manager & Fallback:**  
> ระบบเกมมี **Asset Manager (`js/asset-manager.js`)** ทำงานอยู่เบื้องหลัง หากคุณใส่ไฟล์ภาพหรือเสียงใหม่เข้าไป เกมจะโหลดมาใช้ทันที แต่หากไฟล์ใดหายไป เสีย หรือพิมพ์ชื่อผิด เกมจะสลับไปใช้ภาพ/เสียงสังเคราะห์ดิจิทัลอัตโนมัติ 100% ทำให้เกม **ไม่เกิดหน้าจอดำ หรือ Error ค้างเด็ดขาด!**

---

## 🖼️ 1. รายการ Prompt สำหรับสร้างภาพ (Image Prompts)

### 1.1 ท่าที่ 1: ชี้ 1 นิ้วฟันมัลแวร์ (1-Finger Knife Blade)
- **ชื่อไฟล์:** `assets/images/tutorial_gesture_slash.jpg` (หรือ `.png`)
- **สัดส่วนที่แนะนำ:** 16:9 (Landscape)
- **Prompt:**
```text
High quality cyberpunk digital illustration from a first-person perspective of a futuristic cyber ninja hand. The index finger is extended straight pointing forward like a sleek laser knife, with an intense glowing red laser tracking dot clearly positioned on the index fingertip. The other three fingers (middle, ring, pinky) are curled smoothly into the palm. A neon cyan laser blade trail slices across the screen, cleanly cutting a holographic red malware virus bug in half with digital sparks. Glowing cyan and dark blue sci-fi HUD elements and digital grid in the background, sharp crisp lighting, highly detailed, 8k resolution.
```

### 1.2 ท่าที่ 2: กาง 5 นิ้วรับข้อมูลปลอดภัย (5-Finger Open Shield)
- **ชื่อไฟล์:** `assets/images/tutorial_gesture_catch.jpg` (หรือ `.png`)
- **สัดส่วนที่แนะนำ:** 16:9 (Landscape)
- **Prompt:**
```text
High quality cyberpunk digital illustration from a first-person perspective of a futuristic cyber ninja hand. The hand is held upright with all five fingers spread open, with the open palm facing directly forward toward the camera viewer in a clear STOP / High-Five greeting gesture. Surrounding the open palm is a glowing translucent cyan and gold rotating hexagonal energy containment shield, safely catching and receiving a floating holographic golden SSL encryption key capsule. Sparkling gold and light blue data particles swirling peacefully into the palm, high-tech server room background with blue neon lights, clean and sharp lighting, cinematic masterpiece.
```

### 1.3 ชุดภาพบอสมอนสเตอร์ 5 ระดับความยาก โหมด 3 (Mode 3 Boss Progression Catalog)
- **ระดับ 1 (Novice):** `assets/images/boss_level1.jpg` -> **Matrix Worm Core (เวิร์มไวรัสดิจิทัล)** โทนแสงสีเขียวนีออน Matrix Code
- **ระดับ 2 (Experienced):** `assets/images/boss_level2.jpg` (หรือ `cyber_boss_monster.jpg`) -> **Apocalypse Daemon (ปีศาจไซเบอร์)** โทนแสงสีแดง Crimson ทรงพลัง
- **ระดับ 3 (Skilled):** `assets/images/boss_level3.jpg` -> **Quantum Spider Overlord (พญาแมงมุมควอนตัม)** โทนแสงสีม่วง Quantum Violet
- **ระดับ 4 (Expert):** `assets/images/boss_level4.jpg` -> **Neon Hydra Leviathan (มังกรไฮดราเลเวียธาน)** โทนแสงสีฟ้าคราม Cyan Cryo-Plasma
- **ระดับ 5 (Blade Master):** `assets/images/boss_level5.jpg` -> **Zero-Day Sovereign (จอมราชันย์ซีโร่เดย์ - ยากสุด)** โทนแสงสีทองสุริยะ Solar Gold & Ruby

- **Prompt มาตรฐานสำหรับบอส (Mode 3 Boss):**
```text
Epic wide composition of a terrifying cyberpunk rogue AI boss monster looming menacingly from the top of the frame looking down at the viewer in a server room. It features a massive cybernetic mechanical dragon-demon core with glowing optic eyes, exposed pulsing glowing energy reactors, sprawling dark metallic cable tentacles, corrupted glitched digital wires, and sparking electricity arcs. Menacing, high-contrast, dark dystopian cyberpunk server room atmosphere, cinematic masterpiece, hyper-detailed, 8k resolution.
```

### 1.4 ไอคอนท่าไม้ตายไซเบอร์ (Ultimate Attack Icon)
- **ชื่อไฟล์:** `assets/images/ultimate_attack_icon.png` (หรือ `.svg`)
- **สัดส่วนที่แนะนำ:** 1:1 (Square)
- **Prompt:**
```text
Futuristic cyberpunk ultimate ability icon emblem. Centered glowing golden-cyan and magenta plasma overdrive energy sphere surrounded by eight sharp holographic cyber ninja shuriken blades and glowing neon circuit rings. Intense electrical lightning arcs and radiant energy sparks bursting outwards. Clean, high contrast video game ultimate attack button icon, dark futuristic tech border, transparent or dark background, ultra sharp, glossy glowing bloom.
```

---

## 🎵 2. รายการ Prompt สำหรับสร้างเสียงและเพลง (Audio Prompts)
*(แนะนำใช้กับ Suno AI, Udio, หรือ MusicFX)*

### 2.1 เพลงโหมด 1: Team Score Attack (สนุกสนาน เล่นเพลิน)
- **ชื่อไฟล์:** `assets/audio/bgm_mode1.mp3`
- **สไตล์ / แท็ก:** `Cyberpunk, Synthwave, 128 BPM, Upbeat, Fun, Retro-futuristic, Arpeggiated bass, Melodic electronic synth, 80s arcade, Groovy drums, Instrumental`
- **ความรู้สึก:** จังหวะสนุก ชวนโยกตาม เล่นเดี่ยวสบายๆ มีพลังบวก

### 2.2 เพลงโหมด 2: 1v1 Split Duel (ดุเดือด แข่งขัน)
- **ชื่อไฟล์:** `assets/audio/bgm_mode2.mp3`
- **สไตล์ / แท็ก:** `Darksynth, Cyberpunk Combat, 140 BPM, Aggressive, Fast-paced, Heavy industrial bass, High energy, Glitch beats, Adrenaline rush, Competitive fighting game theme, Instrumental`
- **ความรู้สึก:** ตื่นเต้น เร้าใจ หัวใจเต้นแรง เหมาะกับการดวลตัดเชือกตัวต่อตัว

### 2.3 เพลงโหมด 3: Co-op Boss Fight (มหากาพย์ สู้บอสยักษ์)
- **ชื่อไฟล์:** `assets/audio/bgm_mode3.mp3`
- **สไตล์ / แท็ก:** `Epic Orchestral Cyberpunk, 130 BPM, Heavy brass, Menacing choir chants, Giant robotic stomps, Huge cinematic sub-bass drops, Apocalyptic final boss battle, Dark sci-fi, Intense climax, Instrumental`
- **ความรู้สึก:** ตื่นตาตื่นใจ ยิ่งใหญ่ ลุ้นระทึก รวมพลังกันสู้บอสใหญ่

### 2.4 เสียงเอฟเฟกต์ท่าไม้ตาย (Ultimate Blast SFX)
- **ชื่อไฟล์:** `assets/audio/sfx_ultimate.mp3`
- **สไตล์ / แท็ก:** `Massive laser cannon charging sound up to high pitch, followed by a colossal bass earthquake detonation explosion, cosmic electric shockwave, shattered digital glass reverb`

---

## 🔄 วิธีการอัปเดตไฟล์เข้าสู่เกม (How to Update)
1. นำไฟล์ภาพหรือเสียงที่สร้างขึ้น มาวางในโฟลเดอร์ `assets/images/` หรือ `assets/audio/`
2. ตั้งชื่อไฟล์ให้ตรงกับตารางด้านบน (เช่น `cyber_boss_monster.jpg` หรือ `bgm_mode1.mp3`)
3. เปิดเกม หรือรีเฟรชหน้าเว็บ เกมจะตรวจจับและสลับไปใช้ไฟล์ใหม่ของคุณทันที!
