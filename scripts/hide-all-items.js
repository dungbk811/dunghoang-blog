const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, '..', 'lib', 'roadmap.ts');

// Read the file
let content = fs.readFileSync(roadmapPath, 'utf-8');

// Step 1: Replace all existing hidden: false with hidden: true
let updatedCount = 0;
content = content.replace(/hidden:\s*false/g, () => {
  updatedCount++;
  return 'hidden: true';
});

console.log(`✅ Updated ${updatedCount} items from hidden: false to hidden: true`);

// Step 2: Add hidden: true after status for items that don't have it
// Match: status: 'value',\n followed by NOT hidden:
// Insert hidden: true, right after status line

let addedCount = 0;

// Use a more specific regex that matches status line followed by next line that's NOT hidden
content = content.replace(
  /(status:\s*'[^']+',)\n(\s+)(?!hidden:)/g,
  (match, statusLine, indent) => {
    addedCount++;
    return statusLine + '\n' + indent + 'hidden: true,\n' + indent;
  }
);

console.log(`✅ Added hidden: true to ${addedCount} items`);

// Write back
fs.writeFileSync(roadmapPath, content, 'utf-8');

console.log('✅ All items are now hidden: true');
