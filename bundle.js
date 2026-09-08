// Bundler & Optimizer for Cyber Ninja: Firewall Slasher
const fs = require('fs');
const path = require('path');

const files = [
  'js/config.js',
  'js/i18n.js',
  'js/audio.js',
  'js/asset-manager.js',
  'js/tracking/gesture-detector.js',
  'js/tracking/blade-trail.js',
  'js/tracking/mediapipe-adapter.js',
  'js/entities/particle-system.js',
  'js/entities/malware.js',
  'js/entities/safe-packet.js',
  'js/entities/floating-pod.js',
  'js/modes/score-attack.js',
  'js/modes/split-duel.js',
  'js/modes/firewall-relay.js',
  'js/ui/leaderboard.js',
  'js/ui/tv-broadcast.js',
  'js/game.js'
];

let bundle = '(function() {\n  "use strict";\n\n';

files.forEach(f => {
  let content = fs.readFileSync(path.join(__dirname, f), 'utf8');
  // Strip import statements
  content = content.replace(/^import\s+.*?;\s*$/gm, '');
  // Strip export keywords
  content = content.replace(/^export\s+(const|class|let|var|function)\s+/gm, '$1 ');
  bundle += '// ==========================================\n';
  bundle += '// Source: ' + f + '\n';
  bundle += '// ==========================================\n';
  bundle += content + '\n\n';
});

bundle += '\n})();\n';

fs.writeFileSync(path.join(__dirname, 'js', 'game-bundle.js'), bundle, 'utf8');
console.log('Successfully bundled ' + files.length + ' files into js/game-bundle.js (' + bundle.length + ' bytes)');
