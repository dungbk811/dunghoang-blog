const { cooRoadmap } = require('./lib/roadmap.ts');

console.log('=== KIEM TRA TIENG VIET ===\n');

const englishPattern = /[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/; // Detect English phrases like "Strategic Planning"
const shortDescPattern = /.{1,50}/; // Very short descriptions

const issues = {
  hasEnglish: [],
  shortDesc: [],
  mixedLanguage: [],
};

cooRoadmap.forEach(item => {
  const combined = `${item.title} ${item.description}`;

  // Check for English in title
  if (/^[A-Za-z]/.test(item.title) && item.title.includes(' ')) {
    const words = item.title.split(' ');
    const englishWords = words.filter(w => /^[A-Za-z]+$/.test(w));
    if (englishWords.length > 1) {
      issues.hasEnglish.push({
        id: item.id,
        title: item.title,
        role: item.role,
        type: 'title',
      });
    }
  }

  // Check for significant English in description
  const englishMatches = item.description.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g);
  if (englishMatches && englishMatches.length > 0) {
    // Filter out acceptable acronyms and terms
    const acceptable = ['AI/ML', 'Cloud', 'CRUD', 'PWA', 'DevOps', 'P&L', 'EBITDA', 'ROI', 'GDPR', 'ISO', 'SLA', 'BCP', 'DR', 'OKR', 'KPI', 'M&A', 'IP', 'CLM', 'FP&A', 'ROIC', 'CPA', 'CFA', 'MBA', 'DEI', 'ESG', 'BATNA'];
    const problematic = englishMatches.filter(match =>
      !acceptable.some(term => match.includes(term))
    );

    if (problematic.length > 0) {
      issues.mixedLanguage.push({
        id: item.id,
        title: item.title,
        role: item.role,
        matches: problematic,
      });
    }
  }

  // Check short descriptions
  const wordCount = item.description.split(/\s+/).length;
  if (wordCount < 10) {
    issues.shortDesc.push({
      id: item.id,
      title: item.title,
      description: item.description,
      wordCount,
      role: item.role,
      level: item.level,
    });
  }
});

// Report English titles/descriptions
if (issues.hasEnglish.length > 0) {
  console.log('⚠️  ENGLISH TITLES FOUND:', issues.hasEnglish.length);
  console.log('='.repeat(70));
  issues.hasEnglish.forEach(item => {
    console.log(`[${item.role}] "${item.title}"`);
    console.log(`  ID: ${item.id}`);
  });
} else {
  console.log('✓ All titles in Vietnamese');
}

// Report mixed language
if (issues.mixedLanguage.length > 0) {
  console.log('\n\n⚠️  MIXED LANGUAGE IN DESCRIPTIONS:', issues.mixedLanguage.length);
  console.log('='.repeat(70));
  issues.mixedLanguage.slice(0, 10).forEach(item => {
    console.log(`[${item.role}] "${item.title}"`);
    console.log(`  English phrases: ${item.matches.join(', ')}`);
  });
  if (issues.mixedLanguage.length > 10) {
    console.log(`  ... and ${issues.mixedLanguage.length - 10} more`);
  }
} else {
  console.log('\n✓ All descriptions primarily in Vietnamese');
}

// Report short descriptions
console.log('\n\n⚠️  SHORT DESCRIPTIONS (<10 words):', issues.shortDesc.length);
console.log('='.repeat(70));

const byRole = {};
issues.shortDesc.forEach(item => {
  if (!byRole[item.role]) byRole[item.role] = [];
  byRole[item.role].push(item);
});

Object.entries(byRole).forEach(([role, items]) => {
  console.log(`\n${role}: ${items.length} items`);
  items.slice(0, 5).forEach(item => {
    console.log(`  [${item.level}] "${item.title}"`);
    console.log(`    ${item.wordCount} words: "${item.description}"`);
  });
  if (items.length > 5) {
    console.log(`  ... and ${items.length - 5} more`);
  }
});

// Summary
console.log('\n\n' + '='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70));
console.log(`Total items: ${cooRoadmap.length}`);
console.log(`English titles: ${issues.hasEnglish.length}`);
console.log(`Mixed language descriptions: ${issues.mixedLanguage.length}`);
console.log(`Short descriptions: ${issues.shortDesc.length}`);

if (issues.hasEnglish.length === 0 && issues.mixedLanguage.length === 0) {
  console.log('\n✅ TIENG VIET DAY DU!');
} else {
  console.log(`\n⚠️  Can sua: ${issues.hasEnglish.length + issues.mixedLanguage.length} items`);
}

// Export for fixing
module.exports = { issues };
