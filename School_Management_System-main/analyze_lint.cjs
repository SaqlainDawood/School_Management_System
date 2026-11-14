const fs = require('fs');
const content = fs.readFileSync(process.env.TEMP + '/lint_baseline.txt', 'utf8');
const lines = content.split('\n');

const warnings = [];
let currentRule = null;
let currentHelp = '';

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

fs.writeFileSync('lint_parsed.json', JSON.stringify(warnings, null, 2));

const byRule = {};
for (const w of warnings) {
  byRule[w.rule] = (byRule[w.rule] || 0) + 1;
}
console.log('Total parsed:', warnings.length);
console.log('By rule:', JSON.stringify(byRule, null, 2));

