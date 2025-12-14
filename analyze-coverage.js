const { cooRoadmap } = require('./lib/roadmap.ts');

console.log('=== PHAN TICH DO PHU COVERAGE ===\n');

// 1. Distribution by Role + Level
console.log('1. PHAN BO THEO ROLE VA LEVEL');
console.log('='.repeat(70));

const roleLevel = {};
const roles = ['COO', 'CPO', 'CFO', 'CLO'];
const levels = ['beginner', 'intermediate', 'advanced', 'expert'];

roles.forEach(role => {
  roleLevel[role] = {};
  levels.forEach(level => {
    roleLevel[role][level] = cooRoadmap.filter(
      item => item.role === role && item.level === level
    );
  });
});

roles.forEach(role => {
  const total = cooRoadmap.filter(item => item.role === role).length;
  console.log(`\n${role} (${total} items):`);
  levels.forEach(level => {
    const items = roleLevel[role][level];
    const pct = total > 0 ? ((items.length / total) * 100).toFixed(1) : '0.0';
    console.log(`  ${level.padEnd(14)}: ${items.length.toString().padStart(2)} items (${pct.padStart(5)}%)`);

    if (items.length === 0) {
      console.log(`    ⚠️  THIEU ${level.toUpperCase()}`);
    }
  });
});

// 2. Category coverage by role
console.log('\n\n2. CATEGORY COVERAGE THEO ROLE');
console.log('='.repeat(70));

const categoryByRole = {};
cooRoadmap.forEach(item => {
  if (!categoryByRole[item.category]) {
    categoryByRole[item.category] = { COO: 0, CPO: 0, CFO: 0, CLO: 0 };
  }
  categoryByRole[item.category][item.role]++;
});

Object.keys(categoryByRole).sort().forEach(category => {
  console.log(`\n${category}:`);
  const counts = categoryByRole[category];
  Object.entries(counts).forEach(([role, count]) => {
    if (count > 0) {
      console.log(`  ${role}: ${count} items`);
    }
  });
});

// 3. Subcategory analysis
console.log('\n\n3. SUBCATEGORY - TIM ITEMS IT');
console.log('='.repeat(70));

const subcategoryCount = {};
cooRoadmap.forEach(item => {
  const key = `${item.category} / ${item.subcategory}`;
  if (!subcategoryCount[key]) {
    subcategoryCount[key] = [];
  }
  subcategoryCount[key].push(item);
});

const thinSubcategories = Object.entries(subcategoryCount)
  .filter(([key, items]) => items.length <= 2)
  .sort((a, b) => a[1].length - b[1].length);

if (thinSubcategories.length > 0) {
  console.log('\nSubcategories co IT items (<=2):');
  thinSubcategories.forEach(([key, items]) => {
    console.log(`\n${key} (${items.length} item${items.length > 1 ? 's' : ''}):`);
    items.forEach(item => {
      console.log(`  - [${item.role}] ${item.title} (${item.level})`);
    });
  });
}

// 4. Level distribution analysis
console.log('\n\n4. PHAN BO LEVEL TONG QUAN');
console.log('='.repeat(70));

const levelDist = {};
levels.forEach(level => {
  levelDist[level] = cooRoadmap.filter(item => item.level === level);
});

console.log('\nTong quan:');
levels.forEach(level => {
  const count = levelDist[level].length;
  const pct = ((count / cooRoadmap.length) * 100).toFixed(1);
  console.log(`  ${level.padEnd(14)}: ${count.toString().padStart(2)} items (${pct.padStart(5)}%)`);
});

// Expected distribution (rough guide)
console.log('\nDe xuat ly tuong:');
console.log('  Beginner      : 15-20% (cac concept co ban, quy trinh don gian)');
console.log('  Intermediate  : 30-35% (thuc thi & trien khai)');
console.log('  Advanced      : 35-40% (toi uu hoa & scale)');
console.log('  Expert        : 15-20% (chien luoc & leadership)');

// 5. Hidden vs visible
console.log('\n\n5. HIDDEN VS VISIBLE');
console.log('='.repeat(70));

const hidden = cooRoadmap.filter(item => item.hidden).length;
const visible = cooRoadmap.filter(item => !item.hidden).length;

console.log(`Visible: ${visible} items (${((visible/cooRoadmap.length)*100).toFixed(1)}%)`);
console.log(`Hidden:  ${hidden} items (${((hidden/cooRoadmap.length)*100).toFixed(1)}%)`);

// 6. Recommended additions
console.log('\n\n6. DE XUAT BO SUNG');
console.log('='.repeat(70));

const recommendations = [];

// Check COO beginner items
if (roleLevel['COO']['beginner'].length < 5) {
  recommendations.push({
    role: 'COO',
    level: 'beginner',
    reason: `Chi co ${roleLevel['COO']['beginner'].length} beginner items`,
    suggestions: [
      'Hieu ve SLA va commitments',
      'Co ban ve project management',
      'Gioi thieu quy trinh quality assurance',
      'Quy trinh bao cao hang tuan',
      'Co ban ve capacity planning'
    ]
  });
}

// Check COO intermediate
if (roleLevel['COO']['intermediate'].length < 10) {
  recommendations.push({
    role: 'COO',
    level: 'intermediate',
    reason: `Chi co ${roleLevel['COO']['intermediate'].length} intermediate items`,
    suggestions: [
      'Trien khai process improvement',
      'Thiet lap he thong metrics',
      'Quan ly multi-team coordination',
      'Xu ly customer escalations',
      'Toi uu resource allocation'
    ]
  });
}

// Check CPO coverage
if (roleLevel['CPO']['beginner'].length < 3) {
  recommendations.push({
    role: 'CPO',
    level: 'beginner',
    reason: `Chi co ${roleLevel['CPO']['beginner'].length} beginner items`,
    suggestions: [
      'Co ban ve recruitment process',
      'Onboarding quy trinh',
      'Gioi thieu ve company culture',
      'Performance review co ban'
    ]
  });
}

if (roleLevel['CPO']['intermediate'].length < 5) {
  recommendations.push({
    role: 'CPO',
    level: 'intermediate',
    reason: `Chi co ${roleLevel['CPO']['intermediate'].length} intermediate items`,
    suggestions: [
      'Xay dung employer branding',
      'Thiet ke chuong trinh training',
      'Career path development',
      'Employee retention strategies',
      'Compensation & benefits planning'
    ]
  });
}

// Check CFO beginner/intermediate
if (roleLevel['CFO']['beginner'].length < 2) {
  recommendations.push({
    role: 'CFO',
    level: 'beginner',
    reason: `Chi co ${roleLevel['CFO']['beginner'].length} beginner items`,
    suggestions: [
      'Co ban ve P&L statement',
      'Hieu ve budget vs actual',
      'Gioi thieu pricing models',
      'Cash flow basics'
    ]
  });
}

if (roleLevel['CFO']['intermediate'].length < 5) {
  recommendations.push({
    role: 'CFO',
    level: 'intermediate',
    reason: `Chi co ${roleLevel['CFO']['intermediate'].length} intermediate items`,
    suggestions: [
      'Financial forecasting',
      'Cost optimization initiatives',
      'Revenue analysis & planning',
      'Investment decisions'
    ]
  });
}

// Check CLO
if (roleLevel['CLO']['beginner'].length < 2) {
  recommendations.push({
    role: 'CLO',
    level: 'beginner',
    reason: `Chi co ${roleLevel['CLO']['beginner'].length} beginner items`,
    suggestions: [
      'Co ban ve hop dong',
      'Gioi thieu ve IP',
      'Labor law basics',
      'Contract review process'
    ]
  });
}

if (roleLevel['CLO']['intermediate'].length < 4) {
  recommendations.push({
    role: 'CLO',
    level: 'intermediate',
    reason: `Chi co ${roleLevel['CLO']['intermediate'].length} intermediate items`,
    suggestions: [
      'Negotiation strategies',
      'Compliance program setup',
      'Risk assessment legal',
      'Data privacy implementation'
    ]
  });
}

if (recommendations.length > 0) {
  recommendations.forEach((rec, idx) => {
    console.log(`\n${idx + 1}. ${rec.role} - ${rec.level.toUpperCase()}`);
    console.log(`   Ly do: ${rec.reason}`);
    console.log(`   De xuat:`);
    rec.suggestions.forEach(s => {
      console.log(`     - ${s}`);
    });
  });
} else {
  console.log('\n✓ Coverage hien tai la hop ly');
}

console.log('\n' + '='.repeat(70));
console.log('\nTONG KET:');
console.log(`- Tong: ${cooRoadmap.length} items`);
console.log(`- Roles: ${roles.length} roles`);
console.log(`- Categories: ${Object.keys(categoryByRole).length} categories`);
console.log(`- Subcategories: ${Object.keys(subcategoryCount).length} subcategories`);
console.log(`- Recommendations: ${recommendations.length} areas can bo sung`);
console.log('');
