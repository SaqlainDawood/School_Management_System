const fs = require('fs');
const warnings = JSON.parse(fs.readFileSync('lint_parsed.json', 'utf8'));

const functionalRules = new Set([
  'react(immutability)',
  'react-hooks(exhaustive-deps)',
  'react(purity)',
  'react(set-state-in-effect)'
]);

const functionalByFile = {};
warnings.forEach(w => {
  if (functionalRules.has(w.rule)) {
    if (!functionalByFile[w.file]) functionalByFile[w.file] = [];
    functionalByFile[w.file].push(w);
  }
});

console.log('Total functional warnings:', Object.values(functionalByFile).reduce((a, b) => a + b.length, 0));
console.log('Files with functional warnings:', Object.keys(functionalByFile).length);
console.log('--- Functional warnings by file ---');
for (const [file, list] of Object.entries(functionalByFile)) {
  console.log(`\n${file} (${list.length}):`);
  list.forEach(item => console.log(`  Line ${item.line}: ${item.rule}`));
}

