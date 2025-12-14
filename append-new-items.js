const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, 'lib/roadmap.ts');
const { newItems } = require('./new-items-to-add.js');

console.log('Reading roadmap.ts...');
const content = fs.readFileSync(roadmapPath, 'utf-8');
const lines = content.split('\n');

// Find the line with closing bracket ];
const closingLineIndex = lines.findIndex((line, idx) => {
  return idx > 2400 && line.trim() === '];' && idx < 2500;
});

if (closingLineIndex === -1) {
  console.error('Could not find closing bracket for cooRoadmap array');
  process.exit(1);
}

console.log(`Found closing bracket at line ${closingLineIndex + 1}`);

// Convert newItems to TypeScript format
const itemsToAdd = newItems.map(item => {
  const lines = [];
  lines.push('  {');
  lines.push(`    id: '${item.id}',`);
  lines.push(`    title: '${item.title}',`);
  lines.push(`    description: '${item.description}',`);
  lines.push(`    category: '${item.category}',`);
  lines.push(`    subcategory: '${item.subcategory}',`);
  lines.push(`    status: '${item.status}',`);
  lines.push(`    level: '${item.level}',`);
  lines.push(`    role: '${item.role}',`);
  lines.push(`    hidden: ${item.hidden},`);
  if (item.targetDate) {
    lines.push(`    targetDate: '${item.targetDate}',`);
  }
  lines.push(`    tags: [${item.tags.map(t => `'${t}'`).join(', ')}],`);
  if (item.relatedLearningIds) {
    lines.push(`    relatedLearningIds: [${item.relatedLearningIds.map(id => `'${id}'`).join(', ')}],`);
  }
  lines.push(`    notes: '${item.notes}',`);
  lines.push('  },');
  return lines.join('\n');
});

// Insert new items before closing bracket
const beforeClosing = lines.slice(0, closingLineIndex);
const afterClosing = lines.slice(closingLineIndex);

const newContent = [
  ...beforeClosing,
  '',
  '  // ========================================',
  '  // === NEW ITEMS ADDED FROM RESEARCH ===',
  '  // === Research sources: MIT, Wharton, McKinsey, Deloitte, SHRM ===',
  '  // ========================================',
  '',
  ...itemsToAdd,
  ...afterClosing
].join('\n');

console.log(`Writing ${newItems.length} new items to roadmap.ts...`);
fs.writeFileSync(roadmapPath, newContent, 'utf-8');

console.log('✓ Done!');
console.log(`Added ${newItems.length} items`);
console.log(`New total: ${90 + newItems.length} items`);
