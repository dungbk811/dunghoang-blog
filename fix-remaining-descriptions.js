const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, 'lib/roadmap.ts');

console.log('Fixing remaining short descriptions...\n');

// Map by title for accuracy
const improvements = {
  'Giữ chân khách hàng': 'Chiến lược giữ chân khách hàng: satisfaction tracking, proactive support',
  'Đảm bảo chất lượng đề xuất': 'QA cho proposals: technical review, costing, compliance check',
  'Hỗ trợ kỹ thuật pre-sales': 'Hỗ trợ pre-sales: solution design, demos, POCs, Q&A',
  'Kế hoạch giảm thiểu rủi ro': 'Xây dựng risk mitigation plans, contingency strategies',
  'Rủi ro vận hành': 'Quản lý operational risks: delivery, resources, quality, vendor',
  'Quy trình xử lý khủng hoảng': 'Quy trình crisis management: escalation, communication, resolution',
  'Xử lý escalation lớn': 'Xử lý major escalations: rapid response, root cause, prevention',
  'Giải quyết vấn đề khẩn cấp của khách hàng': 'Giải quyết urgent issues: triage, war room, resolution',
  'Hỗ trợ post-mortem': 'Post-mortem facilitation: learnings, action items, knowledge sharing',
  'Sáng kiến cải thiện chất lượng dịch vụ': 'Service quality initiatives: feedback analysis, process improvements',
  'Mô hình hóa năng lực': 'Modeling capacity: utilization targets, buffer, scenarios',
  'Tối ưu nguồn lực dự phòng': 'Tối ưu bench capacity, cross-training, cost efficiency',
  'Giải thưởng làm việc lâu năm': 'Recognition cho long service: milestones, awards, celebrations',
  'Giao tiếp nội bộ hiệu quả': 'Internal communication strategy: channels, cadence, transparency',
  'Quản lý làm việc remote': 'Remote work policies: tools, norms, work-life balance',
  'Dự báo tuyển dụng dựa trên pipeline': 'Dự báo hiring needs từ pipeline, timelines',
  'Chịu trách nhiệm về margin': 'Đảm bảo margins: pricing, cost control, monitoring',
  'Ngân sách hàng năm': 'Lập ngân sách hàng năm: inputs, assumptions, approval',
  'Sáng kiến tối ưu chi phí': 'Cost optimization: vendor negotiations, efficiency, waste reduction',
  'Phê duyệt chi tiêu': 'Spending approvals: authority matrix, workflows, tracking',
  'Quyết định & phê duyệt pricing': 'Pricing decisions: analysis, benchmarking, margins',
  'Báo cáo lợi nhuận dự án': 'Báo cáo project profitability, lessons learned',
  'Quản lý tranh chấp khách hàng': 'Giải quyết disputes: negotiation, mediation, litigation',
  'Đàm phán hợp đồng khách hàng': 'Đàm phán client contracts: terms, risks, IP',
  'Xử lý tranh chấp pháp lý': 'Xử lý disputes: assessment, settlement, litigation',
};

let content = fs.readFileSync(roadmapPath, 'utf-8');
let updated = 0;

Object.entries(improvements).forEach(([title, newDesc]) => {
  // Find title and replace description
  const pattern = new RegExp(
    `(title: '${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',\\s*description: ')[^']+(',)`,
    'g'
  );

  const before = content;
  content = content.replace(pattern, `$1${newDesc}$2`);

  if (content !== before) {
    updated++;
    console.log(`✓ "${title}"`);
  } else {
    console.log(`⚠️  "${title}"`);
  }
});

fs.writeFileSync(roadmapPath, content, 'utf-8');

console.log(`\n✓ Done! Updated ${updated}/${Object.keys(improvements).length} descriptions`);
console.log(`Total updated (39 + ${updated}) = ${39 + updated}/64`);
