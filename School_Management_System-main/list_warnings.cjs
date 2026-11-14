const { execSync } = require('child_process');

let content = '';
try {
  content = execSync('npx oxlint', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
} catch (err) {
  content = (err.stdout || '') + '\n' + (err.stderr || '');
}

const lines = content.split('\n');
let curRule = '';
for (const line of lines) {
  const rm = line.match(/^\s*!\s*([^:]+):/);
  if (rm) curRule = rm[1].trim();
  const fm = line.match(/,-\[(src\/[^:]+):(\d+):(\d+)\]/);
  if (fm) console.log(`${curRule.padEnd(30)} ${fm[1]}:${fm[2]}`);
}

