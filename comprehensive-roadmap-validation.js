const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, 'lib/roadmap.ts');
const content = fs.readFileSync(roadmapPath, 'utf-8');

console.log('='.repeat(80));
console.log('COMPREHENSIVE ROADMAP VALIDATION');
console.log('='.repeat(80));

const issues = [];
const warnings = [];
const stats = {
  totalLearning: 0,
  totalWork: 0,
  learningWithWork: 0,
  workWithLearning: 0,
  emptyRelations: 0
};

// 1. Extract all work items
console.log('\n📊 STEP 1: Extracting all work items...');
const workIdPattern = /\{[^}]*id: '([a-z-]+-work)'[^}]*\}/gs;
const workItems = new Map();
let match;

while ((match = workIdPattern.exec(content)) !== null) {
  const fullMatch = match[0];
  const workId = match[1];

  // Extract role
  const roleMatch = fullMatch.match(/role:\s*'([A-Z]+)'/);
  const role = roleMatch ? roleMatch[1] : 'COO';

  // Extract relatedLearningIds
  const learningIdsMatch = fullMatch.match(/relatedLearningIds:\s*\[([^\]]*)\]/);
  const learningIds = learningIdsMatch
    ? learningIdsMatch[1].split(',').map(id => id.trim().replace(/'/g, '')).filter(Boolean)
    : [];

  // Extract title
  const titleMatch = fullMatch.match(/title:\s*'([^']+)'/);
  const title = titleMatch ? titleMatch[1] : 'NO TITLE';

  workItems.set(workId, { role, learningIds, title });
  stats.totalWork++;
}

console.log(`✅ Found ${stats.totalWork} work items`);
console.log(`   - COO: ${Array.from(workItems.values()).filter(w => w.role === 'COO').length}`);
console.log(`   - CPO: ${Array.from(workItems.values()).filter(w => w.role === 'CPO').length}`);
console.log(`   - CFO: ${Array.from(workItems.values()).filter(w => w.role === 'CFO').length}`);
console.log(`   - CLO: ${Array.from(workItems.values()).filter(w => w.role === 'CLO').length}`);

// 2. Extract all learning items
console.log('\n📊 STEP 2: Extracting all learning items...');
const learningIdPattern = /\{[^}]*id: '([a-z-]+-learning)'[^}]*\}/gs;
const learningItems = new Map();

while ((match = learningIdPattern.exec(content)) !== null) {
  const fullMatch = match[0];
  const learningId = match[1];

  // Extract relatedWorkIds
  const workIdsMatch = fullMatch.match(/relatedWorkIds:\s*\[([^\]]*)\]/);
  const workIds = workIdsMatch
    ? workIdsMatch[1].split(',').map(id => id.trim().replace(/'/g, '')).filter(Boolean)
    : [];

  // Extract title
  const titleMatch = fullMatch.match(/title:\s*'([^']+)'/);
  const title = titleMatch ? titleMatch[1] : 'NO TITLE';

  // Detect role from content
  const text = fullMatch.toLowerCase();
  let detectedRole = 'CROSS';

  if (text.includes('cpo') || text.includes('hr ') || text.includes('people') ||
      text.includes('nhân sự') || text.includes('emotional intelligence')) {
    detectedRole = 'CPO';
  } else if (text.includes('cfo') || text.includes('financial') || text.includes('tài chính') ||
             text.includes('gaap') || text.includes('treasury')) {
    detectedRole = 'CFO';
  } else if (text.includes('clo') || text.includes('legal') || text.includes('pháp lý') ||
             text.includes('litigation') || text.includes('governance')) {
    detectedRole = 'CLO';
  }

  learningItems.set(learningId, { workIds, title, detectedRole });
  stats.totalLearning++;
}

console.log(`✅ Found ${stats.totalLearning} learning items`);
console.log(`   - CPO-related: ${Array.from(learningItems.values()).filter(l => l.detectedRole === 'CPO').length}`);
console.log(`   - CFO-related: ${Array.from(learningItems.values()).filter(l => l.detectedRole === 'CFO').length}`);
console.log(`   - CLO-related: ${Array.from(learningItems.values()).filter(l => l.detectedRole === 'CLO').length}`);
console.log(`   - Cross-functional: ${Array.from(learningItems.values()).filter(l => l.detectedRole === 'CROSS').length}`);

// 3. Check for duplicate IDs
console.log('\n🔍 STEP 3: Checking for duplicate IDs...');
const allIds = new Map();
const duplicates = [];

[...workItems.keys(), ...learningItems.keys()].forEach(id => {
  if (allIds.has(id)) {
    duplicates.push(id);
    issues.push({
      type: 'DUPLICATE_ID',
      id,
      severity: 'ERROR',
      message: `Duplicate ID found: ${id}`
    });
  }
  allIds.set(id, true);
});

if (duplicates.length === 0) {
  console.log('✅ No duplicate IDs found');
} else {
  console.log(`❌ Found ${duplicates.length} duplicate IDs:`);
  duplicates.forEach(id => console.log(`   - ${id}`));
}

// 4. Validate Learning → Work relationships
console.log('\n🔍 STEP 4: Validating Learning → Work relationships...');
let learningWorkIssues = 0;

learningItems.forEach((learning, learningId) => {
  if (learning.workIds.length === 0) {
    warnings.push({
      type: 'EMPTY_WORK_IDS',
      id: learningId,
      severity: 'WARNING',
      message: `Learning topic has no related work items: ${learning.title}`
    });
    stats.emptyRelations++;
  } else {
    stats.learningWithWork++;
  }

  learning.workIds.forEach(workId => {
    // Check if work ID exists
    if (!workItems.has(workId)) {
      issues.push({
        type: 'INVALID_WORK_ID',
        learningId,
        workId,
        severity: 'ERROR',
        message: `Learning "${learning.title}" references non-existent work: ${workId}`
      });
      learningWorkIssues++;
    } else {
      // Check role consistency (allow CROSS to map anywhere)
      const work = workItems.get(workId);
      if (learning.detectedRole !== 'CROSS' && learning.detectedRole !== work.role) {
        // Check if it's intentional cross-role learning
        const isIntentional = learningId === 'financial-savvy-hr-learning' && work.role === 'CFO';

        if (!isIntentional) {
          warnings.push({
            type: 'ROLE_MISMATCH',
            learningId,
            workId,
            severity: 'WARNING',
            message: `Role mismatch: ${learning.detectedRole} learning "${learning.title}" → ${work.role} work "${work.title}"`
          });
          learningWorkIssues++;
        }
      }
    }
  });
});

console.log(`✅ ${stats.learningWithWork} learning topics have work relationships`);
console.log(`⚠️  ${stats.emptyRelations} learning topics have no work items`);
if (learningWorkIssues > 0) {
  console.log(`❌ Found ${learningWorkIssues} relationship issues`);
}

// 5. Validate Work → Learning relationships
console.log('\n🔍 STEP 5: Validating Work → Learning relationships...');
let workLearningIssues = 0;

workItems.forEach((work, workId) => {
  if (work.learningIds.length > 0) {
    stats.workWithLearning++;
  }

  work.learningIds.forEach(learningId => {
    // Check if learning ID exists
    if (!learningItems.has(learningId)) {
      issues.push({
        type: 'INVALID_LEARNING_ID',
        workId,
        learningId,
        severity: 'ERROR',
        message: `Work "${work.title}" references non-existent learning: ${learningId}`
      });
      workLearningIssues++;
    }
  });
});

console.log(`✅ ${stats.workWithLearning} work items have learning relationships`);
if (workLearningIssues > 0) {
  console.log(`❌ Found ${workLearningIssues} relationship issues`);
}

// 6. Check bidirectional consistency
console.log('\n🔍 STEP 6: Checking bidirectional consistency...');
let bidirectionalIssues = 0;

// Check: If Learning → Work, then Work should → Learning
learningItems.forEach((learning, learningId) => {
  learning.workIds.forEach(workId => {
    const work = workItems.get(workId);
    if (work && !work.learningIds.includes(learningId)) {
      warnings.push({
        type: 'MISSING_REVERSE_LINK',
        learningId,
        workId,
        severity: 'WARNING',
        message: `Learning "${learning.title}" → Work "${work.title}" but reverse link missing`
      });
      bidirectionalIssues++;
    }
  });
});

// Check: If Work → Learning, then Learning should → Work
workItems.forEach((work, workId) => {
  work.learningIds.forEach(learningId => {
    const learning = learningItems.get(learningId);
    if (learning && !learning.workIds.includes(workId)) {
      warnings.push({
        type: 'MISSING_FORWARD_LINK',
        workId,
        learningId,
        severity: 'WARNING',
        message: `Work "${work.title}" → Learning "${learning.title}" but forward link missing`
      });
      bidirectionalIssues++;
    }
  });
});

if (bidirectionalIssues === 0) {
  console.log('✅ All bidirectional relationships are consistent');
} else {
  console.log(`⚠️  Found ${bidirectionalIssues} bidirectional inconsistencies`);
}

// 7. Check for orphaned items
console.log('\n🔍 STEP 7: Checking for orphaned items...');
let orphanedLearning = 0;
let orphanedWork = 0;

learningItems.forEach((learning, learningId) => {
  if (learning.workIds.length === 0) {
    orphanedLearning++;
  }
});

workItems.forEach((work, workId) => {
  if (work.learningIds.length === 0) {
    orphanedWork++;
  }
});

console.log(`ℹ️  ${orphanedLearning} learning topics have no work relationships`);
console.log(`ℹ️  ${orphanedWork} work items have no learning relationships`);

// 8. FINAL REPORT
console.log('\n' + '='.repeat(80));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(80));

console.log('\n📊 Statistics:');
console.log(`   Total Learning Topics: ${stats.totalLearning}`);
console.log(`   Total Work Items: ${stats.totalWork}`);
console.log(`   Learning with Work links: ${stats.learningWithWork} (${Math.round(stats.learningWithWork/stats.totalLearning*100)}%)`);
console.log(`   Work with Learning links: ${stats.workWithLearning} (${Math.round(stats.workWithLearning/stats.totalWork*100)}%)`);

console.log('\n🔴 ERRORS (Must Fix):');
const errors = issues.filter(i => i.severity === 'ERROR');
if (errors.length === 0) {
  console.log('   ✅ No errors found!');
} else {
  console.log(`   Found ${errors.length} errors:\n`);
  errors.forEach(err => {
    console.log(`   ❌ [${err.type}] ${err.message}`);
  });
}

console.log('\n⚠️  WARNINGS (Should Review):');
const warns = [...issues.filter(i => i.severity === 'WARNING'), ...warnings];
if (warns.length === 0) {
  console.log('   ✅ No warnings!');
} else {
  console.log(`   Found ${warns.length} warnings:\n`);
  warns.slice(0, 10).forEach(warn => {
    console.log(`   ⚠️  [${warn.type}] ${warn.message}`);
  });
  if (warns.length > 10) {
    console.log(`   ... and ${warns.length - 10} more warnings`);
  }
}

console.log('\n' + '='.repeat(80));
if (errors.length === 0 && bidirectionalIssues === 0) {
  console.log('✅ ROADMAP STRUCTURE IS VALID AND CONSISTENT');
} else if (errors.length === 0) {
  console.log('⚠️  ROADMAP HAS MINOR ISSUES (warnings only)');
} else {
  console.log('❌ ROADMAP HAS CRITICAL ISSUES (must fix errors)');
}
console.log('='.repeat(80));

// Save detailed report
const report = {
  timestamp: new Date().toISOString(),
  stats,
  errors,
  warnings: warns,
  orphaned: {
    learning: orphanedLearning,
    work: orphanedWork
  }
};

fs.writeFileSync(
  path.join(__dirname, 'roadmap-validation-report.json'),
  JSON.stringify(report, null, 2),
  'utf-8'
);

console.log('\n💾 Detailed report saved to: roadmap-validation-report.json');
