const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, 'lib/roadmap.ts');
let content = fs.readFileSync(roadmapPath, 'utf-8');

console.log('='.repeat(70));
console.log('FIXING ROLE MISMATCHES');
console.log('='.repeat(70));

// Define fixes
const fixes = [
  {
    type: 'remove-work-from-learning',
    learningId: 'performance-evaluation-framework-learning',
    workIdsToRemove: ['redmine-kpi-system-work'],
    reason: 'CPO learning should not map to COO work'
  },
  {
    type: 'remove-work-from-learning',
    learningId: 'hr-data-analytics-learning',
    workIdsToRemove: ['utilization-tracking-work'],
    reason: 'CPO learning should not map to COO work'
  },
  {
    type: 'remove-work-from-learning',
    learningId: 'crisis-management-legal-learning',
    workIdsToRemove: ['crisis-response-protocol-work', 'crisis-communication-work'],
    reason: 'CLO learning should not map to COO work'
  },
  // Note: financial-savvy-hr-learning → CFO work is intentional
  // (HR leaders learning about finance domain)
];

let fixCount = 0;

// Apply fixes
fixes.forEach(({ learningId, workIdsToRemove, reason }) => {
  console.log(`\n📌 Fixing ${learningId}`);
  console.log(`   Reason: ${reason}`);

  // Find the learning topic block
  const idIndex = content.indexOf(`id: '${learningId}'`);

  if (idIndex === -1) {
    console.log(`   ⚠️  Learning topic not found`);
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

  // Extract current relatedWorkIds
  const workIdsMatch = learningBlock.match(/relatedWorkIds:\s*\[([^\]]*)\]/);

  if (!workIdsMatch) {
    console.log(`   ⚠️  No relatedWorkIds found`);
    return;
  }

  const currentWorkIds = workIdsMatch[1]
    .split(',')
    .map(id => id.trim().replace(/'/g, ''))
    .filter(Boolean);

  // Remove specified work IDs
  const newWorkIds = currentWorkIds.filter(id => !workIdsToRemove.includes(id));

  if (newWorkIds.length === currentWorkIds.length) {
    console.log(`   ℹ️  No changes needed (work IDs already removed)`);
    return;
  }

  // Replace relatedWorkIds
  const newIdsStr = newWorkIds.map(id => `'${id}'`).join(', ');
  const newBlock = learningBlock.replace(
    /relatedWorkIds:\s*\[[^\]]*\]/,
    `relatedWorkIds: [${newIdsStr}]`
  );

  content = content.substring(0, openBraceIndex) + newBlock + content.substring(closeBraceIndex);

  console.log(`   ✅ Removed: ${workIdsToRemove.join(', ')}`);
  console.log(`   New count: ${newWorkIds.length} work items`);
  fixCount++;
});

// Now remove reverse links (Learning from Work)
console.log('\n' + '='.repeat(70));
console.log('REMOVING REVERSE LINKS');
console.log('='.repeat(70));

const reverseFixes = [
  {
    workId: 'redmine-kpi-system-work',
    learningIdsToRemove: ['performance-evaluation-framework-learning']
  },
  {
    workId: 'utilization-tracking-work',
    learningIdsToRemove: ['hr-data-analytics-learning']
  },
  {
    workId: 'crisis-response-protocol-work',
    learningIdsToRemove: ['crisis-management-legal-learning']
  },
  {
    workId: 'crisis-communication-work',
    learningIdsToRemove: ['crisis-management-legal-learning']
  }
];

reverseFixes.forEach(({ workId, learningIdsToRemove }) => {
  console.log(`\n📌 Fixing ${workId}`);

  // Find the work item block
  const idIndex = content.indexOf(`id: '${workId}'`);

  if (idIndex === -1) {
    console.log(`   ⚠️  Work item not found`);
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

  const workBlock = content.substring(openBraceIndex, closeBraceIndex);

  // Extract current relatedLearningIds
  const learningIdsMatch = workBlock.match(/relatedLearningIds:\s*\[([^\]]*)\]/);

  if (!learningIdsMatch) {
    console.log(`   ⚠️  No relatedLearningIds found`);
    return;
  }

  const currentLearningIds = learningIdsMatch[1]
    .split(',')
    .map(id => id.trim().replace(/'/g, ''))
    .filter(Boolean);

  // Remove specified learning IDs
  const newLearningIds = currentLearningIds.filter(id => !learningIdsToRemove.includes(id));

  if (newLearningIds.length === currentLearningIds.length) {
    console.log(`   ℹ️  No changes needed (learning IDs already removed)`);
    return;
  }

  // Replace relatedLearningIds
  const newIdsStr = newLearningIds.map(id => `'${id}'`).join(', ');
  const newBlock = workBlock.replace(
    /relatedLearningIds:\s*\[[^\]]*\]/,
    `relatedLearningIds: [${newIdsStr}]`
  );

  content = content.substring(0, openBraceIndex) + newBlock + content.substring(closeBraceIndex);

  console.log(`   ✅ Removed: ${learningIdsToRemove.join(', ')}`);
  console.log(`   New count: ${newLearningIds.length} learning items`);
  fixCount++;
});

// Write back
fs.writeFileSync(roadmapPath, content, 'utf-8');

console.log('\n' + '='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70));
console.log(`✅ Applied ${fixCount} fixes`);
console.log(`\nNote: Kept financial-savvy-hr-learning → CFO work mappings`);
console.log(`      (Intentional: HR leaders learning about finance domain)`);
console.log('='.repeat(70));
