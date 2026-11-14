const { execSync } = require('child_process');
const fs = require('fs');

let content = '';
try {
  content = execSync('npx oxlint', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
} catch (err) {
  content = (err.stdout || '') + '\n' + (err.stderr || '');
}

const lines = content.split('\n');
const warnings = [];
let currentRule = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const rm = line.match(/^\s*!\s*([^:]+):\s*(.*)$/);
  if (rm) {
    currentRule = rm[1].trim();
  }
  const fm = line.match(/,-\[(src\/[^:]+):(\d+):(\d+)\]/);
  if (fm) {
    const file = fm[1];
    const lineNum = parseInt(fm[2], 10);
    warnings.push({ rule: currentRule, file, line: lineNum });
  }
}

const functionalRules = new Set([
  'react(immutability)',
  'react-hooks(exhaustive-deps)',
  'react(purity)',
  'react(set-state-in-effect)'
]);

const fByFile = {};
const rulesCount = {};
let totalF = 0;
for (const w of warnings) {
  rulesCount[w.rule] = (rulesCount[w.rule] || 0) + 1;
  if (functionalRules.has(w.rule)) {
    totalF++;
    if (!fByFile[w.file]) fByFile[w.file] = [];
    fByFile[w.file].push(w);
  }
}

console.log('Total warnings:', warnings.length);
console.log('Rules count:', JSON.stringify(rulesCount, null, 2));
console.log('Total functional warnings:', totalF);
console.log('Files with functional warnings count:', Object.keys(fByFile).length);
console.log('Files with functional warnings:', Object.keys(fByFile));
