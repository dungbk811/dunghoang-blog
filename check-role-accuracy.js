const { cooRoadmap } = require('./lib/roadmap.ts');

console.log('=== KIEM TRA DO CHINH XAC ROLE ===\n');

// Define role responsibilities
const roleResponsibilities = {
  'COO': [
    'Chien luoc va thuc thi (strategy & execution)',
    'Van hanh va chat luong (operations & quality)',
    'Lanh dao cong nghe (technology leadership)',
    'Phat trien kinh doanh (business development)',
    'Doi tac chien luoc (strategic partnerships)',
    'Quan ly rui ro & khung hoang (risk & crisis management)',
    'Quan ly nang luc (capacity management)',
    'Van hanh dich vu (service delivery)'
  ],
  'CPO': [
    'Tuyen dung & nhan su (recruitment & HR)',
    'Van hoa doanh nghiep (company culture)',
    'Dao tao & phat trien (training & development)',
    'Danh gia hieu suat (performance evaluation)',
    'Employee engagement',
    'Retention strategies'
  ],
  'CFO': [
    'Tai chinh & P&L (finance & P&L)',
    'Ngan sach (budgeting)',
    'Du bao tai chinh (financial forecasting)',
    'Dinh gia (pricing)',
    'Chi phi (cost management)'
  ],
  'CLO': [
    'Hop dong (contracts)',
    'Phap ly (legal)',
    'Tuan thu (compliance)',
    'So huu tri tue (IP)',
    'Tranh chap (disputes)'
  ]
};

console.log('TRACH NHIEM CUA TUNG ROLE:');
console.log('='.repeat(70));
Object.entries(roleResponsibilities).forEach(([role, responsibilities]) => {
  console.log(`\n${role}:`);
  responsibilities.forEach(r => console.log(`  - ${r}`));
});

// Check potentially misplaced items
console.log('\n\n' + '='.repeat(70));
console.log('CAC ITEMS CO THE BI NHAM ROLE');
console.log('='.repeat(70));

const potentialIssues = [];

cooRoadmap.forEach(item => {
  // Partnership - should be COO not CPO
  if (item.title.includes('Partnership') || item.title.includes('partnership')) {
    if (item.role !== 'COO') {
      potentialIssues.push({
        item: item.title,
        currentRole: item.role,
        suggestedRole: 'COO',
        reason: 'Partnership strategy thuong la trach nhiem cua COO (Business Development)',
        category: item.category
      });
    }
  }

  // Scaling strategy - could be COO
  if (item.title.includes('scale') || item.title.includes('Scale')) {
    if (item.role === 'CPO') {
      potentialIssues.push({
        item: item.title,
        currentRole: item.role,
        suggestedRole: 'COO hoac CPO',
        reason: 'Scaling strategy co the la COO (neu focus strategy) hoac CPO (neu focus hiring)',
        category: item.category
      });
    }
  }

  // Culture items - check if should be CPO
  if (item.category === 'Văn Hóa & Giao Tiếp Nội Bộ') {
    if (item.role === 'COO' && !item.title.includes('All-hands') && !item.title.includes('Họp')) {
      potentialIssues.push({
        item: item.title,
        currentRole: item.role,
        suggestedRole: 'CPO',
        reason: 'Van hoa noi bo thuong la trach nhiem cua CPO',
        category: item.category
      });
    }
  }

  // Team building should be CPO
  if (item.title.includes('team building') || item.title.includes('Team building')) {
    if (item.role !== 'CPO') {
      potentialIssues.push({
        item: item.title,
        currentRole: item.role,
        suggestedRole: 'CPO',
        reason: 'Team building la trach nhiem cua CPO',
        category: item.category
      });
    }
  }

  // Performance review should be CPO
  if (item.title.includes('đánh giá hiệu suất') || item.title.includes('Performance')) {
    if (item.role !== 'CPO') {
      potentialIssues.push({
        item: item.title,
        currentRole: item.role,
        suggestedRole: 'CPO',
        reason: 'Performance evaluation la trach nhiem cua CPO/HR',
        category: item.category
      });
    }
  }

  // Check if business development items are in COO
  if (item.category === 'Phát Triển Kinh Doanh' && item.subcategory === 'Đối Tác Chiến Lược') {
    if (item.role !== 'COO') {
      potentialIssues.push({
        item: item.title,
        currentRole: item.role,
        suggestedRole: 'COO',
        reason: 'Strategic partnerships thuoc Business Development - trach nhiem cua COO',
        category: item.category
      });
    }
  }
});

if (potentialIssues.length > 0) {
  console.log(`\nTim thay ${potentialIssues.length} items can xem xet:\n`);

  potentialIssues.forEach((issue, index) => {
    console.log(`${index + 1}. "${issue.item}"`);
    console.log(`   Hien tai: ${issue.currentRole}`);
    console.log(`   De xuat: ${issue.suggestedRole}`);
    console.log(`   Ly do: ${issue.reason}`);
    console.log(`   Category: ${issue.category}`);
    console.log('');
  });
} else {
  console.log('\n✓ Khong phat hien van de');
}

console.log('='.repeat(70));
