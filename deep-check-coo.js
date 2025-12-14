const { cooRoadmap } = require('./lib/roadmap.ts');

console.log('=== DEEP CHECK COO DATA ===\n');

const cooItems = cooRoadmap.filter(item => item.role === 'COO');

console.log(`Total COO items: ${cooItems.length}\n`);

// 1. Check for duplicates
console.log('1. CHECKING FOR DUPLICATES');
console.log('='.repeat(70));

const ids = new Map();
const titles = new Map();
const duplicates = [];

cooItems.forEach((item, idx) => {
  // Check duplicate IDs
  if (ids.has(item.id)) {
    duplicates.push({
      type: 'ID',
      value: item.id,
      first: ids.get(item.id),
      second: idx,
    });
  } else {
    ids.set(item.id, idx);
  }

  // Check duplicate titles
  if (titles.has(item.title)) {
    duplicates.push({
      type: 'Title',
      value: item.title,
      first: titles.get(item.title),
      second: idx,
    });
  } else {
    titles.set(item.title, idx);
  }
});

if (duplicates.length > 0) {
  console.log(`\n⚠️  Found ${duplicates.length} duplicates:`);
  duplicates.forEach(dup => {
    console.log(`\n${dup.type} duplicate: "${dup.value}"`);
    console.log(`  First occurrence: index ${dup.first}`);
    console.log(`  Second occurrence: index ${dup.second}`);
  });
} else {
  console.log('✓ No duplicates found');
}

// 2. Check for missing required fields
console.log('\n\n2. CHECKING REQUIRED FIELDS');
console.log('='.repeat(70));

const requiredFields = ['id', 'title', 'description', 'category', 'subcategory', 'status', 'level', 'role', 'hidden', 'tags'];
const missingFields = [];

cooItems.forEach((item, idx) => {
  requiredFields.forEach(field => {
    if (!item[field]) {
      missingFields.push({
        index: idx,
        id: item.id,
        title: item.title,
        field,
      });
    }
  });

  // Check if tags is array and not empty
  if (!Array.isArray(item.tags) || item.tags.length === 0) {
    missingFields.push({
      index: idx,
      id: item.id,
      title: item.title,
      field: 'tags (empty or not array)',
    });
  }
});

if (missingFields.length > 0) {
  console.log(`\n⚠️  Found ${missingFields.length} missing fields:`);
  missingFields.forEach(mf => {
    console.log(`\n"${mf.title}" (index ${mf.index})`);
    console.log(`  Missing: ${mf.field}`);
  });
} else {
  console.log('✓ All required fields present');
}

// 3. Check category/subcategory consistency
console.log('\n\n3. CHECKING CATEGORY/SUBCATEGORY CONSISTENCY');
console.log('='.repeat(70));

const categoryMap = new Map();
cooItems.forEach(item => {
  if (!categoryMap.has(item.category)) {
    categoryMap.set(item.category, new Set());
  }
  categoryMap.get(item.category).add(item.subcategory);
});

console.log('\nCategory structure:');
Array.from(categoryMap.entries()).sort().forEach(([cat, subs]) => {
  console.log(`\n${cat}:`);
  Array.from(subs).sort().forEach(sub => {
    const count = cooItems.filter(i => i.category === cat && i.subcategory === sub).length;
    console.log(`  - ${sub} (${count} items)`);
  });
});

// 4. Check level distribution
console.log('\n\n4. LEVEL DISTRIBUTION');
console.log('='.repeat(70));

const levelDist = {
  beginner: cooItems.filter(i => i.level === 'beginner'),
  intermediate: cooItems.filter(i => i.level === 'intermediate'),
  advanced: cooItems.filter(i => i.level === 'advanced'),
  expert: cooItems.filter(i => i.level === 'expert'),
};

Object.entries(levelDist).forEach(([level, items]) => {
  const pct = ((items.length / cooItems.length) * 100).toFixed(1);
  console.log(`${level.padEnd(14)}: ${items.length.toString().padStart(2)} items (${pct.padStart(5)}%)`);
});

// 5. Check for weird characters or formatting
console.log('\n\n5. CHECKING FOR FORMATTING ISSUES');
console.log('='.repeat(70));

const issues = [];

cooItems.forEach((item, idx) => {
  // Check for extra spaces
  if (item.title.includes('  ')) {
    issues.push({ index: idx, title: item.title, issue: 'Double spaces in title' });
  }
  if (item.description.includes('  ')) {
    issues.push({ index: idx, title: item.title, issue: 'Double spaces in description' });
  }

  // Check for leading/trailing spaces
  if (item.title !== item.title.trim()) {
    issues.push({ index: idx, title: item.title, issue: 'Leading/trailing spaces in title' });
  }

  // Check for invalid characters
  if (item.id.includes(' ')) {
    issues.push({ index: idx, title: item.title, issue: 'Space in ID' });
  }

  // Check description length
  if (item.description.length < 20) {
    issues.push({ index: idx, title: item.title, issue: 'Description too short (<20 chars)' });
  }
  if (item.description.length > 500) {
    issues.push({ index: idx, title: item.title, issue: `Description too long (${item.description.length} chars)` });
  }
});

if (issues.length > 0) {
  console.log(`\n⚠️  Found ${issues.length} formatting issues:`);
  issues.forEach(issue => {
    console.log(`\n"${issue.title}"`);
    console.log(`  Issue: ${issue.issue}`);
  });
} else {
  console.log('✓ No formatting issues found');
}

// 6. Check status values
console.log('\n\n6. CHECKING STATUS VALUES');
console.log('='.repeat(70));

const validStatuses = ['planned', 'in-progress', 'completed'];
const invalidStatuses = [];

cooItems.forEach((item, idx) => {
  if (!validStatuses.includes(item.status)) {
    invalidStatuses.push({
      index: idx,
      title: item.title,
      status: item.status,
    });
  }
});

if (invalidStatuses.length > 0) {
  console.log(`\n⚠️  Found ${invalidStatuses.length} invalid statuses:`);
  invalidStatuses.forEach(item => {
    console.log(`\n"${item.title}"`);
    console.log(`  Status: "${item.status}"`);
  });
} else {
  console.log('✓ All statuses valid');
}

const statusDist = {};
validStatuses.forEach(status => {
  statusDist[status] = cooItems.filter(i => i.status === status).length;
});
console.log('\nStatus distribution:');
Object.entries(statusDist).forEach(([status, count]) => {
  console.log(`  ${status}: ${count} items`);
});

// 7. Check for orphaned subcategories (subcategory used only once)
console.log('\n\n7. CHECKING FOR ORPHANED SUBCATEGORIES');
console.log('='.repeat(70));

const subcategoryCounts = new Map();
cooItems.forEach(item => {
  const key = `${item.category} / ${item.subcategory}`;
  subcategoryCounts.set(key, (subcategoryCounts.get(key) || 0) + 1);
});

const orphaned = Array.from(subcategoryCounts.entries())
  .filter(([key, count]) => count === 1)
  .map(([key, count]) => key);

if (orphaned.length > 0) {
  console.log(`\nFound ${orphaned.length} subcategories with only 1 item:`);
  orphaned.forEach(key => {
    console.log(`  - ${key}`);
  });
  console.log('\n⚠️  Consider grouping these or adding more items');
} else {
  console.log('✓ No orphaned subcategories');
}

// 8. Summary
console.log('\n\n' + '='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70));
console.log(`Total COO items: ${cooItems.length}`);
console.log(`Categories: ${categoryMap.size}`);
console.log(`Subcategories: ${subcategoryCounts.size}`);
console.log(`Duplicates: ${duplicates.length}`);
console.log(`Missing fields: ${missingFields.length}`);
console.log(`Formatting issues: ${issues.length}`);
console.log(`Invalid statuses: ${invalidStatuses.length}`);
console.log(`Orphaned subcategories: ${orphaned.length}`);

const totalIssues = duplicates.length + missingFields.length + issues.length + invalidStatuses.length;
if (totalIssues === 0) {
  console.log('\n✅ COO DATA IS CLEAN!');
} else {
  console.log(`\n⚠️  Total issues found: ${totalIssues}`);
}

console.log('');
