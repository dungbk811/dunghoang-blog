const { cooRoadmap } = require('./lib/roadmap.ts');

console.log('=== PHAN TICH TOAN BO ROLE THEO CATEGORY ===\n');

// Group by category
const byCategory = {};
cooRoadmap.forEach(item => {
  if (!byCategory[item.category]) {
    byCategory[item.category] = [];
  }
  byCategory[item.category].push(item);
});

// Expected role mappings based on category content
const categoryRoleGuidelines = {
  'Chiến Lược & Thực Thi': 'COO',
  'Vận Hành & Chất Lượng': 'COO',
  'Công Nghệ & Hệ Thống': 'COO',
  'Phát Triển Kinh Doanh': 'COO',
  'Con Người & Văn Hóa': 'CPO',
  'Đào Tạo & Phát Triển': 'CPO',
  'Tài Chính & P&L': 'CFO',
  'Ngân Sách & Dự Báo': 'CFO',
  'Pháp Lý & Tuân Thủ': 'CLO',
  'Văn Hóa & Giao Tiếp Nội Bộ': 'CPO or COO', // Mixed - depends on item
};

const issues = [];

Object.keys(byCategory).sort().forEach(category => {
  const items = byCategory[category];
  const roleCount = {};

  items.forEach(item => {
    roleCount[item.role] = (roleCount[item.role] || 0) + 1;
  });

  console.log(`\n${'='.repeat(70)}`);
  console.log(`CATEGORY: ${category}`);
  console.log(`Total items: ${items.length}`);
  console.log(`Role distribution:`, roleCount);

  const expected = categoryRoleGuidelines[category];
  if (expected && !expected.includes('or')) {
    const wrongRole = items.filter(item => item.role !== expected);
    if (wrongRole.length > 0) {
      console.log(`\n⚠️  CANH BAO: ${wrongRole.length} items khong phai ${expected}:`);
      wrongRole.forEach(item => {
        console.log(`   - "${item.title}" (${item.role}) - ${item.subcategory}`);
        issues.push({
          category,
          item: item.title,
          currentRole: item.role,
          expectedRole: expected,
          subcategory: item.subcategory
        });
      });
    }
  }

  // List all items
  console.log(`\nAll items:`);
  items.forEach(item => {
    console.log(`   [${item.role}] ${item.title} - ${item.subcategory}`);
  });
});

console.log(`\n\n${'='.repeat(70)}`);
console.log('TONG HOP VAN DE');
console.log('='.repeat(70));

if (issues.length > 0) {
  console.log(`\nTim thay ${issues.length} van de can xem xet:\n`);
  issues.forEach((issue, idx) => {
    console.log(`${idx + 1}. "${issue.item}"`);
    console.log(`   Category: ${issue.category} / ${issue.subcategory}`);
    console.log(`   Hien tai: ${issue.currentRole}`);
    console.log(`   De xuat: ${issue.expectedRole}`);
    console.log('');
  });
} else {
  console.log('\n✓ Khong phat hien van de');
}

// Special checks for specific keywords
console.log(`\n${'='.repeat(70)}`);
console.log('KIEM TRA THEO TU KHOA DAC BIET');
console.log('='.repeat(70));

const keywordChecks = [
  {
    keywords: ['partnership', 'đối tác', 'partner'],
    expectedRole: 'COO',
    reason: 'Strategic partnerships = Business Development = COO'
  },
  {
    keywords: ['culture', 'văn hóa', 'van hoa'],
    expectedRole: 'CPO',
    reason: 'Company culture = CPO',
    exceptions: ['All-hands', 'Họp toàn công ty'] // COO can handle all-hands
  },
  {
    keywords: ['team building', 'xây dựng đội nhóm'],
    expectedRole: 'CPO',
    reason: 'Team building = CPO'
  },
  {
    keywords: ['performance', 'đánh giá hiệu suất', 'danh gia'],
    expectedRole: 'CPO',
    reason: 'Performance evaluation = HR = CPO'
  },
  {
    keywords: ['training', 'đào tạo', 'dao tao'],
    expectedRole: 'CPO',
    reason: 'Training & development = CPO'
  },
  {
    keywords: ['recruitment', 'tuyển dụng', 'tuyen dung', 'hiring'],
    expectedRole: 'CPO',
    reason: 'Recruitment = HR = CPO'
  },
  {
    keywords: ['budget', 'ngân sách', 'ngan sach', 'pricing', 'định giá'],
    expectedRole: 'CFO',
    reason: 'Financial matters = CFO'
  },
  {
    keywords: ['contract', 'hợp đồng', 'hop dong', 'legal', 'pháp lý'],
    expectedRole: 'CLO',
    reason: 'Legal matters = CLO'
  }
];

keywordChecks.forEach(check => {
  console.log(`\nKiem tra: ${check.keywords.join(', ')}`);
  console.log(`Expected role: ${check.expectedRole} (${check.reason})`);

  const matches = cooRoadmap.filter(item => {
    const searchText = `${item.title} ${item.description}`.toLowerCase();
    return check.keywords.some(kw => searchText.includes(kw.toLowerCase()));
  });

  if (matches.length > 0) {
    const wrongRole = matches.filter(item => {
      if (item.role === check.expectedRole) return false;

      // Check exceptions
      if (check.exceptions) {
        const hasException = check.exceptions.some(exc =>
          item.title.includes(exc)
        );
        if (hasException) return false;
      }

      return true;
    });

    if (wrongRole.length > 0) {
      console.log(`⚠️  Tim thay ${wrongRole.length} items sai role:`);
      wrongRole.forEach(item => {
        console.log(`   - [${item.role}] "${item.title}"`);
      });
    } else {
      console.log(`✓ Tat ca ${matches.length} items deu dung role`);
    }
  } else {
    console.log('(Khong tim thay items nao)');
  }
});

console.log(`\n${'='.repeat(70)}\n`);
