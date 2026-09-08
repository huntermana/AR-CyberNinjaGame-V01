// Cyber Ninja: Firewall Slasher - Camp Leaderboard & Team Score Manager

export class LeaderboardManager {
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

export const leaderboard = new LeaderboardManager();
