const { cooRoadmap } = require('./lib/roadmap.ts');

console.log('=== CONTENT QUALITY CHECK - ALL ROLES ===\n');

const allRoles = ['COO', 'CPO', 'CFO', 'CLO'];

allRoles.forEach(targetRole => {
  const items = cooRoadmap.filter(item => item.role === targetRole);

  console.log(`\n${'='.repeat(70)}`);
  console.log(`${targetRole} (${items.length} items)`);
  console.log('='.repeat(70));

  // Check descriptions for common issues
  const issues = [];

  items.forEach((item, idx) => {
    // 1. Check if description is too generic
    const genericPhrases = [
      'Quản lý',
      'Thực hiện',
      'Triển khai',
    ];

    const descWords = item.description.split(' ');
    if (descWords.length < 10) {
      issues.push({
        title: item.title,
        level: item.level,
        issue: `Description quá ngắn (${descWords.length} từ)`,
        severity: 'medium',
      });
    }

    // 2. Check if title and description are too similar
    const titleWords = new Set(item.title.toLowerCase().split(' '));
    const descriptionWords = new Set(item.description.toLowerCase().split(' '));
    const overlap = [...titleWords].filter(w => descriptionWords.has(w)).length;

    if (overlap / titleWords.size > 0.8 && titleWords.size > 3) {
      issues.push({
        title: item.title,
        level: item.level,
        issue: 'Description trùng lặp với title',
        severity: 'low',
      });
    }

    // 3. Check if tags are relevant
    if (item.tags.length < 2) {
      issues.push({
        title: item.title,
        level: item.level,
        issue: `Thiếu tags (chỉ có ${item.tags.length})`,
        severity: 'low',
      });
    }

    // 4. Check level appropriateness
    const advancedKeywords = ['strategy', 'strategic', 'chiến lược', 'optimization', 'tối ưu', 'scale', 'transformation', 'chuyển đổi'];
    const expertKeywords = ['leadership', 'lãnh đạo', 'executive', 'board', 'M&A', 'governance'];
    const beginnerKeywords = ['basic', 'cơ bản', 'fundamentals', 'introduction', 'giới thiệu'];

    const lowerDesc = item.description.toLowerCase();
    const lowerTitle = item.title.toLowerCase();
    const combinedText = lowerDesc + ' ' + lowerTitle;

    if (item.level === 'beginner') {
      const hasAdvanced = advancedKeywords.some(kw => combinedText.includes(kw.toLowerCase()));
      if (hasAdvanced) {
        issues.push({
          title: item.title,
          level: item.level,
          issue: 'Beginner item có advanced keywords',
          severity: 'medium',
        });
      }
    }

    if (item.level === 'expert') {
      const hasBasic = beginnerKeywords.some(kw => combinedText.includes(kw.toLowerCase()));
      if (hasBasic) {
        issues.push({
          title: item.title,
          level: item.level,
          issue: 'Expert item có beginner keywords',
          severity: 'medium',
        });
      }
    }
  });

  // Group by severity
  const high = issues.filter(i => i.severity === 'high');
  const medium = issues.filter(i => i.severity === 'medium');
  const low = issues.filter(i => i.severity === 'low');

  if (issues.length === 0) {
    console.log('\n✓ No content issues found');
  } else {
    console.log(`\nFound ${issues.length} potential content issues:`);

    if (high.length > 0) {
      console.log(`\n⚠️  HIGH (${high.length}):`);
      high.forEach(i => {
        console.log(`  - [${i.level}] "${i.title}"`);
        console.log(`    ${i.issue}`);
      });
    }

    if (medium.length > 0) {
      console.log(`\n⚠️  MEDIUM (${medium.length}):`);
      medium.forEach(i => {
        console.log(`  - [${i.level}] "${i.title}"`);
        console.log(`    ${i.issue}`);
      });
    }

    if (low.length > 0) {
      console.log(`\n  ℹ️  LOW (${low.length}):`);
      low.slice(0, 5).forEach(i => {
        console.log(`  - [${i.level}] "${i.title}"`);
        console.log(`    ${i.issue}`);
      });
      if (low.length > 5) {
        console.log(`  ... and ${low.length - 5} more`);
      }
    }
  }

  // Show level progression example
  console.log('\n\nSample progression by level:');
  ['beginner', 'intermediate', 'advanced', 'expert'].forEach(level => {
    const sample = items.find(i => i.level === level);
    if (sample) {
      console.log(`\n${level.toUpperCase()}:`);
      console.log(`  "${sample.title}"`);
      console.log(`  → ${sample.description.substring(0, 100)}...`);
    }
  });
});

console.log('\n\n' + '='.repeat(70));
console.log('OVERALL SUMMARY');
console.log('='.repeat(70));

const totalItems = cooRoadmap.length;
console.log(`Total items across all roles: ${totalItems}`);

allRoles.forEach(role => {
  const count = cooRoadmap.filter(i => i.role === role).length;
  const pct = ((count / totalItems) * 100).toFixed(1);
  console.log(`  ${role}: ${count} items (${pct}%)`);
});

console.log('\n✅ Content quality check complete\n');
