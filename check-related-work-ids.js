const fs = require('fs');
const path = require('path');

// Read roadmap file
const roadmapPath = path.join(__dirname, 'lib/roadmap.ts');
const content = fs.readFileSync(roadmapPath, 'utf-8');

// Extract all work item IDs
const workIdMatches = content.match(/id: '[a-z-]+-work'/g);
const workIds = new Set(workIdMatches.map(m => m.match(/'([^']+)'/)[1]));

console.log(`Total work items found: ${workIds.size}\n`);

// Extract all learning topics and their relatedWorkIds
const learningPattern = /\{[^}]*id: '([a-z-]+-learning)'[^}]*relatedWorkIds:\s*\[([^\]]*)\][^}]*\}/gs;
let match;
const issues = [];
const validMappings = [];

while ((match = learningPattern.exec(content)) !== null) {
  const learningId = match[1];
  const relatedWorkIdsStr = match[2];

  // Parse work IDs
  const relatedWorkIds = relatedWorkIdsStr
    .split(',')
    .map(id => id.trim().replace(/'/g, ''))
    .filter(Boolean);

  if (relatedWorkIds.length === 0) {
    continue;
  }

  // Check if each work ID exists
  const missing = [];
  const found = [];

  relatedWorkIds.forEach(workId => {
    if (workIds.has(workId)) {
      found.push(workId);
    } else {
      missing.push(workId);
    }
  });

  if (missing.length > 0) {
    issues.push({
      learningId,
      missing,
      found: found.length,
      total: relatedWorkIds.length
    });
  } else {
    validMappings.push({
      learningId,
      count: relatedWorkIds.length
    });
  }
}

// Print results
console.log('='.repeat(70));
console.log('VALIDATION RESULTS');
console.log('='.repeat(70));

console.log(`\n✅ Valid mappings: ${validMappings.length} learning topics`);
validMappings.forEach(({ learningId, count }) => {
  console.log(`   ${learningId}: ${count} work items mapped`);
});

if (issues.length > 0) {
  console.log(`\n❌ Issues found: ${issues.length} learning topics have missing work IDs\n`);

  issues.forEach(({ learningId, missing, found, total }) => {
    console.log(`\n📌 ${learningId}:`);
    console.log(`   Total: ${total} | Found: ${found} | Missing: ${missing.length}`);
    console.log(`   Missing IDs:`);
    missing.forEach(id => console.log(`     - ${id}`));
  });
} else {
  console.log(`\n✅ All relatedWorkIds are valid!`);
}

console.log('\n' + '='.repeat(70));
console.log(`Summary: ${validMappings.length} valid, ${issues.length} with issues`);
console.log('='.repeat(70));
