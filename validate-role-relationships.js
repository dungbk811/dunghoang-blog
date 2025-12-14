const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, 'lib/roadmap.ts');
const content = fs.readFileSync(roadmapPath, 'utf-8');

// Extract all work items with their roles
const workPattern = /\{[^}]*id: '([a-z-]+-work)'[^}]*role:\s*'([A-Z]+)'[^}]*\}/gs;
const workRoles = {};

let match;
while ((match = workPattern.exec(content)) !== null) {
  workRoles[match[1]] = match[2];
}

// Also add COO work items (no role field means COO)
const cooWorkPattern = /\{[^}]*id: '([a-z-]+-work)'(?![^}]*role:)[^}]*\}/gs;
const tempContent = content;
while ((match = cooWorkPattern.exec(tempContent)) !== null) {
  if (!workRoles[match[1]]) {
    workRoles[match[1]] = 'COO';
  }
}

console.log(`Total work items with roles: ${Object.keys(workRoles).size}`);
console.log('Role distribution:');
const roleCounts = {};
Object.values(workRoles).forEach(role => {
  roleCounts[role] = (roleCounts[role] || 0) + 1;
});
Object.entries(roleCounts).forEach(([role, count]) => {
  console.log(`  ${role}: ${count} work items`);
});

// Detect learning topic role based on category/subcategory/notes
function detectLearningRole(learningBlock) {
  const text = learningBlock.toLowerCase();

  // Check explicit role indicators
  if (text.includes('cpo') || text.includes('hr ') || text.includes('people') ||
      text.includes('nhân sự') || text.includes('emotional intelligence') ||
      text.includes('dei') || text.includes('workforce planning')) {
    return 'CPO';
  }

  if (text.includes('cfo') || text.includes('financial') || text.includes('tài chính') ||
      text.includes('gaap') || text.includes('ifrs') || text.includes('treasury') ||
      text.includes('m&a') || text.includes('investor') || text.includes('tax')) {
    return 'CFO';
  }

  if (text.includes('clo') || text.includes('legal') || text.includes('pháp lý') ||
      text.includes('litigation') || text.includes('governance') || text.includes('regulatory') ||
      text.includes('employment law') || text.includes('technology law')) {
    return 'CLO';
  }

  // Default to cross-functional or COO
  return 'CROSS';
}

// Check Learning → Work relationships
console.log('\n' + '='.repeat(70));
console.log('CHECKING LEARNING → WORK RELATIONSHIPS');
console.log('='.repeat(70));

const learningPattern = /(\{[^}]*id: '([a-z-]+-learning)'[^}]*relatedWorkIds:\s*\[([^\]]*)\][^}]*\})/gs;
const issues = [];
let totalChecked = 0;

while ((match = learningPattern.exec(content)) !== null) {
  const learningBlock = match[1];
  const learningId = match[2];
  const relatedWorkIdsStr = match[3];

  const relatedWorkIds = relatedWorkIdsStr
    .split(',')
    .map(id => id.trim().replace(/'/g, ''))
    .filter(Boolean);

  if (relatedWorkIds.length === 0) continue;

  const learningRole = detectLearningRole(learningBlock);
  totalChecked++;

  // Check each related work item
  const roleMismatches = [];
  relatedWorkIds.forEach(workId => {
    const workRole = workRoles[workId];
    if (!workRole) {
      roleMismatches.push({ workId, issue: 'NOT_FOUND' });
    } else if (learningRole !== 'CROSS' && workRole !== learningRole) {
      roleMismatches.push({ workId, expected: learningRole, actual: workRole });
    }
  });

  if (roleMismatches.length > 0) {
    issues.push({
      learningId,
      learningRole,
      totalWorks: relatedWorkIds.length,
      mismatches: roleMismatches
    });
  }
}

if (issues.length === 0) {
  console.log(`\n✅ All ${totalChecked} learning topics map to correct role work items!`);
} else {
  console.log(`\n⚠️  Found ${issues.length} learning topics with role mismatches:\n`);

  issues.forEach(({ learningId, learningRole, totalWorks, mismatches }) => {
    console.log(`📌 ${learningId} (${learningRole}):`);
    console.log(`   Total work items: ${totalWorks} | Mismatches: ${mismatches.length}`);
    mismatches.forEach(({ workId, expected, actual, issue }) => {
      if (issue === 'NOT_FOUND') {
        console.log(`     ❌ ${workId} - NOT FOUND`);
      } else {
        console.log(`     ⚠️  ${workId} - Expected: ${expected}, Actual: ${actual}`);
      }
    });
  });
}

// Check Work → Learning relationships
console.log('\n' + '='.repeat(70));
console.log('CHECKING WORK → LEARNING RELATIONSHIPS');
console.log('='.repeat(70));

const workLearningPattern = /\{[^}]*id: '([a-z-]+-work)'[^}]*role:\s*'([A-Z]+)'[^}]*relatedLearningIds:\s*\[([^\]]*)\][^}]*\}/gs;
const workIssues = [];
let totalWorkChecked = 0;

while ((match = workLearningPattern.exec(content)) !== null) {
  const workId = match[1];
  const workRole = match[2];
  const relatedLearningIdsStr = match[3];

  const relatedLearningIds = relatedLearningIdsStr
    .split(',')
    .map(id => id.trim().replace(/'/g, ''))
    .filter(Boolean);

  if (relatedLearningIds.length === 0) continue;

  totalWorkChecked++;

  // For each learning, check if it's appropriate for this work role
  const inappropriateLearning = [];

  relatedLearningIds.forEach(learningId => {
    // Find learning topic in content
    const learningMatch = content.match(new RegExp(`\\{[^}]*id: '${learningId}'[^}]*\\}`, 's'));
    if (!learningMatch) {
      inappropriateLearning.push({ learningId, issue: 'NOT_FOUND' });
      return;
    }

    const learningRole = detectLearningRole(learningMatch[0]);

    // Cross-functional learning is OK for any role
    if (learningRole === 'CROSS') return;

    // Check if learning role matches work role
    if (learningRole !== workRole) {
      inappropriateLearning.push({ learningId, learningRole, workRole });
    }
  });

  if (inappropriateLearning.length > 0) {
    workIssues.push({
      workId,
      workRole,
      totalLearning: relatedLearningIds.length,
      inappropriate: inappropriateLearning
    });
  }
}

if (workIssues.length === 0) {
  console.log(`\n✅ All ${totalWorkChecked} work items map to appropriate learning topics!`);
} else {
  console.log(`\n⚠️  Found ${workIssues.length} work items with inappropriate learning mappings:\n`);

  workIssues.forEach(({ workId, workRole, totalLearning, inappropriate }) => {
    console.log(`📌 ${workId} (${workRole}):`);
    console.log(`   Total learning: ${totalLearning} | Inappropriate: ${inappropriate.length}`);
    inappropriate.forEach(({ learningId, learningRole, issue }) => {
      if (issue === 'NOT_FOUND') {
        console.log(`     ❌ ${learningId} - NOT FOUND`);
      } else {
        console.log(`     ⚠️  ${learningId} - Learning role: ${learningRole}, Work role: ${workRole}`);
      }
    });
  });
}

console.log('\n' + '='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70));
console.log(`Learning → Work: ${totalChecked} checked, ${issues.length} with issues`);
console.log(`Work → Learning: ${totalWorkChecked} checked, ${workIssues.length} with issues`);
console.log('='.repeat(70));
