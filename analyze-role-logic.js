const { cooRoadmap } = require('./lib/roadmap.ts');

console.log('=== PHAN TICH LOGIC ROLE CHI TIET ===\n');

// Define strict rules based on subcategory
const subcategoryRoleMapping = {
  // COO - Strategy & Execution
  'Chuyển Đổi Kinh Doanh': 'COO',
  'Kế Hoạch Hàng Năm & Quý': 'COO',
  'Phân Tích Thị Trường': 'COO',

  // COO - Operations & Quality
  'Vận Hành Dự Án': 'COO',
  'Cải Tiến Quy Trình': 'COO',

  // COO - Technology Leadership
  'Chuyển Đổi Số': 'COO',
  'Đổi Mới & R&D': 'COO',

  // COO - Business Development
  'Chăm Sóc Khách Hàng': 'COO',
  'Đối Tác Chiến Lược': 'COO',
  'Hỗ Trợ Kinh Doanh': 'COO',

  // COO - Capacity & Service Delivery
  'Dự Báo Nhu Cầu': 'COO',
  'Quản Lý Năng Lực': 'COO',
  'Quản Lý SLA': 'COO',
  'Xử Lý Vấn Đề Khẩn Cấp': 'COO',
  'Nâng Cao Chất Lượng Dịch Vụ': 'COO',

  // COO - Risk Management
  'Quản Lý Rủi Ro': 'COO or CFO or CLO', // Mixed: COO (operational), CFO (insurance), CLO (disputes)
  'Đảm Bảo Hoạt Động Liên Tục': 'COO',
  'Xử Lý Khủng Hoảng': 'COO or CLO', // Mixed: COO (operations), CLO (legal disputes)

  // CPO - People & Culture
  'Kế Hoạch Tuyển Dụng': 'CPO',
  'Quản Lý Hiệu Suất': 'CPO or COO', // Mixed: CPO (evaluation), COO (KPI systems)
  'Văn Hóa Doanh Nghiệp': 'CPO',
  'Khen Thưởng & Ghi Nhận': 'CPO',
  'Giao Tiếp Nội Bộ': 'CPO or COO', // Mixed: CPO (culture), COO (all-hands)
  'Văn Hóa Công Ty': 'CPO',

  // CFO - Finance
  'Quản Lý P&L': 'CFO',
  'Ngân Sách & Kiểm Soát Chi Phí': 'CFO',
  'Định Giá & Lợi Nhuận': 'CFO',
  'Dự Báo Tài Chính': 'CFO',

  // CLO - Legal
  'Hợp Đồng Khách Hàng': 'CLO',
  'Hợp Đồng Nhà Cung Cấp': 'CLO',
  'Tuân Thủ Pháp Lý': 'CLO',
  'Kiểm Toán & Tuân Thủ': 'CLO', // Compliance is legal

  // Team Management - mixed
  'Quản Lý Nhiều Team': 'COO',

  // Strategic subcategories by role
  'Chiến Lược Nhân Sự': 'CPO',
  'Chiến Lược Tài Chính': 'CFO',
  'Chiến Lược Pháp Lý': 'CLO',

  // New subcategory
  'Phát Triển Lãnh Đạo': 'CPO',
};

const issues = [];

cooRoadmap.forEach(item => {
  const expectedRole = subcategoryRoleMapping[item.subcategory];

  if (!expectedRole) {
    console.log(`⚠️  UNKNOWN SUBCATEGORY: "${item.subcategory}" in item "${item.title}"`);
    return;
  }

  // Skip if multiple valid roles
  if (expectedRole.includes('or')) {
    const validRoles = expectedRole.split(' or ');
    if (!validRoles.includes(item.role)) {
      issues.push({
        item: item.title,
        category: item.category,
        subcategory: item.subcategory,
        currentRole: item.role,
        expectedRole: expectedRole,
        severity: 'medium',
        reason: `Subcategory "${item.subcategory}" should be one of: ${expectedRole}`,
      });
    }
    return;
  }

  // Check if role matches expected
  if (item.role !== expectedRole) {
    issues.push({
      item: item.title,
      category: item.category,
      subcategory: item.subcategory,
      currentRole: item.role,
      expectedRole: expectedRole,
      severity: 'high',
      reason: `Subcategory "${item.subcategory}" should be ${expectedRole}`,
    });
  }
});

if (issues.length === 0) {
  console.log('✓ TAT CA ROLES DEU HOP LY!\n');
  console.log('Tong so items: ' + cooRoadmap.length);
  console.log('\nPhan bo role:');
  const roleCount = {};
  cooRoadmap.forEach(item => {
    roleCount[item.role] = (roleCount[item.role] || 0) + 1;
  });
  Object.entries(roleCount).forEach(([role, count]) => {
    console.log(`  ${role}: ${count} items (${(count/cooRoadmap.length*100).toFixed(1)}%)`);
  });
} else {
  console.log(`PHAT HIEN ${issues.length} VAN DE:\n`);
  console.log('='.repeat(70));

  // High severity first
  const highSeverity = issues.filter(i => i.severity === 'high');
  const mediumSeverity = issues.filter(i => i.severity === 'medium');

  if (highSeverity.length > 0) {
    console.log(`\nHIGH PRIORITY (${highSeverity.length} items):`);
    console.log('='.repeat(70));
    highSeverity.forEach((issue, idx) => {
      console.log(`\n${idx + 1}. "${issue.item}"`);
      console.log(`   Category: ${issue.category}`);
      console.log(`   Subcategory: ${issue.subcategory}`);
      console.log(`   Hien tai: ${issue.currentRole}`);
      console.log(`   Can sua: ${issue.expectedRole}`);
      console.log(`   Ly do: ${issue.reason}`);
    });
  }

  if (mediumSeverity.length > 0) {
    console.log(`\n\nMEDIUM PRIORITY (${mediumSeverity.length} items):`);
    console.log('='.repeat(70));
    mediumSeverity.forEach((issue, idx) => {
      console.log(`\n${idx + 1}. "${issue.item}"`);
      console.log(`   Category: ${issue.category}`);
      console.log(`   Subcategory: ${issue.subcategory}`);
      console.log(`   Hien tai: ${issue.currentRole}`);
      console.log(`   De xuat: ${issue.expectedRole}`);
      console.log(`   Ly do: ${issue.reason}`);
    });
  }
}

console.log('\n' + '='.repeat(70) + '\n');

// Export issues for fixing
if (issues.filter(i => i.severity === 'high').length > 0) {
  console.log('CAN SUA NGAY:');
  issues.filter(i => i.severity === 'high').forEach(issue => {
    console.log(`- "${issue.item}": ${issue.currentRole} -> ${issue.expectedRole}`);
  });
  console.log('');
}
