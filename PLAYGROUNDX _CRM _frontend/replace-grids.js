import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src/pages');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let newContent = content.replace(/className="grid grid-cols-4 gap-4"/g, 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"');
      newContent = newContent.replace(/className="grid grid-cols-3 gap-4/g, 'className="grid grid-cols-1 sm:grid-cols-3 gap-4');

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
      }
    }
  }
}

processDir(srcDir);
console.log('Replaced grids successfully.');
