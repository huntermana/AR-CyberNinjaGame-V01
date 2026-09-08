(function() {
  "use strict";

// ==========================================
// Source: js/config.js
// ==========================================
// Cyber Ninja: Firewall Slasher - Game Configuration & Database

const CONFIG = {
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
const DIFFICULTY_LEVELS = [
  { id: 'novice', level: 1, nameTH: 'มือใหม่ (Novice)', nameEN: 'Novice', speedMult: 0.75, spawnIntervalMult: 1.3, safeRatio: 0.45, bossHpMult: 0.7 },
  { id: 'experienced', level: 2, nameTH: 'ผู้เล่นมีประสบการณ์ (Experienced)', nameEN: 'Experienced', speedMult: 1.0, spawnIntervalMult: 1.0, safeRatio: 0.35, bossHpMult: 1.0 },
  { id: 'skilled', level: 3, nameTH: 'ผู้เล่นที่มีทักษะ (Skilled)', nameEN: 'Skilled', speedMult: 1.25, spawnIntervalMult: 0.85, safeRatio: 0.30, bossHpMult: 1.25 },
  { id: 'expert', level: 4, nameTH: 'ผู้เล่นระดับชำนาญ (Expert)', nameEN: 'Expert', speedMult: 1.5, spawnIntervalMult: 0.7, safeRatio: 0.25, bossHpMult: 1.5 },
  { id: 'master', level: 5, nameTH: 'เทพกระบี่ (Blade Master - ยากสุด)', nameEN: 'Blade Master (Hardest)', speedMult: 1.85, spawnIntervalMult: 0.55, safeRatio: 0.20, bossHpMult: 1.85 }
];

// Malware Threat Database (Slashed = +Score)
const MALWARE_TYPES = [
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
const SAFE_PACKET_TYPES = [
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
const QUIZ_DATABASE = [
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


// ==========================================
// Source: js/i18n.js
// ==========================================
// Cyber Ninja: Firewall Slasher - Bilingual Localization Manager (TH 🇹🇭 / EN 🇬🇧)

const TRANSLATIONS = {
  th: {
    // App Header & Meta
    appTitle: 'CYBER NINJA',
    appSubtitle: 'FIREWALL SLASHER',
    tagline: 'ผ่ามัลแวร์กู้เซิร์ฟเวอร์โรงเรียน',
    cameraMirrorNote: 'ระยะแนะนำ 1.2 – 1.8 ม. จากกล้องหน้า',
    
    // Navigation & Modes
    btnMode1: 'โหมด 1: Team Score Attack',
    btnMode1Sub: 'เดี่ยวสะสมแต้มให้ทีม (60 วินาที)',
    btnMode2: 'โหมด 2: 1v1 Split Duel',
    btnMode2Sub: 'ประลองความไวซ้าย-ขวา จอ 16:9',
    btnMode3: 'โหมด 3: Co-op Firewall Relay',
    btnMode3Sub: 'วิ่งผลัดกู้วิกฤต DDoS (4-8 คน)',
    btnLeaderboard: 'ทำเนียบคะแนน (Leaderboard)',
    btnHowToPlay: 'คู่มือวิธีเล่น & ท่าไม้ตาย',
    
    // Top Controls
    tvCastToggle: '📺 จอ TV / Projector',
    langToggle: '🌐 EN / ภาษาอังกฤษ',
    simToggle: '🖱️ สลับโหมด เมาส์/กล้อง',
    fullscreen: '⛶ เต็มจอ',
    backToMenu: '⬅️ เมนูหลัก',
    
    // Gestures HUD
    gestureSlash: 'ฟันมัลแวร์ (+แต้ม)',
    gestureCatch: 'แบมือรับ SSL/Shield (ห้ามฟัน!)',
    gestureQuiz: 'ชูมือแตะตัวเลือก',
    
    // Mode 1: Score Attack
    timeRemaining: 'เวลาเหลือ',
    score: 'คะแนน',
    combo: 'คอมโบ',
    overdrive: '⚡ CYBER OVERDRIVE ⚡',
    selectTeam: 'เลือกสังกัดทีมของคุณ:',
    startGame: 'เริ่มภารกิจไซเบอร์!',
    
    // Mode 2: 1v1 Duel
    blueTeam: 'ทีมฟ้า (Neon Blue)',
    redTeam: 'ทีมแดง (Neon Red)',
    bestOf: 'กติกาชนะก่อน:',
    rounds: 'รอบ',
    player1Ready: 'ผู้เล่น 1 ยกมือแตะ READY',
    player2Ready: 'ผู้เล่น 2 ยกมือแตะ READY',
    readyPrompt: 'แตะ READY เพื่อเริ่ม!',
    countdownReady: 'เตรียมพร้อม...',
    roundWinner: 'ชนะรอบนี้!',
    pointAdded: '+1 แต้ม',
    matchWinner: 'เป็นแชมป์เปี้ยนสังเวียนไซเบอร์!',
    nextRound: 'รอบถัดไปใน',
    rematch: 'ประลองอีกครั้ง',
    
    // Mode 3: Co-op Relay
    serverHealth: 'ความสมบูรณ์ไฟร์วอลล์ (Server Firewall)',
    activeRunner: 'นินจาคนที่',
    runnerTimer: 'เวลาวิ่งผลัด',
    keysSecured: 'กุญแจ SSL ที่เก็บได้',
    switchWarning: '⚠️ เตรียมเปลี่ยนตัว! วิ่งผลัดคนที่',
    switchNow: '💥 สลับตัวทันที! (SWITCH!)',
    missionAccomplished: 'ภารกิจสำเร็จ! เซิร์ฟเวอร์ปลอดภัยแล้ว!',
    serverCrashed: 'ระบบล่ม! ไวรัสทะลวงไฟร์วอลล์สำเร็จ!',
    
    // Quiz Popups
    cyberQuizAlert: '🚨 คำถามไซเบอร์แทรกแซง!',
    quizTimeLeft: 'เวลาตอบ',
    slashToSelect: 'ฟันหรือชูมือแตะตัวเลือกที่ถูกต้อง!',
    correctAnswer: 'ถูกต้อง! +200 แต้มความรู้',
    wrongAnswer: 'ไม่ถูกต้อง! เสียแต้ม -100',
    
    // Game Over & Results
    missionReport: 'สรุปรายงานปฏิบัติการไซเบอร์',
    malwareSlashed: 'มัลแวร์ที่กำจัดได้',
    safePacketsCaught: 'ข้อมูลปลอดภัยที่ประคองรับ',
    penaltiesIncurred: 'เผลอฟันข้อมูลปลอดภัย (หักแต้ม)',
    finalScore: 'คะแนนรวมสุทธิ',
    saveToLeaderboard: 'บันทึกคะแนนลงทำเนียบค่าย',
    playAgain: 'เล่นอีกครั้ง',
    
    // Leaderboard
    leaderboardTitle: '🏆 ทำเนียบสุดยอดนินจาไซเบอร์ประจำค่าย',
    rank: 'อันดับ',
    team: 'ทีม / สังกัด',
    playerName: 'ชื่อผู้เล่น',
    mode: 'โหมด',
    date: 'เวลา',
    exportCsv: '📥 ส่งออกข้อมูล (CSV)',
    clearLeaderboard: '🗑️ ล้างคะแนนทั้งหมด',
    confirmClear: 'คุณต้องการล้างข้อมูลคะแนนทั้งหมดใช่หรือไม่?'
  },
  
  en: {
    // App Header & Meta
    appTitle: 'CYBER NINJA',
    appSubtitle: 'FIREWALL SLASHER',
    tagline: 'Defend Server & Slay Malware Threats',
    cameraMirrorNote: 'Optimal distance 1.2 – 1.8 m from front camera',
    
    // Navigation & Modes
    btnMode1: 'Mode 1: Team Score Attack',
    btnMode1Sub: 'Solo points contribution (60s)',
    btnMode2: 'Mode 2: 1v1 Split Duel',
    btnMode2Sub: 'Left vs Right speed trial (16:9)',
    btnMode3: 'Mode 3: Co-op Firewall Relay',
    btnMode3Sub: 'DDoS crisis team relay (4-8 players)',
    btnLeaderboard: 'Camp Leaderboard',
    btnHowToPlay: 'How to Play & Cyber Gestures',
    
    // Top Controls
    tvCastToggle: '📺 TV / Projector Cast',
    langToggle: '🌐 TH / ภาษาไทย',
    simToggle: '🖱️ Mouse/Cam Toggle',
    fullscreen: '⛶ Fullscreen',
    backToMenu: '⬅️ Main Menu',
    
    // Gestures HUD
    gestureSlash: 'Slash Malware (+Pts)',
    gestureCatch: 'Catch SSL/Shield (Do NOT slash!)',
    gestureQuiz: 'Raise Hand on Choice',
    
    // Mode 1: Score Attack
    timeRemaining: 'TIME LEFT',
    score: 'SCORE',
    combo: 'COMBO',
    overdrive: '⚡ CYBER OVERDRIVE ⚡',
    selectTeam: 'Select Your Team:',
    startGame: 'ENGAGE MISSION!',
    
    // Mode 2: 1v1 Duel
    blueTeam: 'Neon Blue Team',
    redTeam: 'Neon Red Team',
    bestOf: 'First to Win:',
    rounds: 'Rounds',
    player1Ready: 'P1 Hit READY in Air',
    player2Ready: 'P2 Hit READY in Air',
    readyPrompt: 'Hit READY to Start!',
    countdownReady: 'GET READY...',
    roundWinner: 'WINS THIS ROUND!',
    pointAdded: '+1 POINT',
    matchWinner: 'IS THE TOURNAMENT CHAMPION!',
    nextRound: 'Next round in',
    rematch: 'Rematch',
    
    // Mode 3: Co-op Relay
    serverHealth: 'Server Firewall Integrity',
    activeRunner: 'Ninja Runner #',
    runnerTimer: 'Runner Time',
    keysSecured: 'SSL Keys Secured',
    switchWarning: '⚠️ RUNNER READY! Next: Runner #',
    switchNow: '💥 SWITCH RUNNER NOW!',
    missionAccomplished: 'MISSION COMPLETE! SERVER RESTORED!',
    serverCrashed: 'SERVER CRITICAL FAILURE! FIREWALL BREACHED!',
    
    // Quiz Popups
    cyberQuizAlert: '🚨 CYBER EMERGENCY QUESTION!',
    quizTimeLeft: 'Time Left',
    slashToSelect: 'Slash or point to the correct pod!',
    correctAnswer: 'CORRECT! +200 Cyber Points',
    wrongAnswer: 'WRONG! -100 Point Penalty',
    
    // Game Over & Results
    missionReport: 'CYBER OPERATION DEBRIEFING',
    malwareSlashed: 'Malware Slain',
    safePacketsCaught: 'Safe Packets Safeguarded',
    penaltiesIncurred: 'Accidental Packet Slashes',
    finalScore: 'Total Score',
    saveToLeaderboard: 'Save to Camp Leaderboard',
    playAgain: 'Play Again',
    
    // Leaderboard
    leaderboardTitle: '🏆 Camp Cyber Ninja Hall of Fame',
    rank: 'Rank',
    team: 'Team',
    playerName: 'Player Name',
    mode: 'Mode',
    date: 'Timestamp',
    exportCsv: '📥 Export CSV',
    clearLeaderboard: '🗑️ Reset Scores',
    confirmClear: 'Are you sure you want to clear all camp leaderboard records?'
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('cyber_ninja_lang') || 'th';
    this.listeners = [];
  }

  get lang() {
    return this.currentLang;
  }

  setLanguage(newLang) {
    if (newLang !== 'th' && newLang !== 'en') return;
    this.currentLang = newLang;
    localStorage.setItem('cyber_ninja_lang', newLang);
    this.notify();
  }

  toggle() {
    const target = this.currentLang === 'th' ? 'en' : 'th';
    this.setLanguage(target);
    return target;
  }

  t(key) {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.th;
    return dict[key] !== undefined ? dict[key] : (TRANSLATIONS.en[key] || key);
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(this.currentLang); } catch (e) { console.error('i18n notify error', e); }
    });
  }
}

const i18n = new I18nManager();


// ==========================================
// Source: js/audio.js
// ==========================================
// Cyber Ninja: Firewall Slasher - Audio Synthesizer, BGM Generator & SFX Engine

class CyberAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterVolume = 1.0;
    this.bgmVolume = 0.50; // Default 50% on startup
    this.sfxVolume = 0.50; // Default 50% on startup

    this.masterGainNode = null;
    this.bgmGainNode = null;
    this.sfxGainNode = null;

    // BGM state
    this.currentMode = null;
    this.bgmTimer = null;
    this.isBgmPlaying = false;
    this.bgmStep = 0;
    this.customBgmAudio = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master Gain
      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGainNode.connect(this.ctx.destination);

      // Dedicated BGM Gain (Default 50%)
      this.bgmGainNode = this.ctx.createGain();
      this.bgmGainNode.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
      this.bgmGainNode.connect(this.masterGainNode);

      // Dedicated SFX Gain (Default 50%)
      this.sfxGainNode = this.ctx.createGain();
      this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGainNode.connect(this.masterGainNode);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setBgmVolume(vol) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmGainNode && this.ctx) {
      this.bgmGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
    }
    if (this.customBgmAudio) {
      this.customBgmAudio.volume = this.isMuted ? 0 : this.bgmVolume * 0.7;
    }
  }

  setSfxVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGainNode && this.ctx) {
      this.sfxGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
  }

  setMasterVolume(vol) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGainNode && this.ctx) {
      this.masterGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGainNode && this.ctx) {
      this.masterGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    if (this.customBgmAudio) {
      this.customBgmAudio.muted = this.isMuted;
    }
    return this.isMuted;
  }

  // -------------------------------------------------------------
  // BGM Engine: Distinct Cyber Themes for Menu and Modes 1, 2, 3
  // -------------------------------------------------------------
  playMenuBGM() {
    this.playBGM(0);
  }

  playBGM(mode = 1) {
    this.init();
    this.stopBGM();
    this.currentMode = mode;
    this.isBgmPlaying = true;
    this.bgmStep = 0;

    // Check custom audio path from AssetManager or default
    const assetKey = mode === 0 ? 'bgm_menu' : `bgm_mode${mode}`;
    const customPath = (window.assetManager && window.assetManager.audioPaths && window.assetManager.audioPaths[assetKey])
      ? window.assetManager.audioPaths[assetKey]
      : `assets/audio/${mode === 0 ? 'bgm_menu.mp3' : `bgm_mode${mode}.mp3`}`;

    const testAudio = new Audio(customPath);
    testAudio.loop = true;
    testAudio.volume = this.isMuted ? 0 : this.bgmVolume;

    const playPromise = testAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.customBgmAudio = testAudio;
      }).catch(() => {
        // Fallback to enhanced procedural Web Audio synthesizer
        this.startProceduralBGM(mode);
      });
    } else {
      this.startProceduralBGM(mode);
    }
  }

  startProceduralBGM(mode) {
    if (!this.ctx) return;
    // Energetic BPM: Menu 132 BPM, Mode 1 136 BPM, Mode 2 144 BPM, Mode 3 138 BPM
    const tempo = mode === 0 ? 132 : (mode === 1 ? 136 : (mode === 2 ? 144 : 138));
    const stepInterval = (60 / tempo) / 2 * 1000; // Eighth notes in ms

    this.bgmTimer = setInterval(() => {
      if (!this.isBgmPlaying || this.isMuted) return;
      this.tickBgmStep(mode);
      this.bgmStep = (this.bgmStep + 1) % 32;
    }, stepInterval);
  }

  tickBgmStep(mode) {
    if (!this.ctx || this.ctx.state !== 'running') return;

    if (mode === 0) {
      // MODE 0: High-Octane Cyber Ninja Main Menu Battle Theme (D minor, 132 BPM)
      // Driving electronic bassline, punchy 4-on-the-floor electro kicks, sharp arpeggios, and cyber ninja stabs!
      const ninjaBass = [
        73.42, 73.42, 87.31, 73.42, 98.00, 73.42, 110.00, 87.31,
        73.42, 73.42, 87.31, 73.42, 116.54, 110.00, 98.00, 87.31
      ]; // D2, F2, G2, A2, Bb2...
      const ninjaLead = [
        293.66, 349.23, 440.00, 523.25, 587.33, 523.25, 440.00, 349.23,
        587.33, 698.46, 587.33, 523.25, 440.00, 523.25, 587.33, 698.46
      ]; // D4, F4, A4, C5, D5, F5...

      // 1. Driving Synth Bass: Fast rhythmic pulse on 16th-note feel
      const bassFreq = ninjaBass[this.bgmStep % ninjaBass.length];
      const isBassStep = (this.bgmStep % 2 === 0) || (this.bgmStep % 4 === 3);
      if (isBassStep) {
        this.playSynthNote(bassFreq, 0.12, 'sawtooth', 0.22, 520, true);
      }

      // 2. Punchy Electro Kick on quarter notes
      if (this.bgmStep % 4 === 0) {
        this.playKick(0.15, 0.28, true);
      }

      // 3. Cyber Snare / Digital Clap on 4 and 12 of every 16 steps
      if (this.bgmStep % 8 === 4) {
        this.playNoiseTick(0.10, 0.22, 2800, true);
        this.playSynthNote(220, 0.10, 'triangle', 0.14, 800, true);
      }

      // 4. Sizzling 16th-note Hi-Hat Groove
      if (this.bgmStep % 2 === 1) {
        const hatGain = (this.bgmStep % 4 === 3) ? 0.08 : 0.05;
        this.playNoiseTick(0.035, hatGain, 7500, true);
      }

      // 5. Heroic Cyber Ninja Katana Arpeggio & Melody
      if (this.bgmStep % 2 === 0) {
        const leadFreq = ninjaLead[(this.bgmStep / 2) % ninjaLead.length];
        this.playSynthNote(leadFreq, 0.16, 'square', 0.12, 2200, true);
      }

      // 6. Dramatic Cyber Stabs at phrase start (step 0 and 16)
      if (this.bgmStep === 0 || this.bgmStep === 16) {
        this.playSynthNote(146.83, 0.35, 'sawtooth', 0.18, 950, true); // D3
        this.playSynthNote(220.00, 0.35, 'sawtooth', 0.14, 950, true); // A3
        this.playSynthNote(349.23, 0.35, 'sawtooth', 0.14, 950, true); // F4
      }
    } else if (mode === 1) {
      // MODE 1: 136 BPM High-Energy Arcade Synthwave Rush (A minor pentatonic)
      // Driving 4-on-the-floor electro kick, snappy digital snare, rolling 16th bassline, hyper energetic melody!
      const bassNotes = [110.0, 110.0, 130.8, 146.8, 110.0, 110.0, 164.8, 196.0]; // A2, C3, D3, E3, G3
      const leadNotes = [440.0, 523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 880.0, 783.99];

      // 1. Driving Electro Kick on EVERY beat!
      if (this.bgmStep % 4 === 0) {
        this.playKick(0.15, 0.30, true);
      }

      // 2. Snappy Digital Snare on beats 4 and 12
      if (this.bgmStep % 8 === 4) {
        this.playNoiseTick(0.09, 0.24, 3200, true);
        this.playSynthNote(261.63, 0.08, 'triangle', 0.14, 700, true);
      }

      // 3. Sizzling offbeat Hi-Hat
      if (this.bgmStep % 2 === 1) {
        this.playNoiseTick(0.04, 0.07, 7000, true);
      }

      // 4. Rolling 16th-note Synthwave Bassline
      const isBass = (this.bgmStep % 2 === 0) || (this.bgmStep % 4 === 1);
      if (isBass) {
        const bassFreq = bassNotes[(Math.floor(this.bgmStep / 2)) % bassNotes.length];
        this.playSynthNote(bassFreq, 0.12, 'sawtooth', 0.24, 480, true);
      }

      // 5. Bright Energetic Synth Lead Arpeggio
      if (this.bgmStep % 2 === 0) {
        const leadFreq = leadNotes[this.bgmStep % leadNotes.length];
        this.playSynthNote(leadFreq, 0.16, 'square', 0.14, 2400, true);
      }

      // 6. Chord Stabs on phrase start
      if (this.bgmStep === 0 || this.bgmStep === 16) {
        this.playSynthNote(220.0, 0.32, 'sawtooth', 0.16, 1100, true); // A3
        this.playSynthNote(261.63, 0.32, 'sawtooth', 0.14, 1100, true); // C4
        this.playSynthNote(329.63, 0.32, 'sawtooth', 0.14, 1100, true); // E4
      }
    } else if (mode === 2) {
      // MODE 2: 144 BPM Aggressive Cyber Combat Darksynth Duel (D minor, intense punch)
      // Rapid double-kicks, crushing industrial snares, gritty distorted saw bass, combat siren stabs!
      const combatBass = [73.42, 73.42, 87.31, 73.42, 98.00, 73.42, 103.83, 110.0]; // D2, F2, G2, Ab2, A2
      const punchFreq = combatBass[this.bgmStep % combatBass.length];

      // 1. Industrial Double Kick Pattern
      if (this.bgmStep % 4 === 0 || this.bgmStep % 8 === 3 || this.bgmStep % 8 === 6) {
        this.playKick(0.14, 0.32, true);
      }

      // 2. Heavy Industrial Snare Punch on 4, 12, 20, 28
      if (this.bgmStep % 8 === 4) {
        this.playNoiseTick(0.12, 0.26, 2200, true);
        this.playSynthNote(196.0, 0.10, 'triangle', 0.18, 700, true);
      }

      // 3. Gritty Distorted Driving Saw Bass
      this.playSynthNote(punchFreq, 0.10, 'sawtooth', 0.26, 580, true);

      // 4. Combat Siren Laser Stabs on Counter-beats
      if (this.bgmStep % 4 === 2) {
        this.playSynthNote(587.33, 0.08, 'square', 0.14, 2600, true); // D5
        this.playSynthNote(698.46, 0.08, 'sawtooth', 0.12, 2600, true); // F5
      }

      // 5. Hi-Hat Sizzle
      if (this.bgmStep % 2 === 1) {
        this.playNoiseTick(0.035, 0.065, 8000, true);
      }
    } else if (mode === 3) {
      // MODE 3: 138 BPM Epic Cyber Kaiju Raid Anthem (Deep seismic sub-bass, thunderous kicks, heroic tension)
      const bossBass = [55.0, 55.0, 55.0, 65.41, 55.0, 55.0, 73.42, 82.41]; // A1, C2, D2, E2

      // 1. Thunderous Cinematic Kick Drum
      if (this.bgmStep % 4 === 0 || this.bgmStep % 16 === 14) {
        this.playKick(0.18, 0.34, true);
      }

      // 2. Crushing Metallic Snare on 4 and 12
      if (this.bgmStep % 8 === 4) {
        this.playNoiseTick(0.14, 0.28, 1800, true);
        this.playSynthNote(174.61, 0.12, 'triangle', 0.20, 600, true);
      }

      // 3. Seismic Sub-Bass Earthquake Rumble
      if (this.bgmStep % 2 === 0) {
        const freq = bossBass[(Math.floor(this.bgmStep / 4)) % bossBass.length];
        this.playSynthNote(freq, 0.32, 'triangle', 0.30, 260, true);
      }

      // 4. Dramatic Dark Boss Tension Chords
      if (this.bgmStep === 0 || this.bgmStep === 14 || this.bgmStep === 16 || this.bgmStep === 30) {
        this.playSynthNote(146.83, 0.32, 'sawtooth', 0.22, 1000, true); // D3
        this.playSynthNote(207.65, 0.32, 'sawtooth', 0.18, 1000, true); // G#3 (Tritone boss tension!)
        this.playSynthNote(293.66, 0.32, 'sawtooth', 0.16, 1000, true); // D4
      }

      // 5. Rising Laser Arpeggios (Building up hype for ultimate attacks!)
      if (this.bgmStep % 4 === 2) {
        this.playSynthNote(440.0 + (this.bgmStep * 15), 0.12, 'square', 0.12, 2200, true);
      }

      // 6. Hi-hat groove
      if (this.bgmStep % 2 === 1) {
        this.playNoiseTick(0.04, 0.07, 7200, true);
      }
    }
  }

  playSynthNote(freq, dur, type = 'sawtooth', gainVal = 0.08, filterFreq = 800, isBgm = false) {
    if (!this.ctx) return;
    const dest = isBgm ? this.bgmGainNode : this.sfxGainNode;
    if (!dest) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + dur);
  }

  playNoiseTick(dur, gainVal = 0.03, filterFreq = 5000, isBgm = false) {
    if (!this.ctx) return;
    const dest = isBgm ? this.bgmGainNode : this.sfxGainNode;
    if (!dest) return;
    const t = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    if (bufferSize <= 0) return;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(filterFreq, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(t);
    noise.stop(t + dur);
  }

  playKick(dur = 0.18, gainVal = 0.12, isBgm = false) {
    if (!this.ctx) return;
    const dest = isBgm ? this.bgmGainNode : this.sfxGainNode;
    if (!dest) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + dur);
  }

  pauseBGM() {
    this.isBgmPlaying = false;
    if (this.customBgmAudio) {
      this.customBgmAudio.pause();
    }
  }

  resumeBGM() {
    if (this.currentMode !== null) {
      this.isBgmPlaying = true;
      if (this.customBgmAudio) {
        this.customBgmAudio.play().catch(() => {});
      }
    }
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.customBgmAudio) {
      this.customBgmAudio.pause();
      this.customBgmAudio.currentTime = 0;
      this.customBgmAudio = null;
    }
  }

  // -------------------------------------------------------------
  // Sound Effects Engine (Connected to sfxGainNode)
  // -------------------------------------------------------------

  // 1. Cyber Blade Laser Slash Swoosh with Sharp Edge & Digital Glitch
  playSlash(speedRatio = 1.0) {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    // A. High-speed metallic whoosh (Bandpass noise sweep)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.11);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200 * speedRatio, t);
    filter.frequency.exponentialRampToValueAtTime(4200 * speedRatio, t + 0.05);
    filter.frequency.exponentialRampToValueAtTime(900, t + 0.11);
    filter.Q.setValueAtTime(6, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGainNode);
    noise.start(t);
    noise.stop(t + 0.11);

    // B. Razor-sharp Katana Laser Ring ("SHING!" with rapid pitch dive)
    const bladeOsc = this.ctx.createOscillator();
    bladeOsc.type = 'sawtooth';
    bladeOsc.frequency.setValueAtTime(1600 * speedRatio, t);
    bladeOsc.frequency.exponentialRampToValueAtTime(180, t + 0.09);

    const bladeFilter = this.ctx.createBiquadFilter();
    bladeFilter.type = 'bandpass';
    bladeFilter.frequency.setValueAtTime(2200, t);
    bladeFilter.Q.setValueAtTime(8, t);

    const bladeGain = this.ctx.createGain();
    bladeGain.gain.setValueAtTime(0.3, t);
    bladeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    bladeOsc.connect(bladeFilter);
    bladeFilter.connect(bladeGain);
    bladeGain.connect(this.sfxGainNode);
    bladeOsc.start(t);
    bladeOsc.stop(t + 0.09);

    // C. Digital Glitch Staccato Slice (Crisp crunchy digital byte shred)
    const glitchFreqs = [2800, 1950, 3600];
    glitchFreqs.forEach((freq, idx) => {
      const gOsc = this.ctx.createOscillator();
      gOsc.type = 'square';
      gOsc.frequency.setValueAtTime(freq, t + idx * 0.018);

      const gGain = this.ctx.createGain();
      gGain.gain.setValueAtTime(0.14, t + idx * 0.018);
      gGain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.018 + 0.022);

      gOsc.connect(gGain);
      gGain.connect(this.sfxGainNode);
      gOsc.start(t + idx * 0.018);
      gOsc.stop(t + idx * 0.018 + 0.025);
    });
  }

  // 2. Malware Hit Explosion
  playHit() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.18);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    const zap = this.ctx.createOscillator();
    zap.type = 'square';
    zap.frequency.setValueAtTime(1200, t);
    zap.frequency.exponentialRampToValueAtTime(200, t + 0.08);

    const zapGain = this.ctx.createGain();
    zapGain.gain.setValueAtTime(0.18, t);
    zapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    zap.connect(zapGain);
    zapGain.connect(this.sfxGainNode);

    osc.start(t);
    zap.start(t);
    osc.stop(t + 0.2);
    zap.stop(t + 0.09);
  }

  // 3. Safe Packet Catch Chime
  playCatch() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    const freqs = [1046.50, 1318.51, 1567.98];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.035);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.20, t + idx * 0.035);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.035 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t + idx * 0.035);
      osc.stop(t + idx * 0.035 + 0.35);
    });
  }

  // 4. Glitch / Wrong Penalty Buzzer
  playPenalty() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.setValueAtTime(100, t + 0.1);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(t);
    osc.stop(t + 0.28);
  }

  // 5. Countdown Electronic Beep
  playCountdown(isFinal = false) {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = isFinal ? 'square' : 'sine';
    osc.frequency.setValueAtTime(isFinal ? 880 : 440, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.30, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (isFinal ? 0.45 : 0.18));

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(t);
    osc.stop(t + (isFinal ? 0.45 : 0.18));
  }

  // 6. Freeze Frame / Sub-Bass Rumble
  playFreeze() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(80, t);
    sub.frequency.exponentialRampToValueAtTime(25, t + 0.6);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.45, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    const high = this.ctx.createOscillator();
    high.type = 'triangle';
    high.frequency.setValueAtTime(2093, t);

    const highGain = this.ctx.createGain();
    highGain.gain.setValueAtTime(0.2, t);
    highGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    sub.connect(subGain);
    subGain.connect(this.sfxGainNode);
    high.connect(highGain);
    highGain.connect(this.sfxGainNode);

    sub.start(t);
    high.start(t);
    sub.stop(t + 0.6);
    high.stop(t + 0.7);
  }

  // 7. Whistle / Runner Switch Double-Beep
  playWhistle() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    [0, 0.12].forEach(offset => {
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1760, t + offset);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.22, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t + offset);
      osc.stop(t + offset + 0.08);
    });
  }

  // 8. Cyber Victory Fanfare
  playVictory() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.1);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, t + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t + idx * 0.1);
      osc.stop(t + idx * 0.1 + 0.4);
    });
  }

  // 9. MASSIVE ULTIMATE ATTACK BLAST (Rising Laser Beam + Colossal Seismic Detonation)
  playUltimateBlast() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    // A. High-energy rising laser cannon charging whine (Detuned dual oscillators)
    [0, 8].forEach(detune => {
      const chargeOsc = this.ctx.createOscillator();
      chargeOsc.type = 'sawtooth';
      chargeOsc.frequency.setValueAtTime(320 + detune, t);
      chargeOsc.frequency.exponentialRampToValueAtTime(4200 + detune, t + 0.35);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, t);
      filter.frequency.exponentialRampToValueAtTime(4500, t + 0.35);
      filter.Q.setValueAtTime(5, t);

      const chargeGain = this.ctx.createGain();
      chargeGain.gain.setValueAtTime(0.35, t);
      chargeGain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

      chargeOsc.connect(filter);
      filter.connect(chargeGain);
      chargeGain.connect(this.sfxGainNode);
      chargeOsc.start(t);
      chargeOsc.stop(t + 0.35);
    });

    // B. Beam Release: Crackling plasma noise burst
    const noiseLen = Math.floor(this.ctx.sampleRate * 0.4);
    const noiseBuf = this.ctx.createBuffer(1, noiseLen, this.ctx.sampleRate);
    const nData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) nData[i] = Math.random() * 2 - 1;

    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;

    const nFilter = this.ctx.createBiquadFilter();
    nFilter.type = 'highpass';
    nFilter.frequency.setValueAtTime(1500, t + 0.25);
    nFilter.frequency.exponentialRampToValueAtTime(200, t + 0.65);

    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.5, t + 0.25);
    nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

    noiseSrc.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(this.sfxGainNode);
    noiseSrc.start(t + 0.25);
    noiseSrc.stop(t + 0.65);

    // C. Colossal Seismic Detonation Shockwave (Earthquake sub-bass drop)
    const boomOsc = this.ctx.createOscillator();
    boomOsc.type = 'triangle';
    boomOsc.frequency.setValueAtTime(240, t + 0.3);
    boomOsc.frequency.exponentialRampToValueAtTime(24, t + 1.4);

    const boomGain = this.ctx.createGain();
    boomGain.gain.setValueAtTime(0.85, t + 0.3);
    boomGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.45);

    boomOsc.connect(boomGain);
    boomGain.connect(this.sfxGainNode);
    boomOsc.start(t + 0.3);
    boomOsc.stop(t + 1.45);

    // D. Heavy punch distortion kick
    const kickOsc = this.ctx.createOscillator();
    kickOsc.type = 'sine';
    kickOsc.frequency.setValueAtTime(180, t + 0.32);
    kickOsc.frequency.exponentialRampToValueAtTime(35, t + 0.6);

    const kickGain = this.ctx.createGain();
    kickGain.gain.setValueAtTime(0.7, t + 0.32);
    kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    kickOsc.connect(kickGain);
    kickGain.connect(this.sfxGainNode);
    kickOsc.start(t + 0.32);
    kickOsc.stop(t + 0.6);
  }
}

const audio = new CyberAudioEngine();


// ==========================================
// Source: js/asset-manager.js
// ==========================================
// Cyber Ninja: Firewall Slasher - Intelligent Asset Manager & Graceful Fallback System

class AssetManager {
  constructor() {
    this.images = new Map();
    this.audioElements = new Map();

    this.defaultImageFallbacks = {
      'tutorial_slash': 'assets/images/tutorial_gesture_slash.jpg',
      'tutorial_catch': 'assets/images/tutorial_gesture_catch.jpg',
      'boss_monster': 'assets/images/cyber_boss_monster.jpg',
      'boss_level1': 'assets/images/boss_level1.jpg',
      'boss_level2': 'assets/images/boss_level2.jpg',
      'boss_level3': 'assets/images/boss_level3.jpg',
      'boss_level4': 'assets/images/boss_level4.jpg',
      'boss_level5': 'assets/images/boss_level5.jpg',
      'ultimate_icon': 'assets/images/ultimate_attack_icon.svg',
      'logo': 'assets/images/cyber_ninja_logo.jpg'
    };

    this.defaultAudioPaths = {
      'bgm_menu': 'assets/audio/bgm_menu.mp3',
      'bgm_mode1': 'assets/audio/bgm_mode1.mp3',
      'bgm_mode2': 'assets/audio/bgm_mode2.mp3',
      'bgm_mode3': 'assets/audio/bgm_mode3.mp3',
      'sfx_ultimate': 'assets/audio/sfx_ultimate.mp3'
    };

    this.imageFallbacks = { ...this.defaultImageFallbacks };
    this.audioPaths = { ...this.defaultAudioPaths };

    if (typeof window !== 'undefined') {
      window.assetManager = this;
    }

    this.loadSavedConfig();
    this.preloadAll();
  }

  loadSavedConfig() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('cyber_ninja_assets');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.audio) {
            this.audioPaths = { ...this.audioPaths, ...parsed.audio };
          }
          if (parsed.images) {
            this.imageFallbacks = { ...this.imageFallbacks, ...parsed.images };
          }
          console.log('[AssetManager] Loaded custom user asset configuration from localStorage.');
        }
      }
    } catch (e) {
      console.warn('[AssetManager] Could not load localStorage configuration:', e);
    }
  }

  syncCustomData(customData) {
    if (!customData) return false;
    try {
      if (customData.audio) {
        for (const [k, v] of Object.entries(customData.audio)) {
          if (v && typeof v === 'string' && v.trim()) {
            this.audioPaths[k] = v.trim();
          }
        }
      }

      if (customData.images) {
        for (const [k, v] of Object.entries(customData.images)) {
          if (v && typeof v === 'string' && v.trim()) {
            const trimmed = v.trim();
            this.imageFallbacks[k] = trimmed;
            // Hot reload image
            const img = new Image();
            img.src = trimmed;
            img.onload = () => {
              this.images.set(k, img);
              console.log(`[AssetManager] Dynamically updated image: '${k}' -> '${trimmed}'`);
            };
          }
        }
      }

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('cyber_ninja_assets', JSON.stringify({
          audio: this.audioPaths,
          images: this.imageFallbacks
        }));
      }
      return true;
    } catch (e) {
      console.error('[AssetManager] syncCustomData error:', e);
      return false;
    }
  }

  resetDefaults() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('cyber_ninja_assets');
      }
      this.imageFallbacks = { ...this.defaultImageFallbacks };
      this.audioPaths = { ...this.defaultAudioPaths };
      this.preloadAll();
      console.log('[AssetManager] Assets reset to default paths.');
      return true;
    } catch (e) {
      console.error('[AssetManager] resetDefaults error:', e);
      return false;
    }
  }

  preloadAll() {
    // Preload Images
    for (const [key, path] of Object.entries(this.imageFallbacks)) {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        this.images.set(key, img);
      };
      img.onerror = () => {
        console.warn(`[AssetManager] Notice: Image '${key}' at '${path}' not found, utilizing backup renderer.`);
      };
    }

    // Attempt preload of optional custom audio files
    for (const [key, path] of Object.entries(this.audioPaths)) {
      const audio = new Audio();
      audio.src = path;
      audio.preload = 'none'; // Don't block
      this.audioElements.set(key, audio);
    }
  }

  getImage(key) {
    return this.images.get(key) || null;
  }

  getAudio(key) {
    return this.audioElements.get(key) || null;
  }
}

const assetManager = new AssetManager();



// ==========================================
// Source: js/tracking/gesture-detector.js
// ==========================================
// Cyber Ninja: Firewall Slasher - Gesture Detection & Collision Math


class GestureDetector {
  constructor() {
    this.prevPoints = new Map(); // handId -> { x, y, time }
  }

  processHand(hand) {
    const now = performance.now();
    const id = hand.id;
    const currentTip = hand.indexTip;
    const prev = this.prevPoints.get(id);

    let velocity = 0;
    let isSlashing = false;
    let slashSegment = null;

    const isOpenPalm = Boolean(hand.isOpenPalm);
    const isSingleFingerBlade = Boolean(hand.isSingleFingerBlade);
    const isBlade = !isOpenPalm && (isSingleFingerBlade || Boolean(hand.isKnifeHand));

    // IMMUNITY RULE: An Open Palm (5 fingers) hand can NEVER slash, regardless of velocity!
    // Slashes strictly require Sword Blade (ชู 2 นิ้ว) moving at or above the threshold speed
    if (prev) {
      const dt = (now - prev.time) / 1000; // seconds
      if (dt > 0.005 && dt < 0.25) {
        const dx = currentTip.x - prev.x;
        const dy = currentTip.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        velocity = dist / dt; // pixels per second

        if (!isOpenPalm && isBlade && velocity >= CONFIG.SLASH_VELOCITY_THRESHOLD) {
          isSlashing = true;
          slashSegment = {
            x1: prev.x,
            y1: prev.y,
            x2: currentTip.x,
            y2: currentTip.y,
            velocity: velocity,
            angle: Math.atan2(dy, dx)
          };
        }
      }
    }

    this.prevPoints.set(id, { x: currentTip.x, y: currentTip.y, time: now });

    // Open Palm Catch: Active whenever hand is in 5-finger open palm, without restrictive speed caps!
    const isCatching = isOpenPalm;

    return {
      handId: id,
      handedness: hand.handedness,
      tip: currentTip,
      palm: hand.palmCenter,
      wrist: hand.wrist,
      velocity: velocity,
      isOpenPalm: isOpenPalm,
      isKnifeHand: isBlade,
      isSingleFingerBlade: isSingleFingerBlade,
      isTwoFingerBlade: isSingleFingerBlade,
      isSlashing: isSlashing,
      slashSegment: slashSegment,
      isCatching: isCatching,
      catchRadius: CONFIG.PALM_CATCH_RADIUS
    };
  }

  // Math Helper: Test if a line segment (x1, y1) -> (x2, y2) intersects a circle (cx, cy, r)
  static segmentIntersectsCircle(x1, y1, x2, y2, cx, cy, r) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;

    // Point-to-circle check if segment has almost zero length
    if (lenSq === 0) {
      const distSq = (cx - x1) * (cx - x1) + (cy - y1) * (cy - y1);
      return distSq <= r * r;
    }

    // Projection scalar t on line segment [0, 1]
    const t = Math.max(0, Math.min(1, ((cx - x1) * dx + (cy - y1) * dy) / lenSq));
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;

    const distSq = (cx - closestX) * (cx - closestX) + (cy - closestY) * (cy - closestY);
    return distSq <= r * r;
  }

  // Math Helper: Point in Circle / Radius
  static pointInCircle(px, py, cx, cy, r) {
    const dx = px - cx;
    const dy = py - cy;
    return (dx * dx + dy * dy) <= (r * r);
  }

  // Math Helper: Point in Axis-Aligned Rect
  static pointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
  }

  reset() {
    this.prevPoints.clear();
  }
}


// ==========================================
// Source: js/tracking/blade-trail.js
// ==========================================
// Cyber Ninja: Firewall Slasher - Cyber Blade Neon Trail Renderer

class BladeTrail {
  constructor(colorTheme = 'cyan') {
    this.colorTheme = colorTheme; // 'cyan' or 'magenta'
    this.history = []; // Array of { x, y, time }
    this.maxAge = 200; // Trail lifespan in ms
  }

  setColorTheme(theme) {
    this.colorTheme = theme;
  }

  addPoint(x, y) {
    const now = performance.now();
    this.history.push({ x, y, time: now });
  }

  update() {
    const now = performance.now();
    this.history = this.history.filter(pt => (now - pt.time) < this.maxAge);
  }

  render(ctx) {
    if (this.history.length < 2) return;

    ctx.save();
    
    // Choose neon cyberpunk palette
    const isCyan = this.colorTheme === 'cyan';
    const mainColor = isCyan ? 'rgba(0, 243, 255, ' : 'rgba(255, 0, 85, ';
    const coreColor = isCyan ? 'rgba(255, 255, 255, ' : 'rgba(255, 220, 230, ';
    const glowColor = isCyan ? '#00e5ff' : '#ff0055';

    ctx.shadowBlur = 18;
    ctx.shadowColor = glowColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const isSmooth = Boolean(window.isSmoothMode);
    const now = performance.now();

    if (isSmooth) {
      // ⚡ FAST TABLET / MOBILE PATH (Zero shadowBlur GPU overhead, 100% hardware rasterized)
      // Pass 1: Wide Translucent Halo (Soft Neon Blade Aura)
      for (let i = 1; i < this.history.length; i++) {
        const p1 = this.history[i - 1];
        const p2 = this.history[i];
        const ageRatio = (now - p2.time) / this.maxAge;
        const alpha = Math.max(0, 1.0 - ageRatio);
        const width = Math.max(4, (1.0 - ageRatio) * 22);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `${mainColor}${alpha * 0.3})`;
        ctx.lineWidth = width;
        ctx.stroke();
      }

      // Pass 2: Vivid Blade Ribbon
      for (let i = 1; i < this.history.length; i++) {
        const p1 = this.history[i - 1];
        const p2 = this.history[i];
        const ageRatio = (now - p2.time) / this.maxAge;
        const alpha = Math.max(0, 1.0 - ageRatio);
        const width = Math.max(2, (1.0 - ageRatio) * 12);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `${mainColor}${alpha * 0.9})`;
        ctx.lineWidth = width;
        ctx.stroke();
      }

      // Pass 3: Crisp Laser Core (Pure White)
      for (let i = 1; i < this.history.length; i++) {
        const p1 = this.history[i - 1];
        const p2 = this.history[i];
        const ageRatio = (now - p2.time) / this.maxAge;
        const alpha = Math.max(0, (1.0 - ageRatio) * 0.95);
        const width = Math.max(1, (1.0 - ageRatio) * 4);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `${coreColor}${alpha})`;
        ctx.lineWidth = width;
        ctx.stroke();
      }

      // Fast Katana Tip Indicator
      const latest = this.history[this.history.length - 1];
      if (latest) {
        ctx.beginPath();
        ctx.arc(latest.x, latest.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = isCyan ? 'rgba(0, 243, 255, 0.45)' : 'rgba(255, 0, 85, 0.45)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(latest.x, latest.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
    } else {
      // ✨ HIGH QUALITY PC PATH (Full Gaussian glow shadow blur)
      ctx.shadowBlur = 18;
      ctx.shadowColor = glowColor;

      // Outer Neon Glow Ribbon
      for (let i = 1; i < this.history.length; i++) {
        const p1 = this.history[i - 1];
        const p2 = this.history[i];
        const ageRatio = (now - p2.time) / this.maxAge;
        const alpha = Math.max(0, 1.0 - ageRatio);
        const width = Math.max(2, (1.0 - ageRatio) * 16);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `${mainColor}${alpha})`;
        ctx.lineWidth = width;
        ctx.stroke();
      }

      // Inner Laser Core
      ctx.shadowBlur = 6;
      for (let i = 1; i < this.history.length; i++) {
        const p1 = this.history[i - 1];
        const p2 = this.history[i];
        const ageRatio = (now - p2.time) / this.maxAge;
        const alpha = Math.max(0, (1.0 - ageRatio) * 0.9);
        const width = Math.max(1, (1.0 - ageRatio) * 6);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `${coreColor}${alpha})`;
        ctx.lineWidth = width;
        ctx.stroke();
      }

      // Glowing Katana Tip Particle
      const latest = this.history[this.history.length - 1];
      if (latest) {
        ctx.beginPath();
        ctx.arc(latest.x, latest.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 24;
        ctx.shadowColor = glowColor;
        ctx.fill();
      }
    }

    ctx.restore();
  }

  clear() {
    this.history = [];
  }
}


// ==========================================
// Source: js/tracking/mediapipe-adapter.js
// ==========================================
// Cyber Ninja: Firewall Slasher - MediaPipe Hands Adapter & Hybrid Tracking Controller

class MediaPipeAdapter {
  constructor(videoElement, canvasElement, onResultsCallback) {
    this.video = videoElement;
    this.canvas = canvasElement;
    this.onResults = onResultsCallback;
    
    this.hands = null;
    this.camera = null;
    this.isCameraActive = false;
    this.isSimulatedOnly = false; // True only if user explicitly toggles mouse-only mode
    
    // Virtual hands for simulator & mouse mode
    this.simHands = [];
    this.isSimOpenPalm = false;
    this.lastMousePos = null;
    this.lastMouseTime = performance.now();
    this.hasPhysicalHands = false;
    this.isFistDiscardEnabled = true; // Closed Fist Discard (กำหมัด = พักมือ)

    // Quality Mode: 'smooth' (Lite AI, 30 FPS inference, Zero ShadowBlur for tablets) vs 'high' (Full AI, PC glow)
    const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            (navigator.maxTouchPoints > 1 && window.innerWidth < 1400);
    let savedQuality = null;
    try {
      savedQuality = localStorage.getItem('cyber_ninja_quality');
    } catch (e) {}
    this.qualityMode = savedQuality || (isMobileOrTablet ? 'smooth' : 'high');
    window.isSmoothMode = (this.qualityMode === 'smooth');
    
    this.setupSimulatorEvents();
  }

  setQualityMode(mode) {
    this.qualityMode = mode === 'smooth' ? 'smooth' : 'high';
    window.isSmoothMode = (this.qualityMode === 'smooth');
    try {
      localStorage.setItem('cyber_ninja_quality', this.qualityMode);
    } catch (e) {}

    if (this.hands) {
      this.hands.setOptions({
        modelComplexity: this.qualityMode === 'smooth' ? 0 : 1
      });
    }
    return this.qualityMode;
  }

  toggleFistDiscard(state = null) {
    this.isFistDiscardEnabled = (state !== null) ? state : !this.isFistDiscardEnabled;
    return this.isFistDiscardEnabled;
  }

  updateStatus(text, color = '#00f3ff') {
    const pill = document.getElementById('trackingStatusPill');
    if (pill) {
      pill.textContent = text;
      pill.style.borderColor = color;
      pill.style.color = color;
      pill.style.textShadow = `0 0 10px ${color}`;
    }
  }

  async initCamera() {
    this.updateStatus('📷 กำลังเชื่อมต่อกล้องหน้า... / Connecting camera...', '#ffb703');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('getUserMedia not supported in this environment');
        this.updateStatus('🖱️ โหมดเมาส์/สัมผัสพร้อมเล่น (Mouse Mode Active)', '#00ff66');
        return false;
      }

      // 1. Request camera stream (Optimized resolution for tablets/mobile)
      let stream = null;
      const isSmooth = window.isSmoothMode;
      const videoConstraints = isSmooth 
        ? { width: { ideal: 960, max: 1280 }, height: { ideal: 540, max: 720 }, facingMode: 'user' }
        : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' };

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false
        });
      } catch (camErr) {
        console.warn('Camera access denied or unavailable:', camErr);
        this.updateStatus('🖱️ ไม่พบกล้อง/ใช้โหมดเมาส์และสัมผัส (Mouse Mode Active)', '#ffb703');
        return false;
      }

      this.video.srcObject = stream;
      await this.video.play();
      this.isCameraActive = true;

      // 2. Initialize MediaPipe Hands if library is loaded
      if (typeof window.Hands !== 'undefined') {
        this.hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        // Use modelComplexity: 0 (Lite) for tablet/smooth mode (3x-4x faster inference!), 1 for high
        this.hands.setOptions({
          maxNumHands: 2,
          modelComplexity: this.qualityMode === 'smooth' ? 0 : 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        this.hands.onResults((results) => {
          this.processMediaPipeResults(results);
        });

        let isSending = false;
        let lastInferenceTime = 0;
        const frameLoop = async () => {
          if (this.isCameraActive && this.hands) {
            const now = performance.now();
            // Frame Pacing: Throttle hands.send() to ~30-33 FPS on tablets (32ms interval)
            // Prevents thermal throttling & 100% CPU lockup on 120Hz/144Hz screens!
            const minInterval = window.isSmoothMode ? 32 : 24;

            if (!isSending && (now - lastInferenceTime >= minInterval) && this.video.readyState >= 2 && this.video.videoWidth > 0) {
              isSending = true;
              lastInferenceTime = now;
              try {
                await this.hands.send({ image: this.video });
              } catch (e) {
                console.warn('Hands frame send warning:', e);
              }
              isSending = false;
            }
            requestAnimationFrame(frameLoop);
          }
        };
        requestAnimationFrame(frameLoop);
        this.updateStatus('🟢 ตรวจจับมือ AR พร้อมทำงาน (Hand Tracking Active)', '#00ff66');
        return true;
      } else {
        this.updateStatus('🟢 กล้องพร้อมทำงาน / ควบคุมด้วยเมาส์หรือสัมผัส', '#00ff66');
        return true;
      }
    } catch (err) {
      console.warn('Camera initialization completed with fallback:', err);
      this.updateStatus('🖱️ ควบคุมด้วยเมาส์/สัมผัส (Mouse Mode Active)', '#00ff66');
      return false;
    }
  }

  processMediaPipeResults(results) {
    const formattedHands = [];
    const width = this.canvas.width;
    const height = this.canvas.height;

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (let i = 0; i < results.multiHandLandmarks.length; i++) {
        const rawLandmarks = results.multiHandLandmarks[i];

        // 1. Lowered Hand Check: If wrist or palm is at the bottom boundary (y > 0.94),
        // the player has taken their hand down or is exiting frame! Discard immediately.
        if (rawLandmarks[0].y > 0.94) {
          continue;
        }

        const handedness = results.multiHandedness && results.multiHandedness[i] 
          ? results.multiHandedness[i].label 
          : (i === 0 ? 'Right' : 'Left');

        // Virtual Canvas Margin Compensation (Overscan Calibration)
        // Maps comfortable arm movement range [15%, 85%] horizontally and [10%, 90%] vertically to [0, 100%]
        // Guarantees effortless corner-to-corner reach across all 4 screen corners!
        const MARGIN_X = 0.15;       // 15% horizontal margin on each side
        const MARGIN_TOP = 0.10;     // 10% top margin
        const MARGIN_BOTTOM = 0.10;  // 10% bottom margin

        // Convert all landmarks to mirrored pixel coordinates with edge compensation
        const lmPixels = rawLandmarks.map(lm => {
          // Mirrored horizontal: 0 is right in camera, 1 is left
          const normX = 1.0 - lm.x;
          const scaledX = (normX - MARGIN_X) / (1.0 - 2 * MARGIN_X);
          const clampedX = Math.max(0, Math.min(1, scaledX)) * width;

          const scaledY = (lm.y - MARGIN_TOP) / (1.0 - MARGIN_TOP - MARGIN_BOTTOM);
          const clampedY = Math.max(0, Math.min(1, scaledY)) * height;

          return {
            x: clampedX,
            y: clampedY,
            z: lm.z
          };
        });

        const wrist = lmPixels[0];
        const indexMcp = lmPixels[5];
        const indexPip = lmPixels[6];
        const indexTip = lmPixels[8];
        const middleMcp = lmPixels[9];
        const middlePip = lmPixels[10];
        const middleTip = lmPixels[12];
        const ringPip = lmPixels[14];
        const ringTip = lmPixels[16];
        const pinkyPip = lmPixels[18];
        const pinkyTip = lmPixels[20];
        const palmCenter = middleMcp;

        // Scale-invariant palm reference size
        const palmSize = Math.hypot(middleMcp.x - wrist.x, middleMcp.y - wrist.y) || 60;

        // Distances of Tips and PIP joints from wrist
        const distIndexTip = Math.hypot(indexTip.x - wrist.x, indexTip.y - wrist.y);
        const distMiddleTip = Math.hypot(middleTip.x - wrist.x, middleTip.y - wrist.y);
        const distRingTip = Math.hypot(ringTip.x - wrist.x, ringTip.y - wrist.y);
        const distPinkyTip = Math.hypot(pinkyTip.x - wrist.x, pinkyTip.y - wrist.y);

        const distIndexPip = Math.hypot(indexPip.x - wrist.x, indexPip.y - wrist.y);
        const distMiddlePip = Math.hypot(middlePip.x - wrist.x, middlePip.y - wrist.y);
        const distRingPip = Math.hypot(ringPip.x - wrist.x, ringPip.y - wrist.y);
        const distPinkyPip = Math.hypot(pinkyPip.x - wrist.x, pinkyPip.y - wrist.y);

        // 2. CLOSED FIST DISCARD (กำหมัด = พักมือ):
        // If all 4 fingers are tightly curled toward palm/wrist, player is resting/disarming this hand
        const isFist = (distIndexTip <= distIndexPip * 1.08) &&
                       (distMiddleTip <= distMiddlePip * 1.08) &&
                       (distRingTip <= distRingPip * 1.08) &&
                       (distPinkyTip <= distPinkyPip * 1.08);

        if (this.isFistDiscardEnabled && isFist) {
          continue; // Discard clenched fist hand
        }

        // Individual finger extensions
        const isIndexExt = distIndexTip > distIndexPip * 1.10 && distIndexTip > palmSize * 1.0;
        const isMiddleExt = distMiddleTip > distMiddlePip * 1.08 && distMiddleTip > palmSize * 0.98;
        const isRingExt = distRingTip > distRingPip * 1.08 && distRingTip > palmSize * 0.90;
        const isPinkyExt = distPinkyTip > distPinkyPip * 1.08 && distPinkyTip > palmSize * 0.80;

        let extendedCount = 0;
        if (isIndexExt) extendedCount++;
        if (isMiddleExt) extendedCount++;
        if (isRingExt) extendedCount++;
        if (isPinkyExt) extendedCount++;

        // 1. OPEN PALM (✋ กางมือ 5 นิ้วรับ):
        // Active if 3+ fingers are extended, OR (index+middle+ring extended),
        // OR middle finger is prominently extended (in an open hand, middle finger is longest)
        const isOpenPalm = (extendedCount >= 3) || 
                           (isIndexExt && isMiddleExt && isRingExt) ||
                           (isMiddleExt && distMiddleTip > distIndexTip * 0.92);

        // 2. SINGLE-FINGER KNIFE BLADE (🗡️ ชี้ 1 นิ้วมีด/ดาบ):
        // Index finger extended without 3+ open fingers. Any non-open-palm, non-fist hand acts as a precision knife blade!
        const isIndexDominant = (distIndexTip > distMiddleTip * 1.05) &&
                                (distIndexTip > distRingTip * 1.08);
        const isSingleFingerBlade = (isIndexExt && isIndexDominant && !isOpenPalm) || (!isOpenPalm);
        const isKnifeHand = isSingleFingerBlade;

        formattedHands.push({
          id: i,
          handedness: handedness,
          wrist: wrist,
          indexTip: indexTip, // Anchor for blade tracking
          palmCenter: palmCenter,
          isOpenPalm: isOpenPalm,
          isKnifeHand: isKnifeHand,
          isSingleFingerBlade: isSingleFingerBlade,
          palmSize: palmSize,
          rawLandmarks: lmPixels
        });
      }
    }

    if (formattedHands.length > 0) {
      this.hasPhysicalHands = true;
      if (this.onResults) {
        this.onResults(formattedHands);
      }
    } else {
      // CRITICAL BUG FIX: When hands are lowered or out of frame,
      // IMMEDIATELY notify with empty array [] so game clears lingering ghost cursors!
      this.hasPhysicalHands = false;
      if (this.onResults) {
        this.onResults([]);
      }
    }
  }

  // Mouse & Touch Simulation fallback
  setupSimulatorEvents() {
    let isMouseDown = false;

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.isSimOpenPalm = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.isSimOpenPalm = false;
      }
    });

    const updateMouseHand = (clientX, clientY, isDown) => {
      // Only inject mouse hands if camera is NOT running OR user explicitly toggled simulator mode
      if (this.isCameraActive && !this.isSimulatedOnly) {
        return;
      }

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / (rect.width || 1);
      const scaleY = this.canvas.height / (rect.height || 1);
      const rawX = (clientX - rect.left) * scaleX;
      const rawY = (clientY - rect.top) * scaleY;
      const x = Math.max(0, Math.min(this.canvas.width, rawX));
      const y = Math.max(0, Math.min(this.canvas.height, rawY));

      // When dragging or holding Spacebar -> open palm containment mode; otherwise -> knife hand blade mode
      const isCatchMode = this.isSimOpenPalm || isDown;

      this.simHands = [{
        id: 99,
        handedness: x < this.canvas.width / 2 ? 'Left' : 'Right',
        wrist: { x: x, y: y + 60, z: 0 },
        indexTip: { x: x, y: y, z: 0 },
        palmCenter: { x: x, y: y + 25, z: 0 },
        isOpenPalm: isCatchMode,
        isKnifeHand: !isCatchMode,
        isSingleFingerBlade: !isCatchMode,
        rawLandmarks: []
      }];

      if (this.onResults) {
        this.onResults(this.simHands);
      }
    };

    window.addEventListener('mousemove', (e) => {
      updateMouseHand(e.clientX, e.clientY, isMouseDown);
    });

    window.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      updateMouseHand(e.clientX, e.clientY, true);
    });

    window.addEventListener('mouseup', () => {
      isMouseDown = false;
    });

    // Touch event support for tablets & smartphones
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updateMouseHand(e.touches[0].clientX, e.touches[0].clientY, true);
      }
    }, { passive: true });

    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        updateMouseHand(e.touches[0].clientX, e.touches[0].clientY, true);
      }
    }, { passive: true });

    // When mouse exits the window, clear mouse hand immediately
    window.addEventListener('mouseleave', () => {
      if (!this.isCameraActive || this.isSimulatedOnly) {
        this.simHands = [];
        if (this.onResults) {
          this.onResults([]);
        }
      }
    });
  }

  enableSimulator(state = true) {
    this.isSimulatedOnly = state;
    if (!state && this.onResults) {
      this.simHands = [];
      this.onResults([]);
    }
    return this.isSimulatedOnly;
  }
}


// ==========================================
// Source: js/entities/particle-system.js
// ==========================================
// Cyber Ninja: Firewall Slasher - Visual Effects & Particle Systems

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.splitSlices = []; // Sliced entity halves flying apart
    this.screenFlashes = []; // Screen flash effects
  }

  // 1. Emit glowing laser sparks at collision point
  emitSparks(x, y, color = '#00f3ff', count = 16, baseSpeed = 300) {
    const isSmooth = Boolean(window.isSmoothMode);
    const maxBudget = isSmooth ? 30 : 90;
    if (this.particles.length >= maxBudget) return;

    const actualCount = isSmooth ? Math.min(count, 7) : count;

    for (let i = 0; i < actualCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 0.7 + 0.3) * baseSpeed;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: color,
        alpha: 1.0,
        decay: Math.random() * 1.5 + 1.2, // alpha loss per second
        shape: Math.random() > 0.4 ? 'square' : 'circle' // Cyber digital squares
      });
    }
  }

  // 2. Split an entity into two halved pieces flying apart
  emitSplitSlice(entity, slashAngle) {
    const normalAngle = slashAngle + Math.PI / 2;
    const separationSpeed = 260;

    // Piece 1 (Top/Left half)
    this.splitSlices.push({
      img: entity.imgElement,
      x: entity.x,
      y: entity.y,
      vx: Math.cos(normalAngle) * separationSpeed,
      vy: Math.sin(normalAngle) * separationSpeed - 120,
      radius: entity.radius,
      rotation: 0,
      vRot: (Math.random() - 0.5) * 8,
      alpha: 1.0,
      decay: 1.8,
      clipSide: 1, // Cut top/left
      color: entity.color,
      slashAngle: slashAngle
    });

    // Piece 2 (Bottom/Right half)
    this.splitSlices.push({
      img: entity.imgElement,
      x: entity.x,
      y: entity.y,
      vx: -Math.cos(normalAngle) * separationSpeed,
      vy: -Math.sin(normalAngle) * separationSpeed - 120,
      radius: entity.radius,
      rotation: 0,
      vRot: (Math.random() - 0.5) * 8,
      alpha: 1.0,
      decay: 1.8,
      clipSide: -1, // Cut bottom/right
      color: entity.color,
      slashAngle: slashAngle
    });
  }

  // 3. Screen Flash (Glitch red or Victory gold/cyan)
  addScreenFlash(color = '#ff0055', duration = 0.25, maxAlpha = 0.4) {
    this.screenFlashes.push({
      color: color,
      duration: duration,
      elapsed: 0,
      maxAlpha: maxAlpha
    });
  }

  update(dt) {
    // Update sparks
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 200 * dt; // slight gravity
      p.alpha -= p.decay * dt;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update split slices
    for (let i = this.splitSlices.length - 1; i >= 0; i--) {
      const s = this.splitSlices[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vy += 450 * dt; // gravity
      s.rotation += s.vRot * dt;
      s.alpha -= s.decay * dt;
      if (s.alpha <= 0) {
        this.splitSlices.splice(i, 1);
      }
    }

    // Update screen flashes
    for (let i = this.screenFlashes.length - 1; i >= 0; i--) {
      const f = this.screenFlashes[i];
      f.elapsed += dt;
      if (f.elapsed >= f.duration) {
        this.screenFlashes.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.save();

    // Render screen flashes
    for (const f of this.screenFlashes) {
      const progress = f.elapsed / f.duration;
      const alpha = (1.0 - progress) * f.maxAlpha;
      ctx.fillStyle = f.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // Render sliced halves
    for (const s of this.splitSlices) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);

      // Clip half
      ctx.beginPath();
      if (s.clipSide === 1) {
        ctx.rect(-s.radius - 10, -s.radius - 10, (s.radius + 10) * 2, s.radius + 10);
      } else {
        ctx.rect(-s.radius - 10, 0, (s.radius + 10) * 2, s.radius + 10);
      }
      ctx.clip();

      if (s.img && s.img.complete && s.img.naturalWidth > 0) {
        ctx.drawImage(s.img, -s.radius, -s.radius, s.radius * 2, s.radius * 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
      }

      // Neon slice laser cut border
      if (window.isSmoothMode) {
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-s.radius, 0);
        ctx.lineTo(s.radius, 0);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-s.radius, 0);
        ctx.lineTo(s.radius, 0);
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#00f3ff';
        ctx.beginPath();
        ctx.moveTo(-s.radius, 0);
        ctx.lineTo(s.radius, 0);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Render particles & sparks
    const isSmooth = Boolean(window.isSmoothMode);
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;

      if (!isSmooth) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
      }

      if (p.shape === 'square') {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  clear() {
    this.particles = [];
    this.splitSlices = [];
    this.screenFlashes = [];
  }
}


// ==========================================
// Source: js/entities/malware.js
// ==========================================
// Cyber Ninja: Firewall Slasher - Malware Threat Entity


class Malware {
  constructor(typeData, x, y, vx, vy) {
    this.id = typeData.id;
    this.typeData = typeData;
    this.nameTH = typeData.nameTH;
    this.nameEN = typeData.nameEN;
    this.descTH = typeData.descTH;
    this.descEN = typeData.descEN;
    this.points = typeData.points;
    this.color = typeData.color;
    this.radius = typeData.radius || 50;

    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.gravity = 280; // Parabolic trajectory
    this.rotation = 0;
    this.vRot = (Math.random() - 0.5) * 3;

    this.isDead = false;
    this.isSlashed = false;
    this.isOffscreen = false;

    // Load sprite image
    this.imgElement = new Image();
    this.imgElement.src = typeData.image;
  }

  get name() {
    return i18n.lang === 'th' ? this.nameTH : this.nameEN;
  }

  get desc() {
    return i18n.lang === 'th' ? this.descTH : this.descEN;
  }

  update(dt) {
    if (this.isDead) return;

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += this.gravity * dt;
    this.rotation += this.vRot * dt;

    // Off-screen check
    if (this.y > 800 || this.x < -100 || this.x > 1400) {
      this.isOffscreen = true;
      this.isDead = true;
    }
  }

  render(ctx) {
    if (this.isDead) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Glowing Threat Aura
    if (!window.isSmoothMode) {
      ctx.shadowBlur = 18;
      ctx.shadowColor = this.color;
    }

    // Hexagonal / Circular Cyber Base
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0a14';
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = this.color;
    ctx.stroke();

    // Inner Threat Sprite
    if (this.imgElement.complete && this.imgElement.naturalWidth > 0) {
      const spriteSize = this.radius * 1.6;
      ctx.drawImage(this.imgElement, -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize);
    } else {
      // Fallback stylized icon
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    ctx.restore();

    // Render threat label above
    ctx.save();
    ctx.font = 'bold 13px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#ffffff';
    if (!window.isSmoothMode) {
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
    }
    ctx.textAlign = 'center';
    ctx.fillText(this.name, this.x, this.y - this.radius - 12);
    ctx.restore();
  }
}


// ==========================================
// Source: js/entities/safe-packet.js
// ==========================================
// Cyber Ninja: Firewall Slasher - Safe Data Packet Entity (Catch with Open Palm!)


class SafePacket {
  constructor(typeData, x, y, vx, vy) {
    this.id = typeData.id;
    this.typeData = typeData;
    this.nameTH = typeData.nameTH;
    this.nameEN = typeData.nameEN;
    this.descTH = typeData.descTH;
    this.descEN = typeData.descEN;
    this.points = typeData.points;
    this.serverHpBonus = typeData.serverHpBonus || 20;
    this.penaltyPoints = typeData.penaltyPoints || 80;
    this.color = typeData.color || '#ffb703';
    this.radius = typeData.radius || 52;

    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.gravity = 140; // Floats slower and lighter than malware
    this.floatPhase = Math.random() * Math.PI * 2;

    this.isDead = false;
    this.isCaught = false;
    this.isSlashed = false;
    this.isOffscreen = false;

    // Load sprite image
    this.imgElement = new Image();
    this.imgElement.src = typeData.image;
  }

  get name() {
    return i18n.lang === 'th' ? this.nameTH : this.nameEN;
  }

  get desc() {
    return i18n.lang === 'th' ? this.descTH : this.descEN;
  }

  // Magnetic attraction toward open palm
  pullTowardPalm(palmX, palmY, dt) {
    const dx = palmX - this.x;
    const dy = palmY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 5) {
      const pullSpeed = 480;
      this.x += (dx / dist) * pullSpeed * dt;
      this.y += (dy / dist) * pullSpeed * dt;
    }
  }

  update(dt) {
    if (this.isDead) return;

    this.floatPhase += dt * 3;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += this.gravity * dt;

    if (this.y > 800 || this.x < -100 || this.x > 1400) {
      this.isOffscreen = true;
      this.isDead = true;
    }
  }

  render(ctx) {
    if (this.isDead) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    // Pulsating golden/cyan shield aura
    const pulse = Math.sin(this.floatPhase) * 6;
    if (!window.isSmoothMode) {
      ctx.shadowBlur = 24 + pulse;
      ctx.shadowColor = this.color;
    }

    // Glowing protective containment ring
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + pulse / 2, 0, Math.PI * 2);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.stroke();

    // Dark solid backdrop
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#06101e';
    ctx.fill();

    // Inner Safe Sprite
    if (this.imgElement.complete && this.imgElement.naturalWidth > 0) {
      const spriteSize = this.radius * 1.6;
      ctx.drawImage(this.imgElement, -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    ctx.restore();

    // Prominent "CATCH! (แบมือรับ)" banner above packet
    ctx.save();
    ctx.font = '900 13px "Rajdhani", "Kanit", sans-serif';
    ctx.textAlign = 'center';
    
    // Background pill badge
    const badgeText = i18n.lang === 'th' ? '✋ แบมือรับ (ห้ามฟัน!)' : '✋ CATCH (DO NOT SLASH!)';
    const textWidth = ctx.measureText(badgeText).width;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(this.x - textWidth / 2 - 8, this.y - this.radius - 28, textWidth + 16, 22, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = this.color;
    if (!window.isSmoothMode) {
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
    }
    ctx.fillText(badgeText, this.x, this.y - this.radius - 13);

    ctx.restore();
  }
}


// ==========================================
// Source: js/entities/floating-pod.js
// ==========================================
// Cyber Ninja: Firewall Slasher - Mid-Air Floating Choice Pods & Ready Sensors



class FloatingPod {
  constructor(options) {
    this.id = options.id;
    this.x = options.x;
    this.y = options.y;
    this.width = options.width || 220;
    this.height = options.height || 100;
    this.label = options.label || '';
    this.sublabel = options.sublabel || '';
    this.color = options.color || '#00e5ff';
    this.textColor = options.textColor || '#ffffff';
    this.onSelect = options.onSelect || null;

    this.fontSize = options.fontSize || 20;
    this.sublabelFontSize = options.sublabelFontSize || 14;
    this.hoverProgress = 0; // 0.0 to 1.0
    this.isTriggered = false;
    this.isArmed = options.isArmed !== false;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.requiredDwell = options.requiredDwell || CONFIG.HOVER_TRIGGER_TIME; // ms
  }

  setArmed(state) {
    this.isArmed = state;
    if (!state) {
      this.hoverProgress = 0;
    }
  }

  update(dt, detectedHands = []) {
    if (this.isTriggered || !this.isArmed) return;

    this.pulsePhase += dt * 4;

    let isHandInside = false;

    // Check if any hand tip or palm is inside bounding box
    for (const h of detectedHands) {
      // Check hover inside box
      if (
        GestureDetector.pointInRect(h.tip.x, h.tip.y, this.x, this.y, this.width, this.height) ||
        GestureDetector.pointInRect(h.palm.x, h.palm.y, this.x, this.y, this.width, this.height)
      ) {
        isHandInside = true;
      }

      // Also allow instant slash cut through the pod
      if (h.isSlashing && h.slashSegment) {
        const seg = h.slashSegment;
        // Midpoint of slash
        const midX = (seg.x1 + seg.x2) / 2;
        const midY = (seg.y1 + seg.y2) / 2;
        if (GestureDetector.pointInRect(midX, midY, this.x, this.y, this.width, this.height)) {
          this.trigger();
          return;
        }
      }
    }

    if (isHandInside) {
      this.hoverProgress += (dt * 1000) / this.requiredDwell;
      if (this.hoverProgress >= 1.0) {
        this.hoverProgress = 1.0;
        this.trigger();
      }
    } else {
      this.hoverProgress = Math.max(0, this.hoverProgress - dt * 2.5);
    }
  }

  trigger() {
    if (this.isTriggered) return;
    this.isTriggered = true;
    if (this.onSelect) {
      this.onSelect(this);
    }
  }

  render(ctx) {
    ctx.save();

    const pulse = Math.sin(this.pulsePhase) * 4;
    ctx.shadowBlur = 16 + (this.hoverProgress * 15) + pulse;
    ctx.shadowColor = this.color;

    // Pod background
    ctx.fillStyle = this.isTriggered ? this.color : 'rgba(10, 15, 26, 0.88)';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.isTriggered ? 5 : 3;

    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 12);
    ctx.fill();
    ctx.stroke();

    // Dwell Progress Gauge Fill
    if (this.hoverProgress > 0 && !this.isTriggered) {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.roundRect(this.x, this.y, this.width * this.hoverProgress, this.height, 12);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Border Highlight
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);

    // Text labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const mainFont = this.fontSize || 20;
    ctx.font = `900 ${mainFont}px "Rajdhani", "Kanit", sans-serif`;
    ctx.fillStyle = this.isTriggered ? '#000000' : this.textColor;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fillText(this.label, this.x + this.width / 2, this.y + (this.sublabel ? this.height / 2 - 14 : this.height / 2));

    if (this.sublabel) {
      const subFont = this.sublabelFontSize || 14;
      ctx.font = `bold ${subFont}px "Rajdhani", "Kanit", sans-serif`;
      if (!this.isArmed) {
        ctx.fillStyle = '#ffb703';
        ctx.fillText('🔒 กำลังเตรียมระบบ (อ่านคำถามก่อนเลือก)...', this.x + this.width / 2, this.y + this.height / 2 + 18);
      } else {
        ctx.fillStyle = this.isTriggered ? '#111111' : 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(this.sublabel, this.x + this.width / 2, this.y + this.height / 2 + 18);
      }
    }

    ctx.restore();
  }

  reset() {
    this.hoverProgress = 0;
    this.isTriggered = false;
  }
}


// ==========================================
// Source: js/modes/score-attack.js
// ==========================================







class ScoreAttackMode {
  constructor(game) {
    this.game = game;
    this.active = false;
    this.timeLeft = CONFIG.SCORE_ATTACK_DURATION;
    this.difficulty = DIFFICULTY_LEVELS[1];
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.lastHitTime = 0;
    
    this.malwareSlain = 0;
    this.safePacketsCaught = 0;
    this.penalties = 0;
    this.selectedTeam = CONFIG.TEAMS[0].id;

    this.entities = [];
    this.spawnTimer = 0;
    this.spawnInterval = 1.3; // Seconds

    // Floating Quiz State
    this.activeQuiz = null;
    this.quizPods = [];
    this.hasQuizTriggered = false;
    this.quizTimer = 0;
    this.quizMaxTime = 10;
    this.quizArmingTimer = 0;
    this.lastQuizBeepInt = 0;
  }

  start(teamId = 'alpha', difficultyLevel = 2) {
    this.active = true;
    this.timeLeft = CONFIG.SCORE_ATTACK_DURATION;
    const diffObj = DIFFICULTY_LEVELS.find(d => d.level === Number(difficultyLevel));
    this.difficulty = diffObj || DIFFICULTY_LEVELS[1];

    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.malwareSlain = 0;
    this.safePacketsCaught = 0;
    this.penalties = 0;
    this.selectedTeam = teamId;
    this.entities = [];
    this.spawnTimer = 0;
    this.spawnInterval = 1.3 * this.difficulty.spawnIntervalMult;
    this.hasQuizTriggered = false;
    this.activeQuiz = null;
    this.quizPods = [];
    this.quizTimer = 0;
    this.quizMaxTime = 10;
    this.quizArmingTimer = 0;
    this.lastQuizBeepInt = 0;

    audio.playBGM(1); // Mode 1 Upbeat Synthwave BGM
    audio.playCountdown(true);
  }

  getMultiplier() {
    if (this.combo >= 15) return 5;
    if (this.combo >= 10) return 3;
    if (this.combo >= 6) return 2;
    if (this.combo >= 3) return 1.5;
    return 1;
  }

  spawnEntity() {
    const isSafe = Math.random() < this.difficulty.safeRatio;
    const spawnX = Math.random() * (CONFIG.CANVAS_WIDTH - 240) + 120;
    const spawnY = CONFIG.CANVAS_HEIGHT + 30; // Launch upwards from bottom
    const speedMult = this.difficulty.speedMult;
    const vx = ((CONFIG.CANVAS_WIDTH / 2 - spawnX) * 0.35 + (Math.random() - 0.5) * 120) * speedMult;
    const vy = -(Math.random() * 140 + 440) * speedMult; // Launch velocity

    if (isSafe) {
      const type = SAFE_PACKET_TYPES[Math.floor(Math.random() * SAFE_PACKET_TYPES.length)];
      this.entities.push(new SafePacket(type, spawnX, spawnY, vx * 0.8, vy * 0.85));
    } else {
      const type = MALWARE_TYPES[Math.floor(Math.random() * MALWARE_TYPES.length)];
      this.entities.push(new Malware(type, spawnX, spawnY, vx, vy));
    }
  }

  triggerQuiz() {
    const q = QUIZ_DATABASE[Math.floor(Math.random() * QUIZ_DATABASE.length)];
    this.activeQuiz = q;

    // Difficulty-based countdown:
    // Level 1: 10s, Level 2: 9s, Level 3: 8s, Level 4: 7s, Level 5: 5s
    const level = this.difficulty && this.difficulty.level ? this.difficulty.level : 2;
    const timeLimits = { 1: 10.0, 2: 9.0, 3: 8.0, 4: 7.0, 5: 5.0 };
    this.quizMaxTime = timeLimits[level] || 9.0;
    this.quizTimer = this.quizMaxTime;
    this.lastQuizBeepInt = Math.ceil(this.quizTimer);

    // ANTI-MISCLICK GUARD:
    // 1. Reset all tracking states so an already-extended hand doesn't instantly misclick
    if (this.game) {
      this.game.detectedHands = [];
      this.game.trailP1?.clear();
      this.game.trailP2?.clear();
      this.game.gestureDetector?.reset();
      this.game.lastHandTimestamp = performance.now();
    }

    // 2. Arming grace delay of 1.0 second: during this second, pods are locked and disarmed
    this.quizArmingTimer = 1.0;

    audio.playFreeze();
    this.game.particles.addScreenFlash('#00f3ff', 0.5, 0.4);

    // Create 2 large, spacious choice cards (A Left, B Right)
    const podW = 510;
    const podH = 160;
    const podY = 475;

    this.quizPods = [
      new FloatingPod({
        id: 'podA',
        x: 90,
        y: podY,
        width: podW,
        height: podH,
        fontSize: 22,
        sublabelFontSize: 14,
        label: i18n.lang === 'th' ? `A) ${q.optionA.textTH}` : `A) ${q.optionA.textEN}`,
        sublabel: i18n.lang === 'th' ? '✋ กางมือค้าง หรือ 🗡️ ฟันดาบเลือกข้อ A' : '✋ Open Palm Hold or 🗡️ Slash A',
        color: '#00e5ff',
        isArmed: false,
        requiredDwell: 550,
        onSelect: () => this.handleQuizAnswer('A')
      }),
      new FloatingPod({
        id: 'podB',
        x: CONFIG.CANVAS_WIDTH - 90 - podW,
        y: podY,
        width: podW,
        height: podH,
        fontSize: 22,
        sublabelFontSize: 14,
        label: i18n.lang === 'th' ? `B) ${q.optionB.textTH}` : `B) ${q.optionB.textEN}`,
        sublabel: i18n.lang === 'th' ? '✋ กางมือค้าง หรือ 🗡️ ฟันดาบเลือกข้อ B' : '✋ Open Palm Hold or 🗡️ Slash B',
        color: '#ff0055',
        isArmed: false,
        requiredDwell: 550,
        onSelect: () => this.handleQuizAnswer('B')
      })
    ];
  }

  handleQuizAnswer(choice) {
    if (!this.activeQuiz) return;
    const isA = choice === 'A';
    const isCorrect = (isA && this.activeQuiz.optionA.isCorrect) || (!isA && this.activeQuiz.optionB.isCorrect);

    if (isCorrect) {
      this.score += 250 * this.getMultiplier();
      this.combo += 2;
      this.game.particles.addScreenFlash('#00ff66', 0.5, 0.4);
      this.game.particles.emitSparks(CONFIG.CANVAS_WIDTH / 2, 340, '#00ff66', 40, 450);
      audio.playCatch();
      audio.playVictory();
    } else {
      this.score = Math.max(0, this.score - 100);
      this.combo = 0;
      this.game.particles.addScreenFlash('#ff0055', 0.5, 0.4);
      audio.playPenalty();
    }

    this.activeQuiz = null;
    this.quizPods = [];
  }

  handleQuizTimeout() {
    if (!this.activeQuiz) return;
    this.score = Math.max(0, this.score - 100);
    this.combo = 0;
    this.game.particles.addScreenFlash('#ff0055', 0.5, 0.5);
    audio.playPenalty();

    this.activeQuiz = null;
    this.quizPods = [];
  }

  update(dt, detectedHands = []) {
    if (!this.active) return;

    // IF QUIZ IS ACTIVE:
    // GAME CLOCK AND FALLING ENTITIES ARE 100% FROZEN!
    if (this.activeQuiz) {
      if (this.quizArmingTimer > 0) {
        this.quizArmingTimer -= dt;
        if (this.quizArmingTimer <= 0) {
          this.quizArmingTimer = 0;
          for (const pod of this.quizPods) {
            pod.setArmed(true);
          }
        }
      } else {
        this.quizTimer -= dt;

        // Beep on each integer second tick
        const currentInt = Math.ceil(this.quizTimer);
        if (currentInt < this.lastQuizBeepInt && currentInt > 0) {
          this.lastQuizBeepInt = currentInt;
          audio.playCountdown(false);
        }

        if (this.quizTimer <= 0) {
          this.quizTimer = 0;
          this.handleQuizTimeout();
          return;
        }
      }

      for (const pod of this.quizPods) {
        pod.update(dt, detectedHands);
      }
      return; // Freeze rest of the game loop during quiz
    }

    // REGULAR GAME LOOP (when quiz is not active):
    // Timer countdown
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.endGame();
      return;
    }

    // Combo timeout check
    if (this.combo > 0 && (performance.now() - this.lastHitTime) > CONFIG.COMBO_TIMEOUT) {
      this.combo = 0;
    }

    // Quiz trigger at 30 seconds mark
    if (!this.hasQuizTriggered && this.timeLeft <= 30) {
      this.hasQuizTriggered = true;
      this.triggerQuiz();
      return;
    }

    // Spawning logic
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnEntity();
      // Increase spawn rate as time runs down
      this.spawnInterval = Math.max(0.7, 1.3 - (60 - this.timeLeft) * 0.01);
    }

    // Update entities
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const ent = this.entities[i];
      ent.update(dt);

      // Check interactions with hands
      for (const h of detectedHands) {
        // A. CATCH LOGIC (Safe Packets + Open Palm)
        if (ent instanceof SafePacket && !ent.isDead) {
          if (h.isCatching) {
            const dist = Math.hypot(h.palm.x - ent.x, h.palm.y - ent.y);
            if (dist <= CONFIG.PALM_CATCH_RADIUS + ent.radius) {
              ent.pullTowardPalm(h.palm.x, h.palm.y, dt);
              if (dist < 58) {
                // Caught!
                ent.isDead = true;
                ent.isCaught = true;
                this.safePacketsCaught++;
                this.score += ent.points * this.getMultiplier();
                this.combo++;
                this.maxCombo = Math.max(this.maxCombo, this.combo);
                this.lastHitTime = performance.now();
                
                audio.playCatch();
                this.game.particles.emitSparks(ent.x, ent.y, ent.color, 24, 300);
                this.game.particles.addScreenFlash(ent.color, 0.15, 0.2);
              }
            }
          }
        }

        // B. SLASH LOGIC (Malware OR Accidental Knife-Hand Slash on Safe Packet)
        // Strictly ignore any slash if the hand is in Open Palm Catch mode
        if (h.isSlashing && !h.isCatching && h.slashSegment && !ent.isDead) {
          const seg = h.slashSegment;
          const hit = GestureDetector.segmentIntersectsCircle(
            seg.x1, seg.y1, seg.x2, seg.y2, ent.x, ent.y, ent.radius
          );

          if (hit) {
            if (ent instanceof Malware) {
              // Slashed malware!
              ent.isDead = true;
              ent.isSlashed = true;
              this.malwareSlain++;
              this.score += ent.points * this.getMultiplier();
              this.combo++;
              this.maxCombo = Math.max(this.maxCombo, this.combo);
              this.lastHitTime = performance.now();

              audio.playSlash();
              audio.playHit();
              this.game.particles.emitSplitSlice(ent, seg.angle);
              this.game.particles.emitSparks(ent.x, ent.y, ent.color, 20, 320);
            } else if (ent instanceof SafePacket) {
              // ACCIDENTAL KNIFE-HAND SLASH OF SAFE DATA -> PENALTY!
              ent.isDead = true;
              ent.isSlashed = true;
              this.penalties++;
              this.score = Math.max(0, this.score - ent.penaltyPoints);
              this.combo = 0; // Break combo

              audio.playPenalty();
              this.game.particles.emitSplitSlice(ent, seg.angle);
              this.game.particles.emitSparks(ent.x, ent.y, '#ff0055', 24, 360);
              this.game.particles.addScreenFlash('#ff0055', 0.25, 0.35);
            }
          }
        }
      }

      if (ent.isDead) {
        this.entities.splice(i, 1);
      }
    }
  }

  render(ctx) {
    if (!this.active) return;

    // Render falling entities
    for (const ent of this.entities) {
      ent.render(ctx);
    }

    // Render Quiz if active
    if (this.activeQuiz) {
      ctx.save();

      // 1. Full-screen Dark Cyber Fade
      ctx.fillStyle = 'rgba(2, 6, 18, 0.95)';
      ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

      // Neon Cyber Frame & Corner Tech Accents
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#00f3ff';
      ctx.strokeRect(30, 20, CONFIG.CANVAS_WIDTH - 60, CONFIG.CANVAS_HEIGHT - 40);

      const corners = [
        [30, 20], [CONFIG.CANVAS_WIDTH - 30, 20],
        [30, CONFIG.CANVAS_HEIGHT - 20], [CONFIG.CANVAS_WIDTH - 30, CONFIG.CANVAS_HEIGHT - 20]
      ];
      for (const [cx, cy] of corners) {
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(cx - 8, cy - 8, 16, 16);
      }

      // 2. Alert Header
      ctx.textAlign = 'center';
      ctx.font = '900 28px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffb703';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ffb703';
      ctx.fillText('⚠️ CYBER SECURITY QUIZ: ภารกิจตอบคำถามกู้เซิร์ฟเวอร์ ⚠️', CONFIG.CANVAS_WIDTH / 2, 64);

      // 3. Difficulty Badge & Countdown Timer Gauge
      const timerRatio = Math.max(0, this.quizTimer / this.quizMaxTime);
      const timerColor = this.quizTimer <= 3 ? '#ff0055' : (this.quizTimer <= 5 ? '#ffb703' : '#00ff66');

      const barW = 680;
      const barH = 14;
      const barX = (CONFIG.CANVAS_WIDTH - barW) / 2;
      const barY = 86;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 7);
      ctx.fill();

      ctx.fillStyle = timerColor;
      ctx.shadowBlur = 12;
      ctx.shadowColor = timerColor;
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW * timerRatio, barH, 7);
      ctx.fill();

      // Digital Timer Label
      ctx.font = 'bold 22px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = timerColor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = timerColor;
      const timerStr = this.quizArmingTimer > 0
        ? `⚡ ระบบกำลังเตรียมคำถาม... (ปลดล็อกใน ${(this.quizArmingTimer).toFixed(1)}s)`
        : `⏱️ เวลานับถอยหลัง: ${this.quizTimer.toFixed(1)} วินาที [${this.difficulty.nameTH}]`;
      ctx.fillText(timerStr, CONFIG.CANVAS_WIDTH / 2, 130);

      // 4. Large Question Box with High-Contrast Typography
      const qBoxX = 70;
      const qBoxY = 150;
      const qBoxW = CONFIG.CANVAS_WIDTH - 140;
      const qBoxH = 260;

      ctx.fillStyle = 'rgba(8, 16, 32, 0.90)';
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#00e5ff';
      ctx.beginPath();
      ctx.roundRect(qBoxX, qBoxY, qBoxW, qBoxH, 16);
      ctx.fill();
      ctx.stroke();

      // Question Category Tag
      ctx.font = 'bold 15px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#00f3ff';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#00f3ff';
      ctx.fillText('QUESTION / สถานการณ์ภัยคุกคามไซเบอร์', CONFIG.CANVAS_WIDTH / 2, qBoxY + 34);

      // Question Text with 30px bold font
      const qText = i18n.lang === 'th' ? this.activeQuiz.questionTH : this.activeQuiz.questionEN;
      ctx.font = 'bold 30px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#00e5ff';

      // Smart wrapping helper
      const wrapText = (text, maxPx) => {
        const chunks = text.includes(' ') ? text.split(' ') : text.match(/.{1,28}/g) || [text];
        const res = [];
        let cur = '';
        for (const c of chunks) {
          const test = cur ? (text.includes(' ') ? cur + ' ' + c : cur + c) : c;
          if (ctx.measureText(test).width > maxPx && cur) {
            res.push(cur);
            cur = c;
          } else {
            cur = test;
          }
        }
        if (cur) res.push(cur);
        return res;
      };

      const lines = wrapText(qText, qBoxW - 80);
      const totalTextH = lines.length * 42;
      const textStartY = qBoxY + 55 + (qBoxH - 75 - totalTextH) / 2 + 28;
      lines.forEach((line, idx) => {
        ctx.fillText(line, CONFIG.CANVAS_WIDTH / 2, textStartY + idx * 42);
      });

      // 5. Instruction banner below question box
      ctx.font = 'bold 16px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = this.quizArmingTimer > 0 ? '#ffb703' : '#00ff66';
      ctx.shadowBlur = 8;
      ctx.shadowColor = ctx.fillStyle;
      const instruct = this.quizArmingTimer > 0
        ? '🔒 ป้องกันการแตะผิดพลาด: ตัวเลือกกำลังเตรียมความพร้อม กรุณาอ่านโจทย์ก่อนตอบ'
        : '✋ วิธีตอบ: กางมือ 5 นิ้วค้างไว้ที่ตัวเลือก 0.5 วินาที หรือ 🗡️ ใช้นิ้วชี้ฟันดาบเลเซอร์';
      ctx.fillText(instruct, CONFIG.CANVAS_WIDTH / 2, qBoxY + qBoxH + 34);

      // 6. Render Choice Pods
      for (const pod of this.quizPods) {
        pod.render(ctx);
      }

      ctx.restore();
    }
  }

  endGame() {
    this.active = false;
    audio.playVictory();
    this.game.onModeComplete({
      mode: 'score-attack',
      score: this.score,
      maxCombo: this.maxCombo,
      malwareSlain: this.malwareSlain,
      safePacketsCaught: this.safePacketsCaught,
      penalties: this.penalties,
      teamId: this.selectedTeam
    });
  }
}


// ==========================================
// Source: js/modes/split-duel.js
// ==========================================
// Cyber Ninja: Firewall Slasher - Mode 2: 1v1 Split-Screen Duel (Full Timed Competition)








class SplitDuelMode {
  constructor(game) {
    this.game = game;
    this.active = false;

    // Configurable Match Settings
    this.roundDuration = 30; // 15, 30, 60 seconds
    this.totalRounds = 3;    // 1, 3, 5 rounds
    this.currentRound = 1;

    // Player 1 (Left - Blue/Cyan)
    this.scoreP1 = 0;
    this.comboP1 = 0;
    this.maxComboP1 = 0;
    this.slashedP1 = 0;
    this.caughtP1 = 0;
    this.penaltiesP1 = 0;
    this.roundWinsP1 = 0;
    this.roundScoreP1 = 0;

    // Player 2 (Right - Red/Magenta)
    this.scoreP2 = 0;
    this.comboP2 = 0;
    this.maxComboP2 = 0;
    this.slashedP2 = 0;
    this.caughtP2 = 0;
    this.penaltiesP2 = 0;
    this.roundWinsP2 = 0;
    this.roundScoreP2 = 0;

    // State machine: 'READY_WAIT', 'COUNTDOWN', 'ROUND_PLAYING', 'ROUND_SUMMARY', 'MATCH_OVER'
    this.state = 'READY_WAIT';
    this.roundTimeLeft = 30;
    this.countdown = 3;
    this.countdownTimer = 0;
    this.summaryTimer = 0;

    // Interactive Ready Pods
    this.readyPodP1 = null;
    this.readyPodP2 = null;

    // Entities in the duel arena
    this.entitiesP1 = [];
    this.entitiesP2 = [];
    this.spawnTimerP1 = 0;
    this.spawnTimerP2 = 0;
    this.spawnInterval = 1.1;

    this.roundWinner = null;
    this.matchWinner = null;
  }

  start(roundDuration = 30, totalRounds = 3) {
    this.active = true;
    this.roundDuration = Number(roundDuration) || 30;
    this.totalRounds = Number(totalRounds) || 3;
    this.currentRound = 1;

    this.scoreP1 = 0;
    this.comboP1 = 0;
    this.maxComboP1 = 0;
    this.slashedP1 = 0;
    this.caughtP1 = 0;
    this.penaltiesP1 = 0;
    this.roundWinsP1 = 0;

    this.scoreP2 = 0;
    this.comboP2 = 0;
    this.maxComboP2 = 0;
    this.slashedP2 = 0;
    this.caughtP2 = 0;
    this.penaltiesP2 = 0;
    this.roundWinsP2 = 0;

    this.matchWinner = null;
    audio.playBGM(2); // Mode 2 Combat Darksynth BGM

    this.setupReadyPhase();
  }

  setupReadyPhase() {
    this.state = 'READY_WAIT';
    this.roundWinner = null;
    this.roundScoreP1 = 0;
    this.roundScoreP2 = 0;
    this.entitiesP1 = [];
    this.entitiesP2 = [];
    this.spawnTimerP1 = 0;
    this.spawnTimerP2 = 0;

    const midY = CONFIG.CANVAS_HEIGHT / 2 - 50;
    // Left Ready Pod (Player 1 Blue)
    this.readyPodP1 = new FloatingPod({
      id: 'p1_ready',
      x: 100,
      y: midY,
      width: 400,
      height: 120,
      label: 'READY (ยกมือ)',
      sublabel: `P1 BLUE [ROUND ${this.currentRound}/${this.totalRounds}]`,
      color: '#00e5ff',
      textColor: '#00e5ff',
      requiredDwell: 400
    });

    // Right Ready Pod (Player 2 Red)
    this.readyPodP2 = new FloatingPod({
      id: 'p2_ready',
      x: CONFIG.CANVAS_WIDTH - 500,
      y: midY,
      width: 400,
      height: 120,
      label: 'READY (ยกมือ)',
      sublabel: `P2 RED [ROUND ${this.currentRound}/${this.totalRounds}]`,
      color: '#ff0055',
      textColor: '#ff0055',
      requiredDwell: 400
    });
  }

  startCountdown() {
    this.state = 'COUNTDOWN';
    this.countdown = 3;
    this.countdownTimer = 1.0;
    audio.playCountdown(false);
  }

  startRoundPlaying() {
    this.state = 'ROUND_PLAYING';
    this.roundTimeLeft = this.roundDuration;
    this.entitiesP1 = [];
    this.entitiesP2 = [];
    this.roundScoreP1 = 0;
    this.roundScoreP2 = 0;
    this.spawnTimerP1 = 0.2; // Immediate initial spawn
    this.spawnTimerP2 = 0.2;
  }

  spawnEntityForSide(side = 'P1') {
    const isP1 = side === 'P1';
    const isSafe = Math.random() < 0.35;
    const minX = isP1 ? 80 : CONFIG.CANVAS_WIDTH / 2 + 80;
    const maxX = isP1 ? CONFIG.CANVAS_WIDTH / 2 - 80 : CONFIG.CANVAS_WIDTH - 80;
    const spawnX = Math.random() * (maxX - minX) + minX;
    const spawnY = CONFIG.CANVAS_HEIGHT + 20; // Launch upwards

    const vx = (Math.random() - 0.5) * 80;
    const vy = -(Math.random() * 80 + 440);

    if (isSafe) {
      const type = SAFE_PACKET_TYPES[Math.floor(Math.random() * SAFE_PACKET_TYPES.length)];
      const item = new SafePacket(type, spawnX, spawnY, vx, vy);
      if (isP1) this.entitiesP1.push(item);
      else this.entitiesP2.push(item);
    } else {
      const type = MALWARE_TYPES[Math.floor(Math.random() * MALWARE_TYPES.length)];
      const mal = new Malware(type, spawnX, spawnY, vx, vy);
      if (isP1) this.entitiesP1.push(mal);
      else this.entitiesP2.push(mal);
    }
  }

  endRound() {
    this.state = 'ROUND_SUMMARY';
    this.summaryTimer = 3.0;
    this.entitiesP1 = [];
    this.entitiesP2 = [];

    if (this.roundScoreP1 > this.roundScoreP2) {
      this.roundWinner = 'P1';
      this.roundWinsP1++;
      audio.playVictory();
      this.game.particles.addScreenFlash('#00e5ff', 0.5, 0.4);
    } else if (this.roundScoreP2 > this.roundScoreP1) {
      this.roundWinner = 'P2';
      this.roundWinsP2++;
      audio.playVictory();
      this.game.particles.addScreenFlash('#ff0055', 0.5, 0.4);
    } else {
      this.roundWinner = 'DRAW';
      audio.playFreeze();
    }
  }

  finishMatch() {
    this.state = 'MATCH_OVER';
    audio.playVictory();

    // Determine Grand Match Winner
    if (this.roundWinsP1 > this.roundWinsP2 || (this.roundWinsP1 === this.roundWinsP2 && this.scoreP1 > this.scoreP2)) {
      this.matchWinner = 'P1';
    } else if (this.roundWinsP2 > this.roundWinsP1 || (this.roundWinsP1 === this.roundWinsP2 && this.scoreP2 > this.scoreP1)) {
      this.matchWinner = 'P2';
    } else {
      this.matchWinner = 'DRAW';
    }

    if (this.game && this.game.onDuelComplete) {
      this.game.onDuelComplete({
        winner: this.matchWinner,
        p1: {
          score: this.scoreP1,
          roundsWon: this.roundWinsP1,
          slashed: this.slashedP1,
          caught: this.caughtP1,
          penalties: this.penaltiesP1,
          maxCombo: this.maxComboP1
        },
        p2: {
          score: this.scoreP2,
          roundsWon: this.roundWinsP2,
          slashed: this.slashedP2,
          caught: this.caughtP2,
          penalties: this.penaltiesP2,
          maxCombo: this.maxComboP2
        }
      });
    }
  }

  update(dt, detectedHands = []) {
    if (!this.active) return;

    // Split hands by arena side (x < 640 = P1 Blue, x >= 640 = P2 Red)
    const handsP1 = [];
    const handsP2 = [];
    for (const h of detectedHands) {
      if (h.tip.x < CONFIG.CANVAS_WIDTH / 2) {
        handsP1.push(h);
      } else {
        handsP2.push(h);
      }
    }

    // STATE: READY_WAIT
    if (this.state === 'READY_WAIT') {
      this.readyPodP1.update(dt, handsP1);
      this.readyPodP2.update(dt, handsP2);

      if (this.readyPodP1.isTriggered && this.readyPodP2.isTriggered) {
        this.startCountdown();
      }
      return;
    }

    // STATE: COUNTDOWN
    if (this.state === 'COUNTDOWN') {
      this.countdownTimer -= dt;
      if (this.countdownTimer <= 0) {
        this.countdown--;
        if (this.countdown > 0) {
          this.countdownTimer = 1.0;
          audio.playCountdown(false);
        } else {
          audio.playCountdown(true); // DUEL!
          this.startRoundPlaying();
        }
      }
      return;
    }

    // STATE: ROUND_SUMMARY
    if (this.state === 'ROUND_SUMMARY') {
      this.summaryTimer -= dt;
      if (this.summaryTimer <= 0) {
        if (this.currentRound < this.totalRounds) {
          this.currentRound++;
          this.setupReadyPhase();
        } else {
          this.finishMatch();
        }
      }
      return;
    }

    // STATE: ROUND_PLAYING
    if (this.state === 'ROUND_PLAYING') {
      this.roundTimeLeft -= dt;
      if (this.roundTimeLeft <= 0) {
        this.roundTimeLeft = 0;
        this.endRound();
        return;
      }

      // Spawning for P1
      this.spawnTimerP1 += dt;
      if (this.spawnTimerP1 >= this.spawnInterval) {
        this.spawnTimerP1 = 0;
        this.spawnEntityForSide('P1');
      }

      // Spawning for P2
      this.spawnTimerP2 += dt;
      if (this.spawnTimerP2 >= this.spawnInterval) {
        this.spawnTimerP2 = 0;
        this.spawnEntityForSide('P2');
      }

      // Update and check interactions for P1
      this.updateSideEntities(dt, this.entitiesP1, handsP1, 'P1');

      // Update and check interactions for P2
      this.updateSideEntities(dt, this.entitiesP2, handsP2, 'P2');
    }
  }

  updateSideEntities(dt, entities, hands, side) {
    const isP1 = side === 'P1';

    for (let i = entities.length - 1; i >= 0; i--) {
      const ent = entities[i];
      ent.update(dt);

      for (const h of hands) {
        // CATCH LOGIC (Safe packets, 5-finger open shield)
        if (ent instanceof SafePacket && !ent.isDead && h.isCatching) {
          const dist = Math.hypot(h.palm.x - ent.x, h.palm.y - ent.y);
          if (dist <= CONFIG.PALM_CATCH_RADIUS + ent.radius) {
            ent.pullTowardPalm(h.palm.x, h.palm.y, dt);
            if (dist < 58) {
              ent.isDead = true;
              const points = ent.points;
              if (isP1) {
                this.scoreP1 += points;
                this.roundScoreP1 += points;
                this.caughtP1++;
              } else {
                this.scoreP2 += points;
                this.roundScoreP2 += points;
                this.caughtP2++;
              }
              audio.playCatch();
              this.game.particles.emitSparks(ent.x, ent.y, ent.color, 24, 300);
            }
          }
        }

        // SLASH LOGIC (1-Finger Knife Blade, strictly NOT catching)
        if (h.isSlashing && !h.isCatching && h.slashSegment && !ent.isDead) {
          const seg = h.slashSegment;
          const hit = GestureDetector.segmentIntersectsCircle(
            seg.x1, seg.y1, seg.x2, seg.y2, ent.x, ent.y, ent.radius
          );

          if (hit) {
            if (ent instanceof Malware) {
              ent.isDead = true;
              audio.playSlash();
              audio.playHit();
              this.game.particles.emitSplitSlice(ent, seg.angle);

              if (isP1) {
                this.comboP1++;
                this.maxComboP1 = Math.max(this.maxComboP1, this.comboP1);
                const comboMult = Math.min(5, 1 + Math.floor(this.comboP1 / 3) * 0.5);
                const pts = Math.round(ent.points * comboMult);
                this.scoreP1 += pts;
                this.roundScoreP1 += pts;
                this.slashedP1++;
              } else {
                this.comboP2++;
                this.maxComboP2 = Math.max(this.maxComboP2, this.comboP2);
                const comboMult = Math.min(5, 1 + Math.floor(this.comboP2 / 3) * 0.5);
                const pts = Math.round(ent.points * comboMult);
                this.scoreP2 += pts;
                this.roundScoreP2 += pts;
                this.slashedP2++;
              }
            } else if (ent instanceof SafePacket) {
              // Accidental slash on safe packet! Penalty!
              ent.isDead = true;
              audio.playPenalty();
              this.game.particles.emitSplitSlice(ent, seg.angle);
              this.game.particles.addScreenFlash('#ff0055', 0.25, 0.3);

              if (isP1) {
                this.comboP1 = 0;
                this.scoreP1 = Math.max(0, this.scoreP1 - 100);
                this.roundScoreP1 = Math.max(0, this.roundScoreP1 - 100);
                this.penaltiesP1++;
              } else {
                this.comboP2 = 0;
                this.scoreP2 = Math.max(0, this.scoreP2 - 100);
                this.roundScoreP2 = Math.max(0, this.roundScoreP2 - 100);
                this.penaltiesP2++;
              }
            }
          }
        }
      }

      if (ent.isDead || ent.isOffscreen) {
        entities.splice(i, 1);
      }
    }
  }

  render(ctx) {
    if (!this.active) return;

    // 1. Center Dividing Neon Laser Barrier
    ctx.save();
    const midX = CONFIG.CANVAS_WIDTH / 2;
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    ctx.moveTo(midX, 0);
    ctx.lineTo(midX, CONFIG.CANVAS_HEIGHT);
    ctx.stroke();

    // Dividing Laser Core
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#00f3ff';
    ctx.beginPath();
    ctx.moveTo(midX, 0);
    ctx.lineTo(midX, CONFIG.CANVAS_HEIGHT);
    ctx.stroke();
    ctx.restore();

    // 2. Top Arena HUD Header (Scores, Timer, Rounds)
    ctx.save();
    // P1 (Blue) Score & Stats
    ctx.font = '900 28px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#00e5ff';
    ctx.textAlign = 'left';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00e5ff';
    ctx.fillText(`P1 BLUE: ${this.scoreP1.toLocaleString()}`, 30, 48);

    ctx.font = 'bold 16px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`ชนะรอบ: ${this.roundWinsP1} | คอมโบ: x${this.comboP1}`, 30, 74);

    // P2 (Red) Score & Stats
    ctx.font = '900 28px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#ff0055';
    ctx.textAlign = 'right';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff0055';
    ctx.fillText(`P2 RED: ${this.scoreP2.toLocaleString()}`, CONFIG.CANVAS_WIDTH - 30, 48);

    ctx.font = 'bold 16px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`ชนะรอบ: ${this.roundWinsP2} | คอมโบ: x${this.comboP2}`, CONFIG.CANVAS_WIDTH - 30, 74);

    // Center Round & Timer Pill
    const pillW = 220;
    const pillH = 64;
    const pillX = midX - pillW / 2;
    const pillY = 16;
    ctx.fillStyle = 'rgba(9, 14, 26, 0.9)';
    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 2;
    ctx.strokeRect(pillX, pillY, pillW, pillH);
    ctx.fillRect(pillX, pillY, pillW, pillH);

    ctx.font = 'bold 14px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#ffb703';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 0;
    ctx.fillText(`ROUND ${this.currentRound} / ${this.totalRounds}`, midX, pillY + 22);

    ctx.font = '900 28px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${Math.ceil(this.roundTimeLeft)}s`, midX, pillY + 52);
    ctx.restore();

    // 3. Render Entities
    for (const ent of this.entitiesP1) ent.render(ctx);
    for (const ent of this.entitiesP2) ent.render(ctx);

    // 4. Render State Overlays
    if (this.state === 'READY_WAIT') {
      this.readyPodP1.render(ctx);
      this.readyPodP2.render(ctx);
    }

    if (this.state === 'COUNTDOWN') {
      ctx.save();
      ctx.font = '900 110px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffb703';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 24;
      ctx.shadowColor = '#ffb703';
      ctx.fillText(`${this.countdown}`, midX, CONFIG.CANVAS_HEIGHT / 2 + 35);
      ctx.restore();
    }

    if (this.state === 'ROUND_SUMMARY') {
      ctx.save();
      ctx.fillStyle = 'rgba(5, 8, 18, 0.85)';
      ctx.fillRect(0, CONFIG.CANVAS_HEIGHT / 2 - 100, CONFIG.CANVAS_WIDTH, 200);

      ctx.font = '900 48px "Rajdhani", "Kanit", sans-serif';
      ctx.textAlign = 'center';
      if (this.roundWinner === 'P1') {
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 20;
        ctx.fillText(`🏆 P1 (BLUE) ชนะรอบที่ ${this.currentRound}! (+1 รอบ)`, midX, CONFIG.CANVAS_HEIGHT / 2 - 10);
      } else if (this.roundWinner === 'P2') {
        ctx.fillStyle = '#ff0055';
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 20;
        ctx.fillText(`🏆 P2 (RED) ชนะรอบที่ ${this.currentRound}! (+1 รอบ)`, midX, CONFIG.CANVAS_HEIGHT / 2 - 10);
      } else {
        ctx.fillStyle = '#ffb703';
        ctx.shadowColor = '#ffb703';
        ctx.shadowBlur = 20;
        ctx.fillText(`เสมอในรอบที่ ${this.currentRound}! (DRAW)`, midX, CONFIG.CANVAS_HEIGHT / 2 - 10);
      }

      ctx.font = 'bold 24px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`คะแนนในรอบ: P1 (${this.roundScoreP1.toLocaleString()}) VS P2 (${this.roundScoreP2.toLocaleString()})`, midX, CONFIG.CANVAS_HEIGHT / 2 + 45);
      ctx.restore();
    }
  }
}


// ==========================================
// Source: js/modes/firewall-relay.js
// ==========================================
// Cyber Ninja: Firewall Slasher - Mode 3: Co-op Boss Fight (4-10 Runners vs 5 Progressive Cyber Bosses)








// 5 Boss Progression Catalog mapped to Difficulty Levels (1-5)
const BOSS_CATALOG = {
  1: {
    id: 'worm_core',
    assetKey: 'boss_level1',
    nameTH: 'เวิร์มไวรัสดิจิทัล (Matrix Worm Core)',
    nameEN: 'Matrix Worm Core',
    color: '#00ff66',
    title: 'LEVEL 1 BOSS - NOVICE'
  },
  2: {
    id: 'apocalypse_daemon',
    assetKey: 'boss_level2',
    nameTH: 'ปีศาจไซเบอร์ (Apocalypse Daemon)',
    nameEN: 'Apocalypse Daemon',
    color: '#ff0055',
    title: 'LEVEL 2 BOSS - EXPERIENCED'
  },
  3: {
    id: 'quantum_spider',
    assetKey: 'boss_level3',
    nameTH: 'พญาแมงมุมควอนตัม (Quantum Spider Overlord)',
    nameEN: 'Quantum Spider Overlord',
    color: '#b026ff',
    title: 'LEVEL 3 BOSS - SKILLED'
  },
  4: {
    id: 'neon_hydra',
    assetKey: 'boss_level4',
    nameTH: 'มังกรไฮดราเลเวียธาน (Neon Hydra Leviathan)',
    nameEN: 'Neon Hydra Leviathan',
    color: '#00f3ff',
    title: 'LEVEL 4 BOSS - EXPERT'
  },
  5: {
    id: 'zero_day',
    assetKey: 'boss_level5',
    nameTH: 'จอมราชันย์ซีโร่เดย์ (Zero-Day Sovereign)',
    nameEN: 'Zero-Day Sovereign',
    color: '#ffb703',
    title: 'LEVEL 5 BOSS - BLADE MASTER'
  }
};

class FirewallRelayMode {
  constructor(game) {
    this.game = game;
    this.active = false;

    // Configurable Settings
    this.numRunners = 4; // 4 to 10
    this.durationPerRunner = 15; // 15, 20, 30s
    this.difficulty = DIFFICULTY_LEVELS[1]; // Default: Level 2
    this.bossData = BOSS_CATALOG[2];
    this.currentRunner = 1;
    this.runnerTimeLeft = 15;

    // Boss Attributes
    this.bossMaxHp = 600;
    this.bossHp = 600;
    this.bossHurtTimer = 0;
    this.bossHoverTime = 0;
    this.bossShakeIntensity = 0;
    this.bossShakeDuration = 0;
    this.bossShakeIntensity = 0;
    this.bossShakeDuration = 0;

    // Player Ultimate Charge (Charged by catching safe items with 5 fingers)
    this.ultimateCharge = 0; // 0 to 100%
    this.isUltimateReady = false;
    this.ultimateHoldTimer = 0; // Needs 3.0s continuous open palm dwell
    this.ultimateIconPos = { x: CONFIG.CANVAS_WIDTH / 2, y: 440, radius: 56 };

    // First-Time Ultimate Tutorial Pause
    this.hasTaughtUltimate = false;
    this.isFirstUltimateTutorialActive = false;
    this.tutorialPulseTimer = 0;

    // Runner Switch Freeze & Countdown
    this.isSwitchCountdown = false;
    this.switchCountdownTime = 0;
    this.nextRunner = 1;
    this.lastBeepInt = -1;

    // Mission Stats
    this.totalMalwareSlain = 0;
    this.totalSafeCaught = 0;
    this.ultimatesFired = 0;
    this.teamScore = 0;

    this.entities = [];
    this.spawnTimer = 0;
    this.spawnInterval = 0.95;

    this.isSwitchWarning = false;
    this.switchBannerTimer = 0;
    this.isGameOver = false;
    this.isVictory = false;
  }

  start(numRunners = 4, durationPerRunner = 15, difficultyLevel = 2) {
    this.active = true;
    this.numRunners = Math.max(4, Math.min(10, Number(numRunners) || 4));
    this.durationPerRunner = Number(durationPerRunner) || 15;
    
    // Select difficulty and corresponding boss
    const diffObj = DIFFICULTY_LEVELS.find(d => d.level === Number(difficultyLevel));
    this.difficulty = diffObj || DIFFICULTY_LEVELS[1];
    this.bossData = BOSS_CATALOG[this.difficulty.level] || BOSS_CATALOG[2];

    this.currentRunner = 1;
    this.runnerTimeLeft = this.durationPerRunner;

    // Balanced Boss HP: Scaled proportionally by runners and difficulty
    const baseHpPerRunner = 140 * this.difficulty.bossHpMult;
    this.bossMaxHp = Math.round(this.numRunners * baseHpPerRunner);
    this.bossHp = this.bossMaxHp;
    this.bossHurtTimer = 0;
    this.bossHoverTime = 0;

    this.ultimateCharge = 0;
    this.isUltimateReady = false;
    this.ultimateHoldTimer = 0;

    this.hasTaughtUltimate = false;
    this.isFirstUltimateTutorialActive = false;
    this.tutorialPulseTimer = 0;

    this.isSwitchCountdown = false;
    this.switchCountdownTime = 0;
    this.nextRunner = 1;
    this.lastBeepInt = -1;

    this.totalMalwareSlain = 0;
    this.totalSafeCaught = 0;
    this.ultimatesFired = 0;
    this.teamScore = 0;

    this.entities = [];
    this.spawnTimer = 0;
    this.spawnInterval = 0.95 * this.difficulty.spawnIntervalMult;

    this.isSwitchWarning = false;
    this.switchBannerTimer = 0;
    this.isGameOver = false;
    this.isVictory = false;

    audio.playBGM(3); // Mode 3 Epic Boss Fight Theme
  }

  triggerSwitchCountdown() {
    this.isSwitchCountdown = true;
    this.switchCountdownTime = 5.0;
    this.lastBeepInt = 6;
    this.nextRunner = this.currentRunner + 1;
    audio.playFreeze();
    this.game.particles.addScreenFlash('#ff0055', 0.6, 0.5);
  }

  spawnEntity() {
    const isSafe = Math.random() < this.difficulty.safeRatio;
    const spawnX = Math.random() * (CONFIG.CANVAS_WIDTH - 240) + 120;
    const spawnY = -20;
    const speedMult = this.difficulty.speedMult;
    const vx = (Math.random() - 0.5) * (100 * speedMult);
    const vy = (Math.random() * 80 + 170) * speedMult;

    if (isSafe) {
      const type = SAFE_PACKET_TYPES[Math.floor(Math.random() * SAFE_PACKET_TYPES.length)];
      const packet = new SafePacket(type, spawnX, spawnY, vx, vy);
      packet.gravity = 40;
      this.entities.push(packet);
    } else {
      const type = MALWARE_TYPES[Math.floor(Math.random() * MALWARE_TYPES.length)];
      const mal = new Malware(type, spawnX, spawnY, vx, vy);
      mal.gravity = 60;
      this.entities.push(mal);
    }
  }

  fireUltimateAttack() {
    this.ultimatesFired++;
    this.ultimateCharge = 0;
    this.isUltimateReady = false;
    this.ultimateHoldTimer = 0;

    // Massive Damage: 35% of Boss Max HP!
    const ultimateDamage = Math.max(120, Math.round(this.bossMaxHp * 0.35));
    this.bossHp = Math.max(0, this.bossHp - ultimateDamage);
    this.bossHurtTimer = 0.95;
    this.teamScore += 1000;

    // VIOLENT BOSS SCREEN SHAKE on Ultimate Blast Impact!
    this.bossShakeIntensity = 38;
    this.bossShakeDuration = 1.05;

    // Booming Ultimate Sound SFX
    audio.playUltimateBlast();

    // Epic Visual VFX: Screen flash, massive lightning beams up to the boss!
    this.game.particles.addScreenFlash('#ffffff', 0.7, 0.5);
    this.game.particles.emitSparks(CONFIG.CANVAS_WIDTH / 2, 80, this.bossData.color || '#ff0055', 60, 550);
    this.game.particles.emitSparks(CONFIG.CANVAS_WIDTH / 2, 80, '#00f3ff', 60, 550);

    if (this.bossHp <= 0) {
      this.handleBossDefeated();
    }
  }

  handleBossDefeated() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.isVictory = true;
    this.entities = [];

    audio.playVictory();
    this.game.particles.addScreenFlash('#00ff66', 0.8, 0.6);
    this.game.particles.emitSparks(CONFIG.CANVAS_WIDTH / 2, 100, '#ffb703', 80, 600);

    if (this.game && this.game.onBossFightComplete) {
      this.game.onBossFightComplete({
        victory: true,
        score: this.teamScore,
        bossHp: 0,
        bossMaxHp: this.bossMaxHp,
        malwareSlain: this.totalMalwareSlain,
        safeCaught: this.totalSafeCaught,
        ultimatesFired: this.ultimatesFired,
        runners: this.numRunners,
        difficulty: this.difficulty.nameTH,
        bossName: this.bossData.nameTH
      });
    }
  }

  handleMissionFailed() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.isVictory = false;
    audio.playPenalty();

    if (this.game && this.game.onBossFightComplete) {
      this.game.onBossFightComplete({
        victory: false,
        score: this.teamScore,
        bossHp: this.bossHp,
        bossMaxHp: this.bossMaxHp,
        malwareSlain: this.totalMalwareSlain,
        safeCaught: this.totalSafeCaught,
        ultimatesFired: this.ultimatesFired,
        runners: this.numRunners,
        difficulty: this.difficulty.nameTH,
        bossName: this.bossData.nameTH
      });
    }
  }

  update(dt, detectedHands = []) {
    if (!this.active || this.isGameOver) return;

    // =========================================================================
    // 1. RUNNER SWITCH COUNTDOWN STATE (5-4-3-2-1-GO! with complete game pause)
    // =========================================================================
    if (this.isSwitchCountdown) {
      this.switchCountdownTime -= dt;
      const currentInt = Math.ceil(this.switchCountdownTime);
      if (currentInt > 0 && currentInt !== this.lastBeepInt && currentInt <= 5) {
        this.lastBeepInt = currentInt;
        audio.playCountdown(false); // 5, 4, 3, 2, 1 Electronic Beeps
      }

      if (this.switchCountdownTime <= 0) {
        // Countdown finished! GO!
        audio.playCountdown(true); // Final high beep
        audio.playWhistle();       // Whistle
        this.isSwitchCountdown = false;
        this.currentRunner = this.nextRunner;
        this.runnerTimeLeft = this.durationPerRunner;
        this.isSwitchWarning = false;
        this.switchBannerTimer = 1.5;
        this.game.particles.addScreenFlash('#00f3ff', 0.5, 0.4);
      }
      return; // CRITICAL: Stop game clock, entity movement, and spawning while switching!
    }

    // =========================================================================
    // 2. FIRST-TIME ULTIMATE TUTORIAL PAUSE STATE (Practice holding open palm)
    // =========================================================================
    if (this.isFirstUltimateTutorialActive) {
      this.tutorialPulseTimer += dt;

      // Allow player to practice dwelling open hand over the ultimate icon
      let isHoldingOverIcon = false;
      for (const h of detectedHands) {
        if (h.isCatching) {
          const dist = Math.hypot(h.palm.x - this.ultimateIconPos.x, h.palm.y - this.ultimateIconPos.y);
          if (dist <= this.ultimateIconPos.radius + CONFIG.PALM_CATCH_RADIUS * 0.7) {
            isHoldingOverIcon = true;
            break;
          }
        }
      }

      if (isHoldingOverIcon) {
        this.ultimateHoldTimer += dt;
        if (Math.random() < 0.4) {
          this.game.particles.emitSparks(this.ultimateIconPos.x, this.ultimateIconPos.y, '#00f3ff', 4, 140);
        }
        if (this.ultimateHoldTimer >= 3.0) {
          this.isFirstUltimateTutorialActive = false;
          this.fireUltimateAttack();
          return;
        }
      } else {
        this.ultimateHoldTimer = Math.max(0, this.ultimateHoldTimer - dt * 1.5);
      }
      return; // CRITICAL: Freeze game clock, spawning, and entity updates during tutorial practice!
    }

    // =========================================================================
    // 3. REGULAR GAMEPLAY LOOP
    // =========================================================================
    this.bossHoverTime += dt;
    if (this.bossHurtTimer > 0) this.bossHurtTimer -= dt;
    if (this.bossShakeDuration > 0) {
      this.bossShakeDuration -= dt;
      this.bossShakeIntensity = Math.max(0, this.bossShakeIntensity - dt * 32);
    }
    if (this.switchBannerTimer > 0) this.switchBannerTimer -= dt;

    // Runner countdown timer
    this.runnerTimeLeft -= dt;
    if (this.runnerTimeLeft <= 3.2 && !this.isSwitchWarning) {
      this.isSwitchWarning = true;
      audio.playWhistle();
    }

    if (this.runnerTimeLeft <= 0) {
      if (this.currentRunner < this.numRunners) {
        this.triggerSwitchCountdown();
        return;
      } else {
        // All runners have completed their turns! Check result
        if (this.bossHp > 0) {
          this.handleMissionFailed();
        } else {
          this.handleBossDefeated();
        }
        return;
      }
    }

    // Spawn entities
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnEntity();
    }

    // Ultimate Attack Readiness & First-Time Tutorial Trigger
    this.isUltimateReady = this.ultimateCharge >= 100;
    if (this.isUltimateReady && !this.hasTaughtUltimate) {
      this.isFirstUltimateTutorialActive = true;
      this.hasTaughtUltimate = true;
      this.ultimateHoldTimer = 0;
      audio.playCatch();
      return;
    }

    // Regular ultimate holding logic (for subsequent charges)
    if (this.isUltimateReady) {
      let isHoldingOverIcon = false;
      for (const h of detectedHands) {
        if (h.isCatching) {
          const dist = Math.hypot(h.palm.x - this.ultimateIconPos.x, h.palm.y - this.ultimateIconPos.y);
          if (dist <= this.ultimateIconPos.radius + CONFIG.PALM_CATCH_RADIUS * 0.7) {
            isHoldingOverIcon = true;
            break;
          }
        }
      }

      if (isHoldingOverIcon) {
        this.ultimateHoldTimer += dt;
        if (Math.random() < 0.3) {
          this.game.particles.emitSparks(this.ultimateIconPos.x, this.ultimateIconPos.y, '#00f3ff', 2, 80);
        }
        if (this.ultimateHoldTimer >= 3.0) {
          this.fireUltimateAttack();
          return;
        }
      } else {
        this.ultimateHoldTimer = Math.max(0, this.ultimateHoldTimer - dt * 1.5);
      }
    }

    // Update Entities & Interactivity
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const ent = this.entities[i];
      ent.update(dt);

      for (const h of detectedHands) {
        // CATCH LOGIC (Safe Packets, 5-Finger Open Shield)
        if (ent instanceof SafePacket && !ent.isDead && h.isCatching) {
          const dist = Math.hypot(h.palm.x - ent.x, h.palm.y - ent.y);
          if (dist <= CONFIG.PALM_CATCH_RADIUS + ent.radius) {
            ent.pullTowardPalm(h.palm.x, h.palm.y, dt);
            if (dist < 58) {
              ent.isDead = true;
              this.totalSafeCaught++;
              this.teamScore += ent.points;
              
              // Charge ultimate gauge: +25% per safe packet
              this.ultimateCharge = Math.min(100, this.ultimateCharge + 25);
              if (this.ultimateCharge >= 100 && !this.hasTaughtUltimate) {
                this.isFirstUltimateTutorialActive = true;
                this.hasTaughtUltimate = true;
                this.ultimateHoldTimer = 0;
                audio.playCatch();
              }

              audio.playCatch();
              this.game.particles.emitSparks(ent.x, ent.y, ent.color, 24, 300);
            }
          }
        }

        // SLASH LOGIC (1-Finger Knife Blade, strictly NOT catching)
        if (h.isSlashing && !h.isCatching && h.slashSegment && !ent.isDead) {
          const seg = h.slashSegment;
          const hit = GestureDetector.segmentIntersectsCircle(
            seg.x1, seg.y1, seg.x2, seg.y2, ent.x, ent.y, ent.radius
          );

          if (hit) {
            if (ent instanceof Malware) {
              ent.isDead = true;
              this.totalMalwareSlain++;
              this.teamScore += ent.points;

              // Reduce Boss HP by 20 on successful malware slash!
              const dmg = 20;
              this.bossHp = Math.max(0, this.bossHp - dmg);
              this.bossHurtTimer = 0.25;
              this.bossShakeIntensity = Math.max(this.bossShakeIntensity, 9);
              this.bossShakeDuration = Math.max(this.bossShakeDuration, 0.25);

              audio.playSlash();
              audio.playHit();
              this.game.particles.emitSplitSlice(ent, seg.angle);

              // Sparks fly up towards boss
              this.game.particles.emitSparks(ent.x, ent.y, ent.color, 20, 320);

              if (this.bossHp <= 0) {
                this.handleBossDefeated();
                return;
              }
            } else if (ent instanceof SafePacket) {
              // Accidental slash on safe packet
              ent.isDead = true;
              this.teamScore = Math.max(0, this.teamScore - 100);
              audio.playPenalty();
              this.game.particles.emitSplitSlice(ent, seg.angle);
              this.game.particles.addScreenFlash('#ff0055', 0.25, 0.3);
            }
          }
        }
      }

      if (ent.isDead || ent.isOffscreen) {
        this.entities.splice(i, 1);
      }
    }
  }

  render(ctx) {
    if (!this.active) return;

    // 1. Boss Monster at the Top Edge
    ctx.save();
    const bossKey = this.bossData ? this.bossData.assetKey : 'boss_monster';
    const bossImg = assetManager.getImage(bossKey) || assetManager.getImage('boss_monster');
    const bossW = 440;
    const bossH = 130;

    // Boss shake displacement on hit/ultimate blast
    let shakeX = 0;
    let shakeY = 0;
    if (this.bossShakeDuration > 0 && this.bossShakeIntensity > 0) {
      shakeX = (Math.random() - 0.5) * this.bossShakeIntensity * 2;
      shakeY = (Math.random() - 0.5) * this.bossShakeIntensity * 1.6;
    }

    const bossX = CONFIG.CANVAS_WIDTH / 2 - bossW / 2 + shakeX;
    const hoverOffset = Math.sin(this.bossHoverTime * 2.5) * 5;
    const bossY = -10 + hoverOffset + shakeY;

    if (bossImg && bossImg.complete && bossImg.naturalWidth > 0) {
      // Glow and render image
      ctx.shadowBlur = this.bossHurtTimer > 0 ? 28 : 16;
      ctx.shadowColor = this.bossHurtTimer > 0 ? '#ff0055' : (this.bossData.color || '#ff0000');
      ctx.drawImage(bossImg, bossX, bossY, bossW, bossH);
    } else {
      // Procedural fallback boss daemon head
      ctx.fillStyle = this.bossHurtTimer > 0 ? '#ff0055' : '#14050d';
      ctx.strokeStyle = this.bossData.color || '#ff0055';
      ctx.lineWidth = 3;
      ctx.strokeRect(bossX, bossY, bossW, bossH);
      ctx.fillRect(bossX, bossY, bossW, bossH);

      ctx.font = '900 24px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`👾 ${this.bossData.nameEN}`, CONFIG.CANVAS_WIDTH / 2, bossY + 70);
    }

    if (this.bossHurtTimer > 0) {
      // Red flash overlay on hit
      ctx.fillStyle = 'rgba(255, 0, 85, 0.4)';
      ctx.fillRect(bossX, bossY, bossW, bossH);
    }
    ctx.restore();

    // 2. Boss HP Bar (Below Boss Image)
    ctx.save();
    const barW = 540;
    const barH = 22;
    let barShakeX = 0, barShakeY = 0;
    if (this.bossShakeDuration > 0 && this.bossShakeIntensity > 0) {
      barShakeX = (Math.random() - 0.5) * this.bossShakeIntensity * 0.8;
      barShakeY = (Math.random() - 0.5) * this.bossShakeIntensity * 0.6;
    }
    const barX = CONFIG.CANVAS_WIDTH / 2 - barW / 2 + barShakeX;
    const barY = 126 + barShakeY;

    ctx.fillStyle = 'rgba(10, 15, 25, 0.9)';
    ctx.strokeStyle = this.bossData.color || '#ff0055';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barW, barH);
    ctx.fillRect(barX, barY, barW, barH);

    const hpRatio = Math.max(0, Math.min(1, this.bossHp / this.bossMaxHp));
    const hpColor = hpRatio > 0.5 ? (this.bossData.color || '#ff0055') : (hpRatio > 0.2 ? '#ffb703' : '#ef4444');
    ctx.fillStyle = hpColor;
    ctx.shadowBlur = 12;
    ctx.shadowColor = hpColor;
    ctx.fillRect(barX + 2, barY + 2, (barW - 4) * hpRatio, barH - 4);

    ctx.font = 'bold 13px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#000000';
    ctx.fillText(`👾 ${this.bossData.nameTH}: ${Math.round(this.bossHp)} / ${this.bossMaxHp} (${Math.round(hpRatio * 100)}%)`, CONFIG.CANVAS_WIDTH / 2, barY + 16);
    ctx.restore();

    // 3. Runner Status (Top-Left HUD with NO overlap!)
    ctx.save();
    const hudBoxW = 230;
    const hudBoxH = 76;
    const hudBoxX = 24;
    const hudBoxY = 24;

    ctx.fillStyle = 'rgba(9, 14, 26, 0.85)';
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(hudBoxX, hudBoxY, hudBoxW, hudBoxH);
    ctx.fillRect(hudBoxX, hudBoxY, hudBoxW, hudBoxH);

    ctx.font = '900 18px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#00e5ff';
    ctx.textAlign = 'left';
    ctx.fillText(`🏃 คนที่ ${this.currentRunner} / ${this.numRunners}`, hudBoxX + 14, hudBoxY + 30);

    ctx.font = 'bold 15px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = this.runnerTimeLeft <= 3.5 ? '#ff0055' : '#ffb703';
    ctx.fillText(`⏱️ เวลาผลัด: ${Math.ceil(this.runnerTimeLeft)}s`, hudBoxX + 14, hudBoxY + 58);
    ctx.restore();

    // 4. Team Score & Difficulty (Top-Right HUD)
    ctx.save();
    ctx.font = '900 22px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#00ff66';
    ctx.textAlign = 'right';
    ctx.fillText(`คะแนนทีม: ${this.teamScore.toLocaleString()}`, CONFIG.CANVAS_WIDTH - 24, 44);

    ctx.font = 'bold 14px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = this.bossData.color || '#ffb703';
    ctx.fillText(`บอส: ${this.bossData.nameEN} (${this.difficulty.nameTH})`, CONFIG.CANVAS_WIDTH - 24, 68);
    ctx.restore();

    // 5. Render Falling Entities
    for (const ent of this.entities) ent.render(ctx);

    // 6. Ultimate Attack Gauge (Bottom-Center of the Screen)
    ctx.save();
    const ultBarW = 460;
    const ultBarH = 22;
    const ultBarX = CONFIG.CANVAS_WIDTH / 2 - ultBarW / 2;
    const ultBarY = CONFIG.CANVAS_HEIGHT - 48;

    ctx.fillStyle = 'rgba(9, 14, 26, 0.9)';
    ctx.strokeStyle = this.isUltimateReady ? '#ffb703' : '#00f3ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(ultBarX, ultBarY, ultBarW, ultBarH);
    ctx.fillRect(ultBarX, ultBarY, ultBarW, ultBarH);

    const ultRatio = this.ultimateCharge / 100;
    ctx.fillStyle = this.isUltimateReady ? '#ffb703' : '#00f3ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.isUltimateReady ? '#ffb703' : '#00f3ff';
    ctx.fillRect(ultBarX + 2, ultBarY + 2, (ultBarW - 4) * ultRatio, ultBarH - 4);

    ctx.font = 'bold 13px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#000000';
    const ultText = this.isUltimateReady
      ? '⚡ ท่าไม้ตายพร้อมแล้ว! (ULTIMATE READY!)'
      : `⚡ ชาร์จท่าไม้ตาย: ${Math.round(this.ultimateCharge)}% (กาง 5 นิ้วรับเพื่อชาร์จ)`;
    ctx.fillText(ultText, CONFIG.CANVAS_WIDTH / 2, ultBarY + 16);
    ctx.restore();

    // 7. Ultimate Attack Icon & Dwell UI (Normal Gameplay)
    if (this.isUltimateReady && !this.isFirstUltimateTutorialActive) {
      ctx.save();
      const iconX = this.ultimateIconPos.x;
      const iconY = this.ultimateIconPos.y;
      const r = this.ultimateIconPos.radius;

      // Instruction banner
      ctx.font = 'bold 16px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffb703';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ffb703';
      ctx.fillText('⚡ กางมือค้างไว้ที่ไอคอน 3 วินาที เพื่อยิงท่าไม้ตาย! (HOLD OPEN HAND 3s)', iconX, iconY - r - 14);

      // Draw Icon Image or SVG
      const ultImg = assetManager.getImage('ultimate_icon');
      if (ultImg && ultImg.complete && ultImg.naturalWidth > 0) {
        ctx.drawImage(ultImg, iconX - r, iconY - r, r * 2, r * 2);
      } else {
        ctx.beginPath();
        ctx.arc(iconX, iconY, r, 0, Math.PI * 2);
        ctx.fillStyle = '#090e1a';
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fill();

        ctx.font = '900 20px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#00f3ff';
        ctx.fillText('⚡ ULT', iconX, iconY + 8);
      }

      // Circular 3-Second Hold Countdown Ring
      if (this.ultimateHoldTimer > 0) {
        const holdRatio = Math.min(1.0, this.ultimateHoldTimer / 3.0);
        ctx.beginPath();
        ctx.arc(iconX, iconY, r + 12, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * holdRatio));
        ctx.strokeStyle = '#ff0055';
        ctx.lineWidth = 6;
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#ff0055';
        ctx.stroke();

        ctx.font = '900 22px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`${(3.0 - this.ultimateHoldTimer).toFixed(1)}s`, iconX, iconY + 6);
      }

      ctx.restore();
    }

    // 8. Runner Switch Banner (Brief transition)
    if (this.switchBannerTimer > 0 && !this.isSwitchCountdown) {
      ctx.save();
      ctx.fillStyle = 'rgba(5, 8, 18, 0.85)';
      ctx.fillRect(0, CONFIG.CANVAS_HEIGHT / 2 - 50, CONFIG.CANVAS_WIDTH, 100);

      ctx.font = '900 42px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#00e5ff';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#00e5ff';
      ctx.fillText(`⚡ นินจาคนที่ ${this.currentRunner} เข้าประจำตำแหน่ง! (GO!)`, CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 15);
      ctx.restore();
    }

    // =========================================================================
    // 9. FIRST-TIME ULTIMATE TUTORIAL OVERLAY (Spotlight + Pause + Instructions)
    // =========================================================================
    if (this.isFirstUltimateTutorialActive) {
      ctx.save();
      // 1. Dim background
      ctx.fillStyle = 'rgba(3, 7, 18, 0.86)';
      ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

      const iconX = this.ultimateIconPos.x;
      const iconY = this.ultimateIconPos.y;
      const r = this.ultimateIconPos.radius;

      // 2. Energetic spotlight glow behind the ultimate icon
      const pulse = 1 + Math.sin(this.tutorialPulseTimer * 5) * 0.15;
      const grad = ctx.createRadialGradient(iconX, iconY, r * 0.5, iconX, iconY, r * 2.6 * pulse);
      grad.addColorStop(0, 'rgba(0, 243, 255, 0.6)');
      grad.addColorStop(0.5, 'rgba(255, 183, 3, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(iconX, iconY, r * 2.6 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Concentric pulsing rings
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(iconX, iconY, r + (i * 18 * pulse), 0, Math.PI * 2);
        ctx.strokeStyle = i === 1 ? '#00f3ff' : '#ffb703';
        ctx.lineWidth = 3 - i * 0.5;
        ctx.stroke();
      }

      // 3. Central Tutorial Instruction Box
      const boxW = 820;
      const boxH = 170;
      const boxX = CONFIG.CANVAS_WIDTH / 2 - boxW / 2;
      const boxY = 175;

      ctx.fillStyle = 'rgba(9, 14, 28, 0.95)';
      ctx.strokeStyle = '#ffb703';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffb703';
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.fillRect(boxX, boxY, boxW, boxH);

      // Header
      ctx.font = '900 26px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffb703';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffb703';
      ctx.fillText('⚡ ท่าไม้ตายชาร์จเต็ม 100%! (FIRST-TIME ULTIMATE TUTORIAL)', CONFIG.CANVAS_WIDTH / 2, boxY + 40);

      // Instructions
      ctx.font = 'bold 20px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.fillText('✋ วิธีใช้: กางมือ 5 นิ้วค้างไว้ที่ไอคอนวงกลมด้านล่างให้ครบ 3 วินาที', CONFIG.CANVAS_WIDTH / 2, boxY + 76);

      ctx.font = '16px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#00f3ff';
      ctx.fillText('(Hold open palm over the glowing button for 3s to unleash ultimate attack)', CONFIG.CANVAS_WIDTH / 2, boxY + 104);

      // Status of dwell
      const holdSec = this.ultimateHoldTimer.toFixed(1);
      const isDwellActive = this.ultimateHoldTimer > 0;
      ctx.font = '900 18px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = isDwellActive ? '#00ff66' : '#ffb703';
      ctx.fillText(`⏱️ เวลาฝึกกางมือค้าง: ${holdSec} / 3.0s ${isDwellActive ? '🔥 กำลังชาร์จ!' : '👉 นำมือมากางทาบที่ไอคอน'} (เกมหยุดเวลาชั่วคราว)`, CONFIG.CANVAS_WIDTH / 2, boxY + 142);

      // 4. Draw Ultimate Icon inside the spotlight
      const ultImg = assetManager.getImage('ultimate_icon');
      if (ultImg && ultImg.complete && ultImg.naturalWidth > 0) {
        ctx.drawImage(ultImg, iconX - r, iconY - r, r * 2, r * 2);
      } else {
        ctx.beginPath();
        ctx.arc(iconX, iconY, r, 0, Math.PI * 2);
        ctx.fillStyle = '#090e1a';
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fill();

        ctx.font = '900 24px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#00f3ff';
        ctx.fillText('⚡ ULT', iconX, iconY + 8);
      }

      // 5. Circular Hold Progress Ring
      if (this.ultimateHoldTimer > 0) {
        const holdRatio = Math.min(1.0, this.ultimateHoldTimer / 3.0);
        ctx.beginPath();
        ctx.arc(iconX, iconY, r + 14, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * holdRatio));
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 8;
        ctx.shadowBlur = 18;
        ctx.shadowColor = '#00ff66';
        ctx.stroke();

        ctx.font = '900 24px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`${(3.0 - this.ultimateHoldTimer).toFixed(1)}s`, iconX, iconY + 8);
      }

      ctx.restore();
    }

    // =========================================================================
    // 10. RUNNER SWITCH COUNTDOWN OVERLAY (Dark fade + Red warning + 5..1..GO!)
    // =========================================================================
    if (this.isSwitchCountdown) {
      ctx.save();
      // Full screen dark/black fade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.94)';
      ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

      // Red Warning Cyber Border
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 5;
      ctx.shadowBlur = 24;
      ctx.shadowColor = '#ff0055';
      ctx.strokeRect(30, 30, CONFIG.CANVAS_WIDTH - 60, CONFIG.CANVAS_HEIGHT - 60);

      // Red Warning Banner
      ctx.font = '900 38px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ff0055';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff0055';
      ctx.fillText('⚠️ แจ้งเตือน: เตรียมเปลี่ยนตัวผู้เล่น! ⚠️', CONFIG.CANVAS_WIDTH / 2, 140);

      ctx.font = 'bold 20px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ff7799';
      ctx.shadowBlur = 6;
      ctx.fillText('RUNNER SWITCH INCOMING - GET READY TO SWAP NINJAS!', CONFIG.CANVAS_WIDTH / 2, 175);

      // Runner Swap Details Card
      const cardW = 600;
      const cardH = 80;
      const cardX = CONFIG.CANVAS_WIDTH / 2 - cardW / 2;
      const cardY = 215;

      ctx.fillStyle = 'rgba(255, 0, 85, 0.12)';
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 2;
      ctx.strokeRect(cardX, cardY, cardW, cardH);
      ctx.fillRect(cardX, cardY, cardW, cardH);

      ctx.font = '900 24px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.fillText(`🏃 ส่งต่อผลัด: คนที่ ${this.currentRunner}  ➔  คนที่ ${this.nextRunner}`, CONFIG.CANVAS_WIDTH / 2, cardY + 48);

      // Countdown Display
      const remainSec = Math.ceil(this.switchCountdownTime);
      if (this.switchCountdownTime > 0.35) {
        // Giant Countdown Number 5, 4, 3, 2, 1
        ctx.font = '900 150px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#ff0055';
        ctx.shadowBlur = 40;
        ctx.shadowColor = '#ff0055';
        ctx.fillText(`${remainSec}`, CONFIG.CANVAS_WIDTH / 2, 450);

        ctx.font = 'bold 22px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#ffb703';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffb703';
        ctx.fillText('วินาที (SECONDS)', CONFIG.CANVAS_WIDTH / 2, 495);
      } else {
        // Giant GO!
        ctx.font = '900 160px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#00ff66';
        ctx.shadowBlur = 50;
        ctx.shadowColor = '#00ff66';
        ctx.fillText('GO!', CONFIG.CANVAS_WIDTH / 2, 450);

        ctx.font = '900 26px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#00f3ff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f3ff';
        ctx.fillText('ลุยเลย! (START FIGHTING!)', CONFIG.CANVAS_WIDTH / 2, 495);
      }

      // Freeze notice
      ctx.font = 'bold 16px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.shadowBlur = 0;
      ctx.fillText('⏸️ เวลาและมัลแวร์ในเกมหยุดนิ่งชั่วคราว เพื่อความปลอดภัยและเป็นธรรมในการเปลี่ยนตัว', CONFIG.CANVAS_WIDTH / 2, 580);

      ctx.restore();
    }
  }
}


// ==========================================
// Source: js/ui/leaderboard.js
// ==========================================
// Cyber Ninja: Firewall Slasher - Camp Leaderboard & Team Score Manager

class LeaderboardManager {
  constructor() {
    this.storageKey = 'cyber_ninja_leaderboard_v1';
  }

  getAllScores() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read leaderboard', e);
      return [];
    }
  }

  addScore(entry) {
    // entry: { playerName, teamId, score, maxCombo, malwareSlain, safePacketsCaught, mode, date }
    const scores = this.getAllScores();
    const newRecord = {
      id: Date.now().toString(),
      playerName: entry.playerName || 'Cyber Ninja',
      teamId: entry.teamId || 'alpha',
      score: entry.score || 0,
      maxCombo: entry.maxCombo || 0,
      malwareSlain: entry.malwareSlain || 0,
      safePacketsCaught: entry.safePacketsCaught || 0,
      mode: entry.mode || 'Score Attack',
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    scores.push(newRecord);
    // Sort descending by score
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(this.storageKey, JSON.stringify(scores));
    return newRecord;
  }

  exportCSV() {
    const scores = this.getAllScores();
    if (scores.length === 0) {
      alert('ยังไม่มีข้อมูลคะแนนสำหรับส่งออก / No score data to export');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Rank,Player Name,Team,Score,Max Combo,Malware Slashed,Safe Packets,Mode,Time\n';

    scores.forEach((s, idx) => {
      csvContent += `${idx + 1},"${s.playerName}","${s.teamId}",${s.score},${s.maxCombo},${s.malwareSlain},${s.safePacketsCaught},"${s.mode}","${s.date}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cyber_ninja_camp_scores_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }
}

const leaderboard = new LeaderboardManager();


// ==========================================
// Source: js/ui/tv-broadcast.js
// ==========================================
// Cyber Ninja: Firewall Slasher - TV Broadcast Mode & Display Scaler

class TvBroadcastManager {
  constructor() {
    this.isTvMode = localStorage.getItem('cyber_ninja_tv_mode') === 'true';
    if (this.isTvMode) {
      document.body.classList.add('tv-broadcast-mode');
    }
  }

  toggle() {
    this.isTvMode = !this.isTvMode;
    if (this.isTvMode) {
      document.body.classList.add('tv-broadcast-mode');
    } else {
      document.body.classList.remove('tv-broadcast-mode');
    }
    localStorage.setItem('cyber_ninja_tv_mode', this.isTvMode.toString());
    return this.isTvMode;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen request denied', err);
      });
      return true;
    } else {
      document.exitFullscreen().catch(err => {
        console.warn('Exit fullscreen failed', err);
      });
      return false;
    }
  }
}

const tvBroadcast = new TvBroadcastManager();


// ==========================================
// Source: js/game.js
// ==========================================
// Cyber Ninja: Firewall Slasher - Master Game Coordinator & AR Canvas Engine
















class CyberNinjaGame {
  constructor() {
    window.SafePacket = SafePacket;
    window.Malware = Malware;

    this.video = document.getElementById('cameraFeed');
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // Resolution sizing
    this.canvas.width = CONFIG.CANVAS_WIDTH;
    this.canvas.height = CONFIG.CANVAS_HEIGHT;

    // Tracking & Gestures
    this.gestureDetector = new GestureDetector();
    this.mediaPipe = new MediaPipeAdapter(this.video, this.canvas, (hands) => this.onHandResults(hands));
    
    // Blade Trails (P1 Cyan, P2 Magenta)
    this.trailP1 = new BladeTrail('cyan');
    this.trailP2 = new BladeTrail('magenta');

    // VFX
    this.particles = new ParticleSystem();

    // Game Modes
    this.mode1 = new ScoreAttackMode(this);
    this.mode2 = new SplitDuelMode(this);
    this.mode3 = new FirewallRelayMode(this);

    // Current State: 'MENU', 'PLAYING_MODE1', 'PLAYING_MODE2', 'PLAYING_MODE3'
    this.currentState = 'MENU';
    this.activeMode = null;
    this.isPaused = false;

    this.lastResultData = null;
    this.lastDuelResult = null;
    this.lastBossResult = null;

    this.detectedHands = [];
    this.lastHandTimestamp = performance.now();
    this.lastFrameTime = performance.now();

    // Hand Exit Watchdog: false = OFF (keep cursor for 2 seconds - recommended for edge tracking), true = ON (quick 200ms clear)
    this.handExitWatchdogEnabled = false;
    try {
      const saved = localStorage.getItem('cyber_ninja_watchdog');
      if (saved !== null) {
        this.handExitWatchdogEnabled = JSON.parse(saved);
      }
    } catch (e) {}

    // Default volume at 50% on every game launch
    audio.setBgmVolume(0.50);
    audio.setSfxVolume(0.50);

    this.initUI();
    this.startRenderLoop();

    // Attempt to start Menu BGM immediately (in case autoplay is permitted)
    audio.playMenuBGM();

    // Unlock Web Audio on first user interaction anywhere and play Menu BGM if in menu
    const unlockAudio = () => {
      audio.init();
      if (this.currentState === 'MENU') {
        audio.playMenuBGM();
      }
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
  }

  initUI() {
    // Top Bar & Settings Modal Buttons
    document.getElementById('btnLangToggle')?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      i18n.toggle();
      this.updateAllTexts();
    });

    document.getElementById('btnTvToggle')?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      const active = tvBroadcast.toggle();
      document.getElementById('btnTvToggle').classList.toggle('active', active);
    });

    document.getElementById('btnFullscreen')?.addEventListener('click', () => {
      audio.init();
      tvBroadcast.toggleFullscreen();
    });

    document.getElementById('btnSimToggle')?.addEventListener('click', () => {
      audio.init();
      const isSim = this.mediaPipe.enableSimulator(!this.mediaPipe.isSimulated);
      document.getElementById('btnSimToggle').classList.toggle('active', isSim);
      if (isSim) {
        this.mediaPipe.updateStatus('🖱️ สลับเป็นโหมดเมาส์/สัมผัส (Mouse Simulator Active)', '#00ff66');
      } else {
        this.mediaPipe.updateStatus('📷 สลับเป็นโหมดกล้อง AR (Camera Mode Active)', '#00e5ff');
      }
    });

    const btnFistToggle = document.getElementById('btnFistToggle');
    btnFistToggle?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      const isDiscard = this.mediaPipe.toggleFistDiscard();
      btnFistToggle.classList.toggle('active', isDiscard);
      btnFistToggle.textContent = isDiscard ? '✊ กำหมัด=พักมือ: เปิด' : '✊ กำหมัด=พักมือ: ปิด';
      this.mediaPipe.updateStatus(
        isDiscard ? '✊ เปิดใช้งาน: กำหมัด = พักมือ (Fist Discard ON)' : '✋ ปิดใช้งาน: แทร็กทุกท่ามือ (Fist Discard OFF)',
        isDiscard ? '#00ffcc' : '#ff9900'
      );
    });

    // Hand Exit Watchdog UI controller
    const btnWatchdogToggle = document.getElementById('btnWatchdogToggle');
    const watchdogDescText = document.getElementById('watchdogDescText');
    const updateWatchdogUI = () => {
      if (!btnWatchdogToggle) return;
      btnWatchdogToggle.classList.toggle('active', this.handExitWatchdogEnabled);
      btnWatchdogToggle.textContent = this.handExitWatchdogEnabled ? '📷 ตรวจจับ: เปิด (200ms)' : '📷 ตรวจจับ: ปิด (2 วิ)';
      if (watchdogDescText) {
        if (this.handExitWatchdogEnabled) {
          watchdogDescText.innerHTML = '<strong>เปิด (200ms):</strong> เคลียร์เคอร์เซอร์ทันทีเมื่อมือหลุดจากกล้อง';
        } else {
          watchdogDescText.innerHTML = '<strong>ปิด (2 วิ - แนะนำ):</strong> คงตำแหน่งขอบจอไว้ 2 วินาที ป้องกันแทร็กหลุดเมื่อลากฟันมัลแวร์สุดขอบจอหรือล่างจอ';
        }
      }
    };
    btnWatchdogToggle?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      this.handExitWatchdogEnabled = !this.handExitWatchdogEnabled;
      try {
        localStorage.setItem('cyber_ninja_watchdog', JSON.stringify(this.handExitWatchdogEnabled));
      } catch (e) {}
      updateWatchdogUI();
      this.mediaPipe.updateStatus(
        this.handExitWatchdogEnabled ? '📷 ตรวจจับมือออกจอ: เปิด (200ms)' : '📷 ตรวจจับมือออกจอ: ปิด (คงตำแหน่ง 2 วิ)',
        this.handExitWatchdogEnabled ? '#ffb703' : '#00ffcc'
      );
    });
    updateWatchdogUI();

    // Graphic Quality / Performance Controller (⚡ Smooth/Tablet vs ✨ High Quality/PC)
    const btnQualityToggle = document.getElementById('btnQualityToggle');
    const qualityDescText = document.getElementById('qualityDescText');
    const updateQualityUI = () => {
      const isSmooth = (this.mediaPipe.qualityMode === 'smooth');
      if (btnQualityToggle) {
        btnQualityToggle.classList.toggle('cyber-btn-green', isSmooth);
        btnQualityToggle.classList.toggle('cyber-btn-gold', !isSmooth);
        btnQualityToggle.classList.add('active');
        btnQualityToggle.innerHTML = isSmooth ? '⚡ ลื่นไหล (Smooth)' : '✨ กราฟิกจัดเต็ม (High)';
      }
      if (qualityDescText) {
        if (isSmooth) {
          qualityDescText.innerHTML = '<strong>⚡ โหมดลื่นไหล (Smooth - แนะนำ):</strong> โมเดล AI Lite, จังหวะส่งภาพ 30 FPS, ปิด ShadowBlur ให้เฟรมเรตนิ่ง 60 FPS บนแท็บเล็ต/มือถือ';
        } else {
          qualityDescText.innerHTML = '<strong>✨ กราฟิกจัดเต็ม (High Quality):</strong> โมเดล AI เต็มรูปแบบ พร้อมเอฟเฟกต์แสงเงานีออนเรืองแสง สำหรับคอมพิวเตอร์ตั้งโต๊ะ/โน้ตบุ๊กแรง';
        }
      }
    };
    btnQualityToggle?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      const nextMode = (this.mediaPipe.qualityMode === 'smooth') ? 'high' : 'smooth';
      this.mediaPipe.setQualityMode(nextMode);
      updateQualityUI();
      this.mediaPipe.updateStatus(
        nextMode === 'smooth' ? '⚡ เปิดโหมดลื่นไหล 60 FPS (Smooth Active)' : '✨ เปิดโหมดกราฟิกจัดเต็ม (High Quality Active)',
        nextMode === 'smooth' ? '#00ff66' : '#00e5ff'
      );
    });
    updateQualityUI();

    // Settings Modal Open / Close & Auto-Pause
    const openSettings = () => {
      audio.init();
      audio.playCountdown(false);

      // When settings is clicked or touched, pause game if currently active
      if (this.currentState !== 'MENU' && !this.isPaused) {
        this.togglePause();
      }

      updateWatchdogUI();
      updateQualityUI();
      document.getElementById('settingsModal')?.classList.remove('hidden');
    };

    document.getElementById('btnSettingsToggle')?.addEventListener('click', openSettings);

    const closeSettings = () => {
      document.getElementById('settingsModal')?.classList.add('hidden');
    };
    document.getElementById('btnCloseSettingsModal')?.addEventListener('click', closeSettings);
    document.getElementById('btnCloseSettingsModalX')?.addEventListener('click', closeSettings);

    document.getElementById('btnBackMenu')?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      this.returnToMenu();
    });

    // Dual Independent Volume Sliders & Mute Toggle
    const bgmSlider = document.getElementById('sliderBgmVolume');
    const bgmVal = document.getElementById('labelBgmVol') || document.getElementById('valBgmVolume');
    bgmSlider?.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value) / 100;
      audio.setBgmVolume(vol);
      if (bgmVal) bgmVal.textContent = `${Math.round(vol * 100)}%`;
    });

    const sfxSlider = document.getElementById('sliderSfxVolume');
    const sfxVal = document.getElementById('labelSfxVol') || document.getElementById('valSfxVolume');
    sfxSlider?.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value) / 100;
      audio.setSfxVolume(vol);
      if (sfxVal) sfxVal.textContent = `${Math.round(vol * 100)}%`;
    });

    document.getElementById('btnMuteToggle')?.addEventListener('click', () => {
      const isMuted = audio.toggleMute();
      const btn = document.getElementById('btnMuteToggle');
      if (btn) btn.textContent = isMuted ? '🔇' : '🔊';
    });

    // In-game Pause Button & Keyboard Hook
    document.getElementById('btnPauseToggle')?.addEventListener('click', () => {
      this.togglePause();
    });

    document.getElementById('btnResumeGame')?.addEventListener('click', () => {
      this.togglePause();
    });

    document.getElementById('btnRestartGame')?.addEventListener('click', () => {
      this.confirmRestart(() => {
        this.isPaused = false;
        document.getElementById('pauseModal')?.classList.add('hidden');
        if (this.currentState === 'PLAYING_MODE1') this.startMode1();
        else if (this.currentState === 'PLAYING_MODE2') this.startMode2();
        else if (this.currentState === 'PLAYING_MODE3') this.startMode3();
      });
    });

    document.getElementById('btnQuitToMenu')?.addEventListener('click', () => {
      this.isPaused = false;
      document.getElementById('pauseModal')?.classList.add('hidden');
      this.returnToMenu();
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        const zoomModal = document.getElementById('imageZoomModal');
        const howToModal = document.getElementById('howToPlayModal');
        const lbModal = document.getElementById('leaderboardModal');
        const resModal = document.getElementById('resultsModal');
        const duelModal = document.getElementById('duelResultModal');
        const bossModal = document.getElementById('bossResultModal');

        // If another modal is open, don't trigger pause
        if ((zoomModal && !zoomModal.classList.contains('hidden')) ||
            (howToModal && !howToModal.classList.contains('hidden')) ||
            (lbModal && !lbModal.classList.contains('hidden')) ||
            (resModal && !resModal.classList.contains('hidden')) ||
            (duelModal && !duelModal.classList.contains('hidden')) ||
            (bossModal && !bossModal.classList.contains('hidden'))) {
          return;
        }

        if (this.currentState !== 'MENU') {
          this.togglePause();
        }
      }
    });

    // Main Menu Mode Cards & Play Buttons
    const handleMode1Start = () => {
      audio.init();
      audio.playCountdown(true);
      this.startMode1();
    };
    document.getElementById('cardMode1')?.addEventListener('click', (e) => {
      if (e.target.closest('select, input, label, button, .mode-config-row')) return;
      handleMode1Start();
    });
    document.getElementById('btnStartMode1')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleMode1Start();
    });

    const handleMode2Start = () => {
      audio.init();
      audio.playCountdown(true);
      this.startMode2();
    };
    document.getElementById('cardMode2')?.addEventListener('click', (e) => {
      if (e.target.closest('select, input, label, button, .mode-config-row')) return;
      handleMode2Start();
    });
    document.getElementById('btnStartMode2')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleMode2Start();
    });

    const handleMode3Start = () => {
      audio.init();
      audio.playCountdown(true);
      this.startMode3();
    };
    document.getElementById('cardMode3')?.addEventListener('click', (e) => {
      if (e.target.closest('select, input, label, button, .mode-config-row')) return;
      handleMode3Start();
    });
    document.getElementById('btnStartMode3')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleMode3Start();
    });

    document.getElementById('btnOpenLeaderboard')?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      this.showLeaderboardModal();
    });

    document.getElementById('btnHowToPlay')?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      this.showHowToPlayModal();
    });

    // Tutorial Slide Presentation Controller
    this.currentTutorialSlide = 0;
    const slides = document.querySelectorAll('.tutorial-slide');
    const tabs = document.querySelectorAll('.tutorial-tab-btn');
    const dots = document.querySelectorAll('.tutorial-indicator-dot');

    const setTutorialSlide = (index) => {
      if (slides.length === 0) return;
      this.currentTutorialSlide = (index + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle('active', idx === this.currentTutorialSlide));
      tabs.forEach((t, idx) => t.classList.toggle('active', idx === this.currentTutorialSlide));
      dots.forEach((d, idx) => d.classList.toggle('active', idx === this.currentTutorialSlide));
    };

    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        audio.playCountdown(false);
        setTutorialSlide(idx);
      });
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        audio.playCountdown(false);
        setTutorialSlide(idx);
      });
    });

    document.getElementById('btnTutorialPrev')?.addEventListener('click', () => {
      audio.playCountdown(false);
      setTutorialSlide(this.currentTutorialSlide - 1);
    });

    document.getElementById('btnTutorialNext')?.addEventListener('click', () => {
      audio.playCountdown(false);
      setTutorialSlide(this.currentTutorialSlide + 1);
    });

    document.getElementById('btnTutorialStart')?.addEventListener('click', () => {
      document.getElementById('howToPlayModal')?.classList.add('hidden');
      audio.playCountdown(true);
      this.startMode1();
    });

    // Modal Close Buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.cyber-modal');
        if (modal) modal.classList.add('hidden');
      });
    });

    document.getElementById('btnExportCsv')?.addEventListener('click', () => {
      leaderboard.exportCSV();
    });

    document.getElementById('btnClearLeaderboard')?.addEventListener('click', () => {
      if (confirm(i18n.t('confirmClear'))) {
        leaderboard.clear();
        this.renderLeaderboardTable();
      }
    });

    // Mode 1 Results Modal Save
    document.getElementById('btnSaveScore')?.addEventListener('click', () => {
      const nameInput = document.getElementById('inputPlayerName');
      const playerName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Cyber Ninja';
      
      if (this.lastResultData) {
        leaderboard.addScore({
          playerName: playerName,
          teamId: this.lastResultData.teamId || 'alpha',
          score: this.lastResultData.score || 0,
          maxCombo: this.lastResultData.maxCombo || 0,
          malwareSlain: this.lastResultData.malwareSlain || 0,
          safePacketsCaught: this.lastResultData.safePacketsCaught || 0,
          mode: 'Score Attack'
        });
      }

      document.getElementById('resultsModal')?.classList.add('hidden');
      this.showLeaderboardModal();
    });

    document.getElementById('btnPlayAgain')?.addEventListener('click', () => {
      this.confirmRestart(() => {
        document.getElementById('resultsModal')?.classList.add('hidden');
        this.startMode1();
      });
    });

    document.getElementById('btnMode1BackMenu')?.addEventListener('click', () => {
      document.getElementById('resultsModal')?.classList.add('hidden');
      this.returnToMenu();
    });

    // Mode 2 Duel Results Modal Handlers
    document.getElementById('btnSaveDuelScore')?.addEventListener('click', () => {
      const p1Name = document.getElementById('inputDuelP1Name')?.value.trim() || 'Ninja Blue';
      const p2Name = document.getElementById('inputDuelP2Name')?.value.trim() || 'Ninja Red';

      if (this.lastDuelResult) {
        leaderboard.addScore({
          playerName: `${p1Name} (P1 Blue)`,
          teamId: 'alpha',
          score: this.lastDuelResult.p1.score,
          maxCombo: this.lastDuelResult.p1.maxCombo,
          malwareSlain: this.lastDuelResult.p1.slashed,
          safePacketsCaught: this.lastDuelResult.p1.caught,
          mode: '1v1 Duel'
        });
        leaderboard.addScore({
          playerName: `${p2Name} (P2 Red)`,
          teamId: 'beta',
          score: this.lastDuelResult.p2.score,
          maxCombo: this.lastDuelResult.p2.maxCombo,
          malwareSlain: this.lastDuelResult.p2.slashed,
          safePacketsCaught: this.lastDuelResult.p2.caught,
          mode: '1v1 Duel'
        });
      }

      document.getElementById('duelResultModal')?.classList.add('hidden');
      this.showLeaderboardModal();
    });

    document.getElementById('btnRematchDuel')?.addEventListener('click', () => {
      this.confirmRestart(() => {
        document.getElementById('duelResultModal')?.classList.add('hidden');
        this.startMode2();
      });
    });

    document.getElementById('btnDuelBackMenu')?.addEventListener('click', () => {
      document.getElementById('duelResultModal')?.classList.add('hidden');
      this.returnToMenu();
    });

    // Mode 3 Boss Results Modal Handlers
    document.getElementById('btnSaveBossScore')?.addEventListener('click', () => {
      const teamName = document.getElementById('inputBossTeamName')?.value.trim() || 'Cyber Defense Unit';
      if (this.lastBossResult) {
        leaderboard.addScore({
          playerName: `${teamName} (Boss Raid)`,
          teamId: 'delta',
          score: this.lastBossResult.score,
          maxCombo: this.lastBossResult.ultimatesFired,
          malwareSlain: this.lastBossResult.malwareSlain,
          safePacketsCaught: this.lastBossResult.safeCaught,
          mode: 'Co-op Boss'
        });
      }

      document.getElementById('bossResultModal')?.classList.add('hidden');
      this.showLeaderboardModal();
    });

    document.getElementById('btnBossPlayAgain')?.addEventListener('click', () => {
      this.confirmRestart(() => {
        document.getElementById('bossResultModal')?.classList.add('hidden');
        this.startMode3();
      });
    });

    document.getElementById('btnBossBackMenu')?.addEventListener('click', () => {
      document.getElementById('bossResultModal')?.classList.add('hidden');
      this.returnToMenu();
    });

    // Asset Manager Modal Controls & Data Sync
    const openAssetModal = () => {
      audio.init();
      audio.playCountdown(false);
      const modal = document.getElementById('assetManagerModal');
      const banner = document.getElementById('syncStatusBanner');
      if (banner) {
        banner.className = 'sync-banner hidden';
        banner.textContent = '';
      }

      if (window.assetManager) {
        const aud = window.assetManager.audioPaths || {};
        const img = window.assetManager.imageFallbacks || {};

        const setVal = (id, val) => {
          const el = document.getElementById(id);
          if (el && val !== undefined) el.value = val;
        };

        setVal('assetAudioMenu', aud['bgm_menu']);
        setVal('assetAudioMode1', aud['bgm_mode1']);
        setVal('assetAudioMode2', aud['bgm_mode2']);
        setVal('assetAudioMode3', aud['bgm_mode3']);

        setVal('assetImgBoss1', img['boss_level1']);
        setVal('assetImgBoss2', img['boss_level2']);
        setVal('assetImgBoss3', img['boss_level3']);
        setVal('assetImgBoss4', img['boss_level4']);
        setVal('assetImgBoss5', img['boss_level5']);
        setVal('assetImgLogo', img['logo']);
      }

      modal?.classList.remove('hidden');
    };

    document.getElementById('btnOpenAssetManager')?.addEventListener('click', openAssetModal);
    document.getElementById('btnOpenAssetManagerBottom')?.addEventListener('click', openAssetModal);

    const closeAssetModal = () => {
      document.getElementById('assetManagerModal')?.classList.add('hidden');
    };
    document.getElementById('btnCloseAssetModal')?.addEventListener('click', closeAssetModal);
    document.getElementById('btnCloseAssetModalX')?.addEventListener('click', closeAssetModal);

    document.getElementById('btnSyncAssets')?.addEventListener('click', () => {
      audio.init();
      const banner = document.getElementById('syncStatusBanner');
      const customData = {
        audio: {
          'bgm_menu': document.getElementById('assetAudioMenu')?.value || '',
          'bgm_mode1': document.getElementById('assetAudioMode1')?.value || '',
          'bgm_mode2': document.getElementById('assetAudioMode2')?.value || '',
          'bgm_mode3': document.getElementById('assetAudioMode3')?.value || ''
        },
        images: {
          'boss_level1': document.getElementById('assetImgBoss1')?.value || '',
          'boss_level2': document.getElementById('assetImgBoss2')?.value || '',
          'boss_level3': document.getElementById('assetImgBoss3')?.value || '',
          'boss_level4': document.getElementById('assetImgBoss4')?.value || '',
          'boss_level5': document.getElementById('assetImgBoss5')?.value || '',
          'logo': document.getElementById('assetImgLogo')?.value || ''
        }
      };

      if (window.assetManager) {
        const ok = window.assetManager.syncCustomData(customData);
        if (ok) {
          audio.playCountdown(true);
          if (banner) {
            banner.textContent = '✅ ซิงค์ข้อมูลเข้าเกมสำเร็จ! บันทึกและนำเข้าสู่ระบบเกมเรียบร้อยแล้ว';
            banner.className = 'sync-banner success';
            banner.classList.remove('hidden');
          }
          if (this.currentState === 'MENU') {
            audio.playMenuBGM();
          }
        } else {
          if (banner) {
            banner.textContent = '❌ เกิดข้อผิดพลาดในการซิงค์ข้อมูล โปรดตรวจสอบรูปแบบข้อมูล';
            banner.className = 'sync-banner error';
            banner.classList.remove('hidden');
          }
        }
      }
    });

    document.getElementById('btnResetAssets')?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      const banner = document.getElementById('syncStatusBanner');
      if (window.assetManager) {
        window.assetManager.resetDefaults();
        const aud = window.assetManager.audioPaths || {};
        const img = window.assetManager.imageFallbacks || {};

        const setVal = (id, val) => {
          const el = document.getElementById(id);
          if (el && val !== undefined) el.value = val;
        };

        setVal('assetAudioMenu', aud['bgm_menu']);
        setVal('assetAudioMode1', aud['bgm_mode1']);
        setVal('assetAudioMode2', aud['bgm_mode2']);
        setVal('assetAudioMode3', aud['bgm_mode3']);

        setVal('assetImgBoss1', img['boss_level1']);
        setVal('assetImgBoss2', img['boss_level2']);
        setVal('assetImgBoss3', img['boss_level3']);
        setVal('assetImgBoss4', img['boss_level4']);
        setVal('assetImgBoss5', img['boss_level5']);
        setVal('assetImgLogo', img['logo']);

        if (banner) {
          banner.textContent = '↩️ คืนค่าไฟล์เริ่มต้นสำเร็จเรียบร้อยแล้ว';
          banner.className = 'sync-banner success';
          banner.classList.remove('hidden');
        }

        if (this.currentState === 'MENU') {
          audio.playMenuBGM();
        }
      }
    });

    // Initialize Interactive Image Zoom Lightbox
    this.initImageZoomLightbox();

    this.updateAllTexts();
  }

  togglePause() {
    if (this.currentState === 'MENU') return;
    this.isPaused = !this.isPaused;
    const modal = document.getElementById('pauseModal');
    if (this.isPaused) {
      audio.pauseBGM();
      modal?.classList.remove('hidden');
    } else {
      modal?.classList.add('hidden');
      audio.resumeBGM();
    }
  }

  confirmRestart(onConfirm, customMsg = null) {
    audio.init();
    audio.playCountdown(false);
    const modal = document.getElementById('confirmRestartModal');
    if (!modal) {
      if (confirm('คุณต้องการเริ่มเล่นรอบใหม่ทันทีใช่หรือไม่? (สถิติปัจจุบันที่ยังไม่ได้บันทึกจะหายไป)')) {
        onConfirm();
      }
      return;
    }

    const msgEl = document.getElementById('confirmRestartMessage');
    if (msgEl && customMsg) {
      msgEl.innerHTML = customMsg;
    } else if (msgEl) {
      msgEl.innerHTML = 'คุณต้องการเริ่มเล่นรอบใหม่ทันทีใช่หรือไม่?<br><span style="color: var(--magenta-neon); font-size: 0.92rem; font-weight: 700;">(หากยังไม่ได้บันทึกคะแนน สถิติการเล่นรอบนี้จะไม่ถูกบันทึก)</span>';
    }

    modal.classList.remove('hidden');

    const btnYes = document.getElementById('btnConfirmRestartYes');
    const btnNo = document.getElementById('btnConfirmRestartNo');

    const handleYes = () => {
      cleanup();
      modal.classList.add('hidden');
      audio.playCountdown(true);
      onConfirm();
    };

    const handleNo = () => {
      cleanup();
      modal.classList.add('hidden');
      audio.playCountdown(false);
    };

    const cleanup = () => {
      btnYes?.removeEventListener('click', handleYes);
      btnNo?.removeEventListener('click', handleNo);
    };

    btnYes?.addEventListener('click', handleYes, { once: true });
    btnNo?.addEventListener('click', handleNo, { once: true });
  }

  initImageZoomLightbox() {
    const zoomModal = document.getElementById('imageZoomModal');
    const viewport = document.getElementById('zoomViewport');
    const canvasWrapper = document.getElementById('zoomCanvasWrapper');
    const targetImg = document.getElementById('zoomTargetImg');
    const titleEl = document.getElementById('zoomImageTitle');
    const pctBadge = document.getElementById('zoomPctBadge');
    const btnIn = document.getElementById('btnZoomIn');
    const btnOut = document.getElementById('btnZoomOut');
    const btnReset = document.getElementById('btnZoomReset');
    const btnClose = document.getElementById('btnCloseZoomModal');

    if (!zoomModal || !viewport || !canvasWrapper || !targetImg) return;

    let scale = 1.0;
    let translateX = 0;
    let translateY = 0;
    const minScale = 0.6;
    const maxScale = 5.0;

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialTranslateX = 0;
    let initialTranslateY = 0;

    let initialPinchDist = 0;
    let initialPinchScale = 1.0;

    const applyTransform = () => {
      if (pctBadge) {
        pctBadge.textContent = `${Math.round(scale * 100)}%`;
      }
      canvasWrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    };

    const resetZoom = () => {
      scale = 1.0;
      translateX = 0;
      translateY = 0;
      applyTransform();
    };

    const zoomBy = (factor) => {
      scale = Math.min(Math.max(scale + factor, minScale), maxScale);
      scale = Math.round(scale * 100) / 100;
      applyTransform();
    };

    const openModal = (imgSrc, imgAlt) => {
      targetImg.src = imgSrc;
      if (titleEl) titleEl.textContent = `🔍 ${imgAlt || 'ภาพประกอบคู่มือนินจาไซเบอร์'}`;
      resetZoom();
      zoomModal.classList.remove('hidden');
      audio.init();
      audio.playCountdown(false);
    };

    const closeModal = () => {
      zoomModal.classList.add('hidden');
      resetZoom();
    };

    document.querySelectorAll('.tutorial-diagram-box').forEach(box => {
      box.addEventListener('click', (e) => {
        const img = box.querySelector('img');
        if (img) openModal(img.getAttribute('src'), img.getAttribute('alt') || box.getAttribute('title'));
      });
    });

    btnIn?.addEventListener('click', (e) => { e.stopPropagation(); zoomBy(0.25); });
    btnOut?.addEventListener('click', (e) => { e.stopPropagation(); zoomBy(-0.25); });
    btnReset?.addEventListener('click', (e) => { e.stopPropagation(); resetZoom(); });
    btnClose?.addEventListener('click', (e) => { e.stopPropagation(); closeModal(); });

    zoomModal.addEventListener('click', (e) => {
      if (e.target === zoomModal || e.target === viewport) closeModal();
    });

    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.20 : -0.20;
      zoomBy(delta);
    }, { passive: false });

    viewport.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      initialTranslateX = translateX;
      initialTranslateY = translateY;
      viewport.classList.add('dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      translateX = initialTranslateX + (e.clientX - dragStartX);
      translateY = initialTranslateY + (e.clientY - dragStartY);
      applyTransform();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        viewport.classList.remove('dragging');
      }
    });

    viewport.addEventListener('dblclick', (e) => {
      e.preventDefault();
      if (scale !== 1.0) resetZoom();
      else { scale = 2.0; applyTransform(); }
    });

    viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDist = Math.hypot(dx, dy);
        initialPinchScale = scale;
      } else if (e.touches.length === 1) {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        initialTranslateX = translateX;
        initialTranslateY = translateY;
      }
    }, { passive: false });

    viewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialPinchDist > 0) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        const ratio = currentDist / initialPinchDist;
        const nextScale = Math.min(Math.max(initialPinchScale * ratio, minScale), maxScale);
        scale = Math.round(nextScale * 100) / 100;
        applyTransform();
      } else if (e.touches.length === 1 && isDragging) {
        e.preventDefault();
        translateX = initialTranslateX + (e.touches[0].clientX - dragStartX);
        translateY = initialTranslateY + (e.touches[0].clientY - dragStartY);
        applyTransform();
      }
    }, { passive: false });

    viewport.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) initialPinchDist = 0;
      if (e.touches.length === 0) isDragging = false;
    });
  }

  async startCamera() {
    await this.mediaPipe.initCamera();
  }

  updateAllTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = i18n.t(key);
      }
    });
  }

  startMode1() {
    this.currentState = 'PLAYING_MODE1';
    this.activeMode = this.mode1;
    this.isPaused = false;
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('gameHud').classList.remove('hidden');
    document.getElementById('btnBackMenu').classList.remove('hidden');
    document.getElementById('btnPauseToggle')?.classList.remove('hidden');
    
    const teamSelect = document.getElementById('selectCampTeam');
    const teamId = teamSelect ? teamSelect.value : 'alpha';
    const diffSelect = document.getElementById('selectDifficultyMode1');
    const diff = diffSelect ? diffSelect.value : 2;

    this.mode1.start(teamId, diff);
  }

  startMode2() {
    this.currentState = 'PLAYING_MODE2';
    this.activeMode = this.mode2;
    this.isPaused = false;
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('gameHud').classList.add('hidden');
    document.getElementById('btnBackMenu').classList.remove('hidden');
    document.getElementById('btnPauseToggle')?.classList.remove('hidden');

    const durSelect = document.getElementById('selectDuelDuration');
    const duration = durSelect ? parseInt(durSelect.value, 10) : 30;
    const roundsSelect = document.getElementById('selectDuelRounds');
    const rounds = roundsSelect ? parseInt(roundsSelect.value, 10) : 3;

    this.mode2.start(duration, rounds);
  }

  startMode3() {
    this.currentState = 'PLAYING_MODE3';
    this.activeMode = this.mode3;
    this.isPaused = false;
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('gameHud').classList.add('hidden');
    document.getElementById('btnBackMenu').classList.remove('hidden');
    document.getElementById('btnPauseToggle')?.classList.remove('hidden');

    const runnerSelect = document.getElementById('selectRelayRunners');
    const runners = runnerSelect ? parseInt(runnerSelect.value, 10) : 4;
    const durSelect = document.getElementById('selectRelayDuration');
    const duration = durSelect ? parseInt(durSelect.value, 10) : 15;
    const diffSelect = document.getElementById('selectDifficultyMode3');
    const diff = diffSelect ? parseInt(diffSelect.value, 10) : 2;

    this.mode3.start(runners, duration, diff);
  }

  returnToMenu() {
    this.currentState = 'MENU';
    this.isPaused = false;
    audio.playMenuBGM();

    if (this.activeMode) {
      this.activeMode.active = false;
    }
    this.activeMode = null;
    this.particles.clear();
    this.trailP1.clear();
    this.trailP2.clear();

    document.getElementById('mainMenu').classList.remove('hidden');
    document.getElementById('gameHud').classList.add('hidden');
    document.getElementById('btnBackMenu').classList.add('hidden');
    document.getElementById('btnPauseToggle')?.classList.add('hidden');
    document.getElementById('resultsModal').classList.add('hidden');
    document.getElementById('duelResultModal')?.classList.add('hidden');
    document.getElementById('bossResultModal')?.classList.add('hidden');
    document.getElementById('pauseModal')?.classList.add('hidden');
  }

  onHandResults(hands) {
    if (hands && hands.length > 0) {
      this.lastHandTimestamp = performance.now();
      this.detectedHands = [];

      for (const h of hands) {
        const processed = this.gestureDetector.processHand(h);
        this.detectedHands.push(processed);

        // Only add to blade trail if NOT in Open Palm catch mode
        if (!processed.isCatching) {
          if (processed.tip.x < CONFIG.CANVAS_WIDTH / 2) {
            this.trailP1.addPoint(processed.tip.x, processed.tip.y);
          } else {
            this.trailP2.addPoint(processed.tip.x, processed.tip.y);
          }
        }

        // If moving fast and slashing, emit trailing sparks
        if (processed.isSlashing) {
          const sparkColor = processed.tip.x < CONFIG.CANVAS_WIDTH / 2 ? '#00f3ff' : '#ff0055';
          this.particles.emitSparks(processed.tip.x, processed.tip.y, sparkColor, 2, 180);
        } else if (processed.isCatching && Math.random() < 0.25) {
          // Subtle magnetic containment energy motes around open palm
          this.particles.emitSparks(processed.palm.x + (Math.random() - 0.5) * 30, processed.palm.y + (Math.random() - 0.5) * 30, '#ffb703', 1, 60);
        }
      }
    } else {
      // Empty hands received
      if (this.handExitWatchdogEnabled) {
        // Immediate clear when watchdog is enabled
        this.detectedHands = [];
        this.trailP1.clear();
        this.trailP2.clear();
      }
      // When watchdog is disabled, retain this.detectedHands for 2.0s before clearing in update(dt)
    }
  }

  onModeComplete(resultData) {
    this.lastResultData = resultData;
    const modal = document.getElementById('resultsModal');
    if (!modal) return;

    document.getElementById('resScore').textContent = resultData.score !== undefined ? resultData.score.toLocaleString() : '-';
    document.getElementById('resCombo').textContent = resultData.maxCombo ? `x${resultData.maxCombo}` : '-';
    document.getElementById('resSlashed').textContent = resultData.malwareSlain !== undefined ? resultData.malwareSlain : '-';
    document.getElementById('resCaught').textContent = resultData.safePacketsCaught !== undefined ? resultData.safePacketsCaught : '-';
    document.getElementById('resPenalties').textContent = resultData.penalties !== undefined ? resultData.penalties : '-';

    modal.classList.remove('hidden');
  }

  onDuelComplete(duelResult) {
    this.lastDuelResult = duelResult;
    const modal = document.getElementById('duelResultModal');
    if (!modal) return;

    const banner = document.getElementById('duelWinnerBanner');
    if (banner) {
      if (duelResult.winner === 'P1') {
        banner.textContent = '🏆 PLAYER 1 (BLUE) ชนะการประลอง!';
        banner.style.color = '#00e5ff';
      } else if (duelResult.winner === 'P2') {
        banner.textContent = '🏆 PLAYER 2 (RED) ชนะการประลอง!';
        banner.style.color = '#ff0055';
      } else {
        banner.textContent = '🤝 เสมอกันในการประลอง! (DRAW)';
        banner.style.color = '#ffb703';
      }
    }

    document.getElementById('duelP1Score').textContent = duelResult.p1.score.toLocaleString();
    document.getElementById('duelP1Rounds').textContent = duelResult.p1.roundsWon;
    document.getElementById('duelP1Slashed').textContent = duelResult.p1.slashed;
    document.getElementById('duelP1Caught').textContent = duelResult.p1.caught;
    document.getElementById('duelP1Penalties').textContent = duelResult.p1.penalties;

    document.getElementById('duelP2Score').textContent = duelResult.p2.score.toLocaleString();
    document.getElementById('duelP2Rounds').textContent = duelResult.p2.roundsWon;
    document.getElementById('duelP2Slashed').textContent = duelResult.p2.slashed;
    document.getElementById('duelP2Caught').textContent = duelResult.p2.caught;
    document.getElementById('duelP2Penalties').textContent = duelResult.p2.penalties;

    modal.classList.remove('hidden');
  }

  onBossFightComplete(bossResult) {
    this.lastBossResult = bossResult;
    const modal = document.getElementById('bossResultModal');
    if (!modal) return;

    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) {
      modalTitle.textContent = `🛡️ สรุปผลศึกกำราบ ${bossResult.bossName || 'มัลแวร์บอส'}`;
    }

    const banner = document.getElementById('bossResultBanner');
    if (banner) {
      if (bossResult.victory) {
        banner.textContent = `🏆 ภารกิจสำเร็จ! กำราบ ${bossResult.bossName || 'มัลแวร์บอส'} สำเร็จ!`;
        banner.className = 'boss-banner-victory';
      } else {
        banner.textContent = '💀 ภารกิจล้มเหลว! เซิร์ฟเวอร์โรงเรียนถูกทำลาย!';
        banner.className = 'boss-banner-defeat';
      }
    }

    document.getElementById('bossFinalScore').textContent = bossResult.score.toLocaleString();
    const hpRatio = bossResult.bossMaxHp > 0 ? (bossResult.bossHp / bossResult.bossMaxHp) * 100 : 0;
    document.getElementById('bossRemainingHp').textContent = `${Math.round(hpRatio)}%`;
    document.getElementById('bossDiffLabel').textContent = bossResult.difficulty;
    document.getElementById('bossTotalSlashed').textContent = bossResult.malwareSlain;
    document.getElementById('bossTotalUltimates').textContent = `${bossResult.ultimatesFired} ครั้ง`;

    modal.classList.remove('hidden');
  }

  showLeaderboardModal() {
    this.renderLeaderboardTable();
    document.getElementById('leaderboardModal')?.classList.remove('hidden');
  }

  showHowToPlayModal() {
    document.getElementById('howToPlayModal')?.classList.remove('hidden');
  }

  renderLeaderboardTable() {
    const tbody = document.getElementById('leaderboardBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const scores = leaderboard.getAllScores();
    if (scores.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color: rgba(255,255,255,0.5); font-style: italic;">ยังไม่มีบันทึกคะแนนในค่าย / No records yet</td></tr>`;
      return;
    }

    scores.forEach((s, idx) => {
      const tr = document.createElement('tr');
      const rankBadge = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `${idx + 1}`));
      tr.innerHTML = `
        <td style="font-weight:900; font-size:1.1rem; color:#ffb703;">${rankBadge}</td>
        <td style="font-weight:700; color:#00f3ff;">${s.playerName}</td>
        <td><span class="team-tag team-${s.teamId}">${s.teamId.toUpperCase()}</span></td>
        <td style="font-weight:900; color:#00ff66; font-size:1.2rem;">${s.score.toLocaleString()}</td>
        <td>${s.maxCombo ? `x${s.maxCombo}` : '-'}</td>
        <td style="font-size:0.85rem; opacity:0.8;">${s.date}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  startRenderLoop() {
    const loop = (timestamp) => {
      const dt = Math.min((timestamp - this.lastFrameTime) / 1000, 0.1);
      this.lastFrameTime = timestamp;

      if (!this.isPaused) {
        this.update(dt);
      }
      this.render();

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(dt) {
    // Watchdog: If watchdog is enabled, timeout is 200ms (quick clear when hands leave).
    // If watchdog is disabled (default/recommended), timeout is 2000ms (2 seconds) so cursor stays at the edge/bottom of screen.
    const watchdogTimeout = this.handExitWatchdogEnabled ? 200 : 2000;
    if (performance.now() - this.lastHandTimestamp > watchdogTimeout) {
      this.detectedHands = [];
      this.trailP1.clear();
      this.trailP2.clear();
    }

    this.trailP1.update();
    this.trailP2.update();
    this.particles.update(dt);

    if (this.activeMode && this.activeMode.active) {
      this.activeMode.update(dt, this.detectedHands);
      this.updateHUD();
    }
  }

  updateHUD() {
    if (this.currentState === 'PLAYING_MODE1') {
      const hud = document.getElementById('gameHud');
      if (this.mode1 && this.mode1.activeQuiz) {
        hud?.classList.add('hidden');
        return;
      }
      hud?.classList.remove('hidden');
      document.getElementById('hudTimer').textContent = `${Math.ceil(this.mode1.timeLeft)}s`;
      document.getElementById('hudScore').textContent = this.mode1.score.toLocaleString();
      document.getElementById('hudCombo').textContent = `x${this.mode1.getMultiplier()} (${this.mode1.combo})`;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Render Active Game Mode Entities
    if (this.activeMode && this.activeMode.active) {
      this.activeMode.render(this.ctx);
    }

    // 2. Render Cyber Blade Trails (P1 Cyan, P2 Magenta)
    this.trailP1.render(this.ctx);
    this.trailP2.render(this.ctx);

    // 3. Render Hand Posture & HUD Badges (Open Palm Shield vs 1-Finger Knife Blade with Red Tracker Dot)
    const time = performance.now() * 0.003;
    const isSmooth = Boolean(window.isSmoothMode);

    for (const h of this.detectedHands) {
      if (h.isCatching) {
        this.ctx.save();
        this.ctx.translate(h.palm.x, h.palm.y);

        // Rotating Cyber Hex-Shield Ring
        this.ctx.rotate(time);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, CONFIG.PALM_CATCH_RADIUS, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#00f3ff';
        this.ctx.lineWidth = 2.5;
        this.ctx.setLineDash([12, 8]);
        if (!isSmooth) {
          this.ctx.shadowBlur = 18;
          this.ctx.shadowColor = '#00f3ff';
        }
        this.ctx.stroke();

        // Inner Gold Pulse Ring
        this.ctx.beginPath();
        this.ctx.arc(0, 0, CONFIG.PALM_CATCH_RADIUS * 0.7, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#ffb703';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([6, 6]);
        this.ctx.stroke();

        this.ctx.rotate(-time); // Reset rotation for text
        this.ctx.font = 'bold 13px "Rajdhani", "Kanit", sans-serif';
        this.ctx.fillStyle = '#ffb703';
        this.ctx.textAlign = 'center';
        if (!isSmooth) {
          this.ctx.shadowBlur = 8;
          this.ctx.shadowColor = '#ffb703';
        }
        this.ctx.fillText('✋ SHIELD (กาง 5 นิ้วรับ)', 0, CONFIG.PALM_CATCH_RADIUS + 22);
        this.ctx.restore();
      } else {
        // SINGLE-FINGER KNIFE BLADE (🗡️ ชี้ 1 นิ้วมีด/ดาบ)
        // Vivid Red Circular Aiming Reticle on Fingertip (แสดงแสงสีแดงกลมบนปลายนิ้วทุกครั้งเพื่อใช้เล็ง)
        this.ctx.save();

        const pulse = 1.0 + Math.sin(time * 3.5) * 0.15;

        // 1. Outer Pulsing Neon Red Ring
        this.ctx.beginPath();
        this.ctx.arc(h.tip.x, h.tip.y, 20 * pulse, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#ff0055';
        this.ctx.lineWidth = 2.5;
        if (!isSmooth) {
          this.ctx.shadowBlur = 20;
          this.ctx.shadowColor = '#ff0033';
        }
        this.ctx.stroke();

        // 2. Precision Laser Crosshairs
        this.ctx.beginPath();
        this.ctx.moveTo(h.tip.x - 26, h.tip.y);
        this.ctx.lineTo(h.tip.x - 14, h.tip.y);
        this.ctx.moveTo(h.tip.x + 14, h.tip.y);
        this.ctx.lineTo(h.tip.x + 26, h.tip.y);
        this.ctx.moveTo(h.tip.x, h.tip.y - 26);
        this.ctx.lineTo(h.tip.x, h.tip.y - 14);
        this.ctx.moveTo(h.tip.x, h.tip.y + 14);
        this.ctx.lineTo(h.tip.x, h.tip.y + 26);
        this.ctx.strokeStyle = '#ff0033';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // 3. Solid Crimson Circular Aiming Orb
        this.ctx.beginPath();
        this.ctx.arc(h.tip.x, h.tip.y, 9, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ff0033';
        if (!isSmooth) {
          this.ctx.shadowBlur = 16;
          this.ctx.shadowColor = '#ff0033';
        }
        this.ctx.fill();

        // 4. Ultra Bright White Laser Diode Core
        this.ctx.beginPath();
        this.ctx.arc(h.tip.x, h.tip.y, 4, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        if (!isSmooth) {
          this.ctx.shadowBlur = 8;
          this.ctx.shadowColor = '#ffffff';
        }
        this.ctx.fill();

        // Text Label above fingertip
        this.ctx.font = 'bold 12px "Rajdhani", "Kanit", sans-serif';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        if (!isSmooth) {
          this.ctx.shadowBlur = 8;
          this.ctx.shadowColor = '#ff0033';
        }
        this.ctx.fillText('🎯 จุดเล็งฟัน (BLADE)', h.tip.x, h.tip.y - 28);
        this.ctx.restore();
      }
    }

    // 4. Render Particle VFX & Screen Flashes
    this.particles.render(this.ctx);
  }
}

// Robust Bootstrap: Works both on DOMContentLoaded AND if script is loaded after parse
function bootCyberNinja() {
  if (window.cyberNinjaGame) return;
  const game = new CyberNinjaGame();
  window.cyberNinjaGame = game;
  game.startCamera().catch(err => {
    console.warn('Non-blocking camera notice:', err);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootCyberNinja);
} else {
  bootCyberNinja();
}



})();
