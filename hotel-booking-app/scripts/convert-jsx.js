import fs from 'fs';
import path from 'path';

const root = path.resolve('./src');
const jsxRegex = /<\/?.[A-Za-z]/; // crude JSX detector

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const abs = path.join(dir, f);
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      if (f === 'node_modules') continue;
      walk(abs);
    } else if (stat.isFile() && abs.endsWith('.js')) {
      try {
        const content = fs.readFileSync(abs, 'utf8');
        // skip if already simple re-export wrapper
        if (/export\s+\{\s*default\s*\}\s+from\s+['\"]/.test(content.trim())) continue;
        if (jsxRegex.test(content)) {
          const newPath = abs.replace(/\.js$/, '.jsx');
          if (!fs.existsSync(newPath)) {
            fs.writeFileSync(newPath, content, 'utf8');
            console.log('CREATED:', path.relative(root, newPath));
          } else {
            console.log('SKIP (exists):', path.relative(root, newPath));
          }
          // replace original .js with re-export
          const rel = './' + path.basename(newPath);
          const wrapper = `// Auto-generated wrapper: re-export JSX implementation\nexport { default } from '${rel}';\n`;
          fs.writeFileSync(abs, wrapper, 'utf8');
          console.log('WRAPPED:', path.relative(root, abs));
        }
      } catch (err) {
        console.error('ERR', abs, err.message);
      }
    }
  }
}

console.log('Scanning', root);
walk(root);
console.log('Done.');
