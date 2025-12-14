const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, 'lib/roadmap.ts');
let content = fs.readFileSync(roadmapPath, 'utf-8');

// Extract all work items with their relatedLearningIds
const workPattern = /\{[^}]*id: '([a-z-]+-work)'[^}]*relatedLearningIds:\s*\[([^\]]*)\][^}]*\}/gs;
let match;

// Build reverse mapping: learningId -> [workIds]
const learningToWork = {};

while ((match = workPattern.exec(content)) !== null) {
  const workId = match[1];
  const relatedLearningIdsStr = match[2];

  const learningIds = relatedLearningIdsStr
    .split(',')
    .map(id => id.trim().replace(/'/g, ''))
    .filter(Boolean);

  learningIds.forEach(learningId => {
    if (!learningToWork[learningId]) {
      learningToWork[learningId] = [];
    }
    learningToWork[learningId].push(workId);
  });
}

console.log('Extracted reverse mappings (Learning -> Work):');
console.log(`Total learning topics with work mappings: ${Object.keys(learningToWork).length}\n`);

let updatedCount = 0;

// Now update each learning topic's relatedWorkIds
Object.entries(learningToWork).forEach(([learningId, workIds]) => {
  // Find the learning topic block
  const idIndex = content.indexOf(`id: '${learningId}'`);

  if (idIndex === -1) {
    console.log(`⚠️  Learning topic not found: ${learningId}`);
    return;
  }

  // Find the opening brace before this id
  let openBraceIndex = content.lastIndexOf('{', idIndex);

  // Find the matching closing brace
  let braceCount = 1;
  let closeBraceIndex = openBraceIndex + 1;
  while (braceCount > 0 && closeBraceIndex < content.length) {
    if (content[closeBraceIndex] === '{') braceCount++;
    if (content[closeBraceIndex] === '}') braceCount--;
    closeBraceIndex++;
  }

  const learningBlock = content.substring(openBraceIndex, closeBraceIndex);

  // Check if relatedWorkIds exists
  const hasRelatedWorkIds = learningBlock.includes('relatedWorkIds');

  if (hasRelatedWorkIds) {
    // Replace existing relatedWorkIds
    const newIdsStr = workIds.map(id => `'${id}'`).join(', ');
    const newBlock = learningBlock.replace(
      /relatedWorkIds:\s*\[[^\]]*\]/,
      `relatedWorkIds: [${newIdsStr}]`
    );

    content = content.substring(0, openBraceIndex) + newBlock + content.substring(closeBraceIndex);
    console.log(`✅ Updated ${learningId}: ${workIds.length} work items`);
    updatedCount++;
  } else {
    console.log(`⚠️  No relatedWorkIds field found for ${learningId}`);
  }
});

// Write back
fs.writeFileSync(roadmapPath, content, 'utf-8');

console.log('\n' + '='.repeat(60));
console.log(`✅ Updated: ${updatedCount} learning topics`);
console.log('='.repeat(60));
