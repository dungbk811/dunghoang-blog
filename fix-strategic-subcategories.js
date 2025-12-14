const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, 'lib/roadmap.ts');

console.log('Fixing strategic item subcategories...\n');

const fixes = [
  {
    id: 'strategic-workforce-planning-work',
    oldSubcategory: 'Kế Hoạch Hàng Năm & Quý',
    newSubcategory: 'Chiến Lược Nhân Sự',
  },
  {
    id: 'organizational-design-transformation-work',
    oldSubcategory: 'Chuyển Đổi Kinh Doanh',
    newSubcategory: 'Chiến Lược Nhân Sự',
  },
  {
    id: 'talent-strategy-alignment-work',
    oldSubcategory: 'Kế Hoạch Hàng Năm & Quý',
    newSubcategory: 'Chiến Lược Nhân Sự',
  },
  {
    id: 'strategic-financial-leadership-work',
    oldSubcategory: 'Kế Hoạch Hàng Năm & Quý',
    newSubcategory: 'Chiến Lược Tài Chính',
  },
  {
    id: 'ma-strategy-execution-work',
    oldSubcategory: 'Chuyển Đổi Kinh Doanh',
    newSubcategory: 'Chiến Lược Tài Chính',
  },
  {
    id: 'strategic-legal-counsel-work',
    oldSubcategory: 'Kế Hoạch Hàng Năm & Quý',
    newSubcategory: 'Chiến Lược Pháp Lý',
  },
  {
    id: 'four-faces-mastery-work',
    oldSubcategory: 'Kế Hoạch Hàng Năm & Quý',
    newSubcategory: 'Chiến Lược Pháp Lý',
  },
];

let content = fs.readFileSync(roadmapPath, 'utf-8');
let changeCount = 0;

fixes.forEach(fix => {
  // Find the item by ID and replace subcategory
  const idPattern = new RegExp(`id: '${fix.id}',([\\s\\S]*?)subcategory: '${fix.oldSubcategory}',`, 'g');

  if (content.match(idPattern)) {
    content = content.replace(idPattern, `id: '${fix.id}',$1subcategory: '${fix.newSubcategory}',`);
    console.log(`✓ Fixed: ${fix.id}`);
    console.log(`  ${fix.oldSubcategory} → ${fix.newSubcategory}`);
    changeCount++;
  } else {
    console.log(`⚠️  Not found: ${fix.id}`);
  }
});

fs.writeFileSync(roadmapPath, content, 'utf-8');

console.log(`\n✓ Done! Fixed ${changeCount}/${fixes.length} items`);
