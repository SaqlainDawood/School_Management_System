const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const baseDir = path.resolve(__dirname, 'School_Management_System-main/src');
const files = walk(baseDir);
const apiCalls = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const match = line.match(/api\.(get|post|put|delete|patch)\s*\(\s*([`'"][^`'"]+[`'"])/);
    if (match) {
      apiCalls.push({
        file: path.relative(path.resolve(__dirname, 'School_Management_System-main'), file).replace(/\\/g, '/'),
        line: idx + 1,
        method: match[1].toUpperCase(),
        endpoint: match[2].slice(1, -1)
      });
    } else {
      // Check multi-line or variable endpoint
      const general = line.match(/api\.(get|post|put|delete|patch)\s*\((.*)/);
      if (general && !match) {
        apiCalls.push({
          file: path.relative(path.resolve(__dirname, 'School_Management_System-main'), file).replace(/\\/g, '/'),
          line: idx + 1,
          method: general[1].toUpperCase(),
          endpoint: general[2].trim().slice(0, 60)
        });
      }
    }
  });
});

fs.writeFileSync('api_inventory.json', JSON.stringify(apiCalls, null, 2));
console.log(`Found ${apiCalls.length} API calls`);

