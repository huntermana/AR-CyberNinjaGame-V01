// Cyber Ninja: Firewall Slasher - Game Configuration & Database

export const CONFIG = {
  CANVAS_WIDTH: 1280,
  CANVAS_HEIGHT: 720,
  TARGET_FPS: 60,
  
  // Tracking settings
  SLASH_VELOCITY_THRESHOLD: 520,    // Pixels per second for slash action (when in Knife Hand mode)
  CATCH_VELOCITY_MAX: 9999,         // Unlimited speed for open-palm catch (reaching fast never disables catch!)
  PALM_CATCH_RADIUS: 110,           // Generous pixel radius around palm center for magnetic pull
  OPEN_PALM_MIN_SPREAD: 0.26,       // Normalized fingertip spread ratio for Open Palm
  KNIFE_HAND_MAX_SPREAD: 0.32,      // Normalized fingertip spread ratio for Knife Hand (fingers together)
  HOVER_TRIGGER_TIME: 450,          // Milliseconds to trigger mid-air button/pod
  
  // Scoring
  COMBO_TIMEOUT: 2000,              // Milliseconds to maintain combo
  COMBO_MULTIPLIERS: [1, 1.5, 2, 3, 5],
  
  // Modes settings
  SCORE_ATTACK_DURATION: 60,        // Seconds
  RELAY_RUNNER_DURATION: 15,        // Seconds per runner
  RELAY_KEYS_REQUIRED: 10,          // SSL Keys to win
  
  // Camp Teams
  TEAMS: [
    { id: 'alpha', nameTH: 'ทีม Alpha (Cyber Falcon)', nameEN: 'Team Alpha (Cyber Falcon)', color: '#00e5ff' },
    { id: 'beta', nameTH: 'ทีม Beta (Quantum Tiger)', nameEN: 'Team Beta (Quantum Tiger)', color: '#ff2a5f' },
    { id: 'gamma', nameTH: 'ทีม Gamma (Neon Viper)', nameEN: 'Team Gamma (Neon Viper)', color: '#00ff66' },
    { id: 'delta', nameTH: 'ทีม Delta (Solar Phoenix)', nameEN: 'Team Delta (Solar Phoenix)', color: '#ffb703' }
  ]
};

// 5 Difficulty Levels for Mode 1 and Mode 3
export const DIFFICULTY_LEVELS = [
  { id: 'novice', level: 1, nameTH: 'มือใหม่ (Novice)', nameEN: 'Novice', speedMult: 0.75, spawnIntervalMult: 1.3, safeRatio: 0.45, bossHpMult: 0.7 },
  { id: 'experienced', level: 2, nameTH: 'ผู้เล่นมีประสบการณ์ (Experienced)', nameEN: 'Experienced', speedMult: 1.0, spawnIntervalMult: 1.0, safeRatio: 0.35, bossHpMult: 1.0 },
  { id: 'skilled', level: 3, nameTH: 'ผู้เล่นที่มีทักษะ (Skilled)', nameEN: 'Skilled', speedMult: 1.25, spawnIntervalMult: 0.85, safeRatio: 0.30, bossHpMult: 1.25 },
  { id: 'expert', level: 4, nameTH: 'ผู้เล่นระดับชำนาญ (Expert)', nameEN: 'Expert', speedMult: 1.5, spawnIntervalMult: 0.7, safeRatio: 0.25, bossHpMult: 1.5 },
  { id: 'master', level: 5, nameTH: 'เทพกระบี่ (Blade Master - ยากสุด)', nameEN: 'Blade Master (Hardest)', speedMult: 1.85, spawnIntervalMult: 0.55, safeRatio: 0.20, bossHpMult: 1.85 }
];

// Malware Threat Database (Slashed = +Score)
export const MALWARE_TYPES = [
  {
    id: 'trojan',
    nameTH: 'ม้าโทรจัน (Trojan)',
    nameEN: 'Trojan Horse',
    descTH: 'แฝงตัวเป็นไฟล์ปลอดภัย เพื่อเปิดประตูหลังขโมยข้อมูล!',
    descEN: 'Disguised as safe file to create backdoors and steal data!',
    image: 'assets/images/malware_trojan.jpg',
    points: 100,
    speed: 240,
    radius: 54,
    color: '#ff0055'
  },
  {
    id: 'ransomware',
    nameTH: 'แรนซัมแวร์ (Ransomware)',
    nameEN: 'Ransomware',
    descTH: 'เข้ารหัสไฟล์สำคัญเพื่อกรรโชกทรัพย์!',
    descEN: 'Encrypts critical files and demands ransom payout!',
    image: 'assets/images/malware_ransomware.jpg',
    points: 150,
    speed: 210,
    radius: 54,
    color: '#ff3b00'
  },
  {
    id: 'phishing',
    nameTH: 'อีเมลฟิชชิ่ง (Phishing)',
    nameEN: 'Phishing Hook',
    descTH: 'เมลปลอมล่อลวงให้กรอกรหัสผ่านและข้อมูลลับ!',
    descEN: 'Fraudulent email baiting for credentials and secret data!',
    image: 'assets/images/malware_phishing.svg',
    points: 120,
    speed: 260,
    radius: 50,
    color: '#c026d3'
  },
  {
    id: 'spyware',
    nameTH: 'สปายแวร์ (Spyware)',
    nameEN: 'Spyware Eye',
    descTH: 'แอบดักจับการพิมพ์แป้นและส่งข้อมูลกลับให้แฮกเกอร์!',
    descEN: 'Silently logs keystrokes and transmits data to attackers!',
    image: 'assets/images/malware_spyware.svg',
    points: 110,
    speed: 250,
    radius: 50,
    color: '#7c3aed'
  },
  {
    id: 'worm',
    nameTH: 'เน็ตเวิร์กเวิร์ม (Worm)',
    nameEN: 'Network Worm',
    descTH: 'แพร่พันธุ์ข้ามระบบเครือข่ายอัตโนมัติ!',
    descEN: 'Self-replicating malware multiplying through school networks!',
    image: 'assets/images/malware_worm.svg',
    points: 130,
    speed: 280,
    radius: 48,
    color: '#10b981'
  },
  {
    id: 'ddos',
    nameTH: 'บ็อตเน็ต DDoS (DDoS Bot)',
    nameEN: 'DDoS Botnet',
    descTH: 'ยิงทราฟฟิกถล่มเซิร์ฟเวอร์จนระบบล่ม!',
    descEN: 'Floods server ports with dummy traffic to bring systems down!',
    image: 'assets/images/malware_ddos.svg',
    points: 90,
    speed: 300,
    radius: 48,
    color: '#ef4444'
  }
];

// Safe Data Packets Database (Catch = +Score/HP, Slash = PENALTY!)
export const SAFE_PACKET_TYPES = [
  {
    id: 'ssl_key',
    nameTH: 'กุญแจเข้ารหัส SSL/TLS',
    nameEN: 'SSL/TLS Cipher Key',
    descTH: 'เข้ารหัสการสื่อสาร ปลอดภัย 100% (แบมือรับ ห้ามฟัน!)',
    descEN: 'Encrypts communications 100% safe (Catch it, do NOT slash!)',
    image: 'assets/images/item_ssl_key.svg',
    points: 200,
    serverHpBonus: 15,
    penaltyPoints: 100,
    speed: 180,
    radius: 52,
    color: '#ffb703'
  },
  {
    id: 'firewall_shield',
    nameTH: 'โล่ไฟร์วอลล์ (Firewall)',
    nameEN: 'Firewall Shield',
    descTH: 'คัดกรองทราฟฟิก เพิ่มพลังป้องกันเซิร์ฟเวอร์ (แบมือรับ!)',
    descEN: 'Filters incoming traffic & recharges server defenses (Catch it!)',
    image: 'assets/images/item_firewall_shield.svg',
    points: 180,
    serverHpBonus: 25,
    penaltyPoints: 80,
    speed: 190,
    radius: 52,
    color: '#00f3ff'
  },
  {
    id: 'backup_capsule',
    nameTH: 'ไฟล์สำรองข้อมูล (Data Backup)',
    nameEN: 'Data Backup Capsule',
    descTH: 'แคปซูลข้อมูลสำรอง กู้คืนไฟล์ยามวิกฤต (แบมือรับ!)',
    descEN: 'Redundant storage capsule for rapid disaster recovery (Catch it!)',
    image: 'assets/images/item_backup_capsule.svg',
    points: 150,
    serverHpBonus: 20,
    penaltyPoints: 60,
    speed: 170,
    radius: 50,
    color: '#3b82f6'
  }
];

// Cybersecurity Situational Quiz Database (Floating Choice A or B)
export const QUIZ_DATABASE = [
  {
    id: 'q1',
    questionTH: 'ได้รับอีเมลแจ้งว่า "คุณถูกรางวัล 1 ล้านบาท! คลิกที่นี่เพื่อรับเงินทันที"',
    questionEN: 'Received an email: "You won $1,000,000! Click here immediately to claim"',
    optionA: {
      textTH: 'ลบอีเมลทิ้ง / รายงานเป็นฟิชชิ่ง',
      textEN: 'Delete email & report phishing',
      isCorrect: true
    },
    optionB: {
      textTH: 'รีบคลิกลิงก์และกรอกเลขบัญชี',
      textEN: 'Click link & enter bank details',
      isCorrect: false
    },
    tipTH: 'อย่าคลิกลิงก์จากผู้ส่งที่ไม่น่าไว้ใจ มักเป็นอุบายฟิชชิ่งขโมยรหัสผ่าน!',
    tipEN: 'Never click suspicious links; they are phishing baits stealing passwords!'
  },
  {
    id: 'q2',
    questionTH: 'วิธีป้องกันความเสียหายจากมัลแวร์เรียกค่าไถ่ (Ransomware) ที่ดีที่สุดคือ?',
    questionEN: 'Best strategy to protect against Ransomware data disaster?',
    optionA: {
      textTH: 'สำรองข้อมูล (Backup) สม่ำเสมอ',
      textEN: 'Regular Backups on Cloud/Drive',
      isCorrect: true
    },
    optionB: {
      textTH: 'ยอมโอนเงินค่าไถ่ทันที',
      textEN: 'Pay ransom demanded immediately',
      isCorrect: false
    },
    tipTH: 'การสำรองข้อมูลแบบออฟไลน์หรือคลาวด์ช่วยให้กู้คืนระบบได้โดยไม่ต้องจ่ายค่าไถ่!',
    tipEN: 'Routine backups guarantee data recovery without bowing to extortion!'
  },
  {
    id: 'q3',
    questionTH: 'การตั้งรหัสผ่าน (Password) ที่ปลอดภัยสูงสุด ควรปฏิบัติอย่างไร?',
    questionEN: 'What makes the most secure & robust password?',
    optionA: {
      textTH: 'ยาวเกิน 12 ตัว มีพิมพ์ใหญ่/เล็ก/เลข/สัญลักษณ์',
      textEN: '12+ chars with upper/lower/numbers/symbols',
      isCorrect: true
    },
    optionB: {
      textTH: 'ใช้วันเกิดหรือ 123456 เพื่อจะได้จำง่าย',
      textEN: 'Use birthday or 123456 for easy recall',
      isCorrect: false
    },
    tipTH: 'รหัสผ่านที่ซับซ้อนและยาวป้องกันการถูกสุ่มแฮกด้วย Brute-Force ได้อย่างดี!',
    tipEN: 'Complex passphrases defeat automated brute-force password cracking!'
  },
  {
    id: 'q4',
    questionTH: 'เมื่อเชื่อมต่อ Wi-Fi สาธารณะตามร้านกาแฟที่ไม่มีรหัสผ่าน ควรหลีกเลี่ยงสิ่งใด?',
    questionEN: 'What must you avoid while on public unencrypted Wi-Fi hotspots?',
    optionA: {
      textTH: 'ทำธุรกรรมการเงิน / ช้อปปิ้งออนไลน์',
      textEN: 'Online banking & entering card data',
      isCorrect: true
    },
    optionB: {
      textTH: 'ค้นหาข้อมูลทั่วไปบนเสิร์ชเอนจิน',
      textEN: 'Reading general articles on search engines',
      isCorrect: false
    },
    tipTH: 'Wi-Fi สาธารณะอาจมีคนดักจับแพ็กเก็ตข้อมูลลับ (Man-in-the-Middle) ได้!',
    tipEN: 'Unsecured public Wi-Fi is vulnerable to Man-in-the-Middle eavesdropping!'
  },
  {
    id: 'q5',
    questionTH: 'การเปิดใช้งาน 2-Factor Authentication (2FA) ให้ประโยชน์อย่างไร?',
    questionEN: 'What is the primary benefit of enabling Two-Factor Auth (2FA)?',
    optionA: {
      textTH: 'ป้องกันถูกแฮก แม้คนร้ายจะล่วงรู้รหัสผ่าน',
      textEN: 'Stops unauthorized access even if password is leaked',
      isCorrect: true
    },
    optionB: {
      textTH: 'ช่วยให้เข้าสู่ระบบได้เร็วกว่าเดิม 2 เท่า',
      textEN: 'Makes logging into account twice as fast',
      isCorrect: false
    },
    tipTH: '2FA บังคับให้ยืนยันผ่าน OTP หรือแอป Authenticator อีกชั้นเสมอ!',
    tipEN: '2FA enforces a secondary physical proof (OTP/App) before granting entry!'
  },
  {
    id: 'q6',
    questionTH: 'สัญลักษณ์รูปกุญแจและ HTTPS:// บนแถบเบราว์เซอร์ หมายความว่าอย่างไร?',
    questionEN: 'What does the lock icon & HTTPS:// in browser URL indicate?',
    optionA: {
      textTH: 'มีการเข้ารหัสความปลอดภัยระหว่างเรากับเว็บ',
      textEN: 'Encrypted communication between you & site',
      isCorrect: true
    },
    optionB: {
      textTH: 'เว็บไซต์นี้ปลอดภัย 100% ไม่มีทางมีมัลแวร์',
      textEN: 'Site is 100% immune from all computer viruses',
      isCorrect: false
    },
    tipTH: 'HTTPS รับรองการเข้ารหัสข้อมูลขณะส่ง แต่เว็บนั้นยังอาจมีเนื้อหาหลอกลวงได้!',
    tipEN: 'HTTPS encrypts transit data, but always inspect the site credibility!'
  }
];
