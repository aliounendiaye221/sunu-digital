import fs from 'fs';
import path from 'path';

const srcDir = 'C:\\Users\\aliou\\.gemini\\antigravity\\brain\\5dcb5cc3-7366-4ae7-b1ef-aa3b1d880114\\';
const destDir = 'c:\\Users\\aliou\\Sunu Digital\\images\\';

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);

fs.readdirSync(srcDir).forEach(file => {
    if (file.endsWith('.png')) {
        fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    }
});
console.log('Done copying');
